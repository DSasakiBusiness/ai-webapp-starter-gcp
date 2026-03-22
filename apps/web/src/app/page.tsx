import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'AI WebApp Starter',
  description: 'AI 特化 Web サービス開発スターター (GCP)',
};

export default function Home() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

  return (
    <main style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <h1
        data-testid="page-title"
        style={{ fontSize: '2rem', marginBottom: '0.5rem' }}
      >
        🚀 AI WebApp Starter
      </h1>
      <p
        data-testid="page-description"
        style={{ color: 'var(--secondary)', marginBottom: '2rem' }}
      >
        AI 特化 Web サービス開発スターター (GCP)
      </p>

      <section data-testid="stack-list" style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>
          スタック
        </h2>
        <ul style={{ paddingLeft: '1.5rem', lineHeight: '1.8' }}>
          <li>Frontend: Next.js (App Router)</li>
          <li>Backend: NestJS</li>
          <li>Database: PostgreSQL + Prisma</li>
          <li>AI: LLM Integration + RAG</li>
          <li>Cloud: GCP (Cloud Run)</li>
          <li>Test: Jest + Playwright</li>
        </ul>
      </section>

      <section data-testid="quickstart-section" style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>
          クイックスタート
        </h2>
        <pre
          style={{
            background: 'var(--muted)',
            border: '1px solid var(--border)',
            borderRadius: '8px',
            padding: '1rem',
            overflow: 'auto',
          }}
        >
          <code>
            {`cp .env.example .env
make setup
# → http://localhost:3000`}
          </code>
        </pre>
      </section>

      <section data-testid="api-links">
        <h2 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>API</h2>
        <ul style={{ paddingLeft: '1.5rem', lineHeight: '1.8' }}>
          <li>
            <a data-testid="health-link" href={`${apiUrl}/api/health`}>
              ヘルスチェック
            </a>
          </li>
          <li>
            <a data-testid="swagger-link" href={`${apiUrl}/api/docs`}>
              Swagger ドキュメント
            </a>
          </li>
          <li>
            <a data-testid="llm-status-link" href={`${apiUrl}/api/llm/status`}>
              LLM ステータス
            </a>
          </li>
        </ul>
      </section>
    </main>
  );
}
