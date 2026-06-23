import { redirect, notFound } from 'next/navigation';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { getClientSession } from '@/lib/client-auth';
import { CLIENT_PROJECT_TYPE_LABELS } from '@/lib/constants';
import { ClientLogout } from '@/components/ClientLogout';
import { VizPageClient } from '@/components/VizPageClient';
import { StageApproveSection } from '@/components/StageApproveSection';

export const dynamic = 'force-dynamic';

const STAGES = [
  { num: '01', title: 'Договір', type: 'files' },
  { num: '02', title: 'Заміри', type: 'files' },
  { num: '03', title: 'Планувальне рішення', type: 'files' },
  { num: '04', title: 'Візуалізації', type: 'visualizations' },
  { num: '05', title: 'Робоча документація', type: 'files' },
  { num: '06', title: 'Специфікації', type: 'spec' },
] as const;

type StageStatus = 'DONE' | 'ACTIVE' | 'PENDING';

function clientShortId(createdAt: Date) {
  const y = createdAt.getFullYear().toString().slice(-2);
  const m = String(createdAt.getMonth() + 1).padStart(2, '0');
  return `${y}-${m}`;
}

export async function generateMetadata({ params }: { params: { stage: string } }) {
  const idx = parseInt(params.stage, 10);
  const s = STAGES[idx];
  return { title: s ? `${s.title} — bureau X` : 'bureau X', robots: { index: false, follow: false } };
}

export default async function StagePage({ params }: { params: { stage: string } }) {
  const session = await getClientSession();
  if (!session) redirect('/login');

  const idx = parseInt(params.stage, 10);
  if (isNaN(idx) || idx < 0 || idx > 5) notFound();

  const stageInfo = STAGES[idx];

  const [client, stage, allStages] = await Promise.all([
    prisma.clientUser.findUnique({
      where: { id: session.clientId },
      select: {
        id: true, name: true, projectType: true, projectName: true, projectAddress: true, projectCity: true,
        status: true, createdAt: true,
      },
    }),
    prisma.clientStage.findUnique({
      where: { clientId_stageIndex: { clientId: session.clientId, stageIndex: idx } },
      include: {
        files: { orderBy: { createdAt: 'asc' } },
        rooms: {
          orderBy: { order: 'asc' },
          include: {
            visualizations: { orderBy: { order: 'asc' } },
            revisions: { orderBy: { createdAt: 'desc' } },
          },
        },
        specItems: { orderBy: { order: 'asc' } },
        revisions: { orderBy: { createdAt: 'desc' } },
      },
    }),
    prisma.clientStage.findMany({
      where: { clientId: session.clientId },
      orderBy: { stageIndex: 'asc' },
      select: { stageIndex: true, status: true },
    }),
  ]);

  if (!client) redirect('/login');
  if (client.status !== 'APPROVED') redirect('/miy-proekt');
  if (!stage || stage.status === 'PENDING') redirect('/miy-proekt');

  const shortId = clientShortId(new Date(client.createdAt));
  const projectLabel = client.projectName ?? client.projectAddress ?? CLIENT_PROJECT_TYPE_LABELS[client.projectType];

  const stageStatusMap: Record<number, StageStatus> = {};
  allStages.forEach((s) => { stageStatusMap[s.stageIndex] = s.status as StageStatus; });

  const revisions = stage.revisions.map((r) => ({
    id: r.id,
    text: r.text,
    createdAt: r.createdAt.toISOString(),
    isFromClient: r.isFromClient,
  }));

  const rooms = stage.rooms.map((r) => ({
    id: r.id,
    name: r.name,
    clientApprovedAt: r.clientApprovedAt ? r.clientApprovedAt.toISOString() : null,
    revisions: r.revisions.map((rev) => ({
      id: rev.id,
      text: rev.text,
      createdAt: rev.createdAt.toISOString(),
      isFromClient: rev.isFromClient,
    })),
    visualizations: r.visualizations.map((v) => ({
      id: v.id,
      url: v.url,
      description: v.description,
    })),
  }));

  return (
    <div className="flex min-h-screen">
      {/* ── SIDEBAR ── */}
      <aside className="hidden md:flex sticky top-0 h-screen w-56 shrink-0 flex-col overflow-y-auto border-r border-line bg-white">
        <div className="shrink-0 border-b border-line px-5 py-5">
          <Link href="/miy-proekt"
            className="text-sm font-medium uppercase tracking-[0.2em] text-ink hover:opacity-60 transition-opacity">
            bureau <em>X</em>
          </Link>
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
            const status = stageStatusMap[i] ?? 'PENDING';
            const clickable = status !== 'PENDING';
            const isActive = status === 'ACTIVE';
            const isDone = status === 'DONE';
            const isCurrent = i === idx;

            const inner = (
              <span className={`flex items-center justify-between border-l-2 px-4 py-2.5 text-xs ${
                isCurrent
                  ? 'border-ink bg-line/50 text-ink font-medium'
                  : isActive
                  ? 'border-[rgb(var(--terra))] text-ink'
                  : isDone
                  ? 'border-transparent text-muted'
                  : 'border-transparent text-muted/40'
              }`}>
                <span className="truncate">{s.num} — {s.title}</span>
                {!isCurrent && isDone && <span className="shrink-0 ml-2 text-[10px]">✓</span>}
                {!isCurrent && isActive && <span className="h-1.5 w-1.5 shrink-0 ml-2 bg-[rgb(var(--terra))]" />}
              </span>
            );

            return clickable && !isCurrent ? (
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

      {/* ── CONTENT ── */}
      <div className="flex flex-1 flex-col bg-paper">
        {/* Mobile header */}
        <div className="flex shrink-0 items-center justify-between border-b border-line bg-white px-5 py-4 md:hidden">
          <Link href="/miy-proekt" className="text-sm font-medium uppercase tracking-[0.2em]">
            bureau <em>X</em>
          </Link>
          <ClientLogout />
        </div>

        <main className="flex flex-col px-8 py-10 lg:px-12 lg:py-12">
          {/* Back */}
          <Link href="/miy-proekt" className="mb-8 text-xs text-muted hover:text-ink transition-colors">
            ← Мій проєкт
          </Link>

          {/* Stage heading */}
          <div className="mb-1">
            <p className="text-[10px] uppercase tracking-[0.25em] text-muted">
              {stageInfo.num} / {stageInfo.title}
            </p>
          </div>

          {stage.note && (
            <div className="mt-3">
              <span className="border border-line px-3 py-1.5 text-xs text-muted">{stage.note}</span>
            </div>
          )}

          <div className="mt-6 mb-8 h-px bg-line" />

          {/* Stage content */}
          {stageInfo.type === 'files' && <FilesContent files={stage.files} />}

          {stageInfo.type === 'visualizations' && (
            <VizPageClient
              rooms={rooms}
              stageIndex={idx}
              initialStageApproved={!!stage.clientApprovedAt}
            />
          )}

          {stageInfo.type === 'spec' && <SpecContent items={stage.specItems} />}

          {/* Правки + Погодити — only for non-viz stages (viz handles its own) */}
          {stageInfo.type !== 'visualizations' && (
            <StageApproveSection
              stageIndex={idx}
              initialApproved={!!stage.clientApprovedAt}
              initialRevisions={revisions}
            />
          )}

          {/* Stage navigation */}
          <div className="mt-12 flex items-center justify-between border-t border-line pt-6">
            {idx > 0 && (stageStatusMap[idx - 1] ?? 'PENDING') !== 'PENDING' ? (
              <Link href={`/miy-proekt/${idx - 1}`}
                className="text-xs text-muted hover:text-ink transition-colors">
                ← {STAGES[idx - 1].num} {STAGES[idx - 1].title}
              </Link>
            ) : <span />}
            {idx < 5 && (stageStatusMap[idx + 1] ?? 'PENDING') !== 'PENDING' ? (
              <Link href={`/miy-proekt/${idx + 1}`}
                className="text-xs text-muted hover:text-ink transition-colors">
                {STAGES[idx + 1].num} {STAGES[idx + 1].title} →
              </Link>
            ) : <span />}
          </div>
        </main>
      </div>
    </div>
  );
}

/* ── Files ── */
function FilesContent({ files }: { files: { id: string; name: string; url: string }[] }) {
  if (!files.length) {
    return <p className="text-sm text-muted">Файли ще не додано.</p>;
  }
  return (
    <div className="space-y-2 max-w-lg">
      {files.map((f) => (
        <a key={f.id} href={f.url} target="_blank" rel="noopener noreferrer"
          className="flex items-center justify-between border border-line bg-white px-5 py-4 transition-colors hover:border-ink group">
          <span className="truncate text-sm text-ink">{f.name}</span>
          <span className="ml-4 shrink-0 text-xs text-muted group-hover:text-ink transition-colors">Відкрити →</span>
        </a>
      ))}
    </div>
  );
}

/* ── Spec ── */
function SpecContent({ items }: {
  items: { id: string; category: string | null; name: string; quantity: string | null; unit: string | null; note: string | null }[];
}) {
  if (!items.length) {
    return <p className="text-sm text-muted">Специфікацію ще не заповнено.</p>;
  }

  const grouped: Record<string, typeof items> = {};
  items.forEach((item) => {
    const cat = item.category || 'Загальне';
    if (!grouped[cat]) grouped[cat] = [];
    grouped[cat].push(item);
  });

  return (
    <div className="space-y-8">
      {Object.entries(grouped).map(([cat, catItems]) => (
        <div key={cat}>
          <h2 className="mb-3 text-[10px] uppercase tracking-[0.2em] text-muted">{cat}</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-line">
                  {['Назва', 'Кількість', 'Одиниця', 'Примітка'].map((h) => (
                    <th key={h} className="pb-2 pr-6 text-left text-xs font-normal text-muted">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {catItems.map((item) => (
                  <tr key={item.id} className="border-b border-line/60">
                    <td className="py-3 pr-6 text-ink">{item.name}</td>
                    <td className="py-3 pr-6 text-muted">{item.quantity ?? '—'}</td>
                    <td className="py-3 pr-6 text-muted">{item.unit ?? '—'}</td>
                    <td className="py-3 text-muted">{item.note ?? ''}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </div>
  );
}
