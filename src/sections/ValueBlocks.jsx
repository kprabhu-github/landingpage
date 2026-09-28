import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useInView } from "framer-motion";
import { Check, FileText, Search, ShieldCheck, Sparkles, X } from "lucide-react";
import { AreaChart, Bar, CountUp, ease, Reveal, Ring } from "../components/ui.jsx";
import { engineLogo } from "../engines.js";

const ENGINE_ID = { ChatGPT: "chatgpt", Gemini: "gemini", Perplexity: "perplexity", "AI Overviews": "google-ai" };

const ANSWERS = {
  ChatGPT: { a: ["For a 10-person team, ", ["Ledgerly", 1], " is often recommended for its tax filing and payroll in one place."], pos: "Named 1st" },
  Gemini: { a: ["Popular options include Finstack and ", ["Ledgerly", 1], ". Finstack has more integrations."], pos: "Named 2nd" },
  Perplexity: { a: ["Reviewers most often recommend ", ["Ledgerly", 1], " and Books360 for small teams."], pos: "Named 1st" },
  "AI Overviews": { a: ["Top picks for small businesses are Finstack, Books360 and Zenbooks."], pos: "Not named" },
};

function AiBlock() {
  const ref = useRef(null);
  const inView = useInView(ref);
  const keys = Object.keys(ANSWERS);
  const [i, setI] = useState(0);
  useEffect(() => {
    if (!inView) return;
    const t = setInterval(() => setI((v) => (v + 1) % keys.length), 2600);
    return () => clearInterval(t);
  }, [inView]);
  const cur = ANSWERS[keys[i]];
  return (
    <div className="block-ui" ref={ref}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
        <div className="eng-tabs">{keys.map((k, j) => <button key={k} className={i === j ? "on" : ""} onClick={() => setI(j)}>{engineLogo(ENGINE_ID[k]) && <img className="eng-tab-logo" src={engineLogo(ENGINE_ID[k])} alt="" aria-hidden="true" />}{k}</button>)}</div>
      </div>
      <div style={{ fontSize: 12.5, color: "var(--muted)" }}>Prompt: "best accounting software for a small team"</div>
      <div style={{ minHeight: 86 }}>
        <AnimatePresence mode="wait">
          <motion.div key={i} className="bubble-a" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.3 }}>
            {cur.a.map((p, j) => (Array.isArray(p) ? <mark key={j}>{p[0]}</mark> : <span key={j}>{p}</span>))}
            <div style={{ marginTop: 8 }}><span className={"chip " + (cur.pos === "Not named" ? "chip-red" : "chip-good")}>{cur.pos}</span></div>
          </motion.div>
        </AnimatePresence>
      </div>
      <div>
        {[["accounting software with tax filing", "Named 1st", true], ["Finstack alternatives", "Named 3rd", true], ["cheapest payroll tool", "Not named", false]].map(([q, s, y]) => (
          <div key={q} className="row-line"><span className="q">{q}</span><span className={"chip " + (y ? "" : "chip-red")} style={{ height: 22, fontSize: 11 }}>{y ? <Check size={11} /> : <X size={11} />}{s}</span></div>
        ))}
      </div>
    </div>
  );
}

function SeoBlock() {
  return (
    <div className="block-ui">
      <div className="gauge-row">
        <Ring value={91} size={96} stroke={9} label="health" color="var(--ink)" />
        <div style={{ display: "grid", gap: 8, flex: 1 }}>
          {[["Critical issues", 2, "chip-red"], ["Warnings", 17, "chip-warn"], ["Pages indexed", "4,812", "chip-good"]].map(([k, v, c]) => (
            <div key={k} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 13 }}><span>{k}</span><span className={"chip " + c} style={{ height: 22 }}>{v}</span></div>
          ))}
        </div>
      </div>
      <div>
        <div className="kw-row" style={{ fontFamily: "var(--f-mono)", fontSize: 10.5, letterSpacing: ".06em", textTransform: "uppercase", color: "var(--faint)", paddingTop: 0 }}><span>Keyword</span><span>Pos.</span><span /></div>
        {[["small business accounting software", 4, "Top 5"], ["payroll software small business", 11, "Near page 1"], ["free invoice generator", 13, "Opportunity"]].map(([k, p, s]) => (
          <div key={k} className="kw-row"><span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{k}</span><b className="num">{p}</b><span className={"chip " + (s === "Top 5" ? "chip-good" : "chip-warn")} style={{ height: 22, fontSize: 11, justifySelf: "start" }}>{s}</span></div>
        ))}
      </div>
    </div>
  );
}

function ContentBlock() {
  return (
    <div className="block-ui">
      <div className="panel-title" style={{ margin: 0 }}><span>Questions your site doesn't answer</span><span className="chip chip-red" style={{ height: 22 }}>14 gaps</span></div>
      <div>
        {[["How do I file sales tax online?", "9.2k / mo"], ["Payroll rules for a 10-person company", "4.1k / mo"], ["Moving books from spreadsheets", "2.8k / mo"]].map(([q, v]) => (
          <div key={q} className="row-line"><span className="q">{q}</span><span className="mono" style={{ fontSize: 12, color: "var(--muted)" }}>{v}</span></div>
        ))}
      </div>
      <div style={{ borderTop: "1px solid var(--line)", paddingTop: 12, display: "grid", gap: 9 }}>
        <div style={{ fontSize: 12.5, color: "var(--muted)", fontWeight: 500 }}>How AI engines describe your brand</div>
        {[["Easy to use", 86], ["Tax ready", 72], ["Good support", 64], ["Affordable", 28]].map(([k, v], i) => (
          <div key={k} className="attr"><span>{k}</span><Bar value={v} red={i === 3} delay={i * 0.08} /><span className="num" style={{ textAlign: "right" }}>{v}%</span></div>
        ))}
      </div>
    </div>
  );
}

function AuthorityBlock() {
  return (
    <div className="block-ui">
      <div className="panel-title" style={{ margin: 0 }}>
        <span>Referring domains</span>
        <div className="legend"><span><i style={{ background: "var(--red)" }} />You</span><span><i style={{ background: "var(--ink)" }} />Top competitor</span></div>
      </div>
      <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}><span className="kpi-val"><CountUp value={468} /></span><span className="delta up">+56 this quarter</span></div>
      <AreaChart height={110} ticks={2} labels={["Apr", "May", "Jun", "Jul", "Aug", "Sep"]}
        series={[{ data: [372, 389, 404, 421, 446, 468], color: "#E53935" }, { data: [510, 516, 521, 527, 534, 540], color: "#111111", fill: false, dashed: true, dot: false, width: 1.5 }]} />
      <div>
        {[["Review profiles", "G2 4.7 · Capterra 4.6", true], ["Press mentions", "11 in 90 days", true], ["Wikipedia entity", "Not found", false]].map(([k, s, ok]) => (
          <div key={k} className="row-line"><span><b style={{ fontWeight: 600 }}>{k}</b> <span style={{ color: "var(--muted)" }}>· {s}</span></span><span className={"chip " + (ok ? "chip-good" : "chip-red")} style={{ height: 22, fontSize: 11 }}>{ok ? "Strong" : "Missing"}</span></div>
        ))}
      </div>
    </div>
  );
}

const BLOCKS = [
  { tag: "AI Visibility Intelligence", I: Sparkles, h: "See which AI answers name you, and which name your competitors.", p: "AI answers, brand mentions and prompt tracking across ChatGPT, Gemini, Perplexity and AI Overviews.", UI: AiBlock, dark: true },
  { tag: "SEO Intelligence", I: Search, h: "Find the fixes and keywords closest to page one.", p: "Technical health, keyword positions and ranking opportunities, sorted by what moves traffic.", UI: SeoBlock },
  { tag: "Content Intelligence", I: FileText, h: "Know what your buyers ask that your site doesn't answer.", p: "Content gaps by search demand, and how AI engines understand your brand today.", UI: ContentBlock },
  { tag: "Authority Intelligence", I: ShieldCheck, h: "Measure the links and signals that earn trust.", p: "Backlinks and brand signals such as reviews, press and entity data, next to your top competitor.", UI: AuthorityBlock },
];

export default function ValueBlocks() {
  return (
    <section className="sec" style={{ paddingTop: 0 }}>
      <div className="wrap">
        <Reveal className="sec-head">
          <h2 className="sec-title">Four views of how <span className="hl-red">search sees your business.</span></h2>
        </Reveal>
        <div className="blocks">
          {BLOCKS.map((b, i) => (
            <Reveal key={b.tag} className={"block" + (b.dark ? " dark" : "")} delay={(i % 2) * 0.08} y={30}>
              <div className="block-copy">
                <span className="block-tag"><b.I size={14} />{b.tag}</span>
                <h3>{b.h}</h3>
                <p>{b.p}</p>
              </div>
              <b.UI />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
