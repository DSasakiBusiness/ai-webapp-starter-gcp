---
name: deploy-to-gcp
description: GCP Cloud Run へのデプロイ手順
---

# deploy-to-gcp

## この skill を使う場面
- 手動で Cloud Run にデプロイするとき
- gcp-platform-engineer がデプロイを実施するとき

## 入力前提
- GCP プロジェクトが作成済み
- 必要な API が有効化済み
- Artifact Registry リポジトリが作成済み
- Secret Manager にシークレットが登録済み（`configure-gcp-secrets` skill 完了済み）

## 実行手順

### 1. Docker イメージのビルド
```bash
# API
docker build -f apps/api/Dockerfile \
  -t asia-northeast1-docker.pkg.dev/${PROJECT_ID}/app-images/api:latest .

# Web
docker build -f apps/web/Dockerfile \
  --build-arg NEXT_PUBLIC_API_URL=https://api.example.com \
  -t asia-northeast1-docker.pkg.dev/${PROJECT_ID}/app-images/web:latest .
```

### 2. イメージのプッシュ
```bash
# Docker 認証
gcloud auth configure-docker asia-northeast1-docker.pkg.dev --quiet

# プッシュ
docker push asia-northeast1-docker.pkg.dev/${PROJECT_ID}/app-images/api:latest
docker push asia-northeast1-docker.pkg.dev/${PROJECT_ID}/app-images/web:latest
```

### 3. DB マイグレーション
```bash
# Cloud SQL Auth Proxy でローカルからマイグレーション
cloud-sql-proxy ${CONNECTION_NAME} --port 5433 &
DATABASE_URL="postgresql://user:pass@localhost:5433/ai_webapp" npx prisma migrate deploy
```

### 4. Cloud Run デプロイ
```bash
# API
gcloud run deploy aiwebapp-api \
  --image=asia-northeast1-docker.pkg.dev/${PROJECT_ID}/app-images/api:latest \
  --region=asia-northeast1 \
  --allow-unauthenticated \
  --set-secrets=DATABASE_URL=DATABASE_URL:latest,JWT_SECRET=JWT_SECRET:latest,OPENAI_API_KEY=OPENAI_API_KEY:latest \
  --add-cloudsql-instances=${CONNECTION_NAME} \
  --cpu-boost \
  --memory=1Gi \
  --set-env-vars=CORS_ORIGIN=https://web.example.com

# Web
gcloud run deploy aiwebapp-web \
  --image=asia-northeast1-docker.pkg.dev/${PROJECT_ID}/app-images/web:latest \
  --region=asia-northeast1 \
  --allow-unauthenticated \
  --set-env-vars=NEXT_PUBLIC_API_URL=https://api.example.com,NEXTAUTH_URL=https://web.example.com \
  --set-secrets=NEXTAUTH_SECRET=NEXTAUTH_SECRET:latest \
  --cpu-boost \
  --memory=1Gi
```

### 5. デプロイ確認
```bash
# サービスの URL 取得
gcloud run services describe aiwebapp-api --region=asia-northeast1 --format='value(status.url)'
gcloud run services describe aiwebapp-web --region=asia-northeast1 --format='value(status.url)'

# ヘルスチェック
curl ${API_URL}/api/health
```

## 判断ルール
- 初回デプロイはマイグレーション → API → Web の順序
- Secret Manager のマッピングが正しいことを確認してからデプロイ
- `CORS_ORIGIN` を本番 URL に設定することを忘れない

## 出力形式
- デプロイ結果（Cloud Run サービスの URL）

## 注意点
- `NEXTAUTH_URL` を Cloud Run の URL に設定する（リダイレクトエラー防止）
- Prisma の DATABASE_URL は `@localhost` プレースホルダーが必要（Cloud SQL ソケット接続時）
- `--add-cloudsql-instances` を忘れると DB 接続できない

## 失敗時の扱い
- TCP probe failed: メモリ増加（1Gi → 2Gi）、タイムアウト延長、PORT 環境変数確認
- Secret アクセス拒否: ランタイム SA に `roles/secretmanager.secretAccessor` を付与
- DB 接続エラー: DATABASE_URL の形式確認、Cloud SQL インスタンスの関連付け確認
- CORS エラー: CORS_ORIGIN に正しいフロントエンド URL を設定
