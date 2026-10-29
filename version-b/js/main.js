(function () {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const relayout = () => window.PortfolioTree && window.PortfolioTree.measure();

  // ----- mobile menu -----
  const toggle = document.getElementById('navToggle');
  const links = document.getElementById('navLinks');
  function setMenu(open) {
    links.classList.toggle('is-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    toggle.querySelector('use').setAttribute('href', open ? '#i-x' : '#i-menu');
  }
  addEventListener('resize', () => { if (innerWidth >= 1000) setMenu(false); });
  toggle.addEventListener('click', () => setMenu(toggle.getAttribute('aria-expanded') !== 'true'));
  links.addEventListener('click', e => { if (e.target.closest('a')) setMenu(false); });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') { setMenu(false); toggle.focus(); }
  });

  // ----- active section in nav -----
  const navAnchors = [...links.querySelectorAll('a')];
  const sections = navAnchors.map(a => document.querySelector(a.getAttribute('href'))).filter(Boolean);
  const io = new IntersectionObserver(entries => {
    entries.forEach(en => {
      if (!en.isIntersecting) return;
      navAnchors.forEach(a => {
        const on = a.getAttribute('href') === '#' + en.target.id;
        a.classList.toggle('is-active', on);
        if (on) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current');
      });
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  sections.forEach(s => io.observe(s));

  // ----- project details -----
  document.querySelectorAll('.project .more').forEach((btn, i) => {
    const panel = btn.nextElementSibling;
    panel.id = panel.id || 'project-more-' + i;
    btn.setAttribute('aria-controls', panel.id);
    btn.addEventListener('click', () => {
      const open = btn.getAttribute('aria-expanded') !== 'true';
      btn.setAttribute('aria-expanded', String(open));
      btn.firstChild.textContent = open ? 'Less ' : 'Details ';
      panel.hidden = !open;
      relayout();
    });
  });

  // ----- project filters + "View More Projects" -----
  // The six featured projects show first; the rest stay hidden until "View More".
  // A category filter always searches every project.
  const chips = [...document.querySelectorAll('.filters .chip')];
  const projects = [...document.querySelectorAll('.project')];
  const moreBtn = document.getElementById('moreProjects');
  const extras = projects.filter(p => p.classList.contains('is-extra'));
  let filter = 'all', expanded = false;
  function showProjects() {
    projects.forEach(p => {
      const match = filter === 'all' || p.dataset.cat.split(' ').includes(filter);
      p.hidden = !match || (filter === 'all' && !expanded && extras.includes(p));
    });
    // alternate the visible cards left / right so they always read in order
    projects.filter(p => !p.hidden).forEach((p, i) => {
      p.classList.toggle('col-l', i % 2 === 0);
      p.classList.toggle('col-r', i % 2 === 1);
    });
    if (moreBtn) {
      moreBtn.parentElement.hidden = filter !== 'all';
      moreBtn.setAttribute('aria-expanded', String(expanded));
      moreBtn.firstChild.textContent = expanded ? 'Show Fewer Projects ' : `View More Projects (${extras.length}) `;
      moreBtn.querySelector('use').setAttribute('href', expanded ? '#i-x' : '#i-plus');
    }
    relayout();
  }
  chips.forEach(chip => chip.addEventListener('click', () => {
    filter = chip.dataset.filter;
    chips.forEach(c => { const on = c === chip; c.classList.toggle('is-on', on); c.setAttribute('aria-pressed', String(on)); });
    showProjects();
  }));
  if (moreBtn) moreBtn.addEventListener('click', () => {
    expanded = !expanded;
    showProjects();
    if (expanded && extras[0]) extras[0].querySelector('h3').scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'center' });
  });
  showProjects();

  // ----- card tilt on fine pointers -----
  if (!reduce && matchMedia('(hover: hover) and (pointer: fine)').matches) {
    projects.forEach(card => {
      card.addEventListener('pointermove', e => {
        if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
        const r = card.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
        card.style.transform = `perspective(900px) rotateX(${(-y * 4).toFixed(2)}deg) rotateY(${(x * 5).toFixed(2)}deg) translateY(-3px)`;
      });
      card.addEventListener('pointerleave', () => { card.style.transform = ''; });
    });
  }

  // ----- contact -----
  const EMAIL = 'abdullahalsehli7@gmail.com';
  const copyBtn = document.getElementById('copyEmail');
  const copyStatus = document.getElementById('copyStatus');
  copyBtn.addEventListener('click', async () => {
    try { await navigator.clipboard.writeText(EMAIL); copyStatus.textContent = 'Email copied.'; }
    catch { copyStatus.textContent = EMAIL; }
    setTimeout(() => { copyStatus.textContent = ''; }, 2500);
  });
  const form = document.getElementById('contactForm');
  const formStatus = document.getElementById('formStatus');
  form.addEventListener('submit', e => {
    e.preventDefault();
    const nameField = form.elements.namedItem('name');
    const messageField = form.elements.namedItem('message');
    const name = nameField.value.trim(), msg = messageField.value.trim();
    if (!name || !msg) {
      formStatus.textContent = 'Please add your name and a message.';
      (name ? messageField : nameField).focus();
      return;
    }
    const href = `mailto:${EMAIL}?subject=${encodeURIComponent('Portfolio message from ' + name)}&body=${encodeURIComponent(msg + '\n\n— ' + name)}`;
    formStatus.textContent = 'Opening your email app…';
    window.location.href = href;
  });

  // Content is visible without animation or third-party scripts.
})();
