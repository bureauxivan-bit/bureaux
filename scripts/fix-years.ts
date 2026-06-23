import { PrismaClient } from '@prisma/client';
import { readFileSync } from 'fs';
import { resolve } from 'path';

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
} catch {}

const prisma = new PrismaClient();

const YEAR_MAP: Record<number, string[]> = {
  2023: [
    '1991', 'Concept_1', 'Concept_2', 'Crystal Park 127',
    'Metropolis', 'White Lines Пентхаус 134', 'YK Cosmetic',
  ],
  2024: [
    'Dibrova69', 'DUZHA', 'Easter Concept', 'Husky Resort', 'NETLIN',
    'Баггоутівська', 'Верховина', 'Житомир 280', 'І Будуть Люди', 'Червона рута',
  ],
  2025: [
    'Concept 6 (Green Cabinet)', 'Concept 8 (Desert)', 'Concept 9', 'Concept 10 (Spa)',
    'ConceptFlowers', 'F.TOWN', 'Hidden 118', 'HODOS', 'KHARKIV 240',
    'LEBEDIVKA', 'LEBEDIVKA SPA', 'MYKYTA', 'PARKOVI OZ', 'PUHIVKA', 'RYBALSKIY',
    'Smart Development', 'Unit.HOME 2.0', 'Utlandiya', 'VIPCHE 2.0', 'VVLV',
    'Еко Село 1.0', 'Еко Село 2.0', 'Еко Село 3.0', 'Еко Село Ресторан', 'Місто Квітів 1.0',
  ],
  2026: [
    'MALECH', 'RIVIERA VILLAS', 'YUHNY', 'МНОЖИНА',
  ],
};

async function main() {
  console.log('\n── Step 1: fixing years ──\n');
  let fixed = 0, missing = 0;
  for (const [yearStr, titles] of Object.entries(YEAR_MAP)) {
    const year = Number(yearStr);
    for (const title of titles) {
      const r = await prisma.project.updateMany({ where: { title }, data: { year } });
      if (r.count > 0) { console.log(`  ✓ ${title} → ${year}`); fixed++; }
      else { console.log(`  ⚠  Not found: "${title}"`); missing++; }
    }
  }
  console.log(`\n  Fixed: ${fixed}  |  Not found: ${missing}`);

  console.log('\n── Step 2: reordering by year DESC, title ASC ──\n');
  const all = await prisma.project.findMany({ orderBy: [{ year: 'desc' }, { title: 'asc' }] });
  for (let i = 0; i < all.length; i++) {
    await prisma.project.update({ where: { id: all[i].id }, data: { order: i } });
  }
  console.log(`  ✅ Reordered ${all.length} projects\n`);

  await prisma.$disconnect();
}

main().catch(e => { console.error(e); prisma.$disconnect(); process.exit(1); });
