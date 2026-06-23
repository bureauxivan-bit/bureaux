import { NextRequest } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import { getStorageClient, BUCKET } from '@/lib/supabase';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  const unauth = await requireAdmin();
  if (unauth) return unauth;

  const form = await req.formData();
  const file = form.get('file');
  if (!(file instanceof File)) return Response.json({ error: 'Файл відсутній' }, { status: 400 });

  const ext = file.name.split('.').pop()?.toLowerCase() ?? 'bin';
  const storageKey = `client-files/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

  const buffer = Buffer.from(await file.arrayBuffer());
  const supabase = getStorageClient();
  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(storageKey, buffer, { contentType: file.type || 'application/octet-stream', upsert: false });

  if (error) return Response.json({ error: error.message }, { status: 500 });

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(storageKey);
  return Response.json({ storageKey, url: data.publicUrl, name: file.name });
}
