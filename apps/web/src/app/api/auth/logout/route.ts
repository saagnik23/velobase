import { NextRequest, NextResponse } from 'next/server';
import { AUTH_CONFIG } from '@/lib/auth';

export async function POST(request: NextRequest) {
  const response = NextResponse.json({ success: true, message: 'Logged out successfully' });
  
  response.cookies.delete(AUTH_CONFIG.SESSION_COOKIE_NAME);
  response.cookies.delete(AUTH_CONFIG.OAUTH_STATE_COOKIE);
  response.cookies.delete(AUTH_CONFIG.OAUTH_REDIRECT_COOKIE);

  return response;
}
