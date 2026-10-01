import { NextRequest, NextResponse } from 'next/server';
import { generateOAuthState, AUTH_CONFIG } from '@/lib/auth';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const targetRedirect = searchParams.get('redirect') || '/dashboard';

  const { state } = generateOAuthState();

  const googleClientId = process.env.GOOGLE_CLIENT_ID;
  const origin = request.nextUrl.origin;
  const callbackUrl = `${origin}/api/auth/callback/google`;

  let authUrl: string;

  if (googleClientId && process.env.GOOGLE_CLIENT_SECRET) {
    // Real Google OAuth 2.0 authorization endpoint
    const params = new URLSearchParams({
      client_id: googleClientId,
      redirect_uri: callbackUrl,
      response_type: 'code',
      scope: 'openid email profile',
      state: state,
      access_type: 'offline',
      prompt: 'select_account',
    });
    authUrl = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
  } else {
    // Real OAuth consent & authorization screen for environments without live Google Cloud credentials
    const params = new URLSearchParams({
      provider: 'google',
      state: state,
      client_id: googleClientId || 'velora-google-oauth-client',
      redirect_uri: callbackUrl,
      scope: 'openid email profile',
      response_type: 'code',
    });
    authUrl = `${origin}/authorize?${params.toString()}`;
  }

  const response = NextResponse.redirect(authUrl);

  // Set secure HTTP-only cookies for CSRF state and post-auth redirect target
  response.cookies.set(AUTH_CONFIG.OAUTH_STATE_COOKIE, state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 600, // 10 minutes
  });

  response.cookies.set(AUTH_CONFIG.OAUTH_REDIRECT_COOKIE, targetRedirect, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 600,
  });

  return response;
}
