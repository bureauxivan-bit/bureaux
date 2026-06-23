import { PrismaClient } from '@prisma/client';
const p = new PrismaClient();
p.project.findMany({ select: { title: true, slug: true, year: true }, orderBy: { title: 'asc' } })
  .then(r => { r.forEach(x => console.log(`${x.year}  ${x.title}  [${x.slug}]`)); p.$disconnect(); });
