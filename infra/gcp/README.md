# GCP インフラ構成

## 概要
このディレクトリには GCP 上でのデプロイに必要な設定ファイルを格納する。

## アーキテクチャ
```
Internet
  │
  ├─→ Cloud Run (web)  ← Next.js (standalone)
  │
  ├─→ Cloud Run (api)  ← NestJS
  │     │
  │     ├─→ Cloud SQL (PostgreSQL)
  │     ├─→ Secret Manager
  │     └─→ Cloud Storage (optional)
  │
  └─→ Artifact Registry ← Docker イメージ
```

## サービス一覧
| サービス | 用途 | リージョン |
|---------|------|-----------|
| Cloud Run (web) | フロントエンド | asia-northeast1 |
| Cloud Run (api) | バックエンド API | asia-northeast1 |
| Cloud SQL | PostgreSQL データベース | asia-northeast1 |
| Secret Manager | 機密情報管理 | グローバル |
| Artifact Registry | Docker イメージ保管 | asia-northeast1 |
| Cloud Build | CI/CD ビルド（オプション） | asia-northeast1 |
| Cloud Monitoring | 監視・アラート | グローバル |

## IAM ロール
### CI/CD サービスアカウント (`github-actions`)
- `roles/run.admin`
- `roles/artifactregistry.writer`
- `roles/iam.serviceAccountUser`
- `roles/secretmanager.secretAccessor`
- `roles/cloudsql.client`

### ランタイムサービスアカウント (Cloud Run デフォルト)
- `roles/secretmanager.secretAccessor`
- `roles/cloudsql.client`
- `roles/storage.objectAdmin`（Cloud Storage 使用時）

## 初期セットアップ手順
```bash
# 1. プロジェクト作成
gcloud projects create [PROJECT_ID]
gcloud config set project [PROJECT_ID]

# 2. 必要な API の有効化
gcloud services enable \
  run.googleapis.com \
  sqladmin.googleapis.com \
  secretmanager.googleapis.com \
  artifactregistry.googleapis.com \
  cloudbuild.googleapis.com

# 3. Artifact Registry リポジトリ作成
gcloud artifacts repositories create app-images \
  --repository-format=docker \
  --location=asia-northeast1

# 4. Cloud SQL インスタンス作成
gcloud sql instances create aiwebapp-db \
  --database-version=POSTGRES_16 \
  --tier=db-f1-micro \
  --region=asia-northeast1

# 5. データベース作成
gcloud sql databases create ai_webapp --instance=aiwebapp-db

# 6. ユーザー作成
gcloud sql users create app_user \
  --instance=aiwebapp-db \
  --password=[STRONG_PASSWORD]

# 7. Secret Manager にシークレット登録
echo -n "postgresql://app_user:[PASSWORD]@localhost/ai_webapp?host=/cloudsql/[CONNECTION_NAME]" | \
  gcloud secrets create DATABASE_URL --data-file=-
```
