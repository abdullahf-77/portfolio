import { useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';
import { profile } from '../content/profile';
import { GitHubIcon, LinkedInIcon } from './ui';

const links = [
  { href: '#journey', label: 'Journey' },
  { href: '#experience', label: 'Experience' },
  { href: '#work', label: 'Work' },
  { href: '#events', label: 'Events' },
  { href: '#skills', label: 'Skills' },
  { href: '#certificates', label: 'Certificates' },
];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [inverted, setInverted] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 30);
      // invert the nav while it sits over a dark section
      const probe = document.elementsFromPoint(window.innerWidth / 2, 34).find((el) => (el as HTMLElement).dataset?.tone);
      setInverted((probe as HTMLElement | undefined)?.dataset.tone === 'dark');
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const base = inverted ? 'text-paper' : 'text-ink';
  const bg = scrolled ? (inverted ? 'bg-ink/70 shadow-[0_1px_0_rgba(255,255,255,.08)]' : 'bg-paper/85 shadow-[0_1px_0_var(--line)]') : '';

  return (
    <nav className={`fixed inset-x-0 top-0 z-50 backdrop-blur-md transition-colors duration-300 ${base} ${bg}`} aria-label="Main">
      <div className="wrap flex h-16 items-center gap-6">
        <a href="#top" className="font-display text-base font-bold tracking-tight no-underline">
          {profile.first} {profile.last}
        </a>
        <ul className="ms-auto hidden gap-6 text-sm md:flex">
          {links.map((l) => (
            <li key={l.href}><a href={l.href} className="no-underline opacity-75 transition-opacity hover:opacity-100">{l.label}</a></li>
          ))}
        </ul>
        <div className="ms-auto flex items-center gap-3 md:ms-0">
          <a href={profile.links.github} target="_blank" rel="noreferrer" aria-label="GitHub" className="opacity-80 hover:opacity-100"><GitHubIcon /></a>
          <a href={profile.links.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn" className="opacity-80 hover:opacity-100"><LinkedInIcon /></a>
          <a href="#contact" className={`hidden rounded-full px-4 py-2 text-sm font-semibold no-underline sm:inline-block ${inverted ? 'bg-paper text-ink' : 'bg-ink text-paper'}`}>Say hi</a>
          <button className="md:hidden" onClick={() => setOpen(!open)} aria-expanded={open} aria-label="Menu">
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>
      {open && (
        <ul className="wrap grid gap-1 pb-4 md:hidden">
          {[...links, { href: '#contact', label: 'Contact' }].map((l) => (
            <li key={l.href}><a href={l.href} onClick={() => setOpen(false)} className="block py-2 text-lg font-semibold no-underline">{l.label}</a></li>
          ))}
        </ul>
      )}
    </nav>
  );
}
