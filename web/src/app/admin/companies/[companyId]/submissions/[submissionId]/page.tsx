export const dynamic = 'force-dynamic';

import { Card } from '@heroui/react';
import { headers, cookies } from 'next/headers';
import { dictionaries, type Locale } from '../../../../../../i18n/dictionaries';
import { AuthGate } from '../../../../forms/AuthGate';
import { fetchFormById } from '../../../../../../services/forms/api';
import { FormDetailsView } from '../../../../../../components/forms/FormDetailsView';

interface PageProps { params: Promise<{ companyId: string; submissionId: string }>; searchParams: Promise<Record<string,string|string[]|undefined>> }

export default async function SubmissionDetailPage({ params, searchParams }: PageProps) {
  const { submissionId } = await params;
  const spObj = await searchParams;
  const fromCompany = typeof spObj.fromCompany === 'string' ? spObj.fromCompany : undefined;

  const h = await headers();
  const cookieHeader = h.get('cookie') || '';

  let data: Awaited<ReturnType<typeof fetchFormById>> = null;
  let forbidden = false;
  let unauthenticated = false;
  let fetchError: { status?: number; body?: unknown } | null = null;
  try {
    data = await fetchFormById(submissionId, { headers: { cookie: cookieHeader } });
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

  const backHref = fromCompany ? `/admin/companies/${fromCompany}` : '/admin/forms';

  return (
    <main className="p-6">
      <AuthGate />
      <a className="text-gray-700 underline hover:text-gray-900" href={backHref}>← {dict.common.back_to_list}</a>
      <h1 className="text-2xl font-semibold mb-4">{dict.admin.form_details_title}</h1>

      {unauthenticated && (
        <div className="mb-4 p-3 border border-blue-300 bg-blue-50 text-blue-800 rounded">You’re not signed in. Redirecting to sign-in…</div>
      )}
      {forbidden && (
        <div className="mb-4 p-3 border border-yellow-300 bg-yellow-50 text-yellow-800 rounded">You don't have access to this page. Please sign in with an admin account.</div>
      )}
      {fetchError && !forbidden && !unauthenticated && (
        <div className="mb-4 p-3 border border-red-300 bg-red-50 text-red-800 rounded">Failed to load details{fetchError.status ? ` (status ${fetchError.status})` : ''}.</div>
      )}

      {!unauthenticated && !forbidden && !fetchError && data && (
        <FormDetailsView data={data} dict={dict} />
      )}
      {!unauthenticated && !forbidden && !fetchError && !data && (
        <Card className="p-4 mb-4" role="alert">
          <div>Submission not found.</div>
        </Card>
      )}
    </main>
  );
}
