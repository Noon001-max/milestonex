import { redirect } from "next/navigation"
import { AlertCircle, CheckCircle2, DollarSign, TrendingUp } from "lucide-react"
import { getSession } from "@/lib/session"
import { getApprovedMilestones, releaseMilestoneFunds } from "@/app/actions/projects"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { formatCurrency } from "@/lib/roles"

export const dynamic = "force-dynamic"

export default async function ReleaseFundsPage() {
  const user = await getSession()
  if (!user) return redirect("/sign-in")
  if (user.role !== "auditor") return redirect("/dashboard")

  const milestones = await getApprovedMilestones()
  const totalToRelease = milestones.reduce((sum, m) => sum + m.amount, 0)
  const totalEscrow = milestones.reduce((sum, m) => sum + m.escrowBalance, 0)

  return (
    <div className="flex min-h-svh flex-col bg-background">
      <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold tracking-tight text-foreground">
            Release funds
          </h1>
          <p className="mt-2 text-muted-foreground">
            Review approved milestones and release secured funds to project proposers
          </p>
        </div>

        {/* Stats */}
        {milestones.length > 0 && (
          <div className="mb-8 grid gap-4 sm:grid-cols-3">
            <Card className="p-6 border-l-4 border-l-primary/50">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Ready to release</p>
                  <p className="mt-2 text-3xl font-bold text-foreground">{milestones.length}</p>
                  <p className="mt-1 text-xs text-muted-foreground">Approved milestones</p>
                </div>
                <div className="rounded-lg bg-primary/10 p-2">
                  <AlertCircle className="size-5 text-primary" />
                </div>
              </div>
            </Card>

            <Card className="p-6 border-l-4 border-l-emerald-500/50">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total to release</p>
                  <p className="mt-2 text-3xl font-bold text-foreground">
                    {formatCurrency(totalToRelease)}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">From escrow</p>
                </div>
                <div className="rounded-lg bg-emerald-100 dark:bg-emerald-900/30 p-2">
                  <DollarSign className="size-5 text-emerald-700 dark:text-emerald-400" />
                </div>
              </div>
            </Card>

            <Card className="p-6 border-l-4 border-l-blue-500/50">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total in escrow</p>
                  <p className="mt-2 text-3xl font-bold text-foreground">
                    {formatCurrency(totalEscrow)}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">Secured funds</p>
                </div>
                <div className="rounded-lg bg-blue-100 dark:bg-blue-900/30 p-2">
                  <TrendingUp className="size-5 text-blue-700 dark:text-blue-400" />
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Milestones List */}
        {milestones.length > 0 ? (
          <div>
            <h2 className="text-lg font-semibold text-foreground mb-4">
              Milestones pending release
            </h2>
            <div className="grid gap-4">
              {milestones.map((m) => (
                <Card key={m.id} className="p-6 hover:shadow-md transition-shadow">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-lg font-semibold text-foreground">
                          {m.title}
                        </h3>
                        <Badge className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300">
                          ✓ Approved
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        {m.description}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Project: <span className="font-medium text-foreground">{m.projectTitle}</span>
                      </p>
                    </div>

                    <div className="flex-shrink-0 sm:text-right">
                      <p className="text-xs text-muted-foreground uppercase tracking-wider">Amount</p>
                      <p className="text-2xl font-bold text-foreground mt-1">
                        {formatCurrency(m.amount)}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 grid gap-3 sm:grid-cols-2 text-sm">
                    <div className="rounded-lg bg-muted p-3">
                      <span className="text-xs text-muted-foreground block">Available in escrow</span>
                      <span className="text-lg font-semibold text-foreground">
                        {formatCurrency(m.escrowBalance)}
                      </span>
                    </div>
                    <div className="rounded-lg bg-blue-50 dark:bg-blue-950/30 p-3">
                      <span className="text-xs text-muted-foreground block">Status</span>
                      <span className="text-lg font-semibold text-blue-700 dark:text-blue-300">
                        Ready to release
                      </span>
                    </div>
                  </div>

                  <div className="mt-6">
                    <form action={releaseFundsAction}>
                      <input type="hidden" name="milestoneId" value={m.id} />
                      <button
                        type="submit"
                        className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition"
                      >
                        <CheckCircle2 className="size-4" />
                        Release funds to owner
                      </button>
                    </form>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        ) : (
          <Card className="p-12 text-center">
            <CheckCircle2 className="size-12 text-primary mx-auto mb-4" />
            <p className="text-lg font-medium text-foreground mb-2">
              All caught up!
            </p>
            <p className="text-muted-foreground">
              No approved milestones are pending release at the moment.
            </p>
          </Card>
        )}
      </main>
    </div>
  )
}

async function releaseFundsAction(formData: FormData) {
  "use server"
  const id = Number(formData.get("milestoneId"))
  await releaseMilestoneFunds(id)
}

