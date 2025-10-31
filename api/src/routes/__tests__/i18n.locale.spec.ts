import request from 'supertest';
import { app } from '../../app';

describe('i18n locale endpoints', () => {
  it('GET /api/i18n/locale returns default lt on fresh session', async () => {
    const res = await request(app).get('/api/i18n/locale');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ locale: 'lt' });
  });

  it('POST /api/i18n/locale sets to en with CSRF and persists for subsequent GETs', async () => {
    const agent = request.agent(app);
    // get CSRF and capture cookies
    const csrfRes = await agent.get('/api/csrf');
    expect(csrfRes.status).toBe(200);
    const token = csrfRes.body.token as string;
    expect(typeof token).toBe('string');

    const postRes = await agent
      .post('/api/i18n/locale')
      .set('X-CSRF-Token', token)
      .send({ locale: 'en' });
    expect(postRes.status).toBe(204);

    const getRes = await agent.get('/api/i18n/locale');
    expect(getRes.status).toBe(200);
    expect(getRes.body).toEqual({ locale: 'en' });
  });

  it('POST /api/i18n/locale without CSRF is rejected', async () => {
    const res = await request(app).post('/api/i18n/locale').send({ locale: 'en' });
    expect(res.status).toBe(403);
  });

  it('POST /api/i18n/locale with invalid body returns 400', async () => {
    const agent = request.agent(app);
    const csrfRes = await agent.get('/api/csrf');
    const token = csrfRes.body.token as string;

    const res = await agent
      .post('/api/i18n/locale')
      .set('X-CSRF-Token', token)
      .send({ locale: 'de' });
    expect(res.status).toBe(400);
  });
});
