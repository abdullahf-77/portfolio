import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { asset } from './ui';
import { demoRecipes, ppeOutputs, unescoPrinciples, type FlowStep, type Metric, type Shot } from '../content/projects';

/* ---------- Ethical AI Journal: the ten UNESCO principles ---------- */
export function JournalVisual() {
  const [hot, setHot] = useState<number | null>(null);
  const n = unescoPrinciples.length, R = 122, r = 74, C = 160;
  const seg = (i: number) => {
    const a0 = (i / n) * Math.PI * 2 - Math.PI / 2 + 0.025, a1 = ((i + 1) / n) * Math.PI * 2 - Math.PI / 2 - 0.025;
    const p = (rad: number, a: number) => `${C + rad * Math.cos(a)} ${C + rad * Math.sin(a)}`;
    return `M ${p(R, a0)} A ${R} ${R} 0 0 1 ${p(R, a1)} L ${p(r, a1)} A ${r} ${r} 0 0 0 ${p(r, a0)} Z`;
  };
  return (
    <div className="grid items-center gap-4 rounded-[22px] bg-ink/25 p-6 sm:grid-cols-2">
      <svg viewBox="0 0 320 320" className="mx-auto w-full max-w-[300px]" role="img" aria-label="The ten UNESCO Recommendation principles used to organise the journal">
        {unescoPrinciples.map((name, i) => (
          <path key={name} d={seg(i)} fill={hot === i ? '#F5F7F8' : 'rgba(245,247,248,.18)'} stroke="rgba(245,247,248,.5)" strokeWidth="1"
            onMouseEnter={() => setHot(i)} onMouseLeave={() => setHot(null)} onFocus={() => setHot(i)} onBlur={() => setHot(null)}
            tabIndex={0} style={{ cursor: 'pointer', transition: 'fill .25s', outline: 'none' }}><title>{name}</title></path>
        ))}
        <text x={C} y={C + 6} textAnchor="middle" fill="#fff" fontFamily="Bricolage Grotesque" fontWeight="800" fontSize="46">{hot === null ? '10' : hot + 1}</text>
        <text x={C} y={C + 28} textAnchor="middle" fill="rgba(255,255,255,.8)" fontFamily="Inter" fontSize="11">UNESCO principles</text>
      </svg>
      <ol className="m-0 grid list-none gap-0.5 p-0 text-[.82rem]">
        {unescoPrinciples.map((name, i) => (
          <li key={name} onMouseEnter={() => setHot(i)} onMouseLeave={() => setHot(null)}
            className={`flex cursor-default gap-2 rounded px-2 py-1 transition-colors ${hot === i ? 'bg-paper text-ink' : 'text-white/85'}`}>
            <span className="w-5 flex-none font-mono opacity-70">{i + 1}</span>{name}
          </li>
        ))}
      </ol>
    </div>
  );
}

/* ---------- PPE: real model outputs from the repo ---------- */
export function PPEVisual() {
  const [i, setI] = useState(0);
  const tabs = ['Detection', 'Pose', 'Tracking', 'Alerts'];
  const o = ppeOutputs[i];
  const gif = o.src.endsWith('.gif');
  return (
    <div className="rounded-[22px] border border-silver/15 bg-[#0B1218] p-4 sm:p-5">
      <div className="mb-4 flex flex-wrap gap-1.5" role="tablist" aria-label="Model outputs">
        {tabs.map((t, k) => (
          <button key={t} role="tab" aria-selected={k === i} onClick={() => setI(k)}
            className={`rounded-full px-3.5 py-1.5 font-mono text-xs font-semibold transition-colors ${k === i ? 'bg-teal-2 text-ink' : 'bg-white/5 text-silver hover:bg-white/10'}`}>{t}</button>
        ))}
      </div>
      <motion.figure key={o.src} className="m-0" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
        <div className={`grid place-items-center overflow-hidden rounded-xl bg-black/40 ${gif ? 'h-[420px]' : ''}`}>
          <img src={asset(o.src)} alt={o.caption} className={gif ? 'h-full w-auto' : 'w-full'} loading="lazy" />
        </div>
        <figcaption className="mt-3 text-sm text-silver/80">{o.caption} <span className="text-silver/50">Real output from the repo.</span></figcaption>
      </motion.figure>
    </div>
  );
}

/* ---------- CookFinder: the real scoring formula on real recipes ---------- */
export function CookFinderVisual() {
  const all = [...new Set(demoRecipes.flatMap((r) => r.ingredients))].sort();
  const [have, setHave] = useState<Set<string>>(new Set(['Onion', 'Garlic', 'Tomato', 'Egg']));
  const toggle = (x: string) => setHave((h) => { const n = new Set(h); if (n.has(x)) n.delete(x); else n.add(x); return n; });
  const ranked = demoRecipes
    .map((r) => { const m = r.ingredients.filter((x) => have.has(x)); return { ...r, m, score: Math.round((m.length / r.ingredients.length) * 100) }; })
    .filter((r) => r.m.length)
    .sort((a, b) => b.score - a.score);
  return (
    <div className="rounded-[22px] bg-ink/25 p-5 sm:p-6">
      <p className="font-mono text-xs text-white/75">detected =</p>
      <div className="mt-2 flex flex-wrap gap-1.5">
        {all.map((x) => (
          <button key={x} onClick={() => toggle(x)} aria-pressed={have.has(x)}
            className={`rounded-full border px-2.5 py-1 text-xs font-semibold transition-colors ${have.has(x) ? 'border-white bg-white text-teal' : 'border-white/35 text-white/85 hover:border-white'}`}>{x}</button>
        ))}
      </div>
      <p className="mt-5 font-mono text-xs text-white/75">ranked by score = matched ÷ total × 100</p>
      <ul className="mt-2 grid list-none gap-2 p-0">
        <AnimatePresence initial={false}>
          {ranked.map((r) => (
            <motion.li key={r.name} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="rounded-xl bg-white/95 px-4 py-3 text-ink">
              <div className="flex items-baseline justify-between gap-3">
                <b className="text-sm">{r.name}</b>
                <span className="font-mono text-sm font-semibold text-teal">{r.score}</span>
              </div>
              <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-silver/60">
                <motion.div className="h-full bg-teal" animate={{ width: `${r.score}%` }} transition={{ type: 'spring', stiffness: 120, damping: 20 }} />
              </div>
              <p className="mt-1 text-xs text-muted">{r.cuisine} · has {r.m.length} of {r.ingredients.length}</p>
            </motion.li>
          ))}
        </AnimatePresence>
        {!ranked.length && <li className="text-sm text-white/80">Pick an ingredient.</li>}
      </ul>
      <p className="mt-3 text-xs text-white/65">Five real recipes from the app’s 200, names shortened. The live app also expands names through its alias map.</p>
    </div>
  );
}

/* ---------- Architecture: an animated flow of the real pipeline ---------- */
const ACTOR: Record<FlowStep['actor'], { c: string; l: string }> = {
  user: { c: '#9FB0BA', l: 'input' }, llm: { c: '#5FB3B7', l: 'LLM' }, code: { c: '#B9C4CB', l: 'code' },
  model: { c: '#D9B866', l: 'model' }, data: { c: '#7F9DC4', l: 'data' }, ui: { c: '#8CC092', l: 'output' },
};

export function Flow({ steps, dark }: { steps: (FlowStep | FlowStep[])[]; dark: boolean }) {
  const [active, setActive] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setActive((a) => (a + 1) % steps.length), 1500);
    return () => clearInterval(id);
  }, [steps.length]);
  const actors = [...new Set(steps.flat().map((s) => s.actor))];
  const box = (s: FlowStep, on: boolean) => (
    <div key={s.label} className="rounded-xl border px-3.5 py-2.5 transition-all duration-500"
      style={{ borderColor: on ? ACTOR[s.actor].c : dark ? 'rgba(210,217,222,.14)' : 'rgba(16,24,32,.13)', background: on ? `${ACTOR[s.actor].c}2e` : 'transparent', transform: on ? 'translateX(6px)' : 'none' }}>
      <div className="flex items-center gap-2">
        <span className="size-2 flex-none rounded-full" style={{ background: ACTOR[s.actor].c }} />
        <b className="text-sm leading-tight">{s.label}</b>
      </div>
      <p className={`mt-1 text-xs leading-snug ${dark ? 'text-silver/70' : 'text-ink-2'}`}>{s.detail}</p>
    </div>
  );
  return (
    <div className={`rounded-[22px] border p-5 sm:p-6 ${dark ? 'border-silver/15 bg-[#0B1218] text-paper' : 'border-[var(--line)] bg-white text-ink shadow-[0_24px_50px_rgba(16,24,32,.08)]'}`}>
      <ol className="m-0 grid list-none gap-0 p-0">
        {steps.map((s, i) => (
          <li key={i}>
            {Array.isArray(s) ? <div className="grid gap-2 sm:grid-cols-3">{s.map((x) => box(x, i === active))}</div> : box(s, i === active)}
            {i < steps.length - 1 && (
              <svg viewBox="0 0 12 14" className={`mx-auto my-1 block h-3.5 w-3 ${dark ? 'text-silver/40' : 'text-ink/30'}`} aria-hidden="true">
                <path d="M6 0 V10 M2 7 L6 12 L10 7" fill="none" stroke="currentColor" strokeWidth="1.6" />
              </svg>
            )}
          </li>
        ))}
      </ol>
      <div className="mt-4 flex flex-wrap gap-3 font-mono text-[.7rem] opacity-80">
        {actors.map((a) => <span key={a} className="inline-flex items-center gap-1.5"><i className="size-2 rounded-full" style={{ background: ACTOR[a].c }} />{ACTOR[a].l}</span>)}
      </div>
    </div>
  );
}

/* ---------- Results: bars for real, reported numbers ---------- */
export function ResultBars({ title, legend, metrics, note, image, dark, onImage }: {
  title: string; legend: [string, string?]; metrics: Metric[]; note: string; image?: Shot; dark: boolean; onImage?: () => void;
}) {
  const two = metrics.some((m) => m.b !== undefined);
  return (
    <div className={`rounded-[22px] border p-5 sm:p-6 ${dark ? 'border-silver/15 bg-[#0B1218] text-paper' : 'border-[var(--line)] bg-white text-ink shadow-[0_24px_50px_rgba(16,24,32,.08)]'}`}>
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <b className="font-display text-lg">{title}</b>
        <span className="flex gap-3 font-mono text-[.7rem]">
          <span className="inline-flex items-center gap-1.5"><i className="h-2 w-4 rounded-sm bg-teal-2" />{legend[0]}</span>
          {legend[1] && <span className="inline-flex items-center gap-1.5"><i className={`h-2 w-4 rounded-sm ${dark ? 'bg-silver' : 'bg-ink'}`} />{legend[1]}</span>}
        </span>
      </div>
      <dl className="mt-4 grid gap-3">
        {metrics.map((m) => (
          <div key={m.k} className="grid grid-cols-[minmax(0,140px)_1fr] items-center gap-3 text-sm">
            <dt className={dark ? 'text-silver/80' : 'text-ink-2'}>{m.k}</dt>
            <dd className="m-0 grid gap-1">
              {(two ? [m.a, m.b ?? 0] : [m.a]).map((v, k) => (
                <div key={k} className="flex items-center gap-2">
                  <div className={`h-2.5 flex-1 overflow-hidden rounded-full ${dark ? 'bg-white/10' : 'bg-paper-2'}`}>
                    <motion.div className={`h-full rounded-full ${k ? (dark ? 'bg-silver' : 'bg-ink') : 'bg-teal-2'}`} initial={{ width: 0 }} whileInView={{ width: `${v * 100}%` }} viewport={{ once: true }} transition={{ duration: 1.1, delay: k * 0.15, ease: [0.6, 0, 0.3, 1] }} />
                  </div>
                  <span className="w-12 text-right font-mono text-xs">{two ? String(v) : v.toFixed(2)}</span>
                </div>
              ))}
            </dd>
          </div>
        ))}
      </dl>
      <p className={`mt-4 text-xs ${dark ? 'text-silver/70' : 'text-muted'}`}>{note}</p>
      {image && (
        <button onClick={onImage} className="mt-4 block w-full cursor-zoom-in overflow-hidden rounded-lg border-0 bg-white p-0" aria-label={`Open ${image.caption}`}>
          <img src={asset(image.src)} alt={image.caption} className="w-full" loading="lazy" />
        </button>
      )}
    </div>
  );
}

/* ---------- Screens: real screenshots, opened in the viewer ---------- */
export function Shots({ shots, dark, onOpen }: { shots: Shot[]; dark: boolean; onOpen: (i: number) => void }) {
  return (
    <div className="grid gap-3">
      <button onClick={() => onOpen(0)} className="block cursor-zoom-in overflow-hidden rounded-[18px] border-0 bg-white p-0 shadow-[0_24px_50px_rgba(16,24,32,.22)]" aria-label={`Open ${shots[0].caption}`}>
        <img src={asset(shots[0].src)} alt={shots[0].caption} className="w-full transition-transform duration-700 hover:scale-[1.02]" loading="lazy" />
      </button>
      {shots.length > 1 && (
        <div className="grid grid-cols-2 gap-3">
          {shots.slice(1).map((s, k) => (
            <button key={s.src} onClick={() => onOpen(k + 1)} className="block aspect-[16/10] cursor-zoom-in overflow-hidden rounded-xl border-0 bg-white p-0" aria-label={`Open ${s.caption}`}>
              <img src={asset(s.src)} alt={s.caption} className="h-full w-full object-cover object-top" loading="lazy" />
            </button>
          ))}
        </div>
      )}
      <p className={`m-0 text-sm ${dark ? 'opacity-75' : 'text-ink-2'}`}>{shots[0].caption} Click any screen to enlarge.</p>
    </div>
  );
}

/* ---------- Wasl: the three real LangGraph agents ---------- */
type WNode = { id: string; kind: 'llm' | 'code' };
const WASL_AGENTS: { name: string; what: string; nodes: (WNode | WNode[])[]; loop?: string }[] = [
  {
    name: 'Content', what: 'Turns a confirmed achievement into a LinkedIn post in six tones, English or Arabic.',
    nodes: [{ id: 'generate', kind: 'llm' }, { id: 'claim_check', kind: 'code' }, { id: 'revise', kind: 'llm' }],
    loop: 'claim_check → revise → claim_check, at most once; a clean post ends the run',
  },
  {
    name: 'Discovery', what: 'Reads free text, certificates or GitHub repos and returns structured achievements.',
    nodes: [{ id: 'sanitize', kind: 'code' }, { id: 'extract', kind: 'llm' }, { id: 'verify_evidence', kind: 'code' }, { id: 'dedupe', kind: 'code' }],
  },
  {
    name: 'Career', what: 'Matches a CV to a job, then tailors it honestly or builds a gap roadmap.',
    nodes: [{ id: 'requirements', kind: 'llm' }, { id: 'match', kind: 'code' }, [{ id: 'tailor → enforce', kind: 'llm' }, { id: 'roadmap', kind: 'llm' }]],
  },
];

export function WaslVisual() {
  const [a, setA] = useState(0);
  const [step, setStep] = useState(-1);
  const agent = WASL_AGENTS[a];
  const flat = agent.nodes.length;
  useEffect(() => { setStep(-1); }, [a]);
  useEffect(() => {
    if (step < 0 || step >= flat) return;
    const id = setTimeout(() => setStep((s) => s + 1), 700);
    return () => clearTimeout(id);
  }, [step, flat]);
  const node = (n: WNode, on: boolean, done: boolean) => (
    <div key={n.id} className="rounded-lg border px-3 py-2 font-mono text-xs transition-all duration-300"
      style={{ borderColor: on ? (n.kind === 'llm' ? '#5FB3B7' : '#D2D9DE') : 'rgba(210,217,222,.18)', background: on ? (n.kind === 'llm' ? 'rgba(95,179,183,.22)' : 'rgba(210,217,222,.16)') : done ? 'rgba(255,255,255,.04)' : 'transparent', transform: on ? 'scale(1.04)' : 'none' }}>
      <span className={n.kind === 'llm' ? 'text-teal-2' : 'text-silver'}>{n.kind === 'llm' ? 'LLM' : 'code'}</span>
      <b className="ms-2 font-semibold text-paper">{n.id}</b>
    </div>
  );
  return (
    <div className="rounded-[22px] border border-silver/15 bg-[#0B1218] p-5 text-paper sm:p-6">
      <div className="flex flex-wrap gap-1.5" role="tablist" aria-label="Wasl agents">
        {WASL_AGENTS.map((g, i) => (
          <button key={g.name} role="tab" aria-selected={i === a} onClick={() => setA(i)}
            className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors ${i === a ? 'bg-teal-2 text-ink' : 'bg-white/5 text-silver hover:bg-white/10'}`}>{g.name} agent</button>
        ))}
      </div>
      <p className="mt-4 text-sm text-silver/85">{agent.what}</p>
      <div className="mt-4 flex flex-wrap items-center gap-2">
        {agent.nodes.map((n, i) => (
          <div key={i} className="flex items-center gap-2">
            {Array.isArray(n)
              ? <div className="grid gap-1.5">{n.map((x) => node(x, step === i, step > i))}</div>
              : node(n, step === i, step > i)}
            {i < agent.nodes.length - 1 && <span className="text-silver/40">→</span>}
          </div>
        ))}
        <span className="text-silver/40">→</span>
        <span className={`rounded-lg px-3 py-2 font-mono text-xs font-semibold transition-colors ${step >= flat ? 'bg-teal-2 text-ink' : 'border border-silver/18 text-silver/60'}`}>END</span>
      </div>
      {agent.loop && <p className="mt-3 font-mono text-[.72rem] text-silver/60">↺ {agent.loop}</p>}
      <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
        <span className="flex gap-3 font-mono text-[.7rem] text-silver/70"><span><b className="text-teal-2">■</b> LLM</span><span><b className="text-silver">■</b> deterministic code</span></span>
        <button onClick={() => setStep(0)} className="rounded-full bg-paper px-4 py-1.5 text-sm font-semibold text-ink transition-transform hover:-translate-y-0.5">Run the agent</button>
      </div>
      <p className="mt-3 text-xs text-silver/55">Node names are the real ones from backend/app/ai/workflows.</p>
    </div>
  );
}
