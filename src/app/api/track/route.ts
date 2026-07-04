import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';

// Internal endpoint: edge middleware can't use Prisma, so it POSTs visits here.
export async function POST(req: NextRequest) {
  if (req.headers.get('x-track-secret') !== process.env.AUTH_SECRET) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: 'Bad request' }, { status: 400 });
  }
  if (!body.ip || !body.url) return Response.json({ error: 'Bad request' }, { status: 400 });

  const str = (v: unknown) => (typeof v === 'string' && v ? v : null);

  await prisma.visit.create({
    data: {
      ip: String(body.ip),
      country: str(body.country),
      city: str(body.city),
      isp: str(body.isp),
      device: str(body.device),
      os: str(body.os),
      browser: str(body.browser),
      language: str(body.language),
      referrer: str(body.referrer),
      utm: str(body.utm),
      page: String(body.url),
      isNew: Boolean(body.isNewVisitor),
    },
  });

  return Response.json({ ok: true });
}
