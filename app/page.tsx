import Link from "next/link"
import Image from "next/image"
import { redirect } from "next/navigation"
import {
  ShieldCheck,
  Lock,
  CheckCircle2,
  Users,
  FileSearch,
  Banknote,
  ArrowRight,
} from "lucide-react"
import { Card } from "@/components/ui/card"
import { getSession } from "@/lib/session"
import { getPlatformStats, getPublicProjects } from "@/lib/queries"
import { getUnreadNotificationsCount } from "@/app/actions/notifications"
import { formatCurrency } from "@/lib/roles"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { ProjectCard } from "@/components/project-card"

export default async function HomePage() {
  const [user, stats, projects] = await Promise.all([
    getSession(),
    getPlatformStats(),
    getPublicProjects(),
  ])

  if (user) {
    redirect("/dashboard")
  }

  const featured = projects.slice(0, 3)

  const steps = [
    {
      icon: FileSearch,
      title: "Projects are vetted",
      body: "Proposers submit projects with budgets and milestones. Administrators review and approve before they go live.",
    },
    {
      icon: Lock,
      title: "Funds held in escrow",
      body: "Every donation and investment is secured in an escrow account — never released until work is verified.",
    },
    {
      icon: Users,
      title: "Community verifies",
      body: "Independent community verifiers inspect progress on the ground and submit verification reports.",
    },
    {
      icon: Banknote,
      title: "Funds release per milestone",
      body: "Only approved milestones unlock their portion of funds. Failed milestones keep money secured.",
    },
  ]

  return (
    <div className="flex min-h-svh flex-col bg-background">
      <SiteHeader user={user} />

      {/* Hero */}
      <section className="bg-background py-16 lg:py-24">
        <div className="mx-auto grid max-w-6xl items-center gap-16 px-4 md:grid-cols-2">
          <div className="flex flex-col gap-8">
            <div className="space-y-2">
              <h1 className="text-5xl font-bold tracking-tight text-foreground sm:text-6xl lg:text-7xl leading-tight">
                Transparent funding for real communities
              </h1>
              <p className="text-lg text-muted-foreground max-w-lg leading-relaxed">
                Fund local projects with confidence. Every donation is secured in escrow and released only when progress is independently verified.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-4">
              <a
                href="/projects"
                className="inline-flex items-center justify-center rounded-lg bg-primary px-8 py-3 text-base font-semibold text-primary-foreground shadow-md hover:bg-primary/90 active:scale-95 transition-all duration-200"
              >
                Explore Projects
              </a>
              <a
                href="/sign-up"
                className="inline-flex items-center justify-center rounded-lg border border-border bg-background px-8 py-3 text-base font-semibold hover:bg-muted shadow-sm transition-all duration-200"
              >
                Start a Project
              </a>
            </div>
            <div className="flex items-center gap-3 pt-4">
              <ShieldCheck className="size-5 text-primary" />
              <span className="text-sm font-medium text-foreground">Escrow-backed, milestone-verified</span>
            </div>
          </div>

          <div className="relative">
            <div className="overflow-hidden rounded-2xl shadow-lg h-[28rem] sm:h-[32rem]">
              <Image
                src="/hero-community.png"
                alt="Community collaboration"
                fill
                priority
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover hover:scale-105 transition-transform duration-500"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-border bg-card py-12">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="text-center">
            <p className="text-3xl font-bold text-foreground">{stats.totalProjects}</p>
            <p className="mt-2 text-sm text-muted-foreground">Active Projects</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-foreground">{formatCurrency(stats.totalRaised)}</p>
            <p className="mt-2 text-sm text-muted-foreground">Total Raised</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-primary">{formatCurrency(stats.totalEscrow)}</p>
            <p className="mt-2 text-sm text-muted-foreground">Secured in Escrow</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-foreground">{stats.verifiedMilestones}/{stats.totalMilestones}</p>
            <p className="mt-2 text-sm text-muted-foreground">Verified Milestones</p>
          </div>
        </div>
      </section>

      {/* Featured Projects */}
      <section className="mx-auto w-full max-w-6xl px-4 py-20 lg:py-28 relative">
        <div className="mb-12 flex flex-col md:flex-row md:items-end md:justify-between gap-4 animate-fade-in-up">
          <div>
            <h2 className="text-4xl font-bold text-foreground">Featured Projects</h2>
            <p className="mt-3 text-lg text-muted-foreground">Discover high-impact funding opportunities</p>
          </div>
          <a
            href="/projects"
            className="inline-flex items-center justify-center rounded-lg border border-border bg-background px-6 py-3 text-sm font-semibold hover:bg-muted shadow-sm transition-all duration-200"
          >
            View All
          </a>
        </div>

        {featured.length > 0 ? (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {featured.map((p) => (
              <ProjectCard key={p.id} project={p} />
            ))}
          </div>
        ) : (
          <Card className="flex flex-col items-center gap-4 p-20 text-center">
            <ShieldCheck className="size-12 text-primary" />
            <div>
              <p className="text-xl font-semibold text-foreground">No Projects Live Yet</p>
              <p className="mt-2 text-muted-foreground">Be the first to launch a project</p>
            </div>
            <a
              href="/sign-up"
              className="inline-flex items-center justify-center rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-colors duration-200 hover:bg-primary/90"
            >
              Start a Project
            </a>
          </Card>
        )}
      </section>

      {/* How it works */}
      <section
        id="how-it-works"
        className="relative border-t border-border bg-card/40 py-20 lg:py-28 overflow-hidden"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,_rgba(79,70,229,0.03),_transparent_50%)]" />
        <div className="relative z-10 mx-auto max-w-6xl px-4">
          <div className="text-center max-w-3xl mx-auto mb-16 animate-fade-in-up">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              How accountability works
            </h2>
            <p className="mt-3 text-lg text-muted-foreground">
              Milestone X aligns incentives by releasing funds only as tasks are completed and verified by the people who benefit from them.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 stagger-children">
            {steps.map((s, i) => (
              <div key={s.title} className="flex flex-col gap-4 p-6 rounded-xl border border-border bg-card hover:border-primary/30 shadow-sm hover:shadow-md transition-all duration-200">
                <div className="flex items-start justify-between">
                  <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <s.icon className="size-5" />
                  </div>
                  <span className="text-xl font-bold text-muted-foreground/30">{String(i + 1).padStart(2, '0')}</span>
                </div>
                <div className="space-y-2 mt-2">
                  <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors duration-300">{s.title}</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {s.body}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto w-full max-w-6xl px-4 py-20">
        <div className="relative overflow-hidden rounded-[2.5rem] border border-border bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-950 p-8 sm:p-16 text-center text-primary-foreground shadow-2xl noise-overlay">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(99,102,241,0.15),_transparent_60%)] pointer-events-none" />
          {/* Animated gradient border accent */}
          <div className="absolute inset-0 rounded-[2.5rem] bg-gradient-to-r from-primary via-indigo-500 to-violet-500 opacity-[0.07] animate-gradient-shift pointer-events-none" />
          <div className="relative z-10 flex flex-col items-center gap-6 animate-fade-in-up">
            <span className="rounded-full bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider backdrop-blur-md border border-white/10">
              Secure & Transparent
            </span>
            <h2 className="text-balance text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl max-w-2xl leading-none">
              Build trust into every single dollar
            </h2>
            <p className="max-w-xl text-lg text-indigo-200/80 leading-relaxed">
              Whether you give, build, or verify, join a community funding ecosystem where transparency is the default.
            </p>
            <a
              href="/sign-up"
              className="inline-flex items-center justify-center rounded-full bg-white px-8 py-4 text-sm font-bold text-indigo-950 hover:bg-slate-100 hover:scale-105 active:scale-100 transition-all duration-300 shadow-xl shadow-black/35 mt-2"
            >
              Get Started
            </a>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  )
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1 text-center md:text-left">
      <span className="text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
        {value}
      </span>
      <span className="text-sm text-muted-foreground">{label}</span>
    </div>
  )
}
