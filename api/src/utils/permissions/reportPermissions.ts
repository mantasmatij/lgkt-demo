// Permission helper for reporting MVP.
// Export permission inherits underlying view permission; no separate export scope.

export interface UserContext {
  id: string;
  roles: string[];
  // Additional claims could be added here.
}

export interface PermissionArgs {
  user: UserContext;
  reportType: 'companies-list' | 'forms-list';
}

// Placeholder logic; integrate with existing auth/role checks.
function hasViewAccess(user: UserContext, reportType: string): boolean {
  // Basic heuristic: any authenticated role can view; refine via integration.
  return !!user && Array.isArray(user.roles) && user.roles.length > 0;
}

export function canExport(args: PermissionArgs): boolean {
  return hasViewAccess(args.user, args.reportType);
}

export function filterUnauthorizedFields<T extends Record<string, unknown>>(row: T, allowedKeys: string[]): T {
  const filtered: Record<string, unknown> = {};
  for (const key of allowedKeys) {
    if (key in row) filtered[key] = row[key];
  }
  return filtered as T;
}

// Field-level permissions: determine which column keys are allowed for a given user and report type.
// MVP default: all provided columns are allowed. Extend with real policy mapping by role/report.
export function allowedColumnKeys(
  reportType: 'companies-list' | 'forms-list',
  user: UserContext,
  allColumnKeys: string[]
): string[] {
  // Placeholder for policy-based filtering, e.g., by role or reportType
  // Example: if (!user.roles.includes('admin')) return allColumnKeys.filter(k => k !== 'sensitiveField');
  return allColumnKeys;
}

// Convenience helper to filter a list of rows to only allowed keys
export function applyFieldPermissionsToRows<T extends Record<string, unknown>>(
  rows: T[],
  allowedKeys: string[]
): T[] {
  return rows.map((r) => filterUnauthorizedFields(r, allowedKeys));
}
