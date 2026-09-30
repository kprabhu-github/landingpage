import { useEffect, useState } from "react";
import { MotionConfig } from "framer-motion";
import logoUrl from "./assets/brand/ranknexus-logo.svg";
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

const TY_HASH = "#thank-you";

export default function App() {
  // The website typed in the hero follows the visitor down the page
  const [website, setWebsite] = useState("");
  const [modal, setModal] = useState(false);
  const domain = isValidDomain(website) ? cleanDomain(website) : "";
  // After a successful submit the page switches to a full thank-you view at #thank-you
  const [lead, setLead] = useState(null);

  useEffect(() => {
    if (location.hash === TY_HASH) history.replaceState(null, "", location.pathname + location.search);
    const onThanks = (e) => {
      setModal(false);
      setLead(e.detail);
      history.pushState({ ty: true }, "", TY_HASH);
    };
    const onPop = () => { if (location.hash !== TY_HASH) { setLead(null); document.title = TITLE; } };
    const TITLE = document.title;
    window.addEventListener("rn:thanks", onThanks);
    window.addEventListener("popstate", onPop);
    return () => { window.removeEventListener("rn:thanks", onThanks); window.removeEventListener("popstate", onPop); };
  }, []);

  function leaveThanks() {
    if (history.state?.ty) history.back();
    else { setLead(null); history.replaceState(null, "", location.pathname + location.search); }
  }

  function goToForm() {
    const el = document.getElementById("get-report");
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "center" });
    setTimeout(() => document.getElementById(domain ? "lead-email" : "lead-website")?.focus({ preventScroll: true }), 650);
  }

  return (
    <MotionConfig reducedMotion="user">
      <header className="topbar">
        <div className="wrap">
          <img className="brand-logo" src={logoUrl} alt="RankNexus – get cited by AI" width="179" height="42" />
          <span className="top-note"><span className="live" />Free Search Intelligence Report</span>
        </div>
      </header>
      {lead ? <ThankYou lead={lead} onBack={leaveThanks} /> : <main>
        <Hero website={website} setWebsite={setWebsite} onReveal={() => setModal(true)} />
        <Problem />
        <IntelligenceLayer />
        <ValueBlocks />
        <Pricing onStart={goToForm} />
        <ReportPreview domain={domain} onStart={goToForm} />
        <FinalConversion website={website} setWebsite={setWebsite} />
      </main>}
      <Footer onForm={lead ? leaveThanks : goToForm} />
      <ReportModal open={modal} onClose={() => setModal(false)} website={website} setWebsite={setWebsite} />
    </MotionConfig>
  );
}
