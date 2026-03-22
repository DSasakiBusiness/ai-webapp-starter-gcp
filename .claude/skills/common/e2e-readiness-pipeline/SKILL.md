---
name: e2e-readiness-pipeline
description: Playwright E2E テストの設計・実装・安定化手順
---

# e2e-readiness-pipeline

## この skill を使う場面
- E2E テストを新規作成または改善するとき
- e2e-tester がテストを設計するとき

## 入力前提
- テスト対象のユーザーシナリオ
- テスト用シードデータ（`apps/api/prisma/seed.ts`）
- Docker Compose で全サービスが起動可能

## 実行手順

### 1. テスト環境の準備
```bash
# Docker で全サービスを起動
make up

# DB をリセット＋シード
make db-reset
```

### 2. 認証フィクスチャーの作成
```typescript
// tests/e2e/fixtures/auth.fixture.ts
import { test as base, Page } from '@playwright/test';

async function loginAs(page: Page, email: string, password: string) {
  await page.goto('/login');
  await page.getByTestId('email-input').fill(email);
  await page.getByTestId('password-input').fill(password);
  await page.getByTestId('login-button').click();
  await page.waitForURL('/dashboard');
}

export const test = base.extend<{ userPage: Page; adminPage: Page }>({
  userPage: async ({ browser }, use) => {
    const context = await browser.newContext();
    const page = await context.newPage();
    await loginAs(page, 'user@example.com', 'password');
    await use(page);
    await context.close();
  },
  adminPage: async ({ browser }, use) => {
    const context = await browser.newContext();
    const page = await context.newPage();
    await loginAs(page, 'admin@example.com', 'password');
    await use(page);
    await context.close();
  },
});
```

### 3. テスト作成ルール
```typescript
// tests/e2e/specs/chat.spec.ts
import { test } from '../fixtures/auth.fixture';
import { expect } from '@playwright/test';

test.describe('AI チャット機能', () => {
  test('メッセージを送信すると AI 応答が表示される', async ({ userPage }) => {
    await userPage.goto('/chat');
    await userPage.getByTestId('chat-input').fill('テストメッセージ');
    await userPage.getByTestId('send-button').click();

    // ローディング表示を確認
    await expect(userPage.getByTestId('loading-indicator')).toBeVisible();

    // AI 応答が表示されることを確認（内容の厳密チェックは避ける）
    await expect(userPage.getByTestId('assistant-message')).toBeVisible({
      timeout: 30000,
    });
  });

  test('API エラー時にエラーメッセージと再試行ボタンが表示される', async ({ userPage }) => {
    // API をモックしてエラーを返す
    await userPage.route('**/api/llm/complete', (route) =>
      route.fulfill({ status: 500, body: 'Internal Server Error' }),
    );

    await userPage.goto('/chat');
    await userPage.getByTestId('chat-input').fill('テスト');
    await userPage.getByTestId('send-button').click();

    await expect(userPage.getByTestId('error-message')).toBeVisible();
    await expect(userPage.getByTestId('retry-button')).toBeVisible();
  });
});
```

### 4. セレクター指針
| 優先度 | 方法 | 例 |
|--------|------|-----|
| 1 | `data-testid` | `getByTestId('chat-input')` |
| 2 | ARIA ロール | `getByRole('button', { name: /送信/ })` |
| 3 | テキスト（部分一致） | `getByText(/エラーが発生/)` |
| ❌ | CSS クラス | `locator('.css-xxx')` |
| ❌ | XPath | `locator('//div[@class="..."]')` |

### 5. 安定性のためのルール
- 固定 `sleep` は禁止。`waitFor*` / `expect().toBeVisible()` を使用
- テスト間で状態を共有しない
- アニメーションは `{ animations: 'disabled' }` で無効化
- ネットワーク待機: `waitForResponse` を使用

## 判断ルール
- テスト対象: ユーザーが頻繁に使う機能 > エッジケース
- AI 応答のアサーション: 表示の有無のみ。内容の厳密チェックは避ける
- テスト数: 1シナリオ 3-5 テストケースが目安

## 出力形式
- `tests/e2e/specs/*.spec.ts`
- `tests/e2e/fixtures/*.fixture.ts`

## 注意点
- CI 環境では `process.env.CI` でリトライを有効化
- スクリーンショットは失敗時のみ保存

## 失敗時の扱い
- Flaky テスト: 待機戦略の見直し → テスト間の状態分離 → アニメーション無効化
- タイムアウト: `test.setTimeout()` で個別延長。AI 機能は 30 秒以上を設定
- セレクター変更: `data-testid` の使用を徹底し、frontend-developer に追加を依頼
