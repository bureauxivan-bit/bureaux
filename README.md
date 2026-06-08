# BUREAUX — сайт бюро архітектури та дизайну (МУАС)

Продакшн-готовий fullstack-сайт студії архітектури та дизайну інтер'єрів **Bureau X**.
Контент сайту — українською, адмінка — українською.

## Стек

- **Next.js 14** (App Router) + **TypeScript** — фронт і API в одному застосунку
- **Tailwind CSS** + CSS-перемінні (дизайн-токени МУАС)
- **Framer Motion** — scroll-reveal, поп-апи, акордеон
- **Prisma ORM** + **PostgreSQL** (Supabase / Neon / Railway)
- **Supabase Storage** — фото проєктів (ресайз у WebP через `sharp`)
- **JWT-авторизація** (jose + bcrypt, httpOnly cookie) для `/admin`
- **Vercel** — деплой

> **Про архітектуру.** Вихідний бриф просив окремий Nest.js-бекенд. Тут API реалізовано
> на Route Handlers Next.js — це один деплой замість двох, дешевше і простіше в супроводі.
> Схема БД (Prisma) і контракт API повністю відповідають брифу, тож за потреби логіку
> легко винести в окремий Nest.js-сервіс.

---

## Швидкий старт (локально)

```bash
# 1. Залежності
npm install

# 2. Змінні оточення
cp .env.example .env
#   заповніть DATABASE_URL / DIRECT_URL, Supabase, AUTH_SECRET, Telegram

# 3. Згенерувати клієнт + застосувати схему до БД
npx prisma generate
npx prisma migrate dev --name init      # або: npx prisma db push

# 4. Заповнити демо-контентом (послуги, команда, відгуки, FAQ, адмін)
npm run seed

# 5. Запуск
npm run dev      # http://localhost:3000  →  адмінка: /admin
```

Дані для входу в адмінку після сіду:
`admin@bureaux.example` / `changeme123`
(змініть через `SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD` або скриптом нижче).

---

## Змінні оточення

Усі ключі — у `.env.example`. Коротко:

| Змінна | Призначення |
|---|---|
| `DATABASE_URL` | Пулінг-підключення Postgres (Supabase: порт 6543, `pgbouncer=true`) |
| `DIRECT_URL` | Пряме підключення для `prisma migrate` (порт 5432) |
| `NEXT_PUBLIC_SUPABASE_URL` | URL проєкту Supabase |
| `SUPABASE_SERVICE_ROLE_KEY` | Service-role ключ (тільки сервер!) |
| `SUPABASE_BUCKET` | Назва **публічного** бакета для фото (напр. `bureaux`) |
| `AUTH_SECRET` | Секрет для підпису JWT — `openssl rand -base64 48` |
| `TELEGRAM_BOT_TOKEN` / `TELEGRAM_CHAT_ID` | Сповіщення про заявки |
| `NEXT_PUBLIC_SITE_URL` | Канонічний домен (для SEO, sitemap, OG) |
| `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` | (опц.) аналітика Plausible |

### Supabase Storage
1. Створіть бакет з назвою з `SUPABASE_BUCKET`, позначте його **Public**.
2. Service-role ключ використовується лише на сервері (`/api/upload`).

### Telegram-сповіщення
1. Створіть бота через `@BotFather` → отримайте `TELEGRAM_BOT_TOKEN`.
2. Додайте бота у потрібний чат/групу, дізнайтесь `chat_id` (напр. через `@userinfobot`).
3. Якщо змінні не задані — заявки все одно зберігаються в БД, сповіщення просто вимкнені.

---

## Корисні команди

```bash
npm run dev            # дев-сервер
npm run build          # prisma generate + next build
npm run start          # прод-сервер
npm run seed           # демо-контент + адмін
npm run create-admin   # створити/оновити адміна:
#   SEED_ADMIN_EMAIL=you@x.com SEED_ADMIN_PASSWORD=secret npm run create-admin
```

---

## Деплой на Vercel

1. Залийте репозиторій у GitHub, імпортуйте в Vercel.
2. У **Settings → Environment Variables** додайте всі змінні з `.env.example`.
3. Build Command за замовчуванням: `npm run build` (він викликає `prisma generate`).
4. БД підготуйте окремо:
   ```bash
   npx prisma migrate deploy   # застосувати міграції на проді
   npm run seed                # (один раз) демо-контент + адмін
   ```
   Запустіть локально з `DATABASE_URL`/`DIRECT_URL`, що вказують на прод-БД,
   або з консолі провайдера.
5. Додайте свій домен у Vercel і встановіть `NEXT_PUBLIC_SITE_URL`.

> **Important / sharp на Vercel:** `sharp` працює в Node-рантаймі. Ендпоінт `/api/upload`
> вже позначений `runtime = 'nodejs'`. Окремих налаштувань не потрібно.

---

## Структура

```
src/
  app/
    (site)/            # публічний сайт (хедер/футер/модалка)
      page.tsx         # головна — усі секції §3
      projects/        # каталог + /projects/[slug]
      terms, privacy
    admin/             # захищена адмінка (JWT)
      login, leads, projects, services, team, reviews, faq, settings
    api/               # Route Handlers (публічні + admin + auth + upload)
    sitemap.ts, robots.ts, layout.tsx, globals.css
  components/          # UI секцій + адмінки
  lib/                 # prisma, auth, supabase, telegram, validation, data
  middleware.ts        # захист /admin
prisma/
  schema.prisma        # моделі (§6 брифу)
  seed.ts              # демо-контент
```

## API (стисло)

**Публічні:** `GET /api/projects`, `/api/projects/[slug]`, `/api/services`, `/api/team`,
`/api/reviews`, `/api/faq`, `/api/settings`, `POST /api/leads`.

**Admin (JWT):** `POST /api/auth/login` · `POST /api/auth/logout` · `POST /api/upload` ·
`GET|POST /api/admin/projects` · `PATCH|DELETE /api/admin/projects/[id]` ·
`POST|PATCH /api/admin/projects/[id]/images` · `GET /api/admin/leads` ·
`PATCH /api/admin/leads/[id]/status` · `GET /api/admin/leads/export` (CSV) ·
`PATCH /api/admin/settings` · CRUD для `services|team|reviews|faq`.

## Безпека форм
`POST /api/leads` має валідацію (Zod), honeypot-поле та rate-limit (5/хв на IP).

---

## Definition of Done — статус

- [x] Адаптивний фронт з усіма секціями §3, контент українською
- [x] 3 форми → лід у БД + Telegram-сповіщення
- [x] Каталог проєктів + детальна сторінка з галереєю
- [x] Адмінка з CRUD, завантаженням фото та вибором обкладинки, інбоксом заявок
- [x] Фото в Supabase Storage, метадані в Postgres
- [x] SEO: meta, OG, sitemap, robots, JSON-LD (LocalBusiness)
- [x] Інструкція по ENV та запуску

### Що варто доробити під реальні дані
- Drag-and-drop сортування (зараз reorder фото через API є, у UI — вибір обкладинки;
  сортування проєктів — через поле `order`).
- Завантажити справжні фото проєктів через `/admin` (демо-проєкти йдуть без зображень).
- Заповнити тексти `terms` / `privacy`.
