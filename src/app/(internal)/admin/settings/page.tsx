'use client';
import { useEffect, useState } from 'react';

const FIELDS: { key: string; label: string }[] = [
  { key: 'phone', label: 'Телефон' },
  { key: 'email', label: 'Email' },
  { key: 'telegram', label: 'Telegram (URL)' },
  { key: 'instagram', label: 'Instagram (URL)' },
  { key: 'facebook', label: 'Facebook (URL)' },
  { key: 'behance', label: 'Behance (URL)' },
  { key: 'address', label: 'Адреса' },
  { key: 'coordinates', label: 'Координати' },
  { key: 'itemXUrl', label: 'item x (URL)' },
];

export default function SettingsPage() {
  const [data, setData] = useState<Record<string, string>>({});
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetch('/api/settings').then((r) => r.json()).then((s) => {
      const obj: Record<string, string> = {};
      FIELDS.forEach((f) => (obj[f.key] = s?.[f.key] ?? ''));
      obj.heroImage = s?.heroImage ?? '';
      setData(obj);
    });
  }, []);

  const save = async () => {
    setSaving(true); setSaved(false);
    const res = await fetch('/api/admin/settings', {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    setSaving(false);
    if (res.ok) { setSaved(true); setTimeout(() => setSaved(false), 2500); }
  };

  const uploadHero = async (file: File) => {
    setUploading(true);
    const fd = new FormData();
    fd.append('file', file);
    const res = await fetch('/api/upload', { method: 'POST', body: fd });
    setUploading(false);
    if (res.ok) {
      const d = await res.json();
      setData((prev) => ({ ...prev, heroImage: d.url }));
    }
  };

  return (
    <div className="max-w-2xl">
      <h1 className="display-xl text-2xl">Налаштування сайту</h1>

      {/* Hero image */}
      <div className="mt-6 border border-paper/10 p-5">
        <p className="text-sm font-semibold">Фото головного екрану (Hero)</p>
        {data.heroImage && (
          <img src={data.heroImage} alt="" className="mt-3 h-40 w-full object-cover" />
        )}
        <label className="mt-3 block text-sm">
          <span className="text-paper/60">Завантажити нове фото</span>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => e.target.files?.[0] && uploadHero(e.target.files[0])}
            className="mt-1 w-full border border-paper/20 bg-transparent px-4 py-2.5 outline-none focus:border-paper/50 text-sm"
          />
          {uploading && <p className="mt-1 text-xs text-paper/50">Завантаження…</p>}
        </label>
      </div>

      {/* Contact fields */}
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {FIELDS.map((f) => (
          <label key={f.key} className="text-sm">
            <span className="text-paper/60">{f.label}</span>
            <input
              value={data[f.key] ?? ''}
              onChange={(e) => setData((d) => ({ ...d, [f.key]: e.target.value }))}
              className="mt-1 w-full border border-paper/20 bg-transparent px-4 py-2.5 outline-none focus:border-paper/50"
            />
          </label>
        ))}
      </div>
      <div className="mt-6 flex items-center gap-4">
        <button onClick={save} disabled={saving} className="btn-admin disabled:opacity-60">
          {saving ? 'Збереження…' : 'Зберегти'}
        </button>
        {saved && <span className="text-sm text-paper/50">✓ Збережено</span>}
      </div>
    </div>
  );
}
