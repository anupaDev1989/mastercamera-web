// src/components/ui/cinematic-hero.jsx
//
// Three full-viewport snap screens that appear one at a time.
// Uses mandatory scroll-snap so each screen locks in place.
// Animations are driven by IntersectionObserver → motion variants,
// so re-entering a screen replays the entrance — Apple-style.
//
// Safari note (from prior iteration): overlapping sticky+transform layers
// bleed through in WebKit. These sections are fully opaque, no overlap,
// no sticky stacking — bleed-through is structurally impossible.

import React, { useRef, useState, useEffect } from "react";
import { motion, useInView } from "motion/react";
import {
  Layers, ShieldCheck, Signature, Tag, MapPin, Columns2, Archive, Captions, ChevronDown,
} from "lucide-react";

// ─── Easing & spring tokens ────────────────────────────────────────────────
const EASE    = [0.25, 0.46, 0.45, 0.94];
const EASE_IN = [0.55, 0, 1, 0.45];

// ─── Animation variant factories ───────────────────────────────────────────
const stagger = (staggerChildren = 0.09, delayChildren = 0.05) => ({
  hidden: {},
  show: { transition: { staggerChildren, delayChildren } },
});

const slideUp = (duration = 0.7, delay = 0) => ({
  hidden: { opacity: 0, y: 32 },
  show: { opacity: 1, y: 0, transition: { duration, ease: EASE, delay } },
});

const slideUpSm = (duration = 0.55, delay = 0) => ({
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration, ease: EASE, delay } },
});

const fadeIn = (duration = 0.5, delay = 0) => ({
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration, ease: EASE, delay } },
});

const scaleIn = {
  hidden: { opacity: 0, scale: 0.88 },
  show: { opacity: 1, scale: 1, transition: { duration: 0.85, ease: EASE } },
};

// ─── Feature badges ────────────────────────────────────────────────────────
const BADGES = [
  { Icon: Layers,      label: "Job Stacks",        color: "text-blue-500",    iconBg: "bg-blue-500/10 border-blue-500/20"    },
  { Icon: Tag,         label: "Shot Notes",        color: "text-amber-500",   iconBg: "bg-amber-500/10 border-amber-500/20"  },
  { Icon: Captions,    label: "Metadata Overlays", color: "text-cyan-500",    iconBg: "bg-cyan-500/10 border-cyan-500/20"    },
  { Icon: ShieldCheck, label: "Stay Private",      color: "text-emerald-500", iconBg: "bg-emerald-500/10 border-emerald-500/20" },
  { Icon: MapPin,      label: "Search by Place",   color: "text-sky-500",     iconBg: "bg-sky-500/10 border-sky-500/20"      },
  { Icon: Columns2,    label: "Compare Progress",  color: "text-violet-500",  iconBg: "bg-violet-500/10 border-violet-500/20" },
  { Icon: Signature,   label: "Auto Watermark",    color: "text-rose-500",    iconBg: "bg-rose-500/10 border-rose-500/20"    },
  { Icon: Archive,     label: "Zip & Share",       color: "text-orange-500",  iconBg: "bg-orange-500/10 border-orange-500/20" },
];

// ─── Styles ────────────────────────────────────────────────────────────────
const STYLES = `
  /* Mandatory snap — each screen locks in. After the last snap point
     (Screen 3) the page scrolls freely into Features/Platforms/etc. */
  html { scroll-snap-type: y mandatory; }
  .mc-snap {
    scroll-snap-align: start;
    scroll-snap-stop: always;
  }
  @media (prefers-reduced-motion: reduce) {
    html { scroll-snap-type: none; }
  }

  /* Grain texture overlay */
  .mc-grain {
    position: absolute; inset: 0; pointer-events: none; z-index: 1;
    opacity: 0.04; mix-blend-mode: overlay;
    background: url('data:image/svg+xml;utf8,<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"><filter id="n"><feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" stitchTiles="stitch"/></filter><rect width="100%" height="100%" filter="url(%23n)"/></svg>');
  }

  /* Subtle grid */
  .mc-grid {
    position: absolute; inset: 0; pointer-events: none; z-index: 0;
    --line: hsl(var(--foreground) / 0.04);
    background-size: 64px 64px;
    background-image:
      linear-gradient(to right, var(--line) 1px, transparent 1px),
      linear-gradient(to bottom, var(--line) 1px, transparent 1px);
    -webkit-mask-image: radial-gradient(ellipse 85% 65% at center, black 0%, transparent 78%);
    mask-image: radial-gradient(ellipse 85% 65% at center, black 0%, transparent 78%);
  }

  /* Primary colour spotlight */
  .mc-spot {
    position: absolute; inset: 0; pointer-events: none; z-index: 0;
    background: radial-gradient(620px circle at 50% 38%, hsl(var(--primary) / 0.10), transparent 62%);
  }
  .mc-spot-l {
    position: absolute; inset: 0; pointer-events: none; z-index: 0;
    background: radial-gradient(520px circle at 25% 50%, hsl(var(--primary) / 0.08), transparent 65%);
  }

  /* Phone mockup surfaces */
  .mc-bezel {
    background-color: #0A0A0A;
    box-shadow:
      inset 0 0 0 2px #3F3F46,
      inset 0 0 0 7px #000,
      0 60px 100px -24px rgba(0,0,0,0.6),
      0 20px 40px -14px rgba(0,0,0,0.45);
  }
  .mc-hw {
    background: linear-gradient(90deg, #404040 0%, #171717 100%);
    box-shadow: -2px 0 5px rgba(0,0,0,0.6), inset -1px 0 1px rgba(255,255,255,0.12), inset 1px 0 2px rgba(0,0,0,0.8);
  }
  .mc-glare {
    background: linear-gradient(115deg, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0) 42%);
  }

  /* Phone glow ring */
  .mc-phone-glow {
    position: absolute;
    inset: -32px;
    border-radius: 4rem;
    background: radial-gradient(ellipse at center, hsl(var(--primary) / 0.18) 0%, transparent 68%);
    filter: blur(24px);
    pointer-events: none;
    z-index: 0;
  }

  /* Feature badge pill */
  .mc-pill {
    background: linear-gradient(145deg, hsl(var(--foreground) / 0.055) 0%, hsl(var(--foreground) / 0.015) 100%);
    box-shadow:
      0 0 0 1px hsl(var(--border) / 0.7),
      0 8px 20px -14px rgba(0,0,0,0.4),
      inset 0 1px 0 hsl(var(--foreground) / 0.08);
    backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px);
    transition: transform 0.45s cubic-bezier(0.16,1,0.3,1), box-shadow 0.45s cubic-bezier(0.16,1,0.3,1);
  }
  @media (hover: hover) {
    .mc-pill:hover { transform: translateY(-2px); box-shadow: 0 0 0 1px hsl(var(--border)), 0 16px 30px -14px rgba(0,0,0,0.35), inset 0 1px 0 hsl(var(--foreground) / 0.12); }
  }

  /* Primary CTA button */
  .mc-btn {
    background: linear-gradient(180deg, #FFFFFF 0%, #F1F5F9 100%); color: #0F172A;
    box-shadow:
      0 0 0 1px rgba(0,0,0,0.05),
      0 2px 4px rgba(0,0,0,0.08),
      0 16px 32px -10px rgba(0,0,0,0.30),
      inset 0 1px 1px #fff;
    transition: transform 0.4s cubic-bezier(0.16,1,0.3,1), box-shadow 0.4s cubic-bezier(0.16,1,0.3,1);
  }
  .mc-btn:hover { transform: translateY(-3px); box-shadow: 0 0 0 1px rgba(0,0,0,0.05), 0 4px 8px rgba(0,0,0,0.1), 0 24px 48px -14px rgba(0,0,0,0.38), inset 0 1px 1px #fff; }
  .mc-btn:active { transform: translateY(0); }

  /* Product label chip */
  .mc-label {
    display: inline-flex; align-items: center; gap: 0.4rem;
    padding: 0.3rem 0.85rem;
    border-radius: 999px;
    border: 1px solid hsl(var(--border));
    background: hsl(var(--foreground) / 0.04);
    font-size: 0.7rem; font-weight: 600; letter-spacing: 0.09em; text-transform: uppercase;
    color: hsl(var(--foreground) / 0.5);
    backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px);
  }
  .mc-label-dot {
    width: 5px; height: 5px; border-radius: 50%;
    background: hsl(var(--primary));
    box-shadow: 0 0 6px hsl(var(--primary) / 0.8);
  }

  /* Gradient headline */
  .mc-gradient-text {
    background: linear-gradient(160deg, hsl(var(--foreground)) 30%, hsl(var(--foreground) / 0.45) 100%);
    -webkit-background-clip: text; background-clip: text;
    -webkit-text-fill-color: transparent; color: transparent;
  }

  /* Scroll cue */
  @keyframes mc-cue { 0%,100% { transform: translateY(0); opacity: 0.35; } 50% { transform: translateY(7px); opacity: 0.85; } }
  .mc-cue { animation: mc-cue 1.8s ease-in-out infinite; }
  @media (prefers-reduced-motion: reduce) { .mc-cue { animation: none; } }

  /* Pagination dots */
  .mc-pag {
    position: fixed; right: 1.5rem; top: 50%; transform: translateY(-50%);
    z-index: 200; display: flex; flex-direction: column; align-items: center; gap: 8px;
    pointer-events: none;
  }
  @media (max-width: 767px) { .mc-pag { display: none; } }

  /* Thin decorative divider */
  .mc-rule {
    width: 40px; height: 1px;
    background: linear-gradient(90deg, transparent, hsl(var(--foreground) / 0.25), transparent);
  }
`;

// ─── Phone Mockup ──────────────────────────────────────────────────────────
function PhoneMockup({ appScreenSrc }) {
  return (
    <div className="relative flex items-center justify-center">
      <div className="mc-phone-glow" aria-hidden />
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="relative z-10"
      >
        <div className="origin-center scale-[0.72] md:scale-[0.85] lg:scale-100">
          <div className="relative flex h-[580px] w-[280px] flex-col rounded-[3rem] mc-bezel">
            <div className="mc-hw absolute -left-[3px] top-[120px] z-0 h-[25px] w-[3px] rounded-l-md" aria-hidden />
            <div className="mc-hw absolute -left-[3px] top-[160px] z-0 h-[45px] w-[3px] rounded-l-md" aria-hidden />
            <div className="mc-hw absolute -left-[3px] top-[220px] z-0 h-[45px] w-[3px] rounded-l-md" aria-hidden />
            <div className="mc-hw absolute -right-[3px] top-[170px] z-0 h-[70px] w-[3px] scale-x-[-1] rounded-r-md" aria-hidden />
            <div
              className="absolute inset-[7px] z-10 overflow-hidden rounded-[2.5rem] shadow-[inset_0_0_6px_rgba(0,0,0,0.5)]"
              style={{ backgroundColor: "hsl(218,12%,8%)" }}
            >
              <div className="mc-glare pointer-events-none absolute inset-0 z-40 opacity-30" aria-hidden />
              <div
                className="absolute left-1/2 top-[5px] z-50 h-[28px] w-[100px] -translate-x-1/2 rounded-full"
                style={{ background: "hsl(218,12%,8%)" }}
                aria-hidden
              >
                <div className="absolute right-3 top-1/2 h-1.5 w-1.5 -translate-y-1/2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.8)]" />
              </div>
              <img
                src={appScreenSrc}
                alt="Master Camera app interface"
                className="absolute inset-0 h-full w-full object-cover object-top"
                draggable={false}
              />
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

// ─── Screen 1 — The Statement ───────────────────────────────────────────────
function Screen1({ sectionRef, isActive, tagline1, tagline2 }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.15, margin: "0px 0px -10% 0px" });
  const show = isInView;

  return (
    <section
      id="mc-s1"
      ref={el => { sectionRef.current = el; ref.current = el; }}
      className="mc-snap relative z-[1] flex min-h-[100svh] flex-col items-center justify-center overflow-hidden bg-background px-6 pt-24 pb-16 text-center"
    >
      <div className="mc-grid" aria-hidden />
      <div className="mc-spot" aria-hidden />
      <div className="mc-grain" aria-hidden />

      {/* Content */}
      <motion.div
        className="relative z-10 flex flex-col items-center gap-7"
        variants={stagger(0.1, 0.05)}
        initial="hidden"
        animate={show ? "show" : "hidden"}
      >
        {/* Product label */}
        <motion.div variants={fadeIn(0.45)} className="mc-label">
          <div className="mc-label-dot" aria-hidden />
          Master Camera
        </motion.div>

        {/* Main headline */}
        <motion.div className="flex flex-col items-center gap-1" variants={stagger(0.12, 0)}>
          <motion.h1
            variants={slideUp(0.75)}
            className="mx-auto max-w-4xl text-[2.8rem] font-bold leading-[1.03] tracking-[-0.02em] sm:text-6xl lg:text-[5.25rem]"
          >
            {tagline1}
          </motion.h1>
          <motion.span
            variants={slideUp(0.75)}
            className="block text-[2.8rem] font-bold leading-[1.03] tracking-[-0.02em] sm:text-6xl lg:text-[5.25rem]"
          >
            {tagline2}
          </motion.span>
        </motion.div>

        {/* Divider */}
        <motion.div variants={fadeIn(0.5, 0.1)} className="mc-rule" aria-hidden />

        {/* Sub-tagline */}
        <motion.p
          variants={slideUpSm(0.55)}
          className="max-w-sm text-sm font-medium tracking-wide text-foreground/40 sm:text-base"
        >
          Professional tools. Zero complexity.
        </motion.p>
      </motion.div>

      {/* Scroll cue */}
      <motion.div
        className="absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: show ? 1 : 0 }}
        transition={{ duration: 0.6, delay: 0.9 }}
        aria-hidden
      >
        <span className="text-[10px] font-semibold uppercase tracking-widest text-foreground/25">Scroll</span>
        <ChevronDown className="mc-cue h-5 w-5 text-foreground/30" strokeWidth={2} />
      </motion.div>
    </section>
  );
}

// ─── Screen 2 — The Product ─────────────────────────────────────────────────
function Screen2({ sectionRef, cardTagline, cardDescription, cardAudience, appScreenSrc }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.15, margin: "0px 0px -10% 0px" });
  const show = isInView;

  return (
    <section
      id="mc-s2"
      ref={el => { sectionRef.current = el; ref.current = el; }}
      className="mc-snap relative z-[2] flex min-h-[100svh] flex-col items-center justify-center overflow-hidden bg-card px-6 py-16 md:py-20"
    >
      <div className="mc-grid" aria-hidden />
      <div className="mc-grain" aria-hidden />

      <div className="relative z-10 mx-auto grid w-full max-w-6xl items-center gap-10 md:grid-cols-2 md:gap-16">
        {/* Phone — desktop left, mobile hidden */}
        <motion.div
          className="hidden md:flex md:justify-center"
          variants={scaleIn}
          initial="hidden"
          animate={show ? "show" : "hidden"}
        >
          <PhoneMockup appScreenSrc={appScreenSrc} />
        </motion.div>

        {/* Text content */}
        <motion.div
          className="flex flex-col items-center gap-8 text-center md:items-start md:text-left"
          variants={stagger(0.09, 0.08)}
          initial="hidden"
          animate={show ? "show" : "hidden"}
        >
          {/* Headline */}
          <div className="flex flex-col gap-4">
            <motion.h2
              variants={slideUp(0.72)}
              className="text-[2.15rem] font-bold leading-[1.07] tracking-[-0.02em] sm:text-5xl lg:text-[3.5rem]"
            >
              {cardTagline}
            </motion.h2>
            <motion.div variants={fadeIn(0.4)} className="mc-rule hidden md:block" aria-hidden />
            <motion.p
              variants={slideUpSm(0.6)}
              className="max-w-lg text-[0.93rem] leading-relaxed text-foreground/65 sm:text-base"
            >
              {cardDescription}
            </motion.p>
            <motion.p
              variants={slideUpSm(0.55)}
              className="max-w-md text-xs leading-relaxed text-foreground/35 sm:text-sm"
            >
              {cardAudience}
            </motion.p>
          </div>

          {/* Feature badge grid */}
          <motion.div
            className="grid w-full grid-cols-2 gap-2 sm:gap-2.5"
            variants={stagger(0.055, 0)}
          >
            {BADGES.map(({ Icon, label, color, iconBg }) => (
              <motion.div
                key={label}
                variants={slideUpSm(0.5)}
                className="mc-pill flex items-center gap-2.5 rounded-2xl px-3 py-2.5"
              >
                <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border ${iconBg}`}>
                  <Icon className={`h-4 w-4 ${color}`} strokeWidth={1.75} />
                </div>
                <span className="text-[0.8rem] font-semibold leading-tight tracking-tight text-foreground/85">
                  {label}
                </span>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

// ─── Screen 3 — The Invitation ──────────────────────────────────────────────
function Screen3({ sectionRef, ctaHeading, ctaDescription, onJoinWaitlist }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.15, margin: "0px 0px -10% 0px" });
  const show = isInView;

  return (
    <section
      id="mc-s3"
      ref={el => { sectionRef.current = el; ref.current = el; }}
      className="mc-snap relative z-[3] flex min-h-[100svh] flex-col items-center justify-center overflow-hidden bg-background px-6 py-20 text-center"
    >
      <div className="mc-grid" aria-hidden />
      <div className="mc-spot" aria-hidden />
      <div className="mc-grain" aria-hidden />

      <motion.div
        className="relative z-10 flex flex-col items-center gap-7"
        variants={stagger(0.11, 0.05)}
        initial="hidden"
        animate={show ? "show" : "hidden"}
      >
        {/* Label */}
        <motion.div variants={fadeIn(0.4)} className="mc-label">
          <div className="mc-label-dot" aria-hidden />
          Coming to iOS
        </motion.div>

        {/* Headline */}
        <motion.h2
          variants={slideUp(0.75)}
          className="mc-gradient-text text-[3rem] font-bold tracking-[-0.025em] sm:text-6xl lg:text-7xl"
        >
          {ctaHeading}
        </motion.h2>

        {/* Divider */}
        <motion.div variants={fadeIn(0.5)} className="mc-rule" aria-hidden />

        {/* Description */}
        <motion.p
          variants={slideUpSm(0.6)}
          className="max-w-sm text-base font-light leading-relaxed text-foreground/50 sm:text-lg"
        >
          {ctaDescription}
        </motion.p>

        {/* CTA buttons */}
        <motion.div
          variants={slideUpSm(0.6)}
          className="mt-1 flex w-full max-w-[280px] flex-col gap-3"
        >
          <button
            onClick={onJoinWaitlist}
            className="mc-btn group flex items-center justify-center gap-3 rounded-[1.25rem] px-8 py-4 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2"
            aria-label="Join the waitlist"
          >
            <svg className="h-7 w-7 shrink-0 transition-transform group-hover:scale-105" fill="none" viewBox="0 0 28 28" aria-hidden>
              <rect width="28" height="28" rx="6" fill="#0F172A" />
              <rect x="4" y="4" width="9" height="9" rx="2" fill="#F97316" />
              <rect x="15" y="4" width="9" height="9" rx="2" fill="#FB923C" opacity="0.7" />
              <rect x="4" y="15" width="9" height="9" rx="2" fill="#FB923C" opacity="0.7" />
              <rect x="15" y="15" width="9" height="9" rx="2" fill="#F97316" opacity="0.4" />
            </svg>
            <div className="text-left">
              <div className="mb-[-2px] text-[10px] font-bold uppercase tracking-wider text-neutral-500">Be the first</div>
              <div className="text-xl font-bold leading-none tracking-tight">Join Waitlist</div>
            </div>
          </button>

          <a
            href="#features"
            className="flex items-center justify-center gap-2.5 rounded-[1.25rem] border border-border bg-foreground/[0.04] px-8 py-4 text-foreground/80 transition-all duration-300 hover:bg-foreground/[0.08] focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <span className="text-[1.05rem] font-semibold tracking-tight">How It Works</span>
          </a>
        </motion.div>
      </motion.div>
    </section>
  );
}

// ─── Pagination dots ────────────────────────────────────────────────────────
function PaginationDots({ active }) {
  return (
    <div className="mc-pag" aria-hidden>
      {[0, 1, 2].map(i => (
        <motion.div
          key={i}
          className="w-[5px] rounded-full"
          animate={{
            height: active === i ? 22 : 5,
            backgroundColor:
              active === i
                ? "hsl(var(--primary))"
                : "hsl(var(--foreground) / 0.18)",
          }}
          transition={{ duration: 0.4, ease: EASE }}
        />
      ))}
    </div>
  );
}

// ─── Root export ───────────────────────────────────────────────────────────
export function CinematicHero({
  tagline1 = "Capture, organize, edit.",
  tagline2 = "No chaos. All offline.",
  cardTagline = <>The simplicity you want.<br />The features your work demands.</>,
  cardDescription = "Open it and shoot — no setup, no distractions. When your work needs more, it's all right there: categorization, metadata overlays, shot notes, markups, watermarks. Private. Offline. Yours.",
  cardAudience = "Engineered for DIY enthusiasts, scientists, and field professionals.",
  ctaHeading = "Start capturing.",
  ctaDescription = "Master Camera is coming to iOS. Join the waitlist and be the first to know when it launches.",
  appScreenSrc = "/app_screen.png",
  onJoinWaitlist,
}) {
  const [active, setActive] = useState(0);
  const refs = [useRef(null), useRef(null), useRef(null)];

  useEffect(() => {
    const targets = refs.map(r => r.current).filter(Boolean);
    const obs = new IntersectionObserver(
      entries => {
        entries.forEach(e => {
          if (e.isIntersecting) {
            const idx = targets.indexOf(e.target);
            if (idx !== -1) setActive(idx);
          }
        });
      },
      { threshold: 0.5 }
    );
    targets.forEach(t => obs.observe(t));
    return () => obs.disconnect();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="relative w-full font-sans text-foreground antialiased">
      <style dangerouslySetInnerHTML={{ __html: STYLES }} />

      <PaginationDots active={active} />

      <Screen1
        sectionRef={refs[0]}
        isActive={active === 0}
        tagline1={tagline1}
        tagline2={tagline2}
      />
      <Screen2
        sectionRef={refs[1]}
        isActive={active === 1}
        cardTagline={cardTagline}
        cardDescription={cardDescription}
        cardAudience={cardAudience}
        appScreenSrc={appScreenSrc}
      />
      <Screen3
        sectionRef={refs[2]}
        isActive={active === 2}
        ctaHeading={ctaHeading}
        ctaDescription={ctaDescription}
        onJoinWaitlist={onJoinWaitlist}
      />
    </div>
  );
}
