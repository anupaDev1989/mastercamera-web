// src/components/ui/cinematic-hero.jsx
//
// Apple-style "stacked cards" hero. Three full-screen cards are sticky-pinned in
// a tall track; as you scroll, each next card slides up and covers the previous
// one, settling from rounded + slightly scaled-down into a full-bleed panel.
// This reads as genuine card-by-card scrolling (not a continuous text flow),
// stays buttery on iOS Safari (transform/opacity only, 100svh units, sticky —
// all rock-solid there), and never traps scroll the way mandatory snap does.
import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { cn } from "@/lib/utils";
import Reveal from "@/components/Reveal";
import {
  Layers, ShieldCheck, Signature, Tag, MapPin, Columns2, Archive, Captions, ChevronDown,
} from "lucide-react";

const STYLES = `
  .mc-grain {
    position: absolute; inset: 0; pointer-events: none; z-index: 1;
    opacity: 0.035; mix-blend-mode: overlay;
    background: url('data:image/svg+xml;utf8,<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"><filter id="n"><feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" stitchTiles="stitch"/></filter><rect width="100%" height="100%" filter="url(%23n)"/></svg>');
  }
  .mc-grid {
    position: absolute; inset: 0; pointer-events: none; z-index: 0;
    --line: hsl(var(--foreground) / 0.045);
    background-size: 64px 64px;
    background-image:
      linear-gradient(to right, var(--line) 1px, transparent 1px),
      linear-gradient(to bottom, var(--line) 1px, transparent 1px);
    -webkit-mask-image: radial-gradient(ellipse 85% 65% at center, black 0%, transparent 78%);
    mask-image: radial-gradient(ellipse 85% 65% at center, black 0%, transparent 78%);
  }
  /* coloured spotlight glow behind a headline — adds life without heaviness */
  .mc-spot {
    position: absolute; inset: 0; pointer-events: none; z-index: 0;
    background: radial-gradient(560px circle at 50% 36%, hsl(var(--primary) / 0.12), transparent 62%);
  }
  /* Solid opaque base FIRST (guarantees cards fully occlude the ones beneath —
     a gradient alone rendered translucent on iOS Safari), with a soft tint on top. */
  .mc-card {
    background-color: hsl(var(--background));
    background-image: radial-gradient(120% 80% at 50% 0%, hsl(var(--card)) 0%, transparent 62%);
  }
  .mc-card-shadow { box-shadow: 0 -24px 60px -28px rgba(0,0,0,0.45), 0 -1px 0 hsl(var(--border)); }

  .mc-gradient-text {
    background: linear-gradient(180deg, hsl(var(--foreground)) 0%, hsl(var(--foreground) / 0.55) 100%);
    -webkit-background-clip: text; background-clip: text;
    -webkit-text-fill-color: transparent; color: transparent;
  }

  .mc-bezel {
    background-color: #0A0A0A;
    box-shadow: inset 0 0 0 2px #3F3F46, inset 0 0 0 7px #000,
      0 50px 90px -20px rgba(0,0,0,0.55), 0 18px 30px -12px rgba(0,0,0,0.4);
  }
  .mc-hw { background: linear-gradient(90deg, #404040 0%, #171717 100%);
    box-shadow: -2px 0 5px rgba(0,0,0,0.6), inset -1px 0 1px rgba(255,255,255,0.12), inset 1px 0 2px rgba(0,0,0,0.8); }
  .mc-glare { background: linear-gradient(115deg, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0) 42%); }

  .mc-pill {
    background: linear-gradient(145deg, hsl(var(--foreground) / 0.07) 0%, hsl(var(--foreground) / 0.02) 100%);
    box-shadow: 0 0 0 1px hsl(var(--border)), 0 10px 24px -16px rgba(0,0,0,0.45), inset 0 1px 0 hsl(var(--foreground) / 0.12);
    backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px);
    transition: transform 0.45s cubic-bezier(0.16,1,0.3,1), box-shadow 0.45s cubic-bezier(0.16,1,0.3,1);
  }
  @media (hover: hover) { .mc-pill:hover { transform: translateY(-2px); } }

  .mc-btn {
    background: linear-gradient(180deg, #FFFFFF 0%, #F1F5F9 100%); color: #0F172A;
    box-shadow: 0 0 0 1px rgba(0,0,0,0.05), 0 2px 4px rgba(0,0,0,0.08), 0 14px 28px -8px rgba(0,0,0,0.28), inset 0 1px 1px #fff;
    transition: transform 0.4s cubic-bezier(0.16,1,0.3,1), box-shadow 0.4s cubic-bezier(0.16,1,0.3,1);
  }
  .mc-btn:hover { transform: translateY(-3px); }
  .mc-btn:active { transform: translateY(0); }

  @keyframes mc-cue { 0%,100% { transform: translateY(0); opacity: 0.5; } 50% { transform: translateY(6px); opacity: 1; } }
  .mc-cue { animation: mc-cue 1.8s ease-in-out infinite; }
  @media (prefers-reduced-motion: reduce) { .mc-cue { animation: none; } }
`;

const BADGES = [
  { Icon: Layers,      label: "Job Stacks",        color: "text-blue-600",    iconBg: "bg-blue-500/15    border-blue-500/30"    },
  { Icon: Tag,         label: "Shot Notes",        color: "text-amber-600",   iconBg: "bg-amber-500/15   border-amber-500/30"   },
  { Icon: Captions,    label: "Metadata Overlays", color: "text-cyan-600",    iconBg: "bg-cyan-500/15    border-cyan-500/30"    },
  { Icon: ShieldCheck, label: "Stay Private",      color: "text-emerald-600", iconBg: "bg-emerald-500/15 border-emerald-500/30" },
  { Icon: MapPin,      label: "Search by Place",   color: "text-sky-600",     iconBg: "bg-sky-500/15     border-sky-500/30"     },
  { Icon: Columns2,    label: "Compare Progress",  color: "text-violet-600",  iconBg: "bg-violet-500/15  border-violet-500/30"  },
  { Icon: Signature,   label: "Auto Watermark",    color: "text-rose-600",    iconBg: "bg-rose-500/15    border-rose-500/30"    },
  { Icon: Archive,     label: "Zip & Share",       color: "text-orange-600",  iconBg: "bg-orange-500/15  border-orange-500/30"  },
];

function PhoneMockup({ appScreenSrc }) {
  return (
    <motion.div
      animate={{ y: [0, -10, 0] }}
      transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      className="flex items-center justify-center"
    >
      <div className="origin-center scale-[0.58] sm:scale-[0.72] md:scale-90 lg:scale-100">
        <div className="relative flex h-[580px] w-[280px] flex-col rounded-[3rem] mc-bezel">
          <div className="mc-hw absolute -left-[3px] top-[120px] z-0 h-[25px] w-[3px] rounded-l-md" aria-hidden="true" />
          <div className="mc-hw absolute -left-[3px] top-[160px] z-0 h-[45px] w-[3px] rounded-l-md" aria-hidden="true" />
          <div className="mc-hw absolute -left-[3px] top-[220px] z-0 h-[45px] w-[3px] rounded-l-md" aria-hidden="true" />
          <div className="mc-hw absolute -right-[3px] top-[170px] z-0 h-[70px] w-[3px] scale-x-[-1] rounded-r-md" aria-hidden="true" />
          <div className="absolute inset-[7px] z-10 overflow-hidden rounded-[2.5rem] shadow-[inset_0_0_6px_rgba(0,0,0,0.5)]" style={{ backgroundColor: "hsl(218, 12%, 8%)" }}>
            <div className="mc-glare pointer-events-none absolute inset-0 z-40 opacity-30" aria-hidden="true" />
            <div className="absolute left-1/2 top-[5px] z-50 h-[28px] w-[100px] -translate-x-1/2 rounded-full" style={{ background: "hsl(218, 12%, 8%)" }} aria-hidden="true">
              <div className="absolute right-3 top-1/2 h-1.5 w-1.5 -translate-y-1/2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.8)]" />
            </div>
            <img src={appScreenSrc} alt="Master Camera app interface" className="absolute inset-0 h-full w-full object-cover object-top" draggable={false} />
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// One card in the stack.
//   • The OUTER <section> is the only sticky element and carries NO transform —
//     on iOS Safari a transform (or will-change) on a sticky node breaks its
//     opaque compositing, which made the stacked cards look translucent/messy.
//   • The INNER motion.div carries the scale/round animation and a solid,
//     opaque background, so each card cleanly occludes the ones beneath it.
// 100lvh keeps every card covering the screen on iOS without reflowing as the
// address bar shows/hides.
function StackCard({ children, scale, radius, dim, className, z }) {
  return (
    <section style={{ zIndex: z }} className="sticky top-0 h-[100lvh] w-full">
      <motion.div
        style={{ scale, borderRadius: radius }}
        className={cn(
          "mc-card relative flex h-full w-full flex-col items-center justify-center overflow-hidden px-6",
          className
        )}
      >
        {children}
        {dim && (
          <motion.div
            style={{ opacity: dim }}
            className="pointer-events-none absolute inset-0 z-[60] bg-black"
            aria-hidden="true"
          />
        )}
      </motion.div>
    </section>
  );
}

export function CinematicHero({
  tagline1 = "Capture, organize, edit.",
  tagline2 = "No chaos. All offline.",
  cardTagline = <>The simplicity you want.<br />The features your work demands.</>,
  cardDescription = "Master Camera pairs the effortless feel of the native Camera app with powerful metadata workflows and total offline privacy.",
  cardAudience = "Engineered for DIY enthusiasts, scientists, and field professionals.",
  ctaHeading = "Start capturing.",
  ctaDescription = "Master Camera is coming to iOS. Join the waitlist and be the first to know when it launches.",
  appScreenSrc = "/app_screen.png",
  onJoinWaitlist,
}) {
  const stackRef = useRef(null);
  // Progress 0 → 1 across the whole 3-card stack. 0 = card 1 full, 0.5 = card 2
  // fully covering, 1 = card 3 fully covering.
  const { scrollYProgress } = useScroll({ target: stackRef, offset: ["start start", "end end"] });

  // Card 2 enters over 0 → 0.5; card 3 enters over 0.5 → 1.
  const c2scale = useTransform(scrollYProgress, [0, 0.5], [0.93, 1]);
  const c2radius = useTransform(scrollYProgress, [0, 0.5], [44, 0]);
  const c3scale = useTransform(scrollYProgress, [0.5, 1], [0.93, 1]);
  const c3radius = useTransform(scrollYProgress, [0.5, 1], [44, 0]);
  // Cards dim slightly as the next one rises (visible through the rounded corners).
  const c1dim = useTransform(scrollYProgress, [0, 0.5], [0, 0.45]);
  const c2dim = useTransform(scrollYProgress, [0.5, 1], [0, 0.45]);

  return (
    <div className="relative w-full font-sans text-foreground antialiased">
      <style dangerouslySetInnerHTML={{ __html: STYLES }} />

      <div ref={stackRef} className="relative w-full">
        {/* ===== CARD 1 — Headline ===== */}
        <StackCard z={10} dim={c1dim} className="pt-24 pb-20 text-center">
          <div className="mc-grid" aria-hidden="true" />
          <div className="mc-spot" aria-hidden="true" />
          <div className="mc-grain" aria-hidden="true" />
          <Reveal y={26} className="relative z-10">
            <h1 className="mx-auto max-w-4xl text-[2.6rem] font-bold leading-[1.04] tracking-tight sm:text-6xl lg:text-7xl">
              {tagline1}
              <span className="mt-1 block">{tagline2}</span>
            </h1>
          </Reveal>
          <div className="absolute bottom-7 left-1/2 z-10 -translate-x-1/2 text-muted-foreground">
            <ChevronDown className="mc-cue h-6 w-6" strokeWidth={2} aria-hidden="true" />
          </div>
        </StackCard>

        {/* ===== CARD 2 — Value proposition + product + feature grid =====
            Phone mockup lives here now, and only on desktop (hidden on mobile). */}
        <StackCard z={20} scale={c2scale} radius={c2radius} dim={c2dim} className="mc-card-shadow py-16 md:py-20">
          <div className="mc-grid" aria-hidden="true" />
          <div className="relative z-10 mx-auto grid w-full max-w-6xl items-center gap-8 md:grid-cols-2 md:gap-14">
            {/* product shot — desktop only */}
            <div className="hidden md:flex md:justify-center">
              <PhoneMockup appScreenSrc={appScreenSrc} />
            </div>

            {/* copy + features */}
            <div className="flex flex-col items-center gap-8 text-center md:items-start md:text-left">
              <div className="flex flex-col items-center gap-5 md:items-start">
                <Reveal y={24}>
                  <h2 className="text-[2.1rem] font-bold leading-[1.1] tracking-tight sm:text-5xl lg:text-[3.4rem]">
                    {cardTagline}
                  </h2>
                </Reveal>
                <Reveal y={18} delay={0.08}><div className="h-px w-12 bg-foreground/20" /></Reveal>
                <Reveal y={18} delay={0.12}>
                  <p className="max-w-xl text-[0.95rem] leading-relaxed text-foreground/70 sm:text-base">{cardDescription}</p>
                </Reveal>
                <Reveal y={18} delay={0.16}>
                  <p className="max-w-lg text-xs leading-relaxed text-foreground/40 sm:text-sm">{cardAudience}</p>
                </Reveal>
              </div>
              <div className="grid w-full grid-cols-2 gap-2.5 sm:gap-3">
                {BADGES.map(({ Icon, label, color, iconBg }, i) => (
                  <Reveal key={label} y={18} delay={0.05 * i} amount={0.1}>
                    <div className="mc-pill flex h-full items-center gap-2.5 rounded-2xl px-3.5 py-3 text-left">
                      <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border ${iconBg}`}>
                        <Icon className={`h-[18px] w-[18px] ${color}`} strokeWidth={1.75} />
                      </div>
                      <span className="text-sm font-semibold leading-tight tracking-tight text-foreground/90">{label}</span>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          </div>
        </StackCard>

        {/* ===== CARD 3 — CTA ===== */}
        <StackCard z={30} scale={c3scale} radius={c3radius} className="mc-card-shadow py-20 text-center">
          <div className="mc-grid" aria-hidden="true" />
          <div className="mc-spot" aria-hidden="true" />
          <div className="relative z-10 flex flex-col items-center gap-6">
            <Reveal y={24}>
              <h2 className="mc-gradient-text text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">{ctaHeading}</h2>
            </Reveal>
            <Reveal y={18} delay={0.1}>
              <p className="max-w-md text-base font-light leading-relaxed text-muted-foreground sm:text-lg">{ctaDescription}</p>
            </Reveal>
            <Reveal y={22} delay={0.18}>
              <div className="mt-2 flex w-full max-w-xs flex-col gap-4">
                <button
                  onClick={onJoinWaitlist}
                  className="mc-btn group flex items-center justify-center gap-3 rounded-[1.25rem] px-8 py-4 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2"
                  aria-label="Join the waitlist"
                >
                  <svg className="h-7 w-7 transition-transform group-hover:scale-105" fill="none" viewBox="0 0 28 28" aria-hidden="true">
                    <rect width="28" height="28" rx="6" fill="#0F172A" />
                    <rect x="4" y="4" width="9" height="9" rx="2" fill="#F97316" />
                    <rect x="15" y="4" width="9" height="9" rx="2" fill="#FB923C" opacity="0.7" />
                    <rect x="4" y="15" width="9" height="9" rx="2" fill="#FB923C" opacity="0.7" />
                    <rect x="15" y="15" width="9" height="9" rx="2" fill="#F97316" opacity="0.4" />
                  </svg>
                  <div className="text-left">
                    <div className="mb-[-2px] text-[10px] font-bold uppercase tracking-wider text-neutral-500">Be the first with</div>
                    <div className="text-xl font-bold leading-none tracking-tight">Join Waitlist</div>
                  </div>
                </button>
                <a href="#features" className="flex items-center justify-center gap-3 rounded-[1.25rem] border border-border bg-foreground/5 px-8 py-4 text-foreground transition-all duration-300 hover:bg-foreground/10 focus:outline-none focus:ring-2 focus:ring-primary">
                  <span className="text-xl font-semibold tracking-tight">How It Works</span>
                </a>
              </div>
            </Reveal>
          </div>
        </StackCard>
      </div>
    </div>
  );
}
