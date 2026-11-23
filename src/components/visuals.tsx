import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Play } from 'lucide-react';

/* ---------- Ribh: who does what ---------- */
export function RibhVisual() {
  const steps = [
    { who: 'Llama', what: 'Reads the Arabic message into a typed plan', tone: 'llm' },
    { who: 'Code', what: 'Validates it: every value must be quoted from the user', tone: 'code' },
    { who: 'Code', what: 'Computes cost, VAT, MOQ and the winner in integer halalas', tone: 'code' },
    { who: 'Llama', what: 'Explains the result in plain Arabic', tone: 'llm' },
    { who: 'Code', what: 'Checks the text: no invented numbers, same winner', tone: 'code' },
  ];
  const [i, setI] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setI((v) => (v + 1) % steps.length), 1700);
    return () => clearInterval(id);
  }, [steps.length]);
  return (
    <div className="rounded-[22px] border border-silver/15 bg-[#0B1218] p-6 sm:p-8">
      <div className="mb-5 flex items-center justify-between font-mono text-xs text-silver/60">
        <span>one turn in Ribh</span>
        <span className="flex gap-3"><b className="text-teal-2">● Llama</b><b className="text-silver">● code</b></span>
      </div>
      <ol className="m-0 grid list-none gap-2.5 p-0">
        {steps.map((s, k) => (
          <li key={k} className={`flex items-center gap-4 rounded-xl border px-4 py-3 transition-all duration-500 ${k === i ? 'translate-x-2 border-teal-2 bg-teal/15' : 'border-silver/10'}`}>
            <span className={`w-14 flex-none font-mono text-xs font-semibold ${s.tone === 'llm' ? 'text-teal-2' : 'text-silver'}`}>{s.who}</span>
            <span className="text-sm text-silver/90">{s.what}</span>
          </li>
        ))}
      </ol>
      <p dir="rtl" className="mt-5 text-end font-sans text-sm text-silver/60">«محسوب من بياناتك» · labels say who wrote each reply</p>
    </div>
  );
}

/* ---------- Research assistant: the LangGraph ---------- */
const NODES: Record<string, [number, number, string]> = {
  start: [40, 150, 'START'], load: [130, 150, 'load_pdf'], prof: [258, 150, 'extract_profile'],
  idx: [402, 70, 'build_rag_index'], rag: [562, 70, 'paper_rag_agent'],
  disc: [402, 225, 'discovery_agent'], merge: [548, 225, 'merge_dedup'], score: [548, 295, 'score_rank'], expl: [380, 295, 'explain_ranking'],
  end1: [702, 70, 'END'], end2: [220, 295, 'END'],
};
const EDGES: [string, string][] = [['start', 'load'], ['load', 'prof'], ['prof', 'idx'], ['idx', 'rag'], ['rag', 'end1'], ['prof', 'disc'], ['disc', 'merge'], ['merge', 'score'], ['score', 'expl'], ['expl', 'end2']];
const AGENTS = new Set(['rag', 'disc']);

export function GraphVisual() {
  const [run, setRun] = useState(0);
  return (
    <div className="rounded-[22px] border border-[var(--line)] bg-white p-4 shadow-[0_24px_50px_rgba(16,24,32,.1)] sm:p-6">
      <svg viewBox="0 30 740 300" className="w-full" role="img" aria-label="LangGraph state graph of the research paper assistant: a RAG branch and a discovery-and-ranking branch run in parallel">
        {EDGES.map(([a, b], k) => {
          const [x1, y1] = NODES[a], [x2, y2] = NODES[b];
          return (
            <g key={`${a}-${b}`}>
              <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#C5D0D6" strokeWidth="2" />
              {run > 0 && (
                <motion.circle key={`${run}-${k}`} r="5" fill="#287E83"
                  initial={{ cx: x1, cy: y1, opacity: 0 }}
                  animate={{ cx: [x1, x2], cy: [y1, y2], opacity: [0, 1, 1, 0] }}
                  transition={{ duration: 0.7, delay: (k < 5 ? k : k - 3) * 0.55 }} />
              )}
            </g>
          );
        })}
        {Object.entries(NODES).map(([id, [x, y, l]]) => {
          const agent = AGENTS.has(id);
          const term = l === 'START' || l === 'END';
          const w = term ? 54 : l.length * 7.4 + 18;
          return (
            <g key={id}>
              <rect x={x - w / 2} y={y - 15} width={w} height="30" rx={term ? 15 : 7}
                fill={agent ? '#287E83' : term ? '#101820' : '#F5F7F8'} stroke={agent || term ? 'none' : '#9FB0BA'} />
              <text x={x} y={y + 4.5} textAnchor="middle" fontFamily="JetBrains Mono, monospace" fontSize="11.5" fill={agent || term ? '#fff' : '#1C303B'}>{l}</text>
            </g>
          );
        })}
      </svg>
      <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
        <span className="font-mono text-xs text-muted"><b className="text-teal">■</b> agent · conditional routing · parallel fan-out</span>
        <button onClick={() => setRun((r) => r + 1)} className="btn btn-solid !px-4 !py-2 text-sm"><Play size={14} /> Run the graph</button>
      </div>
    </div>
  );
}

/* ---------- Nexus AIoT: a MediaPipe-style hand ---------- */
// 21 landmarks: wrist + 4 per finger. Open palm, then a fist (fingers folded).
const OPEN: [number, number][] = [
  [100, 210], [70, 190], [50, 165], [36, 142], [24, 122], [78, 130], [72, 95], [68, 72], [65, 52],
  [100, 124], [100, 86], [100, 60], [100, 38], [122, 130], [128, 95], [132, 72], [135, 54], [142, 142], [154, 116], [162, 98], [168, 82],
];
const FIST: [number, number][] = [
  [100, 210], [72, 188], [62, 165], [78, 150], [92, 148], [80, 140], [80, 118], [86, 132], [88, 146],
  [100, 136], [102, 114], [104, 130], [104, 146], [120, 140], [122, 118], [120, 134], [118, 148], [138, 148], [140, 130], [136, 142], [132, 152],
];
const BONES = [[0, 1], [1, 2], [2, 3], [3, 4], [0, 5], [5, 6], [6, 7], [7, 8], [5, 9], [9, 10], [10, 11], [11, 12], [9, 13], [13, 14], [14, 15], [15, 16], [13, 17], [0, 17], [17, 18], [18, 19], [19, 20]];

export function NexusVisual() {
  const [fist, setFist] = useState(false);
  const pts = fist ? FIST : OPEN;
  return (
    <div className="rounded-[22px] border border-[var(--line)] bg-white p-6 shadow-[0_24px_50px_rgba(16,24,32,.1)]">
      <div className="grid items-center gap-6 sm:grid-cols-[1fr_auto]">
        <button onClick={() => setFist(!fist)} className="mx-auto block w-full max-w-[260px] cursor-pointer border-0 bg-transparent p-0" aria-label={fist ? 'Open the hand' : 'Make a fist'}>
          <svg viewBox="0 0 200 230" className="w-full">
            {BONES.map(([a, b]) => (
              <motion.line key={`${a}-${b}`} stroke="#1C303B" strokeWidth="3" strokeLinecap="round"
                animate={{ x1: pts[a][0], y1: pts[a][1], x2: pts[b][0], y2: pts[b][1] }} transition={{ type: 'spring', stiffness: 160, damping: 18 }} />
            ))}
            {pts.map(([x, y], k) => (
              <motion.circle key={k} r={k % 4 === 0 && k ? 5.5 : 4.5} fill={k % 4 === 0 && k ? '#287E83' : '#F5F7F8'} stroke="#287E83" strokeWidth="2"
                animate={{ cx: x, cy: y }} transition={{ type: 'spring', stiffness: 160, damping: 18 }} />
            ))}
          </svg>
        </button>
        <div className="grid gap-2 font-mono text-sm">
          {[
            ['gesture', fist ? 'Fist' : 'Open palm'],
            ['landmarks', '21'],
            ['lights', fist ? 'OFF' : 'ON'],
          ].map(([k, v]) => (
            <div key={k} className="flex justify-between gap-6 border-b border-[var(--line)] pb-1.5">
              <span className="text-muted">{k}</span><b className={k === 'lights' ? (fist ? 'text-muted' : 'text-teal') : ''}>{v}</b>
            </div>
          ))}
        </div>
      </div>
      <p className="note mt-3">Tap the hand: a gesture, read from 21 landmarks, switches a device.</p>
    </div>
  );
}
