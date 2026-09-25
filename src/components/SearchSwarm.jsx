import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Search } from "lucide-react";

/*
  Background "search swarm" for the intelligence section.
  A search lens hops between queries scattered around the section. Each
  query belongs to one signal type; when the lens lands on it, that
  signal card lights up in the foreground (via onPick).
*/
const QUERIES = [
  { q: "is /pricing crawlable?", sig: 0, side: "l", y: 8 },
  { q: "best CRM for startups", sig: 4, side: "r", y: 6 },
  { q: "migrate from DropVault", sig: 1, side: "l", y: 27 },
  { q: "hipaa cloud storage", sig: 2, side: "r", y: 24 },
  { q: "who links to rivals?", sig: 3, side: "l", y: 45 },
  { q: "SOC 2 tools for AWS", sig: 4, side: "r", y: 42 },
  { q: "page speed on mobile", sig: 0, side: "l", y: 63 },
  { q: "storage price per seat", sig: 1, side: "r", y: 60 },
  { q: "best backup software", sig: 2, side: "l", y: 81 },
  { q: "top Shopify agencies", sig: 4, side: "r", y: 78 },
  { q: "our reviews on G2", sig: 3, side: "l", y: 95 },
  { q: "cited in AI Overviews?", sig: 4, side: "r", y: 94 },
];
const SIG_NAMES = ["Website", "Content", "SEO", "Authority", "AI"];

const DOTS = Array.from({ length: 22 }, (_, i) => ({
  x: (i * 37 + 11) % 100,
  y: (i * 53 + 7) % 100,
  d: 6 + (i % 5) * 2,
  delay: (i % 7) * 0.8,
}));

export default function SearchSwarm({ active = true, onPick, interval = 1700 }) {
  const reduce = useReducedMotion();
  const [i, setI] = useState(1);
  const cur = QUERIES[i];
  const wrap = useRef(null);
  const pills = useRef([]);
  const [pos, setPos] = useState(null);

  // Park the lens just left of the active query pill
  useLayoutEffect(() => {
    const place = () => {
      const w = wrap.current?.getBoundingClientRect();
      const p = pills.current[i]?.getBoundingClientRect();
      if (!w || !p || !p.width) return;
      setPos({ x: p.left - w.left + 17, y: p.top - w.top + p.height / 2 });
    };
    place();
    window.addEventListener("resize", place);
    return () => window.removeEventListener("resize", place);
  }, [i]);

  useEffect(() => {
    if (!active || reduce) return;
    const t = setInterval(() => setI((v) => (v + 1 + Math.floor(Math.random() * 3)) % QUERIES.length), interval);
    return () => clearInterval(t);
  }, [active, reduce, interval]);

  useEffect(() => { onPick?.(cur.sig); }, [i]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="swarm" aria-hidden="true" ref={wrap}>
      {DOTS.map((d, k) => (
        <span key={k} className="swarm-dot" style={{ left: `${d.x}%`, top: `${d.y}%`, animationDuration: `${d.d}s`, animationDelay: `${d.delay}s` }} />
      ))}

      {QUERIES.map((item, k) => {
        const on = k === i;
        return (
          <motion.div key={item.q} ref={(el) => (pills.current[k] = el)} className={"swarm-q" + (on ? " on" : "")} style={item.side === "l" ? { left: 0, top: `${item.y}%` } : { right: 0, top: `${item.y}%` }}
            animate={{ y: [0, -6, 0] }} transition={{ duration: 5 + (k % 4), repeat: Infinity, ease: "easeInOut", delay: k * 0.3 }}>
            <Search size={12} />
            <span>{item.q}</span>
            <AnimatePresence>
              {on && (
                <motion.em key="tag" initial={{ opacity: 0, x: -4 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} transition={{ delay: 0.45 }}>
                  {SIG_NAMES[item.sig]}
                </motion.em>
              )}
            </AnimatePresence>
          </motion.div>
        );
      })}

      <motion.div className="swarm-lens" initial={false} animate={pos ? { left: pos.x, top: pos.y } : { left: cur.side === "l" ? "4%" : "96%", top: `${cur.y}%` }} transition={{ type: "spring", stiffness: 60, damping: 14 }}>
        <motion.span key={i} className="swarm-ping" initial={{ scale: 0.6, opacity: 0.7 }} animate={{ scale: 2.6, opacity: 0 }} transition={{ duration: 1.2, delay: 0.5, ease: "easeOut" }} />
        <span className="swarm-lens-core"><Search size={15} strokeWidth={2.4} /></span>
      </motion.div>
    </div>
  );
}
