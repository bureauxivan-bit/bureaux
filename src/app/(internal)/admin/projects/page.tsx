'use client';
import { useEffect, useState } from 'react';
import { CATEGORY_LABELS, CATEGORY_ORDER } from '@/lib/constants';

type Img = { id: string; url: string; order: number };
type Project = {
  id: string; title: string; slug: string; year: number; category: string;
  description: string | null; areaM2: number | null; location: string | null;
  titleEn: string | null; descriptionEn: string | null; locationEn: string | null;
  isTop: boolean; coverId: string | null; images: Img[];
};

const empty = (): Project => ({
  id: '', title: '', slug: '', year: new Date().getFullYear(), category: 'PRIVATE',
  description: '', areaM2: null, location: '', titleEn: '', descriptionEn: '', locationEn: '',
  isTop: false, coverId: null, images: [],
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
        <button onClick={() => setEditing(empty())} className="btn-admin !px-5 !py-2.5 text-xs">+ Додати проєкт</button>
      </div>

      {loading ? <p className="mt-6 text-paper/50">Завантаження…</p> : (
        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((p) => {
            const cover = p.images.find((i) => i.id === p.coverId)?.url ?? p.images[0]?.url;
            return (
              <div key={p.id} className="overflow-hidden border border-paper/10">
                <div className="relative aspect-[4/3] bg-paper/5">
                  {cover && <img src={cover} alt="" className="h-full w-full object-cover" />}
                  {p.isTop && <span className="absolute left-2 top-2 bg-paper/80 px-2 py-0.5 text-[10px]">TOP</span>}
                </div>
                <div className="p-4">
                  <p className="font-semibold">{p.title}</p>
                  <p className="text-xs text-paper/40">{CATEGORY_LABELS[p.category]} · {p.year} · {p.images.length} фото</p>
                  <div className="mt-3 flex gap-3 text-sm">
                    <button onClick={() => setEditing(p)} className="text-paper/70 hover:text-paper/70">Редагувати</button>
                    <button onClick={() => remove(p.id)} className="text-paper/40 hover:text-paper/70">Видалити</button>
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

// Ukrainian transliteration for auto-slug
const UKR: Record<string, string> = {
  а:'a',б:'b',в:'v',г:'h',ґ:'g',д:'d',е:'e',є:'ye',ж:'zh',з:'z',
  и:'y',і:'i',ї:'yi',й:'y',к:'k',л:'l',м:'m',н:'n',о:'o',п:'p',
  р:'r',с:'s',т:'t',у:'u',ф:'f',х:'kh',ц:'ts',ч:'ch',ш:'sh',
  щ:'shch',ь:'',ю:'yu',я:'ya',
};
const toSlug = (s: string) =>
  s.toLowerCase().split('').map(c => UKR[c] ?? c).join('')
    .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 80);

function ProjectEditor({ project, onClose, onSaved }: { project: Project; onClose: () => void; onSaved: () => void }) {
  const [p, setP] = useState<Project>(project);
  const [slugEdited, setSlugEdited] = useState(!!project.id);
  const [uploading, setUploading] = useState(false);
  const [uploadErr, setUploadErr] = useState('');
  const [err, setErr] = useState('');

  const set = (k: keyof Project, v: any) => setP((s) => ({ ...s, [k]: v }));

  const handleTitle = (val: string) => {
    setP((s) => ({ ...s, title: val, slug: slugEdited ? s.slug : toSlug(val) }));
  };

  const saveMeta = async (): Promise<string | null> => {
    const payload = {
      title: p.title, slug: p.slug, year: Number(p.year), category: p.category,
      description: p.description, areaM2: p.areaM2 ? Number(p.areaM2) : null,
      location: p.location, isTop: p.isTop, coverId: p.coverId,
      titleEn: p.titleEn, descriptionEn: p.descriptionEn, locationEn: p.locationEn,
    };
    const url = p.id ? `/api/admin/projects/${p.id}` : '/api/admin/projects';
    const res = await fetch(url, {
      method: p.id ? 'PATCH' : 'POST',
      headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const d = await res.json().catch(() => ({}));
      setErr(d.error ? 'Заповніть Назву та Slug (лише латиниця/цифри/дефіс).' : 'Помилка сервера.');
      return null;
    }
    const saved = await res.json();
    return saved.id as string;
  };

  const handleSave = async () => {
    setErr('');
    const id = await saveMeta();
    if (id) { if (!p.id) setP((s) => ({ ...s, id })); onSaved(); }
  };

  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [dragOverId, setDragOverId] = useState<string | null>(null);

  const reorderImages = (sourceId: string, targetId: string) => {
    const imgs = [...p.images];
    const src = imgs.findIndex((i) => i.id === sourceId);
    const tgt = imgs.findIndex((i) => i.id === targetId);
    const [moved] = imgs.splice(src, 1);
    imgs.splice(tgt, 0, moved);
    return imgs;
  };

  const handleDrop = async (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    setDragOverId(null);
    if (!draggingId || draggingId === targetId) return;
    const newImgs = reorderImages(draggingId, targetId);
    set('images', newImgs);
    setDraggingId(null);
    if (p.id) {
      await fetch(`/api/admin/projects/${p.id}/images`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ order: newImgs.map((i) => i.id) }),
      });
    }
  };

  const deleteImage = async (imgId: string) => {
    if (!p.id) return;
    const res = await fetch(`/api/admin/projects/${p.id}/images/${imgId}`, { method: 'DELETE' });
    if (!res.ok) { setUploadErr('Помилка видалення фото.'); return; }
    setP((s) => {
      const images = s.images.filter((i) => i.id !== imgId);
      const coverId = s.coverId === imgId ? (images[0]?.id ?? null) : s.coverId;
      return { ...s, images, coverId };
    });
  };

  const uploadImages = async (files: FileList) => {
    setErr(''); setUploadErr('');
    if (!p.title.trim()) { setErr('Спочатку введіть Назву проєкту — slug згенерується автоматично.'); return; }
    let id = p.id;
    if (!id) { const newId = await saveMeta(); if (!newId) return; id = newId; setP((s) => ({ ...s, id: newId })); }
    setUploading(true);
    for (const file of Array.from(files)) {
      const fd = new FormData(); fd.append('file', file);
      const up = await fetch('/api/upload', { method: 'POST', body: fd });
      if (!up.ok) {
        const d = await up.json().catch(() => ({}));
        setUploadErr(`Помилка завантаження: ${d.error ?? up.status}`);
        continue;
      }
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

  const fieldCls = 'mt-1 w-full border border-paper/20 bg-transparent px-4 py-2.5 outline-none focus:border-paper [&>option]:bg-[#1a1917]';

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto p-4">
      <div className="absolute inset-0 bg-black/70" onClick={onClose} />
      <div className="relative my-8 w-full max-w-2xl bg-[#1a1917] p-6">
        <h2 className="display-xl mb-4 text-lg">{p.id ? 'Редагування проєкту' : 'Новий проєкт'}</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="text-sm"><span className="text-paper/60">Назва *</span>
            <input value={p.title} onChange={(e) => handleTitle(e.target.value)}
              placeholder="Назва проєкту" className={fieldCls} /></label>
          <label className="text-sm"><span className="text-paper/60">Назва (EN)</span>
            <input value={p.titleEn ?? ''} onChange={(e) => set('titleEn', e.target.value)} className={fieldCls} /></label>
          <label className="text-sm"><span className="text-paper/60">Slug (URL)</span>
            <input value={p.slug} onChange={(e) => { setSlugEdited(true); set('slug', e.target.value); }}
              placeholder="auto" className={fieldCls} /></label>
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
          <label className="text-sm"><span className="text-paper/60">Локація (EN)</span>
            <input value={p.locationEn ?? ''} onChange={(e) => set('locationEn', e.target.value)} className={fieldCls} /></label>
          <label className="text-sm sm:col-span-2"><span className="text-paper/60">Опис</span>
            <textarea rows={3} value={p.description ?? ''} onChange={(e) => set('description', e.target.value)} className={fieldCls} /></label>
          <label className="text-sm sm:col-span-2"><span className="text-paper/60">Опис (EN)</span>
            <textarea rows={3} value={p.descriptionEn ?? ''} onChange={(e) => set('descriptionEn', e.target.value)} className={fieldCls} /></label>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={p.isTop} onChange={(e) => set('isTop', e.target.checked)} /> Топ-проєкт
          </label>
        </div>

        {/* gallery */}
        <div className="mt-5">
          <p className="text-sm text-paper/60">Фото {p.id ? '— перетягніть для зміни порядку' : '(буде створено чернетку проєкту)'}</p>
          <div className="mt-2 grid grid-cols-3 gap-2 sm:grid-cols-4">
            {p.images.map((img) => (
              <div
                key={img.id}
                draggable
                onDragStart={(e) => { e.dataTransfer.effectAllowed = 'move'; setDraggingId(img.id); }}
                onDragEnd={() => { setDraggingId(null); setDragOverId(null); }}
                onDragOver={(e) => { e.preventDefault(); e.dataTransfer.dropEffect = 'move'; setDragOverId(img.id); }}
                onDragLeave={() => setDragOverId(null)}
                onDrop={(e) => handleDrop(e, img.id)}
                className={[
                  'group relative aspect-square cursor-grab overflow-hidden border-2 transition-all duration-150 active:cursor-grabbing',
                  p.coverId === img.id ? 'border-paper' : 'border-transparent',
                  draggingId === img.id ? 'opacity-40 scale-95' : '',
                  dragOverId === img.id && draggingId !== img.id ? 'ring-2 ring-paper ring-offset-1 ring-offset-[#1a1917]' : '',
                ].join(' ')}
              >
                <button type="button" onClick={async () => {
                  set('coverId', img.id);
                  if (p.id) {
                    await fetch(`/api/admin/projects/${p.id}`, {
                      method: 'PATCH',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ coverId: img.id }),
                    });
                  }
                }} className="absolute inset-0">
                  <img src={img.url} alt="" className="h-full w-full object-cover" draggable={false} />
                </button>
                {p.coverId === img.id && <span className="pointer-events-none absolute bottom-1 left-1 bg-paper/80 px-1.5 text-[9px]">обкладинка</span>}
                <button
                  type="button"
                  onClick={() => deleteImage(img.id)}
                  className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center bg-black/70 text-paper opacity-0 transition-opacity duration-150 group-hover:opacity-100 hover:bg-red-600"
                  title="Видалити фото"
                >
                  ×
                </button>
              </div>
            ))}
            <label className="flex aspect-square cursor-pointer items-center justify-center border border-dashed border-paper/30 text-2xl text-paper/40 hover:border-paper">
              +
              <input type="file" accept="image/*" multiple className="hidden"
                onChange={(e) => e.target.files && uploadImages(e.target.files)} />
            </label>
          </div>
          {uploading && <p className="mt-2 text-xs text-paper/70">Завантаження фото…</p>}
          {uploadErr && <p className="mt-2 text-xs text-red-400">{uploadErr}</p>}
          <p className="mt-2 text-xs text-paper/40">Натисніть на фото, щоб зробити його обкладинкою.</p>
        </div>

        {err && <p className="mt-4 text-sm text-yellow-400">{err}</p>}
        <div className="mt-5 flex gap-3">
          <button onClick={handleSave} className="btn-admin">Зберегти</button>
          <button onClick={onClose} className="text-sm text-paper/60 hover:text-paper">Закрити</button>
        </div>
      </div>
    </div>
  );
}
