'use client';
import { useEffect, useState, useCallback } from 'react';
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

const ALL_STATUSES = [...FUNNEL_STAGES, 'postponed', 'lost', 'not_client'];

function fmtDate(iso: string | null) {
  if (!iso) return '—';
  return new Date(iso).toLocaleString('uk-UA', { timeZone: 'Europe/Kyiv', day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' });
}

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

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [filterStatus, setFilterStatus] = useState('');
  const [filterSource, setFilterSource] = useState('');
  const [loading, setLoading] = useState(true);

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

  // All leads (unfiltered) needed for funnel bar — load them separately only if filter active
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
        <a href="/api/admin/leads/export" className="border border-paper/20 px-4 py-2 text-sm hover:border-paper/50">
          Експорт CSV
        </a>
      </div>

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
            return (
              <div key={l.id} className="border border-paper/10 p-5">
                <div className="flex flex-wrap items-start justify-between gap-4">

                  {/* Left: identity + details */}
                  <div className="min-w-0">
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
                      {l.kpId && (
                        <a href={`/admin/kp?id=${l.kpId}`} className="text-paper/50 hover:text-paper/80 underline">
                          КП →
                        </a>
                      )}
                    </div>

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
