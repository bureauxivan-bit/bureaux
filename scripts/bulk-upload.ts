/**
 * Bulk upload visualizations from local folders to Supabase + Prisma.
 *
 * Usage:
 *   npm run bulk-upload -- "C:\path\to\vizualizations"
 *
 * Each subfolder = one project. Folder name → project title.
 * Images are converted to WebP (max 2400px) before upload.
 * Projects are set isTop=false — flip the flag in admin afterwards.
 * Already-existing slugs are skipped (safe to re-run).
 */

import { PrismaClient } from '@prisma/client';
import { createClient } from '@supabase/supabase-js';
import { readFileSync, readdirSync, statSync } from 'fs';
import { resolve, extname, join } from 'path';
import sharp = require('sharp');

// ── Load .env ──────────────────────────────────────────────────────────────
try {
  const envFile = readFileSync(resolve(process.cwd(), '.env'), 'utf-8');
  for (const line of envFile.split('\n')) {
    const m = line.match(/^([^#=\s][^=]*)=(.*)$/);
    if (m) {
      const key = m[1].trim();
      const val = m[2].trim().replace(/^["']|["']$/g, '');
      if (!process.env[key]) process.env[key] = val;
    }
  }
} catch { /* .env not found, rely on system env */ }

// ── Clients ────────────────────────────────────────────────────────────────
const prisma = new PrismaClient();

function supabaseClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error('NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY not set');
  return createClient(url, key, { auth: { persistSession: false } });
}

const BUCKET = process.env.SUPABASE_BUCKET ?? 'bureaux';

// ── Ukrainian → slug ───────────────────────────────────────────────────────
const UKR: Record<string, string> = {
  а:'a',б:'b',в:'v',г:'h',ґ:'g',д:'d',е:'e',є:'ye',ж:'zh',з:'z',
  и:'y',і:'i',ї:'yi',й:'y',к:'k',л:'l',м:'m',н:'n',о:'o',п:'p',
  р:'r',с:'s',т:'t',у:'u',ф:'f',х:'kh',ц:'ts',ч:'ch',ш:'sh',
  щ:'shch',ь:'',ю:'yu',я:'ya',
};

function toSlug(s: string): string {
  return s.toLowerCase()
    .split('').map(c => UKR[c] ?? c).join('')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
}

// ── Image upload ───────────────────────────────────────────────────────────
const IMAGE_EXTS = new Set(['.jpg', '.jpeg', '.png', '.webp', '.tiff', '.tif']);

async function uploadImage(
  filePath: string,
  supabase: ReturnType<typeof supabaseClient>,
): Promise<{ storageKey: string; url: string; width: number | null; height: number | null }> {
  const input = readFileSync(filePath);
  const processed = await sharp(input)
    .rotate()
    .resize({ width: 2400, height: 2400, fit: 'inside', withoutEnlargement: true })
    .webp({ quality: 82 })
    .toBuffer();

  const { width, height } = await sharp(processed).metadata();
  const storageKey = `projects/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.webp`;

  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(storageKey, processed, { contentType: 'image/webp', upsert: false });

  if (error) throw new Error(error.message);

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(storageKey);
  return { storageKey, url: data.publicUrl, width: width ?? null, height: height ?? null };
}

// ── Main ───────────────────────────────────────────────────────────────────
async function main() {
  const inputDir = process.argv[2];
  if (!inputDir) {
    console.error('\nUsage: npm run bulk-upload -- "C:\\path\\to\\vizualizations"\n');
    process.exit(1);
  }

  const rootDir = resolve(inputDir);
  const supabase = supabaseClient();

  const folders = readdirSync(rootDir)
    .filter(name => statSync(join(rootDir, name)).isDirectory())
    .sort();

  console.log(`\n📂  ${rootDir}`);
  console.log(`🗂   Знайдено папок: ${folders.length}\n`);

  const maxOrder = await prisma.project.findFirst({ orderBy: { order: 'desc' } });
  let nextOrder = (maxOrder?.order ?? -1) + 1;

  let created = 0, skipped = 0, totalImages = 0, imgErrors = 0;

  for (const folderName of folders) {
    const folderPath = join(rootDir, folderName);
    const title = folderName;
    const slug = toSlug(title);

    // Skip if project already exists
    const existing = await prisma.project.findUnique({ where: { slug } });
    if (existing) {
      console.log(`⏭  Пропущено (вже є): "${title}"`);
      skipped++;
      continue;
    }

    const files = readdirSync(folderPath)
      .filter(f => IMAGE_EXTS.has(extname(f).toLowerCase()) && !f.startsWith('.'))
      .sort();

    if (files.length === 0) {
      console.log(`⚠️  Немає зображень: "${title}" — пропускаємо`);
      skipped++;
      continue;
    }

    console.log(`\n📁  "${title}"  (${files.length} фото)`);

    let project: { id: string } | null = null;
    try {
      project = await prisma.project.create({
        data: { title, slug, year: 2025, category: 'PRIVATE', isTop: false, order: nextOrder++ },
      });
    } catch (err: any) {
      console.error(`   ❌ Не вдалося створити проект: ${err.message}`);
      skipped++;
      continue;
    }

    let coverId: string | null = null;
    let uploadedCount = 0;

    for (let i = 0; i < files.length; i++) {
      const filePath = join(folderPath, files[i]);
      process.stdout.write(`   [${String(i + 1).padStart(2)}/${files.length}] ${files[i]} … `);
      try {
        const { storageKey, url, width, height } = await uploadImage(filePath, supabase);
        const img = await prisma.projectImage.create({
          data: { projectId: project.id, storageKey, url, width, height, order: i },
        });
        if (i === 0) coverId = img.id;
        process.stdout.write('✓\n');
        uploadedCount++;
        totalImages++;
      } catch (err: any) {
        process.stdout.write(`✗  ${err.message}\n`);
        imgErrors++;
      }
    }

    if (coverId) {
      await prisma.project.update({ where: { id: project.id }, data: { coverId } });
    }

    console.log(`   ✅  ${uploadedCount}/${files.length} завантажено`);
    created++;
  }

  console.log('\n' + '─'.repeat(55));
  console.log(`✅  Проектів створено:  ${created}`);
  console.log(`⏭   Пропущено:         ${skipped}`);
  console.log(`🖼   Фото завантажено:  ${totalImages}`);
  if (imgErrors) console.log(`⚠️   Помилок зображень: ${imgErrors}`);
  console.log('─'.repeat(55) + '\n');

  await prisma.$disconnect();
}

main().catch(e => { console.error(e); prisma.$disconnect(); process.exit(1); });
