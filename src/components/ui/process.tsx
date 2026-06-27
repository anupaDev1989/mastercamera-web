import React, { useRef } from "react"
import { motion, useScroll, useTransform, useSpring } from "motion/react"
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
    title: "Organized by Category",
    description:
      "Group photos and video by project, event, or site. Your work, structured exactly how you think about it.",
    bullets: [
      "Categories for jobs, events, and locations",
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
      "Saves as a new image in your collection",
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

const Process = () => {
  const containerRef = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  })

  // Apple-like smooth spring to make the transitions fluid even if scrolling stops abruptly
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 300,
    damping: 30,
    restDelta: 0.001
  })

  return (
    <section id="features" className="w-full bg-background relative">
      {/* Header section outside the sticky tracker so it acts as standard layout flow */}
      <div className="mx-auto max-w-5xl px-4 pt-24 pb-8 sm:px-6 xl:px-12 text-center relative z-20">
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

      {/* The Scroll Track */}
      <div 
        ref={containerRef}
        // Total height defines how long the scroll journey is.
        // 80vh per phase gives a very comfortable pacing.
        style={{ height: `${PROCESS_PHASES.length * 80}vh` }}
        className="relative w-full max-w-7xl mx-auto"
      >
        {/* The Sticky Viewport */}
        <div className="sticky top-0 h-[100vh] sm:h-screen w-full flex flex-col md:flex-row items-center justify-center overflow-hidden pt-20 md:pt-0">
          
          {/* Images Container - Fixed left/top area */}
          <div className="w-full md:w-1/2 h-[45vh] md:h-full flex items-center justify-center relative p-4 sm:p-8 z-0">
            <div className="relative w-full max-w-[280px] sm:max-w-[340px] md:max-w-[380px] xl:max-w-[420px] aspect-[3/4] rounded-[2rem] shadow-2xl overflow-hidden border border-border/20 bg-muted/20">
              {PROCESS_PHASES.map((phase, i) => {
                const start = i / PROCESS_PHASES.length
                const end = (i + 1) / PROCESS_PHASES.length
                
                // Crossfade images perfectly
                const imgFadeMargin = 0.2 / PROCESS_PHASES.length

                const p1 = i === 0 ? 0 : start - imgFadeMargin
                const p2 = i === 0 ? 0 : start + imgFadeMargin
                const p3 = i === PROCESS_PHASES.length - 1 ? 1 : end - imgFadeMargin
                const p4 = i === PROCESS_PHASES.length - 1 ? 1 : end + imgFadeMargin

                const keyframes = [
                  p1,
                  p2,
                  p3,
                  p4,
                ]

                const opacityVals = [
                  0,
                  1,
                  1,
                  0
                ]

                const opacity = useTransform(smoothProgress, keyframes, opacityVals)
                const scale = useTransform(smoothProgress, [start, end], [1, 1.05])

                return (
                  <motion.img
                    key={`img-${phase.id}`}
                    src={phase.image}
                    alt={phase.title}
                    className="absolute inset-0 w-full h-full object-cover rounded-[2rem]"
                    style={{ opacity, scale }}
                    loading={i === 0 ? "eager" : "lazy"}
                  />
                )
              })}
            </div>
          </div>

          {/* Texts Container - Fixed right/bottom area */}
          <div className="w-full md:w-1/2 h-[55vh] md:h-full relative flex items-center justify-center md:justify-start z-10">
             {PROCESS_PHASES.map((phase, i) => {
                const start = i / PROCESS_PHASES.length
                const end = (i + 1) / PROCESS_PHASES.length
                
                // No overlap for text: fade out finishes at end, fade in starts at end
                const textFadeMargin = 0.15 / PROCESS_PHASES.length

                const p1 = i === 0 ? 0 : start
                const p2 = i === 0 ? 0 : start + textFadeMargin
                const p3 = i === PROCESS_PHASES.length - 1 ? 1 : end - textFadeMargin
                const p4 = i === PROCESS_PHASES.length - 1 ? 1 : end

                const keyframes = [
                  p1,
                  p2,
                  p3,
                  p4,
                ]

                const opacityVals = [
                  0,
                  1,
                  1,
                  0
                ]

                const yVals = [
                  i === 0 ? 0 : 20,  // Slide in from bottom
                  0,                 // Settle perfectly
                  0,
                  i === PROCESS_PHASES.length - 1 ? 0 : -20 // Slide out to top
                ]

                const opacity = useTransform(smoothProgress, keyframes, opacityVals)
                const y = useTransform(smoothProgress, keyframes, yVals)

                // Only enable pointer events when fully visible so users can select text if needed
                const pointerEvents = useTransform(opacity, o => o > 0.8 ? "auto" : "none")

                return (
                  <motion.div
                    key={`text-${phase.id}`}
                    className="absolute inset-0 flex flex-col justify-center p-6 sm:p-8 md:p-12 lg:p-20 bg-background/80 md:bg-transparent backdrop-blur-sm md:backdrop-blur-none border-t border-border/10 md:border-none"
                    style={{ opacity, y, pointerEvents: pointerEvents as any }}
                  >
                    <div className="max-w-md space-y-4 md:space-y-5">
                      <p className="text-xs text-primary font-bold tracking-widest uppercase">
                        {String(i + 1).padStart(2, "0")} / {String(PROCESS_PHASES.length).padStart(2, "0")}
                      </p>
                      <h3 className="text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl text-foreground">
                        {phase.title}
                      </h3>
                      <p className="text-base sm:text-lg leading-relaxed text-muted-foreground">
                        {phase.description}
                      </p>
                      <ul className="space-y-3 pt-1 md:pt-2">
                        {phase.bullets.map((b) => (
                          <li key={b} className="flex gap-3 items-start text-muted-foreground text-sm sm:text-base">
                            <span className="mt-[6px] md:mt-[8px] h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary/80 shadow-[0_0_8px_rgba(var(--primary),0.8)]" />
                            <span>{b}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </motion.div>
                )
             })}
          </div>

        </div>
      </div>
    </section>
  )
}

export { Process }
