import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../apps/api/src/app.module';
import { GlobalExceptionFilter } from '../../apps/api/src/common/filters/http-exception.filter';

/**
 * API Integration テスト
 *
 * NestJS Testing Module を使用し、HTTP リクエスト/レスポンスを検証する。
 * DB を必要としないエンドポイントのみテストする。
 * DB を使うテストは DATABASE_URL が必要。
 */
describe('AppController (Integration)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api');
    app.useGlobalFilters(new GlobalExceptionFilter());
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('GET /api/health', () => {
    it('200 と正しい形式のヘルスチェックを返す', () => {
      return request(app.getHttpServer())
        .get('/api/health')
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('status', 'ok');
          expect(res.body).toHaveProperty('timestamp');
          expect(res.body).toHaveProperty('version');
          expect(res.body).toHaveProperty('environment');
        });
    });
  });

  describe('GET /api/llm/status', () => {
    it('200 と available フィールドを返す', () => {
      return request(app.getHttpServer())
        .get('/api/llm/status')
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('available');
          expect(typeof res.body.available).toBe('boolean');
          expect(res.body).toHaveProperty('timestamp');
        });
    });
  });

  describe('POST /api/llm/complete', () => {
    it('空のプロンプトで 400 バリデーションエラーを返す', () => {
      return request(app.getHttpServer())
        .post('/api/llm/complete')
        .send({ prompt: '' })
        .expect(400);
    });

    it('プロンプトなしで 400 バリデーションエラーを返す', () => {
      return request(app.getHttpServer())
        .post('/api/llm/complete')
        .send({})
        .expect(400);
    });

    it('不正な temperature で 400 を返す', () => {
      return request(app.getHttpServer())
        .post('/api/llm/complete')
        .send({ prompt: 'テスト', temperature: 5.0 })
        .expect(400);
    });

    it('未知のフィールドで 400 を返す (forbidNonWhitelisted)', () => {
      return request(app.getHttpServer())
        .post('/api/llm/complete')
        .send({ prompt: 'テスト', unknownField: 'value' })
        .expect(400);
    });
  });

  describe('存在しないエンドポイント', () => {
    it('404 を返す', () => {
      return request(app.getHttpServer())
        .get('/api/nonexistent')
        .expect(404);
    });
  });
});
