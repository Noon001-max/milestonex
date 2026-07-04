import { redirect } from "next/navigation"
import { getSession } from "@/lib/session"
import { getReleasedFundsHistory } from "@/app/actions/projects"
import { Card } from "@/components/ui/card"
import { formatCurrency } from "@/lib/roles"

export const dynamic = "force-dynamic"

export default async function ReleasedFundsReportPage() {
  const user = await getSession()
  if (!user) return redirect("/sign-in")
  if (user.role !== "auditor") return redirect("/dashboard")

  const releases = await getReleasedFundsHistory()
  const totalReleased = releases.reduce((sum, r) => sum + r.amount, 0)

  return (
    <div className="flex min-h-svh flex-col bg-background">
      <main className="mx-auto w-full max-w-6xl px-4 py-12">
        <div className="mb-6">
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">
            Released funds report
          </h1>
          <p className="mt-1 text-muted-foreground">
            View all funds released from escrow to projects.
          </p>
        </div>

        <Card className="p-6 mb-6 bg-primary/5">
          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <p className="text-sm text-muted-foreground">Total released</p>
              <p className="mt-2 text-2xl font-semibold text-foreground">{formatCurrency(totalReleased)}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Number of releases</p>
              <p className="mt-2 text-2xl font-semibold text-foreground">{releases.length}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Average release</p>
              <p className="mt-2 text-2xl font-semibold text-foreground">
                {releases.length > 0 ? formatCurrency(Math.round(totalReleased / releases.length)) : "Ksh 0"}
              </p>
            </div>
          </div>
        </Card>

        {releases.length > 0 ? (
          <div className="grid gap-4">
            {releases.map((r) => (
              <Card key={r.id} className="p-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-medium text-foreground">{r.projectTitle}</p>
                      <span className="text-xs bg-muted px-2 py-1 rounded text-muted-foreground">
                        {r.milestoneTitle}
                      </span>
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground">{r.note}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-semibold text-primary">{formatCurrency(r.amount)}</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {new Date(r.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="p-12 text-center">
            <p className="text-muted-foreground">No funds released yet.</p>
          </Card>
        )}
      </main>
    </div>
  )
}
