import Link from "next/link"
import { CheckCircle2, DollarSign, Lock, TrendingUp, FileText, BarChart3 } from "lucide-react"
import { getSession } from "@/lib/session"
import { redirect } from "next/navigation"
import { getMyProjects } from "@/app/actions/projects"
import { getApprovedMilestones } from "@/app/actions/projects"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { formatCurrency } from "@/lib/roles"
import { StatusBadge } from "@/components/status-badge"

export const dynamic = "force-dynamic"

export default async function AuditorDashboard() {
  const user = await getSession()
  if (!user) return redirect("/sign-in")
  if (user.role !== "auditor") return redirect("/dashboard")
  
  const [projects, approvedMilestones] = await Promise.all([
    getMyProjects(),
    getApprovedMilestones(),
  ])

  const totalEscrow = projects.reduce((sum, p) => sum + p.escrowBalance, 0)
  const totalReleased = projects.reduce((sum, p) => sum + p.releasedAmount, 0)
  const fundingProjects = projects.filter((p) => p.status === "funding").length
  const activeProjects = projects.filter((p) => p.status === "started").length

  return (
    <div className="flex min-h-svh flex-col bg-background">
      <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:py-12">
        <div className="mb-8 rounded-[2rem] border border-border/70 bg-card/80 p-6 shadow-sm backdrop-blur">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">Auditor</p>
              <h1 className="mt-2 text-4xl font-bold tracking-tight text-foreground">
                Auditor dashboard
              </h1>
              <p className="mt-2 max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base">
                Review financial records, inspect project funding, and monitor approved milestone releases.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-3 lg:min-w-[540px] lg:flex-1 lg:max-w-3xl">
              <Card className="rounded-2xl border border-border/70 bg-background/80 p-4 shadow-sm">
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">In escrow</p>
                <p className="mt-2 text-2xl font-bold text-foreground">{formatCurrency(totalEscrow)}</p>
              </Card>
              <Card className="rounded-2xl border border-border/70 bg-background/80 p-4 shadow-sm">
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">Released</p>
                <p className="mt-2 text-2xl font-bold text-foreground">{formatCurrency(totalReleased)}</p>
              </Card>
              <Card className="rounded-2xl border border-border/70 bg-background/80 p-4 shadow-sm">
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">Approved</p>
                <p className="mt-2 text-2xl font-bold text-foreground">{approvedMilestones.length}</p>
              </Card>
            </div>
          </div>
        </div>

        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Card className="rounded-[1.75rem] border border-border/70 bg-card p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">Active projects</p>
                <p className="mt-3 text-3xl font-bold tracking-tight text-foreground">{activeProjects}</p>
                <p className="mt-1 text-sm text-muted-foreground">Currently in delivery</p>
              </div>
              <div className="rounded-2xl bg-purple-500/10 p-3 text-purple-600 dark:text-purple-400">
                <TrendingUp className="size-5" />
              </div>
            </div>
          </Card>

          <Card className="rounded-[1.75rem] border border-border/70 bg-card p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">Fundraising projects</p>
                <p className="mt-3 text-3xl font-bold tracking-tight text-foreground">{fundingProjects}</p>
                <p className="mt-1 text-sm text-muted-foreground">Still collecting support</p>
              </div>
              <div className="rounded-2xl bg-blue-500/10 p-3 text-blue-600 dark:text-blue-400">
                <Lock className="size-5" />
              </div>
            </div>
          </Card>

          <Card className="rounded-[1.75rem] border border-border/70 bg-card p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">Total funded</p>
                <p className="mt-3 text-3xl font-bold tracking-tight text-foreground">
                  {formatCurrency(projects.reduce((sum, p) => sum + p.fundedAmount, 0))}
                </p>
                <p className="mt-1 text-sm text-muted-foreground">Across all monitored projects</p>
              </div>
              <div className="rounded-2xl bg-emerald-500/10 p-3 text-emerald-600 dark:text-emerald-400">
                <BarChart3 className="size-5" />
              </div>
            </div>
          </Card>
        </div>

        {/* Projects Grid */}
        {projects.length > 0 ? (
          <div>
            <h2 className="text-lg font-bold text-foreground mb-4">
              Projects under audit
            </h2>
            <div className="grid gap-4">
              {projects.map((p) => (
                <Card key={p.id} className="p-6 border border-border/80 bg-card hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <a
                        href={`/projects/${p.id}`}
                        className="text-lg font-bold text-foreground hover:text-primary transition-colors duration-200"
                      >
                        {p.title}
                      </a>
                      <p className="mt-1 text-xs text-muted-foreground font-semibold uppercase tracking-wider">
                        Financial Status Tracking
                      </p>
                    </div>
                    <StatusBadge status={p.status} />
                  </div>
                  <div className="mt-6 grid gap-3 sm:grid-cols-4 text-sm">
                    <div className="rounded-xl bg-secondary/50 p-4 border border-border/40">
                      <span className="text-xs text-muted-foreground font-semibold block uppercase tracking-wider">Raised</span>
                      <span className="text-lg font-extrabold text-foreground mt-1 block">
                        {formatCurrency(p.fundedAmount)}
                      </span>
                    </div>
                    <div className="rounded-xl bg-blue-500/5 p-4 border border-blue-500/20">
                      <span className="text-xs text-muted-foreground font-semibold block uppercase tracking-wider">In Escrow</span>
                      <span className="text-lg font-extrabold text-blue-600 dark:text-blue-400 mt-1 block">
                        {formatCurrency(p.escrowBalance)}
                      </span>
                    </div>
                    <div className="rounded-xl bg-emerald-500/5 p-4 border border-emerald-500/20">
                      <span className="text-xs text-muted-foreground font-semibold block uppercase tracking-wider">Released</span>
                      <span className="text-lg font-extrabold text-emerald-600 dark:text-emerald-400 mt-1 block">
                        {formatCurrency(p.releasedAmount)}
                      </span>
                    </div>
                    <div className="rounded-xl bg-secondary/50 p-4 border border-border/40">
                      <span className="text-xs text-muted-foreground font-semibold block uppercase tracking-wider">Goal</span>
                      <span className="text-lg font-extrabold text-foreground mt-1 block">
                        {formatCurrency(p.fundingGoal)}
                      </span>
                    </div>
                  </div>
                  <div className="mt-4 flex items-center justify-end gap-2">
                    <Link href={`/projects/${p.id}`}>
                      <Button variant="ghost" size="sm">View</Button>
                    </Link>
                    <Link href="/dashboard/release-funds">
                      <Button variant="secondary" size="sm" disabled={!(p.escrowBalance > 0)}>
                        <DollarSign className="size-4 mr-1" />
                        {p.escrowBalance > 0 ? "Release" : "No escrow"}
                      </Button>
                    </Link>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        ) : (
          <Card className="p-16 text-center border-dashed bg-card/40">
            <FileText className="size-12 text-primary/80 mx-auto mb-4" />
            <p className="text-xl font-semibold text-foreground mb-2">
              No projects to audit
            </p>
            <p className="text-muted-foreground text-sm max-w-sm mx-auto">
              Projects will appear here once they start raising or releasing escrow-backed funds.
            </p>
          </Card>
        )}
      </main>
    </div>
  )
}
