// "Back to the yard" tab. Injected into each portfolio's HTML only when it is served through the
// gateway (serve.py / build.py); the portfolio files themselves never contain it.
// Everything lives in a shadow root so neither portfolio's CSS can reach it, and it adds nothing to their DOM flow.
(function () {
  if (window.self !== window.top) return; // not inside the compare frames
  var script = document.currentScript;
  if (!script || customElements.get('gateway-back-tab')) return;
  var root = new URL('../', script.src).href; // gateway root, also under a sub-path deploy
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)');

  // the yard's hand-lettering; fonts must be registered on the document to reach a shadow root
  if (window.FontFace && document.fonts) {
    var hand = new FontFace('GatewayHand', 'url(' + root + 'assets/fonts/patrick-hand.ttf)');
    hand.load().then(function (f) { document.fonts.add(f); }).catch(function () {});
  }

  var css =
    ':host{all:initial;position:fixed;left:max(14px,env(safe-area-inset-left));bottom:max(14px,env(safe-area-inset-bottom));z-index:2147483000}' +
    'a{position:relative;display:inline-flex;align-items:center;gap:7px;min-height:40px;padding:8px 14px 7px 12px;color:#2a1611;text-decoration:none;' +
    "font:400 16px/1.1 GatewayHand,'Patrick Hand','Comic Sans MS',cursive;white-space:nowrap;" +
    'background:#c9b39b linear-gradient(160deg,#d8c4ab,#b9a084);border-radius:2px 5px 3px 6px;' +
    'box-shadow:3px 6px 12px #000c,inset 0 0 12px #6b402a44;transform:rotate(-3deg);opacity:.86;' +
    'transition:transform .3s cubic-bezier(.3,1.4,.5,1),opacity .3s,box-shadow .3s;-webkit-tap-highlight-color:transparent}' +
    'a::before{content:"";position:absolute;top:-7px;left:50%;width:3px;height:12px;background:#8b3c36;transform:rotate(-12deg);box-shadow:1px 1px 3px #000}' +
    'a:hover,a:focus-visible{opacity:1;transform:rotate(-1deg) translateY(-3px);box-shadow:3px 9px 16px #000d,0 0 18px #e3262e33,inset 0 0 12px #6b402a44}' +
    'a:focus-visible{outline:2px solid #ff6864;outline-offset:5px}' +
    '.arrow{color:#8b1f24;font-size:18px;transition:transform .3s}' +
    'a:hover .arrow{transform:translateX(-3px)}' +
    '@media (max-width:480px){a{font-size:15px;padding:7px 11px 6px 10px}}' +
    '@media (prefers-reduced-motion:reduce){a,.arrow{transition:none}}';

  customElements.define('gateway-back-tab', class extends HTMLElement {
    connectedCallback() {
      if (this.shadowRoot) return;
      var shadow = this.attachShadow({ mode: 'open' });
      shadow.innerHTML = '<style>' + css + '</style>' +
        '<a href="' + root + '" aria-label="Back to the yard: choose a portfolio version">' +
        '<span class="arrow" aria-hidden="true">&larr;</span>back to the yard</a>';
      shadow.querySelector('a').addEventListener('click', leave);
    }
  });

  // short fade into the yard's soot black before leaving, so the return feels like a scene change
  function leave(ev) {
    if (ev.button !== 0 || ev.metaKey || ev.ctrlKey || ev.shiftKey || ev.altKey) return;
    ev.preventDefault();
    var href = ev.currentTarget.href;
    if (reduce.matches) { window.location.href = href; return; }
    var veil = document.createElement('div');
    veil.setAttribute('aria-hidden', 'true');
    veil.style.cssText = 'position:fixed;inset:0;z-index:2147483001;pointer-events:none;background:#080909;opacity:0;transition:opacity .45s ease';
    document.body.appendChild(veil);
    void veil.offsetWidth;
    veil.style.opacity = '1';
    setTimeout(function () { window.location.href = href; }, 470);
    // coming back here via the browser's back button: drop the veil again
    window.addEventListener('pageshow', function () { veil.remove(); }, { once: true });
  }

  var tab = document.createElement('gateway-back-tab');
  (document.body || document.documentElement).appendChild(tab);
})();
