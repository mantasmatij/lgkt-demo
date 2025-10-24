import request from 'supertest';
import express from 'express';
import { csvExportLimiter, authLimiter, submissionLimiter } from '../rateLimit';

describe('Rate Limiting Middleware', () => {
  const isProduction = process.env.NODE_ENV === 'production';
  const csvLimit = isProduction ? 10 : 1000;
  const authLimit = isProduction ? 5 : 500;
  const submissionLimit = isProduction ? 3 : 300;

  describe('csvExportLimiter', () => {
    let app: express.Application;

    beforeEach(() => {
      app = express();
      app.get('/export', csvExportLimiter, (req, res) => {
        res.json({ ok: true });
      });
    });

    it('should allow requests within the limit', async () => {
      const testCount = Math.min(5, Math.floor(csvLimit / 2));
      for (let i = 0; i < testCount; i++) {
        const response = await request(app).get('/export');
        expect(response.status).toBe(200);
      }
    });

    it('should return 429 after exceeding the limit', async () => {
      // Make requests up to the limit
      for (let i = 0; i < csvLimit; i++) {
        await request(app).get('/export');
      }

      // Next request should be rate limited
      const response = await request(app).get('/export');
      expect(response.status).toBe(429);
      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toContain('Too many export requests');
    });

    it('should include RateLimit headers', async () => {
      const response = await request(app).get('/export');
      expect(response.headers).toHaveProperty('ratelimit-limit');
      expect(response.headers).toHaveProperty('ratelimit-remaining');
      expect(response.headers).toHaveProperty('ratelimit-reset');
    });
  });

  describe('authLimiter', () => {
    let app: express.Application;

    beforeEach(() => {
      app = express();
      app.post('/login', authLimiter, (req, res) => {
        // Simulate failed login by returning 401
        res.status(401).json({ error: 'Invalid credentials' });
      });
    });

    it('should allow requests within the limit', async () => {
      const testCount = Math.min(3, Math.floor(authLimit / 2));
      for (let i = 0; i < testCount; i++) {
        const response = await request(app).post('/login');
        expect(response.status).toBe(401);
      }
    });

    it('should return 429 after exceeding the limit', async () => {
      // Make requests up to the limit - all failed logins count
      for (let i = 0; i < authLimit; i++) {
        await request(app).post('/login');
      }

      // Next request should be rate limited
      const response = await request(app).post('/login');
      expect(response.status).toBe(429);
      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toContain('Too many login attempts');
    });
  });

  describe('submissionLimiter', () => {
    let app: express.Application;

    beforeEach(() => {
      app = express();
      app.post('/submit', submissionLimiter, (req, res) => {
        res.json({ ok: true });
      });
    });

    it('should allow requests within the limit', async () => {
      const testCount = Math.min(3, Math.floor(submissionLimit / 2));
      for (let i = 0; i < testCount; i++) {
        const response = await request(app).post('/submit');
        expect(response.status).toBe(200);
      }
    });

    it('should return 429 after exceeding the limit', async () => {
      // Make requests up to the limit
      for (let i = 0; i < submissionLimit; i++) {
        await request(app).post('/submit');
      }

      // Next request should be rate limited
      const response = await request(app).post('/submit');
      expect(response.status).toBe(429);
      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toContain('Too many submissions');
    });
  });
});
