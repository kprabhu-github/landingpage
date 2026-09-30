# RankNexus paid-ads landing page

Single-goal campaign page for Google Ads, LinkedIn Ads and Meta Ads. One offer: the free Search Intelligence Report. Built with Vite, React 18 and Framer Motion.

## Run

```bash
npm install
npm run dev           # local dev server
npm run build         # dist/ for hosting
npm run build:single  # dist-single/index.html, one self-contained file
```

`deploy/index.html` is a ready-built, self-contained copy of the page. Host it anywhere static or open it directly.

## Page flow

1. **Hero:** two-line headline, website field with animated red outline, live AI answer scanner (5 industries, engine logos). "Reveal My AI Visibility Score" and "Check your real score" open the report pop-up with the website pre-filled.
2. **Search has changed:** Google results vs question -> AI answer -> brand recommendation, rotating through 5 examples.
3. **Intelligence layer:** five signal types -> one intelligence layer (Signal Vortex canvas background).
4. **Four views:** AI Visibility, SEO, Content, Authority.
5. **Pricing:** Solo, Team, Pro, Custom (launch prices).
6. **Report preview:** locked preview personalised with the visitor's domain.
7. **Final form:** website, business email, phone -> scan animation -> confirmation.
8. **Thank-you page:** after a successful submit the page switches to a full thank-you view at `/thank-you` (e.g. `ranknexus.ai/usa/meta-ads/thank-you`) (dark, one screen, no scroll: a red slash wipes in, giant 'Thank you' with a green tick, 'Your report is on its way.', email/phone/website, Login to dashboard; the RankNexus X floats in the background). It pushes `{ event: "thank_you_view" }` to `window.dataLayer`.
9. **Footer:** Contact, Terms, Privacy, Sub-processors, Cookie Policy, Cookie settings, Refund & Cancellation, Shipping & Delivery. Each opens in an in-page viewer; nothing links away from the page.

The website typed in the hero carries through to the pop-up, report preview and final form.

## Key files

- `src/lead.js`: validation, attribution (UTM + click IDs) and `submitLead()`
- `src/legal.js`: policy summaries shown in the footer viewer
- `src/sections/Convert.jsx`: lead form, scan loader, success state, hero pop-up (`ReportModal`)
- `src/sections/ThankYou.jsx`: thank-you page shown after submit
- `src/sections/Footer.jsx`: footer and document viewer
- `src/assets/engines/`: ChatGPT, Gemini, Perplexity, Google AI logos
- `src/assets/brand/`: RankNexus logo, wordmark and RN mark (SVG)

## Thank-you URL

After a successful submit the address changes to `<landing path>/thank-you` without reloading. So a reload or a direct visit also works, the build writes `thank-you.html` and `thank-you/index.html` next to `index.html` (in `dist/`, `dist-single/` and `deploy/`). Upload all three with the page. Opening `/thank-you` directly (without submitting in that tab) redirects to the landing page, so "URL contains /thank-you" is safe as the conversion rule. The `thank_you_view` dataLayer event fires at the same moment.

## Before launch

- **Lead endpoint:** set `LEAD_ENDPOINT` in `src/lead.js` (CRM, HubSpot, Zoho or a serverless function). Until then submissions only log to the browser console.
- **Conversion tracking:** on submit the page pushes `{ event: "generate_lead" }` to `window.dataLayer`. Add GTM to `index.html` and fire Google Ads, LinkedIn Insight and Meta Pixel conversions from that event.
- **Policies:** the footer shows summaries of the policies on ranknexus.ai. Confirm the legal entity name and wording with whoever owns the legal pages.
- **Business email check:** free mail domains (gmail, yahoo, outlook...) are rejected in `src/lead.js`. Remove that rule if you want more volume over quality.
- **noindex:** the page is marked `noindex` so it doesn't compete with the main site in search.
- Brands and scores in the demo animations are sample data.
