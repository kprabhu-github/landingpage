import { useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, BarChart3, Lightbulb, Mail, Phone, Search, ShieldCheck, Target, Users } from "lucide-react";
import { ease } from "../components/ui.jsx";
import { engineLogo } from "../engines.js";

export const DASHBOARD_URL = "https://ranknexus.ai/";

const up = (d = 0) => ({ initial: { opacity: 0, y: 16 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.6, ease, delay: d } });

const STEPS = [
  { t: "We scan your site", d: "We crawl your website and ask ChatGPT, Gemini, Perplexity and Google AI the questions your buyers ask." },
  { t: "Your report lands in your inbox", d: "Your AI visibility score, competitor comparison and fixes ranked by impact." },
  { t: "Optional walkthrough", d: "A RankNexus specialist can take you through the findings. No obligation." },
];

const INSIDE = [
  { I: BarChart3, t: "AI Visibility Score", d: "How often AI engines mention and recommend you." },
  { I: Users, t: "Competitor Insights", d: "Who gets named instead of you, and by how much." },
  { I: Target, t: "Missing Opportunities", d: "Prompts and keywords where you are not showing up." },
  { I: Lightbulb, t: "Growth Recommendations", d: "Priority fixes, ranked by the impact they will have." },
];

const ENGINES = [["chatgpt", "ChatGPT"], ["gemini", "Gemini"], ["perplexity", "Perplexity"], ["google-ai", "Google AI"]];

export default function ThankYou({ lead, onBack }) {
  const { domain, email, phone } = lead;

  useEffect(() => {
    window.scrollTo({ top: 0 });
    document.title = "Thank you | RankNexus Search Intelligence Report";
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ event: "thank_you_view", lead_type: "search_intelligence_report" });
  }, []);

  return (
    <main className="ty">
      <section className="ty-hero">
        <div className="ty-glow" aria-hidden="true" />
        <div className="wrap ty-hero-in">
          <motion.div className="ty-check" initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring", stiffness: 260, damping: 16 }}>
            <svg viewBox="0 0 64 64" width="64" height="64" aria-hidden="true">
              <circle cx="32" cy="32" r="30" fill="#E53935" />
              <motion.path d="M19 33 L28 42 L45 23" fill="none" stroke="#fff" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.5, delay: 0.3 }} />
            </svg>
          </motion.div>
          <motion.span className="ty-kicker" {...up(0.1)}>Request received</motion.span>
          <motion.h1 className="ty-title" {...up(0.15)}>Thank you. Your report <em>is on its way.</em></motion.h1>
          <motion.p className="ty-sub" {...up(0.22)}>
            We're building the full Search Intelligence Report for <b>{domain}</b>.
          </motion.p>

          <motion.div className="ty-cards" {...up(0.3)}>
            <div className="ty-card">
              <span className="ty-ic"><Mail size={18} /></span>
              <div><small>Report sent to</small><b>{email}</b></div>
            </div>
            <div className="ty-card">
              <span className="ty-ic"><Phone size={18} /></span>
              <div><small>A specialist may call</small><b>{phone}</b></div>
            </div>
            <div className="ty-card">
              <span className="ty-ic"><Search size={18} /></span>
              <div><small>Website being scanned</small><b>{domain}</b></div>
            </div>
          </motion.div>

          <motion.div className="ty-actions" {...up(0.38)}>
            <a className="btn btn-dark ty-btn" href={DASHBOARD_URL}>Login to dashboard <ArrowRight size={16} className="arrow" /></a>
            <button type="button" className="btn btn-ghost ty-btn" onClick={onBack}><ArrowLeft size={16} />Back to the page</button>
          </motion.div>
        </div>
      </section>

      <section className="ty-sec">
        <div className="wrap ty-grid">
          <motion.div className="ty-panel" {...up(0.45)}>
            <span className="eyebrow">What happens next</span>
            <ol className="ty-steps">
              {STEPS.map((s, i) => (
                <li key={s.t}><span className="ty-n">{i + 1}</span><div><b>{s.t}</b><p>{s.d}</p></div></li>
              ))}
            </ol>
            <div className="ty-engines">
              <small>Engines we check</small>
              <div>
                {ENGINES.map(([id, name]) => (
                  <span key={id}>{engineLogo(id) && <img src={engineLogo(id)} alt="" aria-hidden="true" />}{name}</span>
                ))}
              </div>
            </div>
          </motion.div>

          <motion.div className="ty-panel" {...up(0.52)}>
            <span className="eyebrow">What's inside your report</span>
            <div className="ty-inside">
              {INSIDE.map(({ I, t, d }) => (
                <div key={t}><span className="ty-ic"><I size={18} /></span><div><b>{t}</b><p>{d}</p></div></div>
              ))}
            </div>
          </motion.div>
        </div>
        <p className="wrap ty-note"><ShieldCheck size={15} />Your data stays private. We only use your details to send the report and follow up about it.</p>
      </section>
    </main>
  );
}
