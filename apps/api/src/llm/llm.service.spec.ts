import { ConfigService } from '@nestjs/config';
import { LlmService } from './llm.service';

// OpenAI モジュールをモック
jest.mock('openai', () => {
  return {
    __esModule: true,
    default: jest.fn().mockImplementation(() => ({
      chat: {
        completions: {
          create: jest.fn(),
        },
      },
    })),
  };
});

describe('LlmService', () => {
  let service: LlmService;
  let configService: ConfigService;
  let mockCreate: jest.Mock;

  const mockConfigValues: Record<string, string | undefined> = {
    OPENAI_API_KEY: 'test-api-key',
    LLM_MODEL: 'gpt-4o',
    LLM_MAX_TOKENS: '4096',
    LLM_TEMPERATURE: '0.7',
  };

  beforeEach(() => {
    configService = {
      get: jest.fn((key: string) => mockConfigValues[key]),
    } as unknown as ConfigService;

    service = new LlmService(configService);

    // OpenAI の内部 create メソッドへのアクセスを取得
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    mockCreate = (service as any).client.chat.completions.create;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('isAvailable', () => {
    it('API キーが有効な場合 true を返す', () => {
      expect(service.isAvailable()).toBe(true);
    });

    it('API キーが "dummy-key" の場合 false を返す', () => {
      mockConfigValues.OPENAI_API_KEY = 'dummy-key';
      const svc = new LlmService(configService);
      expect(svc.isAvailable()).toBe(false);
    });

    it('API キーが未設定の場合 false を返す', () => {
      mockConfigValues.OPENAI_API_KEY = undefined;
      const svc = new LlmService(configService);
      expect(svc.isAvailable()).toBe(false);
    });

    it('API キーが "your-openai-api-key" の場合 false を返す', () => {
      mockConfigValues.OPENAI_API_KEY = 'your-openai-api-key';
      const svc = new LlmService(configService);
      expect(svc.isAvailable()).toBe(false);
    });
  });

  describe('complete', () => {
    const mockResponse = {
      choices: [
        {
          message: { content: 'テスト応答' },
          finish_reason: 'stop',
        },
      ],
      model: 'gpt-4o',
      usage: {
        prompt_tokens: 10,
        completion_tokens: 5,
        total_tokens: 15,
      },
    };

    it('正常なプロンプトで補完結果を返す', async () => {
      mockCreate.mockResolvedValueOnce(mockResponse);

      const result = await service.complete({ prompt: 'テスト' });

      expect(result.content).toBe('テスト応答');
      expect(result.model).toBe('gpt-4o');
      expect(result.usage.promptTokens).toBe(10);
      expect(result.usage.completionTokens).toBe(5);
      expect(result.usage.totalTokens).toBe(15);
    });

    it('systemPrompt を指定した場合、messages に含まれる', async () => {
      mockCreate.mockResolvedValueOnce(mockResponse);

      await service.complete({
        prompt: 'テスト',
        systemPrompt: 'あなたは助手です',
      });

      expect(mockCreate).toHaveBeenCalledWith(
        expect.objectContaining({
          messages: expect.arrayContaining([
            { role: 'system', content: 'あなたは助手です' },
            { role: 'user', content: 'テスト' },
          ]),
        }),
      );
    });

    it('空の応答の場合エラーをスローする', async () => {
      mockCreate.mockResolvedValueOnce({
        choices: [{ message: { content: null } }],
        model: 'gpt-4o',
        usage: { prompt_tokens: 0, completion_tokens: 0, total_tokens: 0 },
      });

      await expect(service.complete({ prompt: 'テスト' })).rejects.toThrow(
        'LLM から空の応答が返されました',
      );
    });

    it('API エラーの場合例外を伝搬する', async () => {
      mockCreate.mockRejectedValueOnce(new Error('API Error'));

      await expect(service.complete({ prompt: 'テスト' })).rejects.toThrow(
        'API Error',
      );
    });
  });

  describe('completeWithRetry', () => {
    const mockResponse = {
      choices: [{ message: { content: '成功' } }],
      model: 'gpt-4o',
      usage: { prompt_tokens: 5, completion_tokens: 3, total_tokens: 8 },
    };

    it('最初の試行で成功する場合、1回だけ呼ぶ', async () => {
      mockCreate.mockResolvedValueOnce(mockResponse);

      const result = await service.completeWithRetry({ prompt: 'テスト' });

      expect(result.content).toBe('成功');
      expect(mockCreate).toHaveBeenCalledTimes(1);
    });

    it('1回目失敗、2回目成功の場合、2回呼ぶ', async () => {
      mockCreate
        .mockRejectedValueOnce(new Error('Temporary Error'))
        .mockResolvedValueOnce(mockResponse);

      const result = await service.completeWithRetry(
        { prompt: 'テスト' },
        3,
      );

      expect(result.content).toBe('成功');
      expect(mockCreate).toHaveBeenCalledTimes(2);
    }, 15000);

    it('全回失敗の場合、最後のエラーをスローする', async () => {
      mockCreate
        .mockRejectedValueOnce(new Error('Error 1'))
        .mockRejectedValueOnce(new Error('Error 2'));

      await expect(
        service.completeWithRetry({ prompt: 'テスト' }, 2),
      ).rejects.toThrow('Error 2');

      expect(mockCreate).toHaveBeenCalledTimes(2);
    }, 15000);
  });
});
