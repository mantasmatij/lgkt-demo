import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

function genToken(len = 32) {
  const bytes = new Uint8Array(len);
  if (typeof crypto !== 'undefined' && 'getRandomValues' in crypto) {
    crypto.getRandomValues(bytes);
  } else {
    for (let i = 0; i < len; i++) bytes[i] = Math.floor(Math.random() * 256);
  }
  return Array.from(bytes).map((b) => b.toString(16).padStart(2, '0')).join('');
}

export async function GET() {
  const ck = await cookies();
  let token = ck.get('csrf')?.value;
  if (!token) {
    token = genToken(16);
    ck.set('csrf', token, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 60 * 60, // 1h
    });
  }
  return NextResponse.json({ token });
}
