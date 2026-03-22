---
name: generate-ui-spec
description: UI 仕様書を生成する手順
---

# generate-ui-spec

## この skill を使う場面
- 新しい画面の実装前に UI 仕様を定義するとき
- frontend-developer が設計を文書化するとき

## 入力前提
- 要件ドキュメント（`clarify-product-requirements` の出力）
- API コントラクト（`write-api-contract` の出力）

## 実行手順

### 1. 画面一覧の作成
```markdown
| 画面 | パス | 認証 | 概要 |
|------|------|------|------|
| ログイン | /login | 不要 | メールとパスワードでログイン |
| ダッシュボード | /dashboard | 必要 | 会話一覧の表示 |
| チャット | /chat/[id] | 必要 | AI とのチャット画面 |
```

### 2. 各画面の仕様定義
```markdown
## 画面: チャット (/chat/[id])

### コンポーネント構成
- ChatHeader（会話タイトル）
- MessageList（メッセージ一覧）
  - UserMessage（ユーザーメッセージ）
  - AssistantMessage（AI メッセージ + ローディング）
- ChatInput（入力フォーム + 送信ボタン）

### 状態
- messages: ChatMessage[]
- isLoading: boolean
- error: string | null

### インタラクション
1. メッセージ入力 → 送信ボタンクリック
2. ローディング表示
3. AI 応答表示 または エラー表示 + 再試行ボタン

### data-testid 一覧
- chat-input, send-button, loading-indicator
- user-message, assistant-message
- error-message, retry-button
```

## 判断ルール
- すべてのインタラクティブ要素に `data-testid` を定義する
- エラー状態と空状態を必ず定義する

## 出力形式
- UI 仕様書（Markdown）

## 注意点
- デザイントークン（色、フォントサイズ）はこの段階で決めなくても良い

## 失敗時の扱い
- 仕様の漏れ: 実装中に発見されたら仕様書を更新する
