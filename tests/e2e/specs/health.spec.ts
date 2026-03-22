import { test, expect } from '@playwright/test';

/**
 * 基本動作確認 E2E テスト
 *
 * スターターリポジトリが正常に動作していることを確認する最小限のテスト。
 * Docker Compose で全サービスが起動済みであることが前提。
 */
test.describe('トップページ', () => {
  test('トップページが正常に表示される', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/AI WebApp/);
  });

  test('ページにスタック一覧が表示される', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByTestId('stack-list')).toBeVisible();
  });

  test('ページにクイックスタートが表示される', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByTestId('quickstart-section')).toBeVisible();
  });
});

test.describe('API ヘルスチェック', () => {
  test('API のヘルスチェックが正常なレスポンスを返す', async ({ request }) => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
    const response = await request.get(`${apiUrl}/api/health`);

    expect(response.ok()).toBeTruthy();

    const body = await response.json();
    expect(body.status).toBe('ok');
    expect(body).toHaveProperty('timestamp');
    expect(body).toHaveProperty('version');
  });

  test('LLM ステータスエンドポイントが応答する', async ({ request }) => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
    const response = await request.get(`${apiUrl}/api/llm/status`);

    expect(response.ok()).toBeTruthy();

    const body = await response.json();
    expect(body).toHaveProperty('available');
    expect(typeof body.available).toBe('boolean');
  });
});

test.describe('API バリデーション', () => {
  test('空のプロンプトで 400 エラーを返す', async ({ request }) => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
    const response = await request.post(`${apiUrl}/api/llm/complete`, {
      data: { prompt: '' },
    });

    expect(response.status()).toBe(400);
  });
});

test.describe('ナビゲーション', () => {
  test('API リンクが存在する', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByTestId('api-links')).toBeVisible();
  });
});
