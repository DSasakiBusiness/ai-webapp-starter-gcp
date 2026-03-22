---
name: design-gcp-architecture
description: GCP 上のアプリケーションアーキテクチャ設計手順
---

# design-gcp-architecture

## この skill を使う場面
- GCP 上の構成を新規設計するとき
- gcp-platform-engineer がインフラ構成を決定するとき

## 入力前提
- アプリケーションの非機能要件（可用性、スケーラビリティ、コスト）
- 想定トラフィック

## 実行手順

### 1. スターター構成の選定
```
Cloud Run (web) ← Next.js standalone
Cloud Run (api) ← NestJS
Cloud SQL       ← PostgreSQL 16 (db-f1-micro)
Secret Manager  ← 機密情報
Artifact Registry ← Docker イメージ
Cloud Monitoring ← 監視・アラート
```

### 2. リージョンの決定
- デフォルト: `asia-northeast1`（東京）
- マルチリージョンは初期構成では不要

### 3. コスト見積もり
| サービス | 月額目安 |
|---------|---------|
| Cloud Run (web) | $0-5（0-1 インスタンス、CPU 使用時のみ課金） |
| Cloud Run (api) | $0-10 |
| Cloud SQL (db-f1-micro) | $10-15 |
| Secret Manager | $0.06/シークレット/月 |
| Artifact Registry | $0.10/GB |
| **合計** | **$15-35** |

### 4. ネットワーク設計
- Cloud Run はパブリックインターネットに公開
- Cloud SQL は Cloud Run からのみ接続（Cloud SQL Auth Proxy 経由）
- Secret Manager は IAM で制御

### 5. スケーリング設定
```yaml
web:
  min-instances: 0
  max-instances: 5
  cpu: 1
  memory: 1Gi
api:
  min-instances: 0
  max-instances: 10
  cpu: 1
  memory: 1Gi
  cpu-boost: true
```

## 判断ルール
- 初期構成は最小限に抑える（YAGNI）
- Cloud Run で対応できないケース（WebSocket 長時間接続等）が出たら GKE を検討
- auto-scaling の max-instances は予算に応じて設定

## 出力形式
- GCP 構成図（Mermaid / テキスト）
- コスト見積もり
- IAM ロール一覧

## 注意点
- エンタープライズ構成にしない（スターター向き）
- VPC やロードバランサーは初期構成では不要

## 失敗時の扱い
- コスト超過: min-instances を 0 に、max-instances を下げる
- パフォーマンス不足: CPU ブースト有効化、メモリ増加、max-instances 増加
