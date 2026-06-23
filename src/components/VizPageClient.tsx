'use client';
import { useState, useEffect, useCallback, useRef } from 'react';

type Revision = { id: string; text: string; createdAt: string; isFromClient: boolean };
type Visualization = { id: string; url: string; description: string | null };
type Room = {
  id: string;
  name: string;
  visualizations: Visualization[];
  clientApprovedAt: string | null;
  revisions: Revision[];
};

export function VizPageClient({
  rooms,
  stageIndex,
  initialStageApproved,
}: {
  rooms: Room[];
  stageIndex: number;
  initialStageApproved: boolean;
}) {
  const [activeRoomId, setActiveRoomId] = useState(rooms[0]?.id ?? null);
  const [roomApprovals, setRoomApprovals] = useState<Record<string, boolean>>(
    Object.fromEntries(rooms.map((r) => [r.id, !!r.clientApprovedAt]))
  );
  const [roomRevisions, setRoomRevisions] = useState<Record<string, Revision[]>>(
    Object.fromEntries(rooms.map((r) => [r.id, r.revisions]))
  );
  const [revTexts, setRevTexts] = useState<Record<string, string>>({});
  const [addingRev, setAddingRev] = useState<string | null>(null);
  const [approving, setApproving] = useState<string | null>(null);
  const [stageApproved, setStageApproved] = useState(initialStageApproved);
  const [stageApproving, setStageApproving] = useState(false);
  const [lightbox, setLightbox] = useState<{ images: Visualization[]; index: number } | null>(null);

  const currentRoom = rooms.find((r) => r.id === activeRoomId) ?? rooms[0];

  const addRoomRevision = async (roomId: string) => {
    const text = (revTexts[roomId] ?? '').trim();
    if (!text) return;
    setAddingRev(roomId);
    const res = await fetch(`/api/client/stages/${stageIndex}/rooms/${roomId}/revisions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text }),
    });
    if (res.ok) {
      const newRev = await res.json();
      setRoomRevisions((prev) => ({ ...prev, [roomId]: [newRev, ...(prev[roomId] ?? [])] }));
      setRoomApprovals((prev) => ({ ...prev, [roomId]: false }));
      setStageApproved(false);
      setRevTexts((prev) => ({ ...prev, [roomId]: '' }));
    }
    setAddingRev(null);
  };

  const approveRoom = async (roomId: string) => {
    setApproving(roomId);
    await fetch(`/api/client/stages/${stageIndex}/rooms/${roomId}/approve`, { method: 'POST' });
    setRoomApprovals((prev) => ({ ...prev, [roomId]: true }));
    setApproving(null);
  };

  const approveStage = async () => {
    setStageApproving(true);
    await fetch(`/api/client/stages/${stageIndex}/approve`, { method: 'POST' });
    setStageApproved(true);
    setStageApproving(false);
  };

  const goNext = useCallback(() => {
    setLightbox((lb) => lb ? { ...lb, index: (lb.index + 1) % lb.images.length } : null);
  }, []);
  const goPrev = useCallback(() => {
    setLightbox((lb) => lb ? { ...lb, index: (lb.index - 1 + lb.images.length) % lb.images.length } : null);
  }, []);

  useEffect(() => {
    if (!lightbox) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') goNext();
      else if (e.key === 'ArrowLeft') goPrev();
      else if (e.key === 'Escape') setLightbox(null);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [lightbox, goNext, goPrev]);

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString('uk-UA', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Europe/Kyiv' });

  if (!rooms.length) return <p className="text-sm text-muted">Візуалізації ще не додано.</p>;

  const currentRevisions = currentRoom ? (roomRevisions[currentRoom.id] ?? []) : [];
  const currentApproved = currentRoom ? (roomApprovals[currentRoom.id] ?? false) : false;
  const currentRevText = currentRoom ? (revTexts[currentRoom.id] ?? '') : '';

  return (
    <div>
      {/* Room tabs */}
      <div className="mb-6 flex flex-wrap gap-1.5">
        {rooms.map((r) => {
          const hasRevisions = (roomRevisions[r.id]?.length ?? 0) > 0;
          const isApproved = roomApprovals[r.id] ?? false;
          return (
            <button
              key={r.id}
              onClick={() => setActiveRoomId(r.id)}
              className={`px-4 py-1.5 text-xs transition-all active:scale-95 ${
                activeRoomId === r.id
                  ? 'bg-ink text-paper'
                  : 'border border-line text-muted hover:border-ink hover:text-ink'
              }`}
            >
              {r.name}
              {isApproved && ' ✓'}
              {hasRevisions && !isApproved && (
                <span className="ml-1 text-[rgb(var(--terra))]">·</span>
              )}
            </button>
          );
        })}
      </div>

      {/* Gallery */}
      {currentRoom && currentRoom.visualizations.length > 0 && (
        <div className="columns-2 gap-3 sm:columns-3">
          {currentRoom.visualizations.map((v, i) => (
            <div key={v.id} className="mb-3 break-inside-avoid">
              <button
                className="block w-full overflow-hidden bg-[#e8e4dc] hover:opacity-90 transition-opacity"
                onClick={() => setLightbox({ images: currentRoom.visualizations, index: i })}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={v.url}
                  alt={v.description ?? `Вид ${String(i + 1).padStart(2, '0')}`}
                  className="w-full h-auto block"
                />
              </button>
              <p className="mt-1.5 text-xs text-muted/60">
                {v.description
                  ? `Вид ${String(i + 1).padStart(2, '0')} — ${v.description}`
                  : `Вид ${String(i + 1).padStart(2, '0')}`}
              </p>
            </div>
          ))}
        </div>
      )}

      {currentRoom && currentRoom.visualizations.length === 0 && (
        <p className="text-sm text-muted">Зображення ще не додано.</p>
      )}

      {/* Per-room: revisions + approve */}
      {currentRoom && (
        <div className="mt-8 max-w-lg">
          {/* Revisions list */}
          {currentRevisions.length > 0 && (
            <div className="mb-4">
              <p className="mb-2 text-[10px] uppercase tracking-[0.25em] text-muted">
                Правки · {currentRevisions.length}
              </p>
              <div className="space-y-2">
                {currentRevisions.map((r) => (
                  <div key={r.id} className="border border-line bg-white px-4 py-3">
                    <div className="mb-1 flex items-center gap-3">
                      <p className="text-[10px] uppercase tracking-[0.1em] text-muted">{formatDate(r.createdAt)}</p>
                      {r.isFromClient && <span className="text-[10px] text-muted">— від вас</span>}
                    </div>
                    <p className="text-sm text-ink">{r.text}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Add revision input */}
          <div className="mb-4 flex gap-2">
            <input
              type="text"
              placeholder="Правка до цього приміщення…"
              value={currentRevText}
              onChange={(e) =>
                setRevTexts((prev) => ({ ...prev, [currentRoom.id]: e.target.value }))
              }
              onKeyDown={(e) => e.key === 'Enter' && addRoomRevision(currentRoom.id)}
              className="flex-1 border border-line bg-white px-4 py-2.5 text-sm text-ink outline-none focus:border-ink placeholder:text-muted/50 transition-colors"
            />
            <button
              onClick={() => addRoomRevision(currentRoom.id)}
              disabled={addingRev === currentRoom.id || !currentRevText.trim()}
              className="shrink-0 border border-ink px-4 py-2.5 text-xs uppercase tracking-[0.15em] hover:bg-ink hover:text-paper transition-colors disabled:opacity-40"
            >
              {addingRev === currentRoom.id ? '…' : 'Надіслати'}
            </button>
          </div>

          {/* Per-room Погодити */}
          <div className="flex items-center justify-between border-t border-line pt-4">
            <p className="text-xs text-muted">
              {currentRoom.visualizations.length}{' '}
              {currentRoom.visualizations.length === 1 ? 'зображення' : 'зображень'} · {currentRoom.name}
            </p>
            {currentApproved ? (
              <span className="border border-line px-5 py-2.5 text-xs text-muted">Погоджено ✓</span>
            ) : (
              <button
                onClick={() => approveRoom(currentRoom.id)}
                disabled={approving === currentRoom.id}
                className="bg-ink px-6 py-2.5 text-xs font-medium uppercase tracking-[0.15em] text-paper transition-all hover:opacity-80 active:scale-95 disabled:opacity-40"
              >
                {approving === currentRoom.id ? '…' : 'Погодити'}
              </button>
            )}
          </div>
        </div>
      )}

      {/* Stage-level Погодити */}
      <div className="mt-10 flex items-center justify-between border-t border-line pt-5">
        <p className="text-xs text-muted">Погодити весь розділ Візуалізації</p>
        {stageApproved ? (
          <span className="border border-line px-5 py-2.5 text-xs text-muted">Погоджено ✓</span>
        ) : (
          <button
            onClick={approveStage}
            disabled={stageApproving}
            className="bg-ink px-6 py-2.5 text-xs font-medium uppercase tracking-[0.15em] text-paper transition-all hover:opacity-80 active:scale-95 disabled:opacity-40"
          >
            {stageApproving ? '…' : 'Погодити'}
          </button>
        )}
      </div>

      {/* Lightbox */}
      {lightbox && (
        <Lightbox
          images={lightbox.images}
          index={lightbox.index}
          onClose={() => setLightbox(null)}
          onNext={goNext}
          onPrev={goPrev}
        />
      )}
    </div>
  );
}

function Lightbox({
  images,
  index,
  onClose,
  onNext,
  onPrev,
}: {
  images: Visualization[];
  index: number;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
}) {
  const image = images[index];
  const touchStartX = useRef<number | null>(null);

  const onTouchStart = (e: React.TouchEvent) => { touchStartX.current = e.touches[0].clientX; };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const delta = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(delta) > 50) delta > 0 ? onNext() : onPrev();
    touchStartX.current = null;
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/95"
      onClick={onClose}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      <div className="absolute left-6 top-6 text-xs text-white/40">{index + 1} / {images.length}</div>
      <button
        className="absolute right-6 top-6 text-xs uppercase tracking-[0.2em] text-white/50 hover:text-white transition-colors"
        onClick={onClose}
      >
        Закрити ×
      </button>
      <div className="relative px-12 sm:px-20" onClick={(e) => e.stopPropagation()}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={image.url}
          alt={image.description ?? ''}
          className="max-h-[90vh] max-w-[90vw] w-auto h-auto object-contain"
        />
        {image.description && (
          <p className="mt-3 text-center text-xs text-white/40">{image.description}</p>
        )}
      </div>
      {images.length > 1 && (
        <button
          className="absolute left-3 top-1/2 -translate-y-1/2 p-4 text-white/30 hover:text-white transition-colors text-xl"
          onClick={(e) => { e.stopPropagation(); onPrev(); }}
        >←</button>
      )}
      {images.length > 1 && (
        <button
          className="absolute right-3 top-1/2 -translate-y-1/2 p-4 text-white/30 hover:text-white transition-colors text-xl"
          onClick={(e) => { e.stopPropagation(); onNext(); }}
        >→</button>
      )}
    </div>
  );
}
