import { AppService } from './app.service';

describe('AppService', () => {
  let service: AppService;

  beforeEach(() => {
    service = new AppService();
  });

  describe('getHealth', () => {
    it('status が "ok" を返す', () => {
      const result = service.getHealth();
      expect(result.status).toBe('ok');
    });

    it('必須フィールドがすべて存在する', () => {
      const result = service.getHealth();
      expect(result).toHaveProperty('status');
      expect(result).toHaveProperty('timestamp');
      expect(result).toHaveProperty('version');
      expect(result).toHaveProperty('environment');
    });

    it('timestamp が ISO 8601 形式である', () => {
      const result = service.getHealth();
      const parsed = new Date(result.timestamp);
      expect(parsed.toISOString()).toBe(result.timestamp);
    });

    it('version が semver 形式である', () => {
      const result = service.getHealth();
      expect(result.version).toMatch(/^\d+\.\d+\.\d+$/);
    });

    it('environment が文字列である', () => {
      const result = service.getHealth();
      expect(typeof result.environment).toBe('string');
      expect(result.environment.length).toBeGreaterThan(0);
    });
  });
});
