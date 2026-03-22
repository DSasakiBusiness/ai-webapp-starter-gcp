---
name: implement-nestjs-api
description: NestJS での API エンドポイント実装手順
---

# implement-nestjs-api

## この skill を使う場面
- 新しい API エンドポイントを追加するとき
- backend-developer が API を実装するとき

## 入力前提
- API コントラクト（`packages/shared/src/types` または `write-api-contract` の出力）
- Prisma スキーマ（`apps/api/prisma/schema.prisma`）

## 実行手順

### 1. モジュールの作成
```bash
# Docker 環境
docker compose exec api sh -c "cd apps/api && npx nest generate module [name]"
docker compose exec api sh -c "cd apps/api && npx nest generate controller [name]"
docker compose exec api sh -c "cd apps/api && npx nest generate service [name]"
```

### 2. DTO の定義
```typescript
import { IsString, IsOptional, IsInt, Min, Max } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateXxxDto {
  @ApiProperty({ description: '説明' })
  @IsString()
  name: string;

  @ApiProperty({ description: '説明', required: false })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number;
}
```

### 3. コントローラーの実装
```typescript
@ApiTags('xxx')
@Controller('xxx')
export class XxxController {
  constructor(private readonly xxxService: XxxService) {}

  @Post()
  @ApiOperation({ summary: '新規作成' })
  @ApiBody({ type: CreateXxxDto })
  async create(@Body() dto: CreateXxxDto) {
    return this.xxxService.create(dto);
  }
}
```

### 4. サービスの実装
```typescript
@Injectable()
export class XxxService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateXxxDto) {
    return this.prisma.xxx.create({ data: dto });
  }
}
```

### 5. モジュールの登録
- `AppModule` の `imports` に新モジュールを追加
- PrismaService の注入が必要なら `providers` に追加

## 判断ルール
- レスポンス型は `packages/shared/src/types` の型と一致させる
- エラーレスポンスは NestJS の例外（`NotFoundException`, `BadRequestException` 等）を使用
- 認証が必要なエンドポイントには `@UseGuards(AuthGuard)` を付与
- raw SQL は使用禁止（Prisma ORM を使用）

## 出力形式
- `apps/api/src/[module]/[module].module.ts`
- `apps/api/src/[module]/[module].controller.ts`
- `apps/api/src/[module]/[module].service.ts`
- `apps/api/src/[module]/dto/*.dto.ts`

## 注意点
- Swagger アノテーションを必ず付与する
- class-validator でバリデーションを実装する
- `packages/shared/src/types` の型更新が必要なら先に更新する

## 失敗時の扱い
- モジュールの依存注入エラー: `AppModule` の `imports` を確認
- Swagger が表示されない: `main.ts` の Swagger セットアップを確認
- バリデーションが効かない: `ValidationPipe` がグローバルに設定されているか確認
