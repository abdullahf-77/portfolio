// Each entry points at a real file in public/assets/certs. Issuer and date are as printed on it.
// thumb defaults to certs/thumbs/<file stem>.webp

export type CertCategory = 'AI & ML' | 'Agentic & GenAI' | 'Computer Vision' | 'Cloud' | 'Data & Programming' | 'Recognition';
export type CertKind = 'Certificate' | 'Certification' | 'Badge' | 'Attendance' | 'Appreciation' | 'Membership';

export type Cert = {
  id: string;
  title: string;
  issuer: string;
  date: string;
  category: CertCategory;
  kind: CertKind;
  file: string;
  verify?: string;
  featured?: string; // short tab label for the folder
  tabBy?: string; // short issuer on the tab
  note?: string;
};

export const certificates: Cert[] = [
  { id: 'agentic', title: 'Advanced Agentic AI Systems Engineering', issuer: 'SDAIA Academy', date: '4–8 Oct 2026', category: 'Agentic & GenAI', kind: 'Certificate', file: 'sdaia-agentic-ai.pdf', featured: 'SDAIA agents', tabBy: 'SDAIA' },
  { id: 'meta', title: 'AI Bootcamp using Meta Tools', issuer: 'Tuwaiq Academy', date: '18 Oct – 12 Nov 2026 · 80 h', category: 'Agentic & GenAI', kind: 'Certificate', file: 'tuwaiq-meta-ai-bootcamp.webp', featured: 'Tuwaiq × Meta', tabBy: 'Tuwaiq', note: 'ID number redacted' },
  { id: 'cv', title: 'Computer Vision for Developers', issuer: 'SDAIA Academy', date: '9–13 Aug 2026', category: 'Computer Vision', kind: 'Certificate', file: 'sdaia-computer-vision.pdf', featured: 'SDAIA vision', tabBy: 'SDAIA' },
  { id: 'ts', title: 'Time Series Analysis & Forecasting', issuer: 'SDAIA Academy', date: '12–14 Oct 2026', category: 'AI & ML', kind: 'Certificate', file: 'sdaia-time-series.pdf', featured: 'SDAIA time series', tabBy: 'SDAIA' },
  { id: 'alibaba', title: 'Cloud Computing Engineer', issuer: 'Alibaba Cloud · Tuwaiq Academy', date: 'Sep 2026 · valid to Sep 2028', category: 'Cloud', kind: 'Certification', file: 'alibaba-cloud-computing-engineer.png', featured: 'Alibaba cloud', tabBy: 'Alibaba' },
  { id: 'ethics', title: 'AI Ethics', issuer: 'Ministry of Communications and IT · National eLearning Center', date: '12 Sep 2026', category: 'AI & ML', kind: 'Certificate', file: 'mcit-ai-ethics.pdf', featured: 'MCIT ethics', tabBy: 'MCIT' },
  { id: 'kanz', title: 'Kanz AI Hackathon 2026: Workshop Completion', issuer: 'Kanz AI Program · LAU Academy of Continuing Education', date: '15 Jul 2026', category: 'Recognition', kind: 'Certificate', file: 'kanz-ai-hackathon-2026.pdf', featured: 'Kanz hackathon', tabBy: 'Kanz AI', note: 'CookFinder: AI Showcase Featured Project' },
  { id: 'linalg', title: 'Linear Algebra for Machine Learning and Data Science', issuer: 'DeepLearning.AI · Coursera', date: '17 Dec 2025', category: 'AI & ML', kind: 'Certificate', file: 'coursera-linear-algebra-ml.jpg', verify: 'https://coursera.org/verify/ZTQKARUHDWE0', featured: 'DeepLearning.AI', tabBy: 'Coursera' },

  { id: 'aws', title: 'AWS Certified AI Practitioner: Learning Path', issuer: 'Saudi Digital Academy (MCIT) with AWS', date: 'Aug 2026', category: 'Cloud', kind: 'Certificate', file: 'mcit-aws-ai-practitioner.pdf' },
  { id: 'samai-f', title: 'Fundamentals of Artificial Intelligence', issuer: 'SDAIA · One Million Saudis in AI', date: '19 Sep 2025', category: 'AI & ML', kind: 'Certificate', file: 'sdaia-fundamentals-ai.pdf' },
  { id: 'samai-c', title: 'AI Concepts & Advanced Applications', issuer: 'SDAIA · One Million Saudis in AI', date: '19 Sep 2025', category: 'AI & ML', kind: 'Certificate', file: 'sdaia-ai-concepts.pdf' },
  { id: 'neon', title: 'AI ERA NEON Bootcamp: Artificial Intelligence Path', issuer: 'AI ERA by NEON', date: 'May 2026', category: 'AI & ML', kind: 'Certificate', file: 'ai-era-neon-bootcamp.pdf', note: 'Participation' },
  { id: 'ibm-ga', title: 'Supercharge Your Data Analytics with Generative AI', issuer: 'IBM SkillsBuild', date: '27 Apr 2026', category: 'Agentic & GenAI', kind: 'Certificate', file: 'ibm-genai-data-analytics.pdf' },
  { id: 'ibm-agents', title: 'Unleashing the Power of AI Agents', issuer: 'IBM SkillsBuild', date: '', category: 'Agentic & GenAI', kind: 'Badge', file: 'ibm-badge-ai-agents.png' },
  { id: 'ibm-llm', title: 'Introduction to Large Language Models', issuer: 'IBM SkillsBuild', date: '', category: 'Agentic & GenAI', kind: 'Badge', file: 'ibm-badge-llms.png' },
  { id: 'ibm-chat', title: 'Build Your First Chatbot', issuer: 'IBM SkillsBuild', date: '', category: 'Agentic & GenAI', kind: 'Badge', file: 'ibm-badge-first-chatbot.png' },
  { id: 'ibm-swe', title: 'Use Generative AI for Software Development', issuer: 'IBM SkillsBuild', date: '', category: 'Agentic & GenAI', kind: 'Badge', file: 'ibm-badge-genai-software.png' },
  { id: 'ibm-granite', title: 'Summarizing Data Using IBM Granite', issuer: 'IBM SkillsBuild', date: '', category: 'Agentic & GenAI', kind: 'Badge', file: 'ibm-badge-granite.png' },
  { id: 'ibm-tts', title: 'Explore Text to Speech Using IBM watsonx', issuer: 'IBM SkillsBuild', date: '', category: 'Agentic & GenAI', kind: 'Badge', file: 'ibm-badge-text-to-speech.png' },
  { id: 'michigan', title: 'Introduction to Data Science in Python', issuer: 'University of Michigan · Coursera', date: '11 Apr 2026', category: 'Data & Programming', kind: 'Certificate', file: 'coursera-intro-data-science-python.jpg', verify: 'https://coursera.org/verify/EUJDI95S9H9T' },
  { id: 'ml101', title: 'Machine Learning (ML) 101', issuer: 'Satr · Tuwaiq Academy', date: 'Apr 2026', category: 'AI & ML', kind: 'Certificate', file: 'satr-ml-101.pdf' },
  { id: 'ds', title: 'Introduction to Data Science', issuer: 'Satr · Tuwaiq Academy', date: 'Feb 2026', category: 'Data & Programming', kind: 'Certificate', file: 'satr-intro-data-science.pdf' },
  { id: 'py101', title: 'Python 101', issuer: 'Satr · Tuwaiq Academy', date: 'Jan 2026', category: 'Data & Programming', kind: 'Certificate', file: 'satr-python-101.pdf' },
  { id: 'py102', title: 'Python 102', issuer: 'Satr · Tuwaiq Academy', date: 'Jan 2026', category: 'Data & Programming', kind: 'Certificate', file: 'satr-python-102.pdf' },
  { id: 'py103', title: 'Python 103', issuer: 'Satr · Tuwaiq Academy', date: 'Jan 2026', category: 'Data & Programming', kind: 'Certificate', file: 'satr-python-103.pdf' },
  { id: 'py104', title: 'Python 104', issuer: 'Satr · Tuwaiq Academy', date: 'Jan 2026', category: 'Data & Programming', kind: 'Certificate', file: 'satr-python-104.pdf' },
  { id: 'sql101', title: 'SQL 101', issuer: 'Satr · Tuwaiq Academy', date: 'Jan 2026', category: 'Data & Programming', kind: 'Certificate', file: 'satr-sql-101.pdf' },
  { id: 'sql102', title: 'SQL 102', issuer: 'Satr · Tuwaiq Academy', date: 'Feb 2026', category: 'Data & Programming', kind: 'Certificate', file: 'satr-sql-102.pdf' },
  { id: 'sql103', title: 'SQL 103', issuer: 'Satr · Tuwaiq Academy', date: 'Feb 2026', category: 'Data & Programming', kind: 'Certificate', file: 'satr-sql-103.pdf' },
  { id: 'git', title: 'Git & GitHub (16-hour program)', issuer: 'Pathy', date: '18 Aug 2026', category: 'Data & Programming', kind: 'Certificate', file: 'git-github.pdf' },
  { id: 'eyouth', title: 'EYOUTH Learning Plan', issuer: 'IBM SkillsBuild', date: '20 Jan 2026', category: 'AI & ML', kind: 'Certificate', file: 'ibm-eyouth-plan.pdf' },

  { id: 'unesco', title: '4th UNESCO Global Forum on the Ethics of AI: ICAIRE booth', issuer: 'ICAIRE', date: '14–17 Sep 2026', category: 'Recognition', kind: 'Appreciation', file: 'unesco-global-forum-2026.pdf' },
  { id: 'leap', title: 'LEAP 2026: Volunteer Representative', issuer: 'Artificial Intelligence Association', date: 'Aug – Sep 2026', category: 'Recognition', kind: 'Appreciation', file: 'leap26-ai-association.pdf' },
  { id: 'pioneers', title: 'Educational Content Department', issuer: 'AI Pioneers · روّاد', date: 'Oct 2026', category: 'Recognition', kind: 'Membership', file: 'ai-pioneers-membership.png' },
  { id: 'afaq', title: 'Afaq AI Initiative, 3rd cohort', issuer: 'AI Pioneers with eYouth & IBM SkillsBuild', date: '17–20 Jan 2026', category: 'Recognition', kind: 'Attendance', file: 'ai-pioneers-afaq-attendance.png' },
  { id: 'talk-ali', title: 'AI Tools from Alibaba Cloud (talk)', issuer: 'Tuwaiq Academy', date: '22 Jul 2026', category: 'Recognition', kind: 'Attendance', file: 'alibaba-ai-tools.pdf' },
  { id: 'talk-think', title: 'How Do AI Systems Think? (talk)', issuer: 'Tuwaiq Academy', date: '29 Jul 2026', category: 'Recognition', kind: 'Attendance', file: 'tuwaiq-talk-ai-systems-think.pdf' },
  { id: 'talk-gen', title: 'Generative AI and the Future of Innovation (talk)', issuer: 'Tuwaiq Academy', date: '5 Aug 2026', category: 'Recognition', kind: 'Attendance', file: 'tuwaiq-talk-generative-ai.png' },
  { id: 'club', title: 'Tuwaiq Club member badge', issuer: 'Tuwaiq Academy clubs', date: '', category: 'Recognition', kind: 'Badge', file: 'tuwaiq-club-member-badge.png' },
];

export const awaiting = { title: 'Samsung Innovation Campus: Artificial Intelligence', issuer: 'Samsung with Misk', date: '27 Sep – 21 Nov 2026', status: 'Programme finished · certificate not yet issued' };

export const thumbOf = (c: Cert) => `certs/thumbs/${c.file.replace(/\.[^.]+$/, '')}.webp`;

// Issuer -> org key in orgs.ts (for the logo). Unknown issuers show text only.
export const orgOf = (c: Cert): string | undefined =>
  /SDAIA/.test(c.issuer) ? 'sdaia' : /Tuwaiq|Satr/.test(c.issuer) ? 'tuwaiq' : /AI Pioneers/.test(c.issuer) ? 'pioneers'
  : /Artificial Intelligence Association/.test(c.issuer) ? 'aia' : /ICAIRE/.test(c.issuer) ? 'icaire' : undefined;
