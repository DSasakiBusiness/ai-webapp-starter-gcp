# CLAUDE.md — ai-webapp-starter-gcp

## このリポジトリの目的
AI 特化 Web サービスの開発スターターリポジトリ。Next.js + NestJS + Prisma + LLM + GCP を基盤とし、TDD、E2E テスト、Docker 開発、セキュリティレビューの仕組みを内包する。

## 技術スタック
| レイヤー | 技術 |
|---------|------|
| フロントエンド | Next.js (App Router, standalone) |
| バックエンド | NestJS |
| ORM | Prisma (PostgreSQL) |
| AI | OpenAI SDK (LLM 統合) + RAG (optional) |
| キャッシュ | Redis |
| ローカル開発 | Docker Compose |
| クラウド | GCP (Cloud Run, Cloud SQL, Secret Manager) |
| CI/CD | GitHub Actions |
| テスト | Jest (unit/integration), Playwright (E2E) |
| セキュリティ検証 | PentAGI (ステージング限定) |

## Agent の使い分け

### 判断主体としての Agent
Agent は「何をすべきか」を判断する存在。Skill は「どう実行するか」の手順。

| Agent | 責務 |
|-------|------|
| **product-manager** | 要件定義、MVP 判断、ユーザー価値の優先順位付け |
| **solution-architect** | 全体設計、責務境界、非機能要件、Docker/クラウド構成方針 |
| **frontend-developer** | Next.js UI の設計・実装判断 |
| **backend-developer** | NestJS API の設計・実装判断 |
| **ai-engineer** | LLM/RAG の統合設計、プロンプト設計、AI 品質評価 |
| **tdd-coach** | TDD プロセスの遵守、受け入れ条件の定義強制 |
| **qa-reviewer** | コード品質レビュー、品質観点のチェック |
| **e2e-tester** | E2E テスト設計、壊れにくいテスト戦略 |
| **security-reviewer** | セキュリティレビュー、PentAGI 検証の管理 |
| **gcp-platform-engineer** | GCP 固有の設計・デプロイ・監視 |

### 境界ルール
- **フロントエンド ↔ バックエンド**: API コントラクト（`packages/shared/src/types`）を境界とする
- **バックエンド ↔ AI**: LLM/RAG は `ai-engineer` が設計、実装は `backend-developer` が行う。`llm/` モジュール内に閉じる
- **共通 ↔ GCP**: GCP 固有の設計判断はすべて `gcp-platform-engineer` に委譲

## TDD の原則
1. **実装前に受け入れ条件を定義する**（tdd-coach が強制）
2. **まず失敗するテストを書く** (Red)
3. **最小実装で通す** (Green)
4. **リファクタリングする** (Refactor)
5. **unit / integration / E2E の責務を分ける**
   - **Unit**: ビジネスロジック、外部依存はモック
   - **Integration**: API エンドポイント + DB の結合
   - **E2E**: ユーザーシナリオの検証

## AI 機能の評価方針
- 厳密な文字一致で評価しない
- 以下の観点で評価する:
  - **構造**: JSON スキーマ準拠、必須フィールドの存在
  - **失敗時動作**: エラーメッセージの適切さ、フォールバック動作
  - **引用**: ソース情報の正確性（RAG 使用時）
  - **再試行**: リトライロジックの動作
  - **境界条件**: 空入力、長文入力、特殊文字への対応

## PentAGI の位置づけ
- **検証ツール**であり、開発エージェントではない
- **本番環境に対して実行しない**（絶対禁止）
- ステージングまたは隔離環境に限定する
- 結果は critical / high / medium / low で分類する
- 誤検知を前提とし、人間による再確認を必須とする
- 検証対象: API、認証、入力バリデーション、LLM 固有の攻撃面

## Docker 開発の原則
- ローカル開発は `docker compose up` で完結させる
- `Makefile` でコマンドを統一する
- 開発用 Dockerfile (`*.dev`) と本番用 Dockerfile を分離する
- ボリュームマウントでホットリロードを維持する
- DB 操作は `make db-*` で統一する

## GCP 固有の注意点
- Cloud Run は `PORT` 環境変数を使用する
- Secret Manager のマッピングは `--set-secrets` で行う
- Cloud SQL は Unix ソケット接続（`?host=/cloudsql/...`）を使用する
- Prisma の接続文字列で `@localhost` プレースホルダーが必要
- 32MiB のリクエストサイズ制限に注意
- コンテナは非 root ユーザーで実行する

## PR 時の確認観点
1. テストが通っているか（unit + integration + E2E）
2. 型安全性が保たれているか（strict モード）
3. API コントラクト（shared types）が更新されているか
4. Swagger アノテーションが追加されているか
5. 新しい環境変数が `.env.example` に追加されているか
6. Prisma スキーマ変更時にマイグレーションが作成されているか
7. LLM 呼び出しにリトライ・エラーハンドリングがあるか
8. セキュリティ上の懸念がないか

## 実装時の禁止事項
- `any` 型の使用
- テストなしでのマージ
- `.env` ファイルのコミット
- 本番 DB への直接クエリ
- LLM の出力をサニタイズせずに表示
- PentAGI の本番環境での実行
- Secret をコード内にハードコード

## Claude に依頼するときのルール
- 機能追加時は必ず `tdd-coach` のプロセスに従い、テストファーストで進める
- 設計判断が必要な場合は `solution-architect` に委譲する
- AI 関連の変更は `ai-engineer` の判断基準に従う
- GCP 関連の変更は `gcp-platform-engineer` に委譲する
- セキュリティに影響する変更は `security-reviewer` のレビューを通す

## 既存設計を壊さないための原則
- `packages/shared/src/types` の型を変更する場合は、影響範囲を確認する
- Prisma スキーマの変更は破壊的変更がないか確認する
- API エンドポイントの変更は後方互換性を維持する
- Docker Compose の変更は既存サービスに影響しないか確認する
- CI/CD ワークフローの変更は全ジョブが正常に動作するか確認する
