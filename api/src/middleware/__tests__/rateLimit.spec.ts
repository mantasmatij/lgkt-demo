import request from 'supertest';
import express from 'express';
import { csvExportLimiter, authLimiter, submissionLimiter } from '../rateLimit';

describe('Rate Limiting Middleware', () => {
  describe('csvExportLimiter', () => {
    let app: express.Application;

    beforeEach(() => {
      app = express();
      app.get('/export', csvExportLimiter, (req, res) => {
        res.json({ ok: true });
      });
    });

    it('should allow requests within the limit', async () => {
      for (let i = 0; i < 5; i++) {
        const response = await request(app).get('/export');
        expect(response.status).toBe(200);
      }
    });

    it('should return 429 after exceeding the limit', async () => {
      // Make 10 requests (the limit)
      for (let i = 0; i < 10; i++) {
        await request(app).get('/export');
      }

      // 11th request should be rate limited
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
      for (let i = 0; i < 3; i++) {
        const response = await request(app).post('/login');
        expect(response.status).toBe(401);
      }
    });

    it('should return 429 after exceeding the limit', async () => {
      // Make 5 requests (the limit) - all failed logins count
      for (let i = 0; i < 5; i++) {
        await request(app).post('/login');
      }

      // 6th request should be rate limited
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
      for (let i = 0; i < 3; i++) {
        const response = await request(app).post('/submit');
        expect(response.status).toBe(200);
      }
    });

    it('should return 429 after exceeding the limit', async () => {
      // Make 3 requests (the limit)
      for (let i = 0; i < 3; i++) {
        await request(app).post('/submit');
      }

      // 4th request should be rate limited
      const response = await request(app).post('/submit');
      expect(response.status).toBe(429);
      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toContain('Too many submissions');
    });
  });
});
