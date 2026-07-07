import { redirect } from "next/navigation"
import Link from "next/link"
import { CheckCircle2, XCircle, Clock3, ArrowRight } from "lucide-react"
import { getSession } from "@/lib/session"
import { getAdminMilestoneHistory, getAdminMilestoneQueue, decideMilestone } from "@/app/actions/milestones"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { StatusBadge } from "@/components/status-badge"

export const dynamic = "force-dynamic"

export default async function AdminMilestonesPage() {
  const user = await getSession()
  if (!user) return redirect("/sign-in")
  if (user.role !== "admin") return redirect("/dashboard")

  const [pendingMilestones, milestoneHistory] = await Promise.all([
    getAdminMilestoneQueue(),
    getAdminMilestoneHistory(),
  ])

  const approvedMilestones = milestoneHistory.filter((milestone) => milestone.status === "approved")
  const rejectedMilestones = milestoneHistory.filter((milestone) => milestone.status === "rejected")

  return (
    <div className="flex min-h-svh flex-col bg-background">
      <main className="mx-auto w-full max-w-5xl px-4 py-8 sm:py-12">
        <div className="mb-8 overflow-hidden rounded-[2rem] border border-border/70 bg-card shadow-sm">
          <div className="grid gap-0 lg:grid-cols-[1.15fr_0.85fr]">
            <div className="p-6 sm:p-8">
              <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                <Clock3 className="size-3.5" />
                Milestone review
              </div>
              <h1 className="mt-3 text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
                Approve milestones
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base">
                Review submitted milestone evidence, then approve or reject each request with one clear action.
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  href="/dashboard/admin/approved-milestones"
                  className="inline-flex h-9 items-center justify-center rounded-full border border-border bg-background px-4 text-sm font-medium text-foreground transition-colors hover:bg-muted"
                >
                  Approved milestones
                  <ArrowRight className="ml-2 size-4" />
                </Link>
                <Link
                  href="/dashboard/admin/rejected-milestones"
                  className="inline-flex h-9 items-center justify-center rounded-full border border-border bg-background px-4 text-sm font-medium text-foreground transition-colors hover:bg-muted"
                >
                  Rejected milestones
                </Link>
              </div>
            </div>

            <div className="grid gap-3 border-t border-border/70 bg-secondary/20 p-6 sm:p-8 lg:border-l lg:border-t-0">
              <Card className="rounded-[1.5rem] border border-border/70 bg-background/80 p-4 shadow-sm">
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">Pending review</p>
                <p className="mt-2 text-3xl font-bold text-foreground">{pendingMilestones.length}</p>
                <p className="mt-1 text-sm text-muted-foreground">Waiting for your decision</p>
              </Card>
              <Card className="rounded-[1.5rem] border border-border/70 bg-background/80 p-4 shadow-sm">
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">Approved</p>
                <p className="mt-2 text-3xl font-bold text-foreground">{approvedMilestones.length}</p>
                <p className="mt-1 text-sm text-muted-foreground">Cleared for release</p>
              </Card>
              <Card className="rounded-[1.5rem] border border-border/70 bg-background/80 p-4 shadow-sm">
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">Rejected</p>
                <p className="mt-2 text-3xl font-bold text-foreground">{rejectedMilestones.length}</p>
                <p className="mt-1 text-sm text-muted-foreground">Returned for correction</p>
              </Card>
            </div>
          </div>
        </div>

        {pendingMilestones.length > 0 ? (
          <div className="grid gap-4">
            {pendingMilestones.map((m) => (
              <Card key={m.id} className="border border-border/70 bg-card p-6 shadow-sm transition-shadow hover:shadow-md">
                <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="truncate text-lg font-semibold text-foreground">{m.title}</h2>
                      <Badge variant="outline" className="rounded-full border-border/60 bg-secondary/50 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider">
                        Pending
                      </Badge>
                    </div>
                    <p className="mt-1 text-sm font-medium text-muted-foreground">{m.projectTitle}</p>
                    <p className="mt-3 max-w-3xl text-sm leading-7 text-muted-foreground line-clamp-3">{m.description}</p>

                    <div className="mt-5 grid gap-3 sm:grid-cols-3">
                      <div className="rounded-2xl border border-border/40 bg-secondary/40 p-4">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">Amount</p>
                        <p className="mt-1 text-base font-bold text-foreground">${m.amount.toLocaleString()}</p>
                      </div>
                      <div className="rounded-2xl border border-border/40 bg-secondary/40 p-4">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">Submitted</p>
                        <p className="mt-1 text-base font-bold text-foreground">{m.submittedAt ? new Date(m.submittedAt).toLocaleString() : "Pending"}</p>
                      </div>
                      <div className="rounded-2xl border border-border/40 bg-secondary/40 p-4">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">Evidence</p>
                        <p className="mt-1 text-base font-bold text-foreground">{m.evidenceNote ? "Notes attached" : "No note"}</p>
                      </div>
                    </div>

                    {m.evidenceNote && (
                      <p className="mt-4 rounded-2xl border border-border/40 bg-background/70 p-4 text-sm leading-7 text-muted-foreground">
                        {m.evidenceNote}
                      </p>
                    )}
                  </div>

                  <div className="flex shrink-0 flex-col gap-3 lg:w-56">
                    <div className="rounded-2xl border border-border/40 bg-secondary/40 p-4 text-sm">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">Review status</p>
                      <div className="mt-2">
                        <StatusBadge status={m.status} />
                      </div>
                    </div>

                    <form action={async function approveMilestone(formData: FormData) {
                      "use server"
                      const id = Number(formData.get("milestoneId"))
                      await decideMilestone(id, true)
                    }}>
                      <input type="hidden" name="milestoneId" value={m.id} />
                      <button type="submit" className="inline-flex w-full items-center justify-center rounded-full bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm transition hover:opacity-90">
                        <CheckCircle2 className="mr-2 size-4" />
                        Approve
                      </button>
                    </form>

                    <form action={async function rejectMilestone(formData: FormData) {
                      "use server"
                      const id = Number(formData.get("milestoneId"))
                      await decideMilestone(id, false)
                    }}>
                      <input type="hidden" name="milestoneId" value={m.id} />
                      <button type="submit" className="inline-flex w-full items-center justify-center rounded-full border border-border bg-background px-4 py-2.5 text-sm font-semibold text-foreground transition hover:bg-muted">
                        <XCircle className="mr-2 size-4" />
                        Reject
                      </button>
                    </form>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="rounded-[1.75rem] p-10 text-center">
            <p className="text-muted-foreground">No milestone approvals pending.</p>
          </Card>
        )}
      </main>
    </div>
  )
}
