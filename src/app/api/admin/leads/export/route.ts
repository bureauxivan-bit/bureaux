import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';
import { LEAD_TYPE_LABELS, LEAD_STATUS_LABELS } from '@/lib/constants';

export async function GET() {
  const unauth = await requireAdmin(); if (unauth) return unauth;
  const leads = await prisma.lead.findMany({ orderBy: { createdAt: 'desc' } });
  const header = ['Дата', "Ім'я", 'Телефон', 'Тип', 'Статус', 'Повідомлення'];
  const rows = leads.map((l) => [
    l.createdAt.toISOString(),
    l.name, l.phone,
    LEAD_TYPE_LABELS[l.type] ?? l.type,
    LEAD_STATUS_LABELS[l.status] ?? l.status,
    (l.message ?? '').replace(/\n/g, ' '),
  ]);
  const csv = [header, ...rows]
    .map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(','))
    .join('\n');
  return new Response('\uFEFF' + csv, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="leads-${Date.now()}.csv"`,
    },
  });
}
