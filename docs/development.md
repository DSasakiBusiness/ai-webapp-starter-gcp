# 開発ガイド

## 前提条件
- Docker Desktop (または互換ツール)
- Node.js 20 以上
- Git

## ローカル開発の流れ

### 1. 初回セットアップ
```bash
git clone <repository-url>
cd ai-webapp-starter-gcp
make setup
```

### 2. 日常の開発
```bash
# サービス起動
make up

# ログ確認
make logs

# API ログのみ
make logs-api

# サービス停止
make down
```

### 3. データベース操作
```bash
# マイグレーション作成・適用
make db-migrate

# Prisma Client 再生成
make db-generate

# シードデータ投入
make db-seed

# DB 閲覧（Prisma Studio）
make db-studio

# DB リセット
make db-reset
```

### 4. テスト実行
```bash
# Unit テスト
make test-unit

# Integration テスト
make test-integration

# E2E テスト
make test-e2e
```

## コーディング規約

### TypeScript
- strict モード有効
- any 型の使用禁止
- 明示的な戻り値型の定義を推奨

### API 設計
- RESTful 原則に従う
- エンドポイントは `/api/` プレフィックス付き
- Swagger アノテーションを必ず付ける
- DTO でバリデーションする（class-validator）

### コミットメッセージ
```
feat: 新機能の説明
fix: バグ修正の説明
refactor: リファクタリングの説明
test: テストの追加・修正
docs: ドキュメントの変更
chore: ビルド・CI の変更
```

## トラブルシューティング

### Docker コンテナが起動しない
```bash
# コンテナの状態確認
docker compose ps

# ログ確認
docker compose logs

# クリーンビルド
make clean
make setup
```

### Prisma のマイグレーションエラー
```bash
# DB をリセットして再度マイグレーション
make db-reset
```

### ポートが使用中
```bash
# 使用中のポートを確認
lsof -i :3000
lsof -i :3001
lsof -i :5432
```
