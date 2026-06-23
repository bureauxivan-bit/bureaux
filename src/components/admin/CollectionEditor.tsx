'use client';
import { useEffect, useRef, useState } from 'react';

export type FieldDef = {
  key: string;
  label: string;
  type?: 'text' | 'textarea' | 'number' | 'image' | 'checkbox';
};

type Item = Record<string, any> & { id: string };

export function CollectionEditor({
  endpoint,
  title,
  fields,
  reorderable = false,
}: {
  endpoint: string;
  title: string;
  fields: FieldDef[];
  reorderable?: boolean;
}) {
  const [items, setItems] = useState<Item[]>([]);
  const [editing, setEditing] = useState<Item | null>(null);
  const [loading, setLoading] = useState(true);
  const dragIndex = useRef<number | null>(null);

  const load = async () => {
    setLoading(true);
    const res = await fetch(`/api/admin/${endpoint}`);
    setItems(res.ok ? await res.json() : []);
    setLoading(false);
  };
  useEffect(() => { load(); }, []); // eslint-disable-line

  const blank = () => {
    const o: Item = { id: '' };
    fields.forEach((f) => (o[f.key] = f.type === 'checkbox' ? false : ''));
    setEditing(o);
  };

  const save = async () => {
    if (!editing) return;
    const { id, ...payload } = editing;
    const url = id ? `/api/admin/${endpoint}/${id}` : `/api/admin/${endpoint}`;
    const res = await fetch(url, {
      method: id ? 'PATCH' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (res.ok) { setEditing(null); load(); }
  };

  const remove = async (id: string) => {
    if (!confirm('Видалити цей запис?')) return;
    await fetch(`/api/admin/${endpoint}/${id}`, { method: 'DELETE' });
    load();
  };

  const handleDrop = (overIndex: number) => {
    const from = dragIndex.current;
    if (from === null || from === overIndex) return;
    const next = [...items];
    const [moved] = next.splice(from, 1);
    next.splice(overIndex, 0, moved);
    setItems(next);
    dragIndex.current = null;
    // persist new order
    next.forEach((item, i) => {
      fetch(`/api/admin/${endpoint}/${item.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ order: i }),
      });
    });
  };

  const primary = fields[0]?.key ?? 'id';

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="display-xl text-2xl">{title}</h1>
        <button onClick={blank} className="btn-admin !px-5 !py-2.5 text-xs">+ Додати</button>
      </div>

      {loading ? <p className="mt-6 text-paper/50">Завантаження…</p> : (
        <div className="mt-6 space-y-2">
          {items.map((it, index) => (
            <div
              key={it.id}
              className="flex items-center justify-between gap-4 border border-paper/10 px-4 py-3 transition-opacity"
              draggable={reorderable}
              onDragStart={() => { dragIndex.current = index; }}
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => handleDrop(index)}
            >
              <div className="flex items-center gap-3 truncate">
                {reorderable && (
                  <span className="cursor-grab select-none text-paper/30 active:cursor-grabbing" title="Перетягнути">
                    ⠿
                  </span>
                )}
                {(it.photoUrl || it.coverUrl) ? (
                  <img src={it.photoUrl || it.coverUrl} alt="" className="h-10 w-10 object-cover" />
                ) : null}
                <span className="truncate font-medium">{String(it[primary] || '—')}</span>
              </div>
              <div className="flex shrink-0 gap-2 text-sm">
                <button onClick={() => setEditing(it)} className="text-paper/70 hover:text-paper">Редагувати</button>
                <button onClick={() => remove(it.id)} className="text-paper/40 hover:text-paper">Видалити</button>
              </div>
            </div>
          ))}
          {!items.length && <p className="text-paper/50">Поки порожньо.</p>}
        </div>
      )}

      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60" onClick={() => setEditing(null)} />
          <div className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto bg-[#1a1917] p-6">
            <h2 className="display-xl mb-4 text-lg">{editing.id ? 'Редагування' : 'Новий запис'}</h2>
            <div className="space-y-3">
              {fields.map((f) => (
                <Field key={f.key} field={f} value={editing[f.key]}
                  onChange={(v) => setEditing((e) => (e ? { ...e, [f.key]: v } : e))} />
              ))}
            </div>
            <div className="mt-5 flex gap-3">
              <button onClick={save} className="btn-admin">Зберегти</button>
              <button onClick={() => setEditing(null)} className="text-sm text-paper/60 hover:text-paper">Скасувати</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Field({ field, value, onChange }: { field: FieldDef; value: any; onChange: (v: any) => void }) {
  const cls = 'mt-1 w-full border border-paper/20 bg-transparent px-4 py-2.5 outline-none focus:border-paper/50';
  if (field.type === 'checkbox') {
    return (
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" checked={!!value} onChange={(e) => onChange(e.target.checked)} />
        {field.label}
      </label>
    );
  }
  return (
    <label className="block text-sm">
      <span className="text-paper/60">{field.label}</span>
      {field.type === 'textarea' ? (
        <textarea rows={3} value={value ?? ''} onChange={(e) => onChange(e.target.value)} className={cls} />
      ) : field.type === 'image' ? (
        <ImageField value={value} onChange={onChange} cls={cls} />
      ) : (
        <input type={field.type === 'number' ? 'number' : 'text'} value={value ?? ''}
          onChange={(e) => onChange(field.type === 'number' ? Number(e.target.value) : e.target.value)} className={cls} />
      )}
    </label>
  );
}

function ImageField({ value, onChange, cls }: { value: string; onChange: (v: string) => void; cls: string }) {
  const [uploading, setUploading] = useState(false);
  const upload = async (file: File) => {
    setUploading(true);
    const fd = new FormData();
    fd.append('file', file);
    const res = await fetch('/api/upload', { method: 'POST', body: fd });
    setUploading(false);
    if (res.ok) { const d = await res.json(); onChange(d.url); }
  };
  return (
    <div>
      {value && <img src={value} alt="" className="mb-2 mt-1 h-28 w-full object-cover" />}
      <input type="file" accept="image/*" onChange={(e) => e.target.files?.[0] && upload(e.target.files[0])} className={cls} />
      {uploading && <p className="mt-1 text-xs text-paper/50">Завантаження…</p>}
    </div>
  );
}
