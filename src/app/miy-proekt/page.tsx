import { redirect } from 'next/navigation';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { getClientSession } from '@/lib/client-auth';
import { getSettings } from '@/lib/data';
import { CLIENT_PROJECT_TYPE_LABELS } from '@/lib/constants';
import { ClientLogout } from '@/components/ClientLogout';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Мій проєкт — bureau X', robots: { index: false, follow: false } };

const STAGES = [
  { num: '01', title: 'Договір' },
  { num: '02', title: 'Заміри' },
  { num: '03', title: 'Планувальне рішення' },
  { num: '04', title: 'Візуалізації' },
  { num: '05', title: 'Робоча документація' },
  { num: '06', title: 'Специфікації' },
];

type StageStatus = 'DONE' | 'ACTIVE' | 'PENDING';

function clientShortId(createdAt: Date) {
  const y = createdAt.getFullYear().toString().slice(-2);
  const m = String(createdAt.getMonth() + 1).padStart(2, '0');
  return `${y}-${m}`;
}

export default async function MiyProektPage() {
  const session = await getClientSession();
  if (!session) redirect('/login');

  const [client, dbStages, settings] = await Promise.all([
    prisma.clientUser.findUnique({
      where: { id: session.clientId },
      select: {
        id: true, name: true, email: true,
        projectType: true, projectName: true, projectAddress: true, projectCity: true,
        status: true, adminNote: true, createdAt: true,
      },
    }),
    prisma.clientStage.findMany({
      where: { clientId: session.clientId },
      orderBy: { stageIndex: 'asc' },
      select: { stageIndex: true, status: true },
    }),
    getSettings(),
  ]);

  if (!client) redirect('/login');

  const shortId = clientShortId(new Date(client.createdAt));
  const isApproved = client.status === 'APPROVED';

  const stageStatusMap: Record<number, StageStatus> = {};
  dbStages.forEach((s) => { stageStatusMap[s.stageIndex] = s.status as StageStatus; });
  const getStatus = (i: number): StageStatus => stageStatusMap[i] ?? 'PENDING';

  const projectLabel = client.projectName ?? client.projectAddress ?? CLIENT_PROJECT_TYPE_LABELS[client.projectType];
  const subtitleParts = [client.projectAddress, client.projectCity, `#${shortId}`].filter(Boolean);
  const subtitle = subtitleParts.join(' · ');

  const doneCount = Object.values(stageStatusMap).filter((s) => s === 'DONE').length;

  return (
    <div className="flex min-h-screen">
      {/* ── SIDEBAR ── */}
      <aside className="hidden md:flex sticky top-0 h-screen w-56 shrink-0 flex-col overflow-y-auto border-r border-line bg-white">
        <div className="shrink-0 border-b border-line px-5 py-5">
          <div className="text-sm font-medium uppercase tracking-[0.2em] text-ink">bureau <em>X</em></div>
        </div>

        <div className="shrink-0 border-b border-line px-5 py-4">
          <p className="mb-1 text-[10px] uppercase tracking-[0.25em] text-muted">Проект</p>
          <p className="text-sm font-medium text-ink leading-snug">{projectLabel}</p>
          {client.projectCity && (
            <p className="mt-0.5 text-xs text-muted">{client.projectCity}</p>
          )}
        </div>

        <nav className="flex-1 py-1">
          {STAGES.map((s, i) => {
            const status = getStatus(i);
            const clickable = isApproved && status !== 'PENDING';
            const isActive = status === 'ACTIVE';
            const isDone = status === 'DONE';

            const inner = (
              <span className={`flex items-center justify-between border-l-2 px-4 py-2.5 text-xs ${
                isActive
                  ? 'border-[rgb(var(--terra))] text-ink font-medium'
                  : isDone
                  ? 'border-transparent text-muted'
                  : 'border-transparent text-muted/40'
              }`}>
                <span className="truncate">{s.num} — {s.title}</span>
                {isDone && <span className="shrink-0 ml-2 text-[10px] text-muted">✓</span>}
                {isActive && <span className="h-1.5 w-1.5 shrink-0 ml-2 bg-[rgb(var(--terra))]" />}
              </span>
            );

            return clickable ? (
              <Link key={s.num} href={`/miy-proekt/${i}`}
                className="block hover:bg-line/40 transition-colors">
                {inner}
              </Link>
            ) : (
              <div key={s.num}>{inner}</div>
            );
          })}
        </nav>

        <div className="shrink-0 border-t border-line px-5 py-4">
          <p className="text-sm font-medium text-ink truncate">{client.name}</p>
          <p className="text-xs text-muted">клієнт · #{shortId}</p>
          <ClientLogout />
        </div>
      </aside>

      {/* ── MAIN ── */}
      <div className="flex flex-1 flex-col bg-paper">
        {/* Mobile header */}
        <div className="flex shrink-0 items-center justify-between border-b border-line bg-white px-5 py-4 md:hidden">
          <span className="text-sm font-medium uppercase tracking-[0.2em]">bureau <em>X</em></span>
          <ClientLogout />
        </div>

        <main className="flex-1 px-8 py-10 lg:px-12 lg:py-12">
          <div className="mb-1">
            <h1 className="text-2xl font-medium tracking-tight text-ink">Мій проєкт</h1>
            <p className="mt-1 text-xs text-muted">{subtitle || `клієнт #${shortId}`}</p>
          </div>
          {isApproved && doneCount > 0 && (
            <p className="mt-0.5 text-xs text-muted">
              {doneCount} з {STAGES.length} етапів завершено
            </p>
          )}

          <div className="mt-6 mb-8 h-px bg-line" />

          {/* Pending / Rejected notices */}
          {client.status === 'PENDING' && (
            <div className="mb-8 max-w-lg border border-line bg-white p-6">
              <p className="mb-1 text-sm font-medium">Заявку на розгляді</p>
              <p className="text-sm text-muted leading-relaxed">
                Ми розглянемо ваш запит та зв'яжемося з вами найближчим часом на{' '}
                <span className="text-ink">{client.email}</span>.
              </p>
            </div>
          )}
          {client.status === 'REJECTED' && (
            <div className="mb-8 max-w-lg border border-line bg-white p-6">
              <p className="mb-1 text-sm font-medium">Реєстрацію не підтверджено</p>
              <p className="text-sm text-muted leading-relaxed">
                {client.adminNote ? `Причина: ${client.adminNote}. ` : ''}
                Зв'яжіться з нами для уточнення деталей.
              </p>
              {settings.phone && (
                <a href={`tel:${settings.phone}`}
                  className="mt-3 inline-block text-sm text-ink underline underline-offset-2 hover:no-underline">
                  {settings.phone}
                </a>
              )}
            </div>
          )}

          {/* Stage list */}
          <div className="max-w-lg space-y-1.5">
            {STAGES.map((s, i) => {
              const status = getStatus(i);
              const clickable = isApproved && status !== 'PENDING';
              const isActive = status === 'ACTIVE';
              const isDone = status === 'DONE';

              const card = (
                <div className={`flex items-center justify-between border px-5 py-4 transition-all ${
                  isActive
                    ? 'border-line bg-white'
                    : isDone
                    ? 'border-line bg-white'
                    : 'border-line bg-white opacity-40'
                } ${clickable ? 'hover:border-ink hover:shadow-sm active:scale-[0.995]' : 'cursor-default'}`}>
                  <div className="flex items-center gap-4">
                    <span className="w-4 shrink-0 text-[10px] text-muted">{s.num}</span>
                    <span className={`text-sm ${isActive ? 'font-medium text-ink' : isDone ? 'text-ink' : 'text-muted'}`}>
                      {s.title}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    {isActive && (
                      <span className="text-[10px] uppercase tracking-widest text-[rgb(var(--terra))]">В роботі</span>
                    )}
                    {isDone && (
                      <span className="text-[10px] uppercase tracking-widest text-muted">Завершено</span>
                    )}
                    {clickable && <span className="text-xs text-muted">→</span>}
                  </div>
                </div>
              );

              return clickable ? (
                <Link key={s.num} href={`/miy-proekt/${i}`} className="block">{card}</Link>
              ) : (
                <div key={s.num}>{card}</div>
              );
            })}
          </div>

          {/* Contacts */}
          <div className="mt-12 border-t border-line pt-8">
            <p className="mb-3 text-[10px] uppercase tracking-[0.25em] text-muted">Контакти</p>
            <div className="flex flex-wrap gap-6 text-xs">
              {settings.phone && (
                <a href={`tel:${settings.phone}`} className="text-muted hover:text-ink transition-colors">{settings.phone}</a>
              )}
              {settings.email && (
                <a href={`mailto:${settings.email}`} className="text-muted hover:text-ink transition-colors">{settings.email}</a>
              )}
              {settings.telegram && (
                <a href={settings.telegram} target="_blank" rel="noopener noreferrer"
                  className="text-muted hover:text-ink transition-colors">Telegram</a>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
