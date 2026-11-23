import { useCallback, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowUpRight, Lock } from 'lucide-react';
import { featured, more, type Project, type Shot } from '../content/projects';
import { profile } from '../content/profile';
import { GitHubIcon, Reveal, SectionHead } from './ui';
import { GraphVisual, NexusVisual, RibhVisual } from './visuals';
import { CookFinderVisual, Flow, JournalVisual, PPEVisual, ResultBars, Shots } from './showcase';
import Viewer from './Viewer';

const TONE = {
  light: { section: 'graph-paper text-ink', tone: 'light', rule: 'border-ink', sub: 'border-[var(--line)]', dark: false },
  dark: { section: 'blueprint text-paper', tone: 'dark', rule: 'border-silver/60', sub: 'border-silver/15', dark: true },
  teal: { section: 'bg-teal text-white', tone: 'dark', rule: 'border-white/70', sub: 'border-white/20', dark: true },
};

function Interactive({ p }: { p: Project }) {
  switch (p.interactive) {
    case 'ribh': return <RibhVisual />;
    case 'graph': return <GraphVisual />;
    case 'journal': return <JournalVisual />;
    case 'nexus': return <NexusVisual />;
    case 'ppe': return <PPEVisual />;
    case 'cookfinder': return <CookFinderVisual />;
  }
}

function Showcase({ p }: { p: Project }) {
  const t = TONE[p.tone];
  const tabs = [p.interactiveLabel, 'Architecture', ...(p.shots ? ['Screens'] : []), ...(p.results ? ['Results'] : [])];
  const [tab, setTab] = useState(0);
  const [view, setView] = useState<{ list: Shot[]; i: number } | null>(null);
  const move = useCallback((d: number) => setView((v) => (v ? { ...v, i: (v.i + d + v.list.length) % v.list.length } : v)), []);
  const close = useCallback(() => setView(null), []);
  const name = tabs[tab];

  return (
    <div>
      <div className="mb-4 flex flex-wrap gap-1" role="tablist" aria-label={`${p.title} showcase`}>
        {tabs.map((x, i) => (
          <button key={x} role="tab" aria-selected={i === tab} onClick={() => setTab(i)}
            className={`relative rounded-full px-4 py-1.5 text-sm font-semibold transition-colors ${i === tab ? (t.dark ? 'text-ink' : 'text-paper') : t.dark ? 'text-current opacity-75 hover:opacity-100' : 'text-ink-2 hover:text-ink'}`}>
            {i === tab && <motion.span layoutId={`pill-${p.id}`} className={`absolute inset-0 rounded-full ${t.dark ? 'bg-paper' : 'bg-ink'}`} transition={{ type: 'spring', stiffness: 380, damping: 32 }} />}
            <span className="relative">{x}</span>
          </button>
        ))}
      </div>
      <AnimatePresence mode="wait">
        <motion.div key={name} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.25 }}>
          {tab === 0 && <Interactive p={p} />}
          {name === 'Architecture' && <Flow steps={p.flow} dark={t.dark} />}
          {name === 'Screens' && p.shots && <Shots shots={p.shots} dark={t.dark} onOpen={(i) => setView({ list: p.shots!, i })} />}
          {name === 'Results' && p.results && (
            <ResultBars {...p.results} dark={t.dark} onImage={() => p.results?.image && setView({ list: [p.results.image], i: 0 })} />
          )}
        </motion.div>
      </AnimatePresence>
      <AnimatePresence>
        {view && (
          <Viewer list={view.list.map((s, i) => ({ id: `${p.id}-${i}`, title: s.caption, eyebrow: p.title, image: s.src }))} index={view.i} onClose={close} onMove={move} />
        )}
      </AnimatePresence>
    </div>
  );
}

function World({ p, flip }: { p: Project; flip: boolean }) {
  const t = TONE[p.tone];
  return (
    <section id={p.id} data-tone={t.tone} className={`${t.section} overflow-hidden py-24 lg:py-28`}>
      <div className="wrap grid items-start gap-10 lg:grid-cols-[1fr_1.15fr] lg:gap-14">
        <Reveal className={`min-w-0 ${flip ? 'lg:order-2' : ''}`}>
          <div className="flex items-baseline gap-3.5 text-sm font-semibold opacity-85">
            <span className="font-hand text-[1.9rem] font-bold opacity-100">{p.no}</span>
            <span>{p.category} · {p.context}</span>
          </div>
          <h3 className="h-display my-3 text-[clamp(2.6rem,5.6vw,4.6rem)] !tracking-[-.04em]">{p.title}</h3>
          <div className="grid max-w-[540px] gap-3 text-[1.05rem] leading-normal">
            <p className="m-0"><b className="font-hand text-xl font-bold">the problem </b><span className="opacity-85">{p.problem}</span></p>
            <p className="m-0"><b className="font-hand text-xl font-bold">what I built </b><span className="opacity-95">{p.solution}</span></p>
          </div>
          <dl className={`mt-6 border-t ${t.rule}`}>
            {p.decisions.map((f) => (
              <div key={f.k} className={`grid grid-cols-[110px_1fr] gap-4 border-b py-3 text-[.92rem] ${t.sub}`}>
                <dt className="font-semibold opacity-65">{f.k}</dt>
                <dd className="m-0">{f.v}</dd>
              </div>
            ))}
          </dl>
          <div className="mt-5 flex flex-wrap gap-2">{p.tags.map((x) => <span key={x} className="tag">{x}</span>)}</div>
          <div className="mt-6 flex flex-wrap gap-5">
            {p.links.map((l) => (
              <a key={l.href} href={l.href} target="_blank" rel="noreferrer" className="ulink inline-flex items-center gap-1">{l.label} <ArrowUpRight size={15} /></a>
            ))}
          </div>
        </Reveal>
        <Reveal className="min-w-0 lg:sticky lg:top-24" delay={0.12}><Showcase p={p} /></Reveal>
      </div>
    </section>
  );
}

export default function Work() {
  return (
    <div id="work">
      <div data-tone="light" className="graph-paper">
        <SectionHead kick="things I built" title={<>Six projects,<br />strongest first.</>}>
          Ranked by engineering depth, not looks. Each one has a live demo of how it works, its real architecture, and screenshots or results from the repo.
        </SectionHead>
      </div>
      {featured.map((p, i) => <World key={p.id} p={p} flip={i % 2 === 1} />)}

      <section data-tone="light" className="graph-paper-2 py-24">
        <div className="wrap">
          <Reveal>
            <span className="kick">and also</span>
            <h3 className="h-display mt-1 text-[clamp(2rem,4.5vw,3.4rem)]">More projects.</h3>
          </Reveal>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {more.map((m, i) => (
              <Reveal key={m.title} delay={(i % 3) * 0.06}>
                <article className="flex h-full flex-col rounded-2xl border border-[var(--line)] bg-white p-6 shadow-[0_10px_24px_rgba(16,24,32,.05)] transition-transform hover:-translate-y-1">
                  <p className="text-[.7rem] font-semibold uppercase tracking-[.14em] text-teal">{m.area}</p>
                  <h4 className="mt-1.5 font-display text-xl font-bold">{m.title}</h4>
                  <p className="mt-2 text-[.95rem] text-ink-2">{m.text}</p>
                  <div className="mt-4 flex flex-wrap gap-1.5 text-ink-2">{m.tags.map((x) => <span key={x} className="tag">{x}</span>)}</div>
                  <div className="mt-auto pt-5 text-sm">
                    {m.href ? (
                      <a href={m.href} target="_blank" rel="noreferrer" className="ulink inline-flex items-center gap-1.5"><GitHubIcon size={14} /> Code</a>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 text-muted"><Lock size={13} /> {m.note}</span>
                    )}
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
          <Reveal className="mt-12 flex flex-wrap items-center gap-4">
            <a href={profile.links.repos} target="_blank" rel="noreferrer" className="btn btn-solid"><GitHubIcon size={16} /> View all projects on GitHub</a>
            <span className="note">every public repo, including coursework</span>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
