import { ContainerScroll, CardSticky } from "@/components/ui/cards-stack"
import { cn } from "@/lib/utils"

const PROCESS_PHASES = [
  {
    id: "feature-1",
    title: "Always Know What’s Available",
    description:
      "Instant visibility into availability, condition, and location. RiGG’s Smart Status Tracking removes the uncertainty of wondering where your gear is and whether it’s usable right now.",
    solves:
      "No more wasted time hunting for equipment or discovering issues too late.",
    image: "/feature-images/feature-1.webp",
  },
  {
    id: "feature-2",
    title: "Protect Your Investment with Issue Tracking",
    description:
      "Never get surprised by gear failures again. RiGG makes it easy to log problems, track progress, and keep damaged or missing items from slipping through the cracks.",
    solves:
      "No more unexpected equipment failures or forgotten maintenance tasks.",
    image: "/feature-images/feature-2.webp",
  },
  {
    id: "feature-3",
    title: "Seamless Rental Management",
    description:
      "Effortlessly stay on top of third-party rentals. RiGG helps you avoid late fees and lost gear by giving rented equipment the same structure and visibility as your owned items.",
    solves:
      "No more losing track of rental gear or paying unnecessary late fees.",
    image: "/feature-images/feature-3.webp",
  },
  {
    id: "feature-4",
    title: "Turn Chaos into Ready-to-Go Kits",
    description:
      "Pack faster with reusable, reliable kit presets. RiGG lets you group gear into purpose-built kits and instantly see what’s missing before every shoot.",
    solves:
      "No more rebuilding gear lists from scratch or guessing what’s missing.",
    image: "/feature-images/feature-4.webp",
  },
  {
    id: "feature-5",
    title: "Plan Shoots with Confidence",
    description:
      "Assign gear to projects and avoid schedule conflicts. RiGG prevents double-booking by linking items to shoot dates and warning you when assignments overlap.",
    solves:
      "No more double-booking gear or finding items unavailable at the last minute.",
    image: "/feature-images/feature-5.webp",
  },
  {
    id: "feature-6",
    title: "Fast Packing & Comprehensive Logging",
    description:
      "Check out gear quickly and track everything with confidence. RiGG makes packing efficient and ensures every action is recorded with full accountability.",
    solves:
      "No more packing mistakes or missing transaction history.",
    image: "/feature-images/feature-6.webp",
  },
  {
    id: "feature-7",
    title: "Track Maintenance by Usage, Not Just Dates",
    description:
      "Service equipment when it actually needs it. RiGG offers smarter maintenance cycles based on real usage, protecting your most valuable assets.",
    solves:
      "No more premature servicing, delayed maintenance, or accidental gear damage.",
    image: "/feature-images/feature-7.webp",
  },
  {
    id: "feature-8",
    title: "Works On Set, Offline & Secure",
    description:
      "No signal? No problem. RiGG’s Private Mode lets you work entirely offline, with no account and no data leaving your device.",
    solves:
      "No more being blocked by poor connectivity or forced account signups.",
    image: "/feature-images/feature-8.webp",
  },
  {
    id: "feature-9",
    title: "Shared Inventory & Team Sync (Coming Soon)",
    description:
      "A unified inventory for your team — coming soon. RiGG’s upcoming Team Mode keeps everyone aligned with centralized gear tracking and protected access.",
    solves:
      "No more fragmented records or confusion across team members and devices.",
    image: "/feature-images/feature-9.webp",
  },
]

const Process = () => {
  return (
    <section className="w-full bg-stone-50 px-4 py-16 text-stone-900 sm:px-6 lg:py-20 xl:px-12">
      <div className="mx-auto max-w-5xl text-center">
        <h5 className="text-xs uppercase tracking-wide">our process</h5>
        <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
          Planning your{" "}
          <span className="text-indigo-500">project development</span> journey
        </h2>
      </div>

      <ContainerScroll className="mx-auto mt-10 min-h-[400vh] max-w-5xl space-y-8 py-4 md:space-y-10">
        {PROCESS_PHASES.map((phase, index) => {
          const isImageLeft = index % 2 === 0

          return (
            <CardSticky
              key={phase.id}
              index={index + 2}
              className="min-h-[220px] rounded-3xl border bg-white/90 p-6 shadow-lg backdrop-blur-md sm:min-h-[260px] sm:p-8"
            >
              <div
                className={cn(
                  "flex flex-col gap-4 md:items-stretch md:gap-8",
                  isImageLeft ? "md:flex-row" : "md:flex-row-reverse"
                )}
              >
                <div className="flex-1 text-left">
                  <div>
                    <h2 className="text-xl font-bold tracking-tight sm:text-2xl">
                      {phase.title}
                    </h2>
                    <p className="mt-3 text-sm leading-relaxed text-foreground sm:text-base">
                      {phase.description}
                    </p>
                    {phase.solves && (
                      <p className="mt-2 text-sm font-medium leading-relaxed text-primary sm:text-base">
                        {phase.solves}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex-1">
                  <div className="h-full min-h-[160px] overflow-hidden rounded-2xl bg-indigo-50/40 sm:min-h-[190px]">
                    <img
                      src={phase.image}
                      alt={phase.title}
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                  </div>
                </div>
              </div>
            </CardSticky>
          )
        })}
      </ContainerScroll>
    </section>
  )
}

export { Process }
