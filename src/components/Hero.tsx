import { useEffect, useRef, useState } from 'react';
import { ArrowDown } from 'lucide-react';
import { profile } from '../content/profile';
import { asset } from './ui';

/**
 * A sketched agent graph. The "router" node leans toward the cursor and the
 * nearest agent lights up, like a planner picking which tool to call.
 */
function AgentDoodle() {
  const ref = useRef<SVGSVGElement>(null);
  const [p, setP] = useState({ x: 0, y: 0 });
  const [hot, setHot] = useState(0);
  const agents = [
    { x: 30, y: 30, l: 'rag' },
    { x: 150, y: 24, l: 'tools' },
    { x: 26, y: 120, l: 'vision' },
    { x: 154, y: 124, l: 'eval' },
  ];
  useEffect(() => {
    const move = (e: PointerEvent) => {
      const r = ref.current?.getBoundingClientRect();
      if (!r) return;
      const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
      const dx = e.clientX - cx, dy = e.clientY - cy;
      const d = Math.hypot(dx, dy) || 1;
      const k = Math.min(14, d / 18);
      setP({ x: (dx / d) * k, y: (dy / d) * k });
      // which quadrant is the cursor in?
      setHot(dx < 0 ? (dy < 0 ? 0 : 2) : dy < 0 ? 1 : 3);
    };
    window.addEventListener('pointermove', move);
    return () => window.removeEventListener('pointermove', move);
  }, []);
  return (
    <svg ref={ref} viewBox="0 0 180 150" className="dd w-full overflow-visible text-ink" aria-hidden="true">
      {agents.map((a, i) => (
        <g key={a.l}>
          <line x1={90 + p.x} y1={75 + p.y} x2={a.x} y2={a.y} strokeDasharray={i === hot ? '0' : '4 6'} className={i === hot ? 'text-teal' : ''} style={{ stroke: i === hot ? 'var(--color-teal)' : undefined, transition: 'stroke .3s' }} />
          <circle cx={a.x} cy={a.y} r="11" style={{ fill: i === hot ? 'var(--color-teal)' : 'var(--color-paper)', transition: 'fill .3s' }} />
          <text x={a.x} y={a.y + (a.y < 75 ? -18 : 28)} textAnchor="middle" style={{ font: '700 15px var(--font-hand)', fill: 'var(--color-ink-2)', stroke: 'none' }}>{a.l}</text>
        </g>
      ))}
      <rect x={72 + p.x} y={60 + p.y} width="36" height="30" rx="8" style={{ fill: 'var(--color-ink)', transition: 'x .12s linear, y .12s linear' }} />
      <circle cx={84 + p.x * 1.2} cy={75 + p.y * 1.2} r="2.6" style={{ fill: 'var(--color-teal-2)', stroke: 'none' }} />
      <circle cx={96 + p.x * 1.2} cy={75 + p.y * 1.2} r="2.6" style={{ fill: 'var(--color-teal-2)', stroke: 'none' }} />
    </svg>
  );
}

export default function Hero() {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const t = requestAnimationFrame(() => setReady(true));
    return () => cancelAnimationFrame(t);
  }, []);

  return (
    <section id="top" data-tone="light" className={`graph-paper relative flex min-h-screen items-center pb-16 pt-28 ${ready ? 'ready' : ''}`}>
      <div aria-hidden="true" className="pointer-events-none absolute inset-0" style={{ background: 'radial-gradient(circle at 85% 18%, rgba(40,126,131,.14), transparent 42%)' }} />
      <div className="wrap relative">
        <p className="mb-3 text-sm font-semibold tracking-wide text-teal">{profile.kicker}</p>

        <div className="relative">
          {profile.photo ? (
            <figure className="m-0 mb-4 ml-auto w-[120px] rotate-[3deg] sm:absolute sm:-top-[10%] sm:right-[1%] sm:mb-0 sm:w-[clamp(150px,19vw,250px)]">
              <div className="relative bg-white p-2 pb-3 shadow-[0_18px_40px_rgba(16,24,32,.18)] sm:p-2.5 sm:pb-4">
                {/* a strip of tape holding the print */}
                <span aria-hidden="true" className="absolute -top-3 left-1/2 h-6 w-20 -translate-x-1/2 -rotate-3 bg-silver/70 shadow-sm" />
                <img src={asset(profile.photo)} alt={`Portrait of ${profile.name}`} width={640} height={640} className="aspect-square w-full object-cover" />
              </div>
              <figcaption className="note mt-2 hidden -rotate-[5deg] text-center lg:block">that’s me, usually mid-debug ↑</figcaption>
            </figure>
          ) : (
            <div className="absolute -top-[4%] right-[1%] hidden w-[clamp(120px,15vw,200px)] sm:block"><AgentDoodle /></div>
          )}
          <h1 className="sr-only">{profile.name}: {profile.headline}</h1>
          <svg className="name block h-auto w-[min(100%,1100px)] overflow-visible" viewBox="0 0 1100 380" aria-hidden="true">
            <text x="0" y="160">{profile.first}</text>
            <text x="0" y="340" className="accent">{profile.last}<tspan style={{ fill: 'var(--color-ink)' }}>.</tspan></text>
          </svg>
          <div className="hatch" />

          {!profile.photo && (
            <div className="note absolute right-[-1%] top-[46%] hidden w-[230px] rotate-[4deg] opacity-0 transition-opacity delay-[2600ms] duration-700 lg:block [.ready_&]:opacity-100">
              <svg viewBox="0 0 60 30" className="dd mb-1 ml-8 w-14" aria-hidden="true"><path d="M50 26 C 40 10, 22 6, 6 6 M6 6 l9 -5 M6 6 l8 6" /></svg>
              I sketched an agent graph. It routes to the agent nearest your cursor. That’s my day job.
            </div>
          )}
        </div>

        <p className="mt-6 max-w-[640px] text-[clamp(1.1rem,1.8vw,1.35rem)] leading-normal text-ink-2">
          <b className="font-semibold text-ink">{profile.lede.lead}</b> {profile.lede.rest}
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <a href="#journey" className="btn btn-solid">Follow my journey <ArrowDown size={16} /></a>
          <a href="#work" className="btn">See what I built</a>
        </div>
      </div>
    </section>
  );
}
