export type Role = {
  org: string; // key in orgs.ts
  coOrg?: string;
  orgLine: string;
  title: string;
  type: 'Cooperative training' | 'Volunteer' | 'Academic leadership';
  when?: string;
  place?: string;
  points: string[];
  evidence?: { label: string; href: string };
};

export const roles: Role[] = [
  {
    org: 'sdaia',
    coOrg: 'icaire',
    orgLine: 'SDAIA · International Center for AI Research and Ethics (ICAIRE), a UNESCO Category 2 centre',
    title: 'Cooperative Training, Artificial Intelligence',
    type: 'Cooperative training',
    when: 'Jun 2026 – present',
    place: 'Riyadh · on-site',
    points: [
      'Developed 3 AI-powered features that streamline workflows and improve the user experience.',
      'Designed 3 interactive dashboard components; tested and delivered 4 data-driven features with a 5-member team.',
      'Built Ethical-AI Atlas: Python pipelines that source AI-ethics papers and research centres and classify them against the UNESCO principles, served by FastAPI to a React front end.',
      'Built an AI-ethics news pipeline and the Ethical AI Journal prototype; contributed to AI ethics and governance initiatives.',
    ],
  },
  {
    org: 'pioneers',
    orgLine: 'AI Pioneers · روّاد',
    title: 'Educational Content Department Member',
    type: 'Volunteer',
    when: 'Oct 2026 – present',
    points: [
      'Research, prepare, review and organise educational content that makes AI concepts and applications easier to understand.',
      'Review technical material with the team for accuracy, clarity and accessibility, with source documentation.',
    ],
    evidence: { label: 'Certificate of membership', href: 'certs/ai-pioneers-membership.png' },
  },
  {
    org: 'uqu',
    orgLine: 'Robotics & AI Club · Umm Al-Qura University',
    title: 'Educational Content Lead',
    type: 'Academic leadership',
    points: ['Leads the club’s educational content on artificial intelligence and robotics.'],
  },
];

// Volunteering & events. `role` is what the evidence supports, nothing more.
export type EventItem = {
  id: string;
  name: string;
  short: string;
  logos: string[]; // org keys
  role: string;
  kind: 'Volunteer' | 'Participant' | 'Presenter' | 'Attendee';
  when: string;
  place?: string;
  text: string;
  evidence?: { label: string; file: string; thumb: string };
};

export const events: EventItem[] = [
  {
    id: 'gfeai',
    name: '4th UNESCO Global Forum on the Ethics of AI',
    short: 'GFEAI 2026',
    logos: ['gfeai', 'icaire'],
    role: 'Event Operations Volunteer · ICAIRE booth',
    kind: 'Volunteer',
    when: '14–17 Sep 2026',
    place: 'Riyadh',
    text: 'Represented ICAIRE at its exhibition booth: introduced visitors to the centre’s services, initiatives and AI-ethics agenda, and supported booth activities and conversations on responsible AI and governance.',
    evidence: { label: 'Certificate of appreciation, ICAIRE', file: 'certs/unesco-global-forum-2026.pdf', thumb: 'certs/thumbs/unesco-global-forum-2026.webp' },
  },
  {
    id: 'leap',
    name: 'LEAP 2026',
    short: 'LEAP 2026',
    logos: ['leap', 'aia'],
    role: 'Volunteer Representative · Artificial Intelligence Association',
    kind: 'Volunteer',
    when: '31 Aug – 3 Sep 2026',
    place: 'Riyadh · SDAIA pavilion',
    text: 'Helped prepare and represent the Artificial Intelligence Association at its booth in the SDAIA pavilion, introducing its mission and explaining AI concepts and applications to visitors.',
    evidence: { label: 'Certificate of thanks & appreciation, AIA', file: 'certs/leap26-ai-association.pdf', thumb: 'certs/thumbs/leap26-ai-association.webp' },
  },
];

export const otherEvents: EventItem[] = [
  { id: 'kanz', name: 'Kanz AI Hackathon 2026', short: 'Kanz AI', logos: ['kanz'], role: 'Participant · built CookFinder', kind: 'Participant', when: '15 Jul 2026', text: 'Built a working AI project during the hackathon; CookFinder was the AI Showcase Featured Project.', evidence: { label: 'Workshop-completion certificate', file: 'certs/kanz-ai-hackathon-2026.pdf', thumb: 'certs/thumbs/kanz-ai-hackathon-2026.webp' } },
  { id: 'rainbow', name: 'Digital Rainbow', short: 'Digital Rainbow', logos: ['uqu'], role: 'Presenter · Nexus AIoT', kind: 'Presenter', when: '', text: 'Presented the Nexus AIoT graduation project, a touchless smart environment controlled by hand gestures.' },
  { id: 'talks', name: 'Tuwaiq Academy AI talks', short: 'Tuwaiq talks', logos: ['tuwaiq'], role: 'Attendee', kind: 'Attendee', when: 'Jul – Aug 2026', text: 'AI Tools from Alibaba Cloud · How Do AI Systems Think? · Generative AI and the Future of Innovation.' },
];
