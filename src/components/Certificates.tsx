import { useCallback, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Maximize2 } from 'lucide-react';
import { awaiting, certificates, orgOf, thumbOf, type Cert, type CertCategory } from '../content/certificates';
import { OrgLogo, Reveal, SectionHead, asset } from './ui';
import Viewer, { type ViewItem } from './Viewer';

const isImage = (f: string) => /\.(png|jpe?g|webp)$/i.test(f);
const toView = (c: Cert): ViewItem => ({
  id: c.id, title: c.title, eyebrow: `${c.kind} · ${c.issuer}`,
  sub: [c.date, c.note].filter(Boolean).join(' · ') || undefined,
  image: isImage(c.file) ? `certs/${c.file}` : thumbOf(c),
  original: isImage(c.file) ? undefined : `certs/${c.file}`, verify: c.verify,
});

const CATS: ('All' | CertCategory)[] = ['All', 'Agentic & GenAI', 'AI & ML', 'Computer Vision', 'Cloud', 'Data & Programming', 'Recognition'];

function Folder({ onOpen }: { onOpen: (c: Cert) => void }) {
  const tabs = certificates.filter((c) => c.featured);
  const [sel, setSel] = useState(0);
  const c = tabs[sel];
  return (
    <div className="mx-auto max-w-[900px]">
      <div className="relative z-[2] flex flex-wrap gap-1.5 px-4" role="tablist" aria-label="Featured certificates">
        {tabs.map((t, i) => (
          <button key={t.id} role="tab" aria-selected={i === sel} className="cf-tab" onClick={() => setSel(i)}>
            <small>{t.tabBy ?? t.issuer}</small>{t.featured}
          </button>
        ))}
      </div>
      <div className="relative h-[460px] sm:h-[440px]">
        <div className="absolute inset-0 rounded-b-[18px] rounded-t bg-[#BFCBD2] shadow-[0_30px_60px_rgba(16,24,32,.2)]" />
        <AnimatePresence mode="wait">
          <motion.article key={c.id} role="tabpanel"
            className="cf-doc absolute inset-x-[5%] top-6 z-[1] grid h-[340px] gap-5 rounded p-6 shadow-[0_-4px_20px_rgba(16,24,32,.12)] sm:grid-cols-[1.1fr_1fr] sm:p-8"
            initial={{ y: '55%', rotate: 0, opacity: 0.4 }} animate={{ y: 0, rotate: -1, opacity: 1 }} exit={{ y: '55%', rotate: 0, opacity: 0.4 }}
            transition={{ duration: 0.4, ease: [0.3, 0.7, 0.3, 1] }}>
            <div className="min-w-0">
              {orgOf(c) && <OrgLogo id={orgOf(c)!} className="mb-2 h-8 max-w-[150px]" />}
              <p className="font-hand text-xl font-bold text-teal">{c.issuer}</p>
              <h3 className="mt-1 font-display text-[clamp(1.35rem,2.6vw,1.9rem)] font-extrabold leading-tight tracking-tight">{c.title}</h3>
              <p className="mt-2 font-hand text-lg font-semibold text-muted">{c.date}</p>
              {c.note && <p className="mt-1 text-sm text-ink-2">{c.note}</p>}
              <button onClick={() => onOpen(c)} className="btn btn-solid mt-4 !px-4 !py-2 text-sm"><Maximize2 size={14} /> View certificate</button>
            </div>
            <button onClick={() => onOpen(c)} className="hidden cursor-zoom-in overflow-hidden rounded-md border border-[var(--line)] bg-white p-0 sm:block" aria-label={`Open ${c.title}`}>
              <img src={asset(thumbOf(c))} alt="" className="h-full w-full object-contain" />
            </button>
          </motion.article>
        </AnimatePresence>
        <div className="absolute inset-x-0 bottom-0 z-[1] flex h-[40%] items-end justify-between rounded-b-[18px] rounded-t-[10px] bg-gradient-to-b from-[#D5DEE3] to-[#BFCBD2] px-6 pb-5 shadow-[0_-12px_26px_rgba(16,24,32,.16)]">
          <span className="-rotate-2 rounded bg-white px-3.5 py-1 font-hand text-xl font-bold text-ink shadow-md">Abdullah · the certificate file</span>
          <span className="hidden font-hand text-3xl font-bold text-ink/35 sm:block">{certificates.length} &amp; counting</span>
        </div>
      </div>
    </div>
  );
}

export default function Certificates() {
  const [cat, setCat] = useState<(typeof CATS)[number]>('All');
  const list = useMemo(() => (cat === 'All' ? certificates : certificates.filter((c) => c.category === cat)), [cat]);
  const [open, setOpen] = useState<{ list: Cert[]; i: number } | null>(null);
  const move = useCallback((d: number) => setOpen((o) => (o ? { ...o, i: (o.i + d + o.list.length) % o.list.length } : o)), []);
  const close = useCallback(() => setOpen(null), []);

  return (
    <section id="certificates" data-tone="light" className="graph-paper pb-28">
      <SectionHead kick="evidence, filed" title={<>The certificate<br />file.</>}>
        Every one opens at full size from the original file. Attendance and appreciation certificates are labelled as such.
      </SectionHead>
      <div className="wrap">
        <Reveal><Folder onOpen={(c) => setOpen({ list: certificates.filter((x) => x.featured), i: certificates.filter((x) => x.featured).indexOf(c) })} /></Reveal>

        <div className="mt-20 flex items-end justify-between gap-4">
          <h3 className="h-display text-[clamp(1.8rem,4vw,2.8rem)]">The whole drawer.</h3>
          <span className="note hidden sm:block">{list.length} shown</span>
        </div>
        <div className="no-bar -mx-4 mt-5 flex gap-2 overflow-x-auto px-4 pb-2" role="toolbar" aria-label="Filter certificates">
          {CATS.map((c) => (
            <button key={c} onClick={() => setCat(c)} aria-pressed={cat === c}
              className={`flex-none rounded-full border px-4 py-1.5 text-sm font-semibold transition-colors ${cat === c ? 'border-ink bg-ink text-paper' : 'border-[var(--line)] bg-white hover:border-ink'}`}>{c}</button>
          ))}
        </div>
        <motion.ul layout className="mt-6 grid list-none grid-cols-2 gap-4 p-0 sm:grid-cols-3 lg:grid-cols-4">
          <AnimatePresence>
            {list.map((c, i) => (
              <motion.li key={c.id} layout initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}>
                <button onClick={() => setOpen({ list, i })} className="group flex h-full w-full cursor-zoom-in flex-col overflow-hidden rounded-xl border border-[var(--line)] bg-white p-0 text-start shadow-[0_8px_20px_rgba(16,24,32,.05)] transition-transform hover:-translate-y-1">
                  <div className="aspect-[4/3] w-full overflow-hidden bg-paper-2">
                    <img src={asset(thumbOf(c))} alt="" loading="lazy" className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-105" />
                  </div>
                  <div className="flex flex-1 flex-col p-3.5">
                    <span className="flex items-center justify-between gap-2">
                      <span className="text-[.65rem] font-semibold uppercase tracking-[.12em] text-teal">{c.kind}</span>
                      {orgOf(c) && <OrgLogo id={orgOf(c)!} className="h-5 max-w-[70px]" />}
                    </span>
                    <b className="mt-1 text-sm leading-snug">{c.title}</b>
                    <span className="mt-auto pt-1.5 text-xs text-muted">{c.issuer}{c.date ? ` · ${c.date}` : ''}</span>
                  </div>
                </button>
              </motion.li>
            ))}
          </AnimatePresence>
        </motion.ul>
        <Reveal className="mt-10">
          <aside className="flex flex-wrap items-center gap-5 rounded-2xl border border-dashed border-ink/25 bg-white/60 p-5 sm:p-6">
            <div className="flex items-center gap-3">
              <OrgLogo id="samsung" className="h-8" />
              <OrgLogo id="misk" className="h-9 max-w-[90px]" />
            </div>
            <div className="min-w-0 flex-1">
              <b className="font-display text-lg">{awaiting.title}</b>
              <p className="m-0 text-sm text-ink-2">{awaiting.issuer} · {awaiting.date}</p>
            </div>
            <span className="rounded-full border border-teal/40 bg-teal/10 px-3 py-1 text-xs font-semibold text-teal">{awaiting.status}</span>
          </aside>
        </Reveal>
      </div>
      <AnimatePresence>{open && <Viewer list={open.list.map(toView)} index={open.i} onClose={close} onMove={move} />}</AnimatePresence>
    </section>
  );
}
