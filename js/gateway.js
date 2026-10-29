// Gateway yard: sign tilt, prefetch, the zoom into a sign, and the compare overlay.
(function () {
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  var finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
  var world = document.getElementById('world');
  var veil = document.getElementById('veil');
  var signs = document.querySelectorAll('.sign');
  var leaving = false;

  // ---------- embers drifting up from the rug ----------
  var embers = document.getElementById('embers');
  if (!reduce.matches) {
    for (var i = 0; i < 16; i++) {
      var e = document.createElement('span');
      e.className = 'ember';
      e.style.left = (4 + Math.random() * 92) + '%';
      e.style.animationDuration = (9 + Math.random() * 10) + 's';
      e.style.animationDelay = (-Math.random() * 18) + 's';
      e.style.setProperty('--dx', (Math.random() * 80 - 40) + 'px');
      var size = 1.5 + Math.random() * 2.5;
      e.style.width = e.style.height = size + 'px';
      embers.appendChild(e);
    }
  }

  // ---------- hover: tilt toward the pointer ----------
  signs.forEach(function (sign) {
    var board = sign.querySelector('.sign__board');

    sign.addEventListener('pointerleave', function () { reset(board); });
    sign.addEventListener('blur', function () { reset(board); });

    sign.addEventListener('pointermove', function (ev) {
      if (leaving || reduce.matches || !finePointer.matches) return;
      var r = board.getBoundingClientRect();
      var x = (ev.clientX - r.left) / r.width - 0.5;
      var y = (ev.clientY - r.top) / r.height - 0.5;
      board.style.setProperty('--ry', (x * 9).toFixed(2) + 'deg');
      board.style.setProperty('--rx', (-y * 6).toFixed(2) + 'deg');
    });

    // start fetching the version as soon as the visitor shows interest, so the page is ready when the veil lifts
    ['pointerenter', 'focus', 'touchstart'].forEach(function (type) {
      sign.addEventListener(type, function () { prefetch(sign.getAttribute('href')); }, { passive: true });
    });

    sign.addEventListener('click', function (ev) { enter(ev, sign); });
  });

  function reset(board) {
    board.style.removeProperty('--rx');
    board.style.removeProperty('--ry');
  }

  var prefetched = {};
  function prefetch(href) {
    if (prefetched[href]) return;
    prefetched[href] = true;
    var link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = href;
    document.head.appendChild(link);
  }

  // ---------- entering: a plain copy of the chosen poster flies up to fill the screen, then fade to that version's own background ----------
  var zoom = null;

  function enter(ev, link) {
    if (ev.defaultPrevented || ev.button !== 0 || ev.metaKey || ev.ctrlKey || ev.shiftKey || ev.altKey) return;
    if (leaving) { ev.preventDefault(); return; }
    ev.preventDefault();
    leaving = true;
    var href = link.getAttribute('href');
    var sign = link.classList.contains('sign') ? link : document.querySelector('.sign--' + link.dataset.version);
    veil.style.setProperty('--veil', link.dataset.bg || '#000');
    if (isCompareOpen()) closeCompare(true);
    reset(sign.querySelector('.sign__board'));

    if (!reduce.matches) {
      var img = sign.querySelector('.sign__poster img');
      var r = img.getBoundingClientRect();
      var pw = img.offsetWidth, ph = img.offsetHeight;
      var x0 = r.left + r.width / 2 - pw / 2, y0 = r.top + r.height / 2 - ph / 2;
      var w = window.innerWidth, h = window.innerHeight;
      var s = Math.max(w / pw, h / ph);
      zoom = document.createElement('div');
      zoom.className = 'zoom';
      zoom.setAttribute('aria-hidden', 'true');
      zoom.style.width = pw + 'px';
      zoom.style.height = ph + 'px';
      zoom.style.transform = 'translate(' + x0 + 'px,' + y0 + 'px)';
      var copy = new Image();
      copy.src = img.currentSrc || img.src;
      copy.alt = '';
      copy.style.objectPosition = getComputedStyle(img).objectPosition;
      zoom.appendChild(copy);
      document.body.appendChild(zoom);
      sign.classList.add('is-chosen');
      void zoom.offsetWidth;
      zoom.style.transform = 'translate(' + (w / 2 - pw * s / 2).toFixed(1) + 'px,' + (h / 2 - ph * s / 2).toFixed(1) + 'px) scale(' + s.toFixed(3) + ')';
    }
    document.body.classList.add('is-leaving');
    setTimeout(function () { window.location.href = href; }, reduce.matches ? 280 : 980);
  }

  // coming back with the browser's back button restores the yard from cache: undo the push-in
  window.addEventListener('pageshow', function (ev) {
    if (!ev.persisted && !leaving) return;
    leaving = false;
    document.body.classList.remove('is-leaving');
    if (zoom) { zoom.remove(); zoom = null; }
    signs.forEach(function (s) { s.classList.remove('is-chosen'); });
  });

  // ---------- compare overlay ----------
  var compare = document.getElementById('compare');
  var openBtn = document.getElementById('compareOpen');
  var closeBtn = document.getElementById('compareClose');
  var panes = compare.querySelector('.compare__panes');
  var tabs = compare.querySelectorAll('[role=tab]');
  var frames = compare.querySelectorAll('iframe');

  function isCompareOpen() { return !compare.hidden; }

  function fit() {
    // desktop: each live page renders at 1280px wide, scaled down, as tall as the remaining screen allows
    compare.querySelectorAll('.pane__frame').forEach(function (f) {
      var s = Math.max(0.1, (f.clientWidth - 24) / 1280);
      var avail = window.innerHeight - f.getBoundingClientRect().top - 44;
      f.style.setProperty('--s', s.toFixed(4));
      f.style.setProperty('--vh', Math.max(800, Math.round(avail / s)));
    });
    // the rail runs exactly alongside the two boards
    var board = compare.querySelector('.pane__frame');
    if (board && sync.offsetParent) {
      track.style.marginTop = (board.getBoundingClientRect().top - track.getBoundingClientRect().top + (parseFloat(track.style.marginTop) || 0)) + 'px';
      track.style.height = board.offsetHeight + 'px';
      paintThumb();
    }
  }

  // ---------- the rail scrolls both versions together ----------
  // Both pages are same-origin, so the rail sets each one to the same fraction of its
  // own length. Scrolling with the pointer over a page moves only that page.
  var sync = document.getElementById('sync');
  var track = document.getElementById('syncTrack');
  var thumb = document.getElementById('syncThumb');
  var label = sync.querySelector('.sync__label');
  var frac = 0;

  function win(i) { try { var w = frames[i].contentWindow; return w && w.document && w.document.body ? w : null; } catch (e) { return null; } }
  function room(w) { return Math.max(0, w.document.documentElement.scrollHeight - w.innerHeight); }
  function paintThumb() {
    var travel = Math.max(0, track.clientHeight - thumb.offsetHeight);
    thumb.style.setProperty('--thumb-y', (frac * travel).toFixed(1) + 'px');
    track.setAttribute('aria-valuenow', String(Math.round(frac * 100)));
    track.setAttribute('aria-valuetext', frac < 0.01 ? 'Top' : frac > 0.99 ? 'Bottom' : Math.round(frac * 100) + '% down');
  }
  function scrollBoth(f) {
    frac = Math.min(1, Math.max(0, f));
    for (var i = 0; i < frames.length; i++) {
      var w = win(i);
      if (!w) continue;
      w.scrollTo({ top: frac * room(w), behavior: 'instant' });
    }
    paintThumb();
  }
  function fromPointer(ev) {
    var r = track.getBoundingClientRect(), half = thumb.offsetHeight / 2;
    return (ev.clientY - r.top - half) / Math.max(1, r.height - 2 * half);
  }
  track.addEventListener('pointerdown', function (ev) {
    track.setPointerCapture(ev.pointerId);
    sync.classList.add('is-dragging');
    scrollBoth(fromPointer(ev));
    ev.preventDefault();
  });
  track.addEventListener('pointermove', function (ev) {
    if (track.hasPointerCapture(ev.pointerId)) scrollBoth(fromPointer(ev));
  });
  ['pointerup', 'pointercancel'].forEach(function (t) {
    track.addEventListener(t, function () { sync.classList.remove('is-dragging'); });
  });
  sync.addEventListener('wheel', function (ev) {
    var longest = 0;
    for (var i = 0; i < frames.length; i++) { var w = win(i); if (w) longest = Math.max(longest, room(w)); }
    if (!longest) return;
    ev.preventDefault();
    scrollBoth(frac + ev.deltaY * 2.5 / longest);
  }, { passive: false });
  track.addEventListener('keydown', function (ev) {
    var step = { ArrowDown: 0.02, ArrowUp: -0.02, PageDown: 0.1, PageUp: -0.1 }[ev.key];
    if (step) scrollBoth(frac + step);
    else if (ev.key === 'Home') scrollBoth(0);
    else if (ev.key === 'End') scrollBoth(1);
    else return;
    ev.preventDefault();
  });

  function openCompare() {
    frames.forEach(function (f) { if (!f.src) f.src = f.dataset.src; });
    compare.hidden = false;
    world.inert = true;
    document.body.style.overflow = 'hidden';
    fit();
    closeBtn.focus();
  }

  function closeCompare(silent) {
    compare.hidden = true;
    world.inert = false;
    document.body.style.overflow = '';
    if (!silent) openBtn.focus();
  }

  openBtn.addEventListener('click', openCompare);
  closeBtn.addEventListener('click', function () { closeCompare(false); });
  document.addEventListener('keydown', function (ev) {
    if (ev.key === 'Escape' && isCompareOpen()) closeCompare(false);
  });
  window.addEventListener('resize', function () { if (isCompareOpen()) fit(); });

  tabs.forEach(function (tab) {
    tab.addEventListener('click', function () {
      panes.dataset.show = tab.dataset.show;
      tabs.forEach(function (t) { t.setAttribute('aria-selected', String(t === tab)); });
    });
  });

  compare.querySelectorAll('.pane__enter').forEach(function (link) {
    link.addEventListener('click', function (ev) { enter(ev, link); });
  });
})();
