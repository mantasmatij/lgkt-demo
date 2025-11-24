import { fetchCompaniesReport } from '../reportCompanies.adapter';
import { getReportDefinition } from '../../utils/reportRegistry';

describe('reportCompanies.adapter', () => {
  it('returns unified forms-like columns and placeholder data', async () => {
    const def = getReportDefinition('companies-list');
    expect(def).toBeDefined();
    const result = await fetchCompaniesReport({});
    expect(result.columns).toEqual(def!.columns.map(c => c.key));
    expect(Array.isArray(result.rows)).toBe(true);
    expect(result.total).toBe(result.rows.length);
    if (result.rows.length) {
      const row = result.rows[0];
      // Ensure unified keys exist
      ['companyName','companyCode','submissionDate','womenPercent','menPercent','requirementsApplied'].forEach(k => {
        expect(row).toHaveProperty(k);
      });
    }
  });
});
