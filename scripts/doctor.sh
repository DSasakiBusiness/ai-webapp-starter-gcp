#!/usr/bin/env bash
# ==============================================================================
# doctor.sh — 開発環境の前提条件チェック
# ==============================================================================
set -euo pipefail

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

errors=0

check() {
  local name="$1"
  local command="$2"
  local min_version="$3"

  if command -v "$command" &> /dev/null; then
    local version
    version=$($command --version 2>/dev/null | head -n1 | grep -oE '[0-9]+\.[0-9]+(\.[0-9]+)?' | head -n1)
    echo -e "${GREEN}✅ ${name}${NC} (${version:-unknown})"
  else
    echo -e "${RED}❌ ${name} が見つかりません。${min_version} 以上が必要です。${NC}"
    errors=$((errors + 1))
  fi
}

echo "🩺 開発環境チェックを開始します..."
echo ""

check "Docker" "docker" "20.0"
check "Docker Compose" "docker" "20.0"  # docker compose はサブコマンド
check "Node.js" "node" "20.0"
check "npm" "npm" "10.0"
check "Git" "git" "2.30"

# Docker Compose V2 チェック
if docker compose version &> /dev/null; then
  compose_version=$(docker compose version --short 2>/dev/null || echo "unknown")
  echo -e "${GREEN}✅ Docker Compose V2${NC} (${compose_version})"
else
  echo -e "${RED}❌ Docker Compose V2 が利用できません${NC}"
  errors=$((errors + 1))
fi

# Docker デーモンの稼働確認
if docker info &> /dev/null; then
  echo -e "${GREEN}✅ Docker デーモン稼働中${NC}"
else
  echo -e "${RED}❌ Docker デーモンが起動していません${NC}"
  errors=$((errors + 1))
fi

# .env ファイルの確認
echo ""
if [ -f .env ]; then
  echo -e "${GREEN}✅ .env ファイルが存在します${NC}"

  # OPENAI_API_KEY の設定確認
  if grep -q "OPENAI_API_KEY=" .env && ! grep -q "OPENAI_API_KEY=$" .env && ! grep -q "OPENAI_API_KEY=your-openai-api-key" .env; then
    echo -e "${GREEN}✅ OPENAI_API_KEY が設定されています${NC}"
  else
    echo -e "${YELLOW}⚠️  OPENAI_API_KEY が未設定です（AI 機能を使わない場合は問題ありません）${NC}"
  fi
else
  echo -e "${YELLOW}⚠️  .env ファイルがありません。'cp .env.example .env' を実行してください${NC}"
fi

# ポートの使用確認
echo ""
for port in 3000 3001 5432 6379; do
  if lsof -i ":${port}" &> /dev/null; then
    echo -e "${YELLOW}⚠️  ポート ${port} が使用中です${NC}"
  else
    echo -e "${GREEN}✅ ポート ${port} は空いています${NC}"
  fi
done

echo ""
if [ $errors -gt 0 ]; then
  echo -e "${RED}❌ ${errors} 件のエラーがあります。修正してからセットアップしてください。${NC}"
  exit 1
else
  echo -e "${GREEN}✅ 環境チェック完了。問題はありません。${NC}"
  echo ""
  echo "次のステップ: make setup"
fi
