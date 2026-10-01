import { NextRequest, NextResponse } from 'next/server';
import { verifySession, AUTH_CONFIG } from '@/lib/auth';

export async function GET(request: NextRequest) {
  const token = request.cookies.get(AUTH_CONFIG.SESSION_COOKIE_NAME)?.value;
  const session = await verifySession(token);

  if (!session) {
    return NextResponse.json({ authenticated: false, user: null }, { status: 401 });
  }

  return NextResponse.json({
    authenticated: true,
    user: {
      id: session.sub,
      email: session.email,
      name: session.name,
      avatarUrl: session.avatarUrl,
      role: session.role,
      provider: session.provider,
    },
  });
}
