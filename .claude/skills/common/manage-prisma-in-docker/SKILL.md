---
name: manage-prisma-in-docker
description: Docker 環境内での Prisma 操作（マイグレーション、シード、Studio）手順
---

# manage-prisma-in-docker

## この skill を使う場面
- Docker 環境でスキーマ変更を適用するとき
- シードデータを投入するとき
- Prisma Studio で DB を閲覧するとき

## 入力前提
- Docker Compose で db サービスが起動していること
- `apps/api/prisma/schema.prisma` が存在すること

## 実行手順

### 1. マイグレーション（開発）
```bash
# 新しいマイグレーションを作成して適用
make db-migrate
# → docker compose exec api sh -c "cd apps/api && npx prisma migrate dev"
# プロンプトでマイグレーション名を入力（例: add_xxx_table）
```

### 2. マイグレーション（本番デプロイ）
```bash
make db-migrate-deploy
# → docker compose exec api sh -c "cd apps/api && npx prisma migrate deploy"
# 既存のマイグレーションファイルを適用するのみ（新規作成しない）
```

### 3. Prisma Client の再生成
```bash
make db-generate
# → docker compose exec api sh -c "cd apps/api && npx prisma generate"
# スキーマ変更後に必ず実行する
```

### 4. シードデータの投入
```bash
make db-seed
# → docker compose exec api sh -c "cd apps/api && npx prisma db seed"
```

### 5. DB のリセット
```bash
make db-reset
# → docker compose exec api sh -c "cd apps/api && npx prisma migrate reset --force"
# ⚠️ 全データが削除される
```

### 6. Prisma Studio（DB 閲覧）
```bash
make db-studio
# → http://localhost:5555 でブラウザからアクセス
```

## 判断ルール
- 開発中: `prisma migrate dev` を使用（マイグレーションファイルを生成）
- 本番/ステージング: `prisma migrate deploy` を使用（既存ファイルを適用のみ）
- プロトタイプ段階: `prisma db push` も許容（マイグレーションファイルを生成しない）

## 出力形式
- マイグレーションファイル（`apps/api/prisma/migrations/[timestamp]_[name]/`）
- 更新された Prisma Client

## 注意点
- API コンテナが起動していないと exec できない
- `db-reset` は全データを削除するため、注意して実行する
- マイグレーションファイルは Git にコミットする

## 失敗時の扱い
- API コンテナが起動していない: `make up` で起動
- マイグレーション競合: `prisma migrate resolve` で対処
- DB 接続エラー: `docker compose ps db` で DB の healthcheck 状態を確認
