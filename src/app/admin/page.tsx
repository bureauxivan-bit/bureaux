import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { LEAD_TYPE_LABELS, LEAD_STATUS_LABELS } from '@/lib/constants';

export const dynamic = 'force-dynamic';

export default async function AdminDashboard() {
  const [projects, leadsNew, leadsTotal, reviews, recent] = await Promise.all([
    prisma.project.count(),
    prisma.lead.count({ where: { status: 'NEW' } }),
    prisma.lead.count(),
    prisma.review.count(),
    prisma.lead.findMany({ orderBy: { createdAt: 'desc' }, take: 6 }),
  ]);

  const stats = [
    { label: 'Нові заявки', value: leadsNew, href: '/admin/leads', accent: true },
    { label: 'Всього заявок', value: leadsTotal, href: '/admin/leads' },
    { label: 'Проєкти', value: projects, href: '/admin/projects' },
    { label: 'Відгуки', value: reviews, href: '/admin/reviews' },
  ];

  return (
    <div>
      <h1 className="display-xl text-2xl">Огляд</h1>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <Link key={s.label} href={s.href}
            className={`border p-6 transition-colors ${s.accent ? 'border-paper bg-paper/15' : 'border-paper/10 hover:border-paper/30'}`}>
            <div className="display-xl text-4xl">{s.value}</div>
            <div className="mt-2 text-sm text-paper/60">{s.label}</div>
          </Link>
        ))}
      </div>

      <h2 className="mt-12 text-sm uppercase tracking-wider text-paper/50">Останні заявки</h2>
      <div className="mt-4 overflow-hidden border border-paper/10">
        {recent.length ? recent.map((l) => (
          <div key={l.id} className="flex items-center justify-between gap-4 border-b border-paper/10 px-5 py-4 last:border-0">
            <div className="min-w-0">
              <p className="truncate font-medium">{l.name} · <span className="text-paper/60">{l.phone}</span></p>
              <p className="text-xs text-paper/40">{LEAD_TYPE_LABELS[l.type]} · {new Date(l.createdAt).toLocaleString('uk-UA', { timeZone: 'Europe/Kyiv' })}</p>
            </div>
            <span className="shrink-0 bg-paper/10 px-3 py-1 text-xs">{LEAD_STATUS_LABELS[l.status]}</span>
          </div>
        )) : <p className="p-5 text-sm text-paper/50">Заявок поки немає.</p>}
      </div>
    </div>
  );
}
