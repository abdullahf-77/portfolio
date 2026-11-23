# Abdullah Alsehli: portfolio (journey edition)

React + TypeScript + Vite + Tailwind CSS v4 + Motion + Lucide. Built as a separate project. The live site at
`abdullahf-77/portfolio` has **not** been touched.

## Run

```bash
npm install
npm run dev        # http://localhost:5475
npm run build      # production build in dist/
npm run preview    # serve dist/ at http://localhost:5476
```

## Edit your content (no layout code needed)

| What | File |
|---|---|
| Name, headline, intro, about, email, links, photo | `src/content/profile.ts` |
| Journey timeline (chapters and the code the editor types) | `src/content/journey.ts` |
| Experience & leadership | `src/content/experience.ts` |
| Featured projects and "More work" | `src/content/projects.ts` |
| Skills | `src/content/skills.ts` |
| Certificates (gallery and folder tabs) | `src/content/certificates.ts` |
| Organisation names and logos | `src/content/orgs.ts` |

Assets live in `public/assets/` (`logos/`, `certs/`, `certs/thumbs/`, `projects/`).
To add a certificate, drop the file in `certs/`, add a 640px `.webp` thumbnail with the same name in `certs/thumbs/`, and add one line to `certificates.ts`.

To use a photo, put it at `public/assets/profile/abdullah.webp` and set `photo: 'profile/abdullah.webp'` in `profile.ts`.

Sources and verification status are kept in a private content inventory.

## Deploy (only after approval)

`base: './'` in `vite.config.ts` means the build works at any sub-path, including `/portfolio/`.
`.github/workflows/deploy.yml` builds and publishes to GitHub Pages on every push to `main`.
