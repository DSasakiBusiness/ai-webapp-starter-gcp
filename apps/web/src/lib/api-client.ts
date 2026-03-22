/**
 * 型安全な API クライアント
 *
 * サーバーコンポーネント / クライアントコンポーネント両方で使用可能。
 * ApiResponse<T> / ApiError の型に準拠したレスポンスハンドリングを行う。
 */

/** API のベース URL */
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

/** API エラー */
export class ApiClientError extends Error {
  constructor(
    public readonly statusCode: number,
    message: string,
    public readonly error?: string,
  ) {
    super(message);
    this.name = 'ApiClientError';
  }
}

/** API リクエストオプション */
interface RequestOptions {
  headers?: Record<string, string>;
  signal?: AbortSignal;
}

/**
 * 型安全な fetch ラッパー
 *
 * @example
 * ```ts
 * const health = await apiClient.get<HealthCheckResponse>('/api/health');
 * const result = await apiClient.post<LlmCompletionResponse>('/api/llm/complete', { prompt: '...' });
 * ```
 */
export const apiClient = {
  async get<T>(path: string, options?: RequestOptions): Promise<T> {
    return request<T>('GET', path, undefined, options);
  },

  async post<T>(
    path: string,
    body?: unknown,
    options?: RequestOptions,
  ): Promise<T> {
    return request<T>('POST', path, body, options);
  },

  async put<T>(
    path: string,
    body?: unknown,
    options?: RequestOptions,
  ): Promise<T> {
    return request<T>('PUT', path, body, options);
  },

  async delete<T>(path: string, options?: RequestOptions): Promise<T> {
    return request<T>('DELETE', path, undefined, options);
  },
};

async function request<T>(
  method: string,
  path: string,
  body?: unknown,
  options?: RequestOptions,
): Promise<T> {
  const url = `${API_BASE_URL}${path}`;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...options?.headers,
  };

  const res = await fetch(url, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
    signal: options?.signal,
  });

  if (!res.ok) {
    let errorMessage = `API Error: ${res.status}`;
    let errorName: string | undefined;

    try {
      const errorBody = await res.json();
      errorMessage = errorBody.message || errorMessage;
      errorName = errorBody.error;
    } catch {
      // JSON パース失敗時は statusText を使用
      errorMessage = res.statusText || errorMessage;
    }

    throw new ApiClientError(res.status, errorMessage, errorName);
  }

  return res.json() as Promise<T>;
}
