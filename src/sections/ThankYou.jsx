import { useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Globe, Mail, Phone } from "lucide-react";
import { ease } from "../components/ui.jsx";

export const DASHBOARD_URL = "https://ranknexus.ai/";

const up = (d = 0) => ({ initial: { opacity: 0, y: 16 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.7, ease, delay: d } });
const RING = "REQUEST RECEIVED • REPORT ON ITS WAY • REQUEST RECEIVED • REPORT ON ITS WAY • ";

export default function ThankYou({ lead }) {
  const { domain, email, phone } = lead;

  useEffect(() => {
    window.scrollTo({ top: 0 });
    document.title = "Thank you | RankNexus Search Intelligence Report";
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ event: "thank_you_view", lead_type: "search_intelligence_report" });
    // One screen, no scroll
    const html = document.documentElement;
    const prev = html.style.overflow;
    html.style.overflow = "hidden";
    return () => { html.style.overflow = prev; };
  }, []);

  const chips = [
    { I: Mail, v: email, k: "Report sent to" },
    { I: Phone, v: phone, k: "A specialist may call" },
    { I: Globe, v: domain, k: "Website being scanned" },
  ];

  return (
    <main className="ty">
      <div className="ty-in">
        <motion.div className="ty-seal" initial={{ opacity: 0, scale: 0.6, rotate: -30 }} animate={{ opacity: 1, scale: 1, rotate: 0 }} transition={{ type: "spring", stiffness: 180, damping: 16 }}>
          <svg className="ty-ring" viewBox="0 0 200 200" aria-hidden="true">
            <defs><path id="tyCircle" d="M100,100 m-80,0 a80,80 0 1,1 160,0 a80,80 0 1,1 -160,0" /></defs>
            <text><textPath href="#tyCircle" textLength="502">{RING}</textPath></text>
          </svg>
          <svg className="ty-tick" viewBox="0 0 64 64" aria-hidden="true">
            <circle cx="32" cy="32" r="30" fill="#16A34A" />
            <motion.path d="M19 33 L28 42 L45 23" fill="none" stroke="#fff" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"
              initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.55, delay: 0.45 }} />
          </svg>
        </motion.div>

        <h1 className="ty-title">
          <motion.span className="ty-l1" {...up(0.2)}>Thank you.</motion.span>
          <motion.span className="ty-l2" {...up(0.3)}>Your report is <em>on its way.</em></motion.span>
        </h1>

        <motion.p className="ty-sub" {...up(0.4)}>We're building the full Search Intelligence Report for <b>{domain}</b>.</motion.p>

        <motion.div className="ty-chips" {...up(0.5)}>
          {chips.map(({ I, v, k }) => (
            <span key={k} className="ty-chip" title={k}><I size={15} /><span className="sr-only">{k}: </span>{v}</span>
          ))}
        </motion.div>

        <motion.a className="btn btn-dark ty-btn" href={DASHBOARD_URL} {...up(0.6)}>
          Login to dashboard <ArrowRight size={17} className="arrow" />
        </motion.a>
      </div>
    </main>
  );
}
