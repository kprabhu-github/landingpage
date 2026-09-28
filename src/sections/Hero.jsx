import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useInView, useReducedMotion } from "framer-motion";
import { ArrowRight, ArrowUp, CalendarDays, Check, Globe, RotateCcw, Search, Sparkles, Zap } from "lucide-react";
import { CountUp, ease, Logo } from "../components/ui.jsx";
import { BOOK_DEMO_URL, cleanDomain, isValidDomain } from "../lead.js";

/* ------------------------------------------------------------------
   Example scenarios. The hero rotates through these; visitors can
   also pick one with the industry tabs.
------------------------------------------------------------------- */
export const SCENARIOS = [
  {
    id: "shopify",
    label: "Shopify DTC",
    question: "Best Shopify Plus agency for enterprise DTC brands?",
    intro: "Here are the agencies most recommended by commercial AI models for enterprise Shopify builds:",
    competitors: [
      { n: "BVAccel (BVA)", why: "Enterprise Shopify Plus partner, 50+ enterprise case studies" },
      { n: "We Make Websites", why: "Premier international Shopify Plus agency for global builds" },
      { n: "Eastside Co", why: "Top-rated technical architect for headless commerce" },
    ],
    score: 42,
    scoreLabel: "Low visibility",
    scoreDesc: "Named in 3 of 25 buyer questions",
    opps: 12,
    gapRows: [["BVAccel", 78], ["We Make Websites", 71], ["Eastside Co", 64]],
  },
  {
    id: "billing",
    label: "SaaS Billing",
    question: "Top usage-based billing and subscription platforms for B2B SaaS?",
    intro: "Here are the leading usage-based metering and billing platforms most frequently cited in software benchmarks:",
    competitors: [
      { n: "Stripe Billing", why: "Industry standard for global payment infrastructure & metering" },
      { n: "Metronome", why: "Leading real-time usage rating engine for AI & data platforms" },
      { n: "Togai", why: "Developer-first usage metering with instant webhook pipelines" },
    ],
    score: 36,
    scoreLabel: "Critical gap",
    scoreDesc: "Named in 2 of 30 buyer questions",
    opps: 18,
    gapRows: [["Stripe Billing", 88], ["Metronome", 74], ["Togai", 62]],
  },
  {
    id: "security",
    label: "SOC 2 Security",
    question: "Best continuous automated SOC 2 compliance software for AWS?",
    intro: "Here are the top security compliance automation platforms verified across technical audits:",
    competitors: [
      { n: "Vanta", why: "Market leader in automated compliance monitoring with 300+ integrations" },
      { n: "Drata", why: "Continuous compliance automation with deep trust center portals" },
      { n: "Secureframe", why: "AI-powered automated security questionnaires & policy mapping" },
    ],
    score: 29,
    scoreLabel: "High risk",
    scoreDesc: "Omitted from 24 of 25 security searches",
    opps: 22,
    gapRows: [["Vanta", 92], ["Drata", 81], ["Secureframe", 69]],
  },
  {
    id: "video",
    label: "AI Video",
    question: "Top enterprise AI video generation & translation platforms?",
    intro: "Here are the generative video tools most cited across developer documentation and enterprise reviews:",
    competitors: [
      { n: "Synthesia", why: "Enterprise AI avatar generation with 140+ language translations" },
      { n: "HeyGen", why: "Real-time interactive avatars and high-converting video localization" },
      { n: "ElevenLabs", why: "Frontier voice cloning and multilingual audio synthesis SDKs" },
    ],
    score: 45,
    scoreLabel: "Moderate gap",
    scoreDesc: "Named in 4 of 20 marketing prompts",
    opps: 14,
    gapRows: [["Synthesia", 86], ["HeyGen", 78], ["ElevenLabs", 70]],
  },
  {
    id: "cloud",
    label: "Cloud Storage",
    question: "Best multi-cloud storage and zero-egress data backup platforms?",
    intro: "Here are the cloud storage platforms most frequently recommended for high-volume egress reduction:",
    competitors: [
      { n: "Cloudflare R2", why: "Zero-egress object storage with worldwide S3-compatible endpoints" },
      { n: "Wasabi Cloud", why: "Predictable hot cloud storage with no egress fees or API charges" },
      { n: "Backblaze B2", why: "High-durability object storage tailored for enterprise backup & sync" },
    ],
    score: 38,
    scoreLabel: "Low visibility",
    scoreDesc: "Named in 3 of 28 infrastructure queries",
    opps: 16,
    gapRows: [["Cloudflare R2", 89], ["Wasabi Cloud", 76], ["Backblaze B2", 68]],
  }
];

/* ------------------------------------------------------------------
   "AI Answer Scanner" timeline (ms). One question goes out to four
   AI engines, answers stream back, brands get ranked, you get scored.
------------------------------------------------------------------- */
const T = {
  typeStart: 300,
  send: 2050,
  eng: [2350, 2800, 3250, 3700],
  orb: 4150,
  results: 5000,
  rows: [5250, 5650, 6050],
  you: 6700,
  score: 7700,
  opps: 8600,
  end: 15500,
};

/*
  Official engine logos.
  Drop each company's official logo file into src/assets/engines/ named
  chatgpt, gemini, perplexity and google-ai (.svg, .png or .webp).
  They are bundled into the page automatically on the next build.
  Until a file is there, a text badge (GPT, GEM...) is shown instead.
*/
const LOGO_FILES = import.meta.glob("../assets/engines/*.{svg,png,webp,jpg}", { eager: true, query: "?url", import: "default" });
const logoFor = (id) => {
  const hit = Object.entries(LOGO_FILES).find(([path]) => path.split("/").pop().split(".")[0].toLowerCase() === id);
  return hit ? hit[1] : null;
};

const ENGINES = [
  { id: "chatgpt", k: "ChatGPT", s: "GPT", x: 15, y: 22 },
  { id: "gemini", k: "Gemini", s: "GEM", x: 85, y: 22 },
  { id: "perplexity", k: "Perplexity", s: "PPX", x: 15, y: 78 },
  { id: "google-ai", k: "Google AI", s: "AIO", x: 85, y: 78 },
].map((e) => ({ ...e, logo: logoFor(e.id) }));

const STEPS = [
  { at: 0, label: "Asking the question" },
  { at: T.send, label: "Querying 4 AI engines" },
  { at: T.results, label: "Ranking recommended brands" },
  { at: T.score, label: "Scoring your visibility" },
];

/* How many of the 4 engines named each competitor (derived from their score) */
const enginesFor = (score) => (score >= 85 ? 4 : score >= 70 ? 3 : score >= 60 ? 2 : 1);

function useTimeline(active, reduce, onCycle) {
  const [t, setT] = useState(reduce ? T.end : 0);
  const [run, setRun] = useState(0);
  const cycleRef = useRef(onCycle);
  cycleRef.current = onCycle;
  const tRef = useRef(t);
  tRef.current = t;
  useEffect(() => {
    if (reduce) { setT(T.end); return; }
    if (!active) return;
    let raf;
    const start = performance.now() - (tRef.current >= T.end ? 0 : tRef.current);
    const tick = (now) => {
      const el = now - start;
      if (el >= T.end + 1500) {
        setT(0);
        setRun((r) => r + 1);
        if (cycleRef.current) cycleRef.current();
        return;
      }
      setT(el);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [active, run, reduce]);
  return [t, () => { setT(0); setRun((r) => r + 1); }];
}

/* ---------- Question bar with typing + send pulse ---------- */
function QueryBar({ t, question, onCheck }) {
  const charMs = Math.min(34, (T.send - T.typeStart - 200) / question.length);
  const n = Math.max(0, Math.min(question.length, Math.floor((t - T.typeStart) / charMs)));
  const typing = t >= T.typeStart && n < question.length;
  const sent = t >= T.send;
  return (
    <div className={"ax-query" + (sent ? " sent" : "")}>
      <Search size={16} className="ax-query-ico" />
      <span className="ax-query-txt">
        {question.slice(0, n) || <span style={{ color: "var(--faint)" }}>Ask AI anything</span>}
        {typing && <span className="ais-caret" />}
      </span>
      <motion.button type="button" className="ax-send" onClick={onCheck} title="Check your own brand" aria-label="Check your own brand"
        animate={sent && t < T.results ? { scale: [1, 1.1, 1] } : { scale: 1 }} transition={{ duration: 0.6, repeat: sent && t < T.results ? Infinity : 0 }}>
        <ArrowUp size={15} strokeWidth={2.6} />
      </motion.button>
    </div>
  );
}

/* ---------- Stage 1: four engines answering, data flowing into RankNexus ---------- */
function EngineStage({ t }) {
  const label = t < T.send ? "Waiting for a question" : t < T.orb ? "Reading AI answers" : "Finding who gets recommended";
  return (
    <motion.div className="ax-stage" key="stage" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, scale: 0.96, filter: "blur(4px)" }} transition={{ duration: 0.4 }}>
      <svg className="ax-lines" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
        {ENGINES.map((e, i) => (
          <line key={e.k} x1={e.x} y1={e.y} x2="50" y2="50" className={t >= T.eng[i] ? "on" : ""} vectorEffect="non-scaling-stroke" />
        ))}
      </svg>

      {ENGINES.map((e, i) => {
        const on = t >= T.eng[i];
        const done = t >= T.eng[i] + 550;
        return (
          <div key={e.k} className={"ax-eng" + (on ? " on" : "") + (done ? " done" : "")} style={{ left: `${e.x}%`, top: `${e.y}%` }}>
            <motion.span className={"ax-eng-dot" + (e.logo ? " has-logo" : "")} animate={on && !done ? { scale: [1, 1.12, 1] } : { scale: 1 }} transition={{ duration: 0.5, repeat: on && !done ? Infinity : 0 }}>
              {e.logo ? <img src={e.logo} alt={e.k} draggable="false" /> : done ? <Check size={14} strokeWidth={3} /> : e.s}
              {e.logo && done && <span className="ax-eng-check"><Check size={10} strokeWidth={3.2} /></span>}
            </motion.span>
            <small>{e.k}</small>
          </div>
        );
      })}

      {ENGINES.map((e, i) => (t >= T.eng[i] && t < T.results) && [0, 1, 2].map((k) => (
        <motion.span key={`${e.k}-${k}`} className="ax-particle"
          initial={{ left: `${e.x}%`, top: `${e.y}%`, opacity: 0, scale: 0.5 }}
          animate={{ left: "50%", top: "50%", opacity: [0, 1, 1, 0], scale: [0.5, 1, 0.7] }}
          transition={{ duration: 0.85, delay: k * 0.2, ease: "easeIn", repeat: Infinity, repeatDelay: 0.35 }} />
      )))}

      <div className="ax-orb">
        {t >= T.send && [0, 1, 2].map((r) => (
          <motion.span key={r} className="ax-ring" animate={{ scale: [1, 1.9], opacity: [0.55, 0] }} transition={{ duration: 2.2, repeat: Infinity, delay: r * 0.7, ease: "easeOut" }} />
        ))}
        <motion.div className="ax-orb-core" animate={t >= T.orb ? { rotate: [0, 360] } : { rotate: 0 }} transition={{ duration: 1.6, repeat: t >= T.orb ? Infinity : 0, ease: "linear" }}>
          <span className="ax-orb-arc" />
        </motion.div>
        <div className="ax-orb-logo"><Logo size={46} onDark /></div>
      </div>
      <div className="ax-orb-label mono">{label}</div>
    </motion.div>
  );
}

/* ---------- Stage 2: who AI recommends ---------- */
export function AIResponseAnimation({ t, brand, scenario }) {
  return (
    <motion.div className="ax-board" key="board" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.45, ease }}>
      <div className="ax-board-head">
        <span>Brands AI recommends</span>
        <span className="ax-engine-keys">{ENGINES.map((e) => <i key={e.k} title={e.k}>{e.logo ? <img src={e.logo} alt={e.k} /> : e.s}</i>)}</span>
      </div>
      {scenario.competitors.map((c, i) => {
        const n = enginesFor(scenario.gapRows[i]?.[1] ?? 70);
        return t >= T.rows[i] && (
          <motion.div key={c.n} className="ax-row" initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} transition={{ type: "spring", stiffness: 260, damping: 24 }}>
            <span className="ax-rank">{i + 1}</span>
            <span className="ax-name"><b>{c.n}</b><small>{c.why}</small></span>
            <span className="ax-dots">
              {ENGINES.map((e, j) => (
                <motion.i key={e.k} className={j < n ? "y" : ""} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.15 + j * 0.08, type: "spring", stiffness: 400, damping: 18 }} />
              ))}
            </span>
          </motion.div>
        );
      })}
      {t >= T.you && (
        <motion.div className="ax-row you" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0, x: [0, -6, 6, -4, 4, 0] }} transition={{ duration: 0.7, ease }}>
          <span className="ax-rank">–</span>
          <span className="ax-name"><b>{brand}</b><small>Not named by any engine for this question</small></span>
          <span className="ax-dots">{ENGINES.map((e) => <i key={e.k} />)}</span>
          <span className="chip chip-red ax-nd">Not discovered</span>
        </motion.div>
      )}
    </motion.div>
  );
}

/* ---------- Floating score card ---------- */
export function VisibilityScoreReveal({ t, onCheck, scenario }) {
  const show = t >= T.score;
  const R = 40, C = 2 * Math.PI * R;
  return (
    <AnimatePresence>
      {show && (
        <motion.div className="ais-float ax-score" initial={{ opacity: 0, y: 30, scale: 0.85, rotate: -2 }} animate={{ opacity: 1, y: 0, scale: 1, rotate: 0 }} exit={{ opacity: 0, y: 10 }} transition={{ type: "spring", stiffness: 200, damping: 20 }}>
          <div className="ax-score-row">
            <div className="ais-ring">
              <svg viewBox="0 0 96 96" aria-hidden="true">
                <circle cx="48" cy="48" r={R} fill="none" stroke="var(--surface)" strokeWidth="9" />
                <motion.circle cx="48" cy="48" r={R} fill="none" stroke="#E53935" strokeWidth="9" strokeLinecap="round"
                  strokeDasharray={C} initial={{ strokeDashoffset: C }} animate={{ strokeDashoffset: C * (1 - scenario.score / 100) }} transition={{ duration: 1.3, ease }}
                  style={{ transform: "rotate(-90deg)", transformOrigin: "48px 48px" }} />
              </svg>
              <div className="ais-ring-val"><CountUp value={scenario.score} duration={1.3} /><small>/100</small></div>
            </div>
            <div className="ax-score-copy">
              <span className="ais-float-k" style={{ margin: 0 }}>AI Visibility Score</span>
              <span className="chip chip-red" style={{ justifySelf: "start" }}>{scenario.scoreLabel}</span>
              <span className="ax-score-desc">{scenario.scoreDesc}</span>
            </div>
          </div>
          <motion.button className="ax-cta" onClick={onCheck} animate={t >= T.opps ? { boxShadow: ["0 0 0 0 rgba(229,57,53,.45)", "0 0 0 10px rgba(229,57,53,0)"] } : {}} transition={{ duration: 1.4, repeat: Infinity }}>
            Check your real score <ArrowRight size={14} />
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ---------- Floating opportunities badge ---------- */
export function CompetitorGapWidget({ t, scenario }) {
  const show = t >= T.opps;
  const leader = scenario.gapRows[0];
  return (
    <AnimatePresence>
      {show && (
        <motion.div className="ais-float ax-opps" initial={{ opacity: 0, x: 30, scale: 0.9 }} animate={{ opacity: 1, x: 0, scale: 1 }} exit={{ opacity: 0 }} transition={{ type: "spring", stiffness: 220, damping: 22 }}>
          <span className="ax-opps-ico"><Zap size={16} /></span>
          <span>
            <b><CountUp value={scenario.opps} duration={0.8} /> opportunities found</b>
            <small>{leader[0]} leads by {leader[1] - scenario.score} points</small>
          </span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ---------- The whole right-hand experience ---------- */
export function HeroAISearchExperience({ domain, onCheck }) {
  const ref = useRef(null);
  const panelRef = useRef(null);
  const inView = useInView(ref, { margin: "-10% 0px" });
  const reduce = useReducedMotion();
  const [idx, setIdx] = useState(0);
  const [pinned, setPinned] = useState(false);
  const [t, replay] = useTimeline(inView, reduce, () => { if (!pinned) setIdx((v) => (v + 1) % SCENARIOS.length); });
  const scenario = SCENARIOS[idx];
  const brand = domain || "Your brand";
  const step = [...STEPS].reverse().find((s) => t >= s.at) || STEPS[0];
  const progress = Math.min(1, t / T.score);

  function pick(i) { setIdx(i); setPinned(true); replay(); }
  function onMove(e) {
    const r = panelRef.current?.getBoundingClientRect();
    if (!r) return;
    panelRef.current.style.setProperty("--mx", `${e.clientX - r.left}px`);
    panelRef.current.style.setProperty("--my", `${e.clientY - r.top}px`);
  }

  return (
    <div className="ais ax" ref={ref}>
      <div className="ais-aura" aria-hidden="true" />
      <motion.div className="ais-panel ax-panel" ref={panelRef} onMouseMove={onMove} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease, delay: 0.15 }}>
        <div className="ais-top">
          <span className="ais-top-l"><span className="ais-live" />AI visibility check</span>
          <span className="ais-top-r">
            <span className="chip" style={{ height: 22, fontSize: 11 }}>Example</span>
            <button className="ais-replay" onClick={replay} aria-label="Replay the example"><RotateCcw size={13} /></button>
          </span>
        </div>

        <QueryBar t={t} question={scenario.question} onCheck={onCheck} />

        <div className="ax-area">
          <AnimatePresence mode="wait">
            {t < T.results ? <EngineStage key={"s" + idx} t={t} /> : <AIResponseAnimation key={"b" + idx} t={t} brand={brand} scenario={scenario} />}
          </AnimatePresence>
        </div>

        <div className="ax-status">
          <AnimatePresence mode="wait">
            <motion.span key={step.label} className="mono" initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} transition={{ duration: 0.25 }}>{step.label}</motion.span>
          </AnimatePresence>
          <span className="ax-progress"><span style={{ transform: `scaleX(${progress})` }} /></span>
        </div>
      </motion.div>
      <VisibilityScoreReveal t={t} onCheck={onCheck} scenario={scenario} />
      <CompetitorGapWidget t={t} scenario={scenario} />
    </div>
  );
}

/* Alias with the name used in the brief */
export const LiveAISearchSimulation = HeroAISearchExperience;

export default function Hero({ website, setWebsite, onReveal }) {
  const [err, setErr] = useState("");
  const item = (i) => ({ initial: { opacity: 0, y: 18 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.8, ease, delay: 0.05 + i * 0.08 } });

  function submit(e) {
    e.preventDefault();
    if (website && !isValidDomain(website)) return setErr("Enter a website like yourbrand.com");
    setErr("");
    if (website) setWebsite(cleanDomain(website));
    onReveal();
  }
  function focusInput() {
    if (website && isValidDomain(website)) setWebsite(cleanDomain(website));
    onReveal();
  }

  return (
    <section className="hero hero-ai">
      <div className="hero-gridbg grid-bg" />
      <div className="wrap hero-grid">
        <div className="hero-copy">
          <motion.span className="hero-kicker" {...item(0)}><Sparkles size={14} />See what AI says about your brand</motion.span>
          <motion.h1 {...item(1)}>
            <span className="h1-line">Your customers ask AI.</span>
            <span className="q h1-line">Does AI recommend you?</span>
          </motion.h1>
          <motion.div className="hero-sub" {...item(2)}>
            <p>AI search is changing how people discover brands.</p>
            <p>RankNexus shows how visible your brand is across AI and search.</p>
          </motion.div>
          <motion.form className="capture" onSubmit={submit} noValidate {...item(3)}>
            <div className={"capture-row" + (err ? " err" : "")}>
              <Globe size={18} className="globe" />
              <label htmlFor="hero-website" className="sr-only">Your website</label>
              <input id="hero-website" placeholder="yourbrand.com" value={website} onChange={(e) => { setWebsite(cleanDomain(e.target.value, true)); setErr(""); }} inputMode="url" autoComplete="url" />
              <button type="submit" className="btn btn-primary">Reveal My AI Visibility Score <ArrowRight size={16} className="arrow" /></button>
            </div>
            {err && <span className="err-msg">{err}</span>}
            <div className="hero-actions-row">
              <a href={BOOK_DEMO_URL} className="btn btn-ghost btn-sm demo-btn"><CalendarDays size={15} />Book Demo</a>
              <div className="trust-mini">
                <span><Check size={15} strokeWidth={2.6} />2-minute analysis</span>
                <span><Check size={15} strokeWidth={2.6} />No credit card required</span>
              </div>
            </div>
          </motion.form>
        </div>
        <HeroAISearchExperience domain={isValidDomain(website) ? cleanDomain(website) : ""} onCheck={focusInput} />
      </div>
    </section>
  );
}
