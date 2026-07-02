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
      <section className="relative overflow-hidden bg-background py-20 lg:py-32">
        {/* Decorative flat background */}
        <div className="absolute inset-0 z-0 bg-background" />
        <div className="absolute inset-x-0 top-0 h-40 bg-primary/5 pointer-events-none" />
        
        <div className="relative z-10 mx-auto grid max-w-6xl items-center gap-12 px-4 md:grid-cols-2">
          <div className="flex flex-col gap-6 text-left animate-fade-in-up">
            <span className="inline-flex w-fit items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-sm font-semibold text-primary backdrop-blur-sm animate-pulse-subtle">
              <ShieldCheck className="size-4 text-primary" />
              Escrow-Backed, Milestone-Verified Funding
            </span>
            <div className="space-y-5">
              <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl lg:text-6xl leading-[1.1]">
                Empowering Communities with <span className="gradient-text">Absolute Trust</span>
              </h1>
              <p className="max-w-xl text-lg leading-relaxed text-muted-foreground sm:text-xl">
                Every contribution is secured in a smart escrow system. Funds are only unlocked when milestone progress is independently verified by the community.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <a
                href="/projects"
                className="group inline-flex items-center justify-center rounded-full bg-primary px-8 py-4 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/25 hover:shadow-primary/35 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300"
              >
                Browse Projects
                <ArrowRight className="size-4 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
              </a>
              <a
                href="/sign-up"
                className="inline-flex items-center justify-center rounded-full border border-border bg-background px-8 py-4 text-sm font-semibold hover:bg-muted hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300"
              >
                Start a Project
              </a>
            </div>
            <div className="flex flex-wrap items-center gap-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground/80 pt-4">
              <span className="flex items-center gap-1.5 rounded-full border border-border bg-card px-3.5 py-1.5 shadow-sm">
                <span className="size-2 rounded-full bg-emerald-500 animate-pulse-subtle" /> Secure Escrow
              </span>
              <span className="flex items-center gap-1.5 rounded-full border border-border bg-card px-3.5 py-1.5 shadow-sm">
                Verified Progress
              </span>
            </div>
          </div>

          <div className="relative lg:ml-4 animate-fade-in" style={{ animationDelay: "200ms" }}>
            {/* Solid accent border */}
            <div className="absolute -inset-1 rounded-[2rem] bg-primary/10" />
            <div className="relative overflow-hidden rounded-[2rem] border border-border bg-card p-2.5 shadow-sm noise-overlay">
              <div className="absolute inset-0 bg-card/10 pointer-events-none" />
              <div className="relative overflow-hidden rounded-[1.75rem] bg-muted h-[24rem] sm:h-[28rem] lg:h-[32rem]">
                <Image
                  src="/hero-community.png"
                  alt="A community collaborating on a local development project"
                  fill
                  priority
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover transition-transform duration-700 hover:scale-105"
                />
                <div className="absolute inset-0 bg-background/40 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="relative border-y border-border bg-card/60 py-12 overflow-hidden">
        <div className="absolute inset-0 bg-card/30" />
        <div className="relative z-10 mx-auto grid max-w-6xl gap-6 px-4 sm:grid-cols-2 lg:grid-cols-4 stagger-children">
          <Card className="relative overflow-hidden border border-border/80 bg-card p-6 shadow-sm hover-glow transition-all duration-150 animate-fade-in-up">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">
              Active Projects
            </p>
            <p className="mt-4 text-4xl font-extrabold text-foreground tracking-tight">
              {stats.totalProjects}
            </p>
            <div className="absolute right-4 bottom-4 size-12 rounded-full bg-primary/5 flex items-center justify-center text-primary/30 font-mono text-xs">ACT</div>
          </Card>
          
          <Card className="relative overflow-hidden border border-border/80 bg-card p-6 shadow-sm hover-glow transition-all duration-150 animate-fade-in-up">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">
              Total Raised
            </p>
            <p className="mt-4 text-4xl font-extrabold text-foreground tracking-tight">
              {formatCurrency(stats.totalRaised)}
            </p>
            <div className="absolute right-4 bottom-4 size-12 rounded-full bg-emerald-500/5 flex items-center justify-center text-emerald-500/30 font-mono text-xs">VAL</div>
          </Card>

          <Card className="relative overflow-hidden border border-border/80 bg-card p-6 shadow-sm hover-glow transition-all duration-150 animate-fade-in-up">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">
              Secured in Escrow
            </p>
            <p className="mt-4 text-4xl font-extrabold text-primary tracking-tight">
              {formatCurrency(stats.totalEscrow)}
            </p>
            <div className="absolute right-4 bottom-4 size-12 rounded-full bg-indigo-500/5 flex items-center justify-center text-indigo-500/30 font-mono text-xs">ESC</div>
          </Card>

          <Card className="relative overflow-hidden border border-border/80 bg-card p-6 shadow-sm hover-glow transition-all duration-150 animate-fade-in-up">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">
              Verified Milestones
            </p>
            <p className="mt-4 text-4xl font-extrabold text-foreground tracking-tight">
              {stats.verifiedMilestones} <span className="text-lg font-medium text-muted-foreground">/ {stats.totalMilestones}</span>
            </p>
            <div className="absolute right-4 bottom-4 size-12 rounded-full bg-violet-500/5 flex items-center justify-center text-violet-500/30 font-mono text-xs">VER</div>
          </Card>
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
            className="group inline-flex items-center justify-center rounded-full border border-border bg-background px-6 py-3 text-sm font-semibold hover:bg-muted shadow-sm hover:-translate-y-0.5 transition-all duration-300 self-start md:self-auto"
          >
            Explore All Projects
            <ArrowRight className="size-4 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
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
            <div className="rounded-full bg-primary/10 p-4 text-primary animate-float">
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
              className="inline-flex items-center justify-center rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition shadow-md"
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
              <Card key={s.title} className="group relative flex flex-col gap-4 p-6 border border-border/80 bg-card hover:border-primary/30 hover-glow transition-all duration-300 hover:-translate-y-1 animate-fade-in-up">
                <div className="flex items-center justify-between">
                  <span className="flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                    <s.icon className="size-6" />
                  </span>
                  <span className="text-3xl font-extrabold text-muted-foreground/20 font-mono group-hover:text-primary/20 transition-all duration-300">
                    0{i + 1}
                  </span>
                </div>
                <div className="space-y-2 mt-2">
                  <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors duration-300">{s.title}</h3>
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
        <div className="relative overflow-hidden rounded-[2.5rem] border border-border bg-card p-8 sm:p-16 text-center text-foreground shadow-md noise-overlay">
          <div className="absolute inset-0 bg-card/10 pointer-events-none" />
          <div className="relative z-10 flex flex-col items-center gap-6 animate-fade-in-up">
            <span className="rounded-full bg-card/20 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider border border-border">
              Secure & Transparent
            </span>
            <h2 className="text-balance text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl max-w-2xl leading-none">
              Build trust into every single dollar
            </h2>
            <p className="max-w-xl text-lg text-muted-foreground leading-relaxed">
              Whether you give, build, or verify, join a community funding ecosystem where transparency is the default.
            </p>
            <a
              href="/sign-up"
              className="inline-flex items-center justify-center rounded-full bg-primary px-8 py-4 text-sm font-bold text-primary-foreground hover:opacity-95 transition-all duration-200 mt-2"
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
