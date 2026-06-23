import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const hash = await bcrypt.hash('bureaux2026', 12);
await prisma.adminUser.update({
  where: { email: 'bureaux.ivan@gmail.com' },
  data: { passwordHash: hash },
});
console.log('Password reset to: bureaux2026');
await prisma.$disconnect();
