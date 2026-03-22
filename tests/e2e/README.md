# E2E テスト方針

## 対象
- ログインフロー
- 基本 CRUD（会話の作成・閲覧・削除）
- AI 機能呼び出し（チャット送信 → AI 応答表示）
- エラー時の表示（API エラー、LLM タイムアウト）
- 再試行導線
- 権限制御（管理者と一般ユーザーの画面差分）

## ルール
- **Playwright** を使用する
- **壊れにくいセレクター**を使う（`data-testid` 推奨、文言固定を避ける）
- テスト前にシードデータを投入する
- 認証状態は `storageState` で管理する
- 各テストは独立して実行可能であること

## ディレクトリ構成
```
tests/e2e/
├── playwright.config.ts
├── specs/
│   ├── auth.spec.ts       # ログイン・ログアウト
│   ├── chat.spec.ts       # AI チャット機能
│   ├── crud.spec.ts       # 基本 CRUD
│   └── error.spec.ts      # エラーハンドリング
├── fixtures/
│   └── auth.fixture.ts    # 認証ヘルパー
└── helpers/
    └── seed.ts            # テスト用シード
```

## 実行方法
```bash
# ローカル（Docker サービスが起動している前提）
make test-e2e

# CI
npx playwright test --config=tests/e2e/playwright.config.ts

# UI モード（デバッグ用）
npx playwright test --config=tests/e2e/playwright.config.ts --ui
```

## セレクター指針
```typescript
// ✅ 良い例
page.getByTestId('chat-input')
page.getByRole('button', { name: /送信/ })

// ❌ 悪い例
page.locator('.css-1a2b3c')
page.locator('text=こんにちは、AI アシスタントさん。')
```

## 前提データ
- 管理者: `admin@example.com`
- テストユーザー: `user@example.com`
- サンプル会話が1件存在する
