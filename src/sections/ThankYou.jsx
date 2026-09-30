import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Globe, Mail, Phone } from "lucide-react";
import { ease } from "../components/ui.jsx";
import { engineLogo } from "../engines.js";

export const DASHBOARD_URL = "https://ranknexus.ai/";

const SWEEP_MS = 4200;
// AI engines placed around the radar: angle (deg, 0 = up, clockwise) and radius (% of radar radius)
const TARGETS = [
  { id: "chatgpt", k: "ChatGPT", a: 38, r: 0.72 },
  { id: "gemini", k: "Gemini", a: 118, r: 0.74 },
  { id: "perplexity", k: "Perplexity", a: 214, r: 0.78 },
  { id: "google-ai", k: "Google AI", a: 302, r: 0.6 },
];
const BLIPS = [[70, 0.36], [165, 0.86], [250, 0.4], [345, 0.84], [12, 0.46], [190, 0.3]];

const up = (d = 0) => ({ initial: { opacity: 0, y: 18 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.7, ease, delay: d } });

function useSweep(off) {
  const [deg, setDeg] = useState(0);
  useEffect(() => {
    if (off) return;
    const start = performance.now();
    let raf;
    const tick = (now) => { setDeg((((now - start) / SWEEP_MS) * 360) % 360); raf = requestAnimationFrame(tick); };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [off]);
  return deg;
}

// 1 right after the beam passes, fading to 0 over ~120 degrees
const glow = (beam, a) => { const since = (beam - a + 360) % 360; return since < 120 ? 1 - since / 120 : 0; };
const pos = (a, r) => ({ left: `${50 + Math.sin((a * Math.PI) / 180) * r * 50}%`, top: `${50 - Math.cos((a * Math.PI) / 180) * r * 50}%` });

function Radar({ domain }) {
  const reduce = useReducedMotion();
  const beam = useSweep(reduce);
  return (
    <div className="rd" aria-hidden="true">
      <div className="rd-disc">
        {[1, 0.75, 0.5, 0.25].map((s) => <span key={s} className="rd-ring" style={{ inset: `${(1 - s) * 50}%` }} />)}
        <span className="rd-axis h" /><span className="rd-axis v" />
        <div className="rd-ticks">{Array.from({ length: 72 }).map((_, i) => <i key={i} className={i % 6 ? "" : "l"} style={{ transform: `rotate(${i * 5}deg)` }} />)}</div>
        {!reduce && <div className="rd-beam" style={{ transform: `rotate(${beam}deg)` }}><i /></div>}

        {BLIPS.map(([a, r], i) => (
          <span key={i} className="rd-blip" style={{ ...pos(a, r), opacity: reduce ? 0.5 : glow(beam, a), transform: `translate(-50%,-50%) scale(${0.6 + (reduce ? 0.4 : glow(beam, a)) * 0.6})` }} />
        ))}

        {TARGETS.map((e) => {
          const g = reduce ? 1 : glow(beam, e.a);
          return (
            <div key={e.id} className="rd-target" style={pos(e.a, e.r)}>
              <span className="rd-ping" style={{ opacity: g, transform: `scale(${1 + (1 - g) * 1.4})` }} />
              <span className="rd-logo" style={{ boxShadow: `0 0 0 ${2 + g * 4}px rgba(229,57,53,${0.08 + g * 0.22}), 0 8px 20px -8px rgba(10,10,11,.35)` }}>
                {engineLogo(e.id) && <img src={engineLogo(e.id)} alt="" />}
              </span>
              <span className="rd-name" style={{ opacity: 0.45 + g * 0.55 }}>{e.k}</span>
            </div>
          );
        })}

        <div className="rd-core">
          <span className="rd-core-pulse" />
          <span className="rd-core-dot"><Globe size={20} /></span>
        </div>
        <div className="rd-site"><span className="rd-live" />{domain}</div>
      </div>
      <div className="rd-read">
        <span>Scanning</span><b>{domain}</b>
        <span className="rd-sep" />
        <span>Engines</span><b>4 / 4</b>
        <span className="rd-sep" />
        <span>Bearing</span><b className="num">{String(Math.round(beam)).padStart(3, "0")}°</b>
      </div>
    </div>
  );
}

export default function ThankYou({ lead }) {
  const { domain, email, phone } = lead;

  useEffect(() => {
    window.scrollTo({ top: 0 });
    document.title = "Thank you | RankNexus Search Intelligence Report";
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ event: "thank_you_view", lead_type: "search_intelligence_report" });
  }, []);

  const rows = [
    { I: Mail, k: "Report sent to", v: email },
    { I: Phone, k: "A specialist may call", v: phone },
    { I: Globe, k: "Website being scanned", v: domain },
  ];

  return (
    <main className="ty">
      <div className="wrap ty-grid">
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
            <motion.span className="ty-l1" {...up(0.1)}>Thank you.</motion.span>
            <motion.span className="ty-l2" {...up(0.2)}>Your report is <em>on its way.</em></motion.span>
          </h1>

          <motion.p className="ty-sub" {...up(0.3)}>We're building the full Search Intelligence Report for <b>{domain}</b>.</motion.p>

          <motion.ul className="ty-rows" {...up(0.4)}>
            {rows.map(({ I, k, v }) => (
              <li key={k}><span className="ty-ic"><I size={17} /></span><span><small>{k}</small><b>{v}</b></span></li>
            ))}
          </motion.ul>

          <motion.a className="btn btn-dark ty-btn" href={DASHBOARD_URL} {...up(0.5)}>
            Login to dashboard <ArrowRight size={17} className="arrow" />
          </motion.a>
        </div>

        <motion.div className="ty-radar" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1, ease, delay: 0.15 }}>
          <Radar domain={domain} />
        </motion.div>
      </div>
    </main>
  );
}
