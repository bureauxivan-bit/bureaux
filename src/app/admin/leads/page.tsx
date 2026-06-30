'use client';
import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { LEAD_STATUS_LABELS, LEAD_LOST_REASONS, FUNNEL_STAGES, LEAD_TYPE_LABELS } from '@/lib/constants';

type Lead = {
  id: string;
  source: string;
  externalId: string | null;
  name: string | null;
  phone: string | null;
  email: string | null;
  type: string;
  message: string | null;
  clientName: string | null;
  objectType: string | null;
  areaM2: number | null;
  location: string | null;
  service: string | null;
  status: string;
  lostReason: string | null;
  kpId: string | null;
  lastClientMsgAt: string | null;
  pushSentAt: string | null;
  createdAt: string;
};

type HistoryEntry = { id: string; status: string; changedAt: string };

type Stats = {
  period: { start: string; end: string };
  total: number;
  funnel: Record<string, number>;
  conversions: Record<string, number | null>;
  bySource: { instagram: Record<string, number>; site: Record<string, number> };
  lostReasons: Record<string, number>;
};

const ALL_STATUSES = [...FUNNEL_STAGES, 'postponed', 'lost', 'not_client'];

function fmtDate(iso: string | null) {
  if (!iso) return '—';
  return new Date(iso).toLocaleString('uk-UA', { timeZone: 'Europe/Kyiv', day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' });
}

function fmtMonth(iso: string) {
  return new Date(iso).toLocaleDateString('uk-UA', { month: 'long', year: 'numeric' });
}

// ── Funnel bar (real-time current view) ──────────────────────────────────────
function FunnelBar({ leads }: { leads: Lead[] }) {
  const counts = Object.fromEntries(ALL_STATUSES.map((s) => [s, 0]));
  leads.forEach((l) => { if (counts[l.status] !== undefined) counts[l.status]++; });

  return (
    <div className="border border-paper/10 p-5 mb-6">
      <div className="flex flex-wrap items-end gap-x-0 gap-y-3">
        {FUNNEL_STAGES.map((stage, i) => {
          const count = counts[stage];
          const prev = i > 0 ? counts[FUNNEL_STAGES[i - 1]] : null;
          const conv = prev ? (prev > 0 ? Math.round((count / prev) * 100) : 0) : null;
          return (
            <div key={stage} className="flex items-center gap-0">
              {i > 0 && <span className="mx-2 text-paper/20">→</span>}
              <div className="text-center min-w-[64px]">
                <div className={`text-2xl font-semibold tabular-nums ${count > 0 ? 'text-paper' : 'text-paper/30'}`}>{count}</div>
                <div className="text-[10px] text-paper/40 mt-0.5 uppercase tracking-wide">{LEAD_STATUS_LABELS[stage]}</div>
                {conv !== null && (
                  <div className={`text-[10px] mt-0.5 ${conv >= 50 ? 'text-paper/60' : 'text-paper/30'}`}>{conv}%</div>
                )}
              </div>
            </div>
          );
        })}
        <div className="ml-auto flex gap-6 text-sm text-paper/40">
          <span>Відкладено: <b className="text-paper/60">{counts.postponed}</b></span>
          <span>Відмова: <b className="text-paper/60">{counts.lost}</b></span>
          <span>Не клієнт: <b className="text-paper/60">{counts.not_client}</b></span>
        </div>
      </div>
    </div>
  );
}

// ── Dashboard (monthly stats) ────────────────────────────────────────────────
function Dashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [month, setMonth] = useState('');
  const [loading, setLoading] = useState(true);

  const load = useCallback(async (m: string) => {
    setLoading(true);
    const params = m ? `?month=${m}` : '';
    const res = await fetch(`/api/admin/leads/stats${params}`);
    setStats(res.ok ? await res.json() : null);
    setLoading(false);
  }, []);

  useEffect(() => { load(month); }, [load, month]);

  if (loading) return <p className="text-paper/50 py-4">Завантаження…</p>;
  if (!stats) return <p className="text-paper/50 py-4">Помилка завантаження статистики.</p>;

  const totalLost = stats.funnel.lost ?? 0;
  const lostReasonEntries = Object.entries(stats.lostReasons).sort((a, b) => b[1] - a[1]);

  return (
    <div className="space-y-6">
      {/* Period selector */}
      <div className="flex items-center gap-3">
        <span className="text-sm text-paper/50">Місяць:</span>
        <input
          type="month"
          value={month}
          onChange={(e) => setMonth(e.target.value)}
          className="border border-paper/20 bg-transparent px-3 py-1.5 text-sm outline-none [color-scheme:dark]"
        />
        {month && (
          <button onClick={() => setMonth('')} className="text-xs text-paper/40 hover:text-paper/70">
            Поточний
          </button>
        )}
        <span className="text-sm text-paper/40">
          {fmtMonth(stats.period.start)} · {stats.total} заявок
        </span>
      </div>

      {/* Funnel grid */}
      <div className="border border-paper/10 p-5">
        <div className="text-[10px] text-paper/40 uppercase tracking-widest mb-4">Воронка за період</div>
        <div className="flex flex-wrap items-end gap-x-0 gap-y-3">
          {FUNNEL_STAGES.map((stage, i) => {
            const count = stats.funnel[stage] ?? 0;
            const convKey = i > 0 ? `${FUNNEL_STAGES[i - 1]}_to_${stage}` : null;
            const conv = convKey ? stats.conversions[convKey] : null;
            const igCount = stats.bySource.instagram[stage] ?? 0;
            const siteCount = stats.bySource.site[stage] ?? 0;
            return (
              <div key={stage} className="flex items-center gap-0">
                {i > 0 && <span className="mx-2 text-paper/20">→</span>}
                <div className="text-center min-w-[72px]">
                  <div className={`text-2xl font-semibold tabular-nums ${count > 0 ? 'text-paper' : 'text-paper/30'}`}>{count}</div>
                  <div className="text-[10px] text-paper/40 mt-0.5 uppercase tracking-wide">{LEAD_STATUS_LABELS[stage]}</div>
                  {conv !== null && conv !== undefined && (
                    <div className={`text-[10px] mt-0.5 ${conv >= 50 ? 'text-paper/60' : 'text-paper/30'}`}>{conv}%</div>
                  )}
                  {count > 0 && (
                    <div className="text-[9px] text-paper/25 mt-0.5 space-x-1">
                      {igCount > 0 && <span>IG:{igCount}</span>}
                      {siteCount > 0 && <span>С:{siteCount}</span>}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Postponed / lost / not_client */}
        <div className="mt-4 pt-4 border-t border-paper/8 flex flex-wrap gap-6 text-sm text-paper/40">
          <span>Відкладено: <b className="text-paper/60">{stats.funnel.postponed ?? 0}</b></span>
          <span>Відмова: <b className="text-paper/60">{totalLost}</b></span>
          <span>Не клієнт: <b className="text-paper/60">{stats.funnel.not_client ?? 0}</b></span>
        </div>
      </div>

      {/* Lost reasons */}
      {lostReasonEntries.length > 0 && (
        <div className="border border-paper/10 p-5">
          <div className="text-[10px] text-paper/40 uppercase tracking-widest mb-4">Причини відмов</div>
          <div className="space-y-2">
            {lostReasonEntries.map(([reason, count]) => (
              <div key={reason} className="flex items-center gap-3">
                <div className="w-28 text-sm text-paper/60">{reason}</div>
                <div
                  className="h-1.5 bg-paper/20"
                  style={{ width: `${Math.round((count / totalLost) * 100)}%`, minWidth: 8 }}
                />
                <div className="text-sm text-paper/50 tabular-nums">{count}</div>
                <div className="text-xs text-paper/30">{Math.round((count / totalLost) * 100)}%</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Source breakdown */}
      <div className="border border-paper/10 p-5">
        <div className="text-[10px] text-paper/40 uppercase tracking-widest mb-4">Джерела</div>
        <div className="flex gap-10 text-sm">
          {(['instagram', 'site'] as const).map((src) => {
            const total = Object.values(stats.bySource[src]).reduce((a, b) => a + b, 0);
            return (
              <div key={src}>
                <div className="text-paper/50 mb-1 text-xs uppercase tracking-wide">{src === 'instagram' ? 'Instagram' : 'Сайт'}</div>
                <div className="text-2xl font-semibold">{total}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ── Lead history inline ───────────────────────────────────────────────────────
function LeadHistory({ leadId }: { leadId: string }) {
  const [history, setHistory] = useState<HistoryEntry[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/admin/leads/${leadId}/history`)
      .then((r) => r.json())
      .then((data) => { setHistory(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [leadId]);

  if (loading) return <p className="text-paper/30 text-xs mt-2">Завантаження…</p>;
  if (!history?.length) return <p className="text-paper/30 text-xs mt-2">Хронологія порожня.</p>;

  return (
    <div className="mt-3 pt-3 border-t border-paper/8 flex flex-wrap gap-x-4 gap-y-1.5">
      {history.map((h, i) => (
        <div key={h.id} className="flex items-center gap-1.5 text-xs text-paper/40">
          {i > 0 && <span className="text-paper/15">·</span>}
          <span className={h.status === history[history.length - 1].status ? 'text-paper/70' : ''}>
            {LEAD_STATUS_LABELS[h.status] ?? h.status}
          </span>
          <span className="text-paper/25">{fmtDate(h.changedAt)}</span>
        </div>
      ))}
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function LeadsPage() {
  const router = useRouter();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [filterStatus, setFilterStatus] = useState('');
  const [filterSource, setFilterSource] = useState('');
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<'list' | 'dashboard'>('list');
  const [expandedHistory, setExpandedHistory] = useState<Set<string>>(new Set());

  const openCreateKp = (l: Lead) => {
    const params = new URLSearchParams({ fromLead: l.id });
    const name = l.clientName || l.name || '';
    if (name) params.set('name', name);
    if (l.objectType) params.set('objectType', l.objectType);
    if (l.areaM2) params.set('areaM2', String(l.areaM2));
    if (l.location) params.set('location', l.location);
    if (l.service) params.set('service', l.service);
    router.push(`/admin/kp?${params.toString()}`);
  };

  const load = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (filterStatus) params.set('status', filterStatus);
    if (filterSource) params.set('source', filterSource);
    const res = await fetch(`/api/admin/leads?${params}`);
    setLeads(res.ok ? await res.json() : []);
    setLoading(false);
  }, [filterStatus, filterSource]);

  useEffect(() => { load(); }, [load]);

  const setLeadStatus = async (id: string, newStatus: string) => {
    setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, status: newStatus } : l)));
    await fetch(`/api/admin/leads/${id}/status`, {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus }),
    });
  };

  const setLostReason = async (id: string, reason: string) => {
    setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, lostReason: reason } : l)));
    await fetch(`/api/admin/leads/${id}`, {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ lostReason: reason }),
    });
  };

  const deleteLead = async (id: string) => {
    if (!confirm('Видалити заявку?')) return;
    setLeads((prev) => prev.filter((l) => l.id !== id));
    await fetch(`/api/admin/leads/${id}`, { method: 'DELETE' });
  };

  const toggleHistory = (id: string) => {
    setExpandedHistory((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const funnelLeads = filterStatus || filterSource ? [] : leads;

  const displayName = (l: Lead) => l.clientName || l.name || '—';
  const displayDetails = (l: Lead) => {
    const parts = [l.objectType, l.areaM2 ? `${l.areaM2} м²` : null, l.location].filter(Boolean);
    return parts.join(', ') || (l.service ?? null);
  };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <h1 className="display-xl text-2xl">Заявки</h1>
        <div className="flex items-center gap-3">
          <div className="flex border border-paper/20">
            {(['list', 'dashboard'] as const).map((t) => (
              <button key={t} onClick={() => setTab(t)}
                className={`px-4 py-2 text-sm transition-colors ${tab === t ? 'bg-paper text-ink' : 'text-paper/50 hover:text-paper/80'}`}>
                {t === 'list' ? 'Список' : 'Дашборд'}
              </button>
            ))}
          </div>
          {tab === 'list' && (
            <a href="/api/admin/leads/export" className="border border-paper/20 px-4 py-2 text-sm hover:border-paper/50">
              Експорт CSV
            </a>
          )}
        </div>
      </div>

      {tab === 'dashboard' ? (
        <Dashboard />
      ) : (
        <>
          {!filterStatus && !filterSource && <FunnelBar leads={leads} />}

          <div className="flex flex-wrap gap-2 mb-6">
            <Select value={filterSource} onChange={setFilterSource} placeholder="Усі джерела"
              options={[{ value: 'instagram', label: 'Instagram' }, { value: 'site', label: 'Сайт' }]} />
            <Select value={filterStatus} onChange={setFilterStatus} placeholder="Усі статуси"
              options={ALL_STATUSES.map((s) => ({ value: s, label: LEAD_STATUS_LABELS[s] }))} />
          </div>

          <div className="space-y-3">
            {loading ? <p className="text-paper/50">Завантаження…</p>
              : leads.length ? leads.map((l) => {
                const details = displayDetails(l);
                const histOpen = expandedHistory.has(l.id);
                return (
                  <div key={l.id} className="border border-paper/10 p-5">
                    <div className="flex flex-wrap items-start justify-between gap-4">

                      {/* Left: identity + details */}
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className={`text-[10px] px-1.5 py-0.5 border font-mono uppercase tracking-wide
                            ${l.source === 'instagram' ? 'border-paper/30 text-paper/60' : 'border-paper/15 text-paper/40'}`}>
                            {l.source === 'instagram' ? 'IG' : 'САЙТ'}
                          </span>
                          <span className="font-semibold">{displayName(l)}</span>
                          {l.phone && <a href={`tel:${l.phone}`} className="text-sm text-paper/60">{l.phone}</a>}
                          {l.email && <a href={`mailto:${l.email}`} className="text-sm text-paper/40">{l.email}</a>}
                        </div>

                        {details && <p className="mt-1 text-sm text-paper/60">{details}</p>}
                        {l.service && details !== l.service && <p className="text-xs text-paper/40">{l.service}</p>}
                        {l.message && <p className="mt-1.5 max-w-xl text-xs text-paper/40">{l.message}</p>}

                        <div className="mt-2 flex flex-wrap gap-3 text-xs text-paper/35">
                          <span>{fmtDate(l.createdAt)}</span>
                          {l.source === 'instagram' && (
                            <>
                              {l.lastClientMsgAt && <span>Повід.: {fmtDate(l.lastClientMsgAt)}</span>}
                              <span className={l.pushSentAt ? 'text-paper/50' : ''}>
                                Push: {l.pushSentAt ? fmtDate(l.pushSentAt) : '—'}
                              </span>
                            </>
                          )}
                          {l.type && l.source === 'site' && LEAD_TYPE_LABELS[l.type] && (
                            <span>{LEAD_TYPE_LABELS[l.type]}</span>
                          )}
                          {l.kpId ? (
                            <a href="/admin/kp" className="text-green-400 hover:text-green-300 underline">
                              КП ✓
                            </a>
                          ) : (
                            <button onClick={() => openCreateKp(l)}
                              className="text-paper/50 hover:text-paper/80 underline">
                              → Створити КП
                            </button>
                          )}
                          <button onClick={() => toggleHistory(l.id)}
                            className="text-paper/30 hover:text-paper/60 transition-colors">
                            {histOpen ? 'сховати хронологію' : 'хронологія'}
                          </button>
                        </div>

                        {histOpen && <LeadHistory leadId={l.id} />}

                        {l.status === 'lost' && (
                          <div className="mt-2">
                            <select
                              value={l.lostReason ?? ''}
                              onChange={(e) => setLostReason(l.id, e.target.value)}
                              className="border border-paper/15 bg-transparent px-2 py-1 text-xs text-paper/50 outline-none [&>option]:bg-[#0f0e0d]"
                            >
                              <option value="">— причина відмови —</option>
                              {LEAD_LOST_REASONS.map((r) => <option key={r} value={r}>{r}</option>)}
                            </select>
                          </div>
                        )}
                      </div>

                      {/* Right: status buttons + delete */}
                      <div className="flex flex-col items-end gap-2">
                        <div className="flex flex-wrap justify-end gap-1 max-w-[360px]">
                          {ALL_STATUSES.map((s) => (
                            <button key={s} onClick={() => setLeadStatus(l.id, s)}
                              className={`px-2.5 py-1 text-[11px] transition-colors ${
                                l.status === s ? 'bg-paper text-ink' : 'bg-paper/8 text-paper/50 hover:bg-paper/15'
                              }`}>
                              {LEAD_STATUS_LABELS[s]}
                            </button>
                          ))}
                        </div>
                        <button onClick={() => deleteLead(l.id)}
                          className="text-xs text-paper/25 hover:text-red-400 transition-colors px-1">
                          видалити
                        </button>
                      </div>

                    </div>
                  </div>
                );
              }) : <p className="text-paper/50">Заявок не знайдено.</p>}
          </div>
        </>
      )}
    </div>
  );
}

function Select({ value, onChange, options, placeholder }: {
  value: string; onChange: (v: string) => void; placeholder: string;
  options: { value: string; label: string }[];
}) {
  return (
    <select value={value} onChange={(e) => onChange(e.target.value)}
      className="border border-paper/20 bg-transparent px-4 py-2 text-sm outline-none [&>option]:bg-[#0f0e0d]">
      <option value="">{placeholder}</option>
      {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
    </select>
  );
}
