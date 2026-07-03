"use client"

import { useEffect, useRef, useState } from "react"
import { ShieldCheck } from "lucide-react"

export function SiteFooter() {
  const teamMembers = [
    { name: "PRUDENCE ODHIAMBO", id: "25S01ACPS003" },
    { name: "SALLY MARO", id: "24S01ACPS002" },
    { name: "IMAI MICKEN AKISA", id: "25M01ABA011" },
    { name: "DANIELLA WANGARI", id: "26J01AXRM007" },
    { name: "SHADRACK KIPTOO", id: "26JO1ACS009" },
  ]

  const scrollerRef = useRef<HTMLDivElement | null>(null)
  const [isPaused, setIsPaused] = useState(false)

  useEffect(() => {
    let rafId: number | null = null
    const el = scrollerRef.current
    if (!el) return

    const step = () => {
      if (!el || isPaused) return
      // scroll a fraction of a pixel each frame
      el.scrollLeft += 0.5
      // reset when we've scrolled half (since content is duplicated)
      if (el.scrollLeft >= el.scrollWidth / 2) {
        el.scrollLeft = 0
      }
      rafId = requestAnimationFrame(step)
    }

    rafId = requestAnimationFrame(step)
    return () => {
      if (rafId) cancelAnimationFrame(rafId)
    }
  }, [isPaused])

  return (
    <footer className="border-t border-border bg-card/30">
      <div className="mx-auto w-full max-w-6xl px-4 py-12">
        <div className="flex items-center gap-4 mb-8">
          <span className="flex size-10 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-md">
            <ShieldCheck className="size-5" />
          </span>
          <div>
            <div className="text-lg font-bold text-foreground">
              Milestone X
            </div>
            <div className="text-sm text-muted-foreground">Transparent Escrow-Backed Funding</div>
          </div>
        </div>

        {/* Marquee */}
        <div className="relative my-8">
          <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-card/30 to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-card/30 to-transparent z-10 pointer-events-none" />
          
          <div
            ref={scrollerRef}
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            className="overflow-hidden w-full"
            style={{
              WebkitOverflowScrolling: "touch",
            }}
          >
            <div className="flex w-max gap-4 py-2 whitespace-nowrap">
              {teamMembers.concat(teamMembers).map((member, idx) => (
                <div
                  key={`${member.id}-${idx}`}
                  className="inline-flex flex-col gap-1 rounded-lg border border-border bg-card px-4 py-3 text-sm text-foreground shadow-sm hover:border-primary/30 transition-all duration-200"
                  style={{ minWidth: 240 }}
                >
                  <div className="font-semibold text-foreground">{member.name}</div>
                  <div className="text-xs text-muted-foreground font-mono">{member.id}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-border/40 text-center text-xs font-semibold text-muted-foreground/80">
          © {new Date().getFullYear()} Milestone X. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
