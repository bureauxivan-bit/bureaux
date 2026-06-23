import { PrismaClient } from '@prisma/client';
const p = new PrismaClient();
async function main() {
  await p.service.upsert({ where: { id: 'service-2' }, update: {}, create: { id: 'service-2', number: 2, title: 'Комерційні приміщення', order: 2 } });
  await p.service.upsert({ where: { id: 'service-3' }, update: {}, create: { id: 'service-3', number: 3, title: 'Архітектура та будівництво', order: 3 } });
  console.log('✓ Services seeded');
  await p.$disconnect();
}
main().catch(console.error);
