import { useEffect, useState } from "react";
import { MotionConfig } from "framer-motion";
import logoUrl from "./assets/brand/ranknexus-logo.svg";
import logoWhiteUrl from "./assets/brand/ranknexus-logo-white.svg";
import { cleanDomain, isValidDomain } from "./lead.js";
import Hero from "./sections/Hero.jsx";
import Problem from "./sections/Problem.jsx";
import IntelligenceLayer from "./sections/IntelligenceLayer.jsx";
import ValueBlocks from "./sections/ValueBlocks.jsx";
import ReportPreview from "./sections/ReportPreview.jsx";
import Pricing from "./sections/Pricing.jsx";
import { FinalConversion, ReportModal } from "./sections/Convert.jsx";
import Footer from "./sections/Footer.jsx";
import ThankYou from "./sections/ThankYou.jsx";

// Thank-you page lives at <base>/thankyou (e.g. ranknexus.ai/usa/meta-ads/thankyou)
// Worked out from the current URL so it works wherever the page is hosted
const LANDING = location.pathname.replace(/\/thankyou(\.html)?\/?$/, "").replace(/\/index\.html$/, "").replace(/\/$/, "") || "";
const TY_PATH = LANDING + "/thankyou";
const LEAD_KEY = "rn_lead";
const onThankYouPath = () => /\/thankyou(\.html)?\/?$/.test(location.pathname) || location.hash === "#thankyou";
const readLead = () => { try { return JSON.parse(sessionStorage.getItem(LEAD_KEY) || "null"); } catch { return null; } };

export default function App() {
  // The website typed in the hero follows the visitor down the page
  const [website, setWebsite] = useState("");
  const [modal, setModal] = useState(false);
  const domain = isValidDomain(website) ? cleanDomain(website) : "";
  // After a successful submit the page switches to the thank-you view at /thankyou
  const [lead, setLead] = useState(() => (onThankYouPath() ? readLead() : null));
  // /thankyou shows even when opened directly; details appear only after a real submit
  const [onTy, setOnTy] = useState(onThankYouPath);

  useEffect(() => {
    // Opened /thankyou directly without submitting: send them to the landing page
    const TITLE = "RankNexus Search Intelligence Report";
    const onThanks = (e) => {
      setModal(false);
      setLead(e.detail);
      setOnTy(true);
      try { sessionStorage.setItem(LEAD_KEY, JSON.stringify(e.detail)); } catch { /* private mode */ }
      // Opened straight from disk (file://) there is no server to answer /thankyou, so use a hash there
      if (location.protocol === "file:") history.pushState({ ty: true }, "", "#thankyou");
      else history.pushState({ ty: true }, "", TY_PATH);
    };
    const onPop = () => { const ty = onThankYouPath(); setOnTy(ty); setLead(ty ? readLead() : null); if (!ty) document.title = TITLE; };
    window.addEventListener("rn:thanks", onThanks);
    window.addEventListener("popstate", onPop);
    return () => { window.removeEventListener("rn:thanks", onThanks); window.removeEventListener("popstate", onPop); };
  }, []);

  function goToForm() {
    const el = document.getElementById("get-report");
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "center" });
    setTimeout(() => document.getElementById(domain ? "lead-email" : "lead-website")?.focus({ preventScroll: true }), 650);
  }

  return (
    <MotionConfig reducedMotion="user">
      <header className={"topbar" + (onTy ? " topbar-dark" : "")}>
        <div className="wrap">
          <img className="brand-logo" src={onTy ? logoWhiteUrl : logoUrl} alt="RankNexus – get cited by AI" width="179" height="42" />
          <span className="top-note"><span className="live" />Free Search Intelligence Report</span>
        </div>
      </header>
      {onTy ? <ThankYou lead={lead} /> : <main>
        <Hero website={website} setWebsite={setWebsite} onReveal={() => setModal(true)} />
        <Problem />
        <IntelligenceLayer />
        <ValueBlocks />
        <Pricing onStart={goToForm} />
        <ReportPreview domain={domain} onStart={goToForm} />
        <FinalConversion website={website} setWebsite={setWebsite} />
      </main>}
      {!onTy && <Footer onForm={goToForm} />}
      <ReportModal open={modal} onClose={() => setModal(false)} website={website} setWebsite={setWebsite} />
    </MotionConfig>
  );
}
