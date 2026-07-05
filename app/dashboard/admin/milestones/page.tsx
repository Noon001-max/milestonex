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
      <main className="mx-auto w-full max-w-4xl px-4 py-10">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">Approve milestones</h1>
            <p className="text-sm text-muted-foreground">Quickly review and decide milestone verifications.</p>
          </div>
          <div className="text-sm text-muted-foreground">{pendingMilestones.length} pending</div>
        </div>

        <div className="mb-6 flex gap-4 text-sm">
          <a href="/dashboard/admin/approved-milestones" className="rounded-md px-3 py-2 border border-border/60 bg-card/70">Approved • {approvedMilestones.length}</a>
          <a href="/dashboard/admin/rejected-milestones" className="rounded-md px-3 py-2 border border-border/60 bg-card/70">Rejected • {rejectedMilestones.length}</a>
        </div>

        {pendingMilestones.length > 0 ? (
          <div className="space-y-3">
            {pendingMilestones.map((m) => (
              <Card key={m.id} className="flex items-center justify-between gap-4 border border-border/70 bg-card p-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-3">
                    <h2 className="truncate text-sm font-medium text-foreground">{m.title}</h2>
                    <span className="text-xs text-muted-foreground">— {m.projectTitle}</span>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground line-clamp-2">{m.description}</p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right text-xs text-muted-foreground">
                    <div>Amount</div>
                    <div className="font-medium text-foreground">${m.amount.toLocaleString()}</div>
                    <div className="mt-1">{m.submittedAt ? new Date(m.submittedAt).toLocaleString() : 'Pending'}</div>
                  </div>

                  <div className="flex flex-col items-end gap-2">
                    <form action={async function approveMilestone(formData: FormData) {
                      "use server"
                      const id = Number(formData.get("milestoneId"))
                      await decideMilestone(id, true)
                    }}>
                      <input type="hidden" name="milestoneId" value={m.id} />
                      <button type="submit" className="rounded-md bg-primary px-3 py-1 text-sm font-medium text-primary-foreground">Approve</button>
                    </form>

                    <form action={async function rejectMilestone(formData: FormData) {
                      "use server"
                      const id = Number(formData.get("milestoneId"))
                      await decideMilestone(id, false)
                    }}>
                      <input type="hidden" name="milestoneId" value={m.id} />
                      <button type="submit" className="rounded-md border border-border px-3 py-1 text-sm">Reject</button>
                    </form>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="p-8 text-center">
            <p className="text-muted-foreground">No milestone approvals pending.</p>
          </Card>
        )}
      </main>
    </div>
  )
}
