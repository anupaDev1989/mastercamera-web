import { ContainerScroll, CardSticky } from "@/components/ui/cards-stack"
import { cn } from "@/lib/utils"

const PROCESS_PHASES = [
  {
    id: "feature-1",
    title: "Capture Like a Pro",
    tagline: null,
    description:
      "Every shot, perfectly framed and richly documented. Overlays, watermarks, and live guides built right into the viewfinder.",
    bullets: [
      "Grid, level, and compass guides",
      "Automatic watermarking",
      "Photo, Video and all the useful features of stock camera",
      "Organized right from the Capture screen",
    ],
    solves: null,
    image: "/feature-images/feature-1.jpg",
  },
  {
    id: "feature-2",
    title: "Context That Sticks",
    tagline: null,
    description:
      "Add notes, tags, and details the moment you capture — while it's still fresh. Nothing forgotten, nothing lost.",
    bullets: [
      "Quick context right after each shot",
      "Notes, tags, and custom fields",
      "Voice notes in seconds",
      "Automatic data capture: Location, compass, pitch, etc.",
    ],
    solves: null,
    image: "/feature-images/feature-2.jpg",
  },
  {
    id: "feature-4",
    title: "Organized in Stacks",
    tagline: null,
    description:
      "Group photos and video by project, event, or site. Your work, structured exactly how you think about it.",
    bullets: [
      "Stacks for jobs, events, and locations",
      "Tags and custom fields",
      "Searchable from the first shot",
    ],
    solves: null,
    image: "/feature-images/feature-3.png",
  },
  {
    id: "feature-5",
    title: "Built-In Document Scanner",
    tagline: null,
    description:
      "Capture crisp, cropped scans of documents and notes — no second app required.",
    bullets: [
      "Auto edge detection and cropping",
      "Multi-page scans",
      "Stored alongside your photos",
    ],
    solves: null,
    image: "/feature-images/feature-4.jpg",
  },
  {
    id: "feature-6",
    title: "Smart Search",
    tagline: null,
    description:
      "Find anything in seconds. Search by location, tags, notes — even text inside your scanned documents.",
    bullets: [
      "Search text inside scans",
      "Filter by location, date, and tags",
      "Map view of every geotagged shot",
    ],
    solves: null,
    image: "/feature-images/feature-5.jpg",
  },
  {
    id: "feature-7",
    title: "Before & After Compare",
    tagline: null,
    description:
      "Place any two shots side by side. Label them, style the banner, and save the comparison — compare as many pairs as you need at once.",
    bullets: [
      "Bulk compare multiple pairs at once",
      "Custom Before/After labels and banner",
      "Saves as a new image in your Stack",
    ],
    solves: null,
    image: "/feature-images/feature-6.jpg",
  },
  {
    id: "feature-8",
    title: "Private by Design",
    tagline: null,
    description:
      "Everything stays on your device. No cloud, no tracking, no account — full power, fully offline.",
    bullets: [
      "100% on-device, works offline",
      "Zero tracking or telemetry",
      "No login required",
    ],
    solves: null,
    image: "/feature-images/feature-7.jpg",
  },
]

const Process = () => {
  return (
    <section className="w-full bg-background px-4 pt-6 pb-16 text-foreground sm:px-6 lg:pt-8 lg:pb-20 xl:px-12">
      <div className="mx-auto max-w-5xl text-center">
        <h5 className="text-xs tracking-wide">The Master Camera way...</h5>
        <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
          How Master Camera brings{" "}
          <span className="text-primary">order to your work</span>
        </h2>
      </div>

      <ContainerScroll className="mx-auto mt-10 min-h-[260vh] max-w-5xl space-y-8 pt-4 pb-24 md:pb-32 md:space-y-10">
        {PROCESS_PHASES.map((phase, index) => {
          const isImageLeft = index % 2 === 0

          return (
            <CardSticky
              key={phase.id}
              index={index + 2}
              className="rounded-3xl border border-border bg-card shadow-md overflow-hidden"
            >
              <div
                className={cn(
                  "flex flex-col md:flex-row",
                  !isImageLeft && "md:flex-row-reverse"
                )}
              >
                <div className="flex-1 flex items-center justify-center p-4 md:p-6">
                  <img
                    src={phase.image}
                    alt={phase.title}
                    loading="lazy"
                    decoding="async"
                    className="max-h-[220px] w-auto rounded-2xl"
                    style={{ imageRendering: '-webkit-optimize-contrast' }}
                  />
                </div>
                <div className="flex-1 p-4 sm:p-5 text-left">
                  <div className="flex h-full flex-col justify-between">
                    <div>
                      <h2 className="text-xl font-bold tracking-tight sm:text-2xl">
                        {phase.title}
                      </h2>
                      {phase.tagline && (
                        <p className="mt-2 text-sm font-semibold leading-relaxed text-foreground sm:text-base">
                          {phase.tagline}
                        </p>
                      )}
                      {phase.description && (
                        <p className="mt-2 text-sm leading-relaxed text-foreground sm:text-base">
                          {phase.description}
                        </p>
                      )}
                      {phase.bullets && phase.bullets.length > 0 && (
                        <ul className="mt-3 space-y-1 text-sm leading-relaxed text-foreground sm:text-base">
                          {phase.bullets.map((bullet: string) => (
                            <li key={bullet} className="flex gap-2">
                              <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary" />
                              <span>{bullet}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                    {phase.solves && (
                      <p className="mt-4 text-sm font-semibold leading-relaxed text-primary sm:text-base">
                        {phase.solves}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </CardSticky>
          )
        })}

        <div className="h-16 sm:h-20 md:h-24" />
      </ContainerScroll>
    </section>
  )
}

export { Process }
