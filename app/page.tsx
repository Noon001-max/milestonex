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
    <div className="flex min-h-svh flex-col bg-background selection:bg-primary/20">
      <SiteHeader user={user} />

      {/* Hero */}
      <section className="relative overflow-hidden bg-background py-24 lg:py-32">
        <div className="absolute inset-x-0 top-0 h-32 bg-primary/5" />
        <div className="relative z-10 mx-auto max-w-6xl px-4">
          <div className="grid gap-12 items-center md:grid-cols-[1.15fr_0.85fr]">
            <div className="space-y-6 animate-fade-in-up">
              <div className="inline-flex items-center gap-2 rounded-xl border border-primary/20 bg-primary/10 px-4 py-2 text-sm font-semibold text-primary">
                <ShieldCheck className="size-4 text-primary" />
                Escrow-backed milestone funding
              </div>
              <div className="space-y-5">
                <h1 className="text-5xl font-heading font-extrabold tracking-tight text-foreground sm:text-6xl lg:text-7xl leading-[1.02]">
                  A premium funding platform for <span className="text-primary">trusted community projects</span>
                </h1>
                <p className="max-w-2xl text-lg leading-relaxed font-subheading text-muted-foreground sm:text-xl">
                  Build trust with escrow-secured donations, milestone verification, and transparent fund release for every local initiative.
                </p>
              </div>
              <div className="flex flex-wrap gap-4">
                <a
                  href="/projects"
                  className="inline-flex items-center justify-center rounded-xl bg-primary px-8 py-4 text-sm font-semibold text-primary-foreground transition-colors duration-200 hover:bg-primary/90"
                >
                  Browse Projects
                  <ArrowRight className="size-4 ml-2 transition-transform duration-200" />
                </a>
                <a
                  href="/sign-up"
                  className="inline-flex items-center justify-center rounded-xl border border-primary/20 bg-background px-8 py-4 text-sm font-semibold text-primary transition-colors duration-200 hover:border-primary/40 hover:bg-primary/10"
                >
                  Start a Project
                </a>
              </div>
              <div className="grid gap-3 sm:grid-cols-2 text-sm font-semibold uppercase tracking-[0.24em] text-muted-foreground">
                <div className="inline-flex items-center gap-2 rounded-2xl border border-border/70 bg-card/80 px-4 py-3">
                  <span className="inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
                  Verified Escrow releases
                </div>
                <div className="inline-flex items-center gap-2 rounded-2xl border border-border/70 bg-card/80 px-4 py-3">
                  <span className="inline-flex h-2.5 w-2.5 rounded-full bg-primary" />
                  Secure project vetting
                </div>
              </div>
            </div>

            <div className="relative animate-fade-in" style={{ animationDelay: "200ms" }}>
              <div className="absolute -right-8 -top-8 hidden h-[calc(100%-1rem)] w-24 rounded-[2rem] bg-primary/5 md:block" />
              <div className="relative overflow-hidden rounded-[2rem] border border-border bg-card p-1 shadow-sm">
                <div className="relative overflow-hidden rounded-[1.75rem] bg-muted h-[26rem] sm:h-[30rem] lg:h-[34rem]">
                  <Image
                    src="/hero-community.png"
                    alt="A community collaborating on a local development project"
                    fill
                    priority
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover transition-transform duration-700 hover:scale-105"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-background py-16">
        <div className="mx-auto max-w-6xl px-4">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <Card className="rounded-[2rem] border border-primary/10 bg-primary/5 p-8 shadow-sm animate-fade-in-up">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary/80">
                Active Projects
              </p>
              <p className="mt-4 text-4xl font-extrabold tracking-tight text-foreground">
                {stats.totalProjects}
              </p>
              <p className="mt-3 text-sm text-muted-foreground">
                Active initiatives currently being supported by the community.
              </p>
            </Card>

            <Card className="rounded-[2rem] border border-emerald-200 bg-emerald-50 p-8 shadow-sm animate-fade-in-up">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-emerald-700">
                Total Raised
              </p>
              <p className="mt-4 text-4xl font-extrabold tracking-tight text-foreground">
                {formatCurrency(stats.totalRaised)}
              </p>
              <p className="mt-3 text-sm text-muted-foreground">
                Donations and investments secured for verified community work.
              </p>
            </Card>

            <Card className="rounded-[2rem] border border-slate-200 bg-slate-50 p-8 shadow-sm animate-fade-in-up">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-700">
                Secured in Escrow
              </p>
              <p className="mt-4 text-4xl font-extrabold tracking-tight text-primary">
                {formatCurrency(stats.totalEscrow)}
              </p>
              <p className="mt-3 text-sm text-muted-foreground">
                Funds currently held safely until milestone approval.
              </p>
            </Card>

            <Card className="rounded-[2rem] border border-violet-200 bg-violet-50 p-8 shadow-sm animate-fade-in-up">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-violet-700">
                Verified Milestones
              </p>
              <p className="mt-4 text-4xl font-extrabold tracking-tight text-foreground">
                {stats.verifiedMilestones} <span className="text-lg font-medium text-muted-foreground">/ {stats.totalMilestones}</span>
              </p>
              <p className="mt-3 text-sm text-muted-foreground">
                Completed milestones passed through independent review.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Featured Projects */}
      <section className="mx-auto w-full max-w-6xl px-4 py-20 lg:py-28 relative">
        <div className="mb-12 flex flex-col md:flex-row md:items-end md:justify-between gap-4 animate-fade-in-up">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Featured Projects
            </h2>
            <p className="mt-2 text-lg text-muted-foreground">
              Transparent, high-impact funding for real local developments.
            </p>
          </div>
          <a
            href="/projects"
            className="inline-flex items-center justify-center rounded-xl border border-primary/20 bg-primary/10 px-6 py-3 text-sm font-semibold text-primary transition-colors duration-200 hover:bg-primary/20 self-start md:self-auto"
          >
            Explore All Projects
            <ArrowRight className="size-4 ml-2 transition-transform duration-200" />
          </a>
        </div>

        {featured.length > 0 ? (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 stagger-children">
            {featured.map((p) => (
              <div key={p.id} className="animate-fade-in-up">
                <ProjectCard project={p} />
              </div>
            ))}
          </div>
        ) : (
          <Card className="flex flex-col items-center gap-4 p-16 text-center border-dashed animate-fade-in">
            <div className="rounded-full border border-border bg-background p-4 text-primary">
              <ShieldCheck className="size-8" />
            </div>
            <div>
              <p className="text-xl font-semibold text-foreground">No Live Projects Yet</p>
              <p className="mt-1 text-muted-foreground max-w-md">
                Be the pioneer. Submit your project proposal and start raising escrow-backed funds.
              </p>
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
        className="border-t border-border bg-background py-20 lg:py-28"
      >
        <div className="mx-auto max-w-6xl px-4">
          <div className="text-center max-w-3xl mx-auto mb-16 animate-fade-in-up">
            <h2 className="text-3xl font-heading font-bold tracking-tight text-foreground sm:text-4xl">
              Built for accountability at every milestone
            </h2>
            <p className="mt-3 text-lg font-subheading text-muted-foreground">
              Milestone X combines escrow security, community review, and milestone-based release so every project earns trust before funds move.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {steps.map((s, i) => (
              <Card key={s.title} className="group relative flex flex-col gap-5 rounded-[1.75rem] border border-border/80 bg-card p-8 transition-all duration-200 hover:-translate-y-1 animate-fade-in-up">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-3xl bg-primary/10 text-primary">
                    <s.icon className="size-6" />
                  </div>
                  <div className="rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-sm font-semibold text-primary">
                    Step {i + 1}
                  </div>
                </div>
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-foreground">{s.title}</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {s.body}
                  </p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto w-full max-w-6xl px-4 py-20">
        <div className="rounded-[2.5rem] border border-border bg-card p-8 sm:p-16 text-center text-foreground">
          <div className="flex flex-col items-center gap-6 animate-fade-in-up">
            <span className="rounded-full bg-background px-4 py-1.5 text-xs font-semibold uppercase tracking-wider border border-border">
              Secure & Transparent
            </span>
            <h2 className="text-balance text-3xl font-heading font-bold tracking-tight sm:text-4xl md:text-5xl max-w-2xl leading-none">
              Build trust into every single dollar
            </h2>
            <p className="max-w-xl text-lg font-subheading text-muted-foreground leading-relaxed">
              Whether you give, build, or verify, join a community funding ecosystem where transparency is the default.
            </p>
            <a
              href="/sign-up"
              className="inline-flex items-center justify-center rounded-full bg-primary px-8 py-4 text-sm font-bold text-primary-foreground hover:bg-primary/90 transition-colors duration-200 mt-2"
            >
              Create Your Account
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
