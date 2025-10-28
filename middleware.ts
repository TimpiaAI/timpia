import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { defaultLocale, locales, type Locale } from './i18n';

const SESSION_COOKIE = 'marketmanager_session';
const SESSION_SECRET =
  process.env.DASHBOARD_SESSION_SECRET ||
  process.env.CHATBOT_ADMIN_KEY ||
  'fallback-session-secret';

const encoder = new TextEncoder();
const PUBLIC_FILE = /\.(.*)$/;

function base64UrlToUint8Array(value: string) {
  const pad = value.length % 4;
  const padded = value + (pad ? '='.repeat(4 - pad) : '');
  const base64 = padded.replace(/-/g, '+').replace(/_/g, '/');
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

function uint8ArrayToBase64Url(bytes: Uint8Array) {
  let binary = '';
  bytes.forEach((b) => {
    binary += String.fromCharCode(b);
  });
  const base64 = btoa(binary);
  return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function constantTimeEqual(a: string, b: string) {
  if (a.length !== b.length) return false;
  let result = 0;
  for (let i = 0; i < a.length; i += 1) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return result === 0;
}

async function verifyToken(token: string) {
  const [encoded, signature] = token.split('.');
  if (!encoded || !signature) return null;

  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(SESSION_SECRET),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  );

  const expectedBuffer = await crypto.subtle.sign('HMAC', key, encoder.encode(encoded));
  const expectedSignature = uint8ArrayToBase64Url(new Uint8Array(expectedBuffer));

  if (!constantTimeEqual(signature, expectedSignature)) {
    return null;
  }

  try {
    const payloadBytes = base64UrlToUint8Array(encoded);
    const payloadJson = new TextDecoder().decode(payloadBytes);
    const payload = JSON.parse(payloadJson) as { username: string; exp: number };
    if (!payload.exp || payload.exp < Date.now()) {
      return null;
    }
    return payload;
  } catch {
    return null;
  }
}

function parseLocale(request: NextRequest): Locale {
  const acceptLanguage = request.headers.get('accept-language');
  if (acceptLanguage) {
    const languages = acceptLanguage
      .split(',')
      .map((lang) => lang.split(';')[0]?.trim().toLowerCase())
      .filter(Boolean);

    for (const lang of languages) {
      const [primary] = lang.split('-');
      if (locales.includes(primary as Locale)) {
        return primary as Locale;
      }
    }
  }
  return defaultLocale;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    PUBLIC_FILE.test(pathname)
  ) {
    return NextResponse.next();
  }

  if (pathname.startsWith('/dashboard')) {
    if (pathname.startsWith('/dashboard/login')) {
      return NextResponse.next();
    }

    const token = request.cookies.get(SESSION_COOKIE)?.value;
    const session = token ? await verifyToken(token) : null;

    if (!session) {
      const loginUrl = new URL('/dashboard/login', request.url);
      loginUrl.searchParams.set('redirectTo', pathname + request.nextUrl.search);
      return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
  }

  const hasLocale = locales.some(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`)
  );

  if (!hasLocale) {
    const locale = parseLocale(request);
    const redirectUrl = new URL(`/${locale}${pathname === '/' ? '' : pathname}`, request.url);
    return NextResponse.redirect(redirectUrl);
  }

  const activeLocale = pathname.split('/')[1];
  const response = NextResponse.next();
  const localeForRequest = activeLocale && isLocale(activeLocale) ? activeLocale : defaultLocale;
  response.headers.set('x-next-intl-locale', localeForRequest);
  return response;
}

export const config = {
  matcher: ['/(?!_next|api|.*\\.[\\w]+).*'],
};
