export type SortDir = 'asc' | 'desc';

export function normalizePage(page?: number): number {
  const p = Number(page ?? 1);
  return Number.isFinite(p) && p > 0 ? Math.floor(p) : 1;
}

export function normalizePageSize(pageSize?: number): 10 | 25 | 50 | 100 {
  const allowed = [10, 25, 50, 100] as const;
  const ps = Number(pageSize ?? 25) as 10 | 25 | 50 | 100;
  return (allowed as readonly number[]).includes(ps) ? ps : 25;
}

export function getOffset(page: number, pageSize: number): number {
  return (normalizePage(page) - 1) * normalizePageSize(pageSize);
}

export function normalizeSort<T extends string>(
  sortBy: T | undefined,
  sortDir: SortDir | undefined,
  defaults: { sortBy: T; sortDir: SortDir }
): { sortBy: T; sortDir: SortDir } {
  const dir: SortDir = sortDir === 'asc' || sortDir === 'desc' ? sortDir : defaults.sortDir;
  return { sortBy: (sortBy ?? defaults.sortBy) as T, sortDir: dir };
}
