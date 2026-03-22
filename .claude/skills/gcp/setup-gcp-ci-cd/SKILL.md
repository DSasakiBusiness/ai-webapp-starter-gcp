---
name: setup-gcp-ci-cd
description: GitHub Actions から GCP Cloud Run への CI/CD パイプライン構築手順
---

# setup-gcp-ci-cd

## この skill を使う場面
- CI/CD パイプラインを初めて構築するとき
- gcp-platform-engineer が自動デプロイを設定するとき

## 入力前提
- GCP プロジェクトが作成済み
- GitHub リポジトリが存在
- `.github/workflows/deploy-api.yml` と `deploy-web.yml` がテンプレートとして存在

## 実行手順

### 1. GCP サービスアカウントの作成
```bash
# SA の作成
gcloud iam service-accounts create github-actions \
  --display-name="GitHub Actions Deployer"

# 必要なロールの付与
for role in roles/run.admin roles/artifactregistry.writer roles/iam.serviceAccountUser roles/secretmanager.secretAccessor roles/cloudsql.client; do
  gcloud projects add-iam-policy-binding ${PROJECT_ID} \
    --member="serviceAccount:github-actions@${PROJECT_ID}.iam.gserviceaccount.com" \
    --role="${role}"
done

# JSON キーの生成
gcloud iam service-accounts keys create gcp-sa-key.json \
  --iam-account=github-actions@${PROJECT_ID}.iam.gserviceaccount.com
```

### 2. GitHub Secrets の設定
GitHub リポジトリの Settings → Secrets and variables → Actions に以下を登録:

| Secret Name | 値 |
|------------|-----|
| `GCP_PROJECT_ID` | GCP プロジェクト ID |
| `GCP_SA_KEY` | `gcp-sa-key.json` の内容（JSON 文字列） |
| `CLOUDSQL_CONNECTION` | Cloud SQL 接続名（`project:region:instance`） |
| `API_URL` | API の本番 URL |
| `WEB_URL` | Web の本番 URL |

### 3. ワークフローの確認
- `.github/workflows/ci.yml` → 全ブランチで lint + テスト
- `.github/workflows/deploy-api.yml` → main の `apps/api/**` 変更で API デプロイ
- `.github/workflows/deploy-web.yml` → main の `apps/web/**` 変更で Web デプロイ

### 4. 初回実行テスト
```bash
git push origin main
# GitHub Actions のログで成功を確認
```

### 5. セキュリティクリーンアップ
```bash
# ローカルの SA キーを削除
rm gcp-sa-key.json
# .gitignore に追記済みであることを確認
grep "gcp-sa-key.json" .gitignore
```

## 判断ルール
- Workload Identity Federation (WIF) が推奨だが、初期セットアップは SA キーでも可
- SA キーは GitHub Secrets にのみ保管し、ローカルからは削除
- `roles/artifactregistry.admin` が必要な場合は `writer` を `admin` に昇格

## 出力形式
- CI/CD パイプラインの設定完了確認
- 初回デプロイの成功確認

## 注意点
- SA キーをコミットしない（`.gitignore` に記載済み）
- `gcloud auth configure-docker` + `docker login` の二重認証パターンを使用（信頼性向上）

## 失敗時の扱い
- Permission denied (Artifact Registry): SA に `roles/artifactregistry.admin` を付与
- Secret scope エラー: Repository Secrets と Environment Secrets の違いを確認
- Project ID 不一致: `${{ secrets.GCP_PROJECT_ID }}` がマスクされていないか確認
