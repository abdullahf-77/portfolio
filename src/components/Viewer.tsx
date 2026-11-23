import { useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { ChevronLeft, ChevronRight, ExternalLink, ShieldCheck, X } from 'lucide-react';
import { asset } from './ui';

export type ViewItem = {
  id: string;
  title: string;
  eyebrow: string;
  sub?: string;
  image: string; // path under assets
  original?: string; // e.g. the source PDF
  verify?: string;
};

/** Full-size viewer for certificates, evidence and screenshots. Esc closes, arrows move. */
export default function Viewer({ list, index, onClose, onMove }: { list: ViewItem[]; index: number; onClose: () => void; onMove: (d: number) => void }) {
  const c = list[index];
  const closeRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    closeRef.current?.focus();
    const key = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') onMove(1);
      if (e.key === 'ArrowLeft') onMove(-1);
    };
    document.addEventListener('keydown', key);
    document.body.style.overflow = 'hidden';
    return () => { document.removeEventListener('keydown', key); document.body.style.overflow = ''; };
  }, [onClose, onMove]);

  return (
    <motion.div className="fixed inset-0 z-[100] grid place-items-center bg-ink/90 p-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-label={c.title}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}>
      <div className="relative flex max-h-full w-full max-w-5xl flex-col" onClick={(e) => e.stopPropagation()}>
        <div className="mb-3 flex items-start justify-between gap-4 text-paper">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[.14em] text-teal-2">{c.eyebrow}</p>
            <h3 className="mt-1 font-display text-xl font-bold leading-tight sm:text-2xl">{c.title}</h3>
            {c.sub && <p className="text-sm text-silver/70">{c.sub}</p>}
          </div>
          <button ref={closeRef} onClick={onClose} aria-label="Close" className="grid size-10 flex-none place-items-center rounded-full bg-paper/10 hover:bg-paper/20"><X size={20} /></button>
        </div>
        <motion.img key={c.id} src={asset(c.image)} alt={c.title}
          initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }}
          className="max-h-[70vh] w-full rounded-lg bg-white object-contain" />
        <div className="mt-3 flex flex-wrap items-center justify-between gap-3 text-sm text-paper">
          <div className="flex gap-4">
            {c.original && <a href={asset(c.original)} target="_blank" rel="noreferrer" className="ulink inline-flex items-center gap-1.5">Open original <ExternalLink size={14} /></a>}
            {c.verify && <a href={c.verify} target="_blank" rel="noreferrer" className="ulink inline-flex items-center gap-1.5"><ShieldCheck size={14} /> Verify</a>}
          </div>
          {list.length > 1 && (
            <div className="flex items-center gap-2">
              <button onClick={() => onMove(-1)} aria-label="Previous" className="grid size-10 place-items-center rounded-full bg-paper/10 hover:bg-paper/20"><ChevronLeft size={20} /></button>
              <span className="font-mono text-xs text-silver/70">{index + 1} / {list.length}</span>
              <button onClick={() => onMove(1)} aria-label="Next" className="grid size-10 place-items-center rounded-full bg-paper/10 hover:bg-paper/20"><ChevronRight size={20} /></button>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
