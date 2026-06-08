import { NextRequest } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import { getStorageClient, BUCKET } from '@/lib/supabase';
import sharp from 'sharp';

export const runtime = 'nodejs';

// Multipart upload -> resize/convert to WebP -> store in Supabase Storage.
// Returns { storageKey, url, width, height } for ProjectImage records.
export async function POST(req: NextRequest) {
  const unauth = await requireAdmin();
  if (unauth) return unauth;

  const form = await req.formData();
  const file = form.get('file');
  if (!(file instanceof File)) return Response.json({ error: 'Файл відсутній' }, { status: 400 });

  const input = Buffer.from(await file.arrayBuffer());
  const image = sharp(input).rotate();
  const meta = await image.metadata();

  // Cap longest edge at 2400px, convert to WebP.
  const processed = await image
    .resize({ width: 2400, height: 2400, fit: 'inside', withoutEnlargement: true })
    .webp({ quality: 82 })
    .toBuffer();
  const out = sharp(processed);
  const outMeta = await out.metadata();

  const storageKey = `projects/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.webp`;
  const supabase = getStorageClient();
  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(storageKey, processed, { contentType: 'image/webp', upsert: false });
  if (error) return Response.json({ error: error.message }, { status: 500 });

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(storageKey);
  return Response.json({
    storageKey,
    url: data.publicUrl,
    width: outMeta.width ?? meta.width ?? null,
    height: outMeta.height ?? meta.height ?? null,
  });
}
