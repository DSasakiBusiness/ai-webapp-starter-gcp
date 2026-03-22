---
name: review-performance
description: アプリケーションのパフォーマンスレビュー手順
---

# review-performance

## この skill を使う場面
- リリース前のパフォーマンス確認
- パフォーマンス低下が報告されたとき

## 入力前提
- アプリケーションが起動している（Docker 環境）
- パフォーマンス目標（デフォルト: API p95 < 500ms）

## 実行手順

### 1. API レスポンス時間の計測
```bash
# ヘルスチェック
curl -w "@curl-format.txt" -o /dev/null -s http://localhost:3001/api/health

# 主要エンドポイント
curl -w "%{time_total}s\n" -o /dev/null -s -X POST http://localhost:3001/api/llm/complete \
  -H "Content-Type: application/json" \
  -d '{"prompt":"テスト"}'
```

### 2. DB クエリの確認
- Prisma の `$queryRawUnsafe` が使われていないことを確認
- N+1 クエリがないことを確認（`include` の適切な使用）
- 大量データのクエリにページネーションが設定されていることを確認

### 3. フロントエンドのパフォーマンス
- Lighthouse スコアの確認（Performance > 80）
- 不要な Client Component がないか確認
- 画像の最適化（next/image の使用）

### 4. メモリ使用量
```bash
docker stats --no-stream
```

## 判断ルール
- API p95 > 500ms（LLM 呼び出し除く）: 改善必須
- Lighthouse Performance < 60: リリースブロック
- メモリ使用量がコンテナ制限の 80% 超: 対策必須

## 出力形式
- パフォーマンスレポート（Markdown テーブル形式）

## 注意点
- LLM 呼び出しを含むエンドポイントはレスポンス時間の基準が異なる（10秒以内が目安）

## 失敗時の扱い
- パフォーマンス目標未達: ボトルネックを特定し、キャッシュ導入 / クエリ最適化 / コンポーネント分割で対応
