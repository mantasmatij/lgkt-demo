import request from 'supertest';
import { app } from '../../../app';
import { hashPassword } from '../../../middleware/auth';

async function canConnectDb(): Promise<boolean> {
  try {
    const { getPool } = await import('db');
    const pool = getPool();
    await pool.query('SELECT 1');
    return true;
  } catch {
    return false;
  }
}

describe('GET /api/admin/companies/:id and /:id/submissions', () => {
  let dbOk = false;
  let pool: ReturnType<Awaited<typeof import('db')>['getPool']>;
  const agent = request.agent(app);
  const admin = { email: 'detail-admin@example.com', password: 'Password1!', role: 'admin' };
  let companyId: string | null = null;

  beforeAll(async () => {
    dbOk = await canConnectDb();
    if (!dbOk) return;
    const dbMod = await import('db');
    pool = dbMod.getPool();

    await pool.query('DELETE FROM admin_users WHERE email = $1', [admin.email]);
    const pwdHash = await hashPassword(admin.password);
    await pool.query(
      'INSERT INTO admin_users (email, password_hash, role) VALUES ($1, $2, $3)',
      [admin.email, pwdHash, admin.role]
    );

    await agent
      .post('/api/auth/login')
      .send({ email: admin.email, password: admin.password })
      .expect(200);
  });

  afterAll(async () => {
    if (!dbOk) return;
    await pool.query('DELETE FROM admin_users WHERE email = $1', [admin.email]);
    await pool.end();
  });

  beforeEach(async () => {
    if (!dbOk) return;
    await pool.query('DELETE FROM submissions');
    await pool.query('DELETE FROM companies');
    const inserted = await pool.query(
      `INSERT INTO companies (code, name, country, company_type, legal_form, address, registry, e_delivery_address)
       VALUES ('D1', 'Delta D1', 'LT', 'TYPE_D', 'LLC', 'Delta addr', 'REG_X', 'delta@example.com')
       RETURNING id`
    );
    companyId = inserted.rows[0].id;

    await pool.query(
      `INSERT INTO submissions (company_code, name_at_submission, country, company_type, legal_form, address, registry, e_delivery_address,
         reporting_from, reporting_to, contact_name, contact_email, contact_phone, consent, consent_text, requirements_applied)
       VALUES ('D1', 'Delta D1', 'LT', 'TYPE_D', 'LLC', 'Delta addr', 'REG_X', 'delta@example.com',
         '2024-01-01','2024-12-31','Alice','alice@example.com','123', true, 'txt', true)`
    );
  });

  it('returns company detail', async () => {
    if (!dbOk) return void it.skip as unknown as void;
    const res = await agent.get(`/api/admin/companies/${companyId}`).expect(200);
    expect(res.body.id).toBe(companyId);
    expect(res.body.name).toBe('Delta D1');
    expect(res.body.code).toBe('D1');
    expect(res.body.type).toBe('TYPE_D');
    expect(res.body.legalForm).toBe('LLC');
    expect(res.body.registry).toBe('REG_X');
  });

  it('returns submissions list ordered by created desc', async () => {
    if (!dbOk) return void it.skip as unknown as void;
    // Add an older one
    await pool.query(
      `INSERT INTO submissions (company_code, name_at_submission, country, company_type, legal_form, address, registry, e_delivery_address,
         reporting_from, reporting_to, contact_name, contact_email, contact_phone, consent, consent_text, requirements_applied, created_at)
       VALUES ('D1', 'Delta D1 older', 'LT', 'TYPE_D', 'LLC', 'Delta addr', 'REG_X', 'delta@example.com',
         '2023-01-01','2023-12-31','Bob','bob@example.com','123', true, 'txt', true, '2023-12-31T23:59:59Z')`
    );

    const res = await agent.get(`/api/admin/companies/${companyId}/submissions?page=1&pageSize=25`).expect(200);
    expect(res.body.items.length).toBeGreaterThanOrEqual(2);
    // First should be the most recent (by createdAt desc); our seeded submission created now should come first.
    const codesOrder = res.body.items.map((i: { submittedAt: string }) => i.submittedAt);
    expect(new Date(codesOrder[0]).getTime()).toBeGreaterThanOrEqual(new Date(codesOrder[1]).getTime());
  });
});
