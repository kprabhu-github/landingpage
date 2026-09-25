import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Check, Copy, Mail, X } from "lucide-react";
import { Logo } from "../components/ui.jsx";
import { DOCS, SUPPORT_EMAIL } from "../legal.js";
import wordmarkUrl from "../assets/brand/ranknexus-wordmark.svg";

const COOKIE_KEY = "nx_cookie_prefs";

function readPrefs() {
  try { return { preferences: false, analytics: false, ...JSON.parse(localStorage.getItem(COOKIE_KEY) || "{}") }; }
  catch { return { preferences: false, analytics: false }; }
}

function ContactDoc({ onForm }) {
  const [copied, setCopied] = useState(false);
  async function copy() {
    try { await navigator.clipboard.writeText(SUPPORT_EMAIL); setCopied(true); setTimeout(() => setCopied(false), 1800); }
    catch { const r = document.createRange(); const el = document.getElementById("dv-email"); if (el) { r.selectNodeContents(el); const s = getSelection(); s.removeAllRanges(); s.addRange(r); } }
  }
  return (
    <div className="dv-contact">
      <p className="dv-intro">Questions about RankNexus, your report or your account? Write to us and a real person replies, usually within one business day.</p>
      <div className="dv-mail">
        <span className="dv-mail-ico"><Mail size={18} /></span>
        <span id="dv-email" className="dv-mail-txt">{SUPPORT_EMAIL}</span>
        <button type="button" className="dv-copy" onClick={copy}>{copied ? <><Check size={14} />Copied</> : <><Copy size={14} />Copy</>}</button>
      </div>
      <div className="dv-grid">
        <div><b>Existing customers</b><span>Open a support ticket from your dashboard for in-app and push updates on every reply.</span></div>
        <div><b>Find us</b><span>LinkedIn: rank-nexus-ai · Instagram: @ranknexus.ai · YouTube: @RankNexus</span></div>
      </div>
      <button type="button" className="btn btn-primary dv-cta" onClick={onForm}>Get my free report instead <ArrowRight size={16} /></button>
    </div>
  );
}

function CookieSettings() {
  const [prefs, setPrefs] = useState(readPrefs);
  const [saved, setSaved] = useState(false);
  const rows = [
    ["necessary", "Strictly necessary", "Sign-in, security, consent choice and payments. Always on.", true],
    ["preferences", "Preferences", "Remember choices like theme, checklist progress and referral attribution.", false],
    ["analytics", "Analytics", "Google Analytics 4, Microsoft Clarity and PostHog help us see how the site is used.", false],
  ];
  function save(next) {
    const p = next || prefs;
    setPrefs(p);
    try { localStorage.setItem(COOKIE_KEY, JSON.stringify({ ...p, savedAt: new Date().toISOString() })); } catch {}
    setSaved(true); setTimeout(() => setSaved(false), 1800);
  }
  return (
    <div className="dv-cookies">
      <p className="dv-intro">Choose which cookies RankNexus may use. You can change this any time from the footer.</p>
      {rows.map(([k, t, s, locked]) => {
        const on = locked || prefs[k];
        return (
          <div key={k} className="dv-toggle-row">
            <span><b>{t}</b><small>{s}</small></span>
            <button type="button" role="switch" aria-checked={on} aria-label={t} disabled={locked} className={"dv-switch" + (on ? " on" : "")} onClick={() => setPrefs({ ...prefs, [k]: !prefs[k] })}>
              <motion.i layout transition={{ type: "spring", stiffness: 500, damping: 32 }} />
            </button>
          </div>
        );
      })}
      <div className="dv-cookie-actions">
        <button type="button" className="btn btn-ghost btn-sm" onClick={() => save({ preferences: false, analytics: false })}>Reject optional</button>
        <button type="button" className="btn btn-ghost btn-sm" onClick={() => save({ preferences: true, analytics: true })}>Accept all</button>
        <button type="button" className="btn btn-dark btn-sm" onClick={() => save()}>{saved ? <><Check size={14} />Saved</> : "Save choices"}</button>
      </div>
    </div>
  );
}

function DocBody({ doc, onForm }) {
  if (doc.kind === "contact") return <ContactDoc onForm={onForm} />;
  if (doc.kind === "cookie-settings") return <CookieSettings />;
  return (
    <>
      {doc.intro && <p className="dv-intro">{doc.intro}</p>}
      {doc.sections?.map(([h, p], i) => (
        <motion.section key={h} className="dv-sec" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 + i * 0.04 }}>
          <span className="dv-num">{String(i + 1).padStart(2, "0")}</span>
          <div><h4>{h}</h4><p>{p}</p></div>
        </motion.section>
      ))}
      {doc.table && (
        <div className="dv-table-wrap">
          <table className="dv-table">
            <thead><tr>{doc.table.head.map((h) => <th key={h}>{h}</th>)}</tr></thead>
            <tbody>{doc.table.rows.map((r) => <tr key={r[0]}>{r.map((c, i) => <td key={i}>{c}</td>)}</tr>)}</tbody>
          </table>
        </div>
      )}
      <p className="dv-foot">Questions about this policy? Email {SUPPORT_EMAIL}.</p>
    </>
  );
}

export function DocViewer({ openId, setOpenId, onForm }) {
  const doc = DOCS.find((d) => d.id === openId);
  const body = useRef(null);
  const closeRef = useRef(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!doc) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e) => e.key === "Escape" && setOpenId(null);
    window.addEventListener("keydown", onKey);
    setTimeout(() => closeRef.current?.focus(), 50);
    return () => { document.body.style.overflow = prev; window.removeEventListener("keydown", onKey); };
  }, [!!doc]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => { if (body.current) body.current.scrollTop = 0; setProgress(0); }, [openId]);

  function onScroll(e) {
    const el = e.currentTarget;
    const max = el.scrollHeight - el.clientHeight;
    setProgress(max > 0 ? el.scrollTop / max : 1);
  }

  return (
    <AnimatePresence>
      {doc && (
        <motion.div className="dv-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onMouseDown={(e) => e.target === e.currentTarget && setOpenId(null)}>
          <motion.div className="dv" role="dialog" aria-modal="true" aria-labelledby="dv-title"
            initial={{ opacity: 0, y: 40, scale: 0.97, clipPath: "inset(8% 4% 8% 4% round 28px)" }}
            animate={{ opacity: 1, y: 0, scale: 1, clipPath: "inset(0% 0% 0% 0% round 28px)" }}
            exit={{ opacity: 0, y: 30, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 260, damping: 28 }}>
            <nav className="dv-rail" aria-label="Documents">
              <div className="dv-rail-brand"><Logo size={30} onDark /><span>Help &amp; legal</span></div>
              {DOCS.map((d) => (
                <button key={d.id} type="button" className={"dv-tab" + (d.id === doc.id ? " on" : "")} onClick={() => setOpenId(d.id)}>
                  {d.id === doc.id && <motion.span layoutId="dv-tab-bg" className="dv-tab-bg" transition={{ type: "spring", stiffness: 420, damping: 36 }} />}
                  <span className="dv-tab-txt">{d.label}</span>
                </button>
              ))}
            </nav>
            <div className="dv-main">
              <div className="dv-progress"><span style={{ transform: `scaleX(${progress})` }} /></div>
              <header className="dv-head">
                <div>
                  <h3 id="dv-title">{doc.title}</h3>
                  {doc.updated && <span className="dv-updated">Summary of the published policy · Last updated {doc.updated}</span>}
                </div>
                <button ref={closeRef} type="button" className="dv-close" onClick={() => setOpenId(null)} aria-label="Close"><X size={18} /></button>
              </header>
              <div className="dv-body" ref={body} onScroll={onScroll}>
                <AnimatePresence mode="wait">
                  <motion.div key={doc.id} initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }} transition={{ duration: 0.22 }}>
                    <DocBody doc={doc} onForm={() => { setOpenId(null); setTimeout(onForm, 250); }} />
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default function Footer({ onForm }) {
  const [openId, setOpenId] = useState(null);
  // Other parts of the page (e.g. the form's Privacy Policy link) open documents via this event
  useEffect(() => {
    const on = (e) => setOpenId(e.detail);
    window.addEventListener("rn:doc", on);
    return () => window.removeEventListener("rn:doc", on);
  }, []);
  return (
    <footer className="foot2">
      <div className="wrap">
        <div className="foot2-top">
          <div className="foot2-brand">
            <img src={wordmarkUrl} alt="RankNexus" width="150" height="24" />
            <p>Search intelligence for the AI era. See how Google and AI engines understand, rank and recommend your brand.</p>
          </div>
          <button type="button" className="foot2-mail" onClick={() => setOpenId("contact")}>
            <span className="foot2-mail-k">Talk to us</span>
            <span className="foot2-mail-v">{SUPPORT_EMAIL} <ArrowRight size={15} /></span>
          </button>
        </div>
        <div className="foot2-bottom">
          <span>© {new Date().getFullYear()} RankNexus.ai</span>
          <nav className="foot2-links" aria-label="Help and legal">
            {DOCS.map((d) => (
              <button key={d.id} type="button" onClick={() => setOpenId(d.id)} id={d.id === "privacy" ? "privacy" : d.id === "terms" ? "terms" : undefined}>{d.label}</button>
            ))}
          </nav>
        </div>
      </div>
      <DocViewer openId={openId} setOpenId={setOpenId} onForm={onForm} />
    </footer>
  );
}
