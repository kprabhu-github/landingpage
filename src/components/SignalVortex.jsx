import { useEffect, useRef } from "react";

/*
  SignalVortex: canvas background for the intelligence section.

  - A faint grid bends like a gravity well toward the RankNexus engine.
  - Search fragments (queries, metrics, link and AI terms) fly in from every
    edge and spiral into the engine, leaving trails.
  - Each arrival sends a ripple through the engine; every few arrivals a red
    "insight" spark shoots down into the insights card.
  - Fragments bend away from the cursor.

  Props:
    sectionRef  ref of the section the canvas fills
    targetSel   selector of the element fragments fall into (engine bar)
    outSel      selector of the element sparks shoot to (insights card)
*/
const WORDS = [
  "best crm?", "backlinks", "schema", "LCP 2.1s", "citations", "entity", "robots.txt", "prompt",
  "G2 reviews", "AI Overview", "top 10", "crawl", "brand mention", "sitemap", "E-E-A-T", "rank #4",
  "pricing?", "Perplexity", "Gemini", "ChatGPT", "HIPAA?", "alternatives", "near me", "press",
];
const INK = [17, 17, 17];
const RED = [229, 57, 53];

export default function SignalVortex({ sectionRef, targetSel = ".engine-bar", outSel = ".insights" }) {
  const canvas = useRef(null);

  useEffect(() => {
    const cv = canvas.current;
    const sec = sectionRef.current;
    if (!cv || !sec) return;
    const ctx = cv.getContext("2d");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    let HEAD = null;
    let W = 0, H = 0, E = { x: 0, y: 0, w: 0, h: 60 }, OUT = { l: 0, r: 0, y: 0 };
    let raf = 0, running = false, t0 = performance.now(), arrivals = 0;
    const mouse = { x: -9999, y: -9999 };
    const parts = [], ripples = [], sparks = [];

    function measure() {
      const r = sec.getBoundingClientRect();
      W = r.width; H = r.height;
      cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr);
      cv.style.width = W + "px"; cv.style.height = H + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const e = sec.querySelector(targetSel)?.getBoundingClientRect();
      const o = sec.querySelector(outSel)?.getBoundingClientRect();
      E = e ? { x: e.left - r.left + e.width / 2, y: e.top - r.top + e.height / 2, w: e.width } : { x: W / 2, y: H / 2, w: 300 };
      OUT = o ? { l: o.left - r.left + 18, r: o.right - r.left - 18, y: o.top - r.top + 18 } : { l: W * 0.3, r: W * 0.7, y: H - 40 };
      E.h = e ? e.height : 60;
      const hd = sec.querySelector(".sec-head")?.getBoundingClientRect();
      HEAD = hd ? { x1: hd.left - r.left - 30, x2: hd.right - r.left + 30, y1: hd.top - r.top - 20, y2: hd.bottom - r.top + 20 } : null;
    }

    const target = () => Math.round(Math.min(70, Math.max(24, W / 22)));
    function spawn(initial = false) {
      const side = Math.floor(Math.random() * 4);
      let x, y;
      if (initial) { x = Math.random() * W; y = Math.random() * H; }
      else if (side === 0) { x = Math.random() * W; y = -20; }
      else if (side === 1) { x = W + 20; y = Math.random() * H; }
      else if (side === 2) { x = Math.random() * W; y = H + 20; }
      else { x = -20; y = Math.random() * H; }
      const word = Math.random() < 0.28 ? WORDS[Math.floor(Math.random() * WORDS.length)] : null;
      parts.push({
        x, y, vx: 0, vy: 0, trail: [],
        spin: (Math.random() < 0.5 ? -1 : 1) * (0.55 + Math.random() * 0.5),
        speed: 0.5 + Math.random() * 0.7,
        red: Math.random() < 0.26,
        r: word ? 2 : 1.2 + Math.random() * 1.6,
        word, life: 0,
      });
    }

    function drawGrid(time) {
      const step = 46, pull = 38, radius = Math.max(W, H) * 0.55;
      const breathe = 1 + Math.sin(time / 1600) * 0.12;
      ctx.lineWidth = 1;
      const warp = (x, y) => {
        const dx = E.x - x, dy = E.y - y, d = Math.hypot(dx, dy) || 1;
        const k = Math.max(0, 1 - d / radius);
        const m = pull * k * k * breathe;
        return [x + (dx / d) * m, y + (dy / d) * m];
      };
      for (let pass = 0; pass < 2; pass++) {
        for (let a = -step; a <= (pass ? W : H) + step; a += step) {
          ctx.beginPath();
          for (let b = -step; b <= (pass ? H : W) + step; b += 12) {
            const [x, y] = pass ? warp(a, b) : warp(b, a);
            b === -step ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
          }
          ctx.strokeStyle = "rgba(17,17,17,0.045)";
          ctx.stroke();
        }
      }
      // soft glow in the well
      const g = ctx.createRadialGradient(E.x, E.y, 0, E.x, E.y, Math.max(160, E.w * 0.55));
      g.addColorStop(0, "rgba(229,57,53,0.10)");
      g.addColorStop(1, "rgba(229,57,53,0)");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, W, H);
    }

    function step(now) {
      const time = now - t0;
      ctx.clearRect(0, 0, W, H);
      drawGrid(time);

      while (parts.length < target()) spawn();

      for (let i = parts.length - 1; i >= 0; i--) {
        const p = parts[i];
        p.life++;
        const dx = E.x - p.x, dy = E.y - p.y, d = Math.hypot(dx, dy) || 1;
        // pull toward the engine + swirl around it
        const pullF = 0.018 * p.speed + 120 / (d * d + 4000);
        p.vx += (dx / d) * pullF + (-dy / d) * 0.012 * p.spin;
        p.vy += (dy / d) * pullF + (dx / d) * 0.012 * p.spin;
        // cursor repels
        const mx = p.x - mouse.x, my = p.y - mouse.y, md = Math.hypot(mx, my);
        if (md < 120 && md > 0) { const f = (1 - md / 120) * 0.6; p.vx += (mx / md) * f; p.vy += (my / md) * f; }
        p.vx *= 0.975; p.vy *= 0.975;
        const sp = Math.hypot(p.vx, p.vy), max = 3.2 * p.speed + 1;
        if (sp > max) { p.vx = (p.vx / sp) * max; p.vy = (p.vy / sp) * max; }
        p.x += p.vx; p.y += p.vy;
        p.trail.push(p.x, p.y);
        if (p.trail.length > 36) p.trail.splice(0, 2);

        const col = p.red ? RED : INK;
        const fadeIn = Math.min(1, p.life / 40);
        const near = Math.min(1, d / 160);
        const inHead = HEAD && p.x > HEAD.x1 && p.x < HEAD.x2 && p.y > HEAD.y1 && p.y < HEAD.y2;
        const alpha = fadeIn * (0.25 + 0.55 * near) * (p.red ? 1.1 : 0.7) * (inHead ? 0.12 : 1);

        // trail
        if (p.trail.length > 4) {
          ctx.beginPath();
          ctx.moveTo(p.trail[0], p.trail[1]);
          for (let k = 2; k < p.trail.length; k += 2) ctx.lineTo(p.trail[k], p.trail[k + 1]);
          ctx.strokeStyle = `rgba(${col},${alpha * 0.35})`;
          ctx.lineWidth = p.red ? 1.4 : 1;
          ctx.stroke();
        }
        // head
        if (p.word && d > 70 && !inHead) {
          ctx.font = '500 11px "Geist Mono", ui-monospace, monospace';
          ctx.fillStyle = `rgba(${col},${Math.min(0.75, alpha + 0.1)})`;
          ctx.fillText(p.word, p.x + 6, p.y + 4);
        }
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${col},${Math.min(1, alpha + 0.2)})`;
        ctx.fill();

        // arrival: inside the engine bar area
        if (Math.abs(p.x - E.x) < E.w * 0.08 && Math.abs(p.y - E.y) < 26) {
          parts.splice(i, 1);
          arrivals++;
          ripples.push({ r: 10, a: p.red ? 0.55 : 0.3, red: p.red });
          if (arrivals % 6 === 0) { const side = Math.random() < 0.5 ? -1 : 1; sparks.push({ t: 0, side }); }
        } else if (p.life > 1400 || p.x < -200 || p.x > W + 200 || p.y < -200 || p.y > H + 200) {
          parts.splice(i, 1);
        }
      }

      // ripples from the engine
      for (let i = ripples.length - 1; i >= 0; i--) {
        const q = ripples[i];
        q.r += 2.4; q.a *= 0.955;
        ctx.beginPath();
        q.at ? ctx.arc(q.at[0], q.at[1], q.r, 0, Math.PI * 2) : ctx.ellipse(E.x, E.y, q.r * 2.2, q.r * 0.9, 0, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(${q.red ? RED : INK},${q.a})`;
        ctx.lineWidth = 1.2;
        ctx.stroke();
        if (q.a < 0.02) ripples.splice(i, 1);
      }

      // insight sparks: arc out of the engine's lower corner into the insights card
      for (let i = sparks.length - 1; i >= 0; i--) {
        const s = sparks[i];
        s.t += 0.016;
        const P = (u) => {
          const x0 = E.x + s.side * E.w * 0.42, y0 = E.y + E.h / 2;
          const x2 = s.side < 0 ? OUT.l : OUT.r, y2 = OUT.y;
          const cx = x0 + s.side * 120, cy = (y0 + y2) / 2;
          const a = (1 - u) * (1 - u), b = 2 * (1 - u) * u, c = u * u;
          return [a * x0 + b * cx + c * x2, a * y0 + b * cy + c * y2];
        };
        const head = 1 - Math.pow(1 - Math.min(1, s.t), 3);
        const tail = Math.max(0, head - 0.25);
        ctx.beginPath();
        for (let u = tail; u <= head; u += 0.02) { const [x, y] = P(u); u === tail ? ctx.moveTo(x, y) : ctx.lineTo(x, y); }
        const [hx, hy] = P(head), [tx, ty] = P(tail);
        const gr = ctx.createLinearGradient(tx, ty, hx, hy);
        gr.addColorStop(0, "rgba(229,57,53,0)");
        gr.addColorStop(1, "rgba(229,57,53,0.85)");
        ctx.strokeStyle = gr; ctx.lineWidth = 2; ctx.stroke();
        ctx.beginPath(); ctx.arc(hx, hy, 3.2, 0, Math.PI * 2); ctx.fillStyle = "rgba(229,57,53,1)"; ctx.fill();
        if (s.t >= 1) {
          ripples.push({ r: 4, a: 0.5, red: true, at: [hx, hy] });
          sparks.splice(i, 1);
        }
      }

      if (running) raf = requestAnimationFrame(step);
    }

    function start() { if (running || reduce) return; running = true; raf = requestAnimationFrame(step); }
    function stop() { running = false; cancelAnimationFrame(raf); }

    measure();
    for (let i = 0; i < target(); i++) spawn(true);
    if (reduce) { drawGrid(0); for (let i = 0; i < 40; i++) step(performance.now()); }

    const io = new IntersectionObserver(([en]) => (en.isIntersecting ? start() : stop()), { rootMargin: "100px" });
    io.observe(sec);
    const ro = new ResizeObserver(() => measure());
    ro.observe(sec);
    const onMove = (e) => { const r = sec.getBoundingClientRect(); mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top; };
    const onLeave = () => { mouse.x = mouse.y = -9999; };
    sec.addEventListener("pointermove", onMove);
    sec.addEventListener("pointerleave", onLeave);
    return () => { stop(); io.disconnect(); ro.disconnect(); sec.removeEventListener("pointermove", onMove); sec.removeEventListener("pointerleave", onLeave); };
  }, [sectionRef, targetSel, outSel]);

  return <canvas ref={canvas} className="vortex" aria-hidden="true" />;
}
