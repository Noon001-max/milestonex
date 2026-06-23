import { redirect } from "next/navigation"
import { getSession } from "@/lib/session"
import { getAdminMilestoneQueue, decideMilestone } from "@/app/actions/milestones"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { StatusBadge } from "@/components/status-badge"

export const dynamic = "force-dynamic"

export default async function AdminMilestonesPage() {
  const user = await getSession()
  if (!user) return redirect("/sign-in")
  if (user.role !== "admin") return redirect("/dashboard")

  const milestones = await getAdminMilestoneQueue()

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
            {milestones.length} pending
          </Badge>
        </div>

        {milestones.length > 0 ? (
          <div className="grid gap-4">
            {milestones.map((m) => (
              <Card key={m.id} className="p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-3">
                      <h2 className="text-lg font-semibold text-foreground truncate">{m.title}</h2>
                      <StatusBadge status={m.status} />
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground">{m.description}</p>
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

                <div className="mt-6 flex flex-wrap gap-3">
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
