# ai-webapp-starter-gcp

AI 特化 Web サービスの開発スターターリポジトリ。  
Next.js + NestJS + Prisma + LLM + Docker + GCP を基盤とし、Claude Code のエージェント・スキルを本格活用する。

## 想定ユースケース

- AI チャットアプリケーション
- RAG (検索拡張生成) ベースのナレッジベース
- AI を活用した業務支援ツール
- LLM を使ったコンテンツ生成サービス

## 技術スタック

| レイヤー | 技術 |
|---------|------|
| フロントエンド | Next.js (App Router, standalone) |
| バックエンド | NestJS |
| ORM | Prisma (PostgreSQL) |
| AI | OpenAI SDK + RAG (optional) |
| キャッシュ | Redis |
| ローカル開発 | Docker Compose |
| クラウド | GCP (Cloud Run, Cloud SQL, Secret Manager) |
| CI/CD | GitHub Actions |
| テスト | Jest (unit/integration), Playwright (E2E) |
| セキュリティ検証 | PentAGI (ステージング限定) |

## ディレクトリ構成

```
ai-webapp-starter-gcp/
├── .claude/
│   ├── CLAUDE.md                    # プロジェクト横断ルール
│   ├── agents/
│   │   ├── engineering/
│   │   │   ├── frontend-developer.md
│   │   │   ├── backend-developer.md
│   │   │   ├── ai-engineer.md
│   │   │   └── gcp-platform-engineer.md
│   │   ├── product/
│   │   │   ├── product-manager.md
│   │   │   └── solution-architect.md
│   │   └── testing/
│   │       ├── qa-reviewer.md
│   │       ├── tdd-coach.md
│   │       ├── e2e-tester.md
│   │       └── security-reviewer.md
│   └── skills/
│       ├── common/                  # 21 skills
│       └── gcp/                     # 5 skills
├── apps/
│   ├── web/                         # Next.js フロントエンド
│   │   ├── Dockerfile               # 本番用
│   │   ├── Dockerfile.dev           # 開発用
│   │   └── src/app/
│   └── api/                         # NestJS バックエンド
│       ├── Dockerfile               # 本番用
│       ├── Dockerfile.dev           # 開発用
│       ├── prisma/                  # Prisma スキーマ + シード
│       └── src/
│           ├── llm/                 # LLM 統合モジュール
│           └── prisma/              # Prisma サービス
├── packages/
│   └── shared/                      # 共通型定義
├── tests/
│   ├── unit/
│   ├── integration/
│   └── e2e/                         # Playwright
├── infra/
│   └── gcp/                         # Cloud Build 設定
├── .github/
│   └── workflows/                   # CI/CD
│       ├── ci.yml
│       ├── deploy-api.yml
│       └── deploy-web.yml
├── docs/
│   ├── architecture.md
│   └── development.md
├── docker-compose.yml
├── Makefile
└── README.md
```

## Agents 一覧

| Agent | カテゴリ | 役割 |
|-------|---------|------|
| product-manager | product | 要件定義・MVP 判断 |
| solution-architect | product | 全体設計・責務境界 |
| frontend-developer | engineering | Next.js UI 実装 |
| backend-developer | engineering | NestJS API 実装 |
| ai-engineer | engineering | LLM/RAG 統合 |
| gcp-platform-engineer | engineering | GCP 固有の設計・デプロイ |
| qa-reviewer | testing | 品質レビュー |
| tdd-coach | testing | TDD プロセス管理 |
| e2e-tester | testing | Playwright E2E |
| security-reviewer | testing | セキュリティ・PentAGI |

## Skills 一覧

### Common (21)
| Skill | 概要 |
|-------|------|
| clarify-product-requirements | 要件整理 |
| define-mvp | MVP 定義 |
| implement-nextjs-ui | Next.js UI 実装 |
| implement-nestjs-api | NestJS API 実装 |
| implement-prisma-schema | Prisma スキーマ管理 |
| integrate-llm-feature | LLM 統合 |
| build-rag-pipeline | RAG パイプライン構築 |
| tdd-feature-delivery | TDD 機能開発 |
| e2e-readiness-pipeline | E2E テスト準備 |
| review-security-with-pentagi | PentAGI セキュリティ検証 |
| run-ai-evals | AI 品質評価 |
| review-ai-output-quality | AI 出力品質レビュー |
| review-performance | パフォーマンスレビュー |
| write-api-contract | API コントラクト定義 |
| generate-ui-spec | UI 仕様書生成 |
| secure-release-pipeline | セキュアリリース |
| setup-pentagi-scan | PentAGI スキャン設定 |
| review-release-readiness | リリース判断 |
| clarify-ai-requirements | AI 要件整理 |
| clarify-test-scope | テスト範囲整理 |
| setup-docker-dev-environment | Docker 環境構築 |
| run-tests-in-docker | Docker テスト実行 |
| manage-prisma-in-docker | Docker 上 Prisma 管理 |

### GCP (5)
| Skill | 概要 |
|-------|------|
| design-gcp-architecture | GCP 構成設計 |
| deploy-to-gcp | Cloud Run デプロイ |
| setup-gcp-ci-cd | CI/CD 構築 |
| configure-gcp-secrets | Secret Manager 設定 |
| monitor-on-gcp | 監視・アラート設定 |

## 初回セットアップ

### 前提条件
- Docker Desktop
- Node.js 20+
- Git

### セットアップ手順

```bash
# 1. リポジトリのクローン
git clone <repository-url>
cd ai-webapp-starter-gcp

# 2. 環境変数の設定
cp .env.example .env
# .env を編集（最低限 OPENAI_API_KEY を設定）

# 3. Docker で全サービスを起動
make setup

# → http://localhost:3000 (Web)
# → http://localhost:3001/api/docs (Swagger)
```

## Docker Compose

### サービス構成

| サービス | ポート | 用途 |
|---------|--------|------|
| web | 3000 | Next.js フロントエンド |
| api | 3001 | NestJS バックエンド |
| db | 5432 | PostgreSQL 16 |
| redis | 6379 | Redis 7 |

### 主要コマンド

```bash
make up          # 全サービス起動
make down        # 全サービス停止
make restart     # 再起動
make logs        # ログ表示
make logs-api    # API ログのみ
make build       # コンテナ再ビルド
make clean       # 全削除
```

## データベース操作

```bash
make db-migrate       # マイグレーション作成・適用
make db-generate      # Prisma Client 再生成
make db-seed          # シードデータ投入
make db-studio        # Prisma Studio (DB 閲覧)
make db-reset         # DB リセット
```

## テスト実行

```bash
make test             # 全テスト
make test-unit        # Unit テスト
make test-integration # Integration テスト
make test-e2e         # E2E テスト (Playwright)
```

## E2E テスト (Playwright)

```bash
# Playwright のインストール
npx playwright install chromium

# テスト実行
make test-e2e

# UI モード（デバッグ用）
npx playwright test --config=tests/e2e/playwright.config.ts --ui
```

## PentAGI セキュリティレビュー

> ⚠️ **本番環境に対して絶対に実行しないでください**

PentAGI はステージングまたは隔離環境に限定して使用します。

```bash
# 隔離ネットワークの作成
docker network create --internal pentagi-isolated

# PentAGI の起動（隔離環境）
docker run -d --name pentagi-scanner --network=pentagi-isolated pentagi/scanner:latest

# スキャン実行（ステージング環境のみ）
# 詳細は .claude/skills/common/review-security-with-pentagi/SKILL.md を参照
```

**重要:**
- 誤検知を前提とし、人間による再確認を必須とする
- 結果は critical / high / medium / low で分類する
- 検証対象: API、認証、入力バリデーション、LLM 固有の攻撃面

## GCP デプロイ

### アーキテクチャ
```
Cloud Run (web)  ← Next.js standalone
Cloud Run (api)  ← NestJS
Cloud SQL        ← PostgreSQL 16
Secret Manager   ← 機密情報
Artifact Registry ← Docker イメージ
```

### デプロイ手順（概要）
1. GCP プロジェクト作成・API 有効化
2. Secret Manager にシークレット登録（`configure-gcp-secrets` skill）
3. Cloud SQL インスタンス作成
4. Artifact Registry リポジトリ作成
5. Docker イメージビルド・プッシュ
6. Cloud Run にデプロイ

詳細は `infra/gcp/README.md` と `.claude/skills/gcp/deploy-to-gcp/SKILL.md` を参照。

## CI/CD

GitHub Actions による自動化:

| ワークフロー | トリガー | 内容 |
|-------------|---------|------|
| `ci.yml` | push, PR | lint → unit test → integration test → E2E test |
| `deploy-api.yml` | main の `apps/api/**` 変更 | API を Cloud Run にデプロイ |
| `deploy-web.yml` | main の `apps/web/**` 変更 | Web を Cloud Run にデプロイ |

### 必要な GitHub Secrets
| Secret | 説明 |
|--------|------|
| `GCP_PROJECT_ID` | GCP プロジェクト ID |
| `GCP_SA_KEY` | サービスアカウント JSON キー |
| `CLOUDSQL_CONNECTION` | Cloud SQL 接続名 |
| `API_URL` | API の本番 URL |
| `WEB_URL` | Web の本番 URL |

## 拡張方法

### 新しい API エンドポイントの追加
1. `tdd-coach` の指示に従い受け入れ条件を定義
2. `implement-nestjs-api` skill でモジュールを作成
3. `packages/shared/src/types` に型を追加
4. Unit テスト → Integration テスト → E2E テストの順にテストを追加

### 新しい AI 機能の追加
1. `clarify-ai-requirements` skill で要件を具体化
2. `integrate-llm-feature` skill でプロンプト設計・実装
3. `run-ai-evals` skill で品質を評価

### 新しいページの追加
1. `generate-ui-spec` skill で UI 仕様を定義
2. `implement-nextjs-ui` skill でコンポーネントを実装
3. `data-testid` を付与して E2E テストに対応

## 注意点

- `.env` ファイルは絶対にコミットしない
- PentAGI は本番環境に対して実行しない
- `any` 型の使用は禁止
- LLM の出力はサニタイズしてからユーザーに表示する
- Secret はコード内にハードコードしない
- テストなしでのマージは禁止

## ライセンス

MIT
