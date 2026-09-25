import { motion } from "framer-motion";
import { ArrowRight, Lock } from "lucide-react";
import { Bar, ease, Logo, Reveal } from "../components/ui.jsx";
import { engineLogo } from "../engines.js";

function EngineIcon({ id, name }) {
  const src = engineLogo(id);
  return src ? <img className="rp-eng-logo" src={src} alt="" aria-hidden="true" title={name} /> : null;
}

export default function ReportPreview({ domain, onStart }) {
  const d = domain || "yourbrand.com";
  return (
    <section className="sec surface">
      <div className="wrap">
        <Reveal className="sec-head center">
          <h2 className="sec-title">See what your <span className="hl-red">Search Intelligence Report</span> reveals.</h2>
        </Reveal>

        <Reveal className="report-wrap" y={40}>
          <div className="report">
            <div className="report-top">
              <div style={{ display: "flex", alignItems: "center", gap: 12, minWidth: 0 }}>
                <Logo size={32} />
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontWeight: 600 }}>Search Intelligence Report</div>
                  <div className="mono" style={{ fontSize: 12, color: "var(--muted)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{d}</div>
                </div>
              </div>
              <span className="chip"><Lock size={12} />Locked preview</span>
            </div>

            <div className="report-grid">
              <div className="r-sec">
                <div className="k"><span>AI Visibility Score</span><span>01</span></div>
                <div style={{ display: "flex", alignItems: "center", gap: 18, marginTop: 4 }}>
                  <div style={{ width: 84, height: 84, borderRadius: 99, border: "7px solid var(--red)", display: "grid", placeItems: "center", fontFamily: "var(--f-display)", fontWeight: 600, fontSize: 26, background: "var(--surface)", flexShrink: 0 }}>
                    67
                  </div>
                  <div style={{ display: "grid", gap: 6, fontSize: 13, flex: 1 }}>
                    <div className="rp-eng"><span><EngineIcon id="chatgpt" name="ChatGPT" />ChatGPT</span><b>71%</b></div>
                    <div className="rp-eng"><span><EngineIcon id="gemini" name="Gemini" />Gemini</span><b>58%</b></div>
                    <div className="rp-eng"><span><EngineIcon id="perplexity" name="Perplexity" />Perplexity</span><b>69%</b></div>
                  </div>
                </div>
              </div>

              <div className="r-sec">
                <div className="k"><span>Competitor Insights</span><span>02</span></div>
                <div style={{ display: "grid", gap: 9, marginTop: 4 }}>
                  {[["BVAccel", 78], [d || "Your Brand", 54], ["We Make Websites", 49]].map(([k, v], i) => (
                    <div key={k} className="metric-row" style={{ fontSize: 12.5 }}>
                      <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{k}</span>
                      <b>{v}%</b>
                      <Bar value={v} red={i === 1} />
                    </div>
                  ))}
                </div>
              </div>

              <div className="r-sec">
                <div className="k"><span>Missing Opportunities</span><span>03</span></div>
                <div className="blur" style={{ display: "grid", gap: 8, fontSize: 13.5 }}>
                  <span>27 prompts where competitors are named</span>
                  <span>9 keywords ranking 11 to 20</span>
                  <span>6 topics with no page</span>
                </div>
              </div>

              <div className="r-sec">
                <div className="k"><span>Growth Recommendations</span><span>04</span></div>
                <div className="blur" style={{ display: "grid", gap: 8, fontSize: 13.5 }}>
                  <span>1. Rewrite the pricing page for AI answers</span>
                  <span>2. Unblock AI crawlers on the docs folder</span>
                  <span>3. Earn two listings on cited review sites</span>
                </div>
              </div>
            </div>

            <div className="lock">
              <div className="lock-in">
                <motion.span className="lock-ico" animate={{ rotate: [0, -8, 8, 0] }} transition={{ duration: 0.8, repeat: Infinity, repeatDelay: 3 }}><Lock size={22} /></motion.span>
                <div style={{ fontFamily: "var(--f-display)", fontWeight: 600, fontSize: 22, letterSpacing: "-0.015em" }}>Your numbers are one step away</div>
                <div style={{ fontSize: 14.5, color: "var(--muted)" }}>Enter your website and work email. We'll build the full report for {d}.</div>
                <motion.button className="btn btn-primary" onClick={onStart} whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }} transition={{ ease }}>
                  Generate My Report <ArrowRight size={16} className="arrow" />
                </motion.button>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
