'use client';
import { useEffect, useState, useRef, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import { type KpServices, deriveServices, servicesFromString, ARCH_RATE, DESIGN_RATE, SUPERVISION_DEFAULT, MIN_AREA, ARCH_MIN, DESIGN_MIN, calcServicePrice } from '@/lib/kp-services';

type Analytics = {
  lastViewedAt: string | null;
  avgTime: number | null;
  maxTime: number | null;
  scrolledToPrice: boolean;
  scrolledToEnd: boolean;
};

type Proposal = {
  id: string; code: string; clientName: string; objectType: string | null;
  areaM2: number | null; location: string | null;
  service: string | null; priceDesign: number | null; supervisionMonthly: number | null;
  services: KpServices | null;
  startDate: string | null; durationWeeks: string; projectIds: string[];
  introText: string | null; validDays: number; status: string;
  viewCount: number; createdAt: string;
  firstViewedAt: string | null; ctaClickedAt: string | null;
  sentAt: string | null; viewedAt: string | null; meetingAt: string | null;
  contractAt: string | null; declinedAt: string | null;
  analytics: Analytics;
};

type ProjectOption = { id: string; title: string; category: string; areaM2: number | null; location: string | null; };

type FormState = {
  clientName: string;
  objectType: string;
  areaM2: number | null;
  location: string;
  services: KpServices;
  startDate: string;
  durationWeeks: string;
  projectIds: string[];
  introText: string;
  validDays: number;
  status: string;
};

const BLANK: FormState = {
  clientName: '', objectType: '', areaM2: null, location: '',
  services: {},
  startDate: '', durationWeeks: '~12 тижнів',
  projectIds: [], introText: '', validDays: 14, status: 'draft',
};

const CATEGORY_LABELS: Record<string, string> = {
  PRIVATE: 'Приватний', COMMERCIAL: 'Комерційний', ARCHITECTURE: 'Архітектура',
};
const STATUS_LABELS: Record<string, string> = {
  draft: 'Чернетка', sent: 'Відправлено', viewed: 'Переглянуто',
  meeting: 'Зустріч', contract: 'Договір', declined: 'Відмова',
};
const STATUS_COLOR: Record<string, string> = {
  draft: 'text-paper/40', sent: 'text-blue-400', viewed: 'text-yellow-400',
  meeting: 'text-orange-400', contract: 'text-green-400', declined: 'text-red-400',
};

function generateIntro(f: FormState) {
  if (!f.clientName) return '';
  const svc = f.services;
  const parts: string[] = [];
  if (svc.architecture?.enabled) parts.push('архітектурне проєктування');
  if (svc.design?.enabled) parts.push('дизайн інтер\'єру');
  if (svc.supervision?.enabled) parts.push('авторський супровід');
  const svcStr = parts.join(' + ');
  const meta = [svcStr || null, f.objectType || null, f.areaM2 ? `${f.areaM2} м²` : null, f.location ? `у ${f.location}` : null]
    .filter(Boolean).join(' ');
  return `${f.clientName}, на Ваш запит ми сформували комерційну пропозицію для ${meta} — з релевантними проектами, прозорим розрахунком вартості та термінами, врахованими під Ваш графік.`;
}

function fmtTime(secs: number | null): string {
  if (!secs) return '—';
  if (secs < 60) return `${secs}с`;
  return `${Math.floor(secs / 60)}хв ${secs % 60}с`;
}

function fmtDate(d: string | null): string {
  if (!d) return '—';
  return new Date(d).toLocaleDateString('uk-UA', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
}

function serviceLabel(services: KpServices): string {
  const parts: string[] = [];
  if (services.architecture?.enabled) parts.push('Архпроєкт');
  if (services.design?.enabled) parts.push('Дизайн');
  if (services.supervision?.enabled) parts.push('Супровід');
  return parts.join(' + ') || '—';
}

export default function KpPage() {
  const searchParams = useSearchParams();
  const fromLeadId = useRef<string | null>(null);

  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [projects, setProjects] = useState<ProjectOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Partial<Proposal> | null>(null);
  const [f, setF] = useState<FormState>(BLANK);
  const [saving, setSaving] = useState(false);
  const [savedCode, setSavedCode] = useState('');
  const [copied, setCopied] = useState(false);
  const introManual = useRef(false);

  const siteUrl = typeof window !== 'undefined' ? window.location.origin : '';

  // Pre-fill from lead when navigated from /admin/leads
  useEffect(() => {
    const leadId = searchParams.get('fromLead');
    if (!leadId) return;
    fromLeadId.current = leadId;
    const area = searchParams.get('areaM2');
    const service = searchParams.get('service') ?? '';
    const areaNum = area ? Number(area) : null;
    setEditing({});
    setF({
      ...BLANK,
      clientName: searchParams.get('name') ?? '',
      objectType: searchParams.get('objectType') ?? '',
      areaM2: areaNum,
      location: searchParams.get('location') ?? '',
      services: service ? servicesFromString(service, areaNum) : {},
    });
    introManual.current = false;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const load = useCallback(async () => {
    setLoading(true);
    const [pRes, projRes] = await Promise.all([
      fetch('/api/admin/kp'),
      fetch('/api/admin/projects'),
    ]);
    setProposals(pRes.ok ? await pRes.json() : []);
    const allProjects = projRes.ok ? await projRes.json() : [];
    setProjects(allProjects.map((p: { id: string; title: string; category: string; areaM2: number | null; location: string | null; }) => ({
      id: p.id, title: p.title, category: p.category, areaM2: p.areaM2, location: p.location,
    })));
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  // Auto-generate intro (only when not manually edited)
  useEffect(() => {
    if (editing?.id || introManual.current) return;
    setF((prev) => ({ ...prev, introText: generateIntro(f) }));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [f.clientName, f.services, f.objectType, f.areaM2, f.location]);

  const openNew = () => { introManual.current = false; setEditing({}); setF(BLANK); setSavedCode(''); };

  const openEdit = (p: Proposal) => {
    introManual.current = true;
    setEditing(p);
    setF({
      clientName: p.clientName,
      objectType: p.objectType ?? '',
      areaM2: p.areaM2,
      location: p.location ?? '',
      services: deriveServices(p),
      startDate: p.startDate ?? '',
      durationWeeks: p.durationWeeks,
      projectIds: p.projectIds,
      introText: p.introText ?? '',
      validDays: p.validDays,
      status: p.status,
    });
    setSavedCode(p.code);
  };

  const toggleService = (key: keyof KpServices) => {
    setF((prev) => {
      const current = prev.services[key];
      const enabled = !current?.enabled;
      const updated: KpServices = { ...prev.services };
      if (!enabled) {
        delete updated[key];
      } else {
        if (key === 'architecture') updated.architecture = { enabled: true, rate: ARCH_RATE, price: calcServicePrice(ARCH_RATE, prev.areaM2) };
        if (key === 'design') updated.design = { enabled: true, rate: DESIGN_RATE, price: calcServicePrice(DESIGN_RATE, prev.areaM2) };
        if (key === 'supervision') updated.supervision = { enabled: true, monthly: SUPERVISION_DEFAULT };
      }
      return { ...prev, services: updated };
    });
  };

  // Recalculate prices when area changes
  useEffect(() => {
    setF((prev) => {
      const updated = { ...prev.services };
      if (updated.architecture?.enabled) {
        updated.architecture = { ...updated.architecture, price: calcServicePrice(ARCH_RATE, prev.areaM2) };
      }
      if (updated.design?.enabled) {
        updated.design = { ...updated.design, price: calcServicePrice(DESIGN_RATE, prev.areaM2) };
      }
      return { ...prev, services: updated };
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [f.areaM2]);

  const setServicePrice = (key: 'architecture' | 'design', value: string) => {
    setF((prev) => ({
      ...prev,
      services: {
        ...prev.services,
        [key]: { ...prev.services[key], price: value ? Number(value) : null },
      },
    }));
  };

  const setSupervisionMonthly = (value: string) => {
    setF((prev) => ({
      ...prev,
      services: {
        ...prev.services,
        supervision: { ...prev.services.supervision, enabled: true, monthly: value ? Number(value) : SUPERVISION_DEFAULT },
      },
    }));
  };

  const suggestedPrice = (rate: number): number | null => calcServicePrice(rate, f.areaM2);

  const save = async () => {
    setSaving(true);
    const payload = {
      clientName: f.clientName,
      objectType: f.objectType || null,
      areaM2: f.areaM2 ? Number(f.areaM2) : null,
      location: f.location || null,
      services: f.services,
      // Null old fields — backward compat handled by deriveServices on read
      service: null,
      priceDesign: null,
      supervisionMonthly: null,
      startDate: f.startDate || null,
      durationWeeks: f.durationWeeks,
      projectIds: f.projectIds,
      introText: f.introText || null,
      validDays: Number(f.validDays),
      status: f.status,
    };
    const isNew = !editing?.id;
    const url = isNew ? '/api/admin/kp' : `/api/admin/kp/${editing!.id}`;
    const res = await fetch(url, {
      method: isNew ? 'POST' : 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (res.ok) {
      const saved = await res.json();
      setSavedCode(saved.code);
      await load();
      if (isNew) {
        setEditing(saved);
        // Link KP back to the lead it was created from
        if (fromLeadId.current) {
          await fetch(`/api/admin/leads/${fromLeadId.current}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ kpId: saved.id }),
          });
          fromLeadId.current = null;
        }
      }
    }
    setSaving(false);
  };

  const deleteProposal = async (id: string) => {
    if (!confirm('Видалити КП?')) return;
    setProposals((prev) => prev.filter((p) => p.id !== id));
    await fetch(`/api/admin/kp/${id}`, { method: 'DELETE' });
  };

  const toggleProject = (id: string) => {
    setF((prev) => ({
      ...prev,
      projectIds: prev.projectIds.includes(id) ? prev.projectIds.filter((x) => x !== id) : [...prev.projectIds, id],
    }));
  };

  const copyLink = async () => {
    await navigator.clipboard.writeText(`${siteUrl}/kp/${savedCode}`);
    setCopied(true); setTimeout(() => setCopied(false), 2000);
  };

  // Funnel for rolling 30-day window
  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  const monthProposals = proposals.filter((p) => new Date(p.createdAt) >= thirtyDaysAgo);
  const funnel = {
    created: monthProposals.length,
    sent: monthProposals.filter((p) => ['sent', 'viewed', 'meeting', 'contract'].includes(p.status)).length,
    viewed: monthProposals.filter((p) => ['viewed', 'meeting', 'contract'].includes(p.status)).length,
    meeting: monthProposals.filter((p) => ['meeting', 'contract'].includes(p.status)).length,
    contract: monthProposals.filter((p) => p.status === 'contract').length,
  };

  if (editing !== null) {
    const arch = f.services.architecture;
    const design = f.services.design;
    const supervision = f.services.supervision;

    return (
      <div>
        <div className="flex items-center gap-4 mb-8">
          <button onClick={() => setEditing(null)} className="text-paper/50 hover:text-paper text-sm">← Назад</button>
          <h1 className="display-xl text-2xl">{editing.id ? 'Редагувати КП' : 'Нове КП'}</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-5xl">
          {/* LEFT: client info */}
          <div className="space-y-4">
            <p className="text-xs text-paper/40 uppercase tracking-widest">Клієнт</p>
            <Field label="Ім'я клієнта *">
              <input value={f.clientName} onChange={(e) => setF((p) => ({ ...p, clientName: e.target.value }))}
                placeholder="Олена" className={inp} />
            </Field>
            <Field label="Тип об'єкта">
              <input value={f.objectType ?? ''} onChange={(e) => setF((p) => ({ ...p, objectType: e.target.value }))}
                placeholder="Квартира / Будинок / Комерція" className={inp} />
            </Field>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Площа, м²">
                <input type="number" value={f.areaM2 ?? ''} onChange={(e) => setF((p) => ({ ...p, areaM2: e.target.value ? Number(e.target.value) : null }))}
                  placeholder="140" className={inp} />
              </Field>
              <Field label="Місто">
                <input value={f.location ?? ''} onChange={(e) => setF((p) => ({ ...p, location: e.target.value }))}
                  placeholder="Київ" className={inp} />
              </Field>
            </div>

            {/* Services checkboxes */}
            <p className="text-xs text-paper/40 uppercase tracking-widest pt-2">Послуги</p>
            <div className="border border-paper/10 divide-y divide-paper/10">
              {/* Architecture */}
              <div className="p-4">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" checked={!!arch?.enabled} onChange={() => toggleService('architecture')}
                    className="accent-paper shrink-0" />
                  <span className="text-sm font-semibold">Архітектурне проєктування</span>
                  <span className="ml-auto text-xs text-paper/40">
                    {f.areaM2 && f.areaM2 < MIN_AREA ? `мін. ${ARCH_MIN.toLocaleString('uk-UA')}$` : `${ARCH_RATE}$/м²`}
                  </span>
                </label>
                {arch?.enabled && (
                  <div className="mt-3 pl-7">
                    <Field label="Вартість, $">
                      <input type="number" value={arch.price ?? ''}
                        onChange={(e) => setServicePrice('architecture', e.target.value)}
                        placeholder={suggestedPrice(ARCH_RATE)?.toString() ?? 'площа × 40'}
                        className={inp} />
                    </Field>
                  </div>
                )}
              </div>

              {/* Design */}
              <div className="p-4">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" checked={!!design?.enabled} onChange={() => toggleService('design')}
                    className="accent-paper shrink-0" />
                  <span className="text-sm font-semibold">Дизайн інтер'єру</span>
                  <span className="ml-auto text-xs text-paper/40">
                    {f.areaM2 && f.areaM2 < MIN_AREA ? `мін. ${DESIGN_MIN.toLocaleString('uk-UA')}$` : `${DESIGN_RATE}$/м²`}
                  </span>
                </label>
                {design?.enabled && (
                  <div className="mt-3 pl-7">
                    <Field label="Вартість, $">
                      <input type="number" value={design.price ?? ''}
                        onChange={(e) => setServicePrice('design', e.target.value)}
                        placeholder={suggestedPrice(DESIGN_RATE)?.toString() ?? 'площа × 60'}
                        className={inp} />
                    </Field>
                  </div>
                )}
              </div>

              {/* Supervision */}
              <div className="p-4">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" checked={!!supervision?.enabled} onChange={() => toggleService('supervision')}
                    className="accent-paper shrink-0" />
                  <span className="text-sm font-semibold">Авторський супровід</span>
                  <span className="ml-auto text-xs text-paper/40">$/міс</span>
                </label>
                {supervision?.enabled && (
                  <div className="mt-3 pl-7">
                    <Field label="$/міс">
                      <input type="number" value={supervision.monthly ?? ''}
                        onChange={(e) => setSupervisionMonthly(e.target.value)}
                        placeholder={String(SUPERVISION_DEFAULT)}
                        className={inp} />
                    </Field>
                  </div>
                )}
              </div>
            </div>

            <p className="text-xs text-paper/40 uppercase tracking-widest pt-2">Терміни</p>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Старт (текстом)">
                <input value={f.startDate ?? ''} onChange={(e) => setF((p) => ({ ...p, startDate: e.target.value }))}
                  placeholder="1 липня" className={inp} />
              </Field>
              <Field label="Тривалість">
                <input value={f.durationWeeks} onChange={(e) => setF((p) => ({ ...p, durationWeeks: e.target.value }))}
                  placeholder="~12 тижнів" className={inp} />
              </Field>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Дійсна, днів">
                <input type="number" value={f.validDays} onChange={(e) => setF((p) => ({ ...p, validDays: Number(e.target.value) }))}
                  className={inp} />
              </Field>
              <Field label="Статус">
                <select value={f.status} onChange={(e) => setF((p) => ({ ...p, status: e.target.value }))}
                  className={inp + ' [&>option]:bg-[#0f0e0d]'}>
                  <option value="draft">Чернетка</option>
                  <option value="sent">Відправлено</option>
                  <option value="viewed">Переглянуто</option>
                  <option value="meeting">Зустріч</option>
                  <option value="contract">Договір</option>
                  <option value="declined">Відмова</option>
                </select>
              </Field>
            </div>

            <Field label="Персональний текст-звернення">
              <textarea rows={5} value={f.introText ?? ''}
                onChange={(e) => { introManual.current = true; setF((p) => ({ ...p, introText: e.target.value })); }}
                className={inp + ' resize-y'} />
              <button type="button" className="mt-1 text-xs text-paper/40 hover:text-paper/70"
                onClick={() => { introManual.current = false; setF((p) => ({ ...p, introText: generateIntro(f) })); }}>
                ↺ Згенерувати автоматично
              </button>
            </Field>
          </div>

          {/* RIGHT: project selection */}
          <div>
            <p className="text-xs text-paper/40 uppercase tracking-widest mb-4">Обрати проекти ({f.projectIds.length})</p>
            <div className="border border-paper/10 overflow-y-auto max-h-[600px]">
              {projects.length === 0 && <p className="p-4 text-paper/40 text-sm">Проектів немає</p>}
              {projects.map((p) => {
                const checked = f.projectIds.includes(p.id);
                return (
                  <label key={p.id}
                    className={`flex items-start gap-3 p-4 border-b border-paper/10 cursor-pointer transition-colors ${checked ? 'bg-paper/10' : 'hover:bg-paper/5'}`}>
                    <input type="checkbox" checked={checked} onChange={() => toggleProject(p.id)}
                      className="mt-0.5 shrink-0 accent-paper" />
                    <span>
                      <span className="block font-semibold text-sm">{p.title}</span>
                      <span className="text-xs text-paper/50">
                        {CATEGORY_LABELS[p.category]}{p.areaM2 ? ` · ${p.areaM2} м²` : ''}{p.location ? ` · ${p.location}` : ''}
                      </span>
                    </span>
                  </label>
                );
              })}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-8 flex flex-wrap items-center gap-4">
          <button onClick={save} disabled={saving || !f.clientName}
            className="bg-paper text-ink px-6 py-2.5 text-sm font-semibold disabled:opacity-40">
            {saving ? 'Збереження…' : editing.id ? 'Зберегти зміни' : 'Створити КП'}
          </button>
          <button onClick={() => setEditing(null)} className="text-sm text-paper/50 hover:text-paper">Скасувати</button>

          {savedCode && (
            <div className="flex items-center gap-3 ml-auto border border-paper/20 px-4 py-2">
              <span className="text-sm text-paper/70 font-mono">/kp/{savedCode}</span>
              <button onClick={copyLink} className="text-xs font-semibold text-paper hover:text-paper/70">
                {copied ? 'Скопійовано!' : 'Копіювати'}
              </button>
              <a href={`/kp/${savedCode}`} target="_blank" rel="noopener noreferrer"
                className="text-xs text-paper/50 hover:text-paper">↗ Відкрити</a>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="display-xl text-2xl">Комерційні пропозиції</h1>
        <button onClick={openNew} className="bg-paper text-ink px-5 py-2 text-sm font-semibold">
          + Створити КП
        </button>
      </div>

      {/* Funnel — current month */}
      <div className="mt-6 border border-paper/10">
        <div className="px-5 py-3 border-b border-paper/10">
          <p className="text-xs text-paper/40 uppercase tracking-widest">Воронка — останні 30 днів</p>
        </div>
        <div className="grid grid-cols-5 divide-x divide-paper/10">
          {[
            { label: 'Створено', value: funnel.created },
            { label: 'Відправлено', value: funnel.sent, pct: funnel.created ? Math.round(funnel.sent / funnel.created * 100) : null },
            { label: 'Переглянуто', value: funnel.viewed, pct: funnel.sent ? Math.round(funnel.viewed / funnel.sent * 100) : null },
            { label: 'Зустріч', value: funnel.meeting, pct: funnel.viewed ? Math.round(funnel.meeting / funnel.viewed * 100) : null },
            { label: 'Договір', value: funnel.contract, pct: funnel.meeting ? Math.round(funnel.contract / funnel.meeting * 100) : null },
          ].map(({ label, value, pct }) => (
            <div key={label} className="p-4">
              <p className="text-xs text-paper/40 mb-1">{label}</p>
              <p className="text-2xl font-bold">{value}</p>
              {pct !== undefined && pct !== null && (
                <p className="text-xs text-paper/40 mt-0.5">→ {pct}%</p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* List */}
      <div className="mt-6 space-y-3">
        {loading ? <p className="text-paper/50">Завантаження…</p>
          : proposals.length === 0 ? <p className="text-paper/50">КП ще немає.</p>
          : proposals.map((p) => {
            const a = p.analytics;
            const svc = p.services ? serviceLabel(p.services as KpServices) : (p.service ?? '—');
            return (
              <div key={p.id} className="border border-paper/10 p-5">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  {/* Main info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline gap-3 flex-wrap">
                      <p className="font-semibold">{p.clientName}</p>
                      <span className={`text-xs font-semibold ${STATUS_COLOR[p.status] ?? 'text-paper/40'}`}>
                        {STATUS_LABELS[p.status] ?? p.status}
                      </span>
                    </div>
                    <p className="text-sm text-paper/50 mt-0.5">
                      {[p.objectType, p.areaM2 ? `${p.areaM2} м²` : null, p.location].filter(Boolean).join(' · ')}
                    </p>
                    <p className="text-xs text-paper/30 mt-1">
                      {new Date(p.createdAt).toLocaleDateString('uk-UA')} · {svc}
                    </p>

                    {/* Behavioral analytics */}
                    <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-xs text-paper/50">
                      <span>
                        <span className="text-paper/30">Переглядів:</span>{' '}
                        <span className="text-paper/70">{p.viewCount}</span>
                        {a.lastViewedAt && <span className="text-paper/30"> · востаннє {fmtDate(a.lastViewedAt)}</span>}
                      </span>
                      {(a.avgTime || a.maxTime) && (
                        <span>
                          <span className="text-paper/30">Час:</span>{' '}
                          <span className="text-paper/70">
                            {a.avgTime ? `~${fmtTime(a.avgTime)}` : ''}
                            {a.maxTime && a.avgTime ? ` / макс ${fmtTime(a.maxTime)}` : a.maxTime ? fmtTime(a.maxTime) : ''}
                          </span>
                        </span>
                      )}
                      <span>
                        <span className="text-paper/30">Ціна:</span>{' '}
                        <span className={a.scrolledToPrice ? 'text-green-400' : 'text-paper/30'}>{a.scrolledToPrice ? '✓' : '✗'}</span>
                        {' '}
                        <span className="text-paper/30">Кінець:</span>{' '}
                        <span className={a.scrolledToEnd ? 'text-green-400' : 'text-paper/30'}>{a.scrolledToEnd ? '✓' : '✗'}</span>
                      </span>
                      <span>
                        <span className="text-paper/30">CTA:</span>{' '}
                        {p.ctaClickedAt
                          ? <span className="text-green-400">✓ {fmtDate(p.ctaClickedAt)}</span>
                          : <span className="text-paper/30">✗</span>}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 shrink-0">
                    <a href={`/kp/${p.code}`} target="_blank" rel="noopener noreferrer"
                      className="px-3 py-1.5 text-xs border border-paper/20 hover:border-paper/50">
                      ↗ Відкрити
                    </a>
                    <button onClick={() => { navigator.clipboard.writeText(`${siteUrl}/kp/${p.code}`); }}
                      className="px-3 py-1.5 text-xs border border-paper/20 hover:border-paper/50">
                      Копіювати
                    </button>
                    <button onClick={() => openEdit(p)}
                      className="px-3 py-1.5 text-xs bg-paper/10 hover:bg-paper/20">
                      Редагувати
                    </button>
                    <button onClick={() => deleteProposal(p.id)}
                      className="px-2 py-1.5 text-xs text-paper/30 hover:text-red-400" title="Видалити">✕</button>
                  </div>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
}

const inp = 'w-full border border-paper/20 bg-transparent px-3 py-2 text-sm outline-none focus:border-paper/50';

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs text-paper/50 mb-1">{label}</label>
      {children}
    </div>
  );
}
