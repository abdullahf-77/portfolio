/* Split head compositor: one face, opened by the whole page.
   One artwork (assets/art/character.webp) is cut along a single perspective
   ellipse just under the eyes. The upper and lower sprites use complementary
   masks of the same pixels, so at the top of the page they reassemble exactly.

   Scroll model: progress runs from the first pixel of the split to the very
   bottom of the document (recomputed whenever the page height changes). The
   upper piece stays pinned near the top of the viewport for the whole page;
   the lower piece travels down the screen with progress and never leaves it,
   so in document terms it moves through every section and arrives at the
   footer at the end of the page.

   The membrane between them is the face's own skin: its colours are sampled
   from the artwork just above and just below the cut, so it continues straight
   out of both pieces. It is redrawn every frame in screen space (never a
   stretched image), thinning, cracking, opening soft holes and finally
   drawing out into mozzarella-like collars and strings that stay attached. */
(() => {
  'use strict';
  const canvas = document.getElementById('splitCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const layer = document.createElement('canvas');       // membrane is composed here first
  const lctx = layer.getContext('2d');
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  const art = new Image();
  art.decoding = 'async';
  art.src = 'assets/art/character.webp';

  // Cut ellipse in artwork pixels (1000 x 1000). Its front edge dips under the
  // nose and rises under both eyes.
  const C = { cx: 556, cy: 728, rx: 262, ry: 72 };
  const LOW_TOP = C.cy - C.ry - 8;      // top of the lower sprite (its cut face)
  const CHIN = 968;
  const NECK = 952;
  const TW = 96, TH = 256;              // skin texture: columns across the cut, rows along the pull

  const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
  const lerp = (a, b, t) => a + (b - a) * t;
  const smooth = (a, b, v) => { const t = clamp((v - a) / (b - a)); return t * t * (3 - 2 * t); };
  const easeIO = t => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
  // opens as soon as the visitor scrolls, then keeps travelling to the end of the page
  const openEase = t => 0.5 * (1 - (1 - t) * (1 - t)) + 0.5 * t * t * (3 - 2 * t);
  const rgba = (c, a) => `rgba(${c[0]},${c[1]},${c[2]},${a})`;
  function rng(seed) { let s = seed >>> 0; return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296); }

  let L = null, S = null, builtFor = null;
  let p = 0, gapPrev = 0, sway = 0, time = 0, last = 0, raf = 0, ready = false, idleUntil = 0;
  const state = { p: 0, neckDoc: 0, gap: 0, T: 0 };

  // ---------- sprites and skin (built once from the single artwork) ----------
  function mk(w, h) { const c = document.createElement('canvas'); c.width = w; c.height = h; return c; }

  // The lower piece is only the face under the cut curve (cheeks, mouth, chin);
  // ears and side hair stay with the top piece. The upper mask is its exact complement.
  // Past the ends of the cut the boundary follows the cheeks' own inked outline
  // down to the chin, so neither piece has a straight vertical edge by the ears.
  const SR = 0.97;                                       // the cut (and the sheet) spans ±SR of the ellipse, where the cheeks meet it
  const CHEEK_L = [[296, 742], [298, 772], [306, 800], [321, 829], [343, 859], [373, 891], [410, 922], [430, 1020]];
  const CHEEK_R = [[812, 742], [808, 780], [801, 808], [787, 837], [767, 865], [744, 890], [720, 1020]];
  function lowerPath(c, grow = 0) {
    const a0 = Math.acos(-SR), a1 = Math.acos(SR);      // the same lower arc as before, stopping where the cheeks begin
    c.moveTo(C.cx + (C.rx + grow) * Math.cos(a0), C.cy - grow + C.ry * Math.sin(a0));
    c.ellipse(C.cx, C.cy - grow, C.rx + grow, C.ry, 0, a0, a1, true);
    CHEEK_R.forEach(([x, y]) => c.lineTo(x + grow, y));
    CHEEK_L.slice().reverse().forEach(([x, y]) => c.lineTo(x - grow, y));
    c.closePath();
  }
  function upperClip(c) { c.beginPath(); c.rect(-20, -20, 1040, 1040); lowerPath(c); c.clip('evenodd'); }
  function lowerClip(c, grow) { c.beginPath(); lowerPath(c, grow); c.clip(); }

  // Average artwork colour in a small window, ignoring transparent pixels.
  function sample(data, x0, y0, x1, y1) {
    let r = 0, g = 0, b = 0, n = 0;
    for (let y = Math.max(0, y0); y <= Math.min(999, y1); y++) {
      for (let x = Math.max(0, x0); x <= Math.min(999, x1); x++) {
        const i = (y * 1000 + x) * 4;
        if (data[i + 3] < 200) continue;
        r += data[i]; g += data[i + 1]; b += data[i + 2]; n++;
      }
    }
    return n ? [r / n, g / n, b / n] : null;
  }

  // Skin texture sampled from the face: column u holds the colour just above the
  // cut (top row) blending into the colour just below it (bottom row), with the
  // painted grain and faint stretch striations of the artwork.
  function buildSkin(data) {
    const top = [], bot = [];
    for (let c = 0; c < TW; c++) {
      const u = -1 + (2 * (c + 0.5)) / TW;
      const x = Math.round(C.cx + u * (C.rx - 8));
      const yc = Math.round(C.cy + C.ry * Math.sqrt(1 - u * u));
      top.push(sample(data, x - 3, yc - 10, x + 3, yc - 3));
      bot.push(sample(data, x - 3, yc + 3, x + 3, yc + 10));
    }
    // fill gaps from neighbours, then soften so facial details never streak
    const fill = arr => { for (let i = 0; i < arr.length; i++) if (!arr[i]) arr[i] = arr[i - 1] || arr.find(Boolean); };
    fill(top); fill(bot);
    const soften = arr => arr.map((_, i) => {
      const acc = [0, 0, 0]; let w = 0;
      for (let j = -3; j <= 3; j++) { const v = arr[clamp(i + j, 0, arr.length - 1)]; const wt = 4 - Math.abs(j); acc[0] += v[0] * wt; acc[1] += v[1] * wt; acc[2] += v[2] * wt; w += wt; }
      return acc.map(v => v / w);
    });
    const T0 = soften(top), B0 = soften(bot);
    const r = rng(9);
    const streak = Array.from({ length: TW }, () => (r() - 0.5));
    const tex = mk(TW, TH), tc = tex.getContext('2d');
    const img = tc.createImageData(TW, TH);
    for (let y = 0; y < TH; y++) {
      const t = y / (TH - 1);
      const env = smooth(0, 0.14, t) * (1 - smooth(0.86, 1, t));   // pure sampled colour at both rims
      for (let x = 0; x < TW; x++) {
        const s = 1 + (streak[x] * 0.025 + (r() - 0.5) * 0.03) * env;   // faint striation; the real grain comes from the face (buildGrain)
        const i = (y * TW + x) * 4;
        for (let k = 0; k < 3; k++) img.data[i + k] = clamp(lerp(T0[x][k], B0[x][k], t) * s, 0, 255);
        img.data[i + 3] = 255;
      }
    }
    tc.putImageData(img, 0, 0);
    const avg = arr => [0, 1, 2].map(k => Math.round(arr.reduce((a, v) => a + v[k], 0) / arr.length));
    const mid = avg(T0.slice(TW * 0.25, TW * 0.75).concat(B0.slice(TW * 0.25, TW * 0.75)));
    return {
      tex,
      mid,                                                     // typical skin
      light: mid.map(v => Math.round(Math.min(255, v * 1.28 + 14))), // lit, thinner skin
      dark: mid.map(v => Math.round(v * 0.5))                  // creases and shadow
    };
  }

  // Cut surface on top of the lower piece. It is only ever seen through tears in
  // the membrane, so it is the shadowed inside of the skin, not a lit surface.
  function paintCutFace(c, skin) {
    c.save();
    c.beginPath(); c.ellipse(C.cx, C.cy, C.rx, C.ry, 0, 0, Math.PI * 2);
    const g = c.createRadialGradient(C.cx, C.cy, 10, C.cx, C.cy, C.rx);
    g.addColorStop(0, rgba(skin.dark.map(v => Math.round(v * 0.55)), 1)); g.addColorStop(1, rgba(skin.dark.map(v => Math.round(v * 0.3)), 1));
    c.fillStyle = g; c.fill();
    c.restore();
  }

  // The face's own painted skin grain: a clean patch of cheek (no outlines),
  // reduced to its fine detail (patch minus a blurred copy) around mid-grey and
  // mirrored so it tiles without seams. Laid over the sheet with 'overlay' it
  // gives the stretched skin the same texture as the face around it.
  function buildGrain(sc) {
    const PX = 430, PY = 855, PW = 100, PH = 45, R = 5;
    const d = sc.getImageData(PX, PY, PW, PH).data;
    const lum = new Float32Array(PW * PH);
    for (let i = 0; i < PW * PH; i++) lum[i] = 0.3 * d[i * 4] + 0.59 * d[i * 4 + 1] + 0.11 * d[i * 4 + 2];
    const g = mk(PW * 2, PH * 2), gc = g.getContext('2d');
    const img = gc.createImageData(PW * 2, PH * 2);
    for (let y = 0; y < PH; y++) {
      for (let x = 0; x < PW; x++) {
        let sum = 0, n = 0;
        for (let yy = Math.max(0, y - R); yy <= Math.min(PH - 1, y + R); yy++) {
          for (let xx = Math.max(0, x - R); xx <= Math.min(PW - 1, x + R); xx++) { sum += lum[yy * PW + xx]; n++; }
        }
        // soft-limited, so a stray freckle in the patch never repeats as a visible mark
        const v = clamp(128 + 9 * Math.tanh((lum[y * PW + x] - sum / n) * 1.4 / 9), 0, 255);
        for (const [mx, my] of [[x, y], [PW * 2 - 1 - x, y], [x, PH * 2 - 1 - y], [PW * 2 - 1 - x, PH * 2 - 1 - y]]) {
          const o = (my * PW * 2 + mx) * 4;
          img.data[o] = img.data[o + 1] = img.data[o + 2] = v; img.data[o + 3] = 255;
        }
      }
    }
    gc.putImageData(img, 0, 0);
    return g;
  }

  function buildSprites() {
    const src = mk(1000, 1000), sc = src.getContext('2d');
    sc.drawImage(art, 0, 0);
    const skin = buildSkin(sc.getImageData(0, 0, 1000, 1000).data);
    skin.grain = buildGrain(sc);

    const up = mk(1000, 1000);
    let c = up.getContext('2d');
    c.save(); upperClip(c); c.drawImage(art, 0, 0); c.restore();

    const low = mk(1000, 1000 - LOW_TOP);
    c = low.getContext('2d');
    c.translate(0, -LOW_TOP);
    // grown 2px so the lower piece tucks under the upper's anti-aliased edge
    c.save(); lowerClip(c, 2); c.drawImage(art, 0, 0); c.restore();
    // a second copy carries the dark cut face; it is drawn only inside the sheet,
    // so it shows through the tears but never beside the sheet at the corners
    const lowCut = mk(1000, 1000 - LOW_TOP);
    c = lowCut.getContext('2d');
    c.drawImage(low, 0, 0);
    c.translate(0, -LOW_TOP);
    paintCutFace(c, skin);
    S = { up, low, lowCut, skin };
  }

  // ---------- membrane tears (normalised, built once) ----------
  // The skin is one continuous sheet. Tension opens lens-shaped slits that
  // grow along the stretch, a few pinholes and hairline cracks appear first,
  // and late in the pull the sheet draws out into strings between collars.
  let slits = [], pins = [], cracks = [], snaps = [], strings = [];
  function buildTears(mobile) {
    const r = rng(77);
    const n = mobile ? 5 : 6;
    slits = [];
    for (let j = 0; j < n; j++) {
      const u = -0.84 + (1.68 * (j + 0.5)) / n + (r() - 0.5) * 0.08;
      const edge = Math.abs(u);
      slits.push({ u, tc: 0.4 + r() * 0.22, at: 0.4 + r() * 0.3 + edge * 0.1, l0: 0.05 + r() * 0.05, wmax: 0.11 + r() * 0.05 });
    }
    // tears that only open near the edges in the final phase, freeing the sides into strings
    for (const u of [-0.93, 0.93]) slits.push({ u, tc: 0.48 + r() * 0.08, at: 0.92 + r() * 0.08, l0: 0.08, wmax: 0.1 });
    slits.sort((a, b) => a.u - b.u);
    slits.forEach(s => { s.gl = 0.75 + r() * 0.4; s.gc = 0.38 + r() * 0.24; s.fo = r() * 0.14; });   // staggered so tears never line up
    // strings left between slits at full stretch: uneven widths, a few thin away,
    // but never all of them, so the two pieces always stay connected
    strings = slits.map((s, j) => (j === 0 ? 0 : r() < 0.35 ? 0 : 0.4 + r() * 0.9)).concat([0]);
    strings[1] = Math.min(strings[1], 0.3); strings[slits.length - 1] = Math.min(strings[slits.length - 1], 0.3);
    if (strings.filter(v => v > 0.35).length < 3) strings[Math.floor(slits.length / 2)] = 0.9;
    // only a couple of the thicker strings snap into drips, late in the page
    snaps = [];
    for (let j = 1; j < slits.length - 1; j++) {
      if (strings[j] > 0 && r() < 0.35) snaps.push({ a: j - 1, b: j, at: 1.05 + r() * 0.12, cut: 0.42 + r() * 0.16 });
    }
    pins = Array.from({ length: mobile ? 4 : 6 }, () => ({ u: (r() - 0.5) * 1.5, t: 0.22 + r() * 0.56, r: 0.018 + r() * 0.02, at: 0.22 + r() * 0.25 }));
    cracks = Array.from({ length: mobile ? 4 : 7 }, () => ({ u: (r() - 0.5) * 1.6, t: 0.15 + r() * 0.7, len: 0.08 + r() * 0.1, at: 0.15 + r() * 0.2, seed: r() * 100 }));
  }

  // ---------- frame ----------
  function draw() {
    const { vw, vh, k, ox, dpr } = L;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, vw, vh);
    if (!ready) return;
    const sy = scrollY;
    const hold = 36 / Math.max(1, L.end - L.start);            // a short hairline-crack beat first
    const pp = clamp((p - hold) / (1 - hold));
    // upper piece: scrolls with the page until it reaches its pin, then settles a
    // little higher for the journey (eyes stay in view) and stays there to the end
    const base = L.reduced || sy < L.start ? L.initialY - sy : lerp(L.pin, L.pinJ, easeIO(clamp(pp / 0.12)));
    const gap = L.gapMax * openEase(pp);
    const lift = (12 * L.w / 430) * easeIO(clamp(pp * 12));   // the cap rises a little as it lets go
    const crack = smooth(0, hold * 0.6, p) * (1 - smooth(hold, hold * 4, p));
    const uy = base - lift, ly = base + gap;
    const vel = gap - gapPrev; gapPrev = gap;
    sway = lerp(sway, clamp(vel * 0.5, -8, 8), 0.08);

    state.p = p; state.gap = gap;
    state.neckDoc = sy + ly + NECK * k;
    if (!(ly + CHIN * k > -20 && uy < vh + 20)) return;

    ctx.globalAlpha = 1;
    // upper piece first: hair hanging below the ear then stays behind the lower
    // cheek from the very start of the pull (closed, both show the same pixels)
    ctx.drawImage(S.up, ox, uy, 1000 * k, 1000 * k);
    ctx.drawImage(S.low, ox, ly + LOW_TOP * k, 1000 * k, S.low.height * k);
    const D = ly - uy;
    // The sheet goes on top of both pieces: it starts exactly at the cut, so it
    // covers nothing of the face, only hair that hangs down beside the ear.
    // Tension follows progress through the whole page, not just the on-screen distance.
    if (D > 0.5 && !L.reduced) drawMembrane(uy, ly, k, D, 1.2 * Math.pow(pp, 0.9));
    ctx.globalAlpha = 1;

    if (crack > 0.01) {                       // a hairline seam before the skin starts to pull
      ctx.globalAlpha = crack * 0.8;
      ctx.strokeStyle = rgba(S.skin.dark, 1); ctx.lineWidth = 1.4;
      ctx.beginPath(); ctx.ellipse(ox + C.cx * k, uy + C.cy * k, C.rx * k, C.ry * k, 0, 0.08, Math.PI - 0.08); ctx.stroke();
    }
    ctx.globalAlpha = 1;
  }

  function drawMembrane(uy, ly, k, D, T) {
    const { vw, vh, ox } = L;
    const { tex, mid, light, dark } = S.skin;
    const F = smooth(0.9, 1.2, T);                        // final phase: the sheet draws out into strings
    state.T = T;
    const cx = ox + C.cx * k;
    const squeeze = 0.2 * smooth(0, 0.22, T) + 0.2 * smooth(0.22, 1, T) - 0.14 * F;   // hourglass waist
    const wob = L.reduced ? 0 : 0.6 + 1.8 * smooth(0.3, 1, T);
    const g = lctx;
    g.setTransform(L.dpr, 0, 0, L.dpr, 0, 0);
    const top = Math.max(0, uy + (C.cy - 4) * k), bot = Math.min(vh, ly + (C.cy + C.ry + 12) * k);
    if (bot <= top) return;
    g.clearRect(0, 0, vw, vh);   // whole layer: a band-only clear left ghost slivers of earlier frames as the head closed

    // point on the sheet: u across (-1..1), t along (0 top rim .. 1 bottom rim)
    const px = (u, t) => {
      const x0 = ox + (C.cx + u * SR * C.rx) * k;
      const env = Math.sin(Math.PI * t);
      // the waist is concentrated mid-way, so near both rims the sides keep the cheeks' width (no notch at the corners)
      return cx + (x0 - cx) * (1 - squeeze * Math.pow(env, 1.7))
        + (Math.sin(t * Math.PI * 2 + u * 2.4 + time * 1.3) * wob + sway) * env;
    };
    const py = (u, t) => {
      const rim = C.ry * Math.sqrt(Math.max(0, 1 - u * u * SR * SR));
      return lerp(uy + (C.cy + rim) * k, ly + (C.cy + rim) * k, t) + Math.sin(Math.PI * t) * Math.min(D, 400) * 0.03 * smooth(0.2, 1, T);
    };
    const pathUT = pts => { g.beginPath(); pts.forEach(([u, t], i) => (i ? g.lineTo(px(u, t), py(u, t)) : g.moveTo(px(u, t), py(u, t)))); g.closePath(); };

    // 1) the sheet, painted with the skin texture sampled from the face. It is
    // drawn in thin horizontal slices along the pull, so it keeps full detail
    // at any length instead of stretching one image.
    const NT = Math.round(clamp(D / 5, 40, 200)), NU = 24;   // fine enough that the sides never step
    const outline = [];
    for (let i = 0; i <= NU; i++) outline.push([-1 + (2 * i) / NU, 0]);
    for (let i = 1; i <= NT; i++) outline.push([1, i / NT]);
    for (let i = NU - 1; i >= 0; i--) outline.push([-1 + (2 * i) / NU, 1]);
    for (let i = NT - 1; i > 0; i--) outline.push([-1, i / NT]);
    g.save();
    pathUT(outline); g.clip();
    // an opaque skin base underneath, so the joins between slices never show as lines
    g.fillStyle = rgba(mid, 1);
    g.fillRect(cx - C.rx * k - 8, uy + (C.cy - C.ry) * k - 8, C.rx * k * 2 + 16, ly - uy + C.ry * 2 * k + 16);
    const NS = Math.round(clamp(D / 3, 24, 240));
    const sideLag = C.ry * (1 - Math.sqrt(1 - SR * SR)) * k / Math.max(D, 1);
    for (let i = 0; i < NS; i++) {
      const t0 = i / NS, t1 = (i + 1) / NS;
      const yA = i === 0 ? py(0, 0) - C.ry * k - 3 : py(0, t0);
      const yB = i === NS - 1 ? py(0, 1) + 3 : py(0, t1);
      // the outline's sides sit higher than its centre (the cut's curve), so at this
      // slice's height they belong to a later t: cover that width too, or the
      // corners are left with stair-stepped gaps
      const s0 = Math.min(1, t0 + sideLag), s1 = Math.min(1, t1 + sideLag);
      const xL = Math.min(px(-1, t0), px(-1, t1), px(-1, s0), px(-1, s1)) - 2;
      const xR = Math.max(px(1, t0), px(1, t1), px(1, s0), px(1, s1)) + 2;
      g.drawImage(tex, 0, t0 * (TH - 1), TW, Math.max(1, (t1 - t0) * (TH - 1)), xL, yA, xR - xL, yB - yA + 1.6);
    }
    // the face's own skin grain, at the face's scale, travelling with the top
    // piece and drawn out lengthwise as the skin stretches
    if (S.skin.grain) {
      const gp = g.createPattern(S.skin.grain, 'repeat');
      const stretch = clamp(1 + D / (420 * k), 1, 3);
      gp.setTransform(new DOMMatrix([k, 0, 0, k * stretch, ox, uy + C.cy * k]));
      g.globalCompositeOperation = 'overlay';
      g.globalAlpha = 0.9;
      g.fillStyle = gp;
      g.fillRect(cx - C.rx * k - 8, uy + (C.cy - C.ry) * k - 8, C.rx * k * 2 + 16, ly - uy + C.ry * 2 * k + 16);
      g.globalAlpha = 1;
      g.globalCompositeOperation = 'source-over';
    }
    g.restore();

    // 2) faint stretch striations running along the pull, in skin tones
    g.lineCap = 'round';
    const y0 = uy + (C.cy + C.ry) * k, y1 = ly + (C.cy + C.ry) * k;
    const rimFade = clamp(40 / Math.max(D, 1), 0.04, 0.3);   // edge blend length, a fixed size on long pulls
    const along = (col, a) => {                                // a colour that vanishes at both rims
      const gr = g.createLinearGradient(0, y0 - C.ry * k, 0, y1);
      gr.addColorStop(0, rgba(col, 0)); gr.addColorStop(rimFade, rgba(col, a));
      gr.addColorStop(1 - rimFade, rgba(col, a)); gr.addColorStop(1, rgba(col, 0));
      return gr;
    };
    const sa = 0.02 + 0.05 * smooth(0.05, 0.8, T);         // kept faint so they never read as stripes
    const lightStroke = along(light, sa), darkStroke = along(dark, sa * 0.8);
    for (let j = 0; j < 26; j++) {
      const u = -0.95 + (1.9 * j) / 25 + Math.sin(j * 7.3) * 0.02;
      g.globalAlpha = 0.4 + 0.6 * Math.abs(Math.sin(j * 2.7));
      g.beginPath();
      for (let i = 0; i <= NT; i++) { const t = i / NT; i ? g.lineTo(px(u, t), py(u, t)) : g.moveTo(px(u, t), py(u, t)); }
      g.strokeStyle = j % 2 ? lightStroke : darkStroke;
      g.lineWidth = 1; g.stroke();
    }
    g.globalAlpha = 1;

    // 3) light and depth, all in the skin's own darker and lighter tones
    // (every effect fades to zero at both rims, so the sheet's first and last rows
    // are exactly the colours of the face it grows out of)
    g.globalCompositeOperation = 'source-atop';
    const vg = g.createLinearGradient(0, y0 - C.ry * k, 0, y1);
    vg.addColorStop(0, rgba(light, 0));
    vg.addColorStop(0.5, rgba(light, 0.08 + 0.1 * smooth(0, 0.9, T)));  // a little lighter where it is thinnest
    vg.addColorStop(1, rgba(light, 0));
    g.fillStyle = vg; g.fillRect(0, top - 40, vw, bot - top + 80);
    const halfW = C.rx * k * (1 - squeeze * 0.6);
    const sg = g.createLinearGradient(cx - halfW, 0, cx + halfW, 0);
    sg.addColorStop(0, rgba(dark, 0.5));                      // rounded sides, like the cheeks
    sg.addColorStop(0.22, rgba(dark, 0.06));
    sg.addColorStop(0.42, rgba(light, 0.1));
    sg.addColorStop(0.64, rgba(dark, 0));
    sg.addColorStop(0.86, rgba(dark, 0.14));
    sg.addColorStop(1, rgba(dark, 0.45));
    g.fillStyle = sg;
    // bands snapped to whole device pixels, and fine enough that the fade has no steps
    const bands = Math.round(clamp(D / 4, 24, 160)), dp = L.dpr;
    const snap = v => Math.round(v * dp) / dp;
    for (let i = 0; i < bands; i++) {
      const t0 = i / bands, t1 = (i + 1) / bands, tm = (t0 + t1) / 2;
      g.globalAlpha = smooth(0, rimFade * 1.6, tm) * (1 - smooth(1 - rimFade * 1.6, 1, tm));
      const ya = snap(i === 0 ? top - 40 : lerp(y0, y1, t0)), yb = snap(i === bands - 1 ? bot + 40 : lerp(y0, y1, t1));
      if (yb > ya) g.fillRect(0, ya, vw, yb - ya);
    }
    g.globalAlpha = 1;

    // hairline cracks show first, before anything opens
    for (const c of cracks) {
      const a = smooth(c.at, c.at + 0.15, T) * (1 - smooth(0.85, 1.1, T)) * 0.5;
      if (a < 0.02) continue;
      g.beginPath();
      for (let i = 0; i <= 6; i++) {
        const t = c.t + (i / 6 - 0.5) * c.len * (0.6 + T);
        const u = c.u + Math.sin(c.seed + i * 2.1) * 0.02;
        i ? g.lineTo(px(u, t), py(u, t)) : g.moveTo(px(u, t), py(u, t));
      }
      g.strokeStyle = rgba(dark, a); g.lineWidth = 0.9; g.stroke();
    }
    g.globalCompositeOperation = 'source-over';

    // 4) tears, collected as shapes in sheet space
    const holes = [];
    const lens = (u, tc, l, w) => {
      const pts = [], n = 14;
      const t0 = Math.max(0.03, tc - l), t1 = Math.min(0.97, tc + l);
      for (let i = 0; i <= n; i++) { const t = lerp(t0, t1, i / n), q = (t - tc) / l; pts.push([u - w * Math.pow(Math.max(0, 1 - q * q), 0.8), t]); }
      for (let i = n; i >= 0; i--) { const t = lerp(t0, t1, i / n), q = (t - tc) / l; pts.push([u + w * Math.pow(Math.max(0, 1 - q * q), 0.8), t]); }
      return pts;
    };
    for (const pn of pins) {
      const o = smooth(pn.at, pn.at + 0.25, T);
      if (o > 0.02) holes.push(lens(pn.u, pn.t, pn.r * 1.6 * o * (1 + T), pn.r * o));
    }
    // pointed slits hand over to the rounded gaps of the final phase
    const Fj = s => smooth(0.84 + s.fo, 1.16 + s.fo * 0.5, T);   // each tear reaches its final phase in its own time
    for (const s of slits) {
      if (Fj(s) >= 0.6) continue;
      const o = smooth(s.at, s.at + 0.3, T) * (1 - smooth(0.2, 0.6, Fj(s)));
      if (o <= 0.01) continue;
      const l = s.l0 * o * (1 + T) + 0.36 * smooth(s.at + 0.35, s.at + 0.8, T) + 0.1 * F;
      const w = s.wmax * (0.6 * o + 0.4 * smooth(s.at + 0.3, s.at + 0.8, T)) * (1 + 0.5 * F);
      holes.push(lens(s.u, s.tc, Math.min(l, 0.5), w));
    }
    // final phase: each slit widens into a rounded gap between thinning strings,
    // leaving draped collars of skin at both rims (U-shaped scallops)
    if (T > 0.84) {
      const cs = slits.map(s => s.u);
      const mids = [-1.04, ...cs.slice(0, -1).map((u, j) => (u + cs[j + 1]) / 2), 1.04];
      cs.forEach((u, j) => {
        const Fs = Fj(slits[j]);
        if (Fs <= 0.01) return;
        const half = lerp(0.04, 0.36, Fs);
        const lo = mids[j], hi = mids[j + 1];
        const base = 0.3 * lerp(0.42, 0.14, Fs) * 0.5;      // half width of a typical string
        const pts = [], n = 22;
        const gc = slits[j].gc, gh = Math.min(half * slits[j].gl, gc - 0.13, 0.87 - gc);   // a skin collar always stays at both rims
        const prof = t => Math.pow(Math.max(0, 1 - Math.pow(Math.abs((t - gc) / gh), 2.4)), 0.45);   // rounded U ends
        // strings taper thin in the middle and sway on their own, like pulled cheese
        const sw = (m, t) => {
          const q = (t - gc) / gh;
          return { hw: base * strings[m] * (0.45 + 0.55 * q * q * q * q), dx: Math.sin(t * 4.7 + m * 1.9 + time * 1.5) * 0.018 * F * Math.max(0, 1 - q * q) };
        };
        const edgeA = t => { const s0 = sw(j, t); return lo + s0.dx + s0.hw; };
        const edgeB = t => { const s1 = sw(j + 1, t); return hi + s1.dx - s1.hw; };
        for (let i = 0; i <= n; i++) { const t = gc - gh + (2 * gh * i) / n; pts.push([lerp(u, edgeA(t), prof(t)), t]); }
        for (let i = n; i >= 0; i--) { const t = gc - gh + (2 * gh * i) / n; pts.push([lerp(u, Math.max(edgeA(t) + 0.002, edgeB(t)), prof(t)), t]); }
        holes.push(pts);
      });
    }
    const drips = [];
    for (const sn of snaps) {
      const o = smooth(sn.at, sn.at + 0.15, T);
      if (o <= 0.01) continue;
      const uA = slits[sn.a].u, uB = slits[sn.b].u;
      const gHalf = 0.015 + 0.05 * o;                         // a small break with rounded ends
      const bulge = 0.04 + 0.03 * o;
      const pts = [];
      for (let i = 0; i <= 10; i++) { const u = lerp(uA, uB, i / 10), e = Math.sin(Math.PI * i / 10); pts.push([u, sn.cut - gHalf + bulge * e]); }
      for (let i = 10; i >= 0; i--) { const u = lerp(uA, uB, i / 10), e = Math.sin(Math.PI * i / 10); pts.push([u, sn.cut + gHalf - bulge * e]); }
      holes.push(pts);
      const um = (uA + uB) / 2;
      drips.push([um, sn.cut - gHalf + bulge, o], [um, sn.cut + gHalf - bulge, o]);
    }
    if (holes.length) {
      g.globalCompositeOperation = 'destination-out';
      g.fillStyle = '#000';
      holes.forEach(h => { pathUT(h); g.fill(); });
      // soft rolled rims around every tear, in skin tones
      g.globalCompositeOperation = 'source-atop';
      g.lineJoin = 'round';
      holes.forEach(h => {
        pathUT(h);
        g.strokeStyle = rgba(dark, 0.5); g.lineWidth = 2.4; g.stroke();
        g.save(); g.translate(-0.8, -0.8);
        pathUT(h); g.strokeStyle = rgba(light, 0.45); g.lineWidth = 1.4; g.stroke();
        g.restore();
      });
      g.globalCompositeOperation = 'source-over';
    }

    // 5) the sheet's side contours fade into the face's own outline, and torn
    // strings end in small glossy drops of the same skin
    g.lineJoin = 'round';
    for (const side of [-1, 1]) {
      g.beginPath();
      for (let i = 0; i <= NT; i++) { const t = i / NT; i ? g.lineTo(px(side, t), py(side, t)) : g.moveTo(px(side, t), py(side, t)); }
      g.strokeStyle = along(dark.map(v => Math.round(v * 0.6)), 0.6 * (1 - F)); g.lineWidth = 1.4; g.stroke();
    }
    for (const [u, t, o] of drips) {
      const x = px(u, t), y = py(u, t);
      const r = (1.4 + 2 * o) * clamp(L.w / 430, 0.6, 1.1);
      g.fillStyle = rgba(mid, 1);
      g.beginPath(); g.ellipse(x, y, r, r * 1.3, 0, 0, Math.PI * 2); g.fill();
      g.strokeStyle = rgba(dark, 0.5); g.lineWidth = 1; g.stroke();
      g.fillStyle = rgba(light, 0.8);
      g.beginPath(); g.arc(x - r * 0.35, y - r * 0.3, r * 0.3, 0, Math.PI * 2); g.fill();
    }

    // the dark cut face sits under the sheet only, seen through its tears
    ctx.save();
    ctx.beginPath();
    outline.forEach(([u, t], i) => (i ? ctx.lineTo(px(u, t), py(u, t)) : ctx.moveTo(px(u, t), py(u, t))));
    ctx.closePath(); ctx.clip();
    ctx.drawImage(S.lowCut, ox, ly + LOW_TOP * k, 1000 * k, S.lowCut.height * k);
    ctx.restore();

    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.globalAlpha = 1;
    ctx.drawImage(layer, 0, 0);
    ctx.restore();
  }

  // ---------- loop ----------
  function target() {
    if (!L || L.reduced) return 0;
    return clamp((scrollY - L.start) / (L.end - L.start));
  }
  function frame(t) {
    raf = 0;
    const dt = Math.min(0.05, last ? (t - last) / 1000 : 0.016);
    last = t;
    const goal = target();
    p += (goal - p) * (1 - Math.exp(-dt * 9));
    if (Math.abs(goal - p) * (L.end - L.start) < 0.3) p = goal;
    time += dt;
    draw();
    if (window.Neural && window.Neural.draw) window.Neural.draw();
    // keep animating while settling, plus a short gentle tremble after scrolling stops
    const busy = p !== goal || (state.gap > 0.5 && t < idleUntil);
    if (!L.reduced && !document.hidden && ready && busy) raf = requestAnimationFrame(frame);
    else last = 0;
  }
  function kick() {
    idleUntil = performance.now() + 1500;
    if (!raf && L) raf = requestAnimationFrame(frame);
  }

  function layout(o) {
    const k = o.w / 1000;
    const dpr = Math.min(devicePixelRatio || 1, o.mobile ? 1.5 : 2);
    canvas.width = layer.width = Math.round(o.vw * dpr);
    canvas.height = layer.height = Math.round(o.vh * dpr);
    // the split spans the whole document: it completes exactly at the bottom of the page
    const end = Math.max(o.start + 400, o.maxScroll);
    // during the journey the cut line sits at ~30% of the viewport (hair may run
    // past the top edge, the eyes stay clear of the nav)
    const pinJ = Math.min(o.pin, Math.max(o.vh * 0.3 - 800 * k, (o.mobile ? 80 : 84) - 560 * k));
    // the lower piece travels down the screen but always stays fully in view, and at
    // the very bottom of the page it rests just above the footer bar, in the last section
    const footer = document.querySelector('.footer');
    const floor = o.vh - (footer ? footer.offsetHeight : 0) - (o.mobile ? 14 : 20);
    const gapMax = Math.max(120, floor - pinJ - CHIN * k);
    L = Object.assign({}, o, { k, ox: o.cx - 500 * k, dpr, end, pinJ, gapMax, reduced: motion.matches });
    if (!slits.length || o.mobile !== builtFor) { buildTears(o.mobile); builtFor = o.mobile; }
    p = target();
    draw();
    kick();
    return { end, neckFinal: o.maxScroll + pinJ + gapMax + NECK * k };
  }

  addEventListener('scroll', kick, { passive: true });
  document.addEventListener('visibilitychange', kick);
  function onArt() {
    if (ready || !art.naturalWidth) return;
    buildSprites(); ready = true;
    if (L) { draw(); kick(); }
  }
  if (art.complete) onArt(); else art.addEventListener('load', onArt);

  window.SplitHead = { layout, state, active: () => !!raf, kick };
})();
