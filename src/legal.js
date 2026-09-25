/*
  Footer documents, summarised from the policies published on ranknexus.ai.
  Each opens inside the page in the document viewer; nothing links out.
  Update the text here when a policy changes.
*/
export const SUPPORT_EMAIL = "support@ranknexus.ai";

export const DOCS = [
  {
    id: "contact",
    label: "Contact",
    title: "Contact us",
    kind: "contact",
  },
  {
    id: "terms",
    label: "Terms",
    title: "Terms of Service",
    updated: "14 July 2026",
    sections: [
      ["The service", "RankNexus is an AI-native SEO, AEO and GEO platform offering website audits, technical fixes, rank tracking and content tools."],
      ["Your account", "You must be 18 or older, give accurate information and keep your login credentials secure."],
      ["Billing", "Subscriptions renew automatically and are billed through Razorpay. Monthly plans can be cancelled at any time; annual plans are a 12-month commitment. Introductory pricing is honoured for as long as your subscription stays continuously active on that plan."],
      ["Refunds", "Refunds are covered by the Refund & Cancellation Policy. Prepaid annual fees are non-refundable except where the law requires otherwise."],
      ["Acceptable use", "You may not audit sites you are not authorised to audit, scrape the service, attempt security breaches, resell access or upload unlawful content."],
      ["AI output", "Output may contain errors and is provided for your review. You are responsible for verifying it and for how you use it."],
      ["Liability", "Our total liability is capped at the amount you paid in the 12 months before a claim. We are not liable for indirect or consequential damages."],
      ["Suspension and termination", "We may suspend or end access for a breach of these terms or to protect the service and its users."],
      ["Governing law", "These terms are governed by the laws of India. Disputes are handled by the courts of Gurugram, Haryana."],
    ],
  },
  {
    id: "privacy",
    label: "Privacy",
    title: "Privacy Policy",
    updated: "21 September 2026",
    sections: [
      ["What we collect", "Account details (name, email, hashed password and account type); subscription and payment information processed by Razorpay; the domains and URLs in your projects; usage logs and device data; and browser push tokens if you turn notifications on."],
      ["How we use it", "To provide, maintain and improve the service, run audits and generate recommendations, process subscriptions and payments, and send transactional and support messages."],
      ["AI processing", "Relevant project data, such as page content and metadata, may be sent to AI model providers acting as our processors to generate audits and recommendations."],
      ["Google data", "When you connect Google Search Console, Analytics or Business Profile, we never see or store your Google password. We do not sell this data, use it for advertising or use it to train generative AI."],
      ["Sharing", "We share data only with service providers bound by confidentiality, when the law requires it, or as part of a business transfer. We do not sell your personal data."],
      ["Cookies", "Strictly necessary cookies keep sign-in, security and payments working. Analytics cookies are used only with your opt-in consent."],
      ["Retention and your rights", "We keep data while your account is active. You can ask to access, correct or delete your data by emailing support@ranknexus.ai."],
      ["India (DPDP Act)", "For users in India, RankNexus acts as a Data Fiduciary under the Digital Personal Data Protection Act, 2023, with a designated grievance process."],
    ],
  },
  {
    id: "subprocessors",
    label: "Sub-processors",
    title: "Sub-processors",
    updated: "25 September 2026",
    intro: "RankNexus relies on a small set of trusted third-party providers that may process personal data on our behalf.",
    table: {
      head: ["Provider", "Purpose", "Location"],
      rows: [
        ["Supabase", "Database, authentication and file storage", "United States (AWS)"],
        ["Vercel", "Application hosting and global edge delivery", "United States / global edge"],
        ["Google LLC", "Search Console, Analytics, Indexing APIs and sign-in", "United States / global"],
        ["Anthropic", "AI generation for audits, content, recommendations and the assistant (not used for model training)", "United States"],
        ["Razorpay", "Payments, subscriptions and invoicing (full card details not stored)", "India"],
        ["Resend", "Transactional and support email", "United States"],
        ["PostHog", "Product analytics, opt-in via the cookie banner", "United States / European Union"],
      ],
    },
  },
  {
    id: "cookies",
    label: "Cookie Policy",
    title: "Cookie Policy",
    updated: "2 August 2026",
    intro: "Consent first: we set no cookie beyond the strictly necessary ones until you tell us we can. We run no advertising or retargeting pixels and never sell personal data.",
    sections: [
      ["Strictly necessary (always on)", "Sign-in session cookies (sb-*-auth-token), your consent choice (nx_cookie_consent, kept 6 months) and payment cookies from Razorpay (rzp_*, session to 1 year)."],
      ["Preferences (opt-in)", "Theme (nx_theme), dashboard sidebar state, free checklist progress, and referral attribution (nx_ref, 90 days)."],
      ["Analytics (opt-in)", "Google Analytics 4 (_ga, up to 2 years), Microsoft Clarity (_clck, _clsk, CLID, 1 day to 1 year) and PostHog product analytics (up to 1 year)."],
      ["Managing consent", "Accept, refuse or withdraw consent at any time from the banner or the Cookie settings link in the footer. Declining is as easy as accepting. We honour Global Privacy Control signals as an opt-out, and you can also manage cookies in your browser."],
      ["Your rights", "Depending on where you live, you have rights under GDPR, CCPA/CPRA, LGPD, PIPEDA, POPIA and India's DPDP Act, 2023. Email support@ranknexus.ai to use them."],
    ],
  },
  {
    id: "cookie-settings",
    label: "Cookie settings",
    title: "Cookie settings",
    kind: "cookie-settings",
  },
  {
    id: "refund",
    label: "Refund & Cancellation",
    title: "Refund & Cancellation Policy",
    updated: "14 July 2026",
    sections: [
      ["Subscriptions", "Plans are billed in advance through Razorpay, and access continues through the paid period."],
      ["Cancelling", "Cancel any time from account settings or by email. Future renewals stop and paid features stay available until the current cycle ends. Remaining days are not automatically pro-rated or refunded."],
      ["Refunds", "Subscription fees are generally non-refundable once a billing cycle has begun. Refunds may be given for duplicate charges, documented technical failures that prevented substantial use, or where the law requires."],
      ["How to request", "Email support@ranknexus.ai within 7 days with your account email, transaction or invoice ID and the reason. We aim to reply in 3–5 business days; approved refunds reach the original payment method in 5–10 business days."],
      ["Currency", "Prices show in USD internationally and in Indian rupees (GST inclusive) in India. Refunds are made in the original currency; bank exchange-rate differences are outside our control."],
      ["Free tier, trials and chargebacks", "Free tiers and trials are not eligible for refunds. Please contact support before raising a chargeback."],
    ],
  },
  {
    id: "shipping",
    label: "Shipping & Delivery",
    title: "Shipping & Delivery Policy",
    updated: "14 July 2026",
    sections: [
      ["Digital only", "RankNexus is a digital software service. Nothing is shipped physically; everything is delivered through your online account."],
      ["When you get access", "Free features are available as soon as you sign up. Paid features switch on automatically once Razorpay confirms payment, usually within a few minutes. AI-generated tasks can take up to a couple of minutes to complete."],
      ["Your outputs", "Audits, reports and generated content are produced in the app and can be viewed, copied or exported from your dashboard."],
      ["Access problems", "Raise a ticket from the Support page in your dashboard or email support@ranknexus.ai. Billing questions are covered by the Refund & Cancellation Policy."],
    ],
  },
];
