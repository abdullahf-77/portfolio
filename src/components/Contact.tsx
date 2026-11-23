import { useState } from 'react';
import { Check, Copy, Phone } from 'lucide-react';
import { profile } from '../content/profile';
import { GitHubIcon, LinkedInIcon, Reveal } from './ui';

export default function Contact() {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try { await navigator.clipboard.writeText(profile.email); setCopied(true); setTimeout(() => setCopied(false), 1800); } catch { /* clipboard blocked: the mailto link still works */ }
  };
  return (
    <>
      <section id="contact" data-tone="dark" className="blueprint overflow-hidden pb-20 pt-28 text-paper">
        <div className="wrap grid items-center gap-14 lg:grid-cols-[1.3fr_1fr]">
          <Reveal>
            <span className="kick !text-teal-2">let’s build something</span>
            <h2 className="h-display mt-1 text-[clamp(3.4rem,9vw,7rem)] !leading-[.9]">Say hi.</h2>
            <p className="mt-4 max-w-[520px] text-lg text-silver">
              Open to AI engineering roles, research collaborations and agentic or generative AI projects. Reach me by phone, email or LinkedIn.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3.5">
              <a href={`mailto:${profile.email}`} className="border-b-2 border-teal-2 font-display text-[clamp(1.2rem,3vw,1.9rem)] font-bold no-underline">{profile.email}</a>
              <button onClick={copy} className="inline-flex items-center gap-1.5 rounded-full border border-paper/60 px-4 py-1.5 text-sm hover:bg-paper/10">
                {copied ? <><Check size={14} /> Copied</> : <><Copy size={14} /> Copy</>}
              </button>
            </div>
            <a href={`tel:${profile.phone.tel}`} className="mt-5 inline-flex items-center gap-2.5 font-display text-[clamp(1.1rem,2.4vw,1.5rem)] font-bold no-underline hover:text-teal-2" dir="ltr">
              <Phone size={20} className="text-teal-2" /> {profile.phone.display}
            </a>
            <div className="mt-7 flex flex-wrap gap-6 font-semibold">
              <a href={profile.links.linkedin} target="_blank" rel="noreferrer" className="ulink inline-flex items-center gap-2"><LinkedInIcon /> LinkedIn</a>
              <a href={profile.links.github} target="_blank" rel="noreferrer" className="ulink inline-flex items-center gap-2"><GitHubIcon /> GitHub</a>
            </div>
          </Reveal>

          <Reveal delay={0.15}>
            <aside className="spec relative mx-auto max-w-[380px] rounded-sm px-7 pb-6 pt-9 font-mono text-[.82rem]" aria-label="Spec sheet">
              <p className="text-center text-[.7rem] font-semibold tracking-[.3em] text-muted">SPEC SHEET · REV 2026.11</p>
              <h3 className="mt-2 text-center font-display text-3xl font-extrabold tracking-tight">AI Engineer</h3>
              <p className="text-center font-hand text-xl font-bold text-teal">model: {profile.first} {profile.last}</p>
              <dl className="mt-4 border-t-2 border-ink">
                {[
                  ['runtime', 'SDAIA · ICAIRE, Riyadh'],
                  ['trained on', 'B. AI, UQU · GPA 3.86'],
                  ['capabilities', 'agents · RAG · LLM apps · CV'],
                  ['guardrails', 'cites sources, no invented numbers'],
                  ['status', 'available for collaboration'],
                ].map(([k, v]) => (
                  <div key={k} className="grid grid-cols-[96px_1fr] gap-3 border-b border-dashed border-ink/25 py-2">
                    <dt className="text-muted">{k}</dt><dd className="m-0 font-semibold">{v}</dd>
                  </div>
                ))}
              </dl>
              <p className="mt-4 text-center text-[.68rem] leading-snug text-muted">Handle with curiosity. Ships with documentation.</p>
            </aside>
          </Reveal>
        </div>
      </section>
      <footer className="bg-[#0A1016] py-6 text-sm text-silver/60">
        <div className="wrap flex flex-wrap justify-between gap-3">
          <span>Designed &amp; built by {profile.name} · © {new Date().getFullYear()}</span>
          <a href="#top" className="no-underline hover:text-paper">Back to top ↑</a>
        </div>
      </footer>
    </>
  );
}
