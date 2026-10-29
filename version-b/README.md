# Abdullah Alsehli — Neural Portfolio

An illustrated, static portfolio in the existing project. No build step, framework migration, npm dependencies, or external runtime scripts are required.

## Preview

```sh
python -m http.server 5481 --bind 127.0.0.1
```

Open http://127.0.0.1:5481 from this directory.

## Files

- `index.html`: sections in this order: Home, About (01), Experience & Leadership (02), Featured Projects (03), Technical Skills (04), Education (05), Training & Certifications (06), Volunteering & Activities (07), Achievements & Highlights (08), Contact (09). Six featured projects show first; the other six open with View More Projects. Certificate entries link to the files in `assets/certs/` and show thumbnails from `assets/certs/thumbs/`.
- `css/style.css`: illustrated study palette, local handwritten type, responsive layout, focus styles and reduced-motion presentation.
- `js/split-head.js`: the split head, opened by the whole page. Both pieces are cut at runtime from the single `character.webp` along one perspective ellipse under the eyes (complementary masks, so they reassemble pixel-exact). Progress runs from the top of the page to the very bottom (recomputed when the page height changes): the top piece stays pinned near the top of the viewport, the lower piece (cheeks, frown, chin) travels down through every section and comes to rest in Contact, just above the footer. The membrane between them is the face's own skin: its colours are sampled from the artwork just above and below the cut and every shading effect fades out at both rims, so it grows seamlessly out of both pieces. It is redrawn every frame in thin screen-space slices (never a stretched image) and goes from a smooth pull to hairline cracks, soft staggered holes and finally mozzarella-like strings between skin collars, always staying connected. Scroll progress is smoothed, never hijacked, and fully reversible.
- `js/neural.js`: scroll layout helper. Measures the head slot and hands the split head its geometry, keeps the intro text beside the pinned head on desktop, and softly highlights cards as they scroll in. No fibers or roots are drawn anywhere on the page.
- `js/main.js`: mobile menu and Escape behavior, active navigation, project filters and the View More Projects toggle (visible cards are re-alternated left/right so they always read in order), details, pointer tilt, clipboard and email-draft form.
- `assets/art/`: full character (the source of both head pieces) and illustrated room in WebP format. `neural.webp` is no longer loaded. `head-upper.webp`/`head-lower.webp` are from the previous version and are no longer loaded. See `ART-DIRECTION.md` for generation prompts and source notes.
- `assets/fonts/`: self-hosted Gaegu and Patrick Hand fonts and their OFL license files.
- Existing project thumbnails, CV and certificate PDFs are preserved. `assets/certs/` also holds copies of certificates from `Desktop/شهادات` (originals untouched); the Alibaba Cloud Computing Engineer copy has its serial number covered. `assets/certs/thumbs/` has 360px WebP previews.
- `.redesign-backup/`: original source files before the raster redesign. `.checkpoints/2026-10-25-before-split-rework/` and `.checkpoints/2026-10-25-before-membrane/`, `.checkpoints/2026-10-25-before-no-roots/`, `.checkpoints/2026-10-25-before-full-page-split/`: source checkpoints before the split-head rework and before the skin membrane. Neither is used by the app.

## Animation and accessibility

Animation reads actual `scrollY` and runs only on requested animation frames after scrolling or layout changes. There is no continuous idle render loop. `ResizeObserver`, font readiness, orientation/viewport changes and project interactions refresh attachment positions. Canvas pixel density is capped at 1.5 for phone performance. The primary illustrations are raster assets; SVG remains only for small functional UI icons.

`prefers-reduced-motion: reduce` removes the pinned split, animated transforms and pointer tilt. The character scrolls naturally, a static portrait occupies the About slot, and the neural column stays available. Motion preference changes apply without reloading. The content does not depend on reveal animations or a CDN becoming available.

The contact form validates locally and opens an email draft through the visitor's email application. It does not send mail through a server. Copy email works on localhost/HTTPS, with a visible address fallback if clipboard access is unavailable.

## Verification

Verified in local Microsoft Edge/Chromium with browser screenshots:

- Text and links in the original main content remain identical; all 9 projects retained.
- All 8 CV/certificate links return HTTP 200.
- Five filters, nine expandable detail panels, mobile menu/Escape, clipboard and form validation work.
- At scroll positions 100, 250 and 420, the upper head remains at the same viewport coordinate while the lower piece moves down. Returning to zero closes the seam.
- No horizontal overflow at widths 320, 390, 768, 1024, 1440 and 1920.
- Reduced motion disables pinning and splitting; no JavaScript errors or failed asset requests during verification.

External project URLs were preserved; their remote availability and delivery through a visitor's email application were not end-to-end tested.
