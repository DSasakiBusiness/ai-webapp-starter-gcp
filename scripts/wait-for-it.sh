#!/usr/bin/env bash
# ==============================================================================
# wait-for-it.sh — サービスの起動待ち
# 使い方: ./scripts/wait-for-it.sh <host> <port> [timeout_seconds]
# ==============================================================================
set -euo pipefail

HOST="${1:-localhost}"
PORT="${2:-5432}"
TIMEOUT="${3:-30}"

echo "⏳ ${HOST}:${PORT} の起動を待機中... (タイムアウト: ${TIMEOUT}秒)"

start_time=$(date +%s)

while true; do
  if nc -z "$HOST" "$PORT" 2>/dev/null; then
    echo "✅ ${HOST}:${PORT} に接続できました"
    exit 0
  fi

  current_time=$(date +%s)
  elapsed=$((current_time - start_time))

  if [ $elapsed -ge "$TIMEOUT" ]; then
    echo "❌ タイムアウト: ${HOST}:${PORT} に ${TIMEOUT}秒以内に接続できませんでした"
    exit 1
  fi

  sleep 1
done
