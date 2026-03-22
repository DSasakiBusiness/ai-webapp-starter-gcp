---
name: build-rag-pipeline
description: RAG (Retrieval-Augmented Generation) パイプラインの構築手順
---

# build-rag-pipeline

## この skill を使う場面
- ドキュメントベースの AI 質問応答機能を構築するとき
- ai-engineer が RAG パイプラインを設計するとき

## 入力前提
- 対象ドキュメント（PDF、テキスト、Markdown 等）
- Prisma スキーマに `Document` / `DocumentChunk` テーブルが定義済み
- LLM サービス（`llm.service.ts`）が利用可能

## 実行手順

### 1. ドキュメント取込
```typescript
// apps/api/src/document/document.service.ts
async ingestDocument(file: Buffer, metadata: DocumentMetadata) {
  // 1. テキスト抽出（PDF → テキスト等）
  const text = await this.extractText(file, metadata.mimeType);
  // 2. Document レコード作成
  const doc = await this.prisma.document.create({
    data: { title: metadata.title, content: text, source: metadata.source },
  });
  // 3. チャンク分割
  const chunks = this.splitIntoChunks(text, { chunkSize: 1000, overlap: 200 });
  // 4. 各チャンクを保存
  for (const [index, chunk] of chunks.entries()) {
    await this.prisma.documentChunk.create({
      data: { documentId: doc.id, content: chunk, chunkIndex: index },
    });
  }
  return doc;
}
```

### 2. チャンク分割ロジック
- チャンクサイズ: 800-1200 トークン（目安: 1000 文字）
- オーバーラップ: 150-250 文字（文脈の連続性を保つ）
- 分割点: 段落区切り > 文区切り > 文字数

### 3. エンベディング生成（オプション）
```typescript
// pgvector を使う場合
async generateEmbeddings(chunkId: string, content: string) {
  const embedding = await this.openai.embeddings.create({
    model: 'text-embedding-3-small',
    input: content,
  });
  await this.prisma.documentChunk.update({
    where: { id: chunkId },
    data: { embedding: embedding.data[0].embedding },
  });
}
```

### 4. 検索
```typescript
async searchChunks(query: string, limit: number = 5) {
  // テキスト検索（シンプル版）
  return this.prisma.documentChunk.findMany({
    where: { content: { contains: query, mode: 'insensitive' } },
    take: limit,
    include: { document: { select: { title: true, source: true } } },
  });
}
```

### 5. 生成（検索結果を LLM に渡す）
```typescript
async answerWithContext(query: string) {
  const chunks = await this.searchChunks(query);
  const context = chunks.map(c =>
    `[${c.document.title}] ${c.content}`
  ).join('\n\n');

  return this.llmService.completeWithRetry({
    prompt: `質問: ${query}\n\nコンテキスト:\n${context}`,
    systemPrompt: `以下のコンテキストに基づいて回答してください。コンテキストに含まれない情報で回答する場合は「コンテキスト外の情報です」と明記してください。`,
    temperature: 0.1,
  });
}
```

## 判断ルール
- ドキュメント数が少ない（10 件以下）: テキスト検索で十分
- ドキュメント数が多い、または意味的検索が必要: pgvector + エンベディング検索を導入
- RAG の品質が低い場合: チャンクサイズの調整、オーバーラップの増加、リランキングの導入

## 出力形式
- `apps/api/src/document/document.module.ts`
- `apps/api/src/document/document.service.ts`
- `apps/api/src/document/document.controller.ts`

## 注意点
- 引用元を必ず返す（ドキュメント名、チャンクインデックス）
- 大きなドキュメントのアップロードは Cloud Run の 32MiB 制限に注意
- テスト時は小さなテスト用ドキュメントを使う

## 失敗時の扱い
- テキスト抽出失敗: ファイル形式のサポートを確認。非対応形式ならエラーを返す
- 検索結果が空: フォールバックとして LLM のみで回答し、「関連ドキュメントは見つかりませんでした」と表示
- エンベディング生成失敗: リトライ後もダメならテキスト検索にフォールバック
