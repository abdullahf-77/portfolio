import { useCallback, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { CalendarDays, MapPin, Maximize2 } from 'lucide-react';
import { events, otherEvents, type EventItem } from '../content/experience';
import { OrgLogo, Reveal, SectionHead, asset } from './ui';
import Viewer, { type ViewItem } from './Viewer';

const withEvidence = [...events, ...otherEvents].filter((e) => e.evidence);
const toView = (e: EventItem): ViewItem => ({
  id: e.id, title: e.evidence!.label, eyebrow: `${e.kind} · ${e.short}`, sub: [e.when, e.place].filter(Boolean).join(' · '),
  image: e.evidence!.thumb, original: e.evidence!.file,
});

const KIND_STYLE: Record<EventItem['kind'], string> = {
  Volunteer: 'bg-teal text-white', Participant: 'bg-ink text-paper', Presenter: 'bg-slate text-paper', Attendee: 'border border-[var(--line)] text-ink-2',
};

export default function Events() {
  const [open, setOpen] = useState<number | null>(null);
  const move = useCallback((d: number) => setOpen((i) => (i === null ? i : (i + d + withEvidence.length) % withEvidence.length)), []);
  const close = useCallback(() => setOpen(null), []);
  const show = (e: EventItem) => setOpen(withEvidence.findIndex((x) => x.id === e.id));

  return (
    <section id="events" data-tone="light" className="graph-paper-2 pb-28">
      <SectionHead kick="out in the field" title={<>Volunteering<br />&amp; events.</>}>
        Two national stages where I explained AI to the public, plus the events where I built, presented or listened. Each one is labelled for the role I actually had.
      </SectionHead>

      <div className="wrap grid gap-8 lg:grid-cols-2">
        {events.map((e, i) => (
          <Reveal key={e.id} delay={i * 0.1}>
            <article className="group relative h-full overflow-hidden rounded-2xl border border-[var(--line)] bg-white shadow-[0_20px_44px_rgba(16,24,32,.08)]">
              {/* evidence print: the real certificate, pinned to the card */}
              <button onClick={() => show(e)} className="relative block w-full cursor-zoom-in overflow-hidden border-0 bg-paper-2 p-0" aria-label={`Open ${e.evidence!.label}`}>
                <div className="flex h-56 items-center justify-center gap-6 px-6 sm:h-64">
                  <motion.img src={asset(e.evidence!.thumb)} alt="" loading="lazy"
                    className="h-[82%] w-auto rounded-sm bg-white object-contain p-1.5 shadow-[0_14px_30px_rgba(16,24,32,.22)]"
                    initial={{ rotate: i ? 4 : -4 }} whileHover={{ rotate: 0, scale: 1.04 }} transition={{ type: 'spring', stiffness: 200, damping: 16 }} />
                </div>
                <span className="absolute bottom-3 right-3 inline-flex items-center gap-1.5 rounded-full bg-ink/80 px-3 py-1 text-xs font-semibold text-paper opacity-0 transition-opacity group-hover:opacity-100">
                  <Maximize2 size={12} /> View certificate
                </span>
              </button>
              <div className="p-6 sm:p-7">
                <div className="flex flex-wrap items-center gap-3">
                  {e.logos.map((l) => <OrgLogo key={l} id={l} className={l === 'leap' ? 'h-6' : l === 'gfeai' ? 'h-16 max-w-[190px]' : 'h-10 max-w-[150px]'} />)}
                </div>
                <div className="mt-5 flex flex-wrap items-center gap-2">
                  <span className={`rounded-full px-2.5 py-0.5 text-[.7rem] font-semibold uppercase tracking-wider ${KIND_STYLE[e.kind]}`}>{e.kind}</span>
                  <span className="inline-flex items-center gap-1 text-sm text-muted"><CalendarDays size={14} /> {e.when}</span>
                  {e.place && <span className="inline-flex items-center gap-1 text-sm text-muted"><MapPin size={14} /> {e.place}</span>}
                </div>
                <h3 className="h-display mt-3 text-[clamp(1.5rem,2.6vw,2rem)] !leading-[1.05]">{e.name}</h3>
                <p className="mt-1 font-semibold text-teal">{e.role}</p>
                <p className="mt-3 text-[.98rem] text-ink-2">{e.text}</p>
              </div>
            </article>
          </Reveal>
        ))}
      </div>

      <div className="wrap mt-10">
        <Reveal><h3 className="font-hand text-2xl font-bold text-teal">also on the calendar</h3></Reveal>
        <ul className="mt-3 grid list-none gap-4 p-0 md:grid-cols-3">
          {otherEvents.map((e, i) => (
            <Reveal key={e.id} delay={i * 0.06}>
              <li className="flex h-full flex-col rounded-xl border border-[var(--line)] bg-white p-5">
                <div className="flex items-center justify-between gap-3">
                  <OrgLogo id={e.logos[0]} className="h-8 max-w-[110px]" />
                  <span className={`rounded-full px-2.5 py-0.5 text-[.65rem] font-semibold uppercase tracking-wider ${KIND_STYLE[e.kind]}`}>{e.kind}</span>
                </div>
                <b className="mt-3 font-display text-lg leading-tight">{e.name}</b>
                <span className="text-sm font-semibold text-teal">{e.role}{e.when ? ` · ${e.when}` : ''}</span>
                <p className="mt-2 text-sm text-ink-2">{e.text}</p>
                {e.evidence && <button onClick={() => show(e)} className="ulink mt-auto self-start border-0 bg-transparent p-0 pt-3 text-sm">View certificate</button>}
              </li>
            </Reveal>
          ))}
        </ul>
      </div>

      <AnimatePresence>{open !== null && <Viewer list={withEvidence.map(toView)} index={open} onClose={close} onMove={move} />}</AnimatePresence>
    </section>
  );
}
