import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useInView } from "framer-motion";
import { ArrowRight, Award, Search, Sparkles } from "lucide-react";
import { ease, Reveal } from "../components/ui.jsx";

/*
  Example searches (fictional brands). Each full loop of the
  question -> answer -> recommendation flow moves to the next one.
*/
const STORIES = [
  {
    query: "best accounting software for small business",
    links: [
      ["bestaccountingsoftware.com", "12 Best Accounting Tools for Small Business"],
      ["ledgerly.com", "Ledgerly: Online Accounting Software"],
      ["reddit.com", "What accounting software do you use?"],
      ["finstack.io", "Finstack Pricing and Plans"],
    ],
    question: "Which accounting software should a 10-person business use?",
    brand: "Ledgerly",
    answer: ["For a team that size, ", " is usually the first pick. It handles invoicing, payroll and tax filing in one place, and reviewers rate its support highly."],
  },
  {
    query: "best crm for a small sales team",
    links: [
      ["crmreviewhub.com", "10 Best CRMs for Small Sales Teams"],
      ["pipelane.io", "Pipelane CRM: Simple Sales Pipelines"],
      ["reddit.com", "Which CRM does your startup actually use?"],
      ["closeflow.com", "Closeflow Plans and Pricing"],
    ],
    question: "Which CRM should a 5-person sales team start with?",
    brand: "Pipelane",
    answer: ["Most teams that size start with ", ". Setup takes an afternoon, it syncs with Gmail and Outlook, and pricing stays low until you grow."],
  },
  {
    query: "running shoes for flat feet",
    links: [
      ["runguide.com", "The 9 Best Running Shoes for Flat Feet"],
      ["stryde.com", "Stryde Arch: Stability Running Shoe"],
      ["reddit.com", "Flat feet runners, what do you wear?"],
      ["paceworks.com", "Paceworks Motion Control Range"],
    ],
    question: "What are the best running shoes for flat feet on long runs?",
    brand: "Stryde Arch",
    answer: ["Runners with flat feet most often recommend the ", ". It has firm arch support without feeling stiff, and it holds up well past 500 km."],
  },
  {
    query: "dentist open on weekends near indiranagar",
    links: [
      ["localdentistlist.in", "Top 15 Dental Clinics in Indiranagar"],
      ["brightsmiledental.in", "BrightSmile Dental: Book an Appointment"],
      ["maps.google.com", "Dentists near Indiranagar, Bengaluru"],
      ["carepoint.in", "CarePoint Dental Timings and Fees"],
    ],
    question: "Which dental clinic in Indiranagar is good for a root canal on a Saturday?",
    brand: "BrightSmile Dental",
    answer: ["", " is open on Saturdays and patients often mention painless root canals and clear pricing. Book ahead, weekend slots fill quickly."],
  },
  {
    query: "project management tool for agencies",
    links: [
      ["pmtoolsreview.com", "Best Project Management Tools for Agencies"],
      ["taskhive.com", "Taskhive: Client Projects in One Place"],
      ["reddit.com", "Agency owners, what do you use for projects?"],
      ["boardly.io", "Boardly Features and Pricing"],
    ],
    question: "What's the best project management tool for a 20-person agency?",
    brand: "Taskhive",
    answer: ["Agencies that size usually land on ", ". Client portals, time tracking and retainers are built in, so there's less to stitch together."],
  },
];

export default function Problem() {
  const ref = useRef(null);
  const inView = useInView(ref, { margin: "-25% 0px" });
  // question -> answer -> recommendation -> hold, then the next example
  const [tick, setTick] = useState(2);
  useEffect(() => {
    if (!inView) return;
    const t = setInterval(() => setTick((v) => v + 1), 1700);
    return () => clearInterval(t);
  }, [inView]);
  const step = (tick % 4) + 1;
  const story = Math.floor(tick / 4) % STORIES.length;
  const shownStep = Math.min(step, 3);
  const S = STORIES[story];
  const swap = { initial: { opacity: 0, y: 8 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -8 }, transition: { duration: 0.35, ease } };

  return (
    <section className="sec surface" ref={ref}>
      <div className="wrap">
        <Reveal className="sec-head center">
          <h2 className="sec-title">Search has <span className="hl-red">changed.</span></h2>
        </Reveal>

        <div className="shift">
          <Reveal className="shift-col">
            <div className="shift-tag"><span>Before</span><span>Customer searches Google</span></div>
            <div className="shift-panel before">
              <AnimatePresence mode="wait">
                <motion.div key={story} {...swap} style={{ display: "grid", gap: 14 }}>
                  <div className="gsearch"><Search size={16} color="var(--muted)" /> {S.query}</div>
                  {S.links.map(([u, t], i) => (
                    <div key={u} className="glink">
                      <span className="u">{u}</span>
                      <span className="t">{t}</span>
                      <span className="d" style={{ width: `${86 - i * 9}%` }} />
                    </div>
                  ))}
                </motion.div>
              </AnimatePresence>
              <div style={{ fontSize: 13, color: "var(--muted)" }}>They open tabs, compare, then decide.</div>
            </div>
          </Reveal>

          <div className="shift-mid" aria-hidden="true">
            <motion.div className="arrow" animate={{ x: [0, 4, 0] }} transition={{ duration: 1.6, repeat: Infinity }}><ArrowRight size={22} /></motion.div>
          </div>

          <Reveal className="shift-col" delay={0.1}>
            <div className="shift-tag"><span style={{ color: "var(--red)" }}>After</span><span>Customer asks AI</span></div>
            <div className="shift-panel">
              <div className="flow">
                <div className={"flow-step" + (shownStep >= 1 ? " on" : "")}>
                  <span className="n">01</span>
                  <div>
                    <div className="k">Question</div>
                    <AnimatePresence mode="wait"><motion.span key={story} {...swap} className="bubble-q">{S.question}</motion.span></AnimatePresence>
                  </div>
                </div>
                <div className="flow-link" />
                <div className={"flow-step" + (shownStep >= 2 ? " on" : "")}>
                  <span className="n">02</span>
                  <div>
                    <div className="k" style={{ display: "flex", gap: 6, alignItems: "center" }}><Sparkles size={12} color="var(--red)" />AI answer</div>
                    <AnimatePresence mode="wait">
                      <motion.div key={story} className="bubble-a" initial={{ opacity: 0 }} animate={{ opacity: shownStep >= 2 ? 1 : 0.35 }} exit={{ opacity: 0 }} transition={{ duration: 0.35 }}>
                        {S.answer[0]}<mark>{S.brand}</mark>{S.answer[1]}
                      </motion.div>
                    </AnimatePresence>
                  </div>
                </div>
                <div className="flow-link" />
                <div className={"flow-step" + (shownStep >= 3 ? " on" : "")}>
                  <span className="n">03</span>
                  <div>
                    <div className="k">Brand recommendation</div>
                    <motion.div className="reco" animate={{ opacity: shownStep >= 3 ? 1 : 0.35 }} transition={{ duration: 0.35, ease }}>
                      <span className="badge"><Award size={18} /></span>
                      <span style={{ fontSize: 14 }}><b>{S.brand} gets the customer.</b><br /><span style={{ color: "var(--muted)" }}>The rest were never mentioned.</span></span>
                    </motion.div>
                  </div>
                </div>
              </div>
              <div className="story-dots" aria-hidden="true">{STORIES.map((_, i) => <i key={i} className={i === story ? "on" : ""} />)}</div>
            </div>
          </Reveal>
        </div>

        <Reveal as="p" className="shift-msg">
          The brands search systems <em>understand</em> get discovered first.
        </Reveal>
      </div>
    </section>
  );
}
