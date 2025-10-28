import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { createHmac, createHash, timingSafeEqual } from 'node:crypto';

const SESSION_COOKIE = 'marketmanager_session';
const SESSION_DURATION_MS = 1000 * 60 * 60 * 24 * 30; // 30 days
const SESSION_SECRET =
  process.env.DASHBOARD_SESSION_SECRET ||
  process.env.CHATBOT_ADMIN_KEY ||
  'fallback-session-secret';

type SessionPayload = {
  username: string;
  exp: number;
};

function encodePayload(payload: SessionPayload) {
  return Buffer.from(JSON.stringify(payload)).toString('base64url');
}

function decodePayload(tokenPart: string): SessionPayload | null {
  try {
    const json = Buffer.from(tokenPart, 'base64url').toString('utf8');
    return JSON.parse(json) as SessionPayload;
  } catch {
    return null;
  }
}

function sign(part: string) {
  return createHmac('sha256', SESSION_SECRET).update(part).digest('base64url');
}

function constantTimeCompare(a: string, b: string) {
  const aBuf = Buffer.from(a);
  const bBuf = Buffer.from(b);
  if (aBuf.length !== bBuf.length) return false;
  return timingSafeEqual(aBuf, bBuf);
}

export function hashPassword(raw: string) {
  return createHash('sha256').update(raw).digest('hex');
}

export function createSession(username: string) {
  const payload: SessionPayload = {
    username,
    exp: Date.now() + SESSION_DURATION_MS,
  };
  const encoded = encodePayload(payload);
  const signature = sign(encoded);
  return `${encoded}.${signature}`;
}

export function verifySessionToken(token?: string | null): SessionPayload | null {
  if (!token) return null;
  const [encoded, signature] = token.split('.');
  if (!encoded || !signature) return null;

  const expected = sign(encoded);
  if (!constantTimeCompare(signature, expected)) {
    return null;
  }

  const payload = decodePayload(encoded);
  if (!payload || typeof payload.exp !== 'number') return null;
  if (payload.exp < Date.now()) return null;

  return payload;
}

export async function setSessionCookie(username: string) {
  const token = createSession(username);
  const cookieStore = await cookies();
  cookieStore.set({
    name: SESSION_COOKIE,
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: Math.floor(SESSION_DURATION_MS / 1000),
  });
}

export async function clearSessionCookie() {
  const cookieStore = await cookies();
  cookieStore.set({
    name: SESSION_COOKIE,
    value: '',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
  });
}

export async function getSessionFromCookies() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  return verifySessionToken(token);
}

export async function requireSession() {
  const session = await getSessionFromCookies();
  if (!session) {
    redirect('/dashboard/login');
  }
  return session;
}

export const SESSION_COOKIE_NAME = SESSION_COOKIE;
