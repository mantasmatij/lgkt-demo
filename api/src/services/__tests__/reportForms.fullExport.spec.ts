import { fetchFormsReport } from '../reportForms.adapter';

jest.mock('../../utils/reportRegistry', () => ({
  getReportDefinition: () => ({
    columns: [
      { key: 'id', label: 'ID' },
      { key: 'companyName', label: 'Company Name' },
      { key: 'companyCode', label: 'Company Code' },
    ],
  }),
}));

// Mock db returning empty arrays so we can inspect columns list for fullExport
jest.mock('db', () => ({
  getDb: () => ({
    select: () => ({
      from: () => ({
        where: () => ({ orderBy: () => ({ limit: () => Promise.resolve([]) }) }),
      }),
    }),
  }),
  submissions: {},
  genderBalanceRows: {},
}));


describe('reportForms.adapter fullExport columns', () => {
  it('includes extended fields for full export', async () => {
    const res = await fetchFormsReport({ fullExport: true, limit: 1 });
    // Expect some key fields present beyond preview
    const expectedKeys = [
      'legalForm','address','registry','eDeliveryAddress',
      'contactName','contactPhone','notes','consent','consentText','requirementsLink',
      'totalsWomen','totalsMen','totalsTotal','genderBalanceRows','organs','measures','attachments','meta'
    ];
    expectedKeys.forEach(k => expect(res.columns).toContain(k));
  });
});
