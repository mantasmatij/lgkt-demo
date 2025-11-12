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

describe('GET /api/admin/companies filters (type, registry)', () => {
  let dbOk = false;
  let pool: ReturnType<Awaited<typeof import('db')>['getPool']>;
  const agent = request.agent(app);
  const admin = { email: 'filters-admin@example.com', password: 'Password1!', role: 'admin' };

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
    await pool.query(
      `INSERT INTO companies (code, name, country, company_type, address, registry, e_delivery_address)
       VALUES 
       ('A1', 'Acme A1', 'LT', 'TYPE_A', 'Addr1', 'REG_A', 'a1@example.com'),
       ('A2', 'Acme A2', 'LT', 'TYPE_A', 'Addr2', 'REG_B', 'a2@example.com'),
       ('B1', 'Bravo B1', 'LT', 'TYPE_B', 'Addr3', 'REG_A', 'b1@example.com'),
       ('C1', 'Charlie C1', 'LT', 'TYPE_C', 'Addr4', 'REG_C', 'c1@example.com')`
    );
  });

  it('filters by type only', async () => {
    if (!dbOk) return void it.skip as unknown as void;
    const res = await agent.get('/api/admin/companies?type=TYPE_A').expect(200);
    const codes = res.body.items.map((i: { code: string }) => i.code).sort();
    expect(codes).toEqual(['A1', 'A2']);
  });

  it('filters by registry only', async () => {
    if (!dbOk) return void it.skip as unknown as void;
    const res = await agent.get('/api/admin/companies?registry=REG_A').expect(200);
    const codes = res.body.items.map((i: { code: string }) => i.code).sort();
    expect(codes).toEqual(['A1', 'B1']);
  });

  it('filters by type AND registry combined', async () => {
    if (!dbOk) return void it.skip as unknown as void;
    const res = await agent.get('/api/admin/companies?type=TYPE_A&registry=REG_B').expect(200);
    const codes = res.body.items.map((i: { code: string }) => i.code);
    expect(codes).toEqual(['A2']);
  });
});
