"use client"

import { useEffect, useRef, useState } from "react"
import { ShieldCheck } from "lucide-react"

export function SiteFooter({ isLoggedIn = false }: { isLoggedIn?: boolean }) {
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
    <footer className="border-t border-white/20 dark:border-white/10 glass shadow-lg">
      <div className="mx-auto w-full max-w-6xl px-4 py-12">
        <div className="grid gap-8 md:grid-cols-2 mb-8">
          {/* Branding */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <span className="flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm shadow-primary/20">
                <ShieldCheck className="size-5.5" />
              </span>
              <div className="text-lg font-bold tracking-tight text-foreground">
                Milestone X
              </div>
            </div>
            <p className="max-w-md text-sm leading-7 text-muted-foreground">
              Trusted escrow funding, transparent milestone accountability, and a platform built to turn community trust into measurable impact.
            </p>
            <div className="inline-flex w-fit items-center gap-2 rounded-xl border border-primary/20 bg-primary/5 px-4 py-2 text-sm text-primary">
              <span className="h-2.5 w-2.5 rounded-full bg-primary" />
              Premium funding clarity
            </div>
          </div>

          {/* Navigation */}
          <div className="flex flex-col gap-4">
            <p className="text-sm font-semibold text-foreground">Navigate</p>
            <div className="flex flex-col gap-3 text-sm text-muted-foreground">
              {!isLoggedIn ? (
                <>
                  <a href="/projects" className="transition-colors duration-200 hover:text-primary">Projects</a>
                  <a href="/transparency" className="transition-colors duration-200 hover:text-primary">Transparency</a>
                  <a href="/#how-it-works" className="transition-colors duration-200 hover:text-primary">How it works</a>
                  <a href="/sign-up" className="transition-colors duration-200 hover:text-primary">Start a project</a>
                </>
              ) : (
                <>
                  <a href="/dashboard" className="transition-colors duration-200 hover:text-primary">Dashboard</a>
                  <a href="/dashboard/projects" className="transition-colors duration-200 hover:text-primary">My projects</a>
                  <a href="/dashboard/settings" className="transition-colors duration-200 hover:text-primary">Account settings</a>
                  <a href="/dashboard/notifications" className="transition-colors duration-200 hover:text-primary">Notifications</a>
                </>
              )}

              {/* Important legal and support pages always shown for logged-in users */}
              <a href="/privacy" className="transition-colors duration-200 hover:text-primary">Privacy Policy</a>
              <a href="/cookies" className="transition-colors duration-200 hover:text-primary">Cookie Policy</a>
              <a href="/terms" className="transition-colors duration-200 hover:text-primary">Terms of Service</a>
              <a href="/support" className="transition-colors duration-200 hover:text-primary">Support</a>
            </div>
          </div>
        </div>

        {/* Marquee */}
        <div className="my-8">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">Team Members</p>
          <div
            ref={scrollerRef}
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            className="overflow-hidden w-full rounded-[1.5rem] border border-border bg-card px-3 py-4"
            style={{ WebkitOverflowScrolling: "touch" }}
          >
            <div className="flex w-max gap-3 overflow-x-auto scroll-smooth snap-x snap-mandatory">
              {teamMembers.concat(teamMembers).map((member, idx) => (
                <div
                  key={`${member.id}-${idx}`}
                  className="snap-start inline-flex flex-col gap-1 rounded-[1.5rem] bg-background/95 px-4 py-3 text-sm text-foreground shadow-sm ring-1 ring-border/50 transition-all duration-200 hover:-translate-y-0.5 flex-shrink-0"
                  style={{ minWidth: 220 }}
                >
                  <div className="font-semibold tracking-tight text-sm text-foreground">{member.name}</div>
                  <div className="text-xs text-muted-foreground font-mono">{member.id}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-border/50 pt-8 flex flex-col items-center justify-between gap-4 text-center text-sm text-muted-foreground sm:flex-row sm:text-left">
          <p>© {new Date().getFullYear()} Milestone X. All rights reserved.</p>
          <p className="max-w-md">Designed for communities that need stronger accountability, safer funding, and more meaningful impact.</p>
        </div>
      </div>
    </footer>
  )
}
