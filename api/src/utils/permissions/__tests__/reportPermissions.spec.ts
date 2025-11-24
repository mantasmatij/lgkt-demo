import { allowedColumnKeys, applyFieldPermissionsToRows, filterUnauthorizedFields, canExport } from '../reportPermissions';

describe('reportPermissions helpers', () => {
  const user = { id: 'u1', roles: ['admin'] };

  it('canExport inherits view access (truthy for any role)', () => {
    expect(canExport({ user, reportType: 'companies-list' })).toBe(true);
    expect(canExport({ user: { id: 'u2', roles: ['viewer'] }, reportType: 'forms-list' })).toBe(true);
  });

  it('allowedColumnKeys returns provided keys by default (MVP)', () => {
    const cols = ['a', 'b', 'c'];
    expect(allowedColumnKeys('companies-list', user, cols)).toEqual(cols);
  });

  it('filterUnauthorizedFields keeps only allowed keys', () => {
    const row = { a: 1, b: 2, c: 3 };
    const filtered = filterUnauthorizedFields(row, ['a', 'c']);
    expect(filtered).toEqual({ a: 1, c: 3 });
  });

  it('applyFieldPermissionsToRows maps across rows', () => {
    const rows = [
      { a: 1, b: 2, c: 3 },
      { a: 10, b: 20, c: 30 },
    ];
    const res = applyFieldPermissionsToRows(rows, ['b']);
    expect(res).toEqual([{ b: 2 }, { b: 20 }]);
  });
});
