import { Controller, Post, Body, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBody } from '@nestjs/swagger';
import { LlmService } from './llm.service';

class LlmCompletionDto {
  prompt: string;
  systemPrompt?: string;
  maxTokens?: number;
  temperature?: number;
}

@ApiTags('llm')
@Controller('llm')
export class LlmController {
  constructor(private readonly llmService: LlmService) {}

  @Get('status')
  @ApiOperation({ summary: 'LLM サービスの状態確認' })
  getStatus() {
    return {
      available: this.llmService.isAvailable(),
      timestamp: new Date().toISOString(),
    };
  }

  @Post('complete')
  @ApiOperation({ summary: 'LLM テキスト補完' })
  @ApiBody({ type: LlmCompletionDto })
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
