export const dynamic = 'force-dynamic';

import { Card } from '@heroui/react';
import { RetryButton } from '../../../components/forms/RetryButton';
import { FormsPagination } from '../../../components/forms/Pagination';
import { headers, cookies } from 'next/headers';
import { dictionaries, type Locale } from '../../../i18n/dictionaries';
import { fetchCompanies } from '../../../services/companies/list';
import { AuthGate } from '../forms/AuthGate';
import { CompaniesTable } from './CompaniesTable';
import { CompaniesFilters } from '../../../components/companies/Filters';
import { fetchCompanyAllowedValues, type CompaniesAllowedValues } from '../../../services/companies/allowedValues';

export default async function AdminCompaniesPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const spObj = await searchParams;
  const usp = new URLSearchParams();
  for (const [k, v] of Object.entries(spObj)) {
    if (Array.isArray(v)) v.forEach((val) => usp.append(k, val));
    else if (typeof v === 'string') usp.set(k, v);
  }
  const query = usp.toString() ? `?${usp.toString()}` : '';

  let forbidden = false;
  let unauthenticated = false;
  let fetchError: { status?: number; body?: unknown } | null = null;
  let data: { items: Array<{ id: string; name: string; code: string; type?: string | null; address?: string | null; eDeliveryAddress?: string | null }>; page: number; pageSize: number; total: number } = { items: [], page: 1, pageSize: 25, total: 0 };

  let allowedValues: CompaniesAllowedValues | null = null;
  try {
    const h = await headers();
    const cookieHeader = h.get('cookie') || '';
    data = await fetchCompanies(query, { headers: { cookie: cookieHeader } });
    // Fetch allowed values
    try { allowedValues = await fetchCompanyAllowedValues({ headers: { cookie: cookieHeader } }); } catch { /* non-fatal */ }
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
  }

  const ck = await cookies();
  const localeCookie = ck.get('locale')?.value as Locale | undefined;
  const locale: Locale = (localeCookie === 'en' || localeCookie === 'lt') ? localeCookie : 'lt';
  const dict = dictionaries[locale];
  const tadmin = (k: keyof typeof dict.admin) => dict.admin[k];

  const isEmpty = !data || data.items.length === 0;

  return (
    <main className="p-6">
      <AuthGate />
      <h1 className="text-2xl font-semibold mb-4">{tadmin('companies_title')}</h1>
      {forbidden && (
        <div className="mb-4 p-3 border border-yellow-300 bg-yellow-50 text-yellow-800 rounded">
          You don't have access to this page. Please sign in with an admin account.
        </div>
      )}
      {unauthenticated && (
        <div className="mb-4 p-3 border border-blue-300 bg-blue-50 text-blue-800 rounded">
          You’re not signed in. Redirecting to sign-in…
        </div>
      )}
      {fetchError && !forbidden && !unauthenticated && (
        <div className="mb-4 p-3 border border-red-300 bg-red-50 text-red-800 rounded flex items-center">
          <span>Failed to load companies{fetchError.status ? ` (status ${fetchError.status})` : ''}. Try again or contact support.</span>
          <RetryButton />
        </div>
      )}
      {!unauthenticated && !forbidden && !fetchError && (
        <>
          <Card className="p-4 mb-4">
            <CompaniesFilters types={allowedValues?.types}
            />
          </Card>
          <Card className="p-2 mb-4">
            <FormsPagination page={data.page} pageSize={data.pageSize as 10 | 25 | 50 | 100} total={data.total} />
          </Card>
          <Card className="p-0 mb-4">
            <div className="p-2 overflow-x-auto">
              {isEmpty ? (
                <p className="text-gray-600">
                  {/* If there's any active search/filter param, show a distinct empty message */}
                  {usp.get('search') ? dict.admin.forms_no_results_filters : tadmin('companies_empty_hint')}
                </p>
              ) : (
                <CompaniesTable items={data.items} dict={dict} />
              )}
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
