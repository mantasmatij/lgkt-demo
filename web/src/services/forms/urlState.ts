export type SortField =
  | 'submissionDate'
  | 'companyName'
  | 'companyCode'
  | 'reportPeriodFrom'
  | 'reportPeriodTo'
  | 'womenPercent'
  | 'menPercent';

export type SortDir = 'asc' | 'desc';

export type Filters = {
  company?: string;
  companyType?: 'LISTED' | 'STATE_OWNED' | 'LARGE';
  submissionDateFrom?: string; // YYYY-MM-DD
  submissionDateTo?: string;   // YYYY-MM-DD
  reportPeriodFrom?: string;   // YYYY-MM-DD
  reportPeriodTo?: string;     // YYYY-MM-DD
  genderImbalance?: 'outside_33_67';
  genderAlignment?: 'meets_33' | 'not_meet_33';
  requirementsApplied?: 'yes' | 'no';
};

export type ListState = Filters & {
  page?: number;
  pageSize?: 10 | 25 | 50 | 100;
  sortBy?: SortField;
  sortDir?: SortDir;
};

export function encode(state: ListState): string {
  const params = new URLSearchParams();
  if (state.page && state.page > 1) params.set('page', String(state.page));
  if (state.pageSize && state.pageSize !== 25) params.set('pageSize', String(state.pageSize));
  if (state.sortBy && state.sortBy !== 'submissionDate') params.set('sortBy', state.sortBy);
  if (state.sortDir && state.sortDir !== 'desc') params.set('sortDir', state.sortDir);
  if (state.company) params.set('company', state.company);
  if (state.companyType) params.set('companyType', state.companyType);
  if (state.submissionDateFrom) params.set('submissionDateFrom', state.submissionDateFrom);
  if (state.submissionDateTo) params.set('submissionDateTo', state.submissionDateTo);
  if (state.reportPeriodFrom) params.set('reportPeriodFrom', state.reportPeriodFrom);
  if (state.reportPeriodTo) params.set('reportPeriodTo', state.reportPeriodTo);
  if (state.genderImbalance) params.set('genderImbalance', state.genderImbalance);
  if (state.genderAlignment) params.set('genderAlignment', state.genderAlignment);
  if (state.requirementsApplied) params.set('requirementsApplied', state.requirementsApplied);
  const q = params.toString();
  return q ? `?${q}` : '';
}

export function decode(searchParams: URLSearchParams): ListState {
  const page = parseInt(searchParams.get('page') || '1', 10);
  const pageSize = parseInt(searchParams.get('pageSize') || '25', 10) as 10 | 25 | 50 | 100;
  const sortBy = (searchParams.get('sortBy') || 'submissionDate') as SortField;
  const sortDir = (searchParams.get('sortDir') || 'desc') as SortDir;
  const state: ListState = {
    page: Number.isFinite(page) && page > 0 ? page : 1,
    pageSize: ([10, 25, 50, 100] as const).includes(pageSize) ? pageSize : 25,
    sortBy,
    sortDir,
  };
  const setString = (k: keyof Filters) => {
    const v = searchParams.get(k);
    if (v) {
      // Type guard assignment per known keys
      (state as Record<string, unknown>)[k as string] = v;
    }
  };
  setString('company');
  const ct = searchParams.get('companyType');
  if (ct === 'LISTED' || ct === 'STATE_OWNED' || ct === 'LARGE') {
    state.companyType = ct;
  }
  setString('submissionDateFrom');
  setString('submissionDateTo');
  setString('reportPeriodFrom');
  setString('reportPeriodTo');
  const gi = searchParams.get('genderImbalance');
  if (gi === 'outside_33_67') state.genderImbalance = 'outside_33_67';
  const ga = searchParams.get('genderAlignment');
  if (ga === 'meets_33' || ga === 'not_meet_33') state.genderAlignment = ga;
  const ra = searchParams.get('requirementsApplied');
  if (ra === 'yes' || ra === 'no') state.requirementsApplied = ra;
  return state;
}
