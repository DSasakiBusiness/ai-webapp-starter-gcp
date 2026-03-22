import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';

export interface LlmCompletionOptions {
  prompt: string;
  systemPrompt?: string;
  maxTokens?: number;
  temperature?: number;
}

export interface LlmCompletionResult {
  content: string;
  model: string;
  usage: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}

@Injectable()
export class LlmService {
  private readonly logger = new Logger(LlmService.name);
  private readonly client: OpenAI;
  private readonly model: string;
  private readonly maxTokens: number;
  private readonly temperature: number;

  constructor(private readonly configService: ConfigService) {
    const apiKey = this.configService.get<string>('OPENAI_API_KEY');
    if (!apiKey) {
      this.logger.warn(
        'OPENAI_API_KEY が設定されていません。LLM 機能は無効です。',
      );
    }
    this.client = new OpenAI({ apiKey: apiKey || 'dummy-key' });
    this.model = this.configService.get<string>('LLM_MODEL') || 'gpt-4o';
    this.maxTokens =
      parseInt(this.configService.get<string>('LLM_MAX_TOKENS') || '4096', 10);
    this.temperature =
      parseFloat(this.configService.get<string>('LLM_TEMPERATURE') || '0.7');
  }

  async complete(options: LlmCompletionOptions): Promise<LlmCompletionResult> {
    const { prompt, systemPrompt, maxTokens, temperature } = options;

    try {
      const messages: OpenAI.ChatCompletionMessageParam[] = [];
      if (systemPrompt) {
        messages.push({ role: 'system', content: systemPrompt });
      }
      messages.push({ role: 'user', content: prompt });

      const response = await this.client.chat.completions.create({
        model: this.model,
        messages,
        max_tokens: maxTokens || this.maxTokens,
        temperature: temperature ?? this.temperature,
      });

      const choice = response.choices[0];
      if (!choice || !choice.message.content) {
        throw new Error('LLM から空の応答が返されました');
      }

      return {
        content: choice.message.content,
        model: response.model,
        usage: {
          promptTokens: response.usage?.prompt_tokens || 0,
          completionTokens: response.usage?.completion_tokens || 0,
          totalTokens: response.usage?.total_tokens || 0,
        },
      };
    } catch (error) {
      this.logger.error(`LLM 呼び出しエラー: ${error}`);
      throw error;
    }
  }

  async completeWithRetry(
    options: LlmCompletionOptions,
    maxRetries = 3,
  ): Promise<LlmCompletionResult> {
    let lastError: Error | null = null;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await this.complete(options);
      } catch (error) {
        lastError = error as Error;
        this.logger.warn(
          `LLM 呼び出し失敗 (${attempt}/${maxRetries}): ${error}`,
        );
        if (attempt < maxRetries) {
          const delay = Math.pow(2, attempt) * 1000;
          await new Promise((resolve) => setTimeout(resolve, delay));
        }
      }
    }

    throw lastError;
  }

  isAvailable(): boolean {
    const apiKey = this.configService.get<string>('OPENAI_API_KEY');
    return !!apiKey && apiKey !== 'dummy-key' && apiKey !== 'your-openai-api-key';
  }
}
