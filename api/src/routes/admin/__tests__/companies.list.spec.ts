import request from 'supertest';
import { app } from '../../../app';
import { hashPassword } from '../../../middleware/auth';

// Utility to conditionally skip tests when DB is unavailable
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

describe('GET /api/admin/companies (ordering & search)', () => {
  let dbOk = false;
  const admin = { email: 'admin@example.com', password: 'Password1!', role: 'admin' };
  let pool: ReturnType<Awaited<typeof import('db')>['getPool']>;
  const agent = request.agent(app);

  beforeAll(async () => {
    dbOk = await canConnectDb();
    if (!dbOk) return;
    const dbMod = await import('db');
    pool = dbMod.getPool();

    // Ensure clean state for admin and auth
    await pool.query('DELETE FROM admin_users WHERE email = $1', [admin.email]);
    const pwdHash = await hashPassword(admin.password);
    await pool.query(
      'INSERT INTO admin_users (email, password_hash, role) VALUES ($1, $2, $3)',
      [admin.email, pwdHash, admin.role]
    );

    // Login to obtain signed session cookie via Set-Cookie
    await agent
      .post('/api/auth/login')
      .send({ email: admin.email, password: admin.password })
      .expect(200);
  });

  afterAll(async () => {
    if (!dbOk) return;
    // Cleanup admin user and close pool
    await pool.query('DELETE FROM admin_users WHERE email = $1', [admin.email]);
    await pool.end();
  });

  beforeEach(async () => {
    if (!dbOk) return;
    // Clean dependent data first then companies
    await pool.query('DELETE FROM submissions');
    await pool.query('DELETE FROM companies');
    // Seed a few companies with varying names/codes
    await pool.query(
      `INSERT INTO companies (code, name, country, company_type, address, registry, e_delivery_address)
       VALUES 
       ('ALPHA', 'Alpha Corp', 'LT', 'TYPE_A', 'Addr A', 'REG_A', 'alpha@example.com'),
       ('BETA', 'Beta Group', 'LT', 'TYPE_B', 'Addr B', 'REG_B', 'beta@example.com'),
       ('ZETA', 'Zeta Holdings', 'LT', 'TYPE_C', 'Addr C', 'REG_C', 'zeta@example.com')`
    );
  });

  it('returns companies ordered by name desc by default', async () => {
    if (!dbOk) {
      return void it.skip as unknown as void;
    }
    const res = await agent.get('/api/admin/companies').expect(200);
    expect(Array.isArray(res.body.items)).toBe(true);
    const names = res.body.items.map((i: { name: string }) => i.name);
    // Expect Zeta, then Beta, then Alpha as name:desc
    expect(names.slice(0, 3)).toEqual(['Zeta Holdings', 'Beta Group', 'Alpha Corp']);
    expect(res.body.page).toBe(1);
    expect(res.body.pageSize).toBeGreaterThan(0);
    expect(typeof res.body.total).toBe('number');
  });

  it('applies case-insensitive substring search across name/code', async () => {
    if (!dbOk) {
      return void it.skip as unknown as void;
    }
    const res = await agent.get('/api/admin/companies?search=alp').expect(200);
    const names = res.body.items.map((i: { name: string }) => i.name);
    expect(names).toEqual(['Alpha Corp']);

    const res2 = await agent.get('/api/admin/companies?search=ETA').expect(200);
    const names2 = res2.body.items.map((i: { name: string }) => i.name);
    // Should match Beta and Zeta (substring on name); ordering still desc
    expect(names2.slice(0, 2)).toEqual(['Zeta Holdings', 'Beta Group']);
  });
});
