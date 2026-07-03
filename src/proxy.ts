import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * IRONFORGE — Edge middleware.
 *
 * Layer 0 in the 5-layer architecture (Skills KB §9).
 *
 * Purpose:
 *  - Check for auth session cookie on /admin/* routes (except /admin/login)
 *  - If no session cookie, redirect to /admin/login
 *  - The actual role check (admin vs member) happens in the admin layout
 *    (server component) — middleware only checks cookie presence (fast, edge)
 *
 * Reference: Skills KB §12 (Auth-First Server Action pattern).
 * Reference: T2 lesson — trustHost:true means we can rely on the cookie at edge.
 */

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only protect /admin/* (except /admin/login)
  if (!pathname.startsWith('/admin')) {
    return NextResponse.next();
  }

  if (pathname === '/admin/login') {
    return NextResponse.next();
  }

  // Check for session cookie (Auth.js v5 uses 'authjs.session-token' or
  // '__Secure-authjs.session-token' in production)
  const sessionCookie =
    request.cookies.get('authjs.session-token') ??
    request.cookies.get('__Secure-authjs.session-token');

  if (!sessionCookie) {
    const loginUrl = new URL('/admin/login', request.url);
    loginUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
};
