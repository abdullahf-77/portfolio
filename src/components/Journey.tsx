import { useEffect, useMemo, useRef, useState } from 'react';
import { ExternalLink } from 'lucide-react';
import { journey } from '../content/journey';
import { OrgLogo, SectionHead } from './ui';

const KW = /\b(for|in|with|as|while|True|False|if|and|import|from|def|return)\b/;

/** Tiny Python highlighter: enough for the snippets we type. */
function highlight(src: string) {
  const out: React.ReactNode[] = [];
  const re = /(#[^\n]*)|("[^"\n]*"?)|(\b\d+(?:\.\d+)?\b)|(\b[A-Za-z_][\w.]*(?=\())|(\b\w+\b)|([^\w"#]+)/g;
  let m: RegExpExecArray | null;
  let i = 0;
  while ((m = re.exec(src))) {
    const [t, c, s, n, f, w] = m;
    const k = i++;
    if (c) out.push(<span key={k} className="c">{t}</span>);
    else if (s) out.push(<span key={k} className="s">{t}</span>);
    else if (n) out.push(<span key={k} className="n">{t}</span>);
    else if (f) out.push(<span key={k} className="f">{t}</span>);
    else if (w && KW.test(w)) out.push(<span key={k} className="k">{t}</span>);
    else out.push(t);
  }
  return out;
}

const KIND: Record<string, string> = {
  education: 'Education', learning: 'Learning', project: 'Project', training: 'Training',
  community: 'Community', achievement: 'Achievement', next: 'Next',
};

export default function Journey() {
  const [active, setActive] = useState(0);
  const [typed, setTyped] = useState('');
  const items = useRef<(HTMLLIElement | null)[]>([]);

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(Number((e.target as HTMLElement).dataset.i))),
      { rootMargin: '-45% 0px -45% 0px' },
    );
    items.current.forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, []);

  const ch = journey[active];
  const full = useMemo(() => `# ${ch.when} · ${ch.title.replace(/\.$/, '')}\n${ch.code}`, [ch]);

  useEffect(() => {
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) { setTyped(full); return; }
    let n = 0;
    setTyped('');
    const id = setInterval(() => {
      n += 2;
      setTyped(full.slice(0, n));
      if (n >= full.length) clearInterval(id);
    }, 18);
    return () => clearInterval(id);
  }, [full]);

  return (
    <section id="journey" data-tone="light" className="graph-paper-2 pb-28">
      <SectionHead kick="my journey, in code" title={<>From first model<br />to agentic systems.</>}>
        Every step below is real and dated, with the evidence linked where it exists. Read on, and the editor writes the code for each chapter.
      </SectionHead>

      <div className="wrap grid items-start gap-10 lg:grid-cols-[1.05fr_1fr] lg:gap-16">
        <div className="sticky top-[76px] z-10 min-w-0 lg:top-[100px]">
          <figure className="editor m-0">
            <figcaption className="flex items-center gap-1.5 bg-[#15212A] px-3.5 py-2.5 font-mono text-xs text-silver/70">
              <i className="size-2.5 rounded-full bg-teal" /><i className="size-2.5 rounded-full bg-silver/60" /><i className="size-2.5 rounded-full bg-slate" />
              <span className="ms-2.5">journey.py</span>
              <em className="ms-auto not-italic opacity-60">{active + 1} / {journey.length}</em>
            </figcaption>
            <pre aria-live="off"><code>{highlight(typed)}</code><span className="caret" /></pre>
            <div className="flex flex-wrap items-center gap-2 border-t border-silver/10 px-5 py-3">
              {ch.orgs.length ? ch.orgs.map((o) => (
                <span key={o} className="rounded-md bg-paper px-2 py-1"><OrgLogo id={o} className="h-6 max-w-[120px]" /></span>
              )) : <span className="font-mono text-xs text-silver/50">self-directed</span>}
            </div>
          </figure>
          <p className="note mt-3 hidden lg:block">↑ it types itself as you read</p>
        </div>

        <ol className="m-0 min-w-0 list-none p-0">
          {journey.map((c, i) => (
            <li
              key={c.id}
              ref={(el) => { items.current[i] = el; }}
              data-i={i}
              className={`border-b border-dashed border-[var(--line)] py-14 transition-opacity duration-500 first:pt-2 lg:py-[70px] ${i === active ? 'opacity-100' : 'opacity-35'}`}
            >
              <div className="flex flex-wrap items-baseline gap-x-3">
                <small className="font-hand text-[1.35rem] font-bold text-teal">{c.when}</small>
                <span className="rounded-full border border-[var(--line)] px-2 py-0.5 text-[.68rem] font-semibold uppercase tracking-wider text-muted">{KIND[c.kind]}</span>
              </div>
              <h3 className="h-display mt-1 mb-2.5 text-[clamp(1.6rem,3vw,2.2rem)] !leading-[1.05]">{c.title}</h3>
              <p className="m-0 text-[1.05rem] text-ink-2">{c.body}</p>
              {c.orgs.length > 0 && (
                <div className="mt-4 flex flex-wrap items-center gap-4 lg:hidden">
                  {c.orgs.map((o) => <OrgLogo key={o} id={o} className="h-7 max-w-[120px]" />)}
                </div>
              )}
              {c.evidence && (
                <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm">
                  {c.evidence.map((e) => (
                    <a key={e.href} href={e.href} target="_blank" rel="noreferrer" className="ulink inline-flex items-center gap-1">{e.label} <ExternalLink size={13} /></a>
                  ))}
                </div>
              )}
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
