import { fetchFormsReport } from '../reportForms.adapter';
import { randomUUID } from 'crypto';

// Use real DB to validate inside-range filter behavior

describe('reportForms.adapter date range filtering', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let db: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let companies: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let submissions: any;
  const tempCompanyCode = `TC_TEST_${Math.random().toString(36).slice(2, 8)}`;
  const tempCompanyId = randomUUID();
  const subInsideId = randomUUID();
  const subOverlapId = randomUUID();

  beforeAll(async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const mod: any = await import('db');
    db = mod.getDb();
    companies = mod.companies;
    submissions = mod.submissions;
    await db.insert(companies).values({
      id: tempCompanyId,
      code: tempCompanyCode,
      name: 'Temp Co',
      country: 'LT',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await db.insert(submissions).values([
      {
        id: subInsideId,
        companyCode: tempCompanyCode,
        nameAtSubmission: 'Temp Co',
        country: 'LT',
        reportingFrom: new Date('2025-01-05T00:00:00Z'),
        reportingTo: new Date('2025-01-20T00:00:00Z'),
        contactName: 'A',
        contactEmail: 'a@example.com',
        contactPhone: '1',
        consent: true,
        consentText: 'ok',
        requirementsApplied: true,
        createdAt: new Date('2025-01-25T00:00:00Z')
      },
      {
        id: subOverlapId,
        companyCode: tempCompanyCode,
        nameAtSubmission: 'Temp Co',
        country: 'LT',
        // overlaps but starts before filter 'from'
        reportingFrom: new Date('2024-12-20T00:00:00Z'),
        reportingTo: new Date('2025-01-10T00:00:00Z'),
        contactName: 'B',
        contactEmail: 'b@example.com',
        contactPhone: '2',
        consent: true,
        consentText: 'ok',
        requirementsApplied: true,
        createdAt: new Date('2025-01-10T00:00:00Z')
      }
    ]);
  });

  afterAll(async () => {
    const { inArray, eq } = await import('drizzle-orm');
    await db.delete(submissions).where(inArray(submissions.id, [subInsideId, subOverlapId]));
    await db.delete(companies).where(eq(companies.id, tempCompanyId));
  });

  it('returns only submissions fully inside the filter range', async () => {
    const res = await fetchFormsReport({ filters: { dateRange: { from: '2025-01-01', to: '2025-01-31' } } });
    const ids = res.rows.map((r) => r.id);
    expect(ids).toContain(subInsideId);
    expect(ids).not.toContain(subOverlapId);
  });
});
