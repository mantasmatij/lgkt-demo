export const dynamic = 'force-dynamic';

import { FormsFilters } from '../../../components/forms/Filters';
import { FormsTable } from '../../../components/forms/Table';
import { FormsPagination } from '../../../components/forms/Pagination';
import { Card } from '@heroui/react';
import { RetryButton } from '../../../components/forms/RetryButton';
import type { ListResponse } from 'validation';
import { AuthGate } from './AuthGate';
import { encode as encodeState, decode as decodeState } from '../../../services/forms/urlState';
import { fetchForms } from '../../../services/forms/api';
import { headers } from 'next/headers';
import { cookies } from 'next/headers';
import { dictionaries, type Locale } from '../../../i18n/dictionaries';

export default async function AdminFormsPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const spObj = await searchParams;
  const usp = new URLSearchParams();
  for (const [k, v] of Object.entries(spObj)) {
    if (Array.isArray(v)) v.forEach((val) => usp.append(k, val));
    else if (typeof v === 'string') usp.set(k, v);
  }
  const decoded = decodeState(usp);
  const normalized = encodeState(decoded);
  let data: ListResponse | null = null;
  let forbidden = false;
  let unauthenticated = false;
  let fetchError: { status?: number; body?: unknown } | null = null;
  try {
  const h = await headers();
    const cookieHeader = h.get('cookie') || '';
    data = await fetchForms(normalized, { headers: { cookie: cookieHeader } });
  } catch (e: unknown) {
    const err = e as Error & { status?: number; body?: unknown };
    if (err?.status === 401) {
      unauthenticated = true;
    } else if (err?.status === 403) {
      forbidden = true;
    } else {
      const withBody = err as { body?: unknown };
      fetchError = { status: err?.status, body: withBody?.body };
    }
    data = { page: 1, pageSize: 25, total: 0, items: [] };
  }
  // i18n locale from cookie
  const ck = await cookies();
  const localeCookie = ck.get('locale')?.value as Locale | undefined;
  const locale: Locale = (localeCookie === 'en' || localeCookie === 'lt') ? localeCookie : 'lt';
  const dict = dictionaries[locale];
  // const tc = (k: keyof typeof dict.common) => dict.common[k];
  const tadmin = (k: keyof typeof dict.admin) => dict.admin[k];
  // const tform = (k: keyof typeof dict.form) => dict.form[k];
  // const tf = (k: keyof typeof dict.fields) => dict.fields[k];
  return (
    <main className="p-6">
      <AuthGate />
      <h1 className="text-2xl font-semibold mb-4">{tadmin('forms_list_title')}</h1>
      {forbidden && (
        <div className="mb-4 p-3 border border-yellow-300 bg-yellow-50 text-yellow-800 rounded">
          {/* TODO: add dedicated unauthorized string */}You don't have access to this page. Please sign in with an admin account.
        </div>
      )}
      {unauthenticated && (
        <div className="mb-4 p-3 border border-blue-300 bg-blue-50 text-blue-800 rounded">
          {/* TODO: add i18n string for unauthenticated message */}You’re not signed in. Redirecting to sign-in…
        </div>
      )}
      {fetchError && !forbidden && !unauthenticated && (
        <div className="mb-4 p-3 border border-red-300 bg-red-50 text-red-800 rounded flex items-center">
          <span>{/* TODO: translate error message */}Failed to load forms{fetchError.status ? ` (status ${fetchError.status})` : ''}. Try again or contact support.</span>
          <RetryButton />
        </div>
      )}
      <Card className="p-4 mb-4">
        <FormsFilters />
      </Card>
    {(data.items.length === 0 && !unauthenticated && !forbidden && !fetchError && (decoded.company || decoded.submissionDateFrom || decoded.submissionDateTo || decoded.reportPeriodFrom || decoded.reportPeriodTo || decoded.genderImbalance || decoded.genderAlignment || decoded.requirementsApplied)) && (
  <div className="mb-3 text-gray-700">{tadmin('forms_no_results_filters')}</div>
      )}
      {!unauthenticated && !forbidden && !fetchError && (
        <>
          <Card className="p-0 mb-4 overflow-hidden">
            <div className="p-2">
              <FormsTable items={data.items} baseQuery={normalized} />
            </div>
          </Card>
          <Card className="p-2">
            <FormsPagination page={data.page} pageSize={data.pageSize as 10 | 25 | 50 | 100} total={data.total} />
          </Card>
        </>
      )}
    </main>
  );
}
