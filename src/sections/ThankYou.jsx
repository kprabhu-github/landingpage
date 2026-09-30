import { useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { ease } from "../components/ui.jsx";

export const DASHBOARD_URL = "https://ranknexus.ai/";

// The RankNexus "X" (same geometry as the logo): black chevron + stub, red top-left stroke
const X_INK = "M527 30L513.05 49.08L501.73 64.55L527.2 100L550 100L524 64.17L548.4 30ZM475.8 100L498.4 100L505.39 90.21L494.27 74.74Z";
const X_RED = "M499.2 30L476.9 30L494.36 54.3L505.64 38.88Z";

const rise = (d) => ({ initial: { y: "105%" }, animate: { y: "0%" }, transition: { duration: 0.9, ease, delay: d } });
const fade = (d) => ({ initial: { opacity: 0, y: 14 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.7, ease, delay: d } });

export default function ThankYou({ lead }) {
  // lead is null when /thankyou is opened directly (no form submitted in this tab)
  const { domain, email, phone } = lead || {};

  useEffect(() => {
    window.scrollTo({ top: 0 });
    document.title = "Thank you | RankNexus Search Intelligence Report";
    // Only count a conversion when the visitor actually submitted the form
    if (lead) {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({ event: "thank_you_view", lead_type: "search_intelligence_report" });
    }
    const html = document.documentElement;
    const prev = html.style.overflow;
    html.style.overflow = "hidden";
    document.body.classList.add("is-ty");
    return () => { html.style.overflow = prev; document.body.classList.remove("is-ty"); };
  }, []);

  const facts = [
    ["Report sent to", email],
    ["Specialist may call", phone],
    ["Website", domain],
  ].filter(([, v]) => v);

  return (
    <main className="ty">
      {/* Opening: a red slash, like the red stroke of the X, wipes across the screen */}
      <motion.div className="ty-wipe" aria-hidden="true" initial={{ x: "-100vw" }} animate={{ x: "180vw" }} transition={{ duration: 1.1, ease: [0.7, 0, 0.2, 1] }}><i /></motion.div>

      {/* Giant brand X drifting in the background */}
      <div className="ty-xwrap" aria-hidden="true"><motion.svg className="ty-x" viewBox="470 24 86 82" aria-hidden="true" initial={{ opacity: 0, scale: 1.25, rotate: -6 }} animate={{ opacity: 1, scale: 1, rotate: 0 }} transition={{ duration: 1.6, ease, delay: 0.5 }}>
        <path d={X_INK} fill="rgba(255,255,255,.045)" />
        <motion.path d={X_RED} fill="#E53935" initial={{ opacity: 0 }} animate={{ opacity: [0, 0.9, 0.55] }} transition={{ duration: 1.4, delay: 1.2 }} />
      </motion.svg></div>
      <div className="ty-glow" aria-hidden="true" />

      <div className="wrap ty-in">
        <motion.div className="ty-kicker" {...fade(0.7)}><i />Request received</motion.div>

        <h1 className="ty-title">
          <span className="ty-line"><motion.span className="ty-l1" {...rise(0.75)}>
            Thank you
            <svg className="ty-tick" viewBox="0 0 64 64" aria-hidden="true">
              <motion.circle cx="32" cy="32" r="29" fill="#16A34A" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 260, damping: 14, delay: 1.35 }} style={{ transformOrigin: "32px 32px" }} />
              <motion.path d="M19 33 L28 42 L45 23" fill="none" stroke="#fff" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.45, delay: 1.6 }} />
            </svg>
          </motion.span></span>
          <span className="ty-line"><motion.span className="ty-l2" {...rise(0.9)}>Your report is <em>on its way.</em></motion.span></span>
        </h1>

        <motion.p className="ty-sub" {...fade(1.2)}>{domain ? <>We're building the full Search Intelligence Report for <b>{domain}</b>.</> : "We're building your full Search Intelligence Report. It will land in your inbox shortly."}</motion.p>

        <motion.div className="ty-bottom" {...fade(1.4)}>
          {facts.length > 0 && <dl className="ty-facts">
            {facts.map(([k, v]) => (<div key={k}><dt>{k}</dt><dd>{v}</dd></div>))}
          </dl>}
          <a className="btn ty-btn" href={DASHBOARD_URL}>Login to dashboard <ArrowRight size={18} className="arrow" /></a>
        </motion.div>
      </div>
    </main>
  );
}
