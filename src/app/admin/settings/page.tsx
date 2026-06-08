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
  { key: 'itemXUrl', label: 'Item X (URL)' },
];

export default function SettingsPage() {
  const [data, setData] = useState<Record<string, string>>({});
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch('/api/settings').then((r) => r.json()).then((s) => {
      const obj: Record<string, string> = {};
      FIELDS.forEach((f) => (obj[f.key] = s?.[f.key] ?? ''));
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

  return (
    <div className="max-w-2xl">
      <h1 className="display-xl text-2xl">Налаштування сайту</h1>
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {FIELDS.map((f) => (
          <label key={f.key} className="text-sm">
            <span className="text-paper/60">{f.label}</span>
            <input
              value={data[f.key] ?? ''}
              onChange={(e) => setData((d) => ({ ...d, [f.key]: e.target.value }))}
              className="mt-1 w-full rounded-xl border border-paper/20 bg-transparent px-4 py-2.5 outline-none focus:border-terra"
            />
          </label>
        ))}
      </div>
      <div className="mt-6 flex items-center gap-4">
        <button onClick={save} disabled={saving} className="btn-terra disabled:opacity-60">
          {saving ? 'Збереження…' : 'Зберегти'}
        </button>
        {saved && <span className="text-sm text-terra">✓ Збережено</span>}
      </div>
    </div>
  );
}
