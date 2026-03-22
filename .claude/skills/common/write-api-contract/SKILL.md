---
name: write-api-contract
description: API コントラクト（型定義 + Swagger）の設計手順
---

# write-api-contract

## この skill を使う場面
- 新しい API エンドポイントを設計するとき
- フロントエンドとバックエンドの接続仕様を合意するとき

## 入力前提
- 機能要件（`clarify-product-requirements` の出力）

## 実行手順

### 1. 型定義の追加
`packages/shared/src/types/index.ts` にリクエスト/レスポンス型を追加する。

### 2. エンドポイント仕様の定義
```markdown
## POST /api/conversations
### リクエスト
- Body: `CreateConversationRequest`
### レスポンス
- 201: `ApiResponse<ConversationSummary>`
- 400: `ApiError`（バリデーションエラー）
- 401: `ApiError`（未認証）
```

### 3. コントラクトのレビュー
- solution-architect の承認を得る
- frontend-developer と backend-developer で合意する

## 判断ルール
- RESTful 原則に従う（GET=取得、POST=作成、PUT=更新、DELETE=削除）
- ページネーションは `PaginatedResult<T>` を使用
- エラーは `ApiError` 型で統一

## 出力形式
- `packages/shared/src/types/index.ts` の型定義
- API 仕様書（Markdown）

## 注意点
- 既存の型を変更する場合は後方互換性を確認
- フロントエンドとバックエンドの両方に影響する

## 失敗時の扱い
- 型の不一致: TypeScript のコンパイルエラーで検出される。両方の実装を修正
