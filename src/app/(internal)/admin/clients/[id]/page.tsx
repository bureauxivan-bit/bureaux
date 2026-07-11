'use client';
import { useEffect, useState, useCallback, useRef } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { CLIENT_STATUS_LABELS, CLIENT_PROJECT_TYPE_LABELS } from '@/lib/constants';

const STAGES = [
  { num: '01', title: 'Договір', type: 'files' },
  { num: '02', title: 'Заміри', type: 'files' },
  { num: '03', title: 'Планувальне рішення', type: 'files' },
  { num: '04', title: 'Візуалізації', type: 'visualizations' },
  { num: '05', title: 'Робоча документація', type: 'files' },
  { num: '06', title: 'Специфікації', type: 'spec' },
] as const;

const STATUS_LABELS: Record<string, string> = {
  PENDING: 'Очікує',
  ACTIVE: 'В роботі',
  DONE: 'Завершено',
};

type StageFile = { id: string; name: string; url: string };
type Visualization = { id: string; url: string; description: string | null };
type Room = { id: string; name: string; order: number; clientApprovedAt: string | null; revisions: Revision[]; visualizations: Visualization[] };
type SpecItem = { id: string; category: string | null; name: string; quantity: string | null; unit: string | null; note: string | null };
type Revision = { id: string; text: string; createdAt: string; isFromClient: boolean };
type Stage = {
  id: string; stageIndex: number; status: string; note: string | null; clientApprovedAt: string | null;
  files: StageFile[]; rooms: Room[]; specItems: SpecItem[]; revisions: Revision[];
};
type Client = {
  id: string; name: string; email: string; phone: string;
  projectType: string; status: string; createdAt: string;
  projectName: string | null; projectAddress: string | null; projectCity: string | null;
};

export default function ClientProjectPage() {
  const { id } = useParams<{ id: string }>();
  const [client, setClient] = useState<Client | null>(null);
  const [stages, setStages] = useState<Stage[]>([]);
  const [open, setOpen] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const [cRes, sRes] = await Promise.all([
      fetch(`/api/admin/clients/${id}`),
      fetch(`/api/admin/clients/${id}/stages`),
    ]);
    setClient(cRes.ok ? await cRes.json() : null);
    setStages(sRes.ok ? await sRes.json() : []);
    setLoading(false);
  }, [id]);

  useEffect(() => { load(); }, [load]);

  const updateStage = async (stageId: string, data: object) => {
    await fetch(`/api/admin/clients/${id}/stages/${stageId}`, {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    await load();
  };

  if (loading) return <div className="p-6 text-paper/50">Завантаження…</div>;
  if (!client) return <div className="p-6 text-paper/50">Клієнта не знайдено.</div>;

  return (
    <div>
      <div className="mb-6">
        <Link href="/admin/clients" className="text-xs text-paper/40 hover:text-paper/70 transition-colors">
          ← Клієнти
        </Link>
      </div>

      {/* Client + address section */}
      <div className="mb-6 border border-paper/10 p-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-medium">{client.projectName || client.name}</h1>
              <span className={`text-xs px-2 py-0.5 border ${client.status === 'APPROVED' ? 'border-paper/60 text-paper/80' : 'border-paper/20 text-paper/40'}`}>
                {CLIENT_STATUS_LABELS[client.status]}
              </span>
            </div>
            {client.projectName && (
              <p className="mt-0.5 text-sm text-paper/50">{client.name}</p>
            )}
            <div className="mt-1 flex flex-wrap gap-4 text-sm text-paper/60">
              <a href={`mailto:${client.email}`} className="hover:text-paper">{client.email}</a>
              <a href={`tel:${client.phone}`} className="hover:text-paper">{client.phone}</a>
            </div>
            <p className="mt-1 text-xs text-paper/40">
              {CLIENT_PROJECT_TYPE_LABELS[client.projectType]} · {new Date(client.createdAt).toLocaleDateString('uk-UA', { timeZone: 'Europe/Kyiv' })}
            </p>
          </div>
        </div>

        {/* Address fields */}
        <div className="mt-4 border-t border-paper/10 pt-4">
          <AddressSection clientId={id} projectName={client.projectName} projectAddress={client.projectAddress} projectCity={client.projectCity} onSaved={load} />
        </div>
      </div>

      {/* Stages */}
      <div className="space-y-2">
        {STAGES.map((s, i) => {
          const stage = stages.find((st) => st.stageIndex === i);
          const isOpen = open === i;
          return (
            <div key={s.num} className="border border-paper/10">
              <button
                className="flex w-full items-center justify-between px-5 py-4 text-left hover:bg-paper/8 active:bg-paper/12 transition-colors"
                onClick={() => setOpen(isOpen ? null : i)}
              >
                <div className="flex items-center gap-4">
                  <span className="text-xs text-paper/40">{s.num}</span>
                  <span className="text-sm font-medium">{s.title}</span>
                  {stage && (
                    <span className={`text-xs px-2 py-0.5 ${stage.status === 'DONE' ? 'bg-paper/20 text-paper/80' : stage.status === 'ACTIVE' ? 'bg-[rgb(var(--terra))]/20 text-[rgb(var(--terra))]' : 'bg-paper/5 text-paper/40'}`}>
                      {STATUS_LABELS[stage.status]}
                    </span>
                  )}
                  {stage?.clientApprovedAt && (
                    <span className="text-xs text-paper/40">· Погоджено клієнтом</span>
                  )}
                </div>
                <span className="text-paper/30">{isOpen ? '−' : '+'}</span>
              </button>

              {isOpen && stage && (
                <div className="border-t border-paper/10 px-5 pb-5 pt-4">
                  <StageControls stage={stage} onUpdate={(data) => updateStage(stage.id, data)} />
                  <div className="mt-4">
                    <RevisionsSection stageId={stage.id} clientId={id} revisions={stage.revisions} onRefresh={load} />
                  </div>
                  <div className="mt-6 border-t border-paper/10 pt-5">
                    {s.type === 'files' && (
                      <FilesSection stageId={stage.id} clientId={id} files={stage.files} onRefresh={load} />
                    )}
                    {s.type === 'visualizations' && (
                      <RoomsSection stageId={stage.id} clientId={id} rooms={stage.rooms} onRefresh={load} />
                    )}
                    {s.type === 'spec' && (
                      <SpecSection stageId={stage.id} clientId={id} items={stage.specItems} onRefresh={load} />
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ── Address section ── */
function AddressSection({ clientId, projectName, projectAddress, projectCity, onSaved }: {
  clientId: string; projectName: string | null; projectAddress: string | null; projectCity: string | null; onSaved: () => void;
}) {
  const [name, setName] = useState(projectName ?? '');
  const [address, setAddress] = useState(projectAddress ?? '');
  const [city, setCity] = useState(projectCity ?? '');
  const [saving, setSaving] = useState(false);

  const save = async () => {
    setSaving(true);
    await fetch(`/api/admin/clients/${clientId}`, {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ projectName: name, projectAddress: address, projectCity: city }),
    });
    setSaving(false);
    onSaved();
  };

  return (
    <div className="space-y-3">
      <div>
        <p className="mb-2 text-[10px] uppercase tracking-[0.2em] text-paper/40">Назва проєкту</p>
        <input
          type="text" value={name} onChange={(e) => setName(e.target.value)}
          placeholder="напр. Квартира на Саксаганського"
          className="border border-paper/15 bg-transparent px-3 py-1.5 text-sm outline-none focus:border-paper/40 placeholder:text-paper/25 w-72"
        />
      </div>
      <div>
        <p className="mb-2 text-[10px] uppercase tracking-[0.2em] text-paper/40">Адреса проєкту</p>
        <div className="flex flex-wrap gap-2">
          <input
            type="text" value={address} onChange={(e) => setAddress(e.target.value)}
            placeholder="вул. Саксаганського, 85"
            className="border border-paper/15 bg-transparent px-3 py-1.5 text-sm outline-none focus:border-paper/40 placeholder:text-paper/25 w-64"
          />
          <input
            type="text" value={city} onChange={(e) => setCity(e.target.value)}
            placeholder="Київ"
            className="border border-paper/15 bg-transparent px-3 py-1.5 text-sm outline-none focus:border-paper/40 placeholder:text-paper/25 w-32"
          />
        </div>
      </div>
      <button onClick={save} disabled={saving}
        className="border border-paper/20 px-3 py-1.5 text-xs hover:border-paper/50 transition-colors disabled:opacity-40">
        {saving ? '…' : 'Зберегти'}
      </button>
    </div>
  );
}

/* ── Stage controls ── */
function StageControls({ stage, onUpdate }: { stage: Stage; onUpdate: (data: object) => Promise<void> }) {
  const [note, setNote] = useState(stage.note ?? '');
  const [saving, setSaving] = useState(false);

  const save = async () => {
    setSaving(true);
    await onUpdate({ note });
    setSaving(false);
  };

  return (
    <div className="flex flex-wrap gap-3">
      <div className="flex gap-1">
        {Object.entries(STATUS_LABELS).map(([val, label]) => (
          <button key={val}
            onClick={() => onUpdate({ status: val })}
            className={`px-3 py-1.5 text-xs transition-all active:scale-95 ${stage.status === val ? 'bg-paper text-ink' : 'bg-paper/10 text-paper/60 hover:bg-paper/25 hover:text-paper'}`}>
            {label}
          </button>
        ))}
      </div>
      <div className="flex flex-1 items-center gap-2">
        <input
          type="text" value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Примітка для клієнта (напр. «На погодженні»)"
          className="flex-1 border border-paper/15 bg-transparent px-3 py-1.5 text-xs outline-none focus:border-paper/40 placeholder:text-paper/25 min-w-0"
        />
        <button onClick={save} disabled={saving}
          className="border border-paper/20 px-3 py-1.5 text-xs hover:border-paper/50 transition-colors disabled:opacity-40">
          {saving ? '…' : 'Зберегти'}
        </button>
      </div>
    </div>
  );
}

/* ── Revisions section ── */
function RevisionsSection({ stageId, clientId, revisions, onRefresh }: {
  stageId: string; clientId: string; revisions: Revision[]; onRefresh: () => void;
}) {
  const [text, setText] = useState('');
  const [adding, setAdding] = useState(false);

  const add = async () => {
    if (!text.trim()) return;
    setAdding(true);
    await fetch(`/api/admin/clients/${clientId}/stages/${stageId}/revisions`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: text.trim() }),
    });
    setText('');
    onRefresh();
    setAdding(false);
  };

  const remove = async (revId: string) => {
    await fetch(`/api/admin/clients/${clientId}/stages/${stageId}/revisions/${revId}`, { method: 'DELETE' });
    onRefresh();
  };

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString('uk-UA', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Europe/Kyiv' });

  return (
    <div className="border-t border-paper/10 pt-4">
      <p className="mb-3 text-[10px] uppercase tracking-[0.2em] text-paper/40">
        Правки {revisions.length > 0 ? `· ${revisions.length}` : ''}
      </p>
      {revisions.length > 0 && (
        <div className="mb-3 space-y-1.5">
          {revisions.map((r) => (
            <div key={r.id} className={`flex items-start justify-between gap-3 border px-3 py-2 ${r.isFromClient ? 'border-[rgb(var(--terra))]/30 bg-[rgb(var(--terra))]/5' : 'border-paper/10'}`}>
              <div>
                <div className="flex items-center gap-2 mb-0.5">
                  <p className="text-[10px] text-paper/35">{formatDate(r.createdAt)}</p>
                  {r.isFromClient && (
                    <span className="text-[10px] text-[rgb(var(--terra))]/70">від клієнта</span>
                  )}
                </div>
                <p className="text-xs text-paper/80">{r.text}</p>
              </div>
              <button onClick={() => remove(r.id)}
                className="shrink-0 mt-0.5 text-[10px] text-paper/25 hover:text-red-400 transition-colors">
                Видалити
              </button>
            </div>
          ))}
        </div>
      )}
      <div className="flex items-center gap-2">
        <input
          type="text"
          placeholder="Текст правки для клієнта…"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && add()}
          className="flex-1 border border-paper/15 bg-transparent px-3 py-1.5 text-xs outline-none focus:border-paper/40 placeholder:text-paper/25 min-w-0 max-w-sm"
        />
        <button onClick={add} disabled={adding || !text.trim()}
          className="border border-paper/20 px-3 py-1.5 text-xs hover:border-paper/50 transition-colors disabled:opacity-40">
          {adding ? '…' : '+ Додати правку'}
        </button>
      </div>
    </div>
  );
}

/* ── Files section ── */
function FilesSection({ stageId, clientId, files, onRefresh }: {
  stageId: string; clientId: string; files: StageFile[]; onRefresh: () => void;
}) {
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const upload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const fd = new FormData();
    fd.append('file', file);
    const res = await fetch('/api/admin/upload-file', { method: 'POST', body: fd });
    if (res.ok) {
      const { url, name, storageKey } = await res.json();
      await fetch(`/api/admin/clients/${clientId}/stages/${stageId}/files`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, url, storageKey }),
      });
      onRefresh();
    }
    setUploading(false);
    if (fileRef.current) fileRef.current.value = '';
  };

  const remove = async (fileId: string) => {
    if (!confirm('Видалити файл?')) return;
    await fetch(`/api/admin/clients/${clientId}/stages/${stageId}/files/${fileId}`, { method: 'DELETE' });
    onRefresh();
  };

  return (
    <div>
      <p className="mb-3 text-[10px] uppercase tracking-[0.2em] text-paper/40">Файли</p>
      {files.length > 0 && (
        <div className="mb-3 space-y-1.5">
          {files.map((f) => (
            <div key={f.id} className="flex items-center justify-between gap-2 border border-paper/10 px-3 py-2">
              <a href={f.url} target="_blank" rel="noopener noreferrer"
                className="text-xs text-paper/80 hover:text-paper transition-colors truncate">{f.name}</a>
              <button onClick={() => remove(f.id)}
                className="shrink-0 text-[10px] text-paper/25 hover:text-red-400 transition-colors">Видалити</button>
            </div>
          ))}
        </div>
      )}
      <label className={`inline-flex cursor-pointer items-center gap-2 border border-paper/20 px-3 py-1.5 text-xs hover:border-paper/50 transition-colors ${uploading ? 'opacity-50 pointer-events-none' : ''}`}>
        {uploading ? 'Завантаження…' : '+ Додати файл'}
        <input ref={fileRef} type="file" className="hidden" onChange={upload} />
      </label>
    </div>
  );
}

/* ── Rooms section (visualizations) ── */
function RoomsSection({ stageId, clientId, rooms, onRefresh }: {
  stageId: string; clientId: string; rooms: Room[]; onRefresh: () => void;
}) {
  const [newRoomName, setNewRoomName] = useState('');
  const [creating, setCreating] = useState(false);
  const [expandedRoom, setExpandedRoom] = useState<string | null>(null);

  const createRoom = async () => {
    if (!newRoomName.trim()) return;
    setCreating(true);
    const res = await fetch(`/api/admin/clients/${clientId}/stages/${stageId}/rooms`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: newRoomName.trim() }),
    });
    if (res.ok) { setNewRoomName(''); onRefresh(); }
    setCreating(false);
  };

  const deleteRoom = async (roomId: string) => {
    if (!confirm('Видалити приміщення і всі його зображення?')) return;
    await fetch(`/api/admin/clients/${clientId}/stages/${stageId}/rooms/${roomId}`, { method: 'DELETE' });
    onRefresh();
  };

  const renameRoom = async (roomId: string, name: string) => {
    await fetch(`/api/admin/clients/${clientId}/stages/${stageId}/rooms/${roomId}`, {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name }),
    });
    onRefresh();
  };

  return (
    <div>
      <p className="mb-3 text-[10px] uppercase tracking-[0.2em] text-paper/40">Приміщення та візуалізації</p>

      {/* Room list */}
      {rooms.length > 0 && (
        <div className="mb-4 space-y-2">
          {rooms.map((room) => (
            <div key={room.id} className="border border-paper/10">
              {/* Room header */}
              <div className="flex items-center justify-between px-4 py-2.5">
                <button
                  className="flex flex-1 items-center gap-3 text-left hover:text-paper transition-colors"
                  onClick={() => setExpandedRoom(expandedRoom === room.id ? null : room.id)}
                >
                  <span className="text-sm font-medium text-paper/90">{room.name}</span>
                  <span className="text-xs text-paper/40">{room.visualizations.length} фото</span>
                  {room.clientApprovedAt && (
                    <span className="text-[10px] text-paper/40">· Погоджено</span>
                  )}
                  {room.revisions.some((r) => r.isFromClient) && !room.clientApprovedAt && (
                    <span className="text-[10px] text-[rgb(var(--terra))]/70">· Правки від клієнта</span>
                  )}
                  <span className="text-paper/30 text-xs">{expandedRoom === room.id ? '−' : '+'}</span>
                </button>
                <button onClick={() => deleteRoom(room.id)}
                  className="ml-3 text-[10px] text-paper/25 hover:text-red-400 transition-colors">
                  Видалити
                </button>
              </div>

              {/* Room images + revisions */}
              {expandedRoom === room.id && (
                <div className="border-t border-paper/10 px-4 pb-4 pt-3">
                  <RenameRoom roomId={room.id} current={room.name} onRename={renameRoom} />
                  <div className="mt-3 grid grid-cols-4 gap-2 sm:grid-cols-5 lg:grid-cols-6">
                    {room.visualizations.map((v, idx) => (
                      <VizThumb key={v.id} viz={v} index={idx + 1}
                        onDelete={async () => {
                          if (!confirm('Видалити зображення?')) return;
                          await fetch(`/api/admin/clients/${clientId}/stages/${stageId}/rooms/${room.id}/visualizations/${v.id}`, { method: 'DELETE' });
                          onRefresh();
                        }}
                        onDescriptionSave={async (desc) => {
                          await fetch(`/api/admin/clients/${clientId}/stages/${stageId}/rooms/${room.id}/visualizations/${v.id}`, {
                            method: 'PATCH', headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ description: desc }),
                          });
                          onRefresh();
                        }}
                      />
                    ))}
                    <RoomUploadButton
                      stageId={stageId} clientId={clientId} roomId={room.id}
                      onRefresh={onRefresh}
                    />
                  </div>
                  <RoomRevisionsSection
                    stageId={stageId} clientId={clientId} roomId={room.id}
                    revisions={room.revisions} onRefresh={onRefresh}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Add room */}
      <div className="flex items-center gap-2">
        <input
          type="text" placeholder="Назва приміщення (напр. Вітальня)"
          value={newRoomName}
          onChange={(e) => setNewRoomName(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && createRoom()}
          className="border border-paper/15 bg-transparent px-3 py-1.5 text-xs outline-none focus:border-paper/40 placeholder:text-paper/25 w-56"
        />
        <button onClick={createRoom} disabled={creating || !newRoomName.trim()}
          className="border border-paper/20 px-3 py-1.5 text-xs hover:border-paper/50 transition-colors disabled:opacity-40">
          {creating ? '…' : '+ Створити приміщення'}
        </button>
      </div>
    </div>
  );
}

function RoomRevisionsSection({ stageId, clientId, roomId, revisions, onRefresh }: {
  stageId: string; clientId: string; roomId: string; revisions: Revision[]; onRefresh: () => void;
}) {
  const [text, setText] = useState('');
  const [adding, setAdding] = useState(false);

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString('uk-UA', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Europe/Kyiv' });

  const add = async () => {
    if (!text.trim()) return;
    setAdding(true);
    await fetch(`/api/admin/clients/${clientId}/stages/${stageId}/rooms/${roomId}/revisions`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: text.trim() }),
    });
    setText('');
    onRefresh();
    setAdding(false);
  };

  const remove = async (revId: string) => {
    await fetch(`/api/admin/clients/${clientId}/stages/${stageId}/rooms/${roomId}/revisions/${revId}`, { method: 'DELETE' });
    onRefresh();
  };

  return (
    <div className="mt-4 border-t border-paper/10 pt-3">
      <p className="mb-2 text-[10px] uppercase tracking-[0.2em] text-paper/40">
        Правки приміщення {revisions.length > 0 ? `· ${revisions.length}` : ''}
      </p>
      {revisions.length > 0 && (
        <div className="mb-2 space-y-1.5">
          {revisions.map((r) => (
            <div key={r.id} className={`flex items-start justify-between gap-3 border px-3 py-2 ${r.isFromClient ? 'border-[rgb(var(--terra))]/30 bg-[rgb(var(--terra))]/5' : 'border-paper/10'}`}>
              <div>
                <div className="flex items-center gap-2 mb-0.5">
                  <p className="text-[10px] text-paper/35">{formatDate(r.createdAt)}</p>
                  {r.isFromClient && <span className="text-[10px] text-[rgb(var(--terra))]/70">від клієнта</span>}
                </div>
                <p className="text-xs text-paper/80">{r.text}</p>
              </div>
              <button onClick={() => remove(r.id)}
                className="shrink-0 mt-0.5 text-[10px] text-paper/25 hover:text-red-400 transition-colors">
                Видалити
              </button>
            </div>
          ))}
        </div>
      )}
      <div className="flex items-center gap-2">
        <input
          type="text" placeholder="Правка до цього приміщення…" value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && add()}
          className="flex-1 border border-paper/15 bg-transparent px-3 py-1.5 text-xs outline-none focus:border-paper/40 placeholder:text-paper/25 min-w-0 max-w-xs"
        />
        <button onClick={add} disabled={adding || !text.trim()}
          className="border border-paper/20 px-3 py-1.5 text-xs hover:border-paper/50 transition-colors disabled:opacity-40">
          {adding ? '…' : '+ Правка'}
        </button>
      </div>
    </div>
  );
}

function RenameRoom({ roomId, current, onRename }: {
  roomId: string; current: string; onRename: (id: string, name: string) => void;
}) {
  const [val, setVal] = useState(current);
  return (
    <div className="flex items-center gap-2">
      <input value={val} onChange={(e) => setVal(e.target.value)}
        className="border-b border-paper/20 bg-transparent text-xs text-paper/70 outline-none focus:border-paper/50 w-40"
      />
      <button onClick={() => onRename(roomId, val)}
        className="text-[10px] text-paper/40 hover:text-paper/70">
        Перейменувати
      </button>
    </div>
  );
}

function VizThumb({ viz, index, onDelete, onDescriptionSave }: {
  viz: Visualization; index: number; onDelete: () => void; onDescriptionSave: (desc: string) => void;
}) {
  const [desc, setDesc] = useState(viz.description ?? '');
  const [editDesc, setEditDesc] = useState(false);

  return (
    <div className="group">
      <div className="relative aspect-square">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={viz.url} alt={viz.description ?? ''} className="h-full w-full object-cover" />
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity">
          <span className="text-[9px] text-white/60">Вид {String(index).padStart(2, '0')}</span>
          <button onClick={() => setEditDesc(!editDesc)} className="text-[9px] text-white/80 hover:text-white">
            {editDesc ? 'Закрити' : 'Підпис'}
          </button>
          <button onClick={onDelete} className="text-[9px] text-white/50 hover:text-white">×</button>
        </div>
      </div>
      {editDesc && (
        <div className="mt-1 flex gap-1">
          <input value={desc} onChange={(e) => setDesc(e.target.value)}
            placeholder="Від вікна"
            className="w-full border-b border-paper/20 bg-transparent text-[9px] text-paper/60 outline-none"
          />
          <button onClick={() => { onDescriptionSave(desc); setEditDesc(false); }}
            className="text-[9px] text-paper/50 hover:text-paper">✓</button>
        </div>
      )}
      {!editDesc && viz.description && (
        <p className="mt-0.5 truncate text-[9px] text-paper/40">Вид {String(index).padStart(2,'0')} — {viz.description}</p>
      )}
    </div>
  );
}

function RoomUploadButton({ stageId, clientId, roomId, onRefresh }: {
  stageId: string; clientId: string; roomId: string; onRefresh: () => void;
}) {
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const upload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files?.length) return;
    setUploading(true);
    for (const file of Array.from(files)) {
      const fd = new FormData();
      fd.append('file', file);
      const res = await fetch('/api/upload', { method: 'POST', body: fd });
      if (res.ok) {
        const { url } = await res.json();
        await fetch(`/api/admin/clients/${clientId}/stages/${stageId}/rooms/${roomId}/visualizations`, {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url }),
        });
      }
    }
    onRefresh();
    setUploading(false);
    if (fileRef.current) fileRef.current.value = '';
  };

  return (
    <label className={`flex aspect-square cursor-pointer items-center justify-center border border-dashed border-paper/20 text-paper/30 hover:border-paper/50 hover:text-paper/50 transition-colors text-xs ${uploading ? 'opacity-50 pointer-events-none' : ''}`}>
      {uploading ? '…' : '+'}
      <input ref={fileRef} type="file" accept="image/*" multiple className="hidden" onChange={upload} />
    </label>
  );
}

/* ── Spec items section ── */
function SpecSection({ stageId, clientId, items, onRefresh }: {
  stageId: string; clientId: string; items: SpecItem[]; onRefresh: () => void;
}) {
  const [form, setForm] = useState({ category: '', name: '', quantity: '', unit: '', note: '' });
  const [adding, setAdding] = useState(false);

  const add = async () => {
    if (!form.name.trim()) return;
    setAdding(true);
    await fetch(`/api/admin/clients/${clientId}/stages/${stageId}/spec-items`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    setForm({ category: '', name: '', quantity: '', unit: '', note: '' });
    onRefresh();
    setAdding(false);
  };

  const remove = async (itemId: string) => {
    if (!confirm('Видалити позицію?')) return;
    await fetch(`/api/admin/clients/${clientId}/stages/${stageId}/spec-items/${itemId}`, { method: 'DELETE' });
    onRefresh();
  };

  const update = async (itemId: string, data: object) => {
    await fetch(`/api/admin/clients/${clientId}/stages/${stageId}/spec-items/${itemId}`, {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    onRefresh();
  };

  return (
    <div>
      <p className="mb-3 text-[10px] uppercase tracking-[0.2em] text-paper/40">Специфікація</p>
      {items.length > 0 && (
        <div className="mb-4 overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-paper/10">
                {['Категорія','Назва','Кількість','Одиниця','Примітка',''].map((h) => (
                  <th key={h} className="py-2 pr-3 text-left font-normal text-paper/40">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <SpecRow key={item.id} item={item}
                  onUpdate={(data) => update(item.id, data)}
                  onDelete={() => remove(item.id)}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}
      <div className="flex flex-wrap gap-1.5">
        {(['category', 'name', 'quantity', 'unit', 'note'] as const).map((field) => (
          <input key={field}
            type="text"
            placeholder={field === 'category' ? 'Категорія' : field === 'name' ? 'Назва *' : field === 'quantity' ? 'Кількість' : field === 'unit' ? 'Одиниця' : 'Примітка'}
            value={form[field]}
            onChange={(e) => setForm((f) => ({ ...f, [field]: e.target.value }))}
            className={`border border-paper/15 bg-transparent px-2 py-1.5 text-xs outline-none focus:border-paper/40 placeholder:text-paper/25 ${field === 'name' || field === 'note' ? 'w-40' : 'w-24'}`}
          />
        ))}
        <button onClick={add} disabled={adding || !form.name.trim()}
          className="border border-paper/20 px-3 py-1.5 text-xs hover:border-paper/50 transition-colors disabled:opacity-40">
          {adding ? '…' : '+ Додати'}
        </button>
      </div>
    </div>
  );
}

function SpecRow({ item, onUpdate, onDelete }: {
  item: SpecItem; onUpdate: (data: object) => void; onDelete: () => void;
}) {
  const [editing, setEditing] = useState(false);
  const [vals, setVals] = useState({
    category: item.category ?? '', name: item.name,
    quantity: item.quantity ?? '', unit: item.unit ?? '', note: item.note ?? '',
  });

  const save = () => { onUpdate(vals); setEditing(false); };

  if (editing) {
    return (
      <tr className="border-b border-paper/5">
        {(['category','name','quantity','unit','note'] as const).map((f) => (
          <td key={f} className="py-1 pr-2">
            <input value={vals[f]} onChange={(e) => setVals((v) => ({ ...v, [f]: e.target.value }))}
              className="w-full border-b border-paper/20 bg-transparent text-xs outline-none text-paper"
            />
          </td>
        ))}
        <td className="py-1">
          <div className="flex gap-2">
            <button onClick={save} className="text-[10px] text-paper/60 hover:text-paper">✓</button>
            <button onClick={() => setEditing(false)} className="text-[10px] text-paper/30 hover:text-paper/60">✕</button>
          </div>
        </td>
      </tr>
    );
  }

  return (
    <tr className="group border-b border-paper/5 hover:bg-paper/5">
      <td className="py-2 pr-3 text-paper/50">{item.category}</td>
      <td className="py-2 pr-3 text-paper/90">{item.name}</td>
      <td className="py-2 pr-3 text-paper/50">{item.quantity}</td>
      <td className="py-2 pr-3 text-paper/50">{item.unit}</td>
      <td className="py-2 pr-3 text-paper/50">{item.note}</td>
      <td className="py-2">
        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button onClick={() => setEditing(true)} className="text-[10px] text-paper/50 hover:text-paper">Ред.</button>
          <button onClick={onDelete} className="text-[10px] text-paper/25 hover:text-paper/60">×</button>
        </div>
      </td>
    </tr>
  );
}
