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
  Quote,
  Star,
} from "lucide-react"
import { Card } from "@/components/ui/card"
import { getSession } from "@/lib/session"
import { getPlatformStats, getPublicProjects } from "@/lib/queries"
import { formatCurrency } from "@/lib/roles"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { ProjectCard } from "@/components/project-card"
import { StatusBadge } from "@/components/status-badge"

export default async function HomePage() {
  const [user, stats, projects] = await Promise.all([
    getSession(),
    getPlatformStats(),
    getPublicProjects(),
  ])

  if (user) {
    redirect("/dashboard")
  }

  const activeProjects = projects.filter((project) => project.status !== "completed")
  const featured = activeProjects.slice(0, 3)
  const completedProjects = projects
    .filter((project) => project.status === "completed")
    .sort((a, b) => Number(b.releasedAmount || 0) - Number(a.releasedAmount || 0))
    .slice(0, 3)

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

  const reviews = [
    {
      name: "Amina K.",
      role: "Community donor",
      quote: "The milestone tracking made me feel confident every time funds were released. It is clear, fair, and transparent.",
    },
    {
      name: "Daniel R.",
      role: "Project owner",
      quote: "Launching my project here was simple. I could show progress, build trust, and keep supporters updated without friction.",
    },
    {
      name: "Sofia M.",
      role: "Verifier",
      quote: "The verification flow is strong and easy to follow. It gives the community a real voice in how funds are used.",
    },
  ]

  return (
    <div className="flex min-h-svh flex-col bg-background">
      <SiteHeader user={user} />

      {/* Hero */}
      <section className="bg-background py-20 lg:py-28">
        <div className="mx-auto grid max-w-6xl items-center gap-16 px-4 md:grid-cols-[1.1fr_0.9fr]">
          <div className="flex flex-col gap-8">
            <div className="space-y-4">
              <p className="text-sm font-semibold uppercase tracking-[0.35em] text-primary">Escrow-secured transparency</p>
            <h1 className="text-5xl font-bold tracking-tight text-foreground sm:text-6xl lg:text-7xl leading-tight">
              A Transparent Funding Management System for Community Development Projects
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl leading-relaxed">
              Support projects with escrow-backed safety, milestone-based release, and open progress tracking so every investment is visible, accountable, and meaningful.
            </p>
            </div>
            <div className="flex flex-wrap items-center gap-4">
              <a
                href="/projects"
                className="inline-flex items-center justify-center rounded-full bg-primary px-10 py-3 text-base font-semibold text-primary-foreground shadow-lg shadow-primary/20 hover:bg-primary/95 active:scale-[0.98] transition-all duration-200"
              >
                Browse Projects
              </a>
              <a
                href="/sign-up"
                className="inline-flex items-center justify-center rounded-full border border-primary/20 bg-background px-10 py-3 text-base font-semibold text-primary shadow-sm hover:border-primary hover:bg-primary/5 transition-all duration-200"
              >
                Launch a Project
              </a>
            </div>
            
          </div>

          <div className="relative">
            <div className="overflow-hidden rounded-[2rem] shadow-2xl ring-1 ring-primary/10 h-[28rem] sm:h-[32rem]">
              <Image
                src="/hero-community.png"
                alt="Community collaboration"
                fill
                priority
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover transition-transform duration-500 hover:scale-105"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-border bg-background py-14">
        <div className="mx-auto grid max-w-6xl gap-6 px-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-[1.75rem] border border-border/70 bg-card p-6 text-center shadow-sm shadow-primary/5">
            <p className="text-3xl font-bold text-foreground">{activeProjects.length}</p>
            <p className="mt-3 text-sm text-muted-foreground">Active projects live on the platform</p>
          </div>
          <div className="rounded-[1.75rem] border border-border/70 bg-card p-6 text-center shadow-sm shadow-primary/5">
            <p className="text-3xl font-bold text-foreground">{completedProjects.length}</p>
            <p className="mt-3 text-sm text-muted-foreground">Successfully completed projects</p>
          </div>
          <div className="rounded-[1.75rem] border border-border/70 bg-card p-6 text-center shadow-sm shadow-primary/5">
            <p className="text-3xl font-bold text-foreground">{formatCurrency(stats.totalRaised)}</p>
            <p className="mt-3 text-sm text-muted-foreground">Total capital raised for vetted work</p>
          </div>
          <div className="rounded-[1.75rem] border border-border/70 bg-card p-6 text-center shadow-sm shadow-primary/5">
            <p className="text-3xl font-bold text-primary">{formatCurrency(stats.totalEscrow)}</p>
            <p className="mt-3 text-sm text-muted-foreground">Held securely in escrow until milestones clear</p>
          </div>
        </div>
      </section>

      {/* Featured Projects */}
      <section className="mx-auto w-full max-w-6xl px-4 py-20 lg:py-28 relative">
        <div className="mb-12 flex flex-col gap-4 md:flex-row md:items-end md:justify-between animate-fade-in-up">
          <div className="max-w-xl">
            <span className="text-sm font-semibold uppercase tracking-[0.32em] text-primary">
              Spotlight
            </span>
            <h2 className="mt-4 text-4xl font-bold text-foreground">Featured projects making measurable change</h2>
            <p className="mt-3 text-lg text-muted-foreground">Browse a curated selection of vetted community initiatives with escrow-backed delivery.</p>
          </div>
          <a
            href="/projects"
            className="inline-flex items-center justify-center rounded-full border border-primary/20 bg-background px-7 py-3 text-sm font-semibold text-primary shadow-sm hover:border-primary hover:bg-primary/5 transition-all duration-200"
          >
            View All Projects
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

      {/* Completed Projects */}
      <section id="completed-projects" className="mx-auto w-full max-w-6xl px-4 py-20 lg:py-28">
        <div className="mb-12 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="max-w-xl">
            <span className="text-sm font-semibold uppercase tracking-[0.32em] text-primary">
              Completed projects
            </span>
            <h2 className="mt-4 text-4xl font-bold text-foreground">Successfully completed projects</h2>
            <p className="mt-3 text-lg text-muted-foreground">
              Real projects that finished delivery, cleared verification, and released funds successfully.
            </p>
          </div>
        </div>

        {completedProjects.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {completedProjects.map((project) => (
              <Card key={project.id} className="overflow-hidden rounded-[1.75rem] border border-border/70 bg-card p-0 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg">
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-muted">
                  <Image
                    src={project.imageUrl || "/hero-community.png"}
                    alt={project.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover transition-transform duration-300 hover:scale-105"
                  />
                  <div className="absolute inset-x-0 top-0 flex items-start justify-between p-3">
                    <StatusBadge status={project.status} />
                    <span className="rounded-full bg-background/90 px-2.5 py-1 text-[11px] font-semibold text-foreground shadow-sm backdrop-blur">
                      Completed
                    </span>
                  </div>
                </div>

                <div className="flex min-w-0 flex-col gap-4 p-5">
                  <div className="space-y-1.5">
                    <h3 className="text-lg font-semibold leading-tight text-foreground line-clamp-2">
                      {project.title}
                    </h3>
                    <p className="line-clamp-2 text-sm leading-6 text-muted-foreground">
                      {project.summary}
                    </p>
                  </div>

                  <div className="grid gap-3 rounded-2xl border border-border/60 bg-secondary/30 p-4 text-sm">
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-muted-foreground">Released funds</span>
                      <span className="font-semibold text-foreground">{formatCurrency(project.releasedAmount || 0)}</span>
                    </div>
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-muted-foreground">Escrow balance</span>
                      <span className="font-semibold text-foreground">{formatCurrency(project.escrowBalance || 0)}</span>
                    </div>
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-muted-foreground">Funding goal</span>
                      <span className="font-semibold text-foreground">{formatCurrency(project.fundingGoal || 0)}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs font-medium text-muted-foreground">
                    <span>Project finished successfully</span>
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-1 text-emerald-700">
                      <CheckCircle2 className="size-3.5" />
                      Verified completion
                    </span>
                  </div>

                  <a
                    href={`/projects/${project.id}`}
                    className="inline-flex items-center justify-center rounded-full border border-primary/20 bg-primary/5 px-4 py-2.5 text-sm font-semibold text-primary transition hover:bg-primary/10"
                  >
                    View project
                  </a>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="flex flex-col items-center gap-4 p-16 text-center">
            <CheckCircle2 className="size-12 text-primary" />
            <div>
              <p className="text-xl font-semibold text-foreground">No completed projects yet</p>
              <p className="mt-2 text-muted-foreground">Finished projects will appear here once they clear verification and release funds.</p>
            </div>
          </Card>
        )}
      </section>

      {/* How it works */}
      <section
        id="how-it-works"
        className="border-t border-border bg-background py-20"
      >
        <div className="mx-auto max-w-6xl px-4">
          <div className="text-left max-w-3xl mb-16">
            <h2 className="text-4xl font-bold text-foreground">
              How It Works
            </h2>
            <p className="mt-3 text-lg text-muted-foreground">
              Simple, transparent funding process built for accountability
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {steps.map((s, i) => (
              <div key={s.title} className="flex flex-col gap-4 rounded-[1.75rem] border border-primary/10 bg-primary/5 p-6 shadow-sm shadow-primary/10 transition-all duration-200 hover:-translate-y-1 hover:shadow-xl">
                <div className="flex items-center justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-3xl bg-primary text-primary-foreground shadow-sm shadow-primary/20">
                    <s.icon className="size-5" />
                  </div>
                  <span className="text-lg font-bold text-muted-foreground/70">{String(i + 1).padStart(2, '0')}</span>
                </div>
                <div className="space-y-3">
                  <h3 className="font-semibold text-foreground">{s.title}</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {s.body}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="mx-auto w-full max-w-6xl px-4 py-20 lg:py-28">
        <div className="mb-12 text-center">
          <span className="text-sm font-semibold uppercase tracking-[0.32em] text-primary">
            Testimonials
          </span>
          <h2 className="mt-4 text-4xl font-bold text-foreground">Trusted by donors, owners, and verifiers</h2>
          <p className="mx-auto mt-3 max-w-2xl text-lg text-muted-foreground">
            A few sample voices from people using Milestone X to fund and deliver community projects with confidence.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {reviews.map((review) => (
            <div key={review.name} className="rounded-[1.75rem] border border-border/70 bg-card p-6 shadow-sm shadow-primary/5">
              <div className="flex items-center gap-1 text-amber-500">
                {Array.from({ length: 5 }).map((_, index) => (
                  <Star key={index} className="size-4 fill-current" />
                ))}
              </div>
              <div className="mt-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <Quote className="size-5" />
              </div>
              <p className="mt-5 text-base leading-7 text-muted-foreground">“{review.quote}”</p>
              <div className="mt-6">
                <p className="font-semibold text-foreground">{review.name}</p>
                <p className="text-sm text-muted-foreground">{review.role}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto w-full max-w-6xl px-4 py-20">
        <div className="overflow-hidden rounded-[2rem] border border-primary/10 bg-primary/5 p-12 sm:p-16 text-center shadow-xl shadow-primary/10">
          <div className="flex flex-col items-center gap-8">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl max-w-3xl leading-tight text-foreground">
              Ready to fund projects that deliver results?
            </h2>
            <p className="max-w-2xl text-lg text-muted-foreground leading-relaxed">
              Start or support projects with escrow security, clear milestones, and trusted verification at every stage.
            </p>
            <a
              href="/sign-up"
              className="inline-flex items-center justify-center rounded-full bg-primary px-10 py-3 text-base font-semibold text-primary-foreground hover:bg-primary/95 active:scale-[0.98] transition-all duration-200 shadow-lg shadow-primary/20"
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
