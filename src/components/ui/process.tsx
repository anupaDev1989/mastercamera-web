import React, { useEffect, useRef, useState } from "react"
import { motion, AnimatePresence } from "motion/react"
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

const PEEK_OFFSET = 14

const Process = () => {
  const [activeIndex, setActiveIndex] = useState(0)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return

    const handleScroll = () => {
      const rect = el.getBoundingClientRect()
      const totalScrollable = rect.height - window.innerHeight
      if (totalScrollable <= 0) return
      const scrolled = Math.max(0, -rect.top)
      const progress = Math.min(scrolled / totalScrollable, 1)
      const index = Math.min(
        Math.floor(progress * PROCESS_PHASES.length),
        PROCESS_PHASES.length - 1
      )
      setActiveIndex(index)
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const activePhase = PROCESS_PHASES[activeIndex]

  return (
    <section className="w-full bg-background text-foreground">
      {/* Section header */}
      <Reveal className="mx-auto max-w-5xl px-4 pt-16 pb-8 sm:px-6 xl:px-12 text-center">
        <h5 className="text-xs tracking-wide">The Master Camera way...</h5>
        <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
          How Master Camera brings{" "}
          <span className="text-primary">order to your work</span>
        </h2>
      </Reveal>

      {/* Tall scroll container */}
      <div
        ref={scrollRef}
        style={{ height: `${PROCESS_PHASES.length * 80 + 20}vh` }}
        className="relative"
      >
        {/* Sticky viewport */}
        <div className="sticky top-0 h-screen overflow-hidden">
          <div className="h-full mx-auto max-w-6xl px-6 sm:px-8 xl:px-12 flex flex-col md:flex-row items-center justify-center gap-7 md:gap-12">

            {/* Image card stack — top on mobile, right on desktop */}
            <div className="order-1 md:order-2 flex-shrink-0 flex items-center justify-center">
              <div
                className="relative"
                style={{
                  width: "min(300px, 64vw)",
                  height: "min(420px, 46vh)",
                }}
              >
                {PROCESS_PHASES.map((phase, i) => {
                  // Only mount the active card and the ones already passed.
                  // Future cards stay out of the DOM so they can never bleed
                  // over the text — they animate in from below as you scroll.
                  if (i > activeIndex) return null

                  const d = activeIndex - i // 0 = active, >0 = past

                  return (
                    <motion.div
                      key={phase.id}
                      className="absolute inset-0 rounded-3xl overflow-hidden shadow-2xl"
                      initial={{ y: "60%", scale: 0.92, opacity: 0 }}
                      animate={{
                        y: -(d * PEEK_OFFSET),
                        zIndex: PROCESS_PHASES.length - d,
                        scale: Math.max(0.9, 1 - d * 0.04),
                        opacity: d > 3 ? 0 : 1,
                      }}
                      transition={{ type: "spring", stiffness: 280, damping: 30 }}
                    >
                      <img
                        src={phase.image}
                        alt={phase.title}
                        className="w-full h-full object-cover"
                        loading={i === 0 ? "eager" : "lazy"}
                        decoding="async"
                      />
                    </motion.div>
                  )
                })}
              </div>
            </div>

            {/* Text panel — bottom on mobile, left on desktop */}
            <div className="order-2 md:order-1 flex-1 min-w-0 flex gap-5 items-start">
              {/* Vertical progress bar */}
              <div className="hidden md:flex flex-col gap-1.5 pt-2 flex-shrink-0">
                {PROCESS_PHASES.map((_, i) => (
                  <div
                    key={i}
                    className={cn(
                      "rounded-full transition-all duration-300",
                      i === activeIndex
                        ? "w-1.5 h-5 bg-primary"
                        : "w-1.5 h-1.5 bg-muted-foreground/30"
                    )}
                  />
                ))}
              </div>

              <div className="flex-1">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeIndex}
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -14 }}
                    transition={{ duration: 0.25, ease: "easeInOut" }}
                    className="space-y-4"
                  >
                    <p className="text-xs text-muted-foreground tracking-widest uppercase">
                      {String(activeIndex + 1).padStart(2, "0")} /{" "}
                      {String(PROCESS_PHASES.length).padStart(2, "0")}
                    </p>
                    <h3 className="text-3xl font-bold tracking-tight sm:text-4xl">
                      {activePhase.title}
                    </h3>
                    <p className="text-base leading-relaxed text-foreground/80 sm:text-lg">
                      {activePhase.description}
                    </p>
                    <ul className="space-y-2 text-base sm:text-lg">
                      {activePhase.bullets.map((b) => (
                        <li key={b} className="flex gap-2.5 items-start">
                          <span className="mt-[9px] h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary" />
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                </AnimatePresence>

                {/* Mobile progress dots (horizontal) */}
                <div className="mt-5 flex md:hidden gap-1.5 items-center">
                  {PROCESS_PHASES.map((_, i) => (
                    <div
                      key={i}
                      className={cn(
                        "rounded-full transition-all duration-300",
                        i === activeIndex
                          ? "w-4 h-1.5 bg-primary"
                          : "w-1.5 h-1.5 bg-muted-foreground/30"
                      )}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export { Process }
