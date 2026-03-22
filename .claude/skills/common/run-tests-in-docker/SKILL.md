---
name: run-tests-in-docker
description: Docker 環境内でテストを実行する手順
---

# run-tests-in-docker

## この skill を使う場面
- Docker 環境でテストを実行するとき
- CI 環境と同じ条件でローカルテストを実施したいとき

## 入力前提
- Docker Compose で全サービスが起動可能
- テストコードが存在

## 実行手順

### 1. サービスの起動
```bash
make up
```

### 2. Unit テスト
```bash
make test-unit
# → docker compose exec api sh -c "npm run test:unit"
```

### 3. Integration テスト
```bash
# DB が起動していることを確認
docker compose ps db

# テスト用 DB のリセット
make db-reset

# Integration テスト実行
make test-integration
```

### 4. E2E テスト
```bash
# 全サービスが起動していることを確認
docker compose ps

# Playwright のインストール（ホスト側）
npx playwright install chromium

# E2E テスト実行
make test-e2e
```

### 5. 全テスト実行
```bash
make test
```

## 判断ルール
- Unit テストは DB なしで実行可能（モックを使用）
- Integration テストは DB が必要（Docker の PostgreSQL を使用）
- E2E テストは全サービスが必要（web + api + db + redis）
- CI では GitHub Actions のサービスコンテナが同等の環境を提供

## 出力形式
- テスト実行結果（Jest / Playwright の出力）

## 注意点
- テスト実行前に DB リセットを忘れない（Integration テスト）
- E2E テストは Playwright をホスト側にインストールする必要がある

## 失敗時の扱い
- DB 接続エラー: `docker compose ps db` で状態確認。`make down && make up` で再起動
- テストが Flaky: テスト間の状態依存を排除する
- Playwright がインストールできない: `npx playwright install --with-deps` でシステム依存も含めてインストール
