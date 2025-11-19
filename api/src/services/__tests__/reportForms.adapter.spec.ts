import { fetchFormsReport } from '../reportForms.adapter';

jest.mock('../../utils/reportRegistry', () => ({
  getReportDefinition: () => ({
    columns: [
      { key: 'id', label: 'ID' },
      { key: 'name', label: 'Name' },
      { key: 'secret', label: 'Secret' },
    ],
  }),
}));

describe('reportForms.adapter', () => {
  it('returns all columns when allowedKeys omitted', async () => {
    const res = await fetchFormsReport({});
    expect(res.columns).toEqual(['id', 'name', 'secret']);
  });

  it('filters columns and rows based on allowedKeys', async () => {
    const res = await fetchFormsReport({ allowedKeys: ['id', 'name'] });
    expect(res.columns).toEqual(['id', 'name']);
    expect(Array.isArray(res.rows)).toBe(true);
  });
});
