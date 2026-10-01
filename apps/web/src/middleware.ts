import { NextRequest, NextResponse } from 'next/server';
import { verifySession, AUTH_CONFIG } from '@/lib/auth';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isProtectedPath = pathname.startsWith('/dashboard') || pathname.startsWith('/onboarding');
  const isAuthPath = pathname === '/login' || pathname === '/signup';

  const token = request.cookies.get(AUTH_CONFIG.SESSION_COOKIE_NAME)?.value;
  const session = token ? await verifySession(token) : null;

  // 1. Direct unauthenticated access to protected routes -> Redirect to login with return target
  if (isProtectedPath && !session) {
    const loginUrl = new URL('/login', request.nextUrl.origin);
    loginUrl.searchParams.set('redirect', pathname + request.nextUrl.search);
    const response = NextResponse.redirect(loginUrl);
    if (token) {
      // Clear corrupt/expired token
      response.cookies.delete(AUTH_CONFIG.SESSION_COOKIE_NAME);
    }
    return response;
  }

  // 2. Authenticated user visiting /login or /signup -> redirect to dashboard
  if (isAuthPath && session) {
    return NextResponse.redirect(new URL('/dashboard', request.nextUrl.origin));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/onboarding/:path*',
    '/login',
    '/signup',
  ],
};
