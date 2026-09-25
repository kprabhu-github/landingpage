/* Lead helpers: domain cleanup, validation, attribution and submission. */

export function cleanDomain(v, soft = false) {
  if (soft) return v.replace(/\s+/g, "");
  return v.trim().replace(/^https?:\/\//i, "").replace(/^www\./i, "").replace(/\/.*$/, "").toLowerCase();
}

export function isValidDomain(v) {
  return /^[a-z0-9-]+(\.[a-z0-9-]+)+$/i.test(cleanDomain(v || ""));
}

const FREE_MAIL = /@(gmail|googlemail|yahoo|hotmail|outlook|live|aol|icloud|me|proton(mail)?|rediffmail|zoho|gmx|yandex)\./i;

export function checkEmail(v) {
  const e = (v || "").trim();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)) return "Enter a valid email address";
  if (FREE_MAIL.test(e)) return "Please use your work email so we can match the report to your business";
  return "";
}

/* Ad-click attribution: UTM tags and click IDs from Google, LinkedIn and Meta. */
export function getAttribution() {
  try {
    const p = new URLSearchParams(window.location.search);
    const keys = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content", "gclid", "gbraid", "wbraid", "li_fat_id", "fbclid"];
    const out = {};
    keys.forEach((k) => { const v = p.get(k); if (v) out[k] = v; });
    out.landing_page = window.location.origin + window.location.pathname;
    out.referrer = document.referrer || "";
    return out;
  } catch {
    return {};
  }
}

/*
  Replace LEAD_ENDPOINT with your CRM / form endpoint (HubSpot, Zoho, a serverless function...).
  While it is empty, submissions are only logged to the console so the page can be previewed.
*/
const LEAD_ENDPOINT = "";

export function checkPhone(v) {
  const raw = (v || "").trim();
  const digits = raw.replace(/\D/g, "");
  if (!raw) return "Enter your phone number";
  if (!/^\+?[\d\s().-]+$/.test(raw) || digits.length < 7 || digits.length > 15) return "Enter a valid phone number, with country code if outside India";
  return "";
}

export async function submitLead({ website, email, phone = "" }) {
  const payload = { website: cleanDomain(website), email: email.trim(), phone: phone.trim(), ...getAttribution(), submitted_at: new Date().toISOString() };

  // Conversion event for GTM (Google Ads, LinkedIn Insight Tag and Meta Pixel can all fire from this).
  try {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ event: "generate_lead", lead_type: "search_intelligence_report", website: payload.website });
  } catch {}

  if (!LEAD_ENDPOINT) {
    console.info("[RankNexus] lead captured (no endpoint set)", payload);
    return { ok: true };
  }
  const res = await fetch(LEAD_ENDPOINT, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
  if (!res.ok) throw new Error("Lead submission failed");
  return { ok: true };
}

/* Where "Book Demo" goes. Replace with your Calendly / HubSpot meetings link. */
export const BOOK_DEMO_URL = "#get-report";
