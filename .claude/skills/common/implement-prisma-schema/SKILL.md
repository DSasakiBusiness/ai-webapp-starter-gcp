---
name: implement-prisma-schema
description: Prisma スキーマの変更・マイグレーション管理手順
---

# implement-prisma-schema

## この skill を使う場面
- データモデルの追加・変更が必要なとき
- backend-developer がスキーマを変更するとき

## 入力前提
- 変更対象のデータモデルの要件
- 既存の `apps/api/prisma/schema.prisma`

## 実行手順

### 1. スキーマの編集
`apps/api/prisma/schema.prisma` を編集する。規約:
- テーブル名は `@@map("snake_case_plural")` で明示
- カラム名は `@map("snake_case")` で明示
- `id` は `@id @default(cuid())` を使用
- `createdAt` / `updatedAt` は必ず付与
- インデックスは `@@index([column])` で明示
- リレーションの `onDelete` を明示する（`Cascade` / `SetNull` / `Restrict`）

### 2. マイグレーションの作成
```bash
# Docker 環境
make db-migrate
# → 対話的にマイグレーション名を入力
# 例: add_xxx_table, add_yyy_column_to_xxx
```

### 3. Prisma Client の再生成
```bash
make db-generate
```

### 4. シードの更新
必要に応じて `apps/api/prisma/seed.ts` を更新し、新テーブルのサンプルデータを追加する。

### 5. 型定義の更新
`packages/shared/src/types/index.ts` にフロントエンドで使う型を追加する。

## 判断ルール
- 破壊的変更（カラム削除、型変更）は段階的に行う（新カラム追加 → データ移行 → 旧カラム削除）
- NULL 許容は明示的に判断する。デフォルトは NOT NULL
- enum は Prisma の `enum` を使用する
- JSON カラムは型安全性が低いため、最後の手段とする

## 出力形式
- 更新された `apps/api/prisma/schema.prisma`
- 新規マイグレーションファイル（`prisma/migrations/[timestamp]_[name]/`）
- 更新された `packages/shared/src/types/index.ts`（必要な場合）

## 注意点
- マイグレーションファイルは手動で編集しない
- `prisma db push` は開発初期のプロトタイプのみ。本番はマイグレーション必須
- Docker 内で実行する場合は `manage-prisma-in-docker` skill を参照

## 失敗時の扱い
- マイグレーション競合: `prisma migrate resolve --rolled-back [migration_name]` で対処
- データロス警告: 破壊的変更を段階的に分割する
- スキーマドリフト: `prisma migrate diff` で差分を確認し、`prisma migrate deploy` で同期
