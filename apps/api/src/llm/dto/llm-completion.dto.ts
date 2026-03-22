import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsNumber,
  Min,
  Max,
  MinLength,
  MaxLength,
} from 'class-validator';

/**
 * LLM テキスト補完リクエストの DTO
 *
 * class-validator によるバリデーション付き。
 * ValidationPipe (whitelist: true, forbidNonWhitelisted: true) と併用する。
 */
export class LlmCompletionDto {
  @ApiProperty({
    description: 'ユーザーのプロンプト',
    example: 'TypeScript の主な特徴を3つ教えてください',
    minLength: 1,
    maxLength: 32000,
  })
  @IsString()
  @MinLength(1, { message: 'プロンプトは必須です' })
  @MaxLength(32000, { message: 'プロンプトは32000文字以内にしてください' })
  prompt: string;

  @ApiProperty({
    description: 'システムプロンプト（AI の役割を指定）',
    example: 'あなたは親切なプログラミング講師です',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(16000, {
    message: 'システムプロンプトは16000文字以内にしてください',
  })
  systemPrompt?: string;

  @ApiProperty({
    description: '最大トークン数',
    example: 2048,
    required: false,
    minimum: 1,
    maximum: 128000,
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(128000)
  maxTokens?: number;

  @ApiProperty({
    description: '温度パラメータ (0.0-2.0)',
    example: 0.7,
    required: false,
    minimum: 0,
    maximum: 2,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(2)
  temperature?: number;
}
