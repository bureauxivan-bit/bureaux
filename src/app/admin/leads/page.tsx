'use client';
import { useEffect, useState, useCallback } from 'react';
import { LEAD_TYPE_LABELS, LEAD_STATUS_LABELS } from '@/lib/constants';

type Lead = {
  id: string; name: string; phone: string; type: string;
  message: string | null; status: string; createdAt: string;
};

const STATUSES = ['NEW', 'IN_PROGRESS', 'CLOSED'];

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [status, setStatus] = useState('');
  const [type, setType] = useState('');
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (status) params.set('status', status);
    if (type) params.set('type', type);
    const res = await fetch(`/api/admin/leads?${params}`);
    setLeads(res.ok ? await res.json() : []);
    setLoading(false);
  }, [status, type]);

  useEffect(() => { load(); }, [load]);

  const setLeadStatus = async (id: string, newStatus: string) => {
    setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, status: newStatus } : l)));
    await fetch(`/api/admin/leads/${id}/status`, {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus }),
    });
  };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="display-xl text-2xl">Заявки</h1>
        <a href="/api/admin/leads/export" className="rounded-full border border-paper/20 px-4 py-2 text-sm hover:border-paper/50">
          Експорт CSV
        </a>
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        <Select value={status} onChange={setStatus} placeholder="Усі статуси"
          options={STATUSES.map((s) => ({ value: s, label: LEAD_STATUS_LABELS[s] }))} />
        <Select value={type} onChange={setType} placeholder="Усі типи"
          options={Object.entries(LEAD_TYPE_LABELS).map(([v, l]) => ({ value: v, label: l }))} />
      </div>

      <div className="mt-6 space-y-3">
        {loading ? <p className="text-paper/50">Завантаження…</p>
          : leads.length ? leads.map((l) => (
            <div key={l.id} className="rounded-2xl border border-paper/10 p-5">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="font-semibold">{l.name}</p>
                  <a href={`tel:${l.phone}`} className="text-sm text-terra">{l.phone}</a>
                  <p className="mt-1 text-xs text-paper/40">
                    {LEAD_TYPE_LABELS[l.type]} · {new Date(l.createdAt).toLocaleString('uk-UA')}
                  </p>
                  {l.message && <p className="mt-2 max-w-xl text-sm text-paper/70">{l.message}</p>}
                </div>
                <div className="flex gap-1">
                  {STATUSES.map((s) => (
                    <button key={s} onClick={() => setLeadStatus(l.id, s)}
                      className={`rounded-full px-3 py-1.5 text-xs transition-colors ${l.status === s ? 'bg-terra text-paper' : 'bg-paper/10 text-paper/60 hover:bg-paper/20'}`}>
                      {LEAD_STATUS_LABELS[s]}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )) : <p className="text-paper/50">Заявок не знайдено.</p>}
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
      className="rounded-full border border-paper/20 bg-transparent px-4 py-2 text-sm outline-none [&>option]:bg-[#0f0e0d]">
      <option value="">{placeholder}</option>
      {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
    </select>
  );
}
