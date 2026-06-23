'use client';
import { useState } from 'react';

type Revision = { id: string; text: string; createdAt: string; isFromClient: boolean };

export function StageApproveSection({
  stageIndex,
  initialApproved,
  initialRevisions,
}: {
  stageIndex: number;
  initialApproved: boolean;
  initialRevisions: Revision[];
}) {
  const [approved, setApproved] = useState(initialApproved);
  const [approving, setApproving] = useState(false);
  const [revisions, setRevisions] = useState(initialRevisions);
  const [revText, setRevText] = useState('');
  const [addingRev, setAddingRev] = useState(false);

  const approve = async () => {
    setApproving(true);
    await fetch(`/api/client/stages/${stageIndex}/approve`, { method: 'POST' });
    setApproved(true);
    setApproving(false);
  };

  const addRevision = async () => {
    if (!revText.trim()) return;
    setAddingRev(true);
    const res = await fetch(`/api/client/stages/${stageIndex}/revisions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: revText.trim() }),
    });
    if (res.ok) {
      const newRev = await res.json();
      setRevisions((prev) => [newRev, ...prev]);
      setApproved(false);
      setRevText('');
    }
    setAddingRev(false);
  };

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString('uk-UA', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Europe/Kyiv' });

  return (
    <div className="mt-10">
      {/* Revisions list */}
      {revisions.length > 0 && (
        <div className="mb-6">
          <p className="mb-3 text-[10px] uppercase tracking-[0.25em] text-muted">
            Правки · {revisions.length}
          </p>
          <div className="max-w-lg space-y-2">
            {revisions.map((r) => (
              <div key={r.id} className="border border-line bg-white px-5 py-4">
                <div className="mb-1 flex items-center gap-3">
                  <p className="text-[10px] uppercase tracking-[0.1em] text-muted">{formatDate(r.createdAt)}</p>
                  {r.isFromClient && (
                    <span className="text-[10px] text-muted">— від вас</span>
                  )}
                </div>
                <p className="text-sm text-ink">{r.text}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Client can add a revision */}
      <div className="max-w-lg">
        <p className="mb-2 text-[10px] uppercase tracking-[0.25em] text-muted">
          {revisions.length === 0 ? 'Правки' : 'Додати правку'}
        </p>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Опишіть що потрібно виправити…"
            value={revText}
            onChange={(e) => setRevText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addRevision()}
            className="flex-1 border border-line bg-white px-4 py-2.5 text-sm text-ink outline-none focus:border-ink placeholder:text-muted/50 transition-colors"
          />
          <button
            onClick={addRevision}
            disabled={addingRev || !revText.trim()}
            className="shrink-0 border border-ink px-4 py-2.5 text-xs uppercase tracking-[0.15em] hover:bg-ink hover:text-paper transition-colors disabled:opacity-40"
          >
            {addingRev ? '…' : 'Надіслати'}
          </button>
        </div>
      </div>

      {/* Stage-level Погодити */}
      <div className="mt-6 flex items-center justify-between border-t border-line pt-5">
        <p className="text-xs text-muted">Підтвердіть виконання етапу</p>
        {approved ? (
          <span className="border border-line px-5 py-2.5 text-xs text-muted">Погоджено ✓</span>
        ) : (
          <button
            onClick={approve}
            disabled={approving}
            className="bg-ink px-6 py-2.5 text-xs font-medium uppercase tracking-[0.15em] text-paper transition-all hover:opacity-80 active:scale-95 disabled:opacity-40"
          >
            {approving ? '…' : 'Погодити'}
          </button>
        )}
      </div>
    </div>
  );
}
