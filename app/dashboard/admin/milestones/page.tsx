import { redirect } from "next/navigation"
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
      <main className="mx-auto w-full max-w-6xl px-4 py-12">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-foreground">
              Approve milestones
            </h1>
            <p className="mt-1 text-muted-foreground">
              Review milestone verification requests and approve or reject them.
            </p>
          </div>
          <Badge variant="outline" className="capitalize">
            {pendingMilestones.length} pending
          </Badge>
        </div>

        <div className="mb-8 rounded-[1.5rem] border border-border/70 bg-card/80 p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-semibold text-foreground">Review history</h2>
              <p className="text-sm text-muted-foreground">See which milestones have already been approved or rejected.</p>
            </div>
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <div className="rounded-2xl border border-border/70 bg-background p-4">
              <h3 className="text-sm font-semibold text-foreground">Approved milestones</h3>
              <div className="mt-3 space-y-2">
                {approvedMilestones.length > 0 ? (
                  approvedMilestones.slice(0, 5).map((milestone) => (
                    <div key={milestone.id} className="rounded-xl border border-border/60 bg-card/70 px-3 py-2 text-sm">
                      <p className="font-medium text-foreground">{milestone.title}</p>
                      <p className="text-xs text-muted-foreground">{milestone.projectTitle}</p>
                    </div>
                  ))
                ) : (
                  <p className="rounded-xl border border-dashed border-border/70 px-3 py-2 text-sm text-muted-foreground">No approved milestones yet.</p>
                )}
              </div>
            </div>

            <div className="rounded-2xl border border-border/70 bg-background p-4">
              <h3 className="text-sm font-semibold text-foreground">Rejected milestones</h3>
              <div className="mt-3 space-y-2">
                {rejectedMilestones.length > 0 ? (
                  rejectedMilestones.slice(0, 5).map((milestone) => (
                    <div key={milestone.id} className="rounded-xl border border-border/60 bg-card/70 px-3 py-2 text-sm">
                      <p className="font-medium text-foreground">{milestone.title}</p>
                      <p className="text-xs text-muted-foreground">{milestone.projectTitle}</p>
                    </div>
                  ))
                ) : (
                  <p className="rounded-xl border border-dashed border-border/70 px-3 py-2 text-sm text-muted-foreground">No rejected milestones yet.</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {pendingMilestones.length > 0 ? (
          <div className="grid gap-4">
            {pendingMilestones.map((m) => (
              <Card key={m.id} className="overflow-hidden border border-border/70 bg-card p-0 shadow-sm">
                <div className="flex flex-col gap-4 p-6 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-3">
                      <h2 className="truncate text-lg font-semibold text-foreground">{m.title}</h2>
                      <StatusBadge status={m.status} />
                    </div>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">{m.description}</p>
                    <p className="mt-2 text-sm text-muted-foreground">Project: {m.projectTitle}</p>
                    <p className="mt-1 text-sm font-medium text-foreground">Amount: ${m.amount.toLocaleString()}</p>
                  </div>

                  <div className="flex flex-col gap-3 sm:text-right">
                    <p className="text-sm text-muted-foreground">Submitted at</p>
                    <p className="text-sm font-medium text-foreground">
                      {m.submittedAt ? new Date(m.submittedAt).toLocaleString() : "Pending"}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3 border-t border-border/70 bg-background/70 p-4">
                  <form action={async function approveMilestone(formData: FormData) {
                    "use server"
                    const id = Number(formData.get("milestoneId"))
                    await decideMilestone(id, true)
                  }}>
                    <input type="hidden" name="milestoneId" value={m.id} />
                    <button type="submit" className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
                      Approve
                    </button>
                  </form>
                  <form action={async function rejectMilestone(formData: FormData) {
                    "use server"
                    const id = Number(formData.get("milestoneId"))
                    await decideMilestone(id, false)
                  }}>
                    <input type="hidden" name="milestoneId" value={m.id} />
                    <button type="submit" className="inline-flex items-center justify-center rounded-lg border border-border bg-background px-4 py-2 text-sm font-medium text-foreground hover:bg-muted">
                      Reject
                    </button>
                  </form>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="p-12 text-center">
            <p className="text-muted-foreground">No milestone approvals pending.</p>
          </Card>
        )}
      </main>
    </div>
  )
}
