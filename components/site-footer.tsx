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
    <footer className="border-t border-border/60 bg-background">
      <div className="mx-auto max-w-6xl px-4 py-12">
        <div className="grid gap-10 md:grid-cols-[1.5fr_1fr_1fr]">
          <div>
            <div className="inline-flex items-center gap-3 rounded-2xl border border-border/80 bg-card px-3 py-2 text-sm font-semibold text-primary">
              <ShieldCheck className="size-5" />
              Milestone X
            </div>
            <p className="mt-4 max-w-sm text-sm leading-6 text-muted-foreground">
              Transparent escrow-backed funding for community projects, with milestone verification and open accountability.
            </p>
          </div>

          <div>
            <p className="text-sm font-semibold text-foreground mb-4">Explore</p>
            <div className="flex flex-col gap-3 text-sm text-muted-foreground">
              <a href="/projects" className="transition-colors duration-200 hover:text-foreground">
                Projects
              </a>
              <a href="/transparency" className="transition-colors duration-200 hover:text-foreground">
                Transparency
              </a>
              <a href="/#how-it-works" className="transition-colors duration-200 hover:text-foreground">
                How it works
              </a>
              <a href="/sign-up" className="transition-colors duration-200 hover:text-foreground">
                Start a project
              </a>
            </div>
          </div>

          <div>
            <p className="text-sm font-semibold text-foreground mb-4">Team</p>
            <div className="grid gap-3 text-sm text-muted-foreground">
              {teamMembers.map((member) => (
                <div key={member.id} className="rounded-2xl border border-border/80 bg-card px-4 py-3">
                  <div className="font-semibold text-foreground tracking-tight">{member.name}</div>
                  <div className="text-xs font-mono text-muted-foreground">{member.id}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-border/50 pt-6 text-center text-xs font-semibold text-muted-foreground/80">
          © {new Date().getFullYear()} Milestone X. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
