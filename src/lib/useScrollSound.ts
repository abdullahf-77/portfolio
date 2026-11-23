import { useEffect } from 'react';
import { chime, click, tick, unlock } from './sound';

/** Ticks while scrolling (one per ~110px), a chime when a new section scrolls in, clicks on buttons and tabs. */
export function useScrollSound() {
  useEffect(() => {
    const onGesture = () => unlock();
    const onClick = (e: MouseEvent) => {
      const el = (e.target as HTMLElement).closest('button, [role="tab"], a');
      if (el && !el.hasAttribute('data-silent')) click();
    };
    window.addEventListener('pointerdown', onGesture, { passive: true });
    window.addEventListener('keydown', onGesture);
    window.addEventListener('touchstart', onGesture, { passive: true });
    window.addEventListener('click', onClick);

    let last = window.scrollY;
    let acc = 0;
    let lastTick = 0;
    const onScroll = () => {
      const y = window.scrollY;
      const d = y - last;
      last = y;
      acc += d;
      const now = performance.now();
      const notches = Math.floor(Math.abs(acc) / 110);
      if (notches > 0 && now - lastTick > 45) {
        const dir = acc > 0 ? 1 : -1;
        // keep the remainder; play up to 3 ticks, staggered, for fast flicks
        acc -= dir * notches * 110;
        for (let i = 0; i < Math.min(notches, 3); i++) setTimeout(() => tick(dir as 1 | -1), i * 45);
        lastTick = now;
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });

    // chime once per section as it enters, skipping the first paint
    let ready = false;
    const seen = new Set<Element>();
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (!en.isIntersecting) return;
        if (ready && !seen.has(en.target)) chime();
        seen.add(en.target);
      });
    }, { rootMargin: '-45% 0px -45% 0px' });
    document.querySelectorAll('main > section, main > div > section, #work > section').forEach((s) => io.observe(s));
    const t = setTimeout(() => { ready = true; }, 800);

    return () => {
      window.removeEventListener('pointerdown', onGesture);
      window.removeEventListener('keydown', onGesture);
      window.removeEventListener('touchstart', onGesture);
      window.removeEventListener('click', onClick);
      window.removeEventListener('scroll', onScroll);
      io.disconnect();
      clearTimeout(t);
    };
  }, []);
}
