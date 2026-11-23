// Everything personal lives in src/content. Layout components never hard-code facts.
// Sources and verification status: see CONTENT_INVENTORY.md at the project root.

export const profile = {
  name: 'Abdullah Faisal Alsehli',
  first: 'Abdullah',
  last: 'Alsehli',
  headline: 'AI Engineer · Agentic AI & Generative AI · Machine Learning',
  kicker: 'AI Engineer · Agentic & Generative AI · Makkah → Riyadh',
  lede: {
    lead: 'I build AI systems that can be checked.',
    rest: 'Agents that cite their sources, vision models that watch a construction site, and LLM products where the model handles language and the code does the maths.',
  },
  about: [
    'I’m an AI engineer from Makkah, now training in Riyadh at SDAIA’s International Center for AI Research and Ethics (ICAIRE). I work across the stack of an AI product: data pipelines, models, agent orchestration, APIs and the interface people actually use.',
    'What keeps me going is the gap between a demo and a system you can trust. So I keep the number-crunching in deterministic code, make agents show their evidence, and evaluate on held-out data before I believe a metric.',
    'Lately that means agentic and generative AI: LangGraph agents, RAG with page-level citations, and Llama-powered assistants for Arabic-speaking users.',
  ],
  facts: [
    { k: 'Now', v: 'Cooperative trainee, SDAIA · ICAIRE (Riyadh)' },
    { k: 'Degree', v: 'B. Artificial Intelligence, Umm Al-Qura University' },
    { k: 'GPA', v: '3.86 / 4.00' },
    { k: 'Languages', v: 'Arabic (native) · English (excellent)' },
  ],
  photo: 'profile/abdullah.webp' as string | null, // LinkedIn profile photo, approved 2026-11-23
  email: 'abdullahalsehli7@gmail.com',
  phone: { display: '+966 54 512 3413', tel: '+966545123413' },
  links: {
    github: 'https://github.com/abdullahf-77',
    linkedin: 'https://www.linkedin.com/in/abdullah-f-alsehli/',
    repos: 'https://github.com/abdullahf-77?tab=repositories',
  },
};

export const education = {
  school: 'Umm Al-Qura University',
  degree: 'Bachelor’s Degree in Artificial Intelligence',
  years: '2023 – 2027',
  gpa: '3.86',
  gpaOf: '4.00',
  place: 'Makkah, Saudi Arabia',
  logo: 'logos/uqu.svg',
  notes: [
    'Machine learning, deep learning, computer vision and AI application development',
    'Graduation project: Nexus AIoT, a touchless smart environment',
  ],
};
