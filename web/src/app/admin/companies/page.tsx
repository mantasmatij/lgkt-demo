export const dynamic = 'force-dynamic';

import { Card } from '@heroui/react';
import { RetryButton } from '../../../components/forms/RetryButton';
import { FormsPagination } from '../../../components/forms/Pagination';
import { headers, cookies } from 'next/headers';
import { dictionaries, type Locale } from '../../../i18n/dictionaries';
import { fetchCompanies } from '../../../services/companies/list';
import { AuthGate } from '../forms/AuthGate';
import { COMPANY_TYPE_LABEL_KEYS } from '../../../lib/constants/companyType';
import { CompaniesFilters } from '../../../components/companies/Filters';

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

  try {
    const h = await headers();
    const cookieHeader = h.get('cookie') || '';
    data = await fetchCompanies(query, { headers: { cookie: cookieHeader } });
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
            <CompaniesFilters />
          </Card>
          <Card className="p-2 mb-4">
            <FormsPagination page={data.page} pageSize={data.pageSize as 10 | 25 | 50 | 100} total={data.total} />
          </Card>
          <Card className="p-0 mb-4 overflow-hidden">
            <div className="p-2 overflow-x-auto">
              {isEmpty ? (
                <p className="text-gray-600">
                  {/* If there's any active search/filter param, show a distinct empty message */}
                  {usp.get('search') ? dict.admin.forms_no_results_filters : tadmin('companies_empty_hint')}
                </p>
              ) : (
                <table className="min-w-full border-collapse border-2 border-gray-300 rounded">
                  <caption className="sr-only">{tadmin('companies_table_aria')}</caption>
                  <thead>
                    <tr className="text-left bg-gray-50 border-b border-gray-200">
                      <th className="py-2 pr-4 pl-6">{dict.admin.companies_columns_company_name}</th>
                      <th className="py-2 pr-4">{dict.admin.companies_columns_company_code}</th>
                      <th className="py-2 pr-4">{dict.admin.table_col_type}</th>
                      <th className="py-2 pr-4">{dict.fields.address}</th>
                      <th className="py-2 pr-4">{dict.fields.e_delivery_address}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.items.map((c) => {
                      const typeKey = c.type as keyof typeof COMPANY_TYPE_LABEL_KEYS | undefined;
                      const labelKey = typeKey && COMPANY_TYPE_LABEL_KEYS[typeKey];
                      const typeLabel = labelKey ? (dict.fields as Record<string,string>)[labelKey] : (c.type ?? '');
                      return (
                      <tr key={c.id} className="border-b last:border-b-0 border-gray-200">
                        <td className="py-2 pr-4 pl-6">{c.name}</td>
                        <td className="py-2 pr-4">{c.code}</td>
                        <td className="py-2 pr-4">{typeLabel}</td>
                        <td className="py-2 pr-4">{c.address ?? ''}</td>
                        <td className="py-2 pr-4">{c.eDeliveryAddress ?? ''}</td>
                      </tr>
                    );})}
                  </tbody>
                </table>
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
