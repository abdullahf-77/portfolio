/* Scroll layout helper. Measures the head slot and hands the split head
   (js/split-head.js) its geometry, keeps the intro text beside the pinned head,
   and highlights cards as they scroll in. Layout is remeasured after filtering,
   expanding cards, font loads and viewport changes. */
(() => {
  'use strict';
  const root = document.documentElement;
  const canvas = document.getElementById('neural');
  const ctx = canvas.getContext('2d');
  const slot = document.getElementById('headSlot');
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  let state, targets = [], queued = false, resizeTimer;
  const clamp = (n, a = 0, b = 1) => Math.max(a, Math.min(b, n));
  function box(el) {
    let x = 0, y = 0, n = el;
    while (n) { x += n.offsetLeft; y += n.offsetTop; n = n.offsetParent; }
    return { x, y, w: el.offsetWidth, h: el.offsetHeight };
  }
  function measure() {
    const vw = root.clientWidth, vh = innerHeight, mobile = vw < 1000;
    const w = mobile ? Math.min(280, vw * .72) : Math.min(430, vw * .34, vh * .59);
    const sr = box(slot);
    const cx = mobile ? vw / 2 : sr.x + sr.w / 2;
    const initialY = mobile ? 535 : Math.max(120, Math.min(160,(vh - w) * .3));
    const pin = mobile ? 82 : initialY;
    const start = mobile ? initialY - pin : 0;
    const land = sr.y + (mobile ? 0 : 12);
    const dpr = Math.min(devicePixelRatio || 1, 1.5);
    root.style.setProperty('--hw', w + 'px');
    root.classList.toggle('motion-reduced', motion.matches);
    const split = window.SplitHead
      ? SplitHead.layout({ vw, vh, mobile, w, cx, initialY, pin, start, maxScroll: Math.max(0, root.scrollHeight - vh), slot: { x: sr.x, y: land, w: sr.w, h: sr.h } })
      : { end: start + 400, neckFinal: land + w * .95 };
    // the intro text travels with the pinned head, but stops well before About
    const intro = document.querySelector('.hero__text');
    const introCap = Math.max(0, document.getElementById('about').offsetTop - box(intro).y - intro.offsetHeight - 160);
    state = { vw, vh, mobile, w, cx, initialY, pin, start, end: split.end, land, neckFinal: split.neckFinal, dpr, introCap };
    canvas.width = Math.round(vw * dpr); canvas.height = Math.round(vh * dpr);
    targets = [...document.querySelectorAll('[data-neuron]')].filter(el => el.offsetParent !== null).map(el => {
      const port = el.querySelector(':scope > .port');
      const b = box(port || el);
      return { el, x: port ? b.x + b.w / 2 : (mobile ? b.x : b.x < cx ? b.x + b.w : b.x), y: b.y + (port ? b.h / 2 : b.h * .5) };
    });
    request();
  }
  function render() {
    queued = false;
    if (!state) return;
    const {vw, vh, mobile, end, dpr} = state;
    const sy = scrollY, reduced = motion.matches;
    root.style.setProperty('--cue-opacity', String(1 - clamp(sy / (mobile ? 300 : 240))));
    // Keep the introduction readable beside the opening illustration on desktop.
    document.querySelector('.hero__text').style.transform = !mobile && !reduced ? `translateY(${Math.min(sy,end,state.introCap)}px)` : '';
    const split = window.SplitHead ? SplitHead.state : null;
    const p = reduced ? 0 : split ? split.p : 1;
    ctx.setTransform(dpr,0,0,dpr,0,0); ctx.clearRect(0,0,vw,vh);
    // No fibers are drawn any more; cards still get a soft highlight as they scroll in.
    for (const t of targets) {
      const reveal = reduced ? 1 : clamp((sy + vh * .95 - t.y) / 160);
      t.el.classList.toggle('linked', reveal > .9);
    }
    ctx.globalAlpha = 1;
    root.dataset.splitProgress = p.toFixed(3);
  }
  // While the split head is animating it calls draw() in the same frame.
  function request() {
    if (window.SplitHead && SplitHead.active()) return;
    if (!queued) { queued = true; requestAnimationFrame(render); }
  }
  function remeasure() { clearTimeout(resizeTimer); resizeTimer = setTimeout(measure,100); }
  addEventListener('scroll',request,{passive:true});
  addEventListener('resize',remeasure);
  addEventListener('load',measure);
  motion.addEventListener('change',measure);
  document.fonts?.ready.then(measure);
  new ResizeObserver(remeasure).observe(document.querySelector('main'));
  window.Neural = { measure, draw: render };
  measure();
})();
