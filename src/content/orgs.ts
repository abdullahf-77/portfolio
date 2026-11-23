export type Org = {
  id: string;
  name: string;
  short: string;
  logo?: string; // path under public/assets
  logoDark?: string; // variant for dark backgrounds
  mono?: boolean; // single-colour mark that should follow the text colour
  monoAspect?: string; // CSS aspect-ratio for mono marks (default 2 / 3)
  url?: string;
};

export const orgs: Record<string, Org> = {
  uqu: { id: 'uqu', name: 'Umm Al-Qura University', short: 'UQU', logo: 'logos/uqu.svg', mono: true, url: 'https://uqu.edu.sa' },
  sdaia: { id: 'sdaia', name: 'Saudi Data & AI Authority', short: 'SDAIA', logo: 'logos/sdaia.png', url: 'https://sdaia.gov.sa' },
  icaire: { id: 'icaire', name: 'International Center for AI Research and Ethics', short: 'ICAIRE', logo: 'logos/icaire.webp', logoDark: 'logos/icaire-white.webp' },
  sdaiaAcademy: { id: 'sdaiaAcademy', name: 'SDAIA Academy', short: 'SDAIA Academy', logo: 'logos/sdaia.png' },
  pioneers: { id: 'pioneers', name: 'AI Pioneers · روّاد', short: 'AI Pioneers', logo: 'logos/ai-pioneers.png' },
  tuwaiq: { id: 'tuwaiq', name: 'Tuwaiq Academy', short: 'Tuwaiq', logo: 'logos/tuwaiq.svg', url: 'https://tuwaiq.edu.sa' },
  aia: { id: 'aia', name: 'Artificial Intelligence Association', short: 'AIA', logo: 'logos/aia.png' },
  samsung: { id: 'samsung', name: 'Samsung Innovation Campus', short: 'SAMSUNG' },
  misk: { id: 'misk', name: 'Misk Foundation', short: 'Misk', logo: 'logos/misk-white.png', mono: true, monoAspect: '520 / 263', url: 'https://misk.org.sa' },
  leap: { id: 'leap', name: 'LEAP 2026', short: 'LEAP', logo: 'logos/leap-white.svg', mono: true, monoAspect: '1786 / 416' },
  gfeai: { id: 'gfeai', name: '4th UNESCO Global Forum on the Ethics of AI', short: 'GFEAI', logo: 'logos/gfeai.webp' },
  kanz: { id: 'kanz', name: 'Kanz AI', short: 'Kanz AI' },
  neon: { id: 'neon', name: 'AI ERA by NEON', short: 'NEON' },
};
