import { useEffect, useRef, useState } from "react";
import { animate, motion, useInView, useMotionValue, useTransform } from "framer-motion";
import markUrl from "../assets/brand/ranknexus-mark.svg";
import markDarkUrl from "../assets/brand/ranknexus-mark-dark.svg";

export const ease = [0.22, 1, 0.36, 1];

/* RankNexus mark: the split "X" from the NEXUS wordmark. Use onDark on black surfaces. */
export function Logo({ size = 28, onDark = false }) {
  return (
    <img src={onDark ? markDarkUrl : markUrl} width={size} height={size} alt="" aria-hidden="true" draggable="false"
      style={{ display: "block", width: size, height: size, borderRadius: size * 0.24, boxShadow: onDark ? "none" : "0 0 0 1px rgba(17,17,17,.08)" }} />
  );
}

/* Animated number. Re-animates whenever `value` changes. */
export function CountUp({ value, decimals = 0, prefix = "", suffix = "", duration = 1.1, className = "" }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const mv = useMotionValue(0);
  const [txt, setTxt] = useState(format(0));
  function format(v) {
    return prefix + v.toLocaleString("en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals }) + suffix;
  }
  useEffect(() => mv.on("change", (v) => setTxt(format(v))), [mv, decimals, prefix, suffix]);
  useEffect(() => {
    if (!inView) return;
    const c = animate(mv, value, { duration, ease });
    return () => c.stop();
  }, [value, inView]);
  return <span ref={ref} className={"num " + className}>{txt}</span>;
}

/* Circular score gauge */
export function Ring({ value, size = 112, stroke = 10, label, sub, color = "var(--red)" }) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  return (
    <div ref={ref} style={{ position: "relative", width: size, height: size, flex: "none" }}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }} aria-hidden="true">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--surface)" strokeWidth={stroke} />
        <motion.circle
          cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={stroke} strokeLinecap="round"
          strokeDasharray={c}
          initial={{ strokeDashoffset: c }}
          animate={{ strokeDashoffset: inView ? c * (1 - value / 100) : c }}
          transition={{ duration: 1.2, ease }}
        />
      </svg>
      <div style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center", textAlign: "center" }}>
        <div>
          <div className="kpi-val" style={{ fontSize: size * 0.27 }}><CountUp value={value} /></div>
          {label && <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 3 }}>{label}</div>}
          {sub}
        </div>
      </div>
    </div>
  );
}

/* Smooth path through points (Catmull-Rom to cubic Bezier). Same command count for same N, so paths morph cleanly. */
function smooth(pts) {
  let d = `M${pts[0][0].toFixed(1)},${pts[0][1].toFixed(1)}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] || pts[i];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[i + 2] || p2;
    const t = 0.18;
    const c1 = [p1[0] + (p2[0] - p0[0]) * t, p1[1] + (p2[1] - p0[1]) * t];
    const c2 = [p2[0] - (p3[0] - p1[0]) * t, p2[1] - (p3[1] - p1[1]) * t];
    d += ` C${c1[0].toFixed(1)},${c1[1].toFixed(1)} ${c2[0].toFixed(1)},${c2[1].toFixed(1)} ${p2[0].toFixed(1)},${p2[1].toFixed(1)}`;
  }
  return d;
}

function niceMax(v) {
  const p = Math.pow(10, Math.floor(Math.log10(v)));
  const n = v / p;
  const step = n <= 1 ? 1 : n <= 2 ? 2 : n <= 2.5 ? 2.5 : n <= 5 ? 5 : 10;
  return step * p;
}

/*
  Area/line chart with morphing paths.
  series: [{ data:number[], color, fill? , dashed? }]
*/
function useWidth(initial = 600) {
  const ref = useRef(null);
  const [w, setW] = useState(initial);
  useEffect(() => {
    if (!ref.current) return;
    const ro = new ResizeObserver(([e]) => setW(Math.max(120, e.contentRect.width)));
    ro.observe(ref.current);
    return () => ro.disconnect();
  }, []);
  return [ref, w];
}

export function AreaChart(props) {
  const [ref, w] = useWidth();
  return <div ref={ref} style={{ width: "100%", minWidth: 0 }}><AreaChartInner {...props} W={w} /></div>;
}

function AreaChartInner({ series, height = 180, labels, max: maxIn, unit = "", ticks = 3, showAxis = true, W }) {
  const H = height;
  const padL = showAxis ? 34 : 4;
  const padR = 10;
  const padT = 10;
  const padB = labels ? 22 : 6;
  const all = series.flatMap((s) => s.data);
  const max = maxIn ?? niceMax(Math.max(...all) * 1.08);
  const n = series[0].data.length;
  const x = (i) => padL + (i * (W - padL - padR)) / (n - 1);
  const y = (v) => padT + (1 - v / max) * (H - padT - padB);
  const tickVals = Array.from({ length: ticks + 1 }, (_, i) => (max / ticks) * i);
  const fmt = (v) => (v >= 1000 ? (v / 1000).toFixed(v % 1000 ? 1 : 0) + "k" : Math.round(v)) + unit;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" height={H} style={{ display: "block", overflow: "visible" }} role="img" aria-label="Trend chart">
      <defs>
        {series.map((s, i) => (
          <linearGradient key={i} id={`g-${s.color.replace(/[^a-z0-9]/gi, "")}-${i}`} x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor={s.color} stopOpacity="0.18" />
            <stop offset="100%" stopColor={s.color} stopOpacity="0" />
          </linearGradient>
        ))}
      </defs>
      {tickVals.map((t, i) => (
        <g key={i}>
          <line x1={padL} x2={W - padR} y1={y(t)} y2={y(t)} stroke="var(--line)" strokeWidth="1" vectorEffect="non-scaling-stroke" strokeDasharray={i === 0 ? "0" : "3 4"} />
          {showAxis && (
            <text x={padL - 8} y={y(t) + 3.5} textAnchor="end" fontSize="10" fill="var(--faint)" fontFamily="var(--f-mono)">{fmt(t)}</text>
          )}
        </g>
      ))}
      {labels && labels.map((l, i) => (
        (i % Math.ceil(labels.length / 6) === 0 || i === labels.length - 1) && (
          <text key={i} x={x(i)} y={H - 4} textAnchor={i === 0 ? "start" : i === labels.length - 1 ? "end" : "middle"} fontSize="10" fill="var(--faint)" fontFamily="var(--f-mono)">{l}</text>
        )
      ))}
      {series.map((s, i) => {
        const pts = s.data.map((v, j) => [x(j), y(v)]);
        const line = smooth(pts);
        const area = `${line} L${x(n - 1).toFixed(1)},${y(0).toFixed(1)} L${x(0).toFixed(1)},${y(0).toFixed(1)} Z`;
        const last = pts[pts.length - 1];
        return (
          <g key={i}>
            {s.fill !== false && (
              <motion.path initial={false} animate={{ d: area }} transition={{ duration: 0.8, ease }} fill={`url(#g-${s.color.replace(/[^a-z0-9]/gi, "")}-${i})`} />
            )}
            <motion.path
              initial={false} animate={{ d: line }} transition={{ duration: 0.8, ease }}
              fill="none" stroke={s.color} strokeWidth={s.width || 2} strokeLinecap="round" vectorEffect="non-scaling-stroke"
              strokeDasharray={s.dashed ? "4 5" : undefined}
            />
            {s.dot !== false && (
              <motion.circle initial={false} animate={{ cx: last[0], cy: last[1] }} transition={{ duration: 0.8, ease }} r="4" fill="var(--bg)" stroke={s.color} strokeWidth="2" vectorEffect="non-scaling-stroke" />
            )}
          </g>
        );
      })}
    </svg>
  );
}

export function Sparkline({ data, color = "var(--red)", height = 34 }) {
  return <AreaChart series={[{ data, color, dot: false, width: 1.6 }]} height={height} showAxis={false} ticks={1} />;
}

export function Bar({ value, red, delay = 0 }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  return (
    <div className="bar-track" ref={ref}>
      <motion.div className={"bar-fill" + (red ? " red" : "")} initial={{ width: 0 }} animate={{ width: inView ? `${value}%` : 0 }} transition={{ duration: 0.9, ease, delay }} />
    </div>
  );
}

export function AppWindow({ url = "app.ranknexus.ai", children, className = "", style }) {
  return (
    <div className={"app " + className} style={style}>
      <div className="app-bar">
        <div className="lights"><i /><i /><i /></div>
        <div className="url"><span>{url}</span></div>
        <div style={{ width: 42 }} />
      </div>
      {children}
    </div>
  );
}

/* Reveal on scroll. Content above the fold animates in on load. */
export function Reveal({ children, delay = 0, y = 22, className = "", as = "div", ...rest }) {
  const M = motion[as];
  return (
    <M
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -8% 0px" }}
      transition={{ duration: 0.7, ease, delay }}
      {...rest}
    >
      {children}
    </M>
  );
}

/* Cycles an index while the element is on screen */
export function useCycle(length, ms, active = true) {
  const [i, setI] = useState(0);
  useEffect(() => {
    if (!active) return;
    const t = setInterval(() => setI((v) => (v + 1) % length), ms);
    return () => clearInterval(t);
  }, [length, ms, active]);
  return [i, setI];
}

export { useTransform };
