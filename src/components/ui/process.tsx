import { ContainerScroll, CardSticky } from "@/components/ui/cards-stack"
import { cn } from "@/lib/utils"

const PROCESS_PHASES = [
  {
    id: "feature-1",
    title: "Always Know What’s Available",
    tagline: "Instant visibility into availability, condition, and location.",
    description:
      "RiGG removes the guesswork around where your gear is and whether it’s ready to use.",
    bullets: [
      "See real-time status: available, checked out, booked, or in repair",
      "View current condition and physical location",
      "Manage your full gear catalog with photos and details",
    ],
    solves:
      "No more wasted time hunting for equipment or discovering issues too late.",
    image: "/feature-images/feature-1.webp",
  },
  {
    id: "feature-2",
    title: "Protect Your Investment with Issue Tracking",
    tagline: "Never get surprised by gear failures again.",
    description:
      "RiGG helps you capture issues immediately and ensure nothing slips through the cracks.",
    bullets: [
      "Log damage, missing items, or malfunctions with notes and photos",
      "Move issues through a simple Open → In Progress → Resolved workflow",
      "Automatically adjust availability for affected gear",
    ],
    solves:
      "No more unexpected equipment failures or forgotten maintenance tasks.",
    image: "/feature-images/feature-2.webp",
  },
  {
    id: "feature-3",
    title: "Seamless Rental Management",
    tagline: "Effortlessly stay on top of third-party rentals.",
    description:
      "RiGG gives rented gear the structure and clarity it always lacked.",
    bullets: [
      "Track gear checked out to clients, collaborators, or rental houses",
      "Add due dates and instantly spot overdue items",
      "Keep all external rentals in one clear view",
    ],
    solves:
      "No more losing track of rental gear or paying unnecessary late fees.",
    image: "/feature-images/feature-3.webp",
  },
  {
    id: "feature-4",
    title: "Turn Chaos into Ready-to-Go Kits",
    tagline: "Pack faster with reusable, reliable kit presets.",
    description:
      "RiGG keeps your shoots consistent, organized, and efficient.",
    bullets: [
      "Build reusable kits for common setups",
      "Instantly check kit readiness (green / yellow / red)",
      "Clone kits to adapt for new clients or variations",
    ],
    solves:
      "No more rebuilding gear lists from scratch or guessing what’s missing.",
    image: "/feature-images/feature-4.webp",
  },
  {
    id: "feature-5",
    title: "Plan Shoots with Confidence",
    tagline: "Assign gear to projects and avoid schedule conflicts.",
    description:
      "RiGG ensures your gear is available where and when you need it.",
    bullets: [
      "Create projects with start and end dates",
      "Assign individual items or entire kits",
      "Get automatic conflict warnings for overlapping bookings",
    ],
    solves:
      "No more double-booking gear or finding items unavailable at the last minute.",
    image: "/feature-images/feature-5.webp",
  },
  {
    id: "feature-6",
    title: "Fast Packing & Comprehensive Logging",
    tagline: "Check out gear quickly and track everything with confidence.",
    description:
      "RiGG streamlines packing and captures a complete history for accountability.",
    bullets: [
      "Use a visual packing checklist for fast bulk checkout",
      "See a summary of what’s packed or missing",
      "Log every event: who, when, conditions, and notes",
    ],
    solves:
      "No more packing mistakes or missing transaction history.",
    image: "/feature-images/feature-6.webp",
  },
  {
    id: "feature-7",
    title: "Track Maintenance by Usage, Not Just Dates",
    tagline: "Service equipment when it actually needs it.",
    description:
      "RiGG prevents premature wear and unnecessary downtime.",
    bullets: [
      "Set maintenance plans per item",
      "Trigger service by hours used, number of uses, or milestones",
      "Get smart reminders when service is due or overdue",
    ],
    solves:
      "No more premature servicing, delayed maintenance, or accidental gear damage.",
    image: "/feature-images/feature-7.webp",
  },
  {
    id: "feature-8",
    title: "Works On Set, Offline & Secure",
    tagline: "No signal? No problem.",
    description:
      "RiGG gives you full functionality even on remote shoots.",
    bullets: [
      "Operates 100% offline in Private Mode",
      "No account required to start",
      "All data stays local — zero sync, zero tracking",
    ],
    solves:
      "No more being blocked by poor connectivity or forced account signups.",
    image: "/feature-images/feature-8.webp",
  },
  {
    id: "feature-9",
    title: "Shared Inventory & Team Sync (Coming Soon)",
    tagline: "A unified inventory for your team — coming soon.",
    description:
      "RiGG will make multi-user gear management simple, safe, and synced.",
    bullets: [
      "Shared, cloud-backed inventory across the team",
      "Role-based access to protect critical data",
      "Smooth, real-time syncing between devices",
    ],
    solves:
      "No more fragmented records or confusion across team members and devices.",
    image: "/feature-images/feature-9.webp",
  },
]

const Process = () => {
  return (
    <section className="w-full bg-stone-50 px-4 py-16 text-stone-900 sm:px-6 lg:py-20 xl:px-12">
      <div className="mx-auto max-w-5xl text-center">
        <h5 className="text-xs tracking-wide">The RiGG way...</h5>
        <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
          How RiGG removes the {" "}
          <span className="text-red-800">gear chaos</span> from your work
        </h2>
      </div>

      <ContainerScroll className="mx-auto mt-10 min-h-[400vh] max-w-5xl space-y-8 py-4 md:space-y-10">
        {PROCESS_PHASES.map((phase, index) => {
          const isImageLeft = index % 2 === 0

          return (
            <CardSticky
              key={phase.id}
              index={index + 2}
              className="min-h-[240px] rounded-3xl border bg-white/90 p-6 shadow-lg backdrop-blur-md sm:min-h-[280px] sm:p-8 lg:min-h-[320px]"
            >
              <div
                className={cn(
                  "flex flex-col gap-4 md:items-stretch md:gap-8",
                  isImageLeft ? "md:flex-row" : "md:flex-row-reverse"
                )}
              >
                <div className="flex-1 text-left">
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
                              <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-red-800" />
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
