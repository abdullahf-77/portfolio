// Featured projects, ranked by technical evidence (see PORTFOLIO_AUDIT.md for the scoring).
// Every number, step and screenshot comes from the repo, its README or the running app.

export type FlowStep = { label: string; detail: string; actor: 'user' | 'llm' | 'code' | 'model' | 'data' | 'ui' };
export type Shot = { src: string; caption: string };
export type Metric = { k: string; a: number; b?: number };

export type Interactive = 'wasl' | 'ribh' | 'journal' | 'graph' | 'ppe' | 'cookfinder' | 'nexus';

export type Project = {
  id: string;
  no: string;
  title: string;
  category: string;
  context: string;
  problem: string;
  solution: string;
  decisions: { k: string; v: string }[];
  tags: string[];
  links: { label: string; href: string }[];
  interactive: Interactive;
  interactiveLabel: string;
  flow: (FlowStep | FlowStep[])[]; // an inner array runs in parallel
  shots?: Shot[];
  results?: { title: string; legend: [string, string?]; metrics: Metric[]; note: string; image?: Shot };
  tone: 'light' | 'dark' | 'teal';
};

export const featured: Project[] = [
  {
    id: 'wasl',
    no: '01',
    title: 'Wasl',
    category: 'Agentic AI · Full stack',
    context: 'Team project · LangGraph · FastAPI · Next.js',
    problem: 'Professionals rewrite the same achievement for LinkedIn, their CV and every application, and generic AI writers make it faster by inventing metrics, skills and titles.',
    solution: 'One verified source of truth (confirmed achievements and an approved Master CV) that three LangGraph agents turn into LinkedIn posts, CV updates, honest tailored CVs and a skill-gap roadmap, with every output traceable back to it.',
    decisions: [
      { k: 'Never invent', v: 'Enforced in code, not only in prompts: a deterministic claim checker and evidence verification. Rewritten bullets that add claims are rejected.' },
      { k: 'Model router', v: 'Groq, Gemini and OpenRouter adapters with task-tier model choice, retries with backoff, JSON-schema validation plus one repair round, and compatible fallback.' },
      { k: 'Monitoring', v: 'Real events feed a live dashboard: p50/p95/p99 latency, tokens by provider, fallback rate, unsupported-claim rate and threshold alerts.' },
      { k: 'Evaluation', v: '17 hand-written cases, 17/17 passed against real models; 23 backend tests covering units and end-to-end API journeys.' },
      { k: 'My part', v: 'Team of four on Tuwaiq Academy’s AI Product Development programme. I authored the core platform commit (FastAPI backend, AI layer, Next.js front end, docs), the monitoring and evaluation run, and the job-recommendations feature.' },
    ],
    tags: ['LangGraph', 'FastAPI', 'Next.js', 'Supabase', 'Groq · Gemini', 'Pydantic', 'Recharts'],
    links: [{ label: 'GitHub', href: 'https://github.com/Nadaalnashwan/wasl' }],
    interactive: 'wasl',
    interactiveLabel: 'Three agents',
    flow: [
      { label: 'Next.js client', detail: 'Dashboard, Post Studio, CV Manager, Tailor, Gap, Discovery, Monitoring; English and Arabic RTL', actor: 'user' },
      { label: 'FastAPI routers', detail: 'Auth, achievements, posts, CV, career, discovery; monitoring middleware on every request', actor: 'code' },
      [
        { label: 'Content graph', detail: 'generate → claim_check → revise once', actor: 'llm' },
        { label: 'Discovery graph', detail: 'sanitize → extract → verify_evidence → dedupe', actor: 'llm' },
        { label: 'Career graph', detail: 'requirements → match → tailor + enforce | roadmap', actor: 'llm' },
      ],
      { label: 'Guard + AI Model Router', detail: 'Prompt-injection guard; schema-validated structured calls with retries and fallback', actor: 'code' },
      { label: 'Groq · Gemini · OpenRouter', detail: 'Provider adapters; per-attempt telemetry', actor: 'model' },
      { label: 'Deterministic checks', detail: 'claims.py (unsupported claims) and skills.py (explainable matching)', actor: 'code' },
      { label: 'Postgres + RLS · metrics', detail: 'Supabase or SQLite; events become dashboard metrics and alerts', actor: 'data' },
    ],
    shots: [
      { src: 'projects/wasl-landing.webp', caption: 'Wasl landing page in the “blueprint” theme of its hand-drawn design system.' },
      { src: 'projects/wasl-flow.webp', caption: 'How the Wasl machine works: drop in your work, AI extracts and verifies, out comes your career.' },
      { src: 'projects/wasl-features.webp', caption: 'Post Studio, living Master CV, honest tailoring, gap analyser and monitoring.' },
    ],
    results: {
      title: 'Evaluation (17 real-model cases)',
      legend: ['score'],
      metrics: [
        { k: 'Task success', a: 1 },
        { k: 'Skill precision', a: 0.929 },
        { k: 'Skill recall', a: 1 },
        { k: 'Posts with no unsupported claims', a: 1 },
      ],
      note: '17/17 cases passed; one post needed the automatic revise step once. From docs/EVALUATION.md, which itself notes that 17 cases catch regressions but are not a statistically strong accuracy claim.',
    },
    tone: 'dark',
  },
  {
    id: 'ribh',
    no: '02',
    title: 'Ribh',
    category: 'Generative AI · Full stack',
    context: 'Llama · Next.js · TypeScript',
    problem: 'Small Saudi cafés compare supplier quotes for cups, lids and packaging by hand, and the cheapest-looking price often isn’t the real cost once delivery, VAT, MOQ and packaging are counted.',
    solution: 'An Arabic-first purchasing assistant: Llama reads requirements and pasted offers, deterministic code computes the true cost and the winner, and Llama explains the result in plain Arabic.',
    decisions: [
      { k: 'Core rule', v: 'Llama reads and writes language; code does every number and every decision.' },
      { k: 'Guardrails', v: 'Every extracted value must be quoted from the user’s own text. Model explanations are checked for invented numbers, a different winner or quality claims, and replaced with computed text if they fail.' },
      { k: 'Money engine', v: 'Integer halalas with big.js: packaging levels, MOQ, tiers, delivery and VAT, never double-added. Zod validates every input and model output.' },
      { k: 'Testing', v: '66 source files with 18 test and evaluation files: Vitest suites, a held-out extraction set with a scorer, and a multi-turn smoke test.' },
    ],
    tags: ['Llama', 'Next.js', 'TypeScript', 'Zod', 'big.js', 'Vitest'],
    links: [{ label: 'GitHub', href: 'https://github.com/abdullahf-77/ribh' }],
    interactive: 'ribh',
    interactiveLabel: 'One turn',
    flow: [
      { label: 'User message', detail: 'Arabic or English, plus recent history and the structured session state', actor: 'user' },
      { label: 'Plan', detail: 'Llama turns the message into a typed plan: requirement updates, offers, replies, what-ifs', actor: 'llm' },
      { label: 'Validate', detail: 'Zod schemas; values must be quoted from the user; conflicts become cards', actor: 'code' },
      { label: 'Compute', detail: 'Deterministic engine: cost, VAT, MOQ, tiers, eligibility, ranking', actor: 'code' },
      { label: 'Explain', detail: 'Llama explains the computed result', actor: 'llm' },
      { label: 'Verify', detail: 'Reject invented numbers or a different winner; fall back to computed text', actor: 'code' },
    ],
    shots: [
      { src: 'projects/ribh-landing.webp', caption: 'Landing page: describe what you need to buy, in Arabic.' },
      { src: 'projects/ribh-workspace.webp', caption: 'Workspace: the requirements Llama extracted, with the missing fields flagged.' },
      { src: 'projects/ribh-example.webp', caption: 'The app’s own illustrative comparison (labelled in-app as made-up numbers): the cheapest unit price isn’t the cheapest real cost.' },
    ],
    tone: 'light',
  },
  {
    id: 'journal',
    no: '03',
    title: 'Ethical AI Journal',
    category: 'AI research platform',
    context: 'ICAIRE · Python pipeline · React',
    problem: 'AI-ethics research is scattered across arXiv, Semantic Scholar, OpenAlex and Crossref, with no single place that organises it by the principles policymakers actually use.',
    solution: 'A UNESCO Centre / ICAIRE journal: a Python pipeline that discovers, deduplicates and classifies papers, and a React site that presents them by the ten UNESCO Recommendation principles.',
    decisions: [
      { k: 'Classification', v: 'An embedding pre-filter narrows candidates before an LLM confirmation pass (Claude or Gemini), so the expensive call only sees likely matches.' },
      { k: 'Static by design', v: 'Classified papers are baked into the front end at build time; no backend calls at runtime.' },
      { k: 'Shipping', v: 'GitHub Actions builds and deploys to GitHub Pages on every push; 70 commits across pipeline and front end.' },
    ],
    tags: ['Python', 'Embeddings', 'LLM classification', 'React', 'TypeScript', 'CI/CD'],
    links: [
      { label: 'Live site', href: 'https://abdullahf-77.github.io/ethical-ai-journal/' },
      { label: 'GitHub', href: 'https://github.com/abdullahf-77/ethical-ai-journal' },
    ],
    interactive: 'journal',
    interactiveLabel: 'The principles',
    flow: [
      [
        { label: 'arXiv', detail: 'Paper source', actor: 'data' },
        { label: 'Semantic Scholar', detail: 'Paper source', actor: 'data' },
        { label: 'OpenAlex · Crossref', detail: 'Paper sources', actor: 'data' },
      ],
      { label: 'Deduplicate', detail: 'Merge the same paper found in several sources', actor: 'code' },
      { label: 'Embedding pre-filter', detail: 'Keep only papers close to a principle', actor: 'model' },
      { label: 'LLM confirmation', detail: 'Claude or Gemini confirms the classification', actor: 'llm' },
      { label: 'Export', detail: 'JSON for the site, plus Google Sheets', actor: 'code' },
      { label: 'React site', detail: 'Built and deployed to GitHub Pages by GitHub Actions', actor: 'ui' },
    ],
    shots: [
      { src: 'projects/journal-home.webp', caption: 'The live journal’s home page.' },
      { src: 'projects/journal-taxonomy.webp', caption: 'Taxonomy Hub: research organised by the ten UNESCO principles.' },
    ],
    tone: 'teal',
  },
  {
    id: 'rag',
    no: '04',
    title: 'Research Paper Assistant',
    category: 'Agentic AI · RAG',
    context: 'LangGraph · SDAIA Academy final project',
    problem: 'Reading a paper means two jobs: understanding what it says, and finding what else is worth reading. Generic chatbots answer without citing pages and recommend papers they can’t justify.',
    solution: 'Upload one PDF. A RAG agent answers with page citations, while a discovery agent pulls candidates from Semantic Scholar and arXiv; Python scores them and the LLM only explains the ranking.',
    decisions: [
      { k: 'Two agents', v: 'Exactly two LangChain agents in a LangGraph StateGraph, with conditional routing and a parallel fan-out.' },
      { k: 'Scores in code', v: 'Relatedness is computed in Python from embeddings and citation signals; the LLM never invents a score.' },
      { k: 'Reliability', v: 'Checkpoint memory, a trace tree of nodes, tools and tokens, and guards against repeated tool calls and loops.' },
      { k: 'Team', v: 'Built with Hasan Alhussain.' },
    ],
    tags: ['LangGraph', 'LangChain', 'FAISS', 'RAG', 'Semantic Scholar', 'arXiv'],
    links: [
      { label: 'GitHub', href: 'https://github.com/abdullahf-77/ai-research-paper-assistant' },
      { label: 'Open in Colab', href: 'https://colab.research.google.com/github/abdullahf-77/ai-research-paper-assistant/blob/main/research_paper_assistant.ipynb' },
    ],
    interactive: 'graph',
    interactiveLabel: 'Agent graph',
    flow: [
      { label: 'PDF', detail: 'One uploaded paper', actor: 'user' },
      { label: 'Chunk & embed', detail: 'Pages split into chunks with page numbers kept', actor: 'code' },
      { label: 'FAISS index', detail: 'Vector store over the paper', actor: 'data' },
      { label: 'search_paper tool', detail: 'Retriever the RAG agent calls', actor: 'code' },
      { label: 'RAG agent', detail: 'Grounded answer with page citations', actor: 'llm' },
    ],
    results: {
      title: 'How related papers are ranked',
      legend: ['weight in the score'],
      metrics: [
        { k: 'Semantic similarity', a: 0.7 },
        { k: 'Citation relationship', a: 0.15 },
        { k: 'Multi-source agreement', a: 0.1 },
        { k: 'Topic overlap', a: 0.05 },
      ],
      note: 'Overall Relatedness = 100 × (0.70·semantic + 0.15·citation + 0.10·agreement + 0.05·topic), straight from the README.',
    },
    tone: 'dark',
  },
  {
    id: 'ppe',
    no: '05',
    title: 'PPE Safety Monitoring',
    category: 'Computer vision',
    context: 'YOLO11n · ByteTrack · pose · SDAIA Academy capstone',
    problem: 'Construction sites need to know when someone without a hard hat or vest walks into a danger zone, without an alarm every time a detector misses a vest.',
    solution: 'A video pipeline that detects PPE, attaches it to tracked workers, keeps a temporal PPE state per worker and alerts only when a confirmed violation enters a restricted zone.',
    decisions: [
      { k: 'Honest data', v: '717 images rebuilt with a leakage-aware, group-aware 573 / 72 / 72 split; the test split never touched tuning.' },
      { k: 'No false alarms', v: 'A violation needs explicit NO-Hardhat or NO-Safety-Vest evidence; a missing detection alone is “unknown”, not a violation.' },
      { k: 'Ground contact', v: 'Pose keypoints (ankles) place each worker in the zone, falling back to the box bottom-centre.' },
      { k: 'Checkpoint', v: 'Training curves showed late overfitting, so the best-validation weights were kept.' },
    ],
    tags: ['Ultralytics YOLO11n', 'ByteTrack', 'Pose', 'OpenCV', 'Roboflow'],
    links: [
      { label: 'GitHub', href: 'https://github.com/abdullahf-77/ppe-safety-monitoring' },
      { label: 'Colab', href: 'https://colab.research.google.com/drive/1DOkHXGNSg5vSnvLyXGEfOYrfepiH0MB2?usp=sharing' },
    ],
    interactive: 'ppe',
    interactiveLabel: 'Model outputs',
    flow: [
      { label: 'Video frame', detail: 'Site camera input', actor: 'data' },
      { label: 'PPE detection', detail: 'YOLO11n: person, hard hat, vest and their NO- classes', actor: 'model' },
      { label: 'Associate', detail: 'PPE boxes mapped to head and torso regions of each person', actor: 'code' },
      { label: 'Track', detail: 'ByteTrack keeps worker IDs across frames', actor: 'model' },
      { label: 'Temporal state', detail: 'Compliant · Violation · Unknown per worker', actor: 'code' },
      { label: 'Zone + alert', detail: 'Ankle keypoints inside the polygon and a confirmed violation', actor: 'code' },
    ],
    results: {
      title: 'Detector metrics',
      legend: ['Validation', 'Held-out test'],
      metrics: [
        { k: 'Precision', a: 0.8445, b: 0.783 },
        { k: 'Recall', a: 0.5868, b: 0.525 },
        { k: 'mAP50', a: 0.6619, b: 0.499 },
        { k: 'mAP50-95', a: 0.4035, b: 0.289 },
      ],
      note: 'Recall is the weak spot (the model misses some PPE), which is exactly why the alert logic treats “not detected” as unknown rather than a violation.',
      image: { src: 'projects/ppe-training.webp', caption: 'Training curves from the run.' },
    },
    tone: 'light',
  },
  {
    id: 'cookfinder',
    no: '06',
    title: 'CookFinder',
    category: 'Computer vision · Full stack',
    context: 'YOLO · FastAPI · Docker · Kanz AI Hackathon',
    problem: 'People photograph a fridge full of ingredients and still don’t know what to cook with what they actually have.',
    solution: 'A fine-tuned YOLO model detects ingredients from a photo, and a matcher ranks 200 recipes by how much of each recipe you already have.',
    decisions: [
      { k: 'Model', v: 'Custom Ultralytics YOLO with 87 ingredient classes; the API returns the annotated image as base64.' },
      { k: 'Matching', v: 'An alias map normalises names (for example “Chili Pepper (Khursani)” → chili, pepper); score = matched ÷ total ingredients × 100.' },
      { k: 'API & deploy', v: 'FastAPI with /predict, /health and /classes; Docker Compose serves the API and an Nginx front end.' },
      { k: 'Result', v: 'AI Showcase Featured Project, Kanz AI Hackathon (Jul 2026).' },
    ],
    tags: ['Ultralytics YOLO', 'FastAPI', 'Docker', 'Nginx', 'Arabic RTL UI'],
    links: [{ label: 'GitHub', href: 'https://github.com/abdullahf-77/cook-finder' }],
    interactive: 'cookfinder',
    interactiveLabel: 'Try the matcher',
    flow: [
      { label: 'Photo', detail: 'Camera or upload in the Arabic RTL front end', actor: 'user' },
      { label: 'POST /predict', detail: 'FastAPI receives the image', actor: 'code' },
      { label: 'YOLO', detail: '87-class ingredient detector (last.pt)', actor: 'model' },
      { label: 'Normalise', detail: 'Alias map expands each detected name', actor: 'code' },
      { label: 'Match', detail: 'Score 200 recipes by ingredient overlap', actor: 'code' },
      { label: 'Response', detail: 'detected · annotated_image · recipes', actor: 'ui' },
    ],
    shots: [
      { src: 'projects/cookfinder-ui.webp', caption: 'The CookFinder front end (from the repo’s docs).' },
      { src: 'projects/cookfinder.jpg', caption: 'CookFinder interface.' },
    ],
    tone: 'teal',
  },
  {
    id: 'nexus',
    no: '07',
    title: 'Nexus AIoT',
    category: 'Computer vision · IoT',
    context: 'Graduation project · OpenCV · MediaPipe',
    problem: 'Smart rooms still expect you to touch a switch or open an app, which doesn’t work with full hands, for accessibility, or in a demo hall.',
    solution: 'A touchless environment: ten hand gestures read from MediaPipe landmarks control seven devices and seven modes, with voice commands, a gesture password and face-presence authorisation.',
    decisions: [
      { k: 'Rule-based gestures', v: 'Finger-up/down geometry on 21 landmarks; the OK sign is checked first to resolve conflicts with the other nine.' },
      { k: 'Debounce', v: 'A gesture must be held for 7 frames, with a 1.4 s cooldown, so the room doesn’t flicker.' },
      { k: 'Security', v: 'A gesture password (Thumbs Up → Peace → Open Palm) and a 2-second face-presence timer; presence detection, not identity recognition.' },
      { k: 'Shown at', v: 'Presented at the Digital Rainbow event.' },
    ],
    tags: ['OpenCV', 'MediaPipe', 'Python', 'Speech recognition', 'TTS'],
    links: [{ label: 'GitHub', href: 'https://github.com/abdullahf-77/nexus-aiot' }],
    interactive: 'nexus',
    interactiveLabel: 'Make a gesture',
    flow: [
      { label: 'Camera', detail: 'OpenCV capture loop', actor: 'data' },
      [
        { label: 'Hand landmarks', detail: 'MediaPipe, 21 points', actor: 'model' },
        { label: 'Face presence', detail: 'Haar cascade, 2 s timer', actor: 'model' },
        { label: 'Voice', detail: 'Speech recognition thread', actor: 'model' },
      ],
      { label: 'Gesture rules', detail: '7-frame hold, 1.4 s cooldown', actor: 'code' },
      { label: 'Smart room', detail: '7 devices · 7 modes · password lock', actor: 'code' },
      { label: 'Dashboard + TTS', detail: 'OpenCV-rendered UI and spoken feedback', actor: 'ui' },
    ],
    tone: 'dark',
  },
];

export type MiniProject = { title: string; area: string; text: string; tags: string[]; href?: string; note?: string };

export const more: MiniProject[] = [
  { title: 'Pneumonia Detection', area: 'Deep learning', text: 'MobileNetV2 transfer learning on chest X-rays: 81.57% test accuracy on 624 images, with training curves in the repo.', tags: ['TensorFlow', 'Keras', 'Transfer learning'], href: 'https://github.com/abdullahf-77/pneumonia-xray-classifier' },
  { title: 'Ethical-AI Atlas', area: 'AI research', text: 'Evidence base mapping AI-ethics research centres and literature against the UNESCO Recommendation principles.', tags: ['Python', 'FastAPI', 'React'], note: 'Internal to ICAIRE · private' },
  { title: 'Air Passengers Forecasting', area: 'Time series', text: 'SDAIA Academy capstone on a course kit: AutoARIMA reached MASE 0.647 vs 1.313 for seasonal-naive over eight rolling origins.', tags: ['AutoGluon', 'AutoARIMA'], href: 'https://github.com/abdullahf-77/international-airpassengers-project' },
  { title: 'Heart Disease Prediction', area: 'Machine learning', text: 'Logistic regression vs random forest on patient data, with feature importance.', tags: ['Scikit-learn', 'Pandas'], href: 'https://github.com/abdullahf-77/heart-disease-prediction' },
  { title: 'Boston Housing Prices', area: 'Machine learning', text: 'My first ML project: EDA and linear regression on 506 records (MAE 3.54).', tags: ['Scikit-learn', 'Seaborn'], href: 'https://github.com/abdullahf-77/boston-housing-price-prediction' },
];

// Real recipes from cook-finder/recipes.json, used by the matcher demo.
export const demoRecipes = [
  { name: 'Mac and Cheese', cuisine: 'American', ingredients: ['Wheat', 'Cheese', 'Butter', 'Egg', 'Onion', 'Garlic'] },
  { name: 'Sausage and Egg Breakfast', cuisine: 'Western', ingredients: ['Sausage', 'Egg', 'Tomato', 'Bread', 'Onion', 'Capsicum'] },
  { name: 'Broccoli and Cheese Bake', cuisine: 'Western', ingredients: ['Broccoli', 'Cheese', 'Butter', 'Garlic', 'Onion', 'Bread'] },
  { name: 'Okra Stir-fry (Bhindi Tarkari)', cuisine: 'Nepali/Indian', ingredients: ['Okra', 'Onion', 'Tomato', 'Garlic', 'Chili Pepper', 'Coriander'] },
  { name: 'Palungo ko Saag (Nepali Spinach)', cuisine: 'Nepali', ingredients: ['Spinach', 'Garlic', 'Chili Pepper', 'Onion', 'Tomato'] },
];

export const ppeOutputs: Shot[] = [
  { src: 'projects/ppe-detections.webp', caption: 'Detections on test images, misses and false positives included.' },
  { src: 'projects/ppe-pose.webp', caption: 'Pose keypoints used to find each worker’s ground-contact point.' },
  { src: 'projects/ppe-tracking.gif', caption: 'ByteTrack keeping worker IDs across frames.' },
  { src: 'projects/ppe-monitoring.gif', caption: 'Full pipeline: zone, PPE state and alerts on video.' },
];

export const unescoPrinciples = [
  'Proportionality and Do No Harm', 'Safety and Security', 'Right to Privacy and Data Protection',
  'Multi-stakeholder and Adaptive Governance and Collaboration', 'Responsibility and Accountability',
  'Transparency and Explainability', 'Human Oversight and Determination', 'Sustainability',
  'Awareness and Literacy', 'Fairness and Non-discrimination',
];
