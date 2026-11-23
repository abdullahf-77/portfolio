import { motion, useInView, useMotionValueEvent, useReducedMotion, useScroll, useTransform } from 'motion/react';
import { useRef, useState } from 'react';
import { profile } from '../content/profile';
import { stops } from '../content/journey';
import { OrgLogo, Reveal, Underline } from './ui';
import { MAKKAH, RIYADH, SAUDI_PATH } from '../content/saudiMap';

const ROUTE = `M${MAKKAH.x} ${MAKKAH.y} Q 232 236, ${RIYADH.x} ${RIYADH.y}`;
const HAND = { font: '700 25px var(--font-hand)', fill: 'var(--color-ink)', stroke: 'none' } as const;
const HAND_SUB = { font: '600 17px var(--font-hand)', fill: 'var(--color-teal)', stroke: 'none' } as const;

/** Saudi Arabia, sketched: the outline draws itself, then a plane flies the route as you scroll. */
function RouteSketch() {
  const ref = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const reduce = useReducedMotion();
  const inView = useInView(ref, { once: true, amount: 0.3 });
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 75%', 'center 35%'] });
  const [plane, setPlane] = useState({ x: MAKKAH.x, y: MAKKAH.y - 14, a: -30 });
  const [arrived, setArrived] = useState(false);
  const progress = useTransform(scrollYProgress, (v) => (reduce ? 1 : Math.min(1, Math.max(0, v))));

  useMotionValueEvent(progress, 'change', (v) => {
    const p = pathRef.current;
    if (!p) return;
    const L = p.getTotalLength();
    const at = p.getPointAtLength(L * v);
    const ahead = p.getPointAtLength(Math.min(L, L * v + 1));
    const behind = p.getPointAtLength(Math.max(0, L * v - 1));
    setPlane({ x: at.x, y: at.y - 14, a: Math.atan2(ahead.y - behind.y, ahead.x - behind.x) * 57.3 });
    setArrived(v > 0.97);
  });

  return (
    <div ref={ref} className="relative">
      <svg viewBox="0 0 600 500" className="w-full overflow-visible" role="img" aria-label="A hand-drawn map of Saudi Arabia with the route from Makkah to Riyadh">
        <defs>
          <pattern id="hatchMap" width="9" height="9" patternUnits="userSpaceOnUse" patternTransform="rotate(-35)">
            <line x1="0" y1="0" x2="0" y2="9" stroke="#A9C9CB" strokeWidth="1.2" />
          </pattern>
        </defs>
        <motion.path d={SAUDI_PATH} fill="url(#hatchMap)" initial={{ opacity: 0 }} animate={{ opacity: inView ? 0.9 : 0 }} transition={{ duration: 1.2, delay: reduce ? 0 : 1.8 }} />
        <motion.path d={SAUDI_PATH} fill="none" stroke="var(--color-ink)" strokeWidth="1.6" strokeLinejoin="round"
          initial={{ pathLength: reduce ? 1 : 0 }} animate={{ pathLength: inView ? 1 : 0 }} transition={{ duration: 2.6, ease: [0.5, 0, 0.3, 1] }} />

        {/* the route: a dashed ghost, then the flown part */}
        <path d={ROUTE} fill="none" stroke="rgba(40,126,131,.3)" strokeWidth="2" strokeDasharray="3 7" strokeLinecap="round" />
        <motion.path ref={pathRef} d={ROUTE} fill="none" stroke="var(--color-teal)" strokeWidth="2.6" strokeLinecap="round" style={{ pathLength: progress }} />

        {/* pins */}
        <g>
          <circle cx={MAKKAH.x} cy={MAKKAH.y} r="7" fill="var(--color-teal)" />
          <circle cx={MAKKAH.x} cy={MAKKAH.y} r="14" fill="none" stroke="var(--color-ink)" strokeWidth="1.6" />
          <text x={MAKKAH.x - 24} y={MAKKAH.y + 40} textAnchor="middle" style={HAND}>Makkah</text>
          <text x={MAKKAH.x - 24} y={MAKKAH.y + 60} textAnchor="middle" style={HAND_SUB}>where I study</text>
        </g>
        <g>
          <circle cx={RIYADH.x} cy={RIYADH.y} r="7" style={{ fill: arrived ? 'var(--color-teal)' : '#A9C9CB', transition: 'fill .4s' }} />
          <circle cx={RIYADH.x} cy={RIYADH.y} r="14" fill="none" stroke="var(--color-ink)" strokeWidth="1.6" />
          <text x={RIYADH.x + 22} y={RIYADH.y - 26} textAnchor="start" style={HAND}>Riyadh</text>
          <text x={RIYADH.x + 22} y={RIYADH.y - 8} textAnchor="start" style={HAND_SUB}>where I train</text>
        </g>

        {/* the plane, nose along the route */}
        <g transform={`translate(${plane.x.toFixed(1)} ${plane.y.toFixed(1)}) rotate(${plane.a.toFixed(1)})`}>
          <path d="M14 0 L-4 -3 L-9 -12 L-13 -12 L-9 -3 L-14 -3 L-17 -7 L-19 -7 L-17 0 L-19 7 L-17 7 L-14 3 L-9 3 L-13 12 L-9 12 L-4 3 Z" fill="var(--color-ink)" />
        </g>
      </svg>
      <p className="note mt-1">Scroll, and the plane flies the route I took →</p>
    </div>
  );
}

export default function About() {
  return (
    <section id="about" data-tone="light" className="graph-paper pb-24 pt-24">
      <div className="wrap">
        <div className="grid items-center gap-12 lg:grid-cols-[1.2fr_1fr]">
          <Reveal className="min-w-0"><RouteSketch /></Reveal>
          <Reveal className="min-w-0" delay={0.1}>
            <span className="kick">about me</span>
            <h2 className="h-display mt-1 text-[clamp(2.6rem,6vw,4.6rem)]">From Makkah<br />to Riyadh.</h2>
            <Underline />
            <ol className="mt-7 grid list-none gap-5 p-0">
              {stops.map((s) => (
                <li key={s.n} className="flex gap-4">
                  <span className="grid size-9 flex-none place-items-center rounded-full border-2 border-ink font-hand text-xl font-bold">{s.n}</span>
                  <div>
                    <b className="font-display text-lg">{s.city}</b>
                    <p className="mt-0.5 text-[.95rem] text-ink-2">{s.text}</p>
                  </div>
                </li>
              ))}
            </ol>
          </Reveal>
        </div>

        <div className="mt-20 grid gap-10 lg:grid-cols-[1fr_1.1fr]">
          <Reveal>
            <p className="h-display text-[clamp(1.8rem,3.4vw,2.7rem)] !leading-[1.08]">
              I like the moment a model leaves the notebook and has to work for <span className="text-teal">real people</span>.
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="grid gap-4 text-[1.05rem] text-ink-2">
              {profile.about.map((p) => <p key={p.slice(0, 20)} className="m-0">{p}</p>)}
            </div>
            <dl className="mt-7 border-t border-ink">
              {profile.facts.map((f) => (
                <div key={f.k} className="grid grid-cols-[110px_1fr] gap-4 border-b border-[var(--line)] py-3 text-[.93rem]">
                  <dt className="font-semibold text-muted">{f.k}</dt>
                  <dd className="m-0">{f.v}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>

        <ul className="mt-20 grid list-none grid-cols-2 gap-6 p-0 sm:grid-cols-3 lg:grid-cols-5">
          {[
            { id: 'uqu', label: 'my university', r: '-3deg' },
            { id: 'sdaia', label: 'my training', r: '2deg' },
            { id: 'icaire', label: 'my desk', r: '-1.5deg' },
            { id: 'tuwaiq', label: 'my bootcamps', r: '3deg' },
            { id: 'pioneers', label: 'my volunteering', r: '-2deg' },
          ].map((s, i) => (
            <Reveal key={s.id} delay={i * 0.06}>
              <li className="sticker flex h-full flex-col items-center px-4 pb-3 pt-6 text-center" style={{ ['--r' as string]: s.r }}>
                <div className="grid h-14 place-items-center"><OrgLogo id={s.id} className="max-h-12 h-12 max-w-full" /></div>
                <small className="mt-2 font-hand text-lg font-semibold text-ink-2">{s.label}</small>
              </li>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
