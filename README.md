# 🚀 ai-webapp-starter-gcp

AI 特化 Web サービスを **最速で本番投入する** ための開発スターターキット。  
Next.js + NestJS + Prisma + LLM + Docker + GCP を基盤とし、Claude Code のエージェント・スキルによるAI駆動開発をフル活用する。

---

## ✨ このスターターで得られるもの

| カテゴリ | 内容 |
|---------|------|
| **フルスタック基盤** | Next.js 15 (App Router) + NestJS + Prisma + PostgreSQL + Redis |
| **LLM 統合** | OpenAI SDK 組込み済み。リトライ・フォールバック・型安全な出力仕様 |
| **AI 設計パターン** | 8つの実戦的エージェントパターン（Plan-then-Execute、Budget-Aware Routing 等） |
| **Claude Code 統合** | 10 Agents + 26 Skills で AI 駆動開発をサポート |
| **テスト全層** | Unit (Jest) + Integration (supertest) + E2E (Playwright) の実体テスト付き |
| **品質 CLI ツール** | husky / lint-staged / commitlint / knip / cspell / madge / depcheck / ncu |
| **Docker 完全対応** | docker-compose で 4サービス一発起動。本番用 Dockerfile 付き |
| **GCP デプロイ** | Cloud Run + Cloud SQL + Secret Manager + GitHub Actions CI/CD |
| **セキュリティ** | グローバル例外フィルター、入力バリデーション、PentAGI 統合 |

---

## 📁 ディレクトリ構成

```
ai-webapp-starter-gcp/
├── .claude/                          # Claude Code 統合
│   ├── CLAUDE.md                     # プロジェクト横断ルール
│   ├── agents/                       # 10 AI エージェント定義
│   │   ├── engineering/              #   frontend / backend / ai / gcp
│   │   ├── product/                  #   product-manager / solution-architect
│   │   └── testing/                  #   qa / tdd / e2e / security
│   └── skills/                       # 26 スキル定義
│       ├── common/                   #   21 汎用スキル
│       └── gcp/                      #   5 GCP 固有スキル
│
├── apps/
│   ├── api/                          # NestJS バックエンド
│   │   ├── src/
│   │   │   ├── common/filters/       #   グローバル例外フィルター
│   │   │   ├── llm/                  #   LLM 統合（Controller / Service / DTO）
│   │   │   └── prisma/               #   Prisma サービス
│   │   ├── prisma/                   # スキーマ + マイグレーション + シード
│   │   └── Dockerfile / Dockerfile.dev
│   │
│   └── web/                          # Next.js フロントエンド
│       ├── src/
│       │   ├── app/                   #   App Router ページ
│       │   └── lib/                   #   型安全 API クライアント
│       └── Dockerfile / Dockerfile.dev
│
├── packages/
│   └── shared/                       # 共通型定義（API / Web 共有）
│
├── tests/
│   ├── unit/                         # Unit テスト
│   ├── integration/                  # Integration テスト（supertest）
│   └── e2e/                          # E2E テスト（Playwright）
│
├── scripts/
│   ├── doctor.sh                     # 開発環境チェック
│   └── wait-for-it.sh                # サービス起動待ち
│
├── infra/gcp/                        # Cloud Build 設定
├── .github/workflows/                # CI/CD（ci / deploy-api / deploy-web）
├── .husky/                           # Git フック（pre-commit / commit-msg）
├── docs/                             # アーキテクチャ・開発ガイド
│
├── docker-compose.yml                # ローカル開発環境
├── Makefile                          # 全操作の統一エントリポイント
├── commitlint.config.js              # コミットメッセージ規約
├── cspell.json                       # スペルチェック設定
├── knip.json                         # 未使用コード検出設定
├── .madgerc                          # 循環依存検出設定
├── .lintstagedrc.json                # pre-commit lint 設定
├── .prettierrc / .prettierignore     # コードフォーマット
└── tsconfig.base.json                # TypeScript 共通設定
```

---

## 🛠 技術スタック

### アプリケーション

| レイヤー | 技術 | バージョン |
|---------|------|-----------|
| フロントエンド | Next.js (App Router, standalone) | 15.x |
| バックエンド | NestJS | 10.x |
| ORM | Prisma (PostgreSQL) | 5.x |
| AI / LLM | OpenAI SDK | 4.x |
| キャッシュ | Redis | 7.x |
| 言語 | TypeScript | 5.6+ |

### インフラ & DevOps

| ツール | 用途 |
|-------|------|
| Docker Compose | ローカル開発（4サービス一発起動） |
| GCP Cloud Run | 本番コンテナ実行 |
| GCP Cloud SQL | 本番 PostgreSQL |
| GCP Secret Manager | シークレット管理 |
| GCP Artifact Registry | Docker イメージレジストリ |
| GitHub Actions | CI/CD パイプライン |
| Turborepo | モノレポビルド管理 |

### 品質管理ツール

| ツール | 用途 | 実行タイミング |
|-------|------|-------------|
| **husky** | Git フック基盤 | 自動（commit 時） |
| **lint-staged** | ステージ済みファイルの ESLint + Prettier | 自動（pre-commit） |
| **commitlint** | Conventional Commits 規約強制 | 自動（commit-msg） |
| **ESLint** | TypeScript / React リンター | `make lint` |
| **Prettier** | コードフォーマッター | `make format` |
| **knip** | 未使用ファイル・export・依存の検出 | `make knip` |
| **cspell** | コード内スペルチェック | `make spell` |
| **madge** | 循環依存の検出 | `make circular` |
| **depcheck** | 未使用 dependencies 検出 | `make depcheck` |
| **npm-check-updates** | 依存パッケージ更新チェック | `make ncu` |
| **sort-package-json** | package.json キーソート | `make sort-pkg` |

### テスト

| 種別 | ツール | 対象 |
|------|-------|------|
| Unit | Jest + ts-jest | AppService、LlmService |
| Integration | Jest + supertest | API エンドポイント検証 |
| E2E | Playwright | ブラウザからの全体フロー |
| AI 品質 | run-ai-evals skill | 構造・引用・境界条件の定量評価 |
| セキュリティ | PentAGI | ステージング環境のペネトレーションテスト |

---

## 🏗 API バックエンド機能

### 組込み済みモジュール

| モジュール | 内容 |
|-----------|------|
| **LLM 統合** | OpenAI SDK ラップ (`LlmService`) — `complete()` / `completeWithRetry()` / `isAvailable()` |
| **グローバル例外フィルター** | `GlobalExceptionFilter` で全 API エラーを `ApiError` 形式に統一 |
| **入力バリデーション** | `LlmCompletionDto` に class-validator（プロンプト長、温度範囲、トークン上限） |
| **Swagger API ドキュメント** | `/api/docs` で自動生成。全エンドポイントにレスポンス型定義 |
| **Prisma サービス** | PostgreSQL 接続管理。マイグレーション・シード対応 |
| **ヘルスチェック** | `/api/health` — サーバー稼働状態 + バージョン情報 |

### 組込み済み API エンドポイント

| メソッド | パス | 説明 |
|---------|------|------|
| GET | `/api/health` | ヘルスチェック |
| GET | `/api/llm/status` | LLM 接続状態 |
| POST | `/api/llm/complete` | LLM テキスト生成（バリデーション付き） |

---

## 🎨 Web フロントエンド機能

| 機能 | 内容 |
|------|------|
| **型安全 API クライアント** | `api-client.ts` — fetch ラッパーで `ApiResponse<T>` / `ApiError` を型安全に処理 |
| **data-testid 属性** | 全要素に E2E テスト用 ID を付与 |
| **メタデータ管理** | Next.js Metadata API でタイトル・説明を定義 |
| **App Router** | Next.js 15 の最新ルーティング対応 |

---

## 🤖 Claude Code 統合

### Agents（10体）

| Agent | カテゴリ | 役割 |
|-------|---------|------|
| product-manager | product | 要件定義・MVP 判断 |
| solution-architect | product | 全体設計・責務境界 |
| frontend-developer | engineering | Next.js UI 実装 |
| backend-developer | engineering | NestJS API 実装 |
| ai-engineer | engineering | LLM/RAG 統合 + 8設計パターン |
| gcp-platform-engineer | engineering | GCP 固有の設計・デプロイ |
| qa-reviewer | testing | 品質レビュー |
| tdd-coach | testing | TDD プロセス管理 |
| e2e-tester | testing | Playwright E2E |
| security-reviewer | testing | セキュリティ・PentAGI |

### Skills（26個）

<details>
<summary>Common Skills（21個）</summary>

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

</details>

<details>
<summary>GCP Skills（5個）</summary>

| Skill | 概要 |
|-------|------|
| design-gcp-architecture | GCP 構成設計 |
| deploy-to-gcp | Cloud Run デプロイ |
| setup-gcp-ci-cd | CI/CD 構築 |
| configure-gcp-secrets | Secret Manager 設定 |
| monitor-on-gcp | 監視・アラート設定 |

</details>

### AI 設計パターン（8種）

`ai-engineer` エージェントに組込み。[awesome-agentic-patterns](https://github.com/nibzard/awesome-agentic-patterns) 準拠。

| # | パターン | 必須/推奨 | 概要 |
|---|---------|----------|------|
| 1 | Structured Output Specification | 必須 | Zod / class-validator で AI 出力を型安全化 |
| 2 | Plan-then-Execute | 必須 | 計画→実行分離で成功率 40-70% 向上 |
| 3 | Budget-Aware Model Routing | 必須 | タスク複雑度でモデル動的ルーティング |
| 4 | Failover-Aware Model Fallback | 必須 | セマンティックエラー分類で自動切替 |
| 5 | Self-Critique Evaluator Loop | 推奨 | LLM 自己評価で品質ゲート |
| 6 | Hook-Based Safety Guard Rails | 必須 | PreToolUse/PostToolUse で安全チェック |
| 7 | LLM Observability | 必須 | スパントレーシング + コスト追跡 |
| 8 | Prompt Caching | 推奨 | プレフィックス固定で最大 43% コスト削減 |

---

## 🚀 クイックスタート

### 前提条件

- Docker Desktop（Docker Compose V2）
- Node.js 20+
- Git

```bash
# 環境チェック（推奨）
make doctor
```

### セットアップ

```bash
# 1. リポジトリのクローン
git clone <repository-url>
cd ai-webapp-starter-gcp

# 2. 環境変数の設定
cp .env.example .env
# .env を編集（最低限 OPENAI_API_KEY を設定）

# 3. Docker で全サービスを起動
make setup

# → http://localhost:3000        (Web)
# → http://localhost:3001/api/docs (Swagger)
```

---

## 🐳 Docker Compose

### サービス構成

| サービス | ポート | イメージ | 用途 |
|---------|--------|---------|------|
| web | 3000 | Node.js 20 | Next.js フロントエンド |
| api | 3001 | Node.js 20 | NestJS バックエンド |
| db | 5432 | PostgreSQL 16 | データベース |
| redis | 6379 | Redis 7 | キャッシュ |

### 主要コマンド

```bash
make up          # 全サービス起動
make down        # 全サービス停止
make restart     # 再起動
make logs        # ログ表示
make ps          # コンテナ状態確認
make build       # コンテナ再ビルド
make clean       # 全削除（ボリューム含む）
```

---

## 🗄 データベース操作

```bash
make db-migrate       # マイグレーション作成・適用
make db-generate      # Prisma Client 再生成
make db-seed          # シードデータ投入
make db-studio        # Prisma Studio（GUI でDB閲覧）
make db-reset         # DB リセット（全データ削除）
```

---

## 🧪 テスト

### テスト実行

```bash
make test             # 全テスト
make test-unit        # Unit テスト（Jest）
make test-integration # Integration テスト（supertest）
make test-e2e         # E2E テスト（Playwright）
```

### 含まれるテスト実体

| ファイル | 種別 | テスト対象 |
|---------|------|-----------|
| `apps/api/src/app.service.spec.ts` | Unit | ヘルスチェック応答の構造・値 |
| `apps/api/src/llm/llm.service.spec.ts` | Unit | LLM complete / retry / isAvailable |
| `tests/integration/app.controller.integration.spec.ts` | Integration | API エンドポイント（health / llm） |
| `tests/e2e/specs/health.spec.ts` | E2E | ホームページ + API 疎通 |

### E2E テスト (Playwright)

```bash
# Playwright のインストール
npx playwright install chromium

# テスト実行
make test-e2e

# UI モード（デバッグ用）
npx playwright test --config=tests/e2e/playwright.config.ts --ui
```

---

## ✅ コード品質

### 自動実行（Git フック）

- **pre-commit**: ステージ済みファイルに ESLint + Prettier を自動実行
- **commit-msg**: Conventional Commits 規約（`feat:`, `fix:`, `docs:` 等）を強制

### 手動実行

```bash
make quality      # 全品質チェック一括実行（format + spell + knip + circular）

make lint         # リント
make format       # フォーマット修正
make format-check # フォーマットチェック（CI用）
make spell        # スペルチェック
make knip         # 未使用コード検出
make circular     # 循環依存検出
make depcheck     # 未使用依存検出
make ncu          # 依存更新チェック
make sort-pkg     # package.json キーソート
```

### コミットメッセージ規約

```
feat: 新機能追加
fix: バグ修正
docs: ドキュメント変更
style: フォーマット変更（コードの意味変更なし）
refactor: リファクタリング
perf: パフォーマンス改善
test: テスト追加・修正
build: ビルドシステム変更
ci: CI 設定変更
chore: その他の変更
revert: リバート
```

---

## 🔐 セキュリティ

### 組込み済みの対策

| 対策 | 実装場所 |
|------|---------|
| グローバル例外フィルター | `apps/api/src/common/filters/http-exception.filter.ts` |
| 入力バリデーション | `apps/api/src/llm/dto/llm-completion.dto.ts` |
| CORS 設定 | `apps/api/src/main.ts` |
| 環境変数管理 | `.env` + Docker secrets |

### PentAGI セキュリティレビュー

> ⚠️ **本番環境に対して絶対に実行しないでください**

PentAGI はステージングまたは隔離環境に限定して使用します。

```bash
# 隔離ネットワークの作成
docker network create --internal pentagi-isolated

# PentAGI の起動（隔離環境）
docker run -d --name pentagi-scanner --network=pentagi-isolated pentagi/scanner:latest
```

---

## ☁️ GCP デプロイ

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

### 本番ビルド

```bash
make build-api-prod   # API イメージビルド
make build-web-prod   # Web イメージビルド
make build-all-prod   # 全イメージビルド
```

---

## 🔄 CI/CD

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

---

## 📖 拡張ガイド

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

---

## 📋 全 make コマンド一覧

```bash
make help             # ヘルプ表示

# --- 開発 ---
make setup            # 初回セットアップ（Docker起動 + DB準備）
make up / down        # サービス起動 / 停止
make restart          # 再起動
make logs             # ログ
make ps               # コンテナ状態
make build / clean    # ビルド / 全削除
make doctor           # 開発環境チェック

# --- データベース ---
make db-migrate / db-generate / db-seed / db-studio / db-reset

# --- テスト ---
make test / test-unit / test-integration / test-e2e

# --- コード品質 ---
make quality          # 一括チェック
make lint / format / format-check
make spell / knip / circular / depcheck / ncu / sort-pkg

# --- 本番ビルド ---
make build-api-prod / build-web-prod / build-all-prod
```

---

## ⚠️ 注意点

- `.env` ファイルは絶対にコミットしない
- PentAGI は本番環境に対して実行しない
- `any` 型の使用は禁止
- LLM の出力はサニタイズしてからユーザーに表示する
- Secret はコード内にハードコードしない
- テストなしでのマージは禁止
- コミットメッセージは Conventional Commits に従う

---

## 📄 ライセンス

MIT
