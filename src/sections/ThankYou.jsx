import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Globe, Mail, Phone, Sparkles } from "lucide-react";
import { ease } from "../components/ui.jsx";
import { engineLogo } from "../engines.js";

export const DASHBOARD_URL = "https://ranknexus.ai/";

const ENGINES = ["chatgpt", "gemini", "perplexity", "google-ai"];

/* Timeline (ms) for the AI answer on the right */
const T = { type: 500, typeEnd: 2300, think: 2400, answer: 3600, perWord: 55 };

const up = (d = 0) => ({ initial: { opacity: 0, y: 18 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.7, ease, delay: d } });

function useClock(done) {
  const [t, setT] = useState(done ? 1e9 : 0);
  useEffect(() => {
    if (done) return;
    const start = performance.now();
    let raf;
    const tick = (now) => { const el = now - start; setT(el); if (el < 12000) raf = requestAnimationFrame(tick); };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [done]);
  return t;
}

export default function ThankYou({ lead }) {
  const { domain, email, phone } = lead;
  const reduce = useReducedMotion();
  const t = useClock(reduce);

  useEffect(() => {
    window.scrollTo({ top: 0 });
    document.title = "Thank you | RankNexus Search Intelligence Report";
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ event: "thank_you_view", lead_type: "search_intelligence_report" });
  }, []);

  const question = `Where's the Search Intelligence Report for ${domain}?`;
  const typed = question.slice(0, Math.max(0, Math.round(((t - T.type) / (T.typeEnd - T.type)) * question.length)));

  // Answer is streamed word by word; [n] marks a citation to the sources below
  const segs = useMemo(() => [
    { w: "Your report for" }, { w: domain, b: true, c: 1 }, { w: "is being built right now. It will be sent to" },
    { w: email, b: true, c: 2 }, { w: "and a RankNexus specialist may call" }, { w: phone, b: true, c: 3 }, { w: "to walk you through it." },
  ], [domain, email, phone]);
  const words = useMemo(() => segs.flatMap((s) => (s.b ? [{ ...s, last: true }] : s.w.split(" ").map((w) => ({ w })))), [segs]);
  const shown = Math.max(0, Math.floor((t - T.answer) / T.perWord));
  const answerDone = shown >= words.length;
  const citesShown = new Set(words.slice(0, shown).filter((x) => x.c).map((x) => x.c));

  const sources = [
    { n: 1, I: Globe, k: "Website being scanned", v: domain },
    { n: 2, I: Mail, k: "Report sent to", v: email },
    { n: 3, I: Phone, k: "A specialist may call", v: phone },
  ];

  return (
    <main className="ty">
      <div className="ty-aura" aria-hidden="true" />
      <div className="wrap ty-grid">
        {/* ---------- Left: the message ---------- */}
        <div className="ty-copy">
          <motion.div className="ty-badge" {...up(0)}>
            <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
              <circle cx="12" cy="12" r="11" fill="#16A34A" />
              <motion.path d="M7 12.5 L10.5 16 L17 9" fill="none" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.5, delay: 0.35 }} />
            </svg>
            Request received
          </motion.div>

          <h1 className="ty-title">
            <span className="ty-l1">
              {"Thank you.".split("").map((ch, i) => (
                <motion.span key={i} initial={{ opacity: 0, y: "0.5em", filter: "blur(6px)" }} animate={{ opacity: 1, y: 0, filter: "blur(0px)" }} transition={{ duration: 0.5, ease, delay: 0.15 + i * 0.035 }}>{ch === " " ? " " : ch}</motion.span>
              ))}
            </span>
            <motion.span className="ty-l2" {...up(0.6)}>Your report is <em>on its way.<motion.i className="ty-underline" initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 0.8, ease, delay: 1.1 }} /></em></motion.span>
          </h1>

          <motion.p className="ty-sub" {...up(0.75)}>We're building the full Search Intelligence Report for <b>{domain}</b>.</motion.p>

          <motion.a className="btn btn-dark ty-btn" href={DASHBOARD_URL} {...up(0.9)}>
            Login to dashboard <ArrowRight size={17} className="arrow" />
          </motion.a>
        </div>

        {/* ---------- Right: an AI answer that cites the visitor's details ---------- */}
        <motion.div className="ty-ai" initial={{ opacity: 0, y: 30, rotateX: 8 }} animate={{ opacity: 1, y: 0, rotateX: 0 }} transition={{ duration: 0.9, ease, delay: 0.3 }}>
          <div className="ty-ai-bar">
            <span className="ty-ai-name"><Sparkles size={14} />RankNexus AI</span>
            <span className="ty-ai-live"><i />Live</span>
          </div>

          <div className="ty-ai-body">
            <div className="ty-q">
              <span>{typed}{t < T.typeEnd && <i className="ty-caret" />}</span>
            </div>

            <AnimatePresence>
              {t >= T.think && t < T.answer && (
                <motion.div key="think" className="ty-think" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                  <span className="ty-engs">
                    {ENGINES.map((id, i) => engineLogo(id) && (
                      <motion.img key={id} src={engineLogo(id)} alt="" animate={{ y: [0, -4, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.12 }} />
                    ))}
                  </span>
                  Checking your request
                </motion.div>
              )}
            </AnimatePresence>

            {t >= T.answer && (
              <motion.div className="ty-a" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <span className="ty-a-ic"><Sparkles size={14} /></span>
                <p>
                  {words.slice(0, shown).map((x, i) => (
                    <motion.span key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.25 }}>
                      {x.b ? <b>{x.w}</b> : x.w}
                      {x.c && <sup className="ty-cite">{x.c}</sup>}{" "}
                    </motion.span>
                  ))}
                  {!answerDone && <i className="ty-caret" />}
                </p>
              </motion.div>
            )}

            <div className="ty-src">
              {t >= T.answer && <div className="ty-src-k">Sources</div>}
              {sources.map(({ n, I, k, v }) => (
                <AnimatePresence key={n}>
                  {citesShown.has(n) && (
                    <motion.div className="ty-src-row" initial={{ opacity: 0, x: 16, scale: 0.97 }} animate={{ opacity: 1, x: 0, scale: 1 }} transition={{ duration: 0.45, ease }}>
                      <span className="ty-src-n">{n}</span>
                      <span className="ty-src-ic"><I size={16} /></span>
                      <span className="ty-src-t"><small>{k}</small><b>{v}</b></span>
                    </motion.div>
                  )}
                </AnimatePresence>
              ))}
            </div>
          </div>

          <div className="ty-ai-foot">
            <span>{answerDone ? "Building your report" : "Answering"}</span>
            <span className="ty-meter"><i /></span>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
