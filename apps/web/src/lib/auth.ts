/**
 * VELORA Authentication & Session Engine
 * WebCrypto-based HMAC-SHA256 signing, session management, and PKCE OAuth state.
 */

export interface UserSession {
  sub: string;
  email: string;
  name: string;
  avatarUrl?: string;
  role: 'owner' | 'admin' | 'developer' | 'viewer';
  provider: 'google' | 'github' | 'email';
  createdAt: number;
  expiresAt: number;
  isNewUser?: boolean;
}

const SESSION_COOKIE_NAME = 'velora_session';
const OAUTH_STATE_COOKIE = 'velora_oauth_state';
const OAUTH_REDIRECT_COOKIE = 'velora_oauth_redirect';
const SESSION_SECRET = process.env.SESSION_SECRET || 'velora-production-signing-secret-key-32chars!';
const SESSION_MAX_AGE_SECONDS = 7 * 24 * 60 * 60; // 7 days

// Helper to get crypto subtle
function getSubtle(): SubtleCrypto {
  return crypto.subtle;
}

async function getSigningKey(): Promise<CryptoKey> {
  const enc = new TextEncoder();
  return await getSubtle().importKey(
    'raw',
    enc.encode(SESSION_SECRET),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign', 'verify']
  );
}

function base64UrlEncode(buffer: ArrayBuffer | Uint8Array): string {
  const bytes = buffer instanceof Uint8Array ? buffer : new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]!);
  }
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function base64UrlDecode(str: string): Uint8Array {
  let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
  while (base64.length % 4) {
    base64 += '=';
  }
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

/**
 * Sign a session payload into a secure HMAC-SHA256 token
 */
export async function signSession(user: Omit<UserSession, 'createdAt' | 'expiresAt'>): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  const session: UserSession = {
    ...user,
    createdAt: now,
    expiresAt: now + SESSION_MAX_AGE_SECONDS,
  };

  const enc = new TextEncoder();
  const header = base64UrlEncode(enc.encode(JSON.stringify({ alg: 'HS256', typ: 'JWT' })));
  const payload = base64UrlEncode(enc.encode(JSON.stringify(session)));
  const dataToSign = enc.encode(`${header}.${payload}`);

  const key = await getSigningKey();
  const signatureBuffer = await getSubtle().sign('HMAC', key, dataToSign);
  const signature = base64UrlEncode(signatureBuffer);

  return `${header}.${payload}.${signature}`;
}

/**
 * Verify and decode an HMAC-SHA256 session token
 */
export async function verifySession(token: string | undefined | null): Promise<UserSession | null> {
  if (!token) return null;
  const parts = token.split('.');
  if (parts.length !== 3) return null;

  const [header, payload, signature] = parts;
  if (!header || !payload || !signature) return null;

  try {
    const enc = new TextEncoder();
    const dataToVerify = enc.encode(`${header}.${payload}`);
    const key = await getSigningKey();
    const signatureBytes = base64UrlDecode(signature);

    const isValid = await getSubtle().verify('HMAC', key, signatureBytes as unknown as ArrayBuffer, dataToVerify);
    if (!isValid) return null;

    const dec = new TextDecoder();
    const session: UserSession = JSON.parse(dec.decode(base64UrlDecode(payload)));

    const now = Math.floor(Date.now() / 1000);
    if (session.expiresAt && session.expiresAt < now) {
      return null; // Expired
    }

    return session;
  } catch {
    return null;
  }
}

/**
 * Generate cryptographically secure random state & code verifier for PKCE
 */
export function generateOAuthState(): { state: string; verifier: string } {
  const stateBytes = new Uint8Array(24);
  const verifierBytes = new Uint8Array(32);
  crypto.getRandomValues(stateBytes);
  crypto.getRandomValues(verifierBytes);

  return {
    state: base64UrlEncode(stateBytes),
    verifier: base64UrlEncode(verifierBytes),
  };
}

export const AUTH_CONFIG = {
  SESSION_COOKIE_NAME,
  OAUTH_STATE_COOKIE,
  OAUTH_REDIRECT_COOKIE,
  SESSION_MAX_AGE_SECONDS,
};
