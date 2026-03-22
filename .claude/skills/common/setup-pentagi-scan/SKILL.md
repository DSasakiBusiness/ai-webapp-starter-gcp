---
name: setup-pentagi-scan
description: PentAGI スキャン環境の初期構築手順
---

# setup-pentagi-scan

## この skill を使う場面
- PentAGI を初めてセットアップするとき
- スキャン環境を再構築するとき

## ⚠️ 安全上の厳守事項
- 本番環境に接続しない
- 隔離された Docker ネットワーク内で実行する
- 実行前にターゲット環境の管理者に通知する

## 入力前提
- Docker がインストールされていること
- ステージング環境の接続情報

## 実行手順

### 1. 隔離ネットワークの作成
```bash
docker network create --internal pentagi-isolated
```

### 2. PentAGI コンテナの起動
```bash
docker run -d \
  --name pentagi-scanner \
  --network=pentagi-isolated \
  -p 8088:8088 \
  pentagi/scanner:latest
```

### 3. 設定ファイルの作成
```yaml
# pentagi-scan-config.yml
target:
  base_url: https://staging.example.com
  environment: staging
auth:
  type: bearer
  token: ${STAGING_AUTH_TOKEN}
scan_types:
  - api_security
  - authentication
  - input_validation
  - llm_injection
```

### 4. 接続テスト
```bash
curl http://localhost:8088/health
```

## 判断ルール
- `environment: staging` であることを必ず確認する
- `production` や本番 URL が設定されていたら即中止

## 出力形式
- PentAGI の起動確認結果

## 注意点
- PentAGI のバージョンを固定する（`:latest` は開発時のみ）
- スキャン完了後はコンテナを停止・削除する

## 失敗時の扱い
- コンテナが起動しない: Docker のリソース（メモリ、ディスク）を確認
- ネットワーク接続エラー: `pentagi-isolated` ネットワークの設定を確認
