import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import bcrypt from 'bcryptjs';

const COOKIE = 'bx_client';
const ALG = 'HS256';

function secret() {
  const s = process.env.AUTH_SECRET;
  if (!s) throw new Error('AUTH_SECRET is not set');
  return new TextEncoder().encode(s);
}

export async function hashPassword(pw: string) {
  return bcrypt.hash(pw, 12);
}
export async function verifyPassword(pw: string, hash: string) {
  return bcrypt.compare(pw, hash);
}

export async function createClientSession(clientId: string, email: string) {
  const token = await new SignJWT({ email, role: 'client' })
    .setProtectedHeader({ alg: ALG })
    .setSubject(clientId)
    .setIssuedAt()
    .setExpirationTime('30d')
    .sign(secret());

  cookies().set(COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 30,
  });
}

export function destroyClientSession() {
  cookies().set(COOKIE, '', { path: '/', maxAge: 0 });
}

export async function getClientSession(): Promise<{ clientId: string; email: string } | null> {
  const token = cookies().get(COOKIE)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secret());
    if (payload.role !== 'client') return null;
    return { clientId: String(payload.sub), email: String(payload.email) };
  } catch {
    return null;
  }
}
