---
name: monitor-on-gcp
description: GCP Cloud Monitoring を使った監視・アラート設定手順
---

# monitor-on-gcp

## この skill を使う場面
- 本番環境の監視を設定するとき
- gcp-platform-engineer がアラートを構築するとき

## 入力前提
- Cloud Run サービスがデプロイ済み
- Cloud SQL インスタンスが稼働中

## 実行手順

### 1. Cloud Logging の確認
```bash
# API のログ確認
gcloud logging read "resource.type=cloud_run_revision AND resource.labels.service_name=aiwebapp-api" \
  --limit=50 --format="table(timestamp, severity, textPayload)"

# エラーログの抽出
gcloud logging read "resource.type=cloud_run_revision AND severity>=ERROR" \
  --limit=20
```

### 2. カスタムダッシュボードの作成
GCP Console → Monitoring → Dashboards → Create Dashboard で以下を追加:
- Cloud Run リクエスト数（time series）
- Cloud Run レスポンスレイテンシー（p50, p95, p99）
- Cloud Run インスタンス数
- Cloud SQL CPU 使用率
- Cloud SQL 接続数
- Cloud SQL ストレージ使用量

### 3. アラートポリシーの設定
| アラート | 条件 | 通知 |
|---------|------|------|
| API エラー率 | 5xx エラー率 > 5% (5分間) | メール / Slack |
| API レイテンシー | p95 > 5秒 (5分間) | メール |
| DB CPU 高負荷 | CPU > 80% (10分間) | メール / Slack |
| DB ストレージ残量 | 残り < 20% | メール |
| インスタンス数上限 | max-instances に到達 | メール |

```bash
# CLI でアラートポリシーを作成する例
gcloud monitoring policies create \
  --display-name="API High Error Rate" \
  --condition-display-name="5xx errors > 5%" \
  --condition-filter='resource.type="cloud_run_revision" AND metric.type="run.googleapis.com/request_count" AND metric.labels.response_code_class="5xx"' \
  --condition-threshold-value=5 \
  --condition-threshold-comparison=COMPARISON_GT \
  --condition-threshold-duration=300s \
  --notification-channels=${NOTIFICATION_CHANNEL_ID}
```

### 4. ヘルスチェックの外部監視
```bash
# Uptime Check の作成
gcloud monitoring uptime create \
  --display-name="API Health Check" \
  --uri="https://aiwebapp-api-xxxxxx.run.app/api/health" \
  --period=300 \
  --timeout=10
```

### 5. コスト監視
- Billing → Budgets & alerts で月間予算アラートを設定
- 推奨: $30, $50, $100 の3段階アラート

## 判断ルール
- 初期構成では最低限のアラート（エラー率、DB CPU、ストレージ）を設定
- 通知頻度が多すぎる場合: 閾値を調整（ノイズ削減）
- SLA 目標: 99.5%（Cloud Run の標準 SLA）

## 出力形式
- ダッシュボードの設定完了確認
- アラートポリシーの一覧

## 注意点
- アラートの通知先を事前に設定しておく（メール / Slack webhook）
- ログの保持期間（デフォルト 30 日）を確認

## 失敗時の扱い
- アラートが発報されない: 通知チャンネルの設定を確認
- ログが多すぎてコスト増: ログフィルター（除外パターン）を設定
- ダッシュボードが空: Cloud Run のメトリクスが収集開始されるまで数分待つ
