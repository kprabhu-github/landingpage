import { useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Globe, Mail, Phone } from "lucide-react";
import { ease } from "../components/ui.jsx";

export const DASHBOARD_URL = "https://ranknexus.ai/";

const up = (d = 0) => ({ initial: { opacity: 0, y: 14 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.6, ease, delay: d } });

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
      <div className="ty-bg" aria-hidden="true" />
      <motion.div className="ty-ticket" initial={{ opacity: 0, y: 28, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.7, ease }}>
        <div className="ty-top">
          <div className="ty-check">
            <span className="ty-pulse" /><span className="ty-pulse d2" />
            <motion.svg viewBox="0 0 64 64" width="72" height="72" aria-hidden="true" initial={{ scale: 0.4 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 260, damping: 15, delay: 0.15 }}>
              <circle cx="32" cy="32" r="30" fill="#16A34A" />
              <motion.path d="M19 33 L28 42 L45 23" fill="none" stroke="#fff" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.5, delay: 0.45 }} />
            </motion.svg>
          </div>
          <motion.span className="ty-kicker" {...up(0.25)}>Request received</motion.span>
          <motion.h1 className="ty-title" {...up(0.32)}>
            <span>Thank you.</span>
            <span>Your report is <em>on its way.</em></span>
          </motion.h1>
          <motion.p className="ty-sub" {...up(0.4)}>We're building the full Search Intelligence Report for <b>{domain}</b>.</motion.p>
        </div>

        <div className="ty-perf" aria-hidden="true" />

        <div className="ty-bottom">
          <ul className="ty-rows">
            {rows.map(({ I, k, v }, i) => (
              <motion.li key={k} {...up(0.5 + i * 0.08)}>
                <span className="ty-ic"><I size={17} /></span>
                <span className="ty-k">{k}</span>
                <span className="ty-dots" aria-hidden="true" />
                <b className="ty-v">{v}</b>
              </motion.li>
            ))}
          </ul>
          <motion.a className="btn btn-dark ty-btn" href={DASHBOARD_URL} {...up(0.78)}>
            Login to dashboard <ArrowRight size={17} className="arrow" />
          </motion.a>
        </div>
      </motion.div>
    </main>
  );
}
