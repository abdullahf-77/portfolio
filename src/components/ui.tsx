import { motion, useReducedMotion } from 'motion/react';
import type { ReactNode } from 'react';
import { orgs } from '../content/orgs';

export const asset = (p: string) => `${import.meta.env.BASE_URL}assets/${p}`;

export function Reveal({ children, delay = 0, className = '', y = 26 }: { children: ReactNode; delay?: number; className?: string; y?: number }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -10% 0px' }}
      transition={{ duration: 0.8, delay, ease: [0.2, 0.8, 0.2, 1] }}
    >
      {children}
    </motion.div>
  );
}

/** A hand-drawn underline that draws itself when it scrolls into view. */
export function Underline({ className = 'text-teal' }: { className?: string }) {
  return (
    <svg className={`block w-[min(320px,70%)] mt-1 ${className}`} viewBox="0 0 320 14" fill="none" aria-hidden="true">
      <motion.path
        d="M3 9 C 60 3, 120 12, 180 6 S 280 4, 317 8"
        stroke="currentColor" strokeWidth="2.6" strokeLinecap="round"
        initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }}
        transition={{ duration: 1.4, ease: [0.6, 0, 0.3, 1] }}
      />
    </svg>
  );
}

export function SectionHead({ kick, title, children, dark = false, id }: { kick: string; title: ReactNode; children?: ReactNode; dark?: boolean; id?: string }) {
  return (
    <header className="sh wrap" id={id}>
      <Reveal>
        <span className={`kick ${dark ? '!text-teal-2' : ''}`}>{kick}</span>
        <h2>{title}</h2>
        <Underline className={dark ? 'text-teal-2' : 'text-teal'} />
        {children && <p className={dark ? '!text-silver/80' : ''}>{children}</p>}
      </Reveal>
    </header>
  );
}

export function OrgLogo({ id, dark = false, className = 'h-8' }: { id: string; dark?: boolean; className?: string }) {
  const o = orgs[id];
  if (!o) return null;
  const src = dark && o.logoDark ? o.logoDark : o.logo;
  if (!src) {
    return (
      <span className={`inline-grid place-items-center rounded-md border px-2 font-mono text-[.7rem] font-semibold tracking-wider ${dark ? 'border-silver/30 text-silver' : 'border-ink/20 text-ink-2'} ${className}`} title={o.name}>
        {o.short}
      </span>
    );
  }
  if (o.mono) {
    // single-colour mark: paint it with the current text colour via a mask
    return (
      <span
        role="img" aria-label={o.name}
        className={`inline-block ${dark ? 'bg-silver' : o.id === 'uqu' ? 'bg-teal' : 'bg-ink'} ${className}`}
        style={{ aspectRatio: o.monoAspect ?? '2 / 3', mask: `url(${asset(src)}) center / contain no-repeat`, WebkitMask: `url(${asset(src)}) center / contain no-repeat` }}
      />
    );
  }
  return <img src={asset(src)} alt={o.name} className={`w-auto object-contain ${className}`} loading="lazy" />;
}

export const GitHubIcon = ({ size = 18 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 .5a11.5 11.5 0 0 0-3.64 22.41c.58.1.79-.25.79-.56v-2c-3.2.7-3.88-1.37-3.88-1.37-.53-1.33-1.28-1.69-1.28-1.69-1.05-.71.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.17 1.18a11 11 0 0 1 5.77 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.84 1.19 3.1 0 4.42-2.7 5.39-5.26 5.68.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.5 11.5 0 0 0 12 .5Z" />
  </svg>
);

export const LinkedInIcon = ({ size = 18 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13ZM7.12 20.45H3.56V9h3.56v11.45ZM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0Z" />
  </svg>
);
