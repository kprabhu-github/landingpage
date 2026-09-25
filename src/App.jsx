import { useState } from "react";
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

export default function App() {
  // The website typed in the hero follows the visitor down the page
  const [website, setWebsite] = useState("");
  const [modal, setModal] = useState(false);
  const domain = isValidDomain(website) ? cleanDomain(website) : "";

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
          <img className="brand-logo" src={logoUrl} alt="RankNexus – get cited by AI" width="170" height="42" />
          <span className="top-note"><span className="live" />Free Search Intelligence Report</span>
        </div>
      </header>
      <main>
        <Hero website={website} setWebsite={setWebsite} onReveal={() => setModal(true)} />
        <Problem />
        <IntelligenceLayer />
        <ValueBlocks />
        <Pricing onStart={goToForm} />
        <ReportPreview domain={domain} onStart={goToForm} />
        <FinalConversion website={website} setWebsite={setWebsite} />
      </main>
      <Footer onForm={goToForm} />
      <ReportModal open={modal} onClose={() => setModal(false)} website={website} setWebsite={setWebsite} />
    </MotionConfig>
  );
}
