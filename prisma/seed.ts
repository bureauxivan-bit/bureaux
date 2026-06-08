import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // ───────── Site settings (singleton) ─────────
  await prisma.siteSettings.upsert({
    where: { id: 'singleton' },
    update: {},
    create: {
      id: 'singleton',
      phone: '+380 98 949 86 48',
      email: 'bureaux.ivan@gmail.com',
      address: 'Україна, Київ',
      coordinates: "50°27′16″ пн.ш. 30°31′25″ сх.д.",
      itemXUrl: 'https://itemx.art',
      instagram: 'https://instagram.com/',
      facebook: 'https://facebook.com/',
      behance: 'https://behance.net/',
    },
  });

  // ───────── Services ─────────
  const services = [
    { number: 1, title: 'Приватні простори', description: 'Квартири, будинки та котеджі під ключ у дусі МУАС.', order: 0 },
    { number: 2, title: 'Комерційні приміщення', description: 'Офіси, заклади та простори, що працюють на ваш бренд.', order: 1 },
    { number: 3, title: 'Архітектура та будівництво', description: 'Проєктування будинків та супровід будівництва.', order: 2 },
  ];
  for (const s of services) {
    await prisma.service.upsert({ where: { id: `svc-${s.number}` }, update: s, create: { id: `svc-${s.number}`, ...s } });
  }

  // ───────── Team ─────────
  const team = [
    {
      id: 'team-ivan', name: 'Іван', role: 'Засновник та CEO', order: 0,
      quote: 'На сьогоднішній день я вважаю себе батьком двох дітей: сина та нашого архітектурного бюро… для мене дуже важливо залишатися друзями із замовниками.',
    },
    {
      id: 'team-daria', name: "Дар'я", role: 'Засновниця та головний дизайнер', order: 1,
      quote: 'Для мене дизайн — це робота душі! Дизайн — це спосіб наповнити оселю вашою душею!',
    },
  ];
  for (const t of team) await prisma.teamMember.upsert({ where: { id: t.id }, update: t, create: t });

  // ───────── Reviews ─────────
  const reviews = [
    { id: 'rev-1', author: 'Crystal park', text: 'Команда Bureau X реалізувала наш простір саме так, як ми мріяли — функціонально та з характером.', order: 0 },
    { id: 'rev-2', author: 'Артем', text: 'Професійний підхід на кожному етапі. Результат перевершив очікування.', order: 1 },
    { id: 'rev-3', author: 'Pidstrim park', text: 'Авторський стиль, увага до деталей та повний супровід проєкту. Рекомендуємо.', order: 2 },
    { id: 'rev-4', author: 'Вікторія', text: 'Дякую за затишний та осмислений простір. Кожна деталь має значення.', order: 3 },
  ];
  for (const r of reviews) await prisma.review.upsert({ where: { id: r.id }, update: r, create: r });

  // ───────── FAQ ─────────
  const faqs = [
    { id: 'faq-1', order: 0, question: 'Яка мінімальна вартість ваших послуг?', answer: 'Вартість залежить від площі, обсягу робіт та обраного пакета. Залиште заявку — ми зробимо безкоштовний прорахунок саме для вашого проєкту.' },
    { id: 'faq-2', order: 1, question: 'Який термін виконання дизайн-проєкту?', answer: 'У середньому повний дизайн-проєкт займає від 1.5 до 3 місяців залежно від складності та площі.' },
    { id: 'faq-3', order: 2, question: 'Чи можна замовити тільки візуалізації / креслення електрики, а все інше ми самі?', answer: 'Так, ми працюємо як пакетно, так і за окремими послугами — від концепції до повного супроводу.' },
    { id: 'faq-4', order: 3, question: 'Чи виконуємо ми проєкти поза Києвом (інші міста України або країни)?', answer: 'Так. Ми реалізуємо проєкти по всій Україні та світу — частину роботи ведемо віддалено з виїздами на ключові етапи.' },
  ];
  for (const f of faqs) await prisma.faq.upsert({ where: { id: f.id }, update: f, create: f });

  // ───────── Demo projects (replace photos via /admin) ─────────
  const projects = [
    { slug: 'crystal-park', title: 'Crystal Park', year: 2025, category: 'PRIVATE' as const, areaM2: 180, location: 'Київ', isTop: true, order: 0, description: 'Приватний простір у дусі МУАС: тепла нейтральна палітра, чисті лінії та національний підтекст без кітчу.' },
    { slug: 'pidstrim-park', title: 'Pidstrim Park', year: 2025, category: 'COMMERCIAL' as const, areaM2: 320, location: 'Київ', isTop: true, order: 1, description: 'Комерційний простір, що працює на бренд: функціональність, естетика та впізнаваність.' },
    { slug: 'kotedzh-misto', title: 'Котеджне містечко', year: 2024, category: 'ARCHITECTURE' as const, areaM2: 5000, location: 'Київська область', isTop: true, order: 2, description: 'Архітектура та будівництво під ключ — від проєктування до здачі.' },
  ];
  for (const p of projects) {
    await prisma.project.upsert({ where: { slug: p.slug }, update: p, create: p });
  }

  // ───────── Admin user ─────────
  const email = process.env.SEED_ADMIN_EMAIL ?? 'admin@bureaux.example';
  const password = process.env.SEED_ADMIN_PASSWORD ?? 'changeme123';
  await prisma.adminUser.upsert({
    where: { email },
    update: {},
    create: { email, passwordHash: await bcrypt.hash(password, 12) },
  });
  console.log(`✓ Seed complete. Admin login: ${email} / ${password}`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
