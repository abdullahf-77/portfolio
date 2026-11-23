// The centrepiece: each chapter is one verified milestone, in order.
// `code` is what the editor types while the chapter is on screen.

export type Chapter = {
  id: string;
  when: string;
  title: string;
  body: string;
  orgs: string[]; // keys from orgs.ts
  kind: 'education' | 'learning' | 'project' | 'training' | 'community' | 'achievement' | 'next';
  evidence?: { label: string; href: string }[];
  code: string;
};

export const journey: Chapter[] = [
  {
    id: 'foundation',
    when: '2023',
    title: 'Choosing Artificial Intelligence.',
    body: 'I enrolled in the Bachelor of Artificial Intelligence at Umm Al-Qura University in Makkah. Mathematics, programming and machine learning, in that order.',
    orgs: ['uqu'],
    kind: 'education',
    code: `me = Engineer("Abdullah Alsehli")
me.enroll("Umm Al-Qura University",
          major="Artificial Intelligence")`,
  },
  {
    id: 'fundamentals',
    when: 'Sep 2025 – Feb 2026',
    title: 'Laying the groundwork.',
    body: 'Alongside university I stacked the fundamentals: SDAIA’s AI fundamentals and applied concepts tracks, Linear Algebra for ML from DeepLearning.AI, then Python 101–104 and SQL 101–103 on Satr. In January I joined the Afaq AI initiative run by AI Pioneers with eYouth and IBM SkillsBuild.',
    orgs: ['sdaia', 'tuwaiq', 'pioneers'],
    kind: 'learning',
    evidence: [{ label: 'Linear Algebra · verify', href: 'https://coursera.org/verify/ZTQKARUHDWE0' }],
    code: `for course in ["linear_algebra", "python", "sql"]:
    me.learn(course)   # foundations first`,
  },
  {
    id: 'first-models',
    when: 'Apr 2026',
    title: 'The first models.',
    body: 'My first machine-learning project predicted Boston house prices with linear regression (MAE 3.54). A heart-disease classifier followed, comparing logistic regression with a random forest, together with Satr’s ML 101 and Michigan’s Introduction to Data Science in Python.',
    orgs: [],
    kind: 'project',
    evidence: [
      { label: 'Boston Housing', href: 'https://github.com/abdullahf-77/boston-housing-price-prediction' },
      { label: 'Heart Disease', href: 'https://github.com/abdullahf-77/heart-disease-prediction' },
    ],
    code: `model = LinearRegression().fit(X_train, y_train)
mae(y_test, model.predict(X_test))  # 3.54`,
  },
  {
    id: 'neon',
    when: 'May 2026',
    title: 'Going deeper, faster.',
    body: 'The AI ERA NEON bootcamp (Artificial Intelligence path) pushed me past notebooks into machine-learning algorithms and how real AI work is scoped.',
    orgs: ['neon'],
    kind: 'training',
    code: `me.bootcamp("AI ERA NEON", path="AI")`,
  },
  {
    id: 'sdaia',
    when: 'Jun 2026 – now',
    title: 'Joining SDAIA, at ICAIRE.',
    body: 'Cooperative training in Riyadh at the International Center for AI Research and Ethics, a UNESCO Category 2 centre operating with SDAIA. I build AI-powered features, dashboard components and research pipelines that classify AI-ethics literature against the UNESCO principles.',
    orgs: ['sdaia', 'icaire'],
    kind: 'training',
    code: `with SDAIA.ICAIRE(city="Riyadh") as team:
    team.ship(features=3, dashboards=3)
    team.classify(papers, against=UNESCO_PRINCIPLES)`,
  },
  {
    id: 'kanz',
    when: 'Jul 2026',
    title: 'A detector that cooks.',
    body: 'At the Kanz AI Hackathon I built CookFinder: a custom YOLO model that recognises 87 ingredients from a photo and ranks 200 recipes by what you already have. It was the AI Showcase Featured Project.',
    orgs: ['kanz'],
    kind: 'achievement',
    evidence: [{ label: 'CookFinder code', href: 'https://github.com/abdullahf-77/cook-finder' }],
    code: `ingredients = yolo("fridge.jpg").classes
recipes.rank(by=overlap(ingredients))`,
  },
  {
    id: 'vision',
    when: 'Aug 2026',
    title: 'Shipping vision and the web.',
    body: 'I finished SDAIA Academy’s Computer Vision for Developers with a capstone that watches construction workers for PPE violations and restricted-zone entry. At ICAIRE, the Ethical AI Journal prototype went live on GitHub Pages.',
    orgs: ['sdaiaAcademy', 'icaire'],
    kind: 'project',
    evidence: [
      { label: 'PPE monitoring', href: 'https://github.com/abdullahf-77/ppe-safety-monitoring' },
      { label: 'Ethical AI Journal', href: 'https://abdullahf-77.github.io/ethical-ai-journal/' },
    ],
    code: `track = yolo11n.track(video, tracker="bytetrack")
alert(if_=inside(zone) and ppe_violation(worker))`,
  },
  {
    id: 'forums',
    when: 'Aug – Sep 2026',
    title: 'Talking AI with the public.',
    body: 'I represented the Artificial Intelligence Association in the SDAIA pavilion at LEAP 2026, then represented ICAIRE at its booth during the 4th UNESCO Global Forum on the Ethics of AI in Riyadh. Both ended with certificates of appreciation. In between, I earned the Alibaba Cloud Computing Engineer certification and MCIT’s AI Ethics course.',
    orgs: ['aia', 'icaire'],
    kind: 'community',
    code: `for event in ["LEAP 2026", "UNESCO GFEAI 2026"]:
    me.explain(AI, to="visitors")`,
  },
  {
    id: 'samsung',
    when: 'Sep – Nov 2026',
    title: 'Applied AI with Samsung and Misk.',
    body: 'Samsung Innovation Campus, Artificial Intelligence programme, with Misk: weekly modules from NumPy and Pandas through scikit-learn, NLP, TensorFlow and CNNs to Hugging Face fine-tuning, LoRA and quantization. For the capstone, our six-person team Eha’a planned a multimodal emotion recognition system that fuses facial expressions and speech on CMU-MOSEI. Certificate not yet issued.',
    orgs: ['samsung', 'misk'],
    kind: 'training',
    code: `face, voice = encode(video), encode(audio)
emotions = fuse(face, voice)   # early vs late fusion
macro_f1(emotions, y_test)`,
  },
  {
    id: 'agents',
    when: 'Oct 2026',
    title: 'Agents, properly engineered.',
    body: 'SDAIA Academy’s Advanced Agentic AI Systems Engineering ended with a research assistant built with a teammate: two LangChain agents in a LangGraph state graph that answer questions about a paper with page citations, then find and rank related work. The same month I completed Time Series Analysis & Forecasting and joined AI Pioneers (روّاد) in its Educational Content Department.',
    orgs: ['sdaiaAcademy', 'pioneers'],
    kind: 'training',
    evidence: [{ label: 'Research Paper Assistant', href: 'https://github.com/abdullahf-77/ai-research-paper-assistant' }],
    code: `graph = StateGraph(PaperState)
graph.add_node("paper_rag_agent", rag_agent)
graph.add_node("discovery_agent", discovery_agent)`,
  },
  {
    id: 'llama',
    when: 'Oct – Nov 2026',
    title: 'Llama, with guardrails.',
    body: 'Tuwaiq Academy’s 80-hour AI Bootcamp using Meta Tools. From it came Ribh, an Arabic-first purchasing assistant: Llama reads and writes language, deterministic code does every number and decision, and any model text that invents a figure is thrown away.',
    orgs: ['tuwaiq'],
    kind: 'project',
    evidence: [{ label: 'Ribh code', href: 'https://github.com/abdullahf-77/ribh' }],
    code: `plan = llama.read(message)          # language
total = engine.cost(plan.offers)    # numbers: code only
reply = verify(llama.explain(total))`,
  },
  {
    id: 'next',
    when: 'Next',
    title: 'Where this is heading.',
    body: 'I graduate in July 2027, and I’m going deeper into agentic and generative systems: agents that can be audited, evaluated and trusted with real work.',
    orgs: [],
    kind: 'next',
    code: `while True:
    me.build(trustworthy=True)`,
  },
];

// The route section: places, not dates.
export const stops = [
  { n: 1, city: 'Makkah', text: 'Umm Al-Qura University. Where the AI degree, the first models and the graduation project happened.' },
  { n: 2, city: 'Professional development', text: 'SDAIA Academy, Tuwaiq Academy and Samsung Innovation Campus with Misk: the intensive programmes behind my agents, vision and LLM work.' },
  { n: 3, city: 'Riyadh', text: 'SDAIA and ICAIRE. Cooperative training, LEAP 2026 and the UNESCO Global Forum on the Ethics of AI.' },
];
