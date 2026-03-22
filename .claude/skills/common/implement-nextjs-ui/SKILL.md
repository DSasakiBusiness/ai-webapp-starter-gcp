---
name: implement-nextjs-ui
description: Next.js (App Router) での UI コンポーネント実装手順
---

# implement-nextjs-ui

## この skill を使う場面
- 新しいページやコンポーネントを実装するとき
- frontend-developer が UI 実装を行うとき

## 入力前提
- UI 仕様書（`generate-ui-spec` の出力があれば）
- API コントラクト（`packages/shared/src/types` の型定義）
- デザイン要件（ワイヤーフレーム、モックアップがあれば）

## 実行手順

### 1. コンポーネント設計
- Server Component / Client Component の判断:
  - データ取得のみ → Server Component
  - ユーザー操作（クリック、入力）→ Client Component (`'use client'`)
  - 両方 → Server Component でデータ取得、Client Component で操作
- ファイル配置: `apps/web/src/app/[route]/page.tsx`

### 2. 実装
```typescript
// Server Component の例
export default async function Page() {
  const data = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/endpoint`);
  return <ClientComponent data={data} />;
}

// Client Component の例
'use client';
export function ClientComponent({ data }: Props) {
  // インタラクティブな処理
}
```

### 3. テスタビリティの確保
- 主要な操作要素に `data-testid` を付与する
- ボタン: `data-testid="submit-button"`
- 入力: `data-testid="chat-input"`
- リスト項目: `data-testid="conversation-item"`

### 4. エラーハンドリング
- API エラー時のフォールバック UI を実装する
- ローディング状態を表示する
- AI 機能のタイムアウト時に再試行ボタンを表示する

### 5. アクセシビリティ
- `aria-label` を適切に設定する
- キーボード操作に対応する
- 色のみで情報を伝えない

## 判断ルール
- CSS: CSS Modules を優先。グローバルスタイルは `globals.css` のみ
- 状態管理: ローカル状態は `useState`。サーバーデータは SWR / React Query
- フォーム: React 19 の `useActionState` または `react-hook-form`

## 出力形式
- `apps/web/src/app/[route]/page.tsx` — ページコンポーネント
- `apps/web/src/components/[Name].tsx` — 再利用コンポーネント
- `apps/web/src/app/[route]/page.module.css` — スタイル

## 注意点
- `dangerouslySetInnerHTML` は禁止（XSS リスク）
- `any` 型は禁止
- `NEXT_PUBLIC_` プレフィックスなしでクライアント側の環境変数にアクセスしない
- Docker 環境でのホットリロードを確認する

## 失敗時の扱い
- ハイドレーションエラー: Server/Client Component の境界を見直す。動的値は Suspense でラップ
- スタイルの不整合: CSS Modules のクラス名を確認。グローバルスタイルとの競合を排除
- API 呼び出しエラー: `NEXT_PUBLIC_API_URL` が正しく設定されているか確認
