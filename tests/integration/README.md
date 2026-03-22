# Integration テスト方針

## 対象
- API エンドポイントの結合テスト（コントローラー + サービス + DB）
- Prisma を使った DB 操作の検証
- 認証・認可フローのテスト
- LLM サービスの統合テスト（テスト用 API キーを使用）

## ルール
- テスト用の PostgreSQL を使用する（Docker Compose のテスト用サービスまたはテスト DB）
- テスト実行前に DB をリセット＋シードする
- 各テストは独立して実行可能であること
- テスト終了後にデータをクリーンアップする

## ディレクトリ構成
```
tests/integration/
├── api/
│   ├── auth.integration.spec.ts
│   ├── llm.integration.spec.ts
│   └── health.integration.spec.ts
└── setup/
    ├── global-setup.ts
    └── global-teardown.ts
```

## 実行方法
```bash
# ローカル（DB が起動している前提）
npm run test:integration

# Docker
make test-integration
```

## 注意事項
- テスト用のデータベースを本番と分離すること
- LLM を使う Integration テストは `OPENAI_API_KEY` が設定されている場合のみ実行する
- CI 環境では LLM テストをスキップするか、モック化する
