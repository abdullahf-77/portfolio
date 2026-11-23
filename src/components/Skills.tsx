import { motion } from 'motion/react';
import { skillGroups } from '../content/skills';
import { SectionHead } from './ui';

const COLORS = ['#287E83', '#1C303B', '#3E8E9E', '#101820', '#5B7C8D', '#287E83', '#1C303B'];

export default function Skills() {
  return (
    <section id="skills" data-tone="light" className="graph-paper pb-24">
      <SectionHead kick="the toolkit" title={<>Skills, tagged<br />and hung.</>}>
        Seven groups, each one backed by a repo, a certificate or my CV. Scroll the rail sideways →
      </SectionHead>
      <div className="runway-floor">
        <div className="runway wrap !w-full lg:!px-[max(16px,calc((100vw_-_1180px)_/_2))]" tabIndex={0} aria-label="Skill groups, scrollable">
          {skillGroups.map((g, i) => (
            <motion.article
              key={g.no}
              className="tagcard"
              style={{ ['--c' as string]: COLORS[i] }}
              initial={{ rotate: -8, opacity: 0, y: -20 }}
              whileInView={{ rotate: 0, opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ type: 'spring', stiffness: 120, damping: 11, delay: i * 0.07 }}
            >
              <p className="font-mono text-[.68rem] font-semibold uppercase tracking-[.3em]" style={{ color: COLORS[i] }}>Module {g.no}</p>
              <h3 className="mt-1.5 mb-3 border-b border-dashed border-[var(--line)] pb-3 font-display text-[1.4rem] font-extrabold leading-tight tracking-tight">{g.title}</h3>
              <ul className="m-0 flex list-none flex-wrap gap-1.5 p-0">
                {g.items.map((s) => (
                  <li key={s} className="rounded-full border px-2.5 py-1 text-[.8rem] font-semibold" style={{ borderColor: `${COLORS[i]}55`, background: `${COLORS[i]}12` }}>{s}</li>
                ))}
              </ul>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
