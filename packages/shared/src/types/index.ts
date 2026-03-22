// =============================================================================
// 共通型定義
// フロントエンドとバックエンドで共有する型
// =============================================================================

/** ユーザーロール */
export type UserRole = 'USER' | 'ADMIN';

/** メッセージロール */
export type MessageRole = 'USER' | 'ASSISTANT' | 'SYSTEM';

/** API レスポンス共通ラッパー */
export interface ApiResponse<T> {
  data: T;
  message?: string;
  timestamp: string;
}

/** API エラーレスポンス */
export interface ApiError {
  statusCode: number;
  message: string;
  error?: string;
  timestamp: string;
}

/** ページネーションパラメータ */
export interface PaginationParams {
  page: number;
  limit: number;
}

/** ページネーション結果 */
export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

/** ヘルスチェックレスポンス */
export interface HealthCheckResponse {
  status: 'ok' | 'error';
  timestamp: string;
  version: string;
  environment: string;
}

/** LLM 補完リクエスト */
export interface LlmCompletionRequest {
  prompt: string;
  systemPrompt?: string;
  maxTokens?: number;
  temperature?: number;
}

/** LLM 補完レスポンス */
export interface LlmCompletionResponse {
  content: string;
  model: string;
  usage: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}

/** 会話サマリー */
export interface ConversationSummary {
  id: string;
  title: string | null;
  messageCount: number;
  lastMessageAt: string;
  createdAt: string;
}

/** メッセージ */
export interface ChatMessage {
  id: string;
  role: MessageRole;
  content: string;
  metadata?: Record<string, unknown>;
  createdAt: string;
}
