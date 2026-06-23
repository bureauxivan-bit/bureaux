import { NextResponse, type NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const ADMIN_COOKIE = 'bx_session';
const CLIENT_COOKIE = 'bx_client';

async function isValid(token: string | undefined, secret: string, role?: string) {
  if (!token) return false;
  try {
    const { payload } = await jwtVerify(token, new TextEncoder().encode(secret));
    if (role && payload.role !== role) return false;
    return true;
  } catch {
    return false;
  }
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const secret = process.env.AUTH_SECRET ?? '';

  // Admin routes
  if (pathname.startsWith('/admin')) {
    const isLogin = pathname === '/admin/login';
    const token = req.cookies.get(ADMIN_COOKIE)?.value;
    const valid = await isValid(token, secret);

    if (!isLogin && !valid) {
      const url = req.nextUrl.clone();
      url.pathname = '/admin/login';
      return NextResponse.redirect(url);
    }
    if (isLogin && valid) {
      const url = req.nextUrl.clone();
      url.pathname = '/admin';
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  // Client dashboard — requires approved client session
  if (pathname.startsWith('/miy-proekt')) {
    const token = req.cookies.get(CLIENT_COOKIE)?.value;
    const valid = await isValid(token, secret, 'client');
    if (!valid) {
      const url = req.nextUrl.clone();
      url.pathname = '/login';
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  // Client login — redirect to dashboard if already logged in
  if (pathname === '/login') {
    const token = req.cookies.get(CLIENT_COOKIE)?.value;
    const valid = await isValid(token, secret, 'client');
    if (valid) {
      const url = req.nextUrl.clone();
      url.pathname = '/miy-proekt';
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/miy-proekt/:path*', '/login'],
};
