# Portfolio Gateway

The entrance to both portfolio versions: two hand-drawn wooden signboards standing on the rug of
Version B's illustrated study. Static HTML/CSS/JS, no build step, no dependencies.

- Left sign: **Version A — Weak Prompt** → `version-a/`
- Right sign: **Version B — Strong Prompt** → `version-b/`
- Paper scrap on the floor: **compare both** — both live sites side by side (tabs on phones)

Both portfolios live in this repo, unedited, as `version-a/` (from `Projects/portfolio`) and `version-b/` (from `Projects/neural-portfolio`).

## Back to the yard

When a portfolio page is served through the gateway, one `<script src="../js/back-tab.js" defer>` is
added before `</body>` in the response (`serve.py`) or in the `dist/` copy (`build.py`). The files in
`version-a/` and `version-b/` never contain it, so opening either portfolio on its own shows
no tab. The script draws a pinned paper scrap, "← back to the yard", fixed bottom-left inside a shadow
root (neither site's CSS can touch it), fades to soot black and returns to the gateway root. It draws
nothing inside the compare frames.

## Run

```sh
python serve.py 5490
```

Open http://127.0.0.1:5490 (also the `portfolio-gateway` launch config).

| URL | Serves |
| --- | --- |
| `/` | this landing page |
| `/version-a/` | `version-a/` (untouched) |
| `/version-b/` | `version-b/` (untouched) |

## Deploy

Every push to `main` runs `.github/workflows/deploy.yml`: it runs `python build.py` and publishes `dist/`
to GitHub Pages at https://abdullahf-77.github.io/portfolio/.

`build.py` writes `dist/` with the landing page plus clean copies of both portfolios (backup folders,
`.md` and `.py` files are left out) and the back-tab script injected. Run it locally to check a build.

## Files

- `index.html` — scene markup; SVG displacement filters give wood and paper their wobbly inked edges.
- `css/gateway.css` — Version B's tokens (soot, charcoal, parchment, oxblood, scarlet), Gaegu and
  Patrick Hand fonts, procedural wood grain (inline SVG turbulence), signs, shadows, compare overlay, phone layout.
- `js/gateway.js` — pointer tilt, the head leaning toward the hovered sign, embers, the camera push into
  the chosen poster, back/forward-cache reset, compare overlay (Esc, focus return, inert background).
- `js/back-tab.js` — the "back to the yard" tab injected into the portfolios when served from here.
- `assets/art/` — `study.webp` and `character.webp`, copied from Version B.
- `assets/fonts/` — Gaegu and Patrick Hand with their OFL licences, copied from Version B.
- `assets/previews/` — real screenshots of each version's hero (1440×900, headless Edge), shown on the boards.
  Retake them if a hero changes.

## Behaviour

- Idle: signs sway on their posts out of phase, lamp and CRT glow flicker, embers rise, fog drifts.
- Hover / keyboard focus: board lifts and tilts toward the pointer, its poster leaves sepia for true
  colour, red light blooms on the wall behind, the label is underlined, the character leans toward it.
- Select: the room dims under an overlay while a plain copy of that poster flies up to fill the screen,
  then it fades to the version's own background colour and navigates (~1s). Only `transform` and
  `opacity` animate, so the SVG-filtered wood is never repainted mid-flight (measured: steady 60fps,
  no dropped frames). The version is prefetched on hover/focus/touch. Ctrl/⌘/middle-click open normally.
- `prefers-reduced-motion`: no sway, embers or push-in; selecting is a short fade.

## Backups

Verified copies of both portfolios made before this project, with SHA-256 manifests:
`../_backups/2026-10-25-before-gateway/`. Check with
`cd ../portfolio && sha256sum -c ../_backups/2026-10-25-before-gateway/portfolio.sha256`.
