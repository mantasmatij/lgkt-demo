export const dynamic = 'force-dynamic';

import { Card } from '@heroui/react';
import { headers, cookies } from 'next/headers';
import Link from 'next/link';
import { RetryButton } from '../../../../components/forms/RetryButton';
import { FormsPagination } from '../../../../components/forms/Pagination';
import { dictionaries, type Locale } from '../../../../i18n/dictionaries';
import { COMPANY_TYPE_LABEL_KEYS } from '../../../../lib/constants/companyType';
import { fetchCompanyDetail } from '../../../../services/companies/detail';
import { fetchCompanySubmissions } from '../../../../services/companies/submissions';
import { AuthGate } from '../../forms/AuthGate';

type PageProps = {
  params: Promise<{ companyId: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function AdminCompanyDetailPage({ params, searchParams }: PageProps) {
  const { companyId } = await params;
  const spObj = await searchParams;
  const usp = new URLSearchParams();
  for (const [k, v] of Object.entries(spObj)) {
    if (Array.isArray(v)) v.forEach((val) => usp.append(k, val));
    else if (typeof v === 'string') usp.set(k, v);
  }
  const qs = usp.toString() ? `?${usp.toString()}` : '';

  let forbidden = false;
  let unauthenticated = false;
  let fetchError: { status?: number; body?: unknown } | null = null;

  let detail: Awaited<ReturnType<typeof fetchCompanyDetail>> | null = null;
  let submissions: Awaited<ReturnType<typeof fetchCompanySubmissions>> = { items: [], page: 1, pageSize: 25, total: 0 };

  try {
    const h = await headers();
    const cookieHeader = h.get('cookie') || '';
    const init = { headers: { cookie: cookieHeader } } as RequestInit;
    // Fetch detail first (for 404 handling), then submissions
    detail = await fetchCompanyDetail(companyId, init);
    submissions = await fetchCompanySubmissions(companyId, qs, init);
  } catch (e: unknown) {
    const err = e as Error & { status?: number; body?: unknown };
    if (err?.status === 401) {
      unauthenticated = true;
    } else if (err?.status === 403) {
      forbidden = true;
    } else if (err?.status === 404) {
      fetchError = { status: 404, body: { message: 'Not found' } };
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
  const tcommon = (k: keyof typeof dict.common) => dict.common[k];

  const typeLabel = (() => {
    if (!detail?.type) return '';
    const typeKey = detail.type as keyof typeof COMPANY_TYPE_LABEL_KEYS | undefined;
    const labelKey = typeKey && COMPANY_TYPE_LABEL_KEYS[typeKey];
    return labelKey ? (dict.fields as Record<string,string>)[labelKey] : (detail.type ?? '');
  })();

  return (
    <main className="p-6">
      <AuthGate />
      <div className="mb-4 flex items-center gap-3">
  <h1 className="text-2xl font-semibold">{tadmin('companies_title')}</h1>
  <Link className="text-blue-600 hover:underline" href="/admin/companies">{tcommon('back_to_list')}</Link>
      </div>

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
          <span>Failed to load company{fetchError.status ? ` (status ${fetchError.status})` : ''}. Try again or contact support.</span>
          <RetryButton />
        </div>
      )}

      {!unauthenticated && !forbidden && !fetchError && detail && (
        <>
          <Card className="p-4 mb-4">
            <h2 className="text-xl font-semibold mb-3">{tadmin('companies_title')}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <div className="text-sm text-gray-600">{dict.fields.company_name}</div>
                <div className="font-medium">{detail.name}</div>
              </div>
              <div>
                <div className="text-sm text-gray-600">{dict.fields.company_code}</div>
                <div className="font-medium">{detail.code}</div>
              </div>
              <div>
                <div className="text-sm text-gray-600">{dict.admin.table_col_type}</div>
                <div className="font-medium">{typeLabel}</div>
              </div>
              <div>
                <div className="text-sm text-gray-600">{dict.fields.legal_form}</div>
                <div className="font-medium">{detail.legalForm ?? '—'}</div>
              </div>
              <div>
                <div className="text-sm text-gray-600">{dict.fields.address}</div>
                <div className="font-medium">{detail.address ?? '—'}</div>
              </div>
              <div>
                <div className="text-sm text-gray-600">{dict.fields.registry}</div>
                <div className="font-medium">{detail.registry ?? '—'}</div>
              </div>
              <div>
                <div className="text-sm text-gray-600">{dict.fields.e_delivery_address}</div>
                <div className="font-medium">{detail.eDeliveryAddress ?? '—'}</div>
              </div>
            </div>
          </Card>

          <Card className="p-4 mb-4">
            <h2 className="text-xl font-semibold mb-3">{tadmin('submissions_table_aria')}</h2>
            <div className="p-2 overflow-x-auto">
              {submissions.items.length === 0 ? (
                <p className="text-gray-600">{tadmin('no_submissions_yet')}</p>
              ) : (
                <table className="min-w-full border-collapse border-2 border-gray-300 rounded">
                  <caption className="sr-only">{tadmin('submissions_table_aria')}</caption>
                  <thead>
                    <tr className="text-left bg-gray-50 border-b border-gray-200">
                      <th className="py-2 pr-4 pl-6">{tadmin('table_col_report_from')}</th>
                      <th className="py-2 pr-4">{tadmin('table_col_report_to')}</th>
                      <th className="py-2 pr-4">{tadmin('table_col_women_pct')}</th>
                      <th className="py-2 pr-4">{tadmin('table_col_men_pct')}</th>
                      <th className="py-2 pr-4">{tadmin('table_col_requirements_applied')}</th>
                      <th className="py-2 pr-4">{tadmin('table_col_submitter_email')}</th>
                      <th className="py-2 pr-4">{tadmin('table_col_submission_date')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {submissions.items.map((s) => (
                      <tr key={s.id} className="border-b last:border-b-0 border-gray-200">
                        <td className="py-2 pr-4 pl-6">{s.dateFrom ?? ''}</td>
                        <td className="py-2 pr-4">{s.dateTo ?? ''}</td>
                        <td className="py-2 pr-4">{s.womenPercent}%</td>
                        <td className="py-2 pr-4">{s.menPercent}%</td>
                        <td className="py-2 pr-4">{s.requirementsApplied ? tcommon('yes') : tcommon('no')}</td>
                        <td className="py-2 pr-4">{s.submitterEmail ?? ''}</td>
                        <td className="py-2 pr-4">{new Date(s.submittedAt).toISOString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
            <div className="mt-2">
              <FormsPagination page={submissions.page} pageSize={submissions.pageSize as 10 | 25 | 50 | 100} total={submissions.total} />
            </div>
          </Card>
        </>
      )}
    </main>
  );
}
