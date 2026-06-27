import React, { useRef, useState, useEffect } from "react"
import { motion, useInView } from "motion/react"
import { cn } from "@/lib/utils"
import Reveal from "@/components/Reveal"

const PROCESS_PHASES = [
  {
    id: "feature-1",
    title: "Capture Like a Pro",
    description:
      "Every shot, perfectly framed and richly documented. Overlays, watermarks, and live guides built right into the viewfinder.",
    bullets: [
      "Grid, level, and compass guides",
      "Automatic watermarking",
      "Photo, Video and all the useful features of stock camera",
      "Organized right from the Capture screen",
    ],
    image: "/feature-images/feature-1.jpg",
  },
  {
    id: "feature-2",
    title: "Context That Sticks",
    description:
      "Add notes, tags, and details the moment you capture — while it's still fresh. Nothing forgotten, nothing lost.",
    bullets: [
      "Quick context right after each shot",
      "Notes, tags, and custom fields",
      "Voice notes in seconds",
      "Automatic data capture: Location, compass, pitch, etc.",
    ],
    image: "/feature-images/feature-2.jpg",
  },
  {
    id: "feature-4",
    title: "Organized in Stacks",
    description:
      "Group photos and video by project, event, or site. Your work, structured exactly how you think about it.",
    bullets: [
      "Stacks for jobs, events, and locations",
      "Tags and custom fields",
      "Searchable from the first shot",
    ],
    image: "/feature-images/feature-3.png",
  },
  {
    id: "feature-5",
    title: "Built-In Document Scanner",
    description:
      "Capture crisp, cropped scans of documents and notes — no second app required.",
    bullets: [
      "Auto edge detection and cropping",
      "Multi-page scans",
      "Stored alongside your photos",
    ],
    image: "/feature-images/feature-4.jpg",
  },
  {
    id: "feature-6",
    title: "Smart Search",
    description:
      "Find anything in seconds. Search by location, tags, notes — even text inside your scanned documents.",
    bullets: [
      "Search text inside scans",
      "Filter by location, date, and tags",
      "Map view of every geotagged shot",
    ],
    image: "/feature-images/feature-5.jpg",
  },
  {
    id: "feature-7",
    title: "Before & After Compare",
    description:
      "Place any two shots side by side. Label them, style the banner, and save the comparison — compare as many pairs as you need at once.",
    bullets: [
      "Bulk compare multiple pairs at once",
      "Custom Before/After labels and banner",
      "Saves as a new image in your Stack",
    ],
    image: "/feature-images/feature-6.jpg",
  },
  {
    id: "feature-8",
    title: "Private by Design",
    description:
      "Everything stays on your device. No cloud, no tracking, no account — full power, fully offline.",
    bullets: [
      "100% on-device, works offline",
      "Zero tracking or telemetry",
      "No login required",
    ],
    image: "/feature-images/feature-7.jpg",
  },
]

const FeatureText = ({
  phase,
  index,
  activeIndex,
  setActiveIndex,
}: {
  phase: (typeof PROCESS_PHASES)[0]
  index: number
  activeIndex: number
  setActiveIndex: (index: number) => void
}) => {
  const ref = useRef<HTMLDivElement>(null)
  // useInView triggers when the element is halfway through the viewport (for desktop)
  const isInView = useInView(ref, { margin: "-50% 0px -50% 0px" })

  useEffect(() => {
    if (isInView) {
      setActiveIndex(index)
    }
  }, [isInView, index, setActiveIndex])

  return (
    <>
      {/* Mobile Layout (Standard Vertical Flow) */}
      <div className="flex flex-col md:hidden w-full py-16 px-4 sm:px-6 items-center border-b border-border/10 last:border-0">
        <Reveal>
          <div className="w-full max-w-[320px] sm:max-w-[360px] aspect-[3/4] rounded-[2rem] shadow-xl overflow-hidden border border-border/20 mb-8 bg-muted/20 mx-auto">
            <img
              src={phase.image}
              alt={phase.title}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
        </Reveal>
        
        <Reveal delay={0.1} className="w-full max-w-md space-y-4">
          <p className="text-xs text-primary font-bold tracking-widest uppercase">
            {String(index + 1).padStart(2, "0")} / {String(PROCESS_PHASES.length).padStart(2, "0")}
          </p>
          <h3 className="text-3xl font-extrabold tracking-tight text-foreground">
            {phase.title}
          </h3>
          <p className="text-lg leading-relaxed text-muted-foreground">
            {phase.description}
          </p>
          <ul className="space-y-3 pt-2">
            {phase.bullets.map((b) => (
              <li key={b} className="flex gap-3 items-start text-muted-foreground text-base">
                <span className="mt-[8px] h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary/80 shadow-[0_0_8px_rgba(var(--primary),0.8)]" />
                <span>{b}</span>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>

      {/* Desktop Layout (Sticky Scrolljacking) */}
      <div className="hidden md:flex h-[100vh] w-full flex-row pointer-events-none">
        {/* Spacer to keep the left side empty for the sticky image */}
        <div className="w-1/2 h-full shrink-0"></div>

        {/* Text Content */}
        <div
          ref={ref}
          className="w-1/2 h-full flex flex-col justify-center p-8 lg:p-20 pointer-events-auto"
        >
          <div
            className={cn(
              "max-w-md space-y-5 transition-all duration-700 ease-out",
              activeIndex === index
                ? "opacity-100 translate-y-0"
                : "opacity-20 translate-y-8"
            )}
          >
            <p className="text-xs text-primary font-bold tracking-widest uppercase">
              {String(index + 1).padStart(2, "0")} /{" "}
              {String(PROCESS_PHASES.length).padStart(2, "0")}
            </p>
            <h3 className="text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl text-foreground">
              {phase.title}
            </h3>
            <p className="text-lg leading-relaxed text-muted-foreground">
              {phase.description}
            </p>
            <ul className="space-y-3 pt-2">
              {phase.bullets.map((b) => (
                <li
                  key={b}
                  className="flex gap-3 items-start text-muted-foreground text-base"
                >
                  <span className="mt-[8px] h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary/80 shadow-[0_0_8px_rgba(var(--primary),0.8)]" />
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </>
  )
}

const Process = () => {
  const [activeIndex, setActiveIndex] = useState(0)

  return (
    <section className="w-full bg-background relative" id="features">
      {/* Header section */}
      <div className="mx-auto max-w-5xl px-4 pt-24 pb-12 sm:px-6 xl:px-12 text-center relative z-20">
        <Reveal>
          <h5 className="text-sm font-semibold tracking-widest text-muted-foreground uppercase mb-4">
            The Master Camera way
          </h5>
          <h2 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl text-foreground">
            How Master Camera brings{" "}
            <br className="hidden md:block" />
            <span className="text-primary bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/50">
              order to your work
            </span>
          </h2>
        </Reveal>
      </div>

      <div className="relative w-full max-w-7xl mx-auto">
        {/* Sticky Media Container - ONLY VISIBLE ON DESKTOP */}
        <div className="hidden md:flex sticky top-0 h-screen w-full flex-row items-center pointer-events-none z-0">
          <div className="w-1/2 h-screen flex items-center justify-center p-8 lg:p-12 z-0 relative">
            <div className="relative w-full max-w-[380px] xl:max-w-[420px] aspect-[3/4] rounded-[2rem] shadow-2xl overflow-hidden border border-border/20 bg-muted/20">
              {PROCESS_PHASES.map((phase, i) => (
                <motion.img
                  key={phase.id}
                  src={phase.image}
                  alt={phase.title}
                  className="absolute inset-0 w-full h-full object-cover rounded-[2rem]"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{
                    opacity: activeIndex === i ? 1 : 0,
                    scale: activeIndex === i ? 1 : 1.05,
                  }}
                  transition={{
                    duration: 0.8,
                    ease: [0.16, 1, 0.3, 1], // Apple-like cubic-bezier
                  }}
                />
              ))}
            </div>
          </div>
          {/* Spacer for the right side where text scrolls */}
          <div className="w-1/2"></div>
        </div>

        {/* Scrolling Text Container */}
        <div className="relative z-10 w-full md:-mt-[100vh]">
          {PROCESS_PHASES.map((phase, i) => (
            <FeatureText
              key={phase.id}
              phase={phase}
              index={i}
              activeIndex={activeIndex}
              setActiveIndex={setActiveIndex}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

export { Process }
