import request from 'supertest';
import { app } from '../../../app';

describe('GET /api/admin/companies auth', () => {
  it('returns 401 when no session cookie provided', async () => {
    const res = await request(app).get('/api/admin/companies');
    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty('code', 'UNAUTHORIZED');
  });
});
