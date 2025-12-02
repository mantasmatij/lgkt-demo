import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

type Locale = 'lt' | 'en';

export async function GET() {
  const ck = await cookies();
  const current = ck.get('locale')?.value as Locale | undefined;
  const locale: Locale = current === 'en' || current === 'lt' ? current : 'lt';
  return NextResponse.json({ locale });
}

export async function POST(req: Request) {
  const ck = await cookies();
  const csrfCookie = ck.get('csrf')?.value;
  const csrfHeader = (req.headers.get('x-csrf-token') || '').trim();
  if (!csrfCookie || !csrfHeader || csrfCookie !== csrfHeader) {
    return new NextResponse(JSON.stringify({ message: 'Invalid CSRF token' }), { status: 403, headers: { 'content-type': 'application/json; charset=utf-8' } });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return new NextResponse(JSON.stringify({ message: 'Invalid JSON' }), { status: 400, headers: { 'content-type': 'application/json; charset=utf-8' } });
  }

  const next = (body as { locale?: string })?.locale;
  if (next !== 'en' && next !== 'lt') {
    return new NextResponse(JSON.stringify({ message: 'Unsupported locale' }), { status: 400, headers: { 'content-type': 'application/json; charset=utf-8' } });
  }

  ck.set('locale', next, {
    httpOnly: false,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 24 * 365, // 1 year
  });
  return NextResponse.json({ ok: true, locale: next satisfies Locale });
}
