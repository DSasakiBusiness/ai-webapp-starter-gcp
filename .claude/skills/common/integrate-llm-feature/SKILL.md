---
name: integrate-llm-feature
description: LLM (大規模言語モデル) 機能をアプリケーションに統合する手順
---

# integrate-llm-feature

## この skill を使う場面
- 新しい AI 機能を追加するとき
- ai-engineer が LLM 統合方針を定義するとき

## 入力前提
- AI 機能の要件（`clarify-ai-requirements` の出力があれば）
- 使用するモデル（デフォルト: GPT-4o）
- 期待する入出力の形式

## 実行手順

### 1. プロンプト設計
```typescript
// apps/api/src/llm/prompts/[feature-name].prompt.ts
export const FEATURE_SYSTEM_PROMPT = `
あなたは[役割]です。
以下のルールに従ってください:
1. [ルール1]
2. [ルール2]
出力形式: [JSON / テキスト / Markdown]
`;
```

### 2. サービスメソッドの追加
```typescript
// apps/api/src/llm/llm.service.ts に追加
async featureName(input: FeatureInput): Promise<FeatureOutput> {
  const result = await this.completeWithRetry({
    prompt: input.userMessage,
    systemPrompt: FEATURE_SYSTEM_PROMPT,
    maxTokens: 2048,
    temperature: 0.3, // 事実ベースなら低め
  });

  // レスポンスのパースとバリデーション
  const parsed = this.parseResponse(result.content);
  if (!this.validateOutput(parsed)) {
    throw new Error('LLM 出力のバリデーションに失敗');
  }

  // トークン使用量のログ記録
  await this.logUsage(result.usage);

  return parsed;
}
```

### 3. 出力のサニタイズ
- LLM の出力はそのまま返さない
- HTML タグの除去またはエスケープ
- JSON の場合はスキーマバリデーション
- プロンプトリークの防止（System プロンプトの内容が出力に含まれていないか確認）

### 4. エラーハンドリング
- API エラー: リトライ（指数バックオフ、最大3回）
- 空応答: フォールバックメッセージを返す
- バリデーション失敗: 再試行またはデフォルト値を返す
- トークン超過: MAX_TOKENS の調整、入力の切り詰め

### 5. テスト
- Unit テスト: LLM 呼び出しをモック。レスポンスのパース・バリデーションロジックをテスト
- Integration テスト: テスト用 API キーで実際の呼び出しを検証（CI ではスキップ可）

## 判断ルール
- 温度設定: 事実回答 0.0-0.3、分類タスク 0.0、創造的タスク 0.5-0.8
- MAX_TOKENS: 必要最小限に設定（コスト最適化）
- プロンプト: 構造化プロンプトを使用。目的 → ルール → 出力形式の順

## 出力形式
- `apps/api/src/llm/prompts/[feature].prompt.ts` — プロンプト定義
- `apps/api/src/llm/llm.service.ts` — サービスメソッド追加
- `apps/api/src/[module]/[module].controller.ts` — エンドポイント追加

## 注意点
- API キーは環境変数で管理する（`.env` / Secret Manager）
- トークン使用量を `ApiUsageLog` テーブルに記録する
- プロンプトインジェクション対策を実装する

## 失敗時の扱い
- LLM が利用不可: `isAvailable()` でチェックし、利用不可なら適切なエラーメッセージを返す
- コスト超過: MAX_TOKENS の引き下げ、キャッシュ戦略、低コストモデルへの切り替え
- 品質低下: プロンプトの改善、Few-shot Examples の追加、モデルアップグレード
