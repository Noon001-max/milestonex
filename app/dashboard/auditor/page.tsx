import Link from "next/link"
import { CheckCircle2, DollarSign, Lock, TrendingUp, FileText, AlertCircle } from "lucide-react"
import { getSession } from "@/lib/session"
import { redirect } from "next/navigation"
import { getMyProjects } from "@/app/actions/projects"
import { getApprovedMilestones } from "@/app/actions/projects"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
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
        <div className="mb-8">
          <h1 className="text-4xl font-bold tracking-tight text-foreground">
            Auditor dashboard
          </h1>
          <p className="mt-2 text-muted-foreground">
            Review financial records and release approved milestone funds
          </p>
        </div>

        {/* Action Cards */}
        <div className="mb-8 grid gap-4 sm:grid-cols-4">
          <Link href="/dashboard/release-funds">
            <Card className="p-6 border-2 border-primary/30 hover:border-primary hover:bg-primary/5 transition-all cursor-pointer group">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Ready to release</p>
                  <p className="mt-2 text-3xl font-bold text-foreground">{approvedMilestones.length}</p>
                  <p className="mt-1 text-xs text-primary font-medium">Milestones approved</p>
                </div>
                <div className="rounded-lg bg-primary/10 p-2 group-hover:bg-primary/20 transition">
                  <AlertCircle className="size-5 text-primary" />
                </div>
              </div>
            </Card>
          </Link>

          <Card className="p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total in escrow</p>
                <p className="mt-2 text-3xl font-bold text-foreground">{formatCurrency(totalEscrow)}</p>
                <p className="mt-1 text-xs text-muted-foreground">Secured funds</p>
              </div>
              <div className="rounded-lg bg-blue-100 dark:bg-blue-900/30 p-2">
                <Lock className="size-5 text-blue-700 dark:text-blue-400" />
              </div>
            </div>
          </Card>

          <Card className="p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total released</p>
                <p className="mt-2 text-3xl font-bold text-foreground">{formatCurrency(totalReleased)}</p>
                <p className="mt-1 text-xs text-muted-foreground">To project owners</p>
              </div>
              <div className="rounded-lg bg-green-100 dark:bg-green-900/30 p-2">
                <CheckCircle2 className="size-5 text-green-700 dark:text-green-400" />
              </div>
            </div>
          </Card>

          <Card className="p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active projects</p>
                <p className="mt-2 text-3xl font-bold text-foreground">{activeProjects}</p>
                <p className="mt-1 text-xs text-muted-foreground">{fundingProjects} fundraising</p>
              </div>
              <div className="rounded-lg bg-purple-100 dark:bg-purple-900/30 p-2">
                <TrendingUp className="size-5 text-purple-700 dark:text-purple-400" />
              </div>
            </div>
          </Card>
        </div>

        {/* Key Stats */}
        <div className="mb-8 grid gap-4 sm:grid-cols-2">
          <Card className="p-6 border-l-4 border-l-amber-500/50">
            <h3 className="font-semibold text-foreground">Financial overview</h3>
            <div className="mt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Total funded:</span>
                <span className="font-medium text-foreground">
                  {formatCurrency(projects.reduce((sum, p) => sum + p.fundedAmount, 0))}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">In escrow:</span>
                <span className="font-medium text-primary">{formatCurrency(totalEscrow)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Released:</span>
                <span className="font-medium text-foreground">{formatCurrency(totalReleased)}</span>
              </div>
            </div>
          </Card>

          <Card className="p-6 border-l-4 border-l-emerald-500/50">
            <h3 className="font-semibold text-foreground">Projects summary</h3>
            <div className="mt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Total projects:</span>
                <span className="font-medium text-foreground">{projects.length}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Funding:</span>
                <span className="font-medium text-foreground">{fundingProjects}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Active:</span>
                <span className="font-medium text-foreground">{activeProjects}</span>
              </div>
            </div>
          </Card>
        </div>

        {/* Projects Grid */}
        {projects.length > 0 ? (
          <div>
            <h2 className="text-lg font-semibold text-foreground mb-4">
              Projects under audit
            </h2>
            <div className="grid gap-4">
              {projects.map((p) => (
                <Card key={p.id} className="p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <a
                        href={`/projects/${p.id}`}
                        className="text-lg font-semibold text-foreground hover:text-primary transition"
                      >
                        {p.title}
                      </a>
                      <p className="mt-1 text-sm text-muted-foreground line-clamp-1">
                        Financial status tracking
                      </p>
                    </div>
                    <StatusBadge status={p.status} />
                  </div>
                  <div className="mt-4 grid gap-3 sm:grid-cols-4 text-sm">
                    <div className="rounded-lg bg-muted p-3">
                      <span className="text-xs text-muted-foreground block">Raised</span>
                      <span className="text-lg font-semibold text-foreground">
                        {formatCurrency(p.fundedAmount)}
                      </span>
                    </div>
                    <div className="rounded-lg bg-blue-50 dark:bg-blue-950/30 p-3">
                      <span className="text-xs text-muted-foreground block">In escrow</span>
                      <span className="text-lg font-semibold text-blue-700 dark:text-blue-300">
                        {formatCurrency(p.escrowBalance)}
                      </span>
                    </div>
                    <div className="rounded-lg bg-green-50 dark:bg-green-950/30 p-3">
                      <span className="text-xs text-muted-foreground block">Released</span>
                      <span className="text-lg font-semibold text-green-700 dark:text-green-300">
                        {formatCurrency(p.releasedAmount)}
                      </span>
                    </div>
                    <div className="rounded-lg bg-muted p-3">
                      <span className="text-xs text-muted-foreground block">Goal</span>
                      <span className="text-lg font-semibold text-foreground">
                        {formatCurrency(p.fundingGoal)}
                      </span>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        ) : (
          <Card className="p-12 text-center">
            <FileText className="size-12 text-primary mx-auto mb-4" />
            <p className="text-lg font-medium text-foreground mb-2">
              No projects to audit
            </p>
            <p className="text-muted-foreground">
              Projects will appear here once they start funding
            </p>
          </Card>
        )}
      </main>
    </div>
  )
}
