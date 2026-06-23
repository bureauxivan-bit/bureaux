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

  // ───────── Services (skip if admin already created them) ─────────
  const serviceCount = await prisma.service.count();
  if (serviceCount === 0) {
    const services = [
      { number: 1, title: 'Приватні простори', description: 'Квартири, будинки та котеджі під ключ у дусі МУАС.', order: 0 },
      { number: 2, title: 'Комерційні приміщення', description: 'Офіси, заклади та простори, що працюють на ваш бренд.', order: 1 },
      { number: 3, title: 'Архітектура та будівництво', description: 'Проєктування будинків та супровід будівництва.', order: 2 },
    ];
    for (const s of services) {
      await prisma.service.create({ data: s });
    }
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
    {
      id: 'rev-1', author: 'Crystal Park', projectName: 'Crystal Park',
      text: 'Вітаю! Дякую, насолоджуємось продуманим дизайном) жодних зауважень до дизайну з плином часу не виникло. Не все вдалось реалізувати на 100%, але це питання до майстрів і наших фінансів. Загалом, навіть зараз можу сказати, що нічого б не міняла. До сервісу і комунікації також ніяких побажань не маю! Дякую за чудовий проєкт, приємно бачити, як ви розвиваєтесь. Бажаю Вам успіхів і нових звершень!',
      order: 0,
    },
    {
      id: 'rev-2', author: 'Артем', projectName: 'Квартира, Київ',
      text: 'Точно не памʼятаю, як я дізнався про BureauX. Здається, то була якась реклама. До мого ремонту ще було декілька місяців, та я був певен, що буду починати з дизайн проекту, тож вирішив поспілкуватись. Без дизайн проекту я вже раніше робив ремонт — не сподобалось. Сподобалась консультація в інстаграмі та приклади робіт. У них є свій стиль + зачепило, що це сімейна справа для Івана та Дарії.',
      order: 1,
    },
    {
      id: 'rev-3', author: 'Pidstrim Park', projectName: 'Pidstrim Park',
      text: 'Іван, вітаю. Безумовно, пораджу, все що треба зробимо. До речі, я взяв собі ще дуплекс котеджного містечка "Окраса" в Ірпені. Поки грошей не маю на ремонт та дизайн, активно заробляю. І в спілкуванні показував ваші проєкти Сергію Крикуну — це девелопер, якому дуже сподобалось. Ось так, що від мене треба — кажіть, зробимо.',
      order: 2,
    },
    {
      id: 'rev-4', author: 'Вікторія', projectName: 'Дизайн-проєкт',
      text: 'Добрий день! Щиро дякую за співпрацю! Мені було приємно працювати з вами — особливо хочеться відзначити вашу швидку реакцію на запити, професійний підхід та ввічливу комунікацію. Саме ці фактори вплинули на моє рішення обрати саме вашу компанію. Загалом я залишилася дуже задоволена рівнем сервісу. Я б із впевненістю могла порадити вас своїм знайомим, і вже це зробила! Дякую ще раз та бажаю вам подальшого розвитку!',
      order: 3,
    },
  ];
  for (const r of reviews) await prisma.review.upsert({ where: { id: r.id }, update: r, create: r });

  // ───────── FAQ ─────────
  const faqs = [
    {
      id: 'faq-1', order: 0,
      question: 'Яка мінімальна вартість ваших послуг?',
      answer: 'Ми розраховуємо вартість кожного проєкту індивідуально та надаємо найкращу пропозицію для замовників згідно з їхнього запиту.',
    },
    {
      id: 'faq-2', order: 1,
      question: 'Який термін виконання дизайн проекту?',
      answer: 'Середній термін виконання дизайн проєкту інтерʼєру займає 1,5–3 місяці. Термін виконання архітектурного проєкту — від 1 місяця.',
    },
    {
      id: 'faq-3', order: 2,
      question: 'Чи можна замовити тільки візуалізації / креслення електрики, а все інше ми самі?',
      answer: 'Ми підходимо до процесу створення дизайн проєкту лише комплексно. Візуалізації, як і креслення один без одного не показують всю картину та деталі проєкту, тому ми вважаємо, що це марна трата коштів.',
    },
    {
      id: 'faq-4', order: 3,
      question: 'Чи виконуємо ми проєкти поза Києвом? (інші міста України або інші країни)',
      answer: 'Ми виконуємо проєкти для усіх бажаючих та підлаштовуємося під замовників. Масштабуємо наші послуги по всьому світу. Активно працюємо по всій Україні та Європі. Інші країни обговорюються індивідуально.',
    },
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
