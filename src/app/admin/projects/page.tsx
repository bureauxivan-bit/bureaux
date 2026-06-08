'use client';
import { useEffect, useState } from 'react';
import { CATEGORY_LABELS, CATEGORY_ORDER } from '@/lib/constants';

type Img = { id: string; url: string; order: number };
type Project = {
  id: string; title: string; slug: string; year: number; category: string;
  description: string | null; areaM2: number | null; location: string | null;
  isTop: boolean; coverId: string | null; images: Img[];
};

const empty = (): Project => ({
  id: '', title: '', slug: '', year: new Date().getFullYear(), category: 'PRIVATE',
  description: '', areaM2: null, location: '', isTop: false, coverId: null, images: [],
});

export default function ProjectsAdmin() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [editing, setEditing] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const res = await fetch('/api/admin/projects');
    setProjects(res.ok ? await res.json() : []);
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const remove = async (id: string) => {
    if (!confirm('Видалити проєкт разом із фото?')) return;
    await fetch(`/api/admin/projects/${id}`, { method: 'DELETE' });
    load();
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="display-xl text-2xl">Проєкти</h1>
        <button onClick={() => setEditing(empty())} className="btn-terra !px-5 !py-2.5 text-xs">+ Додати проєкт</button>
      </div>

      {loading ? <p className="mt-6 text-paper/50">Завантаження…</p> : (
        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((p) => {
            const cover = p.images.find((i) => i.id === p.coverId)?.url ?? p.images[0]?.url;
            return (
              <div key={p.id} className="overflow-hidden rounded-2xl border border-paper/10">
                <div className="relative aspect-[4/3] bg-paper/5">
                  {cover && <img src={cover} alt="" className="h-full w-full object-cover" />}
                  {p.isTop && <span className="absolute left-2 top-2 rounded-full bg-terra px-2 py-0.5 text-[10px]">TOP</span>}
                </div>
                <div className="p-4">
                  <p className="font-semibold">{p.title}</p>
                  <p className="text-xs text-paper/40">{CATEGORY_LABELS[p.category]} · {p.year} · {p.images.length} фото</p>
                  <div className="mt-3 flex gap-3 text-sm">
                    <button onClick={() => setEditing(p)} className="text-paper/70 hover:text-terra">Редагувати</button>
                    <button onClick={() => remove(p.id)} className="text-paper/40 hover:text-terra">Видалити</button>
                  </div>
                </div>
              </div>
            );
          })}
          {!projects.length && <p className="text-paper/50">Поки немає проєктів.</p>}
        </div>
      )}

      {editing && <ProjectEditor project={editing} onClose={() => setEditing(null)} onSaved={() => { setEditing(null); load(); }} />}
    </div>
  );
}

function ProjectEditor({ project, onClose, onSaved }: { project: Project; onClose: () => void; onSaved: () => void }) {
  const [p, setP] = useState<Project>(project);
  const [uploading, setUploading] = useState(false);
  const [err, setErr] = useState('');

  const set = (k: keyof Project, v: any) => setP((s) => ({ ...s, [k]: v }));

  const saveMeta = async (): Promise<string | null> => {
    const payload = {
      title: p.title, slug: p.slug, year: Number(p.year), category: p.category,
      description: p.description, areaM2: p.areaM2 ? Number(p.areaM2) : null,
      location: p.location, isTop: p.isTop,
    };
    const url = p.id ? `/api/admin/projects/${p.id}` : '/api/admin/projects';
    const res = await fetch(url, {
      method: p.id ? 'PATCH' : 'POST',
      headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload),
    });
    if (!res.ok) { setErr('Перевірте поля (slug — лише латиниця/цифри/дефіс).'); return null; }
    const saved = await res.json();
    return saved.id as string;
  };

  const handleSave = async () => {
    setErr('');
    const id = await saveMeta();
    if (id) { if (!p.id) setP((s) => ({ ...s, id })); onSaved(); }
  };

  const uploadImages = async (files: FileList) => {
    setErr('');
    let id = p.id;
    if (!id) { const newId = await saveMeta(); if (!newId) return; id = newId; setP((s) => ({ ...s, id: newId })); }
    setUploading(true);
    for (const file of Array.from(files)) {
      const fd = new FormData(); fd.append('file', file);
      const up = await fetch('/api/upload', { method: 'POST', body: fd });
      if (!up.ok) continue;
      const meta = await up.json();
      const att = await fetch(`/api/admin/projects/${id}/images`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(meta),
      });
      if (att.ok) {
        const img = await att.json();
        setP((s) => ({ ...s, images: [...s.images, img], coverId: s.coverId ?? img.id }));
      }
    }
    setUploading(false);
  };

  const fieldCls = 'mt-1 w-full rounded-xl border border-paper/20 bg-transparent px-4 py-2.5 outline-none focus:border-terra [&>option]:bg-[#1a1917]';

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto p-4">
      <div className="absolute inset-0 bg-black/70" onClick={onClose} />
      <div className="relative my-8 w-full max-w-2xl rounded-2xl bg-[#1a1917] p-6">
        <h2 className="display-xl mb-4 text-lg">{p.id ? 'Редагування проєкту' : 'Новий проєкт'}</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="text-sm"><span className="text-paper/60">Назва</span>
            <input value={p.title} onChange={(e) => set('title', e.target.value)} className={fieldCls} /></label>
          <label className="text-sm"><span className="text-paper/60">Slug</span>
            <input value={p.slug} onChange={(e) => set('slug', e.target.value)} placeholder="crystal-park" className={fieldCls} /></label>
          <label className="text-sm"><span className="text-paper/60">Рік</span>
            <input type="number" value={p.year} onChange={(e) => set('year', e.target.value)} className={fieldCls} /></label>
          <label className="text-sm"><span className="text-paper/60">Категорія</span>
            <select value={p.category} onChange={(e) => set('category', e.target.value)} className={fieldCls}>
              {CATEGORY_ORDER.map((c) => <option key={c} value={c}>{CATEGORY_LABELS[c]}</option>)}
            </select></label>
          <label className="text-sm"><span className="text-paper/60">Площа, м²</span>
            <input type="number" value={p.areaM2 ?? ''} onChange={(e) => set('areaM2', e.target.value)} className={fieldCls} /></label>
          <label className="text-sm"><span className="text-paper/60">Локація</span>
            <input value={p.location ?? ''} onChange={(e) => set('location', e.target.value)} className={fieldCls} /></label>
          <label className="text-sm sm:col-span-2"><span className="text-paper/60">Опис</span>
            <textarea rows={3} value={p.description ?? ''} onChange={(e) => set('description', e.target.value)} className={fieldCls} /></label>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={p.isTop} onChange={(e) => set('isTop', e.target.checked)} /> Топ-проєкт
          </label>
        </div>

        {/* gallery */}
        <div className="mt-5">
          <p className="text-sm text-paper/60">Фото {p.id ? '' : '(буде створено чернетку проєкту)'}</p>
          <div className="mt-2 grid grid-cols-3 gap-2 sm:grid-cols-4">
            {p.images.map((img) => (
              <button key={img.id} type="button" onClick={() => set('coverId', img.id)}
                className={`relative aspect-square overflow-hidden rounded-lg border-2 ${p.coverId === img.id ? 'border-terra' : 'border-transparent'}`}>
                <img src={img.url} alt="" className="h-full w-full object-cover" />
                {p.coverId === img.id && <span className="absolute bottom-1 left-1 rounded bg-terra px-1.5 text-[9px]">обкладинка</span>}
              </button>
            ))}
            <label className="flex aspect-square cursor-pointer items-center justify-center rounded-lg border border-dashed border-paper/30 text-2xl text-paper/40 hover:border-terra">
              +
              <input type="file" accept="image/*" multiple className="hidden"
                onChange={(e) => e.target.files && uploadImages(e.target.files)} />
            </label>
          </div>
          {uploading && <p className="mt-2 text-xs text-terra">Завантаження фото…</p>}
          <p className="mt-2 text-xs text-paper/40">Натисніть на фото, щоб зробити його обкладинкою.</p>
        </div>

        {err && <p className="mt-4 text-sm text-terra">{err}</p>}
        <div className="mt-5 flex gap-3">
          <button onClick={handleSave} className="btn-terra">Зберегти</button>
          <button onClick={onClose} className="text-sm text-paper/60 hover:text-paper">Закрити</button>
        </div>
      </div>
    </div>
  );
}
