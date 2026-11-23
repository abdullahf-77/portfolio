// Tiny synthesized sound kit (Web Audio, no files). Browsers only allow audio after a user
// gesture, so the context is created on the first click / key / touch.

const KEY = 'aa-sound';
let ctx: AudioContext | null = null;
let master: GainNode | null = null;
let enabled = true;
const listeners = new Set<(on: boolean) => void>();

try { enabled = localStorage.getItem(KEY) !== 'off'; } catch { /* storage blocked: keep default */ }

function ensure() {
  if (!enabled) return null;
  if (!ctx) {
    const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
    master = ctx.createGain();
    master.gain.value = 0.55;
    master.connect(ctx.destination);
  }
  if (ctx.state === 'suspended') void ctx.resume();
  return ctx.state === 'running' ? ctx : null;
}

/** Call from a user gesture to unlock audio. */
export function unlock() { ensure(); }

function blip(freq: number, dur: number, gain: number, type: OscillatorType = 'sine', when = 0, slide?: number) {
  const c = ensure();
  if (!c || !master) return;
  const t = c.currentTime + when;
  const o = c.createOscillator();
  const g = c.createGain();
  o.type = type;
  o.frequency.setValueAtTime(freq, t);
  if (slide) o.frequency.exponentialRampToValueAtTime(slide, t + dur);
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(gain, t + 0.008);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  o.connect(g).connect(master);
  o.start(t);
  o.stop(t + dur + 0.02);
}

/** A soft mechanical tick, like a scroll wheel notch. Higher going up, lower going down. */
export function tick(dir: 1 | -1) {
  blip(dir > 0 ? 1250 : 1650, 0.035, 0.05, 'triangle');
}

/** Two-note chime when a new section arrives. */
export function chime() {
  blip(659.25, 0.32, 0.06, 'sine');
  blip(987.77, 0.42, 0.045, 'sine', 0.09);
}

/** Short UI click for tabs and buttons. */
export function click() {
  blip(880, 0.05, 0.05, 'square', 0, 620);
}

export const sound = {
  get on() { return enabled; },
  set(on: boolean) {
    enabled = on;
    try { localStorage.setItem(KEY, on ? 'on' : 'off'); } catch { /* ignore */ }
    if (on) { ensure(); chime(); } else if (ctx && ctx.state === 'running') void ctx.suspend();
    listeners.forEach((l) => l(on));
  },
  subscribe(fn: (on: boolean) => void) { listeners.add(fn); return () => { listeners.delete(fn); }; },
};
