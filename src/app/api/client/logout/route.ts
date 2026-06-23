import { destroyClientSession } from '@/lib/client-auth';

export async function POST() {
  destroyClientSession();
  return Response.json({ ok: true });
}
