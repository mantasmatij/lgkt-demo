import { headers, cookies } from 'next/headers';
import { fetchFormById } from '../../../../services/forms/api';
import { dictionaries, type Locale } from '../../../../i18n/dictionaries';
import { AuthGate } from '../AuthGate';
import { FormDetailsView } from '../../../../components/forms/FormDetailsView';

export default async function AdminFormDetailsPage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const { id } = await params;
  const spObj = await searchParams;
  const usp = new URLSearchParams();
  for (const [k, v] of Object.entries(spObj)) {
    if (Array.isArray(v)) v.forEach((val) => usp.append(k, val));
    else if (typeof v === 'string') usp.set(k, v);
  }
  const h = await headers();
  const cookieHeader = h.get('cookie') || '';
  let data: Awaited<ReturnType<typeof fetchFormById>> = null;
  let forbidden = false;
  let unauthenticated = false;
  let fetchError: { status?: number; body?: unknown } | null = null;
  try {
    data = await fetchFormById(id, { headers: { cookie: cookieHeader } });
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
  if (!data) {
    return (
      <main className="p-6">
        <AuthGate />
        <a className="text-gray-700 underline hover:text-gray-900" href={`/admin/forms?${usp.toString()}`}>← Back to list</a>
        {unauthenticated && (
          <div className="mb-4 p-3 border border-blue-300 bg-blue-50 text-blue-800 rounded">You’re not signed in. Redirecting to sign-in…</div>
        )}
        {forbidden && (
          <div className="mb-4 p-3 border border-yellow-300 bg-yellow-50 text-yellow-800 rounded">You don't have access to this page. Please sign in with an admin account.</div>
        )}
        {!unauthenticated && !forbidden && (
          <>
            <h1 className="text-2xl font-semibold mb-4">Form not found</h1>
            <p className="text-gray-700">The requested form could not be found.</p>
            {fetchError && (
              <div className="mt-4 p-3 border border-red-300 bg-red-50 text-red-800 rounded">Failed to load details{fetchError.status ? ` (status ${fetchError.status})` : ''}.</div>
            )}
          </>
        )}
      </main>
    );
  }
  // i18n
  const ck = await cookies();
  const localeCookie = ck.get('locale')?.value as Locale | undefined;
  const locale: Locale = (localeCookie === 'en' || localeCookie === 'lt') ? localeCookie : 'lt';
  const dict = dictionaries[locale];

  return (
    <main className="p-6">
      <AuthGate />
      <a className="text-gray-700 underline hover:text-gray-900" href={`/admin/forms?${usp.toString()}`}>← {dict.common.back_to_list}</a>
      <h1 className="text-2xl font-semibold mb-4">{dict.admin.form_details_title}</h1>
      <FormDetailsView data={data} dict={dict} />
    </main>
  );
}
