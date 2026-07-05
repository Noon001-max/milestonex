import Link from "next/link"
import { CheckCircle2, DollarSign, Lock, TrendingUp, FileText, AlertCircle } from "lucide-react"
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
        {/* Header */}
        <div className="mb-8 flex items-start justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold tracking-tight text-foreground">
              Auditor dashboard
            </h1>
            <p className="mt-2 text-muted-foreground max-w-xl">
              Review financial records, inspect project funding, and release approved milestone funds securely.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/dashboard/release-funds">
              <Button variant="default" className="shadow-sm">
                <DollarSign className="size-4 mr-2" />
                Release funds
              </Button>
            </Link>
            <Link href="/dashboard/notifications">
              <Button variant="outline">
                Notifications
              </Button>
            </Link>
          </div>
        </div>

        {/* Action Cards */}
        <div className="mb-8 grid gap-4 sm:grid-cols-4">
          <Link href="/dashboard/release-funds">
            <Card className="p-5 border border-border/80 border-l-4 border-l-primary/70 bg-card shadow-sm hover:shadow hover:-translate-y-0.5 transition-all duration-200 cursor-pointer group">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Ready to Release</p>
                  <p className="mt-2 text-2xl font-extrabold text-foreground">{approvedMilestones.length}</p>
                  <p className="mt-1.5 text-xs text-primary font-bold">Milestones approved</p>
                </div>
                <div className="rounded-xl bg-primary/10 p-2.5 group-hover:bg-primary/20 transition-colors duration-200">
                  <AlertCircle className="size-4.5 text-primary" />
                </div>
              </div>
            </Card>
          </Link>

          <Card className="p-5 border border-border/80 border-l-4 border-l-blue-500/70 bg-card shadow-sm hover:shadow hover:-translate-y-0.5 transition-all duration-200">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Total In Escrow</p>
                <p className="mt-2 text-2xl font-extrabold text-foreground">
                  {formatCurrency(totalEscrow)}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">Secured funds</p>
              </div>
              <div className="rounded-xl bg-blue-500/10 p-2.5">
                <Lock className="size-4.5 text-blue-500" />
              </div>
            </div>
          </Card>

          <Card className="p-5 border border-border/80 border-l-4 border-l-emerald-500/70 bg-card shadow-sm hover:shadow hover:-translate-y-0.5 transition-all duration-200">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Total Released</p>
                <p className="mt-2 text-2xl font-extrabold text-foreground">
                  {formatCurrency(totalReleased)}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">To project owners</p>
              </div>
              <div className="rounded-xl bg-emerald-500/10 p-2.5">
                <CheckCircle2 className="size-4.5 text-emerald-500" />
              </div>
            </div>
          </Card>

          <Card className="p-5 border border-border/80 border-l-4 border-l-purple-500/70 bg-card shadow-sm hover:shadow hover:-translate-y-0.5 transition-all duration-200">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Active Projects</p>
                <p className="mt-2 text-2xl font-extrabold text-foreground">{activeProjects}</p>
                <p className="mt-1 text-xs text-muted-foreground">{fundingProjects} fundraising</p>
              </div>
              <div className="rounded-xl bg-purple-500/10 p-2.5">
                <TrendingUp className="size-4.5 text-purple-500" />
              </div>
            </div>
          </Card>
        </div>

        {/* Key Stats */}
        <div className="mb-8 grid gap-4 sm:grid-cols-2">
          <Card className="p-5 border border-border/80 border-l-4 border-l-amber-500/70 bg-card shadow-sm">
            <h3 className="font-bold text-foreground text-sm uppercase tracking-wider">Financial Overview</h3>
            <div className="mt-4 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground font-semibold">Total funded:</span>
                <span className="font-bold text-foreground">
                  {formatCurrency(projects.reduce((sum, p) => sum + p.fundedAmount, 0))}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground font-semibold">In escrow:</span>
                <span className="font-bold text-primary">{formatCurrency(totalEscrow)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground font-semibold">Released:</span>
                <span className="font-bold text-foreground">{formatCurrency(totalReleased)}</span>
              </div>
            </div>
          </Card>

          <Card className="p-5 border border-border/80 border-l-4 border-l-emerald-500/70 bg-card shadow-sm">
            <h3 className="font-bold text-foreground text-sm uppercase tracking-wider">Projects Summary</h3>
            <div className="mt-4 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground font-semibold">Total projects:</span>
                <span className="font-bold text-foreground">{projects.length}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground font-semibold">Funding:</span>
                <span className="font-bold text-foreground">{fundingProjects}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground font-semibold">Active:</span>
                <span className="font-bold text-foreground">{activeProjects}</span>
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
