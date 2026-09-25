import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Globe, Mail, Phone, ShieldCheck, Sparkles, X } from "lucide-react";
import { ease, Logo, Reveal } from "../components/ui.jsx";
import { checkEmail, checkPhone, cleanDomain, isValidDomain, submitLead } from "../lead.js";
import { engineLogo } from "../engines.js";

const openDoc = (id) => window.dispatchEvent(new CustomEvent("rn:doc", { detail: id }));

const ENGINES = [
  { id: "chatgpt", k: "ChatGPT", s: "GPT", a: -90 },
  { id: "gemini", k: "Gemini", s: "GEM", a: 0 },
  { id: "perplexity", k: "Perplexity", s: "PPX", a: 90 },
  { id: "google-ai", k: "Google AI", s: "AIO", a: 180 },
].map((e) => ({ ...e, logo: engineLogo(e.id) }));

const RUN_MS = 6200;

/* ---------- Loading: an orbital scan of the visitor's site ---------- */
function ScanLoader({ domain }) {
  const [t, setT] = useState(0);
  useEffect(() => {
    const start = performance.now();
    let raf;
    const tick = (now) => { const el = now - start; setT(el); if (el < RUN_MS) raf = requestAnimationFrame(tick); };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);
  const pct = Math.min(100, Math.round((1 - Math.pow(1 - Math.min(1, t / RUN_MS), 2.2)) * 100));
  const msgs = [
    `Crawling ${domain}`,
    "Asking ChatGPT the questions your buyers ask",
    "Reading Gemini and Perplexity answers",
    "Checking Google AI Overviews",
    "Comparing you with your top competitors",
    "Ranking the fixes by impact",
  ];
  const mi = Math.min(msgs.length - 1, Math.floor((t / RUN_MS) * msgs.length));
  const lit = Math.min(4, Math.floor(t / (RUN_MS / 5)));
  const R = 78;

  return (
    <motion.div key="scan" className="sl" initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.96 }} transition={{ duration: 0.35, ease }}>
      <div className="sl-orbit">
        <span className="sl-ring r1" /><span className="sl-ring r2" /><span className="sl-ring r3" />
        <motion.span className="sl-sweep" animate={{ rotate: 360 }} transition={{ duration: 1.6, repeat: Infinity, ease: "linear" }} />
        {ENGINES.map((e, i) => {
          const rad = (e.a * Math.PI) / 180;
          return (
            <motion.span key={e.id} className={"sl-eng" + (i < lit ? " on" : "")} style={{ left: `calc(50% + ${Math.cos(rad) * R}px)`, top: `calc(50% + ${Math.sin(rad) * R}px)` }}
              animate={i < lit ? { scale: [1, 1.18, 1] } : { scale: 1 }} transition={{ duration: 0.45 }}>
              {e.logo ? <img src={e.logo} alt={e.k} /> : e.s}
            </motion.span>
          );
        })}
        <div className="sl-core">
          <span className="sl-pct num">{pct}<small>%</small></span>
          <span className="sl-core-k">scanned</span>
        </div>
      </div>
      <div className="sl-msg" aria-live="polite">
        <AnimatePresence mode="wait">
          <motion.span key={mi} initial={{ opacity: 0, y: 8, filter: "blur(4px)" }} animate={{ opacity: 1, y: 0, filter: "blur(0px)" }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.3 }}>
            {msgs[mi]}<span className="sl-dots"><i>.</i><i>.</i><i>.</i></span>
          </motion.span>
        </AnimatePresence>
      </div>
      <div className="sl-bar"><span style={{ transform: `scaleX(${pct / 100})` }} /></div>
      <div className="sl-steps">
        {["Website", "AI engines", "Competitors", "Report"].map((s, i) => (
          <span key={s} className={pct >= (i + 1) * 25 - 1 ? "on" : ""}>{s}</span>
        ))}
      </div>
    </motion.div>
  );
}

/* ---------- Success ---------- */
function Success({ domain, email, phone }) {
  return (
    <motion.div key="done" className="ok" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
      <div className="ok-badge">
        {Array.from({ length: 12 }).map((_, i) => (
          <motion.i key={i} style={{ rotate: i * 30 }} initial={{ scaleY: 0, opacity: 1 }} animate={{ scaleY: [0, 1, 0], opacity: [1, 1, 0] }} transition={{ duration: 0.8, delay: 0.15 }} />
        ))}
        <motion.svg viewBox="0 0 64 64" width="72" height="72" initial={{ scale: 0.4 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 260, damping: 14 }}>
          <circle cx="32" cy="32" r="30" fill="#E53935" />
          <motion.path d="M19 33 L28 42 L45 23" fill="none" stroke="#fff" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.5, delay: 0.25 }} />
        </motion.svg>
      </div>
      <motion.h3 initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>Your report is on its way</motion.h3>
      <motion.p initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}>
        We're building the full Search Intelligence Report for <b>{domain}</b>.
      </motion.p>
      <motion.div className="ok-list" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55 }}>
        <span><Mail size={15} /><span>Your report will be sent to <b>{email}</b> shortly</span></span>
        <span><Phone size={15} /><span>A RankNexus specialist may call <b>{phone}</b> to walk you through it</span></span>
        <span><Sparkles size={15} /><span>Includes your AI visibility score, competitor gaps and priority fixes</span></span>
      </motion.div>
    </motion.div>
  );
}

export function LeadForm({ website, setWebsite, idPrefix = "lead", cardId = "get-report", title = "Get your free report", sub = "Three quick details. No credit card." }) {
  const fid = (k) => `${idPrefix}-${k}`;
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [errors, setErrors] = useState({});
  const [phase, setPhase] = useState("form");
  const [failed, setFailed] = useState(false);

  async function submit(e) {
    e.preventDefault();
    const errs = {};
    if (!isValidDomain(website)) errs.website = "Enter a website like yourbrand.com";
    const em = checkEmail(email); if (em) errs.email = em;
    const ph = checkPhone(phone); if (ph) errs.phone = ph;
    setErrors(errs);
    if (Object.keys(errs).length) {
      document.getElementById(fid(errs.website ? "website" : errs.email ? "email" : "phone"))?.focus();
      return;
    }
    setFailed(false);
    setPhase("working");
    const req = submitLead({ website, email, phone }).then(() => true, () => false);
    const [ok] = await Promise.all([req, new Promise((r) => setTimeout(r, RUN_MS + 300))]);
    if (!ok) { setFailed(true); setPhase("form"); return; }
    setPhase("done");
  }

  return (
    <div className="form-card" id={cardId || undefined}>
      <AnimatePresence mode="wait">
        {phase === "form" && (
          <motion.form key="f" onSubmit={submit} noValidate initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, y: -8 }} style={{ display: "grid", gap: 14 }}>
            <div>
              <div className="form-title">{title}</div>
              <div style={{ fontSize: 13.5, color: "var(--muted)", marginTop: 2 }}>{sub}</div>
            </div>
            <div className="field">
              <label htmlFor={fid("website")}>Website URL</label>
              <div className="input-prefix">
                <span>https://</span>
                <input id={fid("website")} className={"input" + (errors.website ? " err" : "")} placeholder="yourbrand.com" value={website} onChange={(e) => setWebsite(cleanDomain(e.target.value, true))} inputMode="url" autoComplete="url" />
              </div>
              {errors.website && <span className="err-msg">{errors.website}</span>}
            </div>
            <div className="field">
              <label htmlFor={fid("email")}>Business email</label>
              <input id={fid("email")} type="email" className={"input" + (errors.email ? " err" : "")} placeholder="you@yourbrand.com" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" />
              {errors.email && <span className="err-msg">{errors.email}</span>}
            </div>
            <div className="field">
              <label htmlFor={fid("phone")}>Phone number</label>
              <input id={fid("phone")} type="tel" className={"input" + (errors.phone ? " err" : "")} placeholder="+91 98765 43210" value={phone} onChange={(e) => setPhone(e.target.value)} autoComplete="tel" inputMode="tel" />
              {errors.phone && <span className="err-msg">{errors.phone}</span>}
            </div>
            {failed && <span className="err-msg">We couldn't send your request. Check your connection and try again.</span>}
            <motion.button type="submit" className="btn btn-primary" style={{ height: 56, fontSize: 16 }} whileTap={{ scale: 0.98 }}>
              Generate My Search Intelligence Report <ArrowRight size={17} className="arrow" />
            </motion.button>
            <div className="fine">By submitting, you agree to our <button type="button" className="linkish" onClick={() => openDoc("privacy")}>Privacy Policy</button>. We only use your details to send the report and follow up about it.</div>
          </motion.form>
        )}
        {phase === "working" && <ScanLoader key="w" domain={cleanDomain(website)} />}
        {phase === "done" && <Success key="d" domain={cleanDomain(website)} email={email} phone={phone} />}
      </AnimatePresence>
    </div>
  );
}

export function FinalConversion({ website, setWebsite }) {
  return (
    <section className="final">
      <div className="wrap">
        <Reveal className="final-card">
          <div aria-hidden="true" style={{ position: "absolute", inset: 0, background: "radial-gradient(600px 400px at 85% 20%, rgba(229,57,53,.22), transparent 70%), radial-gradient(500px 300px at 0% 100%, rgba(229,57,53,.10), transparent 70%)" }} />
          <div className="final-copy">
            <h2 className="sec-title">Find out how search engines and AI <em>see your brand.</em></h2>
            <p>One report covering AI visibility, SEO health, content gaps and authority signals, with the fixes ranked by impact.</p>
            <ul className="next">
              <li><span>1</span>We scan your site and test the questions your buyers ask AI engines.</li>
              <li><span>2</span>You get your score, competitor comparison and priority fixes by email.</li>
              <li><span>3</span>If you want, a specialist walks you through it. No obligation.</li>
            </ul>
            <div style={{ display: "flex", gap: 8, alignItems: "center", fontSize: 13, color: "#a8a2a2" }}><ShieldCheck size={15} />Your data stays private. We never share it.</div>
          </div>
          <LeadForm website={website} setWebsite={setWebsite} />
        </Reveal>
      </div>
    </section>
  );
}

/* ---------- Pop-up version of the form, opened from the hero ---------- */
export function ReportModal({ open, onClose, website, setWebsite }) {
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    const t = setTimeout(() => document.getElementById(isValidDomain(website) ? "modal-email" : "modal-website")?.focus(), 350);
    return () => { document.body.style.overflow = prev; window.removeEventListener("keydown", onKey); clearTimeout(t); };
  }, [open]); // eslint-disable-line react-hooks/exhaustive-deps

  const domain = isValidDomain(website) ? cleanDomain(website) : "";
  return (
    <AnimatePresence>
      {open && (
        <motion.div className="rm-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
          <motion.div className="rm" role="dialog" aria-modal="true" aria-label="Get your free report"
            initial={{ opacity: 0, y: 40, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 24, scale: 0.97 }}
            transition={{ type: "spring", stiffness: 280, damping: 28 }}>
            <div className="rm-head">
              <span className="rm-glow" aria-hidden="true" />
              <div className="rm-head-row">
                <span className="rm-k"><Sparkles size={14} />Free AI visibility check</span>
                <button type="button" className="rm-close" onClick={onClose} aria-label="Close"><X size={18} /></button>
              </div>
              <div className="rm-title">Your real score is <em>one step away.</em></div>
              {domain && <span className="rm-domain"><Globe size={14} />{domain}</span>}
            </div>
            <LeadForm website={website} setWebsite={setWebsite} idPrefix="modal" cardId="" title={domain ? "Where should we send it?" : "Get your free report"} sub={domain ? "Your website is filled in. Add your email and phone number." : "Three quick details. No credit card."} />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
