import { redirect } from "next/navigation"
import Link from "next/link"
import { CheckCircle2, DollarSign, Clock3, Sparkles, ArrowRight } from "lucide-react"
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
  const latestRelease = releases[0]

  return (
    <div className="flex min-h-svh flex-col bg-background">
      <main className="mx-auto w-full max-w-5xl px-4 py-8 sm:py-12">
        <div className="mb-8 overflow-hidden rounded-[2rem] border border-border/70 bg-card shadow-sm">
          <div className="p-6 sm:p-8">
              <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                <Sparkles className="size-3.5" />
                Already released funds
              </div>
              <h1 className="mt-3 text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
                Released funds report
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base">
                A simple record of completed releases from escrow, showing the total amount, the latest transfer, and the release history.
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  href="/dashboard/release-funds"
                  className="inline-flex h-8 items-center justify-center rounded-xl border border-border bg-background px-2.5 text-sm font-medium text-foreground transition-all hover:bg-muted hover:text-foreground"
                >
                  Review release queue
                  <ArrowRight className="ml-2 size-4" />
                </Link>
              </div>
            </div>
        </div>

        <div className="mb-8 grid gap-4 sm:grid-cols-3">
          <Card className="rounded-[1.5rem] border border-border/70 bg-card p-5 shadow-sm">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">Total released</p>
            <p className="mt-2 text-3xl font-bold text-foreground">{formatCurrency(totalReleased)}</p>
            <p className="mt-1 text-sm text-muted-foreground">All completed escrow transfers</p>
          </Card>
          <Card className="rounded-[1.5rem] border border-border/70 bg-card p-5 shadow-sm">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">Releases made</p>
            <p className="mt-2 text-3xl font-bold text-foreground">{releases.length}</p>
            <p className="mt-1 text-sm text-muted-foreground">Completed milestone payouts</p>
          </Card>
          <Card className="rounded-[1.5rem] border border-border/70 bg-card p-5 shadow-sm">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">Latest release</p>
            <p className="mt-2 text-3xl font-bold text-foreground">
              {latestRelease ? formatCurrency(latestRelease.amount) : "Ksh 0"}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">Most recent transfer amount</p>
          </Card>
        </div>

        {releases.length > 0 ? (
          <div>
            <div className="mb-4 flex items-end justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold text-foreground">Release history</h2>
                <p className="mt-1 text-sm text-muted-foreground">Chronological log of completed payouts.</p>
              </div>
            </div>
            <div className="grid gap-4">
              {releases.map((r) => (
                <Card key={r.id} className="rounded-[1.5rem] border border-border/70 p-5 shadow-sm">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-lg font-semibold text-foreground">{r.projectTitle}</h3>
                        <Badge variant="secondary">{r.milestoneTitle}</Badge>
                      </div>
                      <p className="mt-2 text-sm text-muted-foreground">
                        {r.note || "Milestone release completed."}
                      </p>
                    </div>

                    <div className="flex-shrink-0 sm:text-right">
                      <p className="text-xs uppercase tracking-wider text-muted-foreground">Amount</p>
                      <p className="mt-1 text-2xl font-bold text-emerald-700 dark:text-emerald-300">
                        {formatCurrency(r.amount)}
                      </p>
                      <p className="mt-2 text-xs text-muted-foreground">
                        {new Date(r.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center gap-2 border-t border-border pt-4 text-sm text-muted-foreground">
                    <CheckCircle2 className="size-4 text-emerald-600 dark:text-emerald-400" />
                    Released to project proposer
                  </div>
                </Card>
              ))}
            </div>
          </div>
        ) : (
          <Card className="rounded-[1.5rem] p-12 text-center">
            <CheckCircle2 className="mx-auto mb-4 size-12 text-primary" />
            <p className="mb-2 text-lg font-medium text-foreground">No releases yet</p>
            <p className="text-muted-foreground">Funds released from escrow will appear here.</p>
          </Card>
        )}
      </main>
    </div>
  )
}

