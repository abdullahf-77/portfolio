import { motion } from 'motion/react';
import { education } from '../content/profile';
import { OrgLogo, Reveal } from './ui';

export default function Education() {
  const pct = (parseFloat(education.gpa) / parseFloat(education.gpaOf)) * 100;
  const R = 70, C = 2 * Math.PI * R;
  return (
    <section id="education" data-tone="light" className="graph-paper-2 py-24">
      <div className="wrap grid items-center gap-12 lg:grid-cols-[1.3fr_1fr]">
        <Reveal>
          <span className="kick">education</span>
          <div className="mt-3 flex items-center gap-5">
            <OrgLogo id="uqu" className="h-16" />
            <div>
              <h2 className="h-display text-[clamp(2.2rem,5vw,3.8rem)]">{education.school}</h2>
              <p className="mt-2 text-sm font-semibold text-teal">{education.place} · {education.years}</p>
            </div>
          </div>
          <p className="mt-6 font-display text-2xl font-bold">{education.degree}</p>
          <ul className="mt-4 grid list-none gap-2 p-0 text-ink-2">
            {education.notes.map((n) => <li key={n} className="relative ps-5 before:absolute before:left-0 before:top-[.7em] before:h-[2px] before:w-2.5 before:bg-teal">{n}</li>)}
          </ul>
        </Reveal>
        <Reveal delay={0.1} className="justify-self-center">
          <figure className="relative m-0 grid place-items-center">
            <svg viewBox="0 0 180 180" className="w-[min(280px,70vw)] -rotate-90" aria-hidden="true">
              <circle cx="90" cy="90" r={R} fill="none" stroke="#D2D9DE" strokeWidth="10" />
              <motion.circle cx="90" cy="90" r={R} fill="none" stroke="#287E83" strokeWidth="10" strokeLinecap="round"
                strokeDasharray={C} initial={{ strokeDashoffset: C }} whileInView={{ strokeDashoffset: C * (1 - pct / 100) }}
                viewport={{ once: true }} transition={{ duration: 1.8, ease: [0.6, 0, 0.3, 1] }} />
            </svg>
            <figcaption className="absolute text-center">
              <b className="h-display block text-6xl">{education.gpa}</b>
              <span className="text-sm font-semibold text-muted">GPA out of {education.gpaOf}</span>
            </figcaption>
          </figure>
        </Reveal>
      </div>
    </section>
  );
}
