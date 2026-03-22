export default function Home() {
  return (
    <main style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>
        🚀 AI WebApp Starter
      </h1>
      <p style={{ color: 'var(--secondary)', marginBottom: '2rem' }}>
        AI 特化 Web サービス開発スターター (GCP)
      </p>

      <section style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>
          スタック
        </h2>
        <ul style={{ paddingLeft: '1.5rem', lineHeight: '1.8' }}>
          <li>Frontend: Next.js</li>
          <li>Backend: NestJS</li>
          <li>Database: PostgreSQL + Prisma</li>
          <li>AI: LLM Integration + RAG</li>
          <li>Cloud: GCP (Cloud Run)</li>
        </ul>
      </section>

      <section style={{ marginBottom: '2rem' }}>
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

      <section>
        <h2 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>API</h2>
        <ul style={{ paddingLeft: '1.5rem', lineHeight: '1.8' }}>
          <li>
            <a href="/api/health">ヘルスチェック</a>
          </li>
          <li>
            <a
              href={`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/docs`}
            >
              Swagger ドキュメント
            </a>
          </li>
        </ul>
      </section>
    </main>
  );
}
