---
name: configure-gcp-secrets
description: GCP Secret Manager でのシークレット管理手順
---

# configure-gcp-secrets

## この skill を使う場面
- 本番環境のシークレットを初期登録するとき
- シークレットの更新・ローテーションを行うとき

## 入力前提
- GCP プロジェクトが作成済み
- Secret Manager API が有効化済み

## 実行手順

### 1. 必要なシークレットの一覧
| シークレット名 | 説明 | 必須 |
|--------------|------|------|
| `DATABASE_URL` | Prisma 接続文字列 | ✅ |
| `JWT_SECRET` | JWT 署名キー | ✅ |
| `NEXTAUTH_SECRET` | NextAuth 署名キー | ✅ |
| `OPENAI_API_KEY` | OpenAI API キー | ✅（AI 機能使用時） |
| `CORS_ORIGIN` | 許可オリジン | ✅ |

### 2. シークレットの作成
```bash
# DATABASE_URL
echo -n "postgresql://app_user:STRONG_PASSWORD@localhost/ai_webapp?host=/cloudsql/PROJECT:REGION:INSTANCE" | \
  gcloud secrets create DATABASE_URL --data-file=-

# JWT_SECRET (ランダム生成)
openssl rand -base64 32 | gcloud secrets create JWT_SECRET --data-file=-

# NEXTAUTH_SECRET (ランダム生成)
openssl rand -base64 32 | gcloud secrets create NEXTAUTH_SECRET --data-file=-

# OPENAI_API_KEY
echo -n "sk-..." | gcloud secrets create OPENAI_API_KEY --data-file=-
```

### 3. アクセス権限の付与
```bash
# Cloud Run ランタイム SA にアクセス権限を付与
RUNTIME_SA=$(gcloud iam service-accounts list --filter="displayName:Compute Engine default" --format="value(email)")

gcloud secrets add-iam-policy-binding DATABASE_URL \
  --member="serviceAccount:${RUNTIME_SA}" \
  --role="roles/secretmanager.secretAccessor"

# 他のシークレットにも同様に付与
for secret in JWT_SECRET NEXTAUTH_SECRET OPENAI_API_KEY; do
  gcloud secrets add-iam-policy-binding ${secret} \
    --member="serviceAccount:${RUNTIME_SA}" \
    --role="roles/secretmanager.secretAccessor"
done
```

### 4. シークレットの更新
```bash
# 新しいバージョンの追加
echo -n "新しい値" | gcloud secrets versions add DATABASE_URL --data-file=-

# Cloud Run の再起動（新シークレットの反映）
gcloud run services update aiwebapp-api \
  --region=asia-northeast1 \
  --update-env-vars=RESTART_TRIGGER=$(date +%s)
```

## 判断ルール
- すべての機密情報は Secret Manager で管理（環境変数にハードコードしない）
- DATABASE_URL は `@localhost` プレースホルダーを含める（Prisma + Cloud SQL 互換）
- シークレットのバージョンは `:latest` を使用（Cloud Run の `--set-secrets` で指定）

## 出力形式
- 登録されたシークレットの一覧確認

## 注意点
- シークレットの値をログや画面に出力しない
- `gcloud secrets versions access` で値を確認できるが、ターミナル履歴に残る点に注意

## 失敗時の扱い
- アクセス拒否: SA に `roles/secretmanager.secretAccessor` が付与されているか確認
- Cloud Run でシークレットが反映されない: `RESTART_TRIGGER` 環境変数の更新でインスタンスを強制リフレッシュ
