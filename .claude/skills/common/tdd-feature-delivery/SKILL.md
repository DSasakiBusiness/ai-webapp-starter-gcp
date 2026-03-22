---
name: tdd-feature-delivery
description: TDD (Red → Green → Refactor) による機能開発の実行手順
---

# tdd-feature-delivery

## この skill を使う場面
- 新機能の実装を開始するとき
- tdd-coach がテストファースト開発を指導するとき

## 入力前提
- 受け入れ条件（Given / When / Then）
- テストケース一覧

## 実行手順

### Phase 1: Red（失敗するテストを書く）

1. 受け入れ条件からテストケースを導出する
2. テストファイルを作成する
3. テストを実行し、**失敗することを確認する**

```typescript
// apps/api/src/[module]/[module].service.spec.ts
describe('XxxService', () => {
  describe('createXxx', () => {
    it('有効な入力でXxxを作成できる', async () => {
      const result = await service.createXxx({ name: 'テスト' });
      expect(result).toBeDefined();
      expect(result.name).toBe('テスト');
    });

    it('名前が空の場合にエラーを返す', async () => {
      await expect(service.createXxx({ name: '' }))
        .rejects.toThrow('名前は必須です');
    });
  });
});
```

4. 実行:
```bash
make test-unit  # ❌ 失敗することを確認
```

### Phase 2: Green（最小実装で通す）

1. テストを通す最小限のコードを書く
2. 実装のきれいさは気にしない（後でリファクタリングする）

```bash
make test-unit  # ✅ 通ることを確認
```

### Phase 3: Refactor（リファクタリング）

1. コードの重複を排除する
2. 命名を改善する
3. 不要なコードを削除する
4. テストが引き続き通ることを確認する

```bash
make test-unit  # ✅ 通ることを確認
```

### Phase 4: テスト種別の振り分け

| テスト種別 | 対象 | 例 |
|-----------|------|-----|
| Unit | ビジネスロジック | サービスのメソッド、バリデーション |
| Integration | API + DB | エンドポイントのレスポンス、DB 操作 |
| E2E | ユーザーシナリオ | ログイン→操作→結果確認 |

## 判断ルール
- テストを書かずに実装を始めたら差し戻す
- テストが最初から成功する場合は、テストの条件が甘い（テストを修正）
- AI 機能のテスト: 文字一致ではなく構造検証（JSON スキーマ、必須フィールド）
- カバレッジ 80% 未満の PR は不合格

## 出力形式
- テストファイル（`.spec.ts`）→ 実装ファイル（`.ts`）の順で作成

## 注意点
- 外部依存（DB、LLM API）は Unit テストではモックする
- テストの独立性を保つ（他テストの結果に依存しない）

## 失敗時の扱い
- テストが Flaky: 共有状態の排除、時間依存の排除
- カバレッジ不足: 不足箇所を特定し、テスト追加を指示
- テストが複雑になりすぎ: テスト対象の設計を見直す（依存の注入が不足している可能性）
