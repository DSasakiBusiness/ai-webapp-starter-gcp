---
name: setup-docker-dev-environment
description: Docker Compose を使ったローカル開発環境の構築手順
---

# setup-docker-dev-environment

## この skill を使う場面
- 新しい開発者がプロジェクトに参加するとき
- Docker 開発環境を再構築するとき

## 入力前提
- Docker Desktop がインストールされていること
- リポジトリがクローンされていること

## 実行手順

### 1. 環境変数の設定
```bash
cp .env.example .env
# .env を編集して必要な値を設定
# 最低限: OPENAI_API_KEY (AI 機能を使う場合)
```

### 2. 初回セットアップ
```bash
make setup
```
このコマンドは以下を実行する:
1. `.env` が存在しなければ `.env.example` からコピー
2. Docker イメージのビルド
3. DB と Redis の起動
4. Prisma マイグレーション
5. シードデータの投入
6. 全サービスの起動

### 3. サービスの確認
```bash
# コンテナの状態確認
docker compose ps

# ログ確認
make logs

# ブラウザでアクセス
# Web: http://localhost:3000
# API: http://localhost:3001
# Swagger: http://localhost:3001/api/docs
```

### 4. 日常の操作
```bash
make up       # 起動
make down     # 停止
make restart  # 再起動
make build    # 再ビルド（依存関係変更時）
make clean    # 全削除（再セットアップ時）
```

### 5. ホットリロードの確認
- `apps/api/src/` のファイルを変更 → API が自動再起動
- `apps/web/src/` のファイルを変更 → ブラウザが自動更新

## 判断ルール
- `package.json` の変更: `make build` で再ビルドが必要
- Prisma スキーマの変更: `make db-migrate` + `make db-generate`
- Docker 構成の変更: `make build` で再ビルド

## 出力形式
- 環境構築完了の確認（各サービスの稼働状態）

## 注意点
- ポート衝突（3000, 3001, 5432, 6379）がないか確認
- `.env` ファイルはコミットしない

## 失敗時の扱い
- ポート使用中: `lsof -i :PORT` で確認し、プロセスを停止
- ビルド失敗: `make clean` で全削除後、`make setup` で再構築
- DB 接続エラー: `docker compose ps` で DB の状態を確認。healthcheck が通っているか確認
