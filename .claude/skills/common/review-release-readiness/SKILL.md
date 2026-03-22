---
name: review-release-readiness
description: リリース前の全体的な準備状況を確認する手順
---

# review-release-readiness

## この skill を使う場面
- リリース判断を行うとき
- product-manager がリリース可否を決定するとき

## 入力前提
- テスト結果（unit / integration / E2E）
- セキュリティスキャン結果
- パフォーマンスレビュー結果

## 実行手順

### 1. リリースチェックリスト
- [ ] 全 Unit テストが通過
- [ ] 全 Integration テストが通過
- [ ] 全 E2E テストが通過
- [ ] セキュリティスキャンに critical / high がない
- [ ] npm audit に critical / high がない
- [ ] パフォーマンス目標を達成
- [ ] API コントラクトが更新済み
- [ ] Swagger ドキュメントが最新
- [ ] .env.example が更新済み
- [ ] Prisma マイグレーションが作成済み
- [ ] README が更新済み
- [ ] Docker イメージが正常にビルドできる

### 2. 判定
すべてのチェック項目が合格: リリース承認
1つでも不合格: リリースブロック（不合格項目を対応後に再判定）

## 判断ルール
- critical / high の問題は一切妥協しない
- medium / low は承認付きでリリース可

## 出力形式
- リリース判定結果（合格 / 不合格 + 理由）

## 注意点
- リリース後のロールバック手順も確認する

## 失敗時の扱い
- 不合格の場合: 不合格項目を修正し、再度チェックを実施
