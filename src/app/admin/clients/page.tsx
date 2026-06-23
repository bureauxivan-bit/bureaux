'use client';
import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { CLIENT_STATUS_LABELS, CLIENT_PROJECT_TYPE_LABELS } from '@/lib/constants';

type Client = {
  id: string; name: string; email: string; phone: string;
  projectType: string; projectDetails: string | null;
  projectName: string | null;
  status: string; adminNote: string | null; createdAt: string;
};

const STATUSES = ['PENDING', 'APPROVED', 'REJECTED'];

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [filter, setFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [noteInputs, setNoteInputs] = useState<Record<string, string>>({});
  const [nameInputs, setNameInputs] = useState<Record<string, string>>({});

  const load = useCallback(async () => {
    setLoading(true);
    const params = filter ? `?status=${filter}` : '';
    const res = await fetch(`/api/admin/clients${params}`);
    const data = res.ok ? await res.json() : [];
    setClients(data);
    const notes: Record<string, string> = {};
    const names: Record<string, string> = {};
    data.forEach((c: Client) => {
      notes[c.id] = c.adminNote ?? '';
      names[c.id] = c.projectName ?? '';
    });
    setNoteInputs(notes);
    setNameInputs(names);
    setLoading(false);
  }, [filter]);

  useEffect(() => { load(); }, [load]);

  const setStatus = async (id: string, status: string) => {
    setClients((prev) => prev.map((c) => (c.id === id ? { ...c, status } : c)));
    await fetch(`/api/admin/clients/${id}`, {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
  };

  const saveNote = async (id: string) => {
    const adminNote = noteInputs[id] ?? '';
    await fetch(`/api/admin/clients/${id}`, {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ adminNote }),
    });
    setClients((prev) => prev.map((c) => (c.id === id ? { ...c, adminNote } : c)));
  };

  const saveName = async (id: string) => {
    const projectName = nameInputs[id] ?? '';
    await fetch(`/api/admin/clients/${id}`, {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ projectName }),
    });
    setClients((prev) => prev.map((c) => (c.id === id ? { ...c, projectName } : c)));
  };

  const deleteClient = async (id: string) => {
    if (!confirm('Видалити клієнта?')) return;
    setClients((prev) => prev.filter((c) => c.id !== id));
    await fetch(`/api/admin/clients/${id}`, { method: 'DELETE' });
  };

  const pending = clients.filter((c) => c.status === 'PENDING').length;

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="display-xl text-2xl">Клієнти</h1>
          {pending > 0 && (
            <p className="mt-1 text-sm text-paper/60">
              {pending} {pending === 1 ? 'заявка' : 'заявки'} очікують підтвердження
            </p>
          )}
        </div>
      </div>

      <div className="mt-6 flex gap-2">
        <button onClick={() => setFilter('')}
          className={`px-4 py-2 text-xs uppercase tracking-widest transition-colors ${!filter ? 'bg-paper text-ink' : 'border border-paper/20 text-paper/60 hover:border-paper/50'}`}>
          Усі
        </button>
        {STATUSES.map((s) => (
          <button key={s} onClick={() => setFilter(s)}
            className={`px-4 py-2 text-xs uppercase tracking-widest transition-colors ${filter === s ? 'bg-paper text-ink' : 'border border-paper/20 text-paper/60 hover:border-paper/50'}`}>
            {CLIENT_STATUS_LABELS[s]}
          </button>
        ))}
      </div>

      <div className="mt-6 space-y-4">
        {loading ? <p className="text-paper/50">Завантаження…</p>
          : clients.length ? clients.map((c) => (
            <div key={c.id} className="border border-paper/10 p-5">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-3">
                    <p className="font-medium">{c.projectName || c.name}</p>
                    <span className={`text-xs px-2 py-0.5 border ${c.status === 'APPROVED' ? 'border-paper/60 text-paper/80' : c.status === 'REJECTED' ? 'border-paper/20 text-paper/30' : 'border-paper/40 text-paper/50'}`}>
                      {CLIENT_STATUS_LABELS[c.status]}
                    </span>
                  </div>
                  {c.projectName && (
                    <p className="mt-0.5 text-xs text-paper/40">{c.name}</p>
                  )}
                  <div className="mt-1 flex flex-wrap gap-4 text-sm text-paper/60">
                    <a href={`mailto:${c.email}`} className="hover:text-paper transition-colors">{c.email}</a>
                    <a href={`tel:${c.phone}`} className="hover:text-paper transition-colors">{c.phone}</a>
                  </div>
                  <p className="mt-1 text-xs text-paper/40">
                    {CLIENT_PROJECT_TYPE_LABELS[c.projectType]} · {new Date(c.createdAt).toLocaleDateString('uk-UA', { timeZone: 'Europe/Kyiv' })}
                  </p>
                  {c.projectDetails && (
                    <p className="mt-2 max-w-xl text-sm text-paper/60">{c.projectDetails}</p>
                  )}
                  <div className="mt-2">
                    <Link href={`/admin/clients/${c.id}`}
                      className="inline-block text-xs border border-paper/20 px-3 py-1.5 hover:border-paper/50 transition-colors">
                      Керувати проєктом →
                    </Link>
                  </div>
                  <div className="mt-3 flex items-center gap-2">
                    <input
                      type="text"
                      value={nameInputs[c.id] ?? ''}
                      onChange={(e) => setNameInputs((n) => ({ ...n, [c.id]: e.target.value }))}
                      placeholder="Назва проєкту (видима клієнту)"
                      className="border border-paper/25 bg-transparent px-3 py-1.5 text-xs outline-none focus:border-paper/50 w-56 placeholder:text-paper/25"
                    />
                    <button onClick={() => saveName(c.id)}
                      className="border border-paper/20 px-3 py-1.5 text-xs hover:border-paper/50 transition-colors">
                      Зберегти
                    </button>
                  </div>
                  <div className="mt-2 flex items-center gap-2">
                    <input
                      type="text"
                      value={noteInputs[c.id] ?? ''}
                      onChange={(e) => setNoteInputs((n) => ({ ...n, [c.id]: e.target.value }))}
                      placeholder="Нотатка для клієнта (необов'язково)"
                      className="border border-paper/15 bg-transparent px-3 py-1.5 text-xs outline-none focus:border-paper/40 w-56 placeholder:text-paper/25"
                    />
                    <button onClick={() => saveNote(c.id)}
                      className="border border-paper/20 px-3 py-1.5 text-xs hover:border-paper/50 transition-colors">
                      Зберегти
                    </button>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <div className="flex gap-1">
                    {STATUSES.map((s) => (
                      <button key={s} onClick={() => setStatus(c.id, s)}
                        className={`px-3 py-1.5 text-xs transition-all active:scale-95 ${c.status === s ? 'bg-paper text-ink' : 'bg-paper/10 text-paper/60 hover:bg-paper/25 hover:text-paper'}`}>
                        {CLIENT_STATUS_LABELS[s]}
                      </button>
                    ))}
                  </div>
                  <button onClick={() => deleteClient(c.id)}
                    className="self-end text-xs text-paper/25 hover:text-red-400 transition-colors">
                    Видалити
                  </button>
                </div>
              </div>
            </div>
          )) : <p className="text-paper/50">Клієнтів не знайдено.</p>}
      </div>
    </div>
  );
}
