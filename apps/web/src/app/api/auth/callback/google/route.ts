import { NextRequest, NextResponse } from 'next/server';
import { signSession, AUTH_CONFIG } from '@/lib/auth';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get('code');
  const state = searchParams.get('state');
  const error = searchParams.get('error');

  const cookieStore = request.cookies;
  const storedState = cookieStore.get(AUTH_CONFIG.OAUTH_STATE_COOKIE)?.value;
  const targetRedirect = cookieStore.get(AUTH_CONFIG.OAUTH_REDIRECT_COOKIE)?.value || '/dashboard';

  // 1. Handle user denied / cancelled authorization
  if (error) {
    const errorDesc = searchParams.get('error_description') || 'Authorization was cancelled or denied by the user.';
    const response = NextResponse.redirect(
      new URL(`/login?error=${encodeURIComponent(error)}&message=${encodeURIComponent(errorDesc)}`, request.nextUrl.origin)
    );
    response.cookies.delete(AUTH_CONFIG.OAUTH_STATE_COOKIE);
    response.cookies.delete(AUTH_CONFIG.OAUTH_REDIRECT_COOKIE);
    return response;
  }

  // 2. Validate state parameter (CSRF protection)
  if (!state || !storedState || state !== storedState) {
    const response = NextResponse.redirect(
      new URL(`/login?error=invalid_state&message=${encodeURIComponent('Security verification failed (state mismatch). Please try again.')}`, request.nextUrl.origin)
    );
    response.cookies.delete(AUTH_CONFIG.OAUTH_STATE_COOKIE);
    response.cookies.delete(AUTH_CONFIG.OAUTH_REDIRECT_COOKIE);
    return response;
  }

  // 3. Validate authorization code
  if (!code) {
    const response = NextResponse.redirect(
      new URL(`/login?error=missing_code&message=${encodeURIComponent('No authorization code was provided by Google.')}`, request.nextUrl.origin)
    );
    return response;
  }

  try {
    let email = 'developer@velora.internal';
    let name = 'Velora Engineer';
    let avatarUrl = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces';
    let isNewUser = false;

    const googleClientId = process.env.GOOGLE_CLIENT_ID;
    const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;

    if (googleClientId && googleClientSecret) {
      // Exchange code for real Google access token
      const callbackUrl = `${request.nextUrl.origin}/api/auth/callback/google`;
      const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          code,
          client_id: googleClientId,
          client_secret: googleClientSecret,
          redirect_uri: callbackUrl,
          grant_type: 'authorization_code',
        }),
      });

      if (!tokenRes.ok) {
        const errText = await tokenRes.text();
        console.error('Google token exchange error:', errText);
        return NextResponse.redirect(
          new URL(`/login?error=token_exchange_failed&message=${encodeURIComponent('Failed to exchange authorization code with Google.')}`, request.nextUrl.origin)
        );
      }

      const tokenData = await tokenRes.json();
      const userRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
        headers: { Authorization: `Bearer ${tokenData.access_token}` },
      });

      if (!userRes.ok) {
        return NextResponse.redirect(
          new URL(`/login?error=userinfo_failed&message=${encodeURIComponent('Failed to fetch user profile from Google.')}`, request.nextUrl.origin)
        );
      }

      const profile = await userRes.json();
      email = profile.email || email;
      name = profile.name || email.split('@')[0] || name;
      avatarUrl = profile.picture || avatarUrl;
    } else {
      // Decode simulated/developer consent profile if encoded in code
      if (code.startsWith('auth_')) {
        const parts = code.split('_');
        if (parts[1]) {
          try {
            const decoded = atob(parts[1]);
            const parsed = JSON.parse(decoded);
            email = parsed.email || email;
            name = parsed.name || name;
            isNewUser = Boolean(parsed.isNewUser);
          } catch {
            // Use defaults
          }
        }
      }
    }

    // 4. Create cryptographically signed session token
    const sessionToken = await signSession({
      sub: `user_${email.replace(/[^a-zA-Z0-9]/g, '_')}`,
      email,
      name,
      avatarUrl,
      role: 'owner',
      provider: 'google',
      isNewUser,
    });

    // Determine final destination: if new user without project onboarding, route to /onboarding
    const finalDestination = isNewUser ? '/onboarding' : targetRedirect;
    const response = NextResponse.redirect(new URL(finalDestination, request.nextUrl.origin));

    // 5. Issue secure HTTP-only session cookie
    response.cookies.set(AUTH_CONFIG.SESSION_COOKIE_NAME, sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: AUTH_CONFIG.SESSION_MAX_AGE_SECONDS,
    });

    // Cleanup one-time OAuth state cookies
    response.cookies.delete(AUTH_CONFIG.OAUTH_STATE_COOKIE);
    response.cookies.delete(AUTH_CONFIG.OAUTH_REDIRECT_COOKIE);

    return response;
  } catch (err: unknown) {
    console.error('OAuth callback exception:', err);
    return NextResponse.redirect(
      new URL(`/login?error=auth_internal_error&message=${encodeURIComponent('An internal error occurred during authentication.')}`, request.nextUrl.origin)
    );
  }
}
