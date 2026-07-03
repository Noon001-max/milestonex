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
    <footer className="border-t border-border/60 bg-card/95 px-4 py-14">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-10 lg:grid-cols-[1.6fr_1fr_1fr]">
          <div>
            <div className="inline-flex items-center gap-3 rounded-2xl border border-border/80 bg-primary/10 px-3 py-2 text-sm font-semibold text-primary">
              <ShieldCheck className="size-5" />
              Milestone X
            </div>
            <p className="mt-5 max-w-md text-sm leading-7 text-muted-foreground">
              Trusted escrow funding, transparent milestone accountability, and a platform built to turn community trust into measurable impact.
            </p>
            <div className="mt-6 inline-flex items-center gap-2 rounded-xl border border-primary/20 bg-primary/5 px-4 py-2 text-sm text-primary">
              <span className="h-2.5 w-2.5 rounded-full bg-primary" />
              Premium funding clarity
            </div>
          </div>

          <div>
            <p className="text-sm font-semibold text-foreground mb-4">Navigate</p>
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
                <div key={member.id} className="rounded-[1.5rem] border border-border/80 bg-background/80 px-4 py-4 shadow-sm shadow-slate-900/5">
                  <div className="font-semibold text-foreground tracking-tight">{member.name}</div>
                  <div className="text-xs font-mono text-muted-foreground">{member.id}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border/50 pt-6 text-center text-sm text-muted-foreground sm:flex-row sm:text-left">
          <p>© {new Date().getFullYear()} Milestone X. All rights reserved.</p>
          <p className="max-w-md">Designed for communities that need stronger accountability, safer funding, and more meaningful impact.</p>
        </div>
      </div>
    </footer>
  )
}
