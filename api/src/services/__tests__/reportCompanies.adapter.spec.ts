import { fetchCompaniesReport } from '../reportCompanies.adapter';
import { getReportDefinition } from '../../utils/reportRegistry';

describe('reportCompanies.adapter', () => {
  it('returns columns derived from registry and empty rows placeholder', async () => {
    const def = getReportDefinition('companies-list');
    expect(def).toBeDefined();
    const result = await fetchCompaniesReport({});
    expect(result.columns).toEqual(def!.columns.map(c => c.key));
    expect(Array.isArray(result.rows)).toBe(true);
    expect(result.total).toBe(0);
  });
});
