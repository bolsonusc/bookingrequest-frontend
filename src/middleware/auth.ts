
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('supabase-auth-token');

  if (!token && !pathname.startsWith('/auth/')) {
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/client/:path*',
    '/provider/:path*',
    '/admin/:path*',
  ],
};
