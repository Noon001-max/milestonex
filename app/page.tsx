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
import { Button } from "@/components/ui/button"
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
      <section className="relative overflow-hidden bg-slate-950/5">
        <div className="absolute inset-x-0 top-0 h-72 bg-gradient-to-b from-primary/20 to-transparent" />
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 py-16 md:grid-cols-2 md:py-24">
          <div className="flex flex-col gap-6">
            <span className="inline-flex w-fit items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
              <ShieldCheck className="size-4" />
              Escrow-backed, milestone-verified funding
            </span>
            <div className="space-y-5">
              <h1 className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
                Fund community projects you can actually trust
              </h1>
              <p className="max-w-2xl text-lg leading-8 text-muted-foreground sm:text-xl">
                Milestone X holds every contribution in escrow and releases it
                only when community verifiers confirm real progress.
                Accountability is built into every step.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <a
                href="/projects"
                className="inline-flex items-center justify-center rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-sm shadow-primary/20 transition hover:bg-primary/90"
              >
                Browse projects
                <ArrowRight className="size-4 ml-2" />
              </a>
              <a
                href="/sign-up"
                className="inline-flex items-center justify-center rounded-full border border-border bg-background px-6 py-3 text-sm font-medium hover:bg-muted"
              >
                Start a project
              </a>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <Card className="overflow-hidden rounded-3xl border border-border bg-background/90 p-5 shadow-sm shadow-slate-950/5">
                <p className="text-sm font-medium uppercase tracking-[0.22em] text-muted-foreground">
                  Secure escrow funding
                </p>
                <p className="mt-3 text-base leading-7 text-foreground">
                  Every contribution is held safely in escrow until milestones are approved.
                </p>
              </Card>
              <Card className="overflow-hidden rounded-3xl border border-border bg-background/90 p-5 shadow-sm shadow-slate-950/5">
                <p className="text-sm font-medium uppercase tracking-[0.22em] text-muted-foreground">
                  Verified progress
                </p>
                <p className="mt-3 text-base leading-7 text-foreground">
                  Community verifiers confirm milestones before funds are released.
                </p>
              </Card>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-[2rem] border border-border bg-gradient-to-br from-slate-950 via-slate-950/80 to-slate-950/90 p-3 shadow-xl shadow-slate-950/10">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(59,130,246,0.16),_transparent_40%)]" />
            <div className="relative overflow-hidden rounded-[1.75rem] bg-muted h-[24rem] sm:h-[28rem] lg:h-[32rem]">
              <Image
                src="/hero-community.png"
                alt="A community collaborating on a local development project"
                fill
                priority
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-border bg-card py-10">
        <div className="mx-auto grid max-w-6xl gap-4 px-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="p-6">
            <p className="text-sm font-medium uppercase tracking-[0.24em] text-muted-foreground">
              Active projects
            </p>
            <p className="mt-4 text-3xl font-semibold text-foreground">
              {stats.totalProjects}
            </p>
          </Card>
          <Card className="p-6">
            <p className="text-sm font-medium uppercase tracking-[0.24em] text-muted-foreground">
              Total raised
            </p>
            <p className="mt-4 text-3xl font-semibold text-foreground">
              {formatCurrency(stats.totalRaised)}
            </p>
          </Card>
          <Card className="p-6">
            <p className="text-sm font-medium uppercase tracking-[0.24em] text-muted-foreground">
              Secured in escrow
            </p>
            <p className="mt-4 text-3xl font-semibold text-foreground">
              {formatCurrency(stats.totalEscrow)}
            </p>
          </Card>
          <Card className="p-6">
            <p className="text-sm font-medium uppercase tracking-[0.24em] text-muted-foreground">
              Milestones verified
            </p>
            <p className="mt-4 text-3xl font-semibold text-foreground">
              {stats.verifiedMilestones}/{stats.totalMilestones}
            </p>
          </Card>
        </div>
      </section>

      {/* Featured projects */}
      <section className="mx-auto w-full max-w-6xl px-4 py-16">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight text-foreground">
              Featured projects
            </h2>
            <p className="mt-1 text-muted-foreground">
              Transparent funding for real community impact.
            </p>
          </div>
<a
             href="/projects"
             className="inline-flex items-center justify-center rounded-lg border border-border bg-background px-6 py-3 text-sm font-medium hover:bg-muted hidden md:inline-flex"
           >
             View all
             <ArrowRight className="size-4 ml-2" />
           </a>
        </div>

        {featured.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {featured.map((p) => (
              <ProjectCard key={p.id} project={p} />
            ))}
          </div>
        ) : (
          <Card className="flex flex-col items-center gap-3 p-12 text-center">
            <p className="text-muted-foreground">
              No live projects yet. Be the first to launch one.
            </p>
<a
             href="/sign-up"
             className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
           >
             Start a project
           </a>
          </Card>
        )}
      </section>

      {/* How it works */}
      <section
        id="how-it-works"
        className="border-t border-border bg-card py-16"
      >
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">
            How accountability works
          </h2>
          <p className="mt-1 max-w-2xl text-muted-foreground">
            Money moves in steps, not all at once. Each step is checked by the
            people the project serves.
          </p>
          <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {steps.map((s, i) => (
              <Card key={s.title} className="flex flex-col gap-3 p-6">
                <div className="flex items-center justify-between">
                  <span className="flex size-10 items-center justify-center rounded-md bg-primary/10 text-primary">
                    <s.icon className="size-5" />
                  </span>
                  <span className="text-sm font-medium text-muted-foreground">
                    0{i + 1}
                  </span>
                </div>
                <h3 className="font-semibold text-foreground">{s.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {s.body}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto w-full max-w-6xl px-4 py-16">
        <Card className="flex flex-col items-center gap-4 bg-primary p-10 text-center text-primary-foreground">
          <CheckCircle2 className="size-10" />
          <h2 className="text-balance text-2xl font-semibold tracking-tight md:text-3xl">
            Build trust into every dollar
          </h2>
          <p className="max-w-xl text-primary-foreground/80">
            Whether you give, build, or verify — join a funding platform where
            accountability is the default.
          </p>
<a
             href="/sign-up"
             className="inline-flex items-center justify-center rounded-lg border border-primary-foreground/20 bg-primary-foreground/10 px-6 py-3 text-sm font-medium text-primary-foreground hover:bg-primary-foreground/20"
           >
             Create your account
           </a>
        </Card>
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
