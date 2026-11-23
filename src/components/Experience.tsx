import { FileCheck2 } from 'lucide-react';
import { roles } from '../content/experience';
import { OrgLogo, Reveal, SectionHead, asset } from './ui';

export default function Experience() {
  const featured = roles.filter((r) => r.type !== 'Academic leadership');
  const leadership = roles.filter((r) => r.type === 'Academic leadership');
  return (
    <section id="experience" data-tone="dark" className="blueprint pb-28 text-paper">
      <SectionHead dark kick="where I work & lead" title={<>Experience &amp;<br />leadership.</>}>
        Cooperative training, volunteering and academic leadership, each labelled for what it is.
      </SectionHead>

      <div className="wrap grid gap-6 lg:grid-cols-[1.25fr_1fr]">
        {featured.map((r, i) => (
          <Reveal key={r.title} delay={i * 0.08}>
            <article className="relative h-full overflow-hidden rounded-2xl border border-silver/12 bg-slate/60 p-7 sm:p-9">
              <div className="flex min-h-14 flex-wrap items-center gap-3">
                <span className="rounded-lg bg-paper px-3 py-2"><OrgLogo id={r.org} className="h-10 max-w-[180px]" /></span>
                {r.coOrg && <span className="rounded-lg bg-paper px-3 py-2"><OrgLogo id={r.coOrg} className="h-8 max-w-[160px]" /></span>}
              </div>
              <p className="mt-6 text-xs font-semibold uppercase tracking-[.14em] text-teal-2">{r.type} · {r.when}</p>
              <h3 className="h-display mt-2 text-[clamp(1.6rem,2.6vw,2.1rem)] !leading-[1.05]">{r.title}</h3>
              <p className="mt-1.5 text-sm text-silver/75">{r.orgLine}{r.place ? ` · ${r.place}` : ''}</p>
              <ul className="mt-5 grid list-none gap-2.5 p-0 text-[.98rem] text-silver">
                {r.points.map((p) => (
                  <li key={p.slice(0, 24)} className="relative ps-5 before:absolute before:left-0 before:top-[.65em] before:h-[2px] before:w-2.5 before:bg-teal-2">{p}</li>
                ))}
              </ul>
              {r.evidence && (
                <a href={asset(r.evidence.href)} target="_blank" rel="noreferrer" className="ulink mt-6 inline-flex items-center gap-2 text-sm text-paper">
                  <FileCheck2 size={15} /> {r.evidence.label}
                </a>
              )}
            </article>
          </Reveal>
        ))}
      </div>

      {leadership.map((r) => (
        <Reveal key={r.title} className="wrap mt-6">
          <article className="grid items-center gap-5 rounded-2xl border border-silver/12 p-6 sm:grid-cols-[auto_1fr_auto] sm:gap-8 sm:p-7">
            <span className="grid size-16 place-items-center rounded-xl bg-paper/95"><OrgLogo id={r.org} className="h-11" /></span>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[.14em] text-teal-2">{r.type}</p>
              <h3 className="mt-1 font-display text-2xl font-bold leading-tight">{r.title}</h3>
              <p className="mt-1 text-sm text-silver/75">{r.orgLine}</p>
            </div>
            <p className="m-0 max-w-md text-[.98rem] text-silver">{r.points.join(' ')}</p>
          </article>
        </Reveal>
      ))}
    </section>
  );
}
