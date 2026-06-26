// src/components/ui/cinematic-hero.jsx
import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { cn } from "@/lib/utils";
import { Layers, ShieldCheck, Signature, Tag, MapPin, Columns2, Archive, Captions } from "lucide-react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const INJECTED_STYLES = `
  .gsap-reveal { visibility: hidden; }

  .film-grain {
      position: absolute; inset: 0; width: 100%; height: 100%;
      pointer-events: none; z-index: 50; opacity: 0.04; mix-blend-mode: overlay;
      background: url('data:image/svg+xml;utf8,<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"><filter id="noiseFilter"><feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" stitchTiles="stitch"/></filter><rect width="100%" height="100%" filter="url(%23noiseFilter)"/></svg>');
  }

  .bg-grid-cinematic {
      --grid-line: hsl(var(--foreground) / 0.04);
      background-size: 60px 60px;
      background-image:
          linear-gradient(to right, var(--grid-line) 1px, transparent 1px),
          linear-gradient(to bottom, var(--grid-line) 1px, transparent 1px);
      mask-image: radial-gradient(ellipse at center, black 0%, transparent 70%);
      -webkit-mask-image: radial-gradient(ellipse at center, black 0%, transparent 70%);
  }

  .text-3d-matte-cin {
      color: hsl(var(--foreground));
      text-shadow: 0 10px 30px rgba(0,0,0,0.5), 0 2px 4px rgba(0,0,0,0.3);
  }

  .text-silver-matte-cin {
      background: linear-gradient(180deg, hsl(var(--foreground)) 0%, hsl(var(--foreground) / 0.45) 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      transform: translateZ(0);
      filter: drop-shadow(0px 10px 20px rgba(0,0,0,0.4)) drop-shadow(0px 2px 4px rgba(0,0,0,0.3));
  }

  .premium-depth-card-cin {
      background: hsl(var(--card));
      box-shadow:
          0 40px 100px -20px rgba(0,0,0,0.95),
          0 20px 40px -20px rgba(0,0,0,0.8),
          inset 0 1px 2px hsl(var(--foreground) / 0.12),
          inset 0 -2px 4px rgba(0,0,0,0.8);
      border: 1px solid hsl(var(--border));
      position: relative;
  }

  .card-sheen-cin {
      position: absolute; inset: 0; border-radius: inherit; pointer-events: none; z-index: 1;
      background: radial-gradient(800px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), hsl(var(--foreground) / 0.04) 0%, transparent 40%);
      mix-blend-mode: screen; transition: opacity 0.3s ease;
  }

  .iphone-bezel-cin {
      background-color: #0A0A0A;
      box-shadow:
          inset 0 0 0 2px #3F3F46,
          inset 0 0 0 7px #000,
          0 40px 80px -15px rgba(0,0,0,0.95),
          0 15px 25px -5px rgba(0,0,0,0.7);
      transform-style: preserve-3d;
  }

  .hardware-btn-cin {
      background: linear-gradient(90deg, #404040 0%, #171717 100%);
      box-shadow: -2px 0 5px rgba(0,0,0,0.8), inset -1px 0 1px rgba(255,255,255,0.12), inset 1px 0 2px rgba(0,0,0,0.8);
      border-left: 1px solid rgba(255,255,255,0.04);
  }

  .screen-glare-cin {
      background: linear-gradient(110deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0) 45%);
  }

  /* Refined glass badge — unified, Apple-style */
  .feature-badge-cin {
      background: linear-gradient(145deg, hsl(var(--foreground) / 0.09) 0%, hsl(var(--foreground) / 0.03) 100%);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      box-shadow:
          0 0 0 1px hsl(var(--border)),
          0 16px 32px -8px rgba(0,0,0,0.7),
          inset 0 1px 0 hsl(var(--foreground) / 0.18),
          inset 0 -1px 0 rgba(0,0,0,0.3);
      /* Only animate non-transform props — GSAP owns transform/opacity on these nodes */
      transition: background 0.4s cubic-bezier(0.25,1,0.5,1), box-shadow 0.4s cubic-bezier(0.25,1,0.5,1);
  }
  @media (hover: hover) {
      .feature-badge-cin:hover {
          background: linear-gradient(145deg, hsl(var(--foreground) / 0.14) 0%, hsl(var(--foreground) / 0.05) 100%);
          box-shadow:
              0 0 0 1px hsl(var(--border)),
              0 24px 44px -10px rgba(0,0,0,0.8),
              inset 0 1px 0 hsl(var(--foreground) / 0.28),
              inset 0 -1px 0 rgba(0,0,0,0.3);
      }
  }

  /* Horizontal chip rail for mobile — clean, no scrollbar, soft edge fade */
  .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
  .no-scrollbar::-webkit-scrollbar { display: none; }
  .edge-fade-x {
      -webkit-mask-image: linear-gradient(to right, transparent 0, black 18px, black calc(100% - 18px), transparent 100%);
      mask-image: linear-gradient(to right, transparent 0, black 18px, black calc(100% - 18px), transparent 100%);
  }

  .btn-app-store-cin {
      background: linear-gradient(180deg, #FFFFFF 0%, #F1F5F9 100%);
      color: #0F172A;
      box-shadow: 0 0 0 1px rgba(0,0,0,0.05), 0 2px 4px rgba(0,0,0,0.1), 0 12px 24px -4px rgba(0,0,0,0.3), inset 0 1px 1px rgba(255,255,255,1), inset 0 -3px 6px rgba(0,0,0,0.06);
      transition: all 0.4s cubic-bezier(0.25, 1, 0.5, 1);
  }
  .btn-app-store-cin:hover {
      transform: translateY(-3px);
      box-shadow: 0 0 0 1px rgba(0,0,0,0.05), 0 6px 12px -2px rgba(0,0,0,0.15), 0 20px 32px -6px rgba(0,0,0,0.4), inset 0 1px 1px rgba(255,255,255,1), inset 0 -3px 6px rgba(0,0,0,0.06);
  }
  .btn-app-store-cin:active {
      transform: translateY(1px);
      background: linear-gradient(180deg, #F1F5F9 0%, #E2E8F0 100%);
      box-shadow: 0 0 0 1px rgba(0,0,0,0.1), 0 1px 2px rgba(0,0,0,0.1), inset 0 3px 6px rgba(0,0,0,0.1);
  }
`;

// Badge definitions — clean, aligned column; precise over jittery (Apple-style)
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

// Mobile-only styles: an auto-cycling, seamless feature marquee + a lighter
// hero card shadow that reads well on the light page background.
const MOBILE_STYLES = `
  @keyframes mc-badge-marquee {
    from { transform: translateX(0); }
    to   { transform: translateX(-50%); }
  }
  .mc-marquee-mask {
    overflow: hidden;
    -webkit-mask-image: linear-gradient(to right, transparent 0, black 24px, black calc(100% - 24px), transparent 100%);
    mask-image: linear-gradient(to right, transparent 0, black 24px, black calc(100% - 24px), transparent 100%);
  }
  @keyframes mc-badge-marquee-reverse {
    from { transform: translateX(-50%); }
    to   { transform: translateX(0); }
  }
  .mc-marquee-track {
    display: flex;
    flex-flow: row nowrap;
    width: max-content;
    animation: mc-badge-marquee 30s linear infinite;
    will-change: transform;
  }
  .mc-marquee-track--reverse {
    animation: mc-badge-marquee-reverse 34s linear infinite;
  }
  .mc-marquee-track:active { animation-play-state: paused; }
  .mc-marquee-item { margin-right: 10px; }
  .mc-hero-card {
    background: hsl(var(--card));
    border: 1px solid hsl(var(--border));
    box-shadow:
        0 24px 60px -20px rgba(0,0,0,0.35),
        0 8px 20px -12px rgba(0,0,0,0.25),
        inset 0 1px 2px hsl(var(--foreground) / 0.08);
  }
  @media (prefers-reduced-motion: reduce) {
    .mc-marquee-track { animation: none; }
  }
`;

// Phones can't run the pinned cinematic scroll timeline (it never engages, so the
// card screen vanished entirely). Render a dedicated static mobile hero instead:
// same copy, the app mockup, and an auto-cycling feature carousel.
function MobileHero({
  tagline1,
  tagline2,
  cardTagline,
  cardDescription,
  cardAudience,
  ctaHeading,
  ctaDescription,
  appScreenSrc,
  onJoinWaitlist,
}) {
  const loop = [...BADGES, ...BADGES];

  return (
    <div className="relative w-full overflow-hidden font-sans text-foreground antialiased">
      <style dangerouslySetInnerHTML={{ __html: INJECTED_STYLES + MOBILE_STYLES }} />
      <div className="film-grain" aria-hidden="true" />
      <div className="bg-grid-cinematic pointer-events-none absolute inset-0 z-0 opacity-40" aria-hidden="true" />

      {/* PAGE 1 — Intro headline (mirrors the desktop first screen) */}
      <section className="relative z-10 flex min-h-[100svh] flex-col items-center justify-center px-5 text-center">
        <h1 className="text-3d-matte-cin mb-1 text-4xl font-bold tracking-tight sm:text-5xl">
          {tagline1}
        </h1>
        <h1 className="text-silver-matte-cin text-4xl font-extrabold tracking-tighter sm:text-5xl">
          {tagline2}
        </h1>
      </section>

      {/* PAGE 2 — "Feels familiar…" text + auto-cycling feature carousel */}
      <section className="relative z-10 flex min-h-[100svh] flex-col justify-center px-4 py-10">
        <div className="mc-hero-card relative flex flex-col items-center gap-8 overflow-hidden rounded-[28px] px-5 py-10">
          {/* Text */}
          <div className="relative z-10 flex flex-col items-center gap-4 text-center">
            <h2 className="text-3xl font-bold leading-[1.15] tracking-tight text-foreground">
              {cardTagline}
            </h2>
            <div className="h-px w-10 bg-foreground/20" />
            <p className="text-sm leading-relaxed text-foreground/70">
              {cardDescription}
            </p>
            <p className="text-xs leading-relaxed text-foreground/40">
              {cardAudience}
            </p>
          </div>

          {/* Auto-cycling feature carousel — two rows drifting in opposite
              directions so the tags are always visibly in motion. Inline flex
              styles guarantee a horizontal track regardless of the cascade. */}
          <div className="relative z-10 -mx-5 flex w-[calc(100%+2.5rem)] flex-col gap-3">
            {[0, 1].map((row) => (
              <div key={row} className="mc-marquee-mask">
                <div
                  className={cn("mc-marquee-track", row === 1 && "mc-marquee-track--reverse")}
                  style={{ display: "flex", flexFlow: "row nowrap", width: "max-content" }}
                >
                  {loop.map(({ Icon, label, color, iconBg }, i) => (
                    <div
                      key={`${row}-${label}-${i}`}
                      className="feature-badge-cin mc-marquee-item flex shrink-0 items-center gap-2 rounded-xl px-3 py-2"
                    >
                      <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border ${iconBg}`}>
                        <Icon className={`h-[15px] w-[15px] ${color}`} strokeWidth={1.75} />
                      </div>
                      <span className="whitespace-nowrap text-xs font-semibold tracking-tight text-foreground/90">
                        {label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PAGE 3 — CTA ("Start capturing.") */}
      <section className="relative z-10 flex min-h-[100svh] flex-col items-center justify-center px-5 py-16 text-center">
        <h2 className="text-silver-matte-cin mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
          {ctaHeading}
        </h2>
        <p className="mb-8 max-w-md font-light leading-relaxed text-muted-foreground">
          {ctaDescription}
        </p>
        <div className="flex w-full max-w-xs flex-col gap-4">
          <button
            onClick={onJoinWaitlist}
            className="btn-app-store-cin group flex items-center justify-center gap-3 rounded-[1.25rem] px-8 py-4 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2"
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
          <a
            href="#features"
            className="flex items-center justify-center gap-3 rounded-[1.25rem] border border-border bg-foreground/5 px-8 py-4 text-foreground transition-all duration-300 hover:bg-foreground/10 focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <span className="text-xl font-semibold tracking-tight">How It Works</span>
          </a>
        </div>
      </section>
    </div>
  );
}

export function CinematicHero({
  tagline1 = "Capture, organize, edit.",
  tagline2 = "No chaos. All offline.",
  cardTagline = <>The simplicity you want.<br />The features your work demands.</>,
  cardLabel = "Field photography, redefined.",
  cardDescription = "Master Camera pairs the effortless feel of the native Camera app with powerful metadata workflows and total offline privacy.",
  cardAudience = "Engineered for DIY enthusiasts, scientists, and field professionals.",
  ctaHeading = "Start capturing.",
  ctaDescription = "Master Camera is coming to iOS. Join the waitlist and be the first to know when it launches.",
  appScreenSrc = "/app_screen.png",
  className,
  onJoinWaitlist,
  ...props
}) {
  const containerRef = useRef(null);
  const mainCardRef = useRef(null);
  const mockupRef = useRef(null);
  const requestRef = useRef(0);

  // Phones (<768px) get a dedicated static hero — the pinned scroll timeline below
  // never engages on mobile, so the cinematic card screen disappeared entirely.
  const [isMobile, setIsMobile] = useState(
    () => typeof window !== "undefined" && window.innerWidth < 768
  );
  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // Mouse parallax + card sheen
  useEffect(() => {
    if (isMobile) return;
    const handleMouseMove = (e) => {
      if (window.scrollY > window.innerHeight * 2) return;
      cancelAnimationFrame(requestRef.current);
      requestRef.current = requestAnimationFrame(() => {
        if (mainCardRef.current && mockupRef.current) {
          const rect = mainCardRef.current.getBoundingClientRect();
          mainCardRef.current.style.setProperty("--mouse-x", `${e.clientX - rect.left}px`);
          mainCardRef.current.style.setProperty("--mouse-y", `${e.clientY - rect.top}px`);
          const xVal = (e.clientX / window.innerWidth - 0.5) * 2;
          const yVal = (e.clientY / window.innerHeight - 0.5) * 2;
          gsap.to(mockupRef.current, { rotationY: xVal * 10, rotationX: -yVal * 10, ease: "power3.out", duration: 1.2 });
        }
      });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => { window.removeEventListener("mousemove", handleMouseMove); cancelAnimationFrame(requestRef.current); };
  }, [isMobile]);

  // Cinematic scroll timeline
  useEffect(() => {
    if (isMobile) return;
    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Reduced motion: skip the cinematic scroll sequence entirely and just present
    // the headline as a clean, static first screen (no pinning, no scrubbed motion).
    if (prefersReduced) {
      gsap.set([".text-track-cin", ".text-days-cin"], {
        autoAlpha: 1,
        clearProps: "transform,filter,clipPath",
      });
      gsap.set([".main-card-cin", ".cta-wrapper-cin"], { autoAlpha: 0 });
      return;
    }

    // Animating `filter: blur()` is GPU-heavy on phones — only blur on desktop.
    const blurIn = (px) => (isMobile ? "blur(0px)" : `blur(${px}px)`);

    const ctx = gsap.context(() => {
      gsap.set(".text-track-cin", { autoAlpha: 0, y: 60, scale: 0.85, filter: blurIn(20), rotationX: isMobile ? 0 : -20 });
      gsap.set(".text-days-cin", { autoAlpha: 1, clipPath: "inset(0 100% 0 0)" });
      gsap.set(".main-card-cin", { y: window.innerHeight + 200, autoAlpha: 0 });
      gsap.set([".card-left-text-cin", ".mockup-scroll-wrapper-cin", ".floating-badge-cin"], { autoAlpha: 0 });
      gsap.set(".cta-wrapper-cin", { autoAlpha: 0, scale: 0.8, filter: blurIn(30) });

      // Intro entrance
      const introTl = gsap.timeline({ delay: 0.3 });
      introTl
        .to(".text-track-cin", { duration: 1.8, autoAlpha: 1, y: 0, scale: 1, filter: "blur(0px)", rotationX: 0, ease: "expo.out" })
        .to(".text-days-cin", { duration: 1.4, clipPath: "inset(0 0% 0 0)", ease: "power4.inOut" }, "-=1.0");

      // Scroll-driven timeline — total end reduced from 7000 → 4500
      const scrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "+=2000",
          pin: true,
          scrub: 0.7,
          anticipatePin: 1,
        },
      });

      scrollTl
        // Bg recedes as the card rises — blur only on desktop (heavy on mobile GPUs)
        .to([".hero-text-wrapper-cin", ".bg-grid-cinematic"], { scale: 1.15, filter: blurIn(20), opacity: 0.2, ease: "power2.inOut", duration: 2 }, 0)
        .to(".main-card-cin", { y: 0, ease: "power3.inOut", duration: 2 }, 0)
        // Card expands fullscreen and fades in — never visible as a small floating box
        .to(".main-card-cin", { width: "100%", height: "100%", borderRadius: "0px", autoAlpha: 1, ease: "power3.inOut", duration: 1.5 })
        // Phone flies in — starts when card begins expanding so it's never a blank slate
        .fromTo(".mockup-scroll-wrapper-cin",
          { y: 300, z: -500, rotationX: 50, rotationY: -30, autoAlpha: 0, scale: 0.6 },
          { y: 0, z: 0, rotationX: 0, rotationY: 0, autoAlpha: 1, scale: 1, ease: "expo.out", duration: 2.5 }, "<"
        )
        // Badges glide in from the right, top-down — precise, not scattered
        .fromTo(".floating-badge-cin",
          { x: 44, y: 12, autoAlpha: 0, scale: 0.96 },
          { x: 0, y: 0, autoAlpha: 1, scale: 1, ease: "expo.out", duration: 1.1, stagger: { each: 0.08, from: "start" } },
          "-=1.8"
        )
        // Left text slides in
        .fromTo(".card-left-text-cin", { x: -50, autoAlpha: 0 }, { x: 0, autoAlpha: 1, ease: "power4.out", duration: 1.5 }, "-=1.2")
        // Brief hold before CTA swap
        .to({}, { duration: 0.3 })
        .set(".hero-text-wrapper-cin", { autoAlpha: 0 })
        .set(".cta-wrapper-cin", { autoAlpha: 1 })
        // Minimal hold before exit
        .to({}, { duration: 0.1 })
        // Card content exits
        .to([".mockup-scroll-wrapper-cin", ".floating-badge-cin", ".card-left-text-cin"], {
          scale: 0.9, y: -40, z: -200, autoAlpha: 0, ease: "power3.in", duration: 1.0, stagger: 0.04,
        })
        // Card fades out as it shrinks — CTA becomes visible immediately
        .to(".main-card-cin", {
          width: isMobile ? "92vw" : "85vw",
          height: isMobile ? "92vh" : "85vh",
          borderRadius: isMobile ? "32px" : "40px",
          autoAlpha: 0,
          ease: "expo.inOut", duration: 1.0,
        }, "pullback")
        .to(".cta-wrapper-cin", { scale: 1, filter: "blur(0px)", ease: "expo.inOut", duration: 1.0 }, "pullback")
        // Card already invisible — tiny lift just to clean up position before pin releases
        .to(".main-card-cin", { y: -120, ease: "power2.in", duration: 0.3 });

    }, containerRef);

    return () => ctx.revert();
  }, [isMobile]);

  if (isMobile) {
    return (
      <MobileHero
        tagline1={tagline1}
        tagline2={tagline2}
        cardTagline={cardTagline}
        cardDescription={cardDescription}
        cardAudience={cardAudience}
        ctaHeading={ctaHeading}
        ctaDescription={ctaDescription}
        appScreenSrc={appScreenSrc}
        onJoinWaitlist={onJoinWaitlist}
      />
    );
  }

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative w-screen h-screen overflow-hidden flex items-center justify-center text-foreground font-sans antialiased",
        className
      )}
      style={{ perspective: "1500px" }}
      {...props}
    >
      <style dangerouslySetInnerHTML={{ __html: INJECTED_STYLES }} />
      <div className="film-grain" aria-hidden="true" />
      <div className="bg-grid-cinematic absolute inset-0 z-0 pointer-events-none opacity-60" aria-hidden="true" />

      {/* Background: intro hero text */}
      <div className="hero-text-wrapper-cin absolute z-10 flex flex-col items-center justify-center text-center w-screen px-4 will-change-transform">
        <h1 className="text-track-cin gsap-reveal text-3d-matte-cin text-5xl md:text-7xl lg:text-[6rem] font-bold tracking-tight mb-2">
          {tagline1}
        </h1>
        <h1 className="text-days-cin gsap-reveal text-silver-matte-cin text-5xl md:text-7xl lg:text-[6rem] font-extrabold tracking-tighter">
          {tagline2}
        </h1>
      </div>

      {/* CTA layer — revealed at end of scroll */}
      <div className="cta-wrapper-cin absolute z-10 flex flex-col items-center justify-center text-center w-screen px-4 gsap-reveal pointer-events-auto will-change-transform">
        <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 tracking-tight text-silver-matte-cin">
          {ctaHeading}
        </h2>
        <p className="text-muted-foreground text-lg md:text-xl mb-12 max-w-xl mx-auto font-light leading-relaxed">
          {ctaDescription}
        </p>
        <div className="flex flex-col sm:flex-row gap-6">
          <button
            onClick={onJoinWaitlist}
            className="btn-app-store-cin flex items-center justify-center gap-3 px-8 py-4 rounded-[1.25rem] group focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2"
            aria-label="Join the waitlist"
          >
            <svg className="w-7 h-7 transition-transform group-hover:scale-105" fill="none" viewBox="0 0 28 28" aria-hidden="true">
              <rect width="28" height="28" rx="6" fill="#0F172A"/>
              <rect x="4" y="4" width="9" height="9" rx="2" fill="#F97316"/>
              <rect x="15" y="4" width="9" height="9" rx="2" fill="#FB923C" opacity="0.7"/>
              <rect x="4" y="15" width="9" height="9" rx="2" fill="#FB923C" opacity="0.7"/>
              <rect x="15" y="15" width="9" height="9" rx="2" fill="#F97316" opacity="0.4"/>
            </svg>
            <div className="text-left">
              <div className="text-[10px] font-bold tracking-wider text-neutral-500 uppercase mb-[-2px]">Be the first with</div>
              <div className="text-xl font-bold leading-none tracking-tight">Join Waitlist</div>
            </div>
          </button>
          <a
            href="#features"
            className="flex items-center justify-center gap-3 px-8 py-4 rounded-[1.25rem] border border-border bg-foreground/5 text-foreground hover:bg-foreground/10 transition-all duration-300 hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-transparent"
          >
            <span className="text-xl font-semibold tracking-tight">How It Works</span>
          </a>
        </div>
      </div>

      {/* Foreground: deep card */}
      <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none" style={{ perspective: "1500px" }}>
        <div
          ref={mainCardRef}
          className="main-card-cin premium-depth-card-cin relative overflow-hidden gsap-reveal flex items-center justify-center pointer-events-auto w-[92vw] md:w-[85vw] h-[92vh] md:h-[85vh] rounded-[32px] md:rounded-[40px]"
        >
          <div className="card-sheen-cin" aria-hidden="true" />

          {/* Grid: text left | phone center | empty right (badges float over it) */}
          <div className="relative w-full h-full max-w-7xl mx-auto px-4 lg:px-12 flex flex-col justify-evenly lg:grid lg:grid-cols-3 items-center lg:gap-8 z-10 py-6 lg:py-0">

            {/* LEFT: text — slides in from left */}
            <div className="card-left-text-cin gsap-reveal order-2 lg:order-1 flex flex-col justify-center text-center lg:text-left z-20 w-full px-4 lg:px-0 gap-5 lg:gap-6">
              {/* Primary tagline — large, bold, high impact */}
              <h2 className="text-foreground text-3xl md:text-4xl lg:text-[2.6rem] font-bold leading-[1.15] tracking-tight">
                {cardTagline}
              </h2>

              {/* Divider */}
              <div className="w-10 h-px bg-foreground/20 mx-auto lg:mx-0" />

              {/* Description block */}
              <div className="hidden md:flex flex-col gap-3">
                <p className="text-foreground/70 text-sm lg:text-base leading-relaxed">
                  {cardDescription}
                </p>
                <p className="text-foreground/35 text-sm leading-relaxed">
                  {cardAudience}
                </p>
              </div>
            </div>

            {/* CENTER: phone */}
            <div
              className="mockup-scroll-wrapper-cin order-1 lg:order-2 relative w-full h-[320px] sm:h-[400px] lg:h-[600px] flex items-center justify-center z-10"
              style={{ perspective: "1000px" }}
            >
              <div className="relative w-full h-full flex items-center justify-center transform scale-[0.58] sm:scale-[0.78] md:scale-[0.85] lg:scale-100">
                <div
                  ref={mockupRef}
                  className="relative w-[280px] h-[580px] rounded-[3rem] iphone-bezel-cin flex flex-col will-change-transform"
                  style={{ transformStyle: "preserve-3d" }}
                >
                  {/* Hardware buttons */}
                  <div className="absolute top-[120px] -left-[3px] w-[3px] h-[25px] hardware-btn-cin rounded-l-md z-0" aria-hidden="true" />
                  <div className="absolute top-[160px] -left-[3px] w-[3px] h-[45px] hardware-btn-cin rounded-l-md z-0" aria-hidden="true" />
                  <div className="absolute top-[220px] -left-[3px] w-[3px] h-[45px] hardware-btn-cin rounded-l-md z-0" aria-hidden="true" />
                  <div className="absolute top-[170px] -right-[3px] w-[3px] h-[70px] hardware-btn-cin rounded-r-md z-0 scale-x-[-1]" aria-hidden="true" />

                  {/* Screen */}
                  <div className="absolute inset-[7px] rounded-[2.5rem] overflow-hidden shadow-[inset_0_0_6px_rgba(0,0,0,0.5)] z-10" style={{ backgroundColor: 'hsl(218, 12%, 8%)' }}>
                    <div className="absolute inset-0 screen-glare-cin z-40 pointer-events-none opacity-30" aria-hidden="true" />
                    {/* Dynamic Island */}
                    <div className="absolute top-[5px] left-1/2 -translate-x-1/2 w-[100px] h-[28px] bg-black rounded-full z-50 shadow-[inset_0_-1px_2px_rgba(255,255,255,0.08)]" aria-hidden="true" style={{ background: 'hsl(218, 12%, 8%)' }}>
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.8)] animate-pulse" />
                    </div>
                    <img
                      src={appScreenSrc}
                      alt="Master Camera app interface"
                      className="absolute inset-0 w-full h-full object-cover object-top"
                      style={{ imageRendering: '-webkit-optimize-contrast' }}
                      draggable={false}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT (desktop): feature badges — clean aligned column beside the phone */}
            <div className="hidden lg:flex order-3 self-stretch flex-col justify-center gap-2.5 py-8 z-20 pl-3">
              {BADGES.map(({ Icon, label, color, iconBg }) => (
                <div
                  key={label}
                  className="floating-badge-cin feature-badge-cin rounded-2xl px-3.5 py-2.5 flex items-center gap-3"
                >
                  <div className={`w-9 h-9 rounded-[11px] flex items-center justify-center border shrink-0 ${iconBg}`}>
                    <Icon className={`w-[18px] h-[18px] ${color}`} strokeWidth={1.75} />
                  </div>
                  <span className="text-foreground/90 text-sm font-semibold tracking-tight leading-tight">{label}</span>
                </div>
              ))}
            </div>

            {/* RIGHT (mobile/tablet): feature chips — horizontal rail so features stay visible */}
            <div className="lg:hidden order-3 w-full z-20">
              <div className="edge-fade-x no-scrollbar -mx-4 flex snap-x snap-mandatory gap-2.5 overflow-x-auto px-4 pb-1">
                {BADGES.map(({ Icon, label, color, iconBg }) => (
                  <div
                    key={label}
                    className="floating-badge-cin feature-badge-cin flex shrink-0 snap-start items-center gap-2 rounded-xl px-3 py-2"
                  >
                    <div className={`flex h-7 w-7 items-center justify-center rounded-lg border shrink-0 ${iconBg}`}>
                      <Icon className={`h-[15px] w-[15px] ${color}`} strokeWidth={1.75} />
                    </div>
                    <span className="whitespace-nowrap text-foreground/90 text-xs font-semibold tracking-tight">{label}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
