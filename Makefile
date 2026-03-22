# =============================================================================
# ai-webapp-starter-gcp Makefile
# Docker ベースの開発コマンド集
# =============================================================================

.PHONY: help setup up down restart logs build clean \
        db-migrate db-migrate-deploy db-generate db-seed db-studio db-reset \
        test test-unit test-integration test-e2e \
        lint format doctor \
        build-api-prod build-web-prod

# --- デフォルト ---
help: ## このヘルプを表示
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-22s\033[0m %s\n", $$1, $$2}'

# =============================================================================
# セットアップ・起動
# =============================================================================

doctor: ## 開発環境の前提条件チェック
	@bash scripts/doctor.sh

setup: ## 初回セットアップ（.env コピー、ビルド、マイグレーション、シード）
	@if [ ! -f .env ]; then cp .env.example .env && echo "✅ .env を作成しました（OPENAI_API_KEY を設定してください）"; fi
	docker compose build
	docker compose up -d db redis
	@echo "⏳ DB の起動を待機中..."
	@bash scripts/wait-for-it.sh localhost 5432 30
	@bash scripts/wait-for-it.sh localhost 6379 15
	docker compose run --rm api sh -c "cd apps/api && npx prisma generate && npx prisma migrate deploy && npx prisma db seed"
	docker compose up -d
	@echo ""
	@echo "✅ セットアップ完了"
	@echo "   Web:     http://localhost:3000"
	@echo "   API:     http://localhost:3001"
	@echo "   Swagger: http://localhost:3001/api/docs"

up: ## 全サービス起動
	docker compose up -d

down: ## 全サービス停止
	docker compose down

restart: ## 全サービス再起動
	docker compose restart

logs: ## ログ表示（全サービス, Ctrl+C で終了）
	docker compose logs -f

logs-api: ## API ログ表示
	docker compose logs -f api

logs-web: ## Web ログ表示
	docker compose logs -f web

logs-db: ## DB ログ表示
	docker compose logs -f db

build: ## コンテナ再ビルド（依存関係変更時）
	docker compose build --no-cache

clean: ## コンテナ・ボリューム全削除（⚠️ DB データも消える）
	docker compose down -v --remove-orphans
	@echo "✅ コンテナとボリュームを削除しました"

ps: ## コンテナの状態を表示
	docker compose ps

# =============================================================================
# データベース
# =============================================================================

db-migrate: ## Prisma マイグレーション作成・適用（開発用）
	docker compose exec api sh -c "cd apps/api && npx prisma migrate dev"

db-migrate-deploy: ## Prisma マイグレーションデプロイ（本番向け、既存ファイルのみ適用）
	docker compose exec api sh -c "cd apps/api && npx prisma migrate deploy"

db-generate: ## Prisma Client 再生成
	docker compose exec api sh -c "cd apps/api && npx prisma generate"

db-seed: ## シードデータ投入
	docker compose exec api sh -c "cd apps/api && npx prisma db seed"

db-studio: ## Prisma Studio 起動（http://localhost:5555 で DB 閲覧）
	docker compose exec api sh -c "cd apps/api && npx prisma studio"

db-reset: ## DB リセット（⚠️ 全データ削除 → マイグレーション → シード）
	@echo "⚠️  DB 内のすべてのデータが削除されます"
	docker compose exec api sh -c "cd apps/api && npx prisma migrate reset --force"

db-push: ## スキーマを直接適用（プロトタイプ用、マイグレーションファイルを生成しない）
	docker compose exec api sh -c "cd apps/api && npx prisma db push"

# =============================================================================
# テスト
# =============================================================================

test: ## 全テスト実行（unit + integration）
	docker compose exec api sh -c "npm run test"

test-unit: ## Unit テスト実行
	docker compose exec api sh -c "npm run test:unit"

test-integration: ## Integration テスト実行
	docker compose exec api sh -c "npm run test:integration"

test-e2e: ## E2E テスト実行（Playwright, ホスト側で実行）
	npx playwright test --config=tests/e2e/playwright.config.ts

test-cov: ## カバレッジ付きテスト実行
	docker compose exec api sh -c "npm run test:cov"

# =============================================================================
# コード品質
# =============================================================================

lint: ## リント実行（API + Web）
	docker compose exec api sh -c "npm run lint" || true
	docker compose exec web sh -c "npm run lint" || true

format: ## Prettier でフォーマット
	npx prettier --write "**/*.{ts,tsx,js,jsx,json,md,yml,yaml}"

format-check: ## Prettier のフォーマットチェック（CI 用）
	npx prettier --check "**/*.{ts,tsx,js,jsx,json,md,yml,yaml}"

# =============================================================================
# 本番ビルド
# =============================================================================

build-api-prod: ## API 本番イメージビルド
	docker build -f apps/api/Dockerfile -t aiwebapp-api:latest .
	@echo "✅ aiwebapp-api:latest をビルドしました"

build-web-prod: ## Web 本番イメージビルド
	docker build -f apps/web/Dockerfile -t aiwebapp-web:latest .
	@echo "✅ aiwebapp-web:latest をビルドしました"

build-all-prod: ## 全本番イメージビルド
	$(MAKE) build-api-prod
	$(MAKE) build-web-prod
