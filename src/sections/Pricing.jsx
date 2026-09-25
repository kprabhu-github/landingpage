import { Check } from "lucide-react";
import { Reveal } from "../components/ui.jsx";

/* Plans mirror the RankNexus brand pricing (monthly). Update here if prices change.
   Every button stays on this page and opens the report form. */

const PLANS = [
  { name: "Solo", tag: "One site, run properly.", price: 99, was: 149, pts: ["1 teammate · 3,000 credits/mo", "25 pages per update", "All features, Search Console & Analytics"], cta: "Get Solo" },
  { name: "Team", tag: "One site, the whole team on it.", price: 199, was: 299, pts: ["3 teammates · 6,000 credits/mo", "100 pages per update", "All features unlocked"], cta: "Get Team", popular: true },
  { name: "Pro", tag: "Full depth, with real AI tracking.", price: 499, was: 699, pts: ["5 teammates · 15,000 credits/mo", "200 pages per update", "Real ChatGPT, Copilot & Grok tracking"], cta: "Get Pro" },
  { name: "Custom", tag: "Past the top tier.", price: null, pts: ["Unlimited sites, updates & depth", "White-label & multi-tenant", "Priority support · invoicing"], cta: "Talk to sales", sales: true },
];

export default function Pricing({ onStart }) {
  return (
    <section className="sec pricing" id="pricing">
      <div className="wrap">
        <Reveal className="pricing-head">
          <h2 className="sec-title">Simple pricing. <span className="hl-red">Launch price, locked for life.</span></h2>
        </Reveal>
        <div className="plans">
          {PLANS.map((p, i) => (
            <Reveal key={p.name} className={"plan" + (p.popular ? " popular" : "")} delay={i * 0.06} y={16}>
              <div className="plan-top">
                <span className="plan-name">{p.name}</span>
                {p.popular && <span className="plan-badge">Most popular</span>}
              </div>
              <div className="plan-tag">{p.tag}</div>
              <div className="plan-price">
                {p.price ? (<><s>${p.was}</s><b>${p.price}</b><span>/mo</span></>) : <b className="custom">Let's talk</b>}
              </div>
              <ul>
                {p.pts.map((t) => <li key={t}><Check size={14} strokeWidth={2.6} />{t}</li>)}
              </ul>
              <button type="button" className={"plan-cta" + (p.popular ? " primary" : "")} onClick={onStart}>{p.cta}</button>
            </Reveal>
          ))}
        </div>
        <p className="pricing-note">Monthly billing · cancel anytime · no setup fees · no card needed for your free audit</p>
      </div>
    </section>
  );
}
