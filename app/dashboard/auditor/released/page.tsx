import { redirect } from "next/navigation"
import { CheckCircle2, DollarSign, TrendingUp, BarChart3 } from "lucide-react"
import { getSession } from "@/lib/session"
import { getReleasedFundsHistory } from "@/app/actions/projects"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { formatCurrency } from "@/lib/roles"

export const dynamic = "force-dynamic"

export default async function ReleasedFundsPage() {
  const user = await getSession()
  if (!user) return redirect("/sign-in")
  if (user.role !== "auditor") return redirect("/dashboard")

  const releases = await getReleasedFundsHistory()

  const totalReleased = releases.reduce((sum, r) => sum + r.amount, 0)
  const averageRelease = releases.length > 0 ? Math.round(totalReleased / releases.length) : 0

  return (
    <div className="flex min-h-svh flex-col bg-background">
      <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold tracking-tight text-foreground">
            Released funds report
          </h1>
          <p className="mt-2 text-muted-foreground">
            Historical record of all funds released from escrow to project owners
          </p>
        </div>

        {/* Stats Cards */}
        {releases.length > 0 && (
          <div className="mb-8 grid gap-4 sm:grid-cols-4">
            <Card className="p-6 border-l-4 border-l-emerald-500/50">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total released</p>
                  <p className="mt-2 text-3xl font-bold text-foreground">
                    {formatCurrency(totalReleased)}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">All releases combined</p>
                </div>
                <div className="rounded-lg bg-emerald-100 dark:bg-emerald-900/30 p-2">
                  <DollarSign className="size-5 text-emerald-700 dark:text-emerald-400" />
                </div>
              </div>
            </Card>

            <Card className="p-6 border-l-4 border-l-blue-500/50">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Releases made</p>
                  <p className="mt-2 text-3xl font-bold text-foreground">
                    {releases.length}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">Milestones released</p>
                </div>
                <div className="rounded-lg bg-blue-100 dark:bg-blue-900/30 p-2">
                  <CheckCircle2 className="size-5 text-blue-700 dark:text-blue-400" />
                </div>
              </div>
            </Card>

            <Card className="p-6 border-l-4 border-l-purple-500/50">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Average release</p>
                  <p className="mt-2 text-3xl font-bold text-foreground">
                    {formatCurrency(averageRelease)}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">Per milestone</p>
                </div>
                <div className="rounded-lg bg-purple-100 dark:bg-purple-900/30 p-2">
                  <BarChart3 className="size-5 text-purple-700 dark:text-purple-400" />
                </div>
              </div>
            </Card>

            <Card className="p-6 border-l-4 border-l-amber-500/50">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Latest release</p>
                  <p className="mt-2 text-3xl font-bold text-foreground">
                    {releases[0] ? formatCurrency(releases[0].amount) : "Ksh 0"}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">Most recent</p>
                </div>
                <div className="rounded-lg bg-amber-100 dark:bg-amber-900/30 p-2">
                  <TrendingUp className="size-5 text-amber-700 dark:text-amber-400" />
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Release History */}
        {releases.length > 0 ? (
          <div>
            <h2 className="text-lg font-semibold text-foreground mb-4">
              Release history
            </h2>
            <div className="grid gap-4">
              {releases.map((r) => (
                <Card key={r.id} className="p-6 hover:shadow-md transition-shadow">
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
                      <span className="text-muted-foreground">Successfully released to project owner</span>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        ) : (
          <Card className="p-12 text-center">
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

