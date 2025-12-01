import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export const config = {
  matcher: ['/api/:path*'],
};

export default function middleware(req: NextRequest) {
  const target = process.env.API_INTERNAL_ORIGIN;
  if (!target) return NextResponse.next();

  const url = new URL(req.url);
  const dest = new URL(url.pathname + url.search, target);
  return NextResponse.rewrite(dest);
}
