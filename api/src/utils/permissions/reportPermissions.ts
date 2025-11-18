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
