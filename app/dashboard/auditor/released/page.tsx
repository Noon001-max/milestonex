import { redirect } from "next/navigation"
import { CheckCircle2, DollarSign, TrendingUp, BarChart3, Clock3, BriefcaseBusiness, Sparkles, ArrowRight } from "lucide-react"
import { getSession } from "@/lib/session"
import { getReleasedFundsHistory } from "@/app/actions/projects"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { formatCurrency } from "@/lib/roles"

export const dynamic = "force-dynamic"

export default async function ReleasedFundsPage() {
  const user = await getSession()
  if (!user) return redirect("/sign-in")
  if (user.role !== "auditor") return redirect("/dashboard")

  const releases = await getReleasedFundsHistory()

  const totalReleased = releases.reduce((sum, r) => sum + r.amount, 0)
  const averageRelease = releases.length > 0 ? Math.round(totalReleased / releases.length) : 0
  const latestRelease = releases[0]
  const projectTotals = releases.reduce<Record<string, { count: number; amount: number }>>((acc, release) => {
    const key = release.projectTitle || "Unknown project"
    if (!acc[key]) {
      acc[key] = { count: 0, amount: 0 }
    }
    acc[key].count += 1
    acc[key].amount += release.amount
    return acc
  }, {})
  const topProjects = Object.entries(projectTotals)
    .map(([projectTitle, value]) => ({ projectTitle, ...value }))
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 3)

  return (
    <div className="flex min-h-svh flex-col bg-background">
      <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:py-12">
        <div className="mb-8 overflow-hidden rounded-[2rem] border border-border/70 bg-card shadow-sm">
          <div className="grid gap-0 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="p-6 sm:p-8">
              <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                <Sparkles className="size-3.5" />
                Already released funds
              </div>
              <h1 className="mt-3 text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
                Released funds overview
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base">
                A historical record of funds already released from escrow, with totals, recent activity, and project-level release concentration.
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <Button asChild className="rounded-xl">
                  <a href="/dashboard/release-funds">
                    Review release queue
                    <ArrowRight className="ml-2 size-4" />
                  </a>
                </Button>
              </div>
            </div>

            <div className="grid gap-3 border-t border-border/70 bg-secondary/20 p-6 sm:p-8 lg:border-l lg:border-t-0">
              <Card className="rounded-2xl border border-border/70 bg-background/80 p-4 shadow-sm">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">Total released</p>
                    <p className="mt-2 text-2xl font-bold text-foreground">{formatCurrency(totalReleased)}</p>
                  </div>
                  <div className="rounded-2xl bg-emerald-500/10 p-3 text-emerald-600 dark:text-emerald-400">
                    <DollarSign className="size-5" />
                  </div>
                </div>
              </Card>
              <Card className="rounded-2xl border border-border/70 bg-background/80 p-4 shadow-sm">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">Releases made</p>
                    <p className="mt-2 text-2xl font-bold text-foreground">{releases.length}</p>
                  </div>
                  <div className="rounded-2xl bg-blue-500/10 p-3 text-blue-600 dark:text-blue-400">
                    <CheckCircle2 className="size-5" />
                  </div>
                </div>
              </Card>
              <Card className="rounded-2xl border border-border/70 bg-background/80 p-4 shadow-sm">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">Average release</p>
                    <p className="mt-2 text-2xl font-bold text-foreground">{formatCurrency(averageRelease)}</p>
                  </div>
                  <div className="rounded-2xl bg-purple-500/10 p-3 text-purple-600 dark:text-purple-400">
                    <BarChart3 className="size-5" />
                  </div>
                </div>
              </Card>
              <Card className="rounded-2xl border border-border/70 bg-background/80 p-4 shadow-sm">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">Latest release</p>
                    <p className="mt-2 text-2xl font-bold text-foreground">{latestRelease ? formatCurrency(latestRelease.amount) : "Ksh 0"}</p>
                  </div>
                  <div className="rounded-2xl bg-amber-500/10 p-3 text-amber-600 dark:text-amber-400">
                    <Clock3 className="size-5" />
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>

        {releases.length > 0 && (
          <div className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {topProjects.map((project) => (
              <Card key={project.projectTitle} className="rounded-[1.5rem] border border-border/70 bg-card p-5 shadow-sm">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">Top released project</p>
                    <p className="mt-2 text-lg font-semibold text-foreground">{project.projectTitle}</p>
                  </div>
                  <div className="rounded-2xl bg-primary/10 p-3 text-primary">
                    <BriefcaseBusiness className="size-5" />
                  </div>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-3">
                  <div className="rounded-2xl bg-secondary/30 p-3">
                    <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground">Releases</p>
                    <p className="mt-1 text-xl font-semibold text-foreground">{project.count}</p>
                  </div>
                  <div className="rounded-2xl bg-secondary/30 p-3">
                    <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground">Amount</p>
                    <p className="mt-1 text-xl font-semibold text-foreground">{formatCurrency(project.amount)}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Release History */}
        {releases.length > 0 ? (
          <div>
            <div className="mb-4 flex items-end justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold text-foreground">Release history</h2>
                <p className="mt-1 text-sm text-muted-foreground">Every completed transfer from escrow to project proposers.</p>
              </div>
            </div>
            <div className="grid gap-4">
              {releases.map((r) => (
                <Card key={r.id} className="rounded-[1.5rem] border border-border/70 p-6 shadow-sm transition-shadow hover:shadow-md">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-lg font-semibold text-foreground">
                          {r.projectTitle}
                        </h3>
                        <Badge variant="secondary">
                          {r.milestoneTitle}
                        </Badge>
                      </div>
                      {r.note && (
                        <p className="text-sm text-muted-foreground mt-2">
                          {r.note}
                        </p>
                      )}
                    </div>

                    <div className="flex-shrink-0 sm:text-right">
                      <p className="text-xs text-muted-foreground uppercase tracking-wider">Amount released</p>
                      <p className="text-2xl font-bold text-emerald-700 dark:text-emerald-300 mt-1">
                        {formatCurrency(r.amount)}
                      </p>
                      <p className="text-xs text-muted-foreground mt-2">
                        {new Date(r.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-border">
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="size-4 text-emerald-600 dark:text-emerald-400" />
                      <span className="text-muted-foreground">Successfully released to project proposer</span>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        ) : (
          <Card className="rounded-[1.5rem] p-12 text-center">
            <CheckCircle2 className="size-12 text-primary mx-auto mb-4" />
            <p className="text-lg font-medium text-foreground mb-2">
              No releases yet
            </p>
            <p className="text-muted-foreground">
              Funds released from escrow will appear here
            </p>
          </Card>
        )}
      </main>
    </div>
  )
}

