import { Controller, Post, Body, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBody, ApiResponse } from '@nestjs/swagger';
import { LlmService } from './llm.service';
import { LlmCompletionDto } from './dto/llm-completion.dto';

@ApiTags('llm')
@Controller('llm')
export class LlmController {
  constructor(private readonly llmService: LlmService) {}

  @Get('status')
  @ApiOperation({ summary: 'LLM サービスの状態確認' })
  @ApiResponse({ status: 200, description: 'LLM サービスの可用性を返す' })
  getStatus() {
    return {
      available: this.llmService.isAvailable(),
      timestamp: new Date().toISOString(),
    };
  }

  @Post('complete')
  @ApiOperation({ summary: 'LLM テキスト補完' })
  @ApiBody({ type: LlmCompletionDto })
  @ApiResponse({ status: 200, description: 'LLM 補完結果' })
  @ApiResponse({ status: 400, description: 'バリデーションエラー' })
  @ApiResponse({ status: 500, description: 'LLM 呼び出しエラー' })
  async complete(@Body() dto: LlmCompletionDto) {
    const result = await this.llmService.completeWithRetry({
      prompt: dto.prompt,
      systemPrompt: dto.systemPrompt,
      maxTokens: dto.maxTokens,
      temperature: dto.temperature,
    });
    return result;
  }
}
