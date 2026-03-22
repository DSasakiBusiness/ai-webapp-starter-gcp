---
name: secure-release-pipeline
description: セキュリティを考慮したリリースパイプラインの実行手順
---

# secure-release-pipeline

## この skill を使う場面
- 本番環境へのリリース準備
- security-reviewer がリリース前の最終セキュリティチェックを行うとき

## 入力前提
- 全テスト（unit / integration / E2E）がパスしていること
- セキュリティスキャン結果（`review-security-with-pentagi` の出力）

## 実行手順

### 1. 依存関係の監査
```bash
npm audit --production
```
- critical / high の脆弱性がゼロであることを確認

### 2. 機密情報の確認
- `.env` ファイルがコミットされていないこと
- ハードコードされた API キー / パスワードがないこと
- `git log --all --full-history -S "password"` で機密情報の履歴を確認

### 3. Docker イメージの確認
- 非 root ユーザーで実行されていること
- 不要なファイル（`.env`, `node_modules 開発依存`）が含まれていないこと
- ベースイメージが最新パッチ適用済みであること

### 4. チェックリスト
- [ ] npm audit に critical / high がない
- [ ] 機密情報がコミットされていない
- [ ] PentAGI スキャンで critical / high がない
- [ ] Docker イメージが非 root で実行される
- [ ] CORS が適切に制限されている
- [ ] JWT の有効期限が適切
- [ ] LLM 出力がサニタイズされている

## 判断ルール
- チェックリストがすべて合格: リリース承認
- 1つでも不合格: リリースブロック

## 出力形式
- リリースセキュリティチェック結果（Markdown チェックリスト形式）

## 注意点
- このチェックは CI パイプラインの最終ステップとして自動化を目指す

## 失敗時の扱い
- critical 脆弱性: 即修正してから再チェック
- 機密情報のコミット: `git filter-branch` または `BFG Repo-Cleaner` で履歴から削除
