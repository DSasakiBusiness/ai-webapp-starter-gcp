# =============================================================================
# ai-webapp-starter-gcp Makefile
# Docker ベースの開発コマンド集
# =============================================================================

.PHONY: help setup up down restart logs build clean \
        db-migrate db-generate db-seed db-studio db-reset \
        test test-unit test-integration test-e2e \
        lint format

# --- デフォルト ---
help: ## このヘルプを表示
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'

# =============================================================================
# セットアップ・起動
# =============================================================================

setup: ## 初回セットアップ（.env コピー、ビルド、マイグレーション、シード）
	@if [ ! -f .env ]; then cp .env.example .env && echo "✅ .env を作成しました"; fi
	docker compose build
	docker compose up -d db redis
	@echo "⏳ DB の起動を待機中..."
	@sleep 5
	docker compose run --rm api sh -c "cd apps/api && npx prisma migrate deploy && npx prisma db seed"
	docker compose up -d
	@echo "✅ セットアップ完了 → http://localhost:3000"

up: ## 全サービス起動
	docker compose up -d

down: ## 全サービス停止
	docker compose down

restart: ## 全サービス再起動
	docker compose restart

logs: ## ログ表示（全サービス）
	docker compose logs -f

logs-api: ## API ログ表示
	docker compose logs -f api

logs-web: ## Web ログ表示
	docker compose logs -f web

build: ## コンテナ再ビルド
	docker compose build --no-cache

clean: ## コンテナ・ボリューム全削除
	docker compose down -v --remove-orphans
	docker system prune -f

# =============================================================================
# データベース
# =============================================================================

db-migrate: ## Prisma マイグレーション実行
	docker compose exec api sh -c "cd apps/api && npx prisma migrate dev"

db-migrate-deploy: ## Prisma マイグレーションデプロイ（本番向け）
	docker compose exec api sh -c "cd apps/api && npx prisma migrate deploy"

db-generate: ## Prisma Client 生成
	docker compose exec api sh -c "cd apps/api && npx prisma generate"

db-seed: ## シードデータ投入
	docker compose exec api sh -c "cd apps/api && npx prisma db seed"

db-studio: ## Prisma Studio 起動（ブラウザで DB 閲覧）
	docker compose exec api sh -c "cd apps/api && npx prisma studio"

db-reset: ## DB リセット（全データ削除 → マイグレーション → シード）
	docker compose exec api sh -c "cd apps/api && npx prisma migrate reset --force"

# =============================================================================
# テスト
# =============================================================================

test: ## 全テスト実行
	docker compose exec api sh -c "npm run test"

test-unit: ## Unit テスト実行
	docker compose exec api sh -c "npm run test:unit"

test-integration: ## Integration テスト実行
	docker compose exec api sh -c "npm run test:integration"

test-e2e: ## E2E テスト実行（Playwright）
	npx playwright test --config=tests/e2e/playwright.config.ts

# =============================================================================
# コード品質
# =============================================================================

lint: ## リント実行
	docker compose exec api sh -c "npm run lint"
	docker compose exec web sh -c "npm run lint"

format: ## フォーマット実行
	npx prettier --write "**/*.{ts,tsx,js,jsx,json,md}"

# =============================================================================
# GCP デプロイ
# =============================================================================

deploy-api: ## API を GCP Cloud Run にデプロイ
	@echo "⚠️  GCP_PROJECT_ID と GCP_REGION を .env に設定してください"
	@echo "手順: make build-api-prod → gcloud run deploy"
	@echo "詳細は docs/architecture.md を参照"

build-api-prod: ## API 本番イメージビルド
	docker build -f apps/api/Dockerfile -t aiwebapp-api:latest .

build-web-prod: ## Web 本番イメージビルド
	docker build -f apps/web/Dockerfile -t aiwebapp-web:latest .
