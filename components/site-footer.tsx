"use client"

import { useState } from "react"
import { ShieldCheck } from "lucide-react"

export function SiteFooter({ isLoggedIn = false }: { isLoggedIn?: boolean }) {
  const teamMembers = [
    { name: "PRUDENCE ODHIAMBO", id: "25S01ACPS003" },
    { name: "SALLY MARO", id: "24S01ACPS002" },
    { name: "IMAI MICKEN AKISA", id: "25M01ABA011" },
    { name: "DANIELLA WANGARI", id: "26J01AXRM007" },
    { name: "SHADRACK KIPTOO", id: "26JO1ACS009" },
  ]

  const [isPaused, setIsPaused] = useState(false)

  return (
    <footer className="bg-gradient-to-b from-background via-background to-muted/20 shadow-[0_-8px_30px_rgba(0,0,0,0.04)]">
      <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-5 lg:grid-cols-[1.15fr_0.85fr]">
          <section className="rounded-3xl bg-card p-5 shadow-sm sm:p-6">
            <div className="flex items-center gap-3">
              <span className="flex size-11 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/20">
                <ShieldCheck className="size-5.5" />
              </span>
              <div>
                <div className="text-lg font-bold tracking-tight text-foreground">Milestone X</div>
                <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
                  Accountable funding platform
                </p>
              </div>
            </div>

            <p className="mt-4 max-w-xl text-sm leading-7 text-muted-foreground">
              Trusted escrow funding, transparent milestone accountability, and a platform built to turn community trust into measurable impact.
            </p>

            <div className="mt-5 flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-2 rounded-full bg-primary/5 px-4 py-2 text-sm font-medium text-primary">
                <span className="h-2.5 w-2.5 rounded-full bg-primary" />
                Premium funding clarity
              </span>
              <span className="inline-flex items-center gap-2 rounded-full bg-background px-4 py-2 text-sm font-medium text-foreground shadow-sm">
                Milestone tracking
              </span>
              <span className="inline-flex items-center gap-2 rounded-full bg-background px-4 py-2 text-sm font-medium text-foreground shadow-sm">
                Escrow oversight
              </span>
            </div>
          </section>

          <section className="rounded-3xl bg-card p-5 shadow-sm sm:p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">Navigate</p>
            <div className="mt-3 grid gap-3 text-sm text-muted-foreground sm:grid-cols-2">
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

              <a href="/privacy" className="transition-colors duration-200 hover:text-primary">Privacy Policy</a>
              <a href="/cookies" className="transition-colors duration-200 hover:text-primary">Cookie Policy</a>
              <a href="/terms" className="transition-colors duration-200 hover:text-primary">Terms of Service</a>
              <a href="/support" className="transition-colors duration-200 hover:text-primary">Support</a>
            </div>
          </section>
        </div>

        <section className="mt-5 rounded-3xl bg-card p-4 shadow-sm sm:p-5">
          <div className="mb-4 flex items-end justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">Team Members</p>
            </div>
          </div>

          <div
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            onFocusCapture={() => setIsPaused(true)}
            onBlurCapture={() => setIsPaused(false)}
            tabIndex={0}
            className="overflow-hidden rounded-[1.75rem] bg-gradient-to-b from-background to-muted/20 px-3 py-3.5 outline-none shadow-inner"
            style={{ WebkitOverflowScrolling: "touch", maskImage: "linear-gradient(to right, transparent, black 6%, black 94%, transparent)" }}
          >
            <div
              className="flex w-max gap-3"
              style={{
                animation: "team-marquee 28s linear infinite",
                animationPlayState: isPaused ? "paused" : "running",
              }}
            >
              {teamMembers.concat(teamMembers).map((member, idx) => {
                const initials = member.name
                  .split(" ")
                  .slice(0, 2)
                  .map((part) => part[0])
                  .join("")

                return (
                  <div
                    key={`${member.id}-${idx}`}
                    className="snap-start flex-shrink-0 overflow-hidden rounded-2xl bg-card px-4 py-4 text-foreground shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
                    style={{ minWidth: 240 }}
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex size-11 items-center justify-center rounded-2xl bg-primary/10 text-sm font-bold text-primary">
                        {initials}
                      </div>
                      <div className="min-w-0">
                        <div className="truncate text-sm font-semibold tracking-tight text-foreground">
                          {member.name}
                        </div>
                        <div className="mt-1 text-xs font-mono text-muted-foreground">{member.id}</div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        <div className="mt-5 flex flex-col gap-3 pt-4 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Milestone X. All rights reserved.</p>
          <p className="max-w-2xl sm:text-right">
            Designed for communities that need stronger accountability, safer funding, and more meaningful impact.
          </p>
        </div>
      </div>
      <style jsx>{`
        @keyframes team-marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
      `}</style>
    </footer>
  )
}
