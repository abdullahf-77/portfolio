(function () {
  "use strict";

  var root = document.documentElement;
  root.classList.add("js");

  // ---------- Theme toggle ----------
  function currentTheme() {
    var set = root.getAttribute("data-theme");
    if (set) return set;
    return window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
  }
  document.getElementById("themeToggle").addEventListener("click", function () {
    var next = currentTheme() === "dark" ? "light" : "dark";
    root.setAttribute("data-theme", next);
    try { localStorage.setItem("theme", next); } catch (e) {}
  });

  // ---------- Mobile menu ----------
  var menuBtn = document.getElementById("menuToggle");
  var links = document.getElementById("navLinks");
  function setMenu(open) {
    links.classList.toggle("is-open", open);
    menuBtn.setAttribute("aria-expanded", String(open));
    menuBtn.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  }
  menuBtn.addEventListener("click", function () { setMenu(!links.classList.contains("is-open")); });
  links.addEventListener("click", function (e) { if (e.target.tagName === "A") setMenu(false); });

  // ---------- Nav border + active link ----------
  var nav = document.querySelector(".nav");
  window.addEventListener("scroll", function () {
    nav.classList.toggle("is-scrolled", window.scrollY > 8);
  }, { passive: true });

  var navAnchors = links.querySelectorAll("a");
  if ("IntersectionObserver" in window) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        navAnchors.forEach(function (a) {
          a.classList.toggle("is-active", a.getAttribute("href") === "#" + en.target.id);
        });
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    document.querySelectorAll("main section[id]").forEach(function (s) { spy.observe(s); });

    // ---------- Reveal on scroll ----------
    var rev = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("is-in"); rev.unobserve(en.target); }
      });
    }, { threshold: 0.12 });
    document.querySelectorAll(".reveal").forEach(function (el) { rev.observe(el); });
  } else {
    document.querySelectorAll(".reveal").forEach(function (el) { el.classList.add("is-in"); });
  }

  // ---------- Copy email ----------
  var copyBtn = document.getElementById("copyEmail");
  copyBtn.addEventListener("click", function () {
    var email = copyBtn.getAttribute("data-email");
    var done = function () {
      copyBtn.textContent = "Copied!";
      setTimeout(function () { copyBtn.textContent = "Copy email"; }, 1600);
    };
    if (navigator.clipboard) navigator.clipboard.writeText(email).then(done, function () {});
  });

  document.getElementById("year").textContent = new Date().getFullYear();

  // ---------- Hero network canvas ----------
  var canvas = document.getElementById("netCanvas");
  var ctx = canvas.getContext("2d");
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var nodes = [], w = 0, h = 0, dpr = 1, raf = null;

  function accent() {
    return getComputedStyle(root).getPropertyValue("--accent").trim() || "#5eead4";
  }

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = canvas.clientWidth; h = canvas.clientHeight;
    canvas.width = w * dpr; canvas.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    var count = Math.round(Math.min(70, (w * h) / 18000));
    nodes = [];
    for (var i = 0; i < count; i++) {
      nodes.push({
        x: Math.random() * w, y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.25, vy: (Math.random() - 0.5) * 0.25
      });
    }
  }

  function draw() {
    var color = accent();
    ctx.clearRect(0, 0, w, h);
    var max = 140;
    for (var i = 0; i < nodes.length; i++) {
      var a = nodes[i];
      if (!reduce) {
        a.x += a.vx; a.y += a.vy;
        if (a.x < 0 || a.x > w) a.vx *= -1;
        if (a.y < 0 || a.y > h) a.vy *= -1;
      }
      for (var j = i + 1; j < nodes.length; j++) {
        var b = nodes[j];
        var dx = a.x - b.x, dy = a.y - b.y, d = Math.sqrt(dx * dx + dy * dy);
        if (d < max) {
          ctx.globalAlpha = (1 - d / max) * 0.35;
          ctx.strokeStyle = color;
          ctx.lineWidth = 1;
          ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
        }
      }
    }
    ctx.globalAlpha = 0.8;
    ctx.fillStyle = color;
    nodes.forEach(function (n) { ctx.beginPath(); ctx.arc(n.x, n.y, 1.6, 0, Math.PI * 2); ctx.fill(); });
    ctx.globalAlpha = 1;
    if (!reduce) raf = requestAnimationFrame(draw);
  }

  resize();
  draw();
  window.addEventListener("resize", function () {
    cancelAnimationFrame(raf);
    resize();
    draw();
  });
  // Pause the animation when the tab is hidden.
  document.addEventListener("visibilitychange", function () {
    if (reduce) return;
    if (document.hidden) cancelAnimationFrame(raf); else draw();
  });
})();
