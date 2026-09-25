import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { Bot, FileText, Globe, Search, ShieldCheck } from "lucide-react";
import { ease, Logo, Reveal } from "../components/ui.jsx";
import SignalVortex from "../components/SignalVortex.jsx";

const SIGNALS = [
  { k: "Website Signals", s: "Crawl, speed, structure", I: Globe },
  { k: "Content Signals", s: "Topics, gaps, clarity", I: FileText },
  { k: "SEO Signals", s: "Rankings, keywords, indexing", I: Search },
  { k: "Authority Signals", s: "Links, reviews, press", I: ShieldCheck },
  { k: "AI Signals", s: "Mentions, citations, prompts", I: Bot },
];

const INSIGHTS = [
  { t: "Add a pricing comparison to /pricing", s: "ChatGPT and Gemini name two competitors on pricing questions. You are not mentioned.", c: "High impact", cls: "chip-red", from: [1, 4] },
  { t: "Allow AI crawlers on /docs", s: "212 pages are blocked from GPTBot and PerplexityBot in robots.txt.", c: "Quick fix", cls: "chip-good", from: [0, 2] },
  { t: "Get listed on 3 review sites AI engines cite", s: "Competitors appear on G2, Capterra and TechRadar lists. You appear on one.", c: "Medium impact", cls: "chip-warn", from: [3, 4] },
];

export default function IntelligenceLayer() {
  const ref = useRef(null);
  const inView = useInView(ref, { margin: "-20% 0px" });
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const t = setInterval(() => setActive((v) => (v + 1) % SIGNALS.length), 1400);
    return () => clearInterval(t);
  }, [inView]);

  const xs = [10, 30, 50, 70, 90];

  return (
    <section className="sec has-swarm" ref={ref}>
      <SignalVortex sectionRef={ref} />
      <div className="wrap">
        <Reveal className="sec-head center">
          <h2 className="sec-title">Five kinds of signals. <span className="hl-red">One intelligence layer.</span></h2>
          <p className="lead sec-lead">Other tools report one signal at a time. RankNexus reads them together and tells you what to do next, in order.</p>
        </Reveal>

        <div className="layer">
          <div className="signals">
            {SIGNALS.map((s, i) => (
              <motion.div key={s.k} className={"signal" + (active === i ? " on" : "")} onMouseEnter={() => setActive(i)}
                initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, ease, delay: i * 0.06 }}>
                <span className="ico"><s.I size={18} /></span>
                <span><b>{s.k}</b><small>{s.s}</small></span>
              </motion.div>
            ))}
          </div>

          <svg className="layer-svg" viewBox="0 0 100 110" preserveAspectRatio="none" aria-hidden="true">
            {xs.map((x, i) => {
              const d = `M${x},0 C${x},60 50,50 50,110`;
              return (
                <g key={i}>
                  <path d={d} fill="none" stroke={active === i ? "#E53935" : "var(--line-2)"} strokeWidth={active === i ? 2 : 1.5} vectorEffect="non-scaling-stroke" style={{ transition: "stroke .3s" }} />
                  {inView && <path className="flow-dash" d={d} fill="none" stroke="#111111" strokeOpacity=".55" strokeWidth="2" strokeDasharray="4 16" vectorEffect="non-scaling-stroke" style={{ animationDelay: `${i * -0.3}s` }} />}
                </g>
              );
            })}
          </svg>

          <Reveal className="engine-bar">
            {inView && <motion.span className="engine-sweep" animate={{ left: ["-40%", "100%"] }} transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }} />}
            <Logo size={38} onDark />
            <span style={{ position: "relative" }}>
              <small>Reads all five together</small>
              <b>RankNexus Intelligence Engine</b>
            </span>
          </Reveal>

          <span className="out-link" />

          <Reveal className="insights" delay={0.1}>
            <div className="insights-head">
              <span className="h-3" style={{ fontFamily: "var(--f-display)", fontWeight: 600, fontSize: 18 }}>Growth insights, ranked by impact</span>
              <span className="chip">Sample output</span>
            </div>
            {INSIGHTS.map((it, i) => (
              <motion.div key={it.t} className="insight" initial={{ opacity: 0, x: -12 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, ease, delay: 0.2 + i * 0.12 }}>
                <span className={"p" + (i === 0 ? " hi" : "")}>0{i + 1}</span>
                <span style={{ minWidth: 0 }}>
                  <b style={{ fontWeight: 600 }}>{it.t}</b>
                  <small>{it.s}</small>
                </span>
                <span className={"chip " + it.cls}>{it.c}</span>
              </motion.div>
            ))}
          </Reveal>
        </div>
      </div>
    </section>
  );
}
