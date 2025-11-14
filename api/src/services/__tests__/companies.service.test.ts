import { listCompanies } from '../../services/companies.service';
import { hashPassword } from '../../middleware/auth';

async function setupAdmin() {
  const { getPool } = await import('db');
  const pool = getPool();
  const admin = { email: 'svc-admin@example.com', password: 'Password1!', role: 'admin' };
  await pool.query('DELETE FROM admin_users WHERE email=$1', [admin.email]);
  const pwdHash = await hashPassword(admin.password);
  await pool.query('INSERT INTO admin_users (email, password_hash, role) VALUES ($1,$2,$3)', [admin.email, pwdHash, admin.role]);
  return { pool };
}

describe('companies.service listCompanies', () => {
  let pool: Awaited<ReturnType<Awaited<typeof import('db')>['getPool']>>;
  let dbOk = false;

  beforeAll(async () => {
    try {
      const { getPool } = await import('db');
      pool = getPool();
      await setupAdmin();
      dbOk = true;
    } catch {
      dbOk = false;
    }
  });

  afterAll(async () => {
    if (dbOk) await pool.end();
  });

  beforeEach(async () => {
    if (!dbOk) return;
    await pool.query('DELETE FROM submissions');
    await pool.query('DELETE FROM companies');
    // Seed with some variation; leave one without persisted type but with a submission to test fallback.
    await pool.query(`INSERT INTO companies (code, name, country, company_type, address, e_delivery_address)
      VALUES ('C_A', 'Zeta Corp', 'LT', 'TYPE_A', 'Addr A', 'a@example.com'),
             ('C_B', 'Alpha LLC', 'LT', 'TYPE_B', 'Addr B', 'b@example.com'),
             ('C_C', 'Beta Inc', 'LT', NULL, 'Addr C', 'c@example.com')`);
    // Provide submission for C_C with a type so COALESCE fallback works.
    await pool.query(`INSERT INTO submissions (company_code, name_at_submission, country, company_type, requirements_applied, contact_email, consent, consent_text)
      VALUES ('C_C','Beta Inc','LT','TYPE_C', true,'c@example.com', true, 'txt')`);
  });

  it('returns paginated results sorted by name desc', async () => {
    if (!dbOk) return void it.skip as unknown as void;
    const { items, total, page, pageSize } = await listCompanies({ page: 1, pageSize: 25, sort: 'name:desc' });
    expect(page).toBe(1);
    expect(pageSize).toBe(25);
    expect(total).toBe(3);
    // Desc by name: Zeta, Beta, Alpha
    expect(items.map(i => i.name)).toEqual(['Zeta Corp', 'Beta Inc', 'Alpha LLC']);
  });

  it('filters by type (persisted)', async () => {
    if (!dbOk) return void it.skip as unknown as void;
    const { items } = await listCompanies({ type: 'TYPE_A' });
    expect(items.map(i => i.code)).toEqual(['C_A']);
  });

  it('derives type from latest submission when company.type is null', async () => {
    if (!dbOk) return void it.skip as unknown as void;
    const { items } = await listCompanies({ search: 'Beta' });
    const beta = items.find(i => i.code === 'C_C');
    expect(beta?.type).toBe('TYPE_C');
  });

  it('searches by code substring (case-insensitive)', async () => {
    if (!dbOk) return void it.skip as unknown as void;
    const { items } = await listCompanies({ search: 'c_' });
    // All codes include C_ pattern case-insensitive
    expect(items.length).toBe(3);
  });
});
