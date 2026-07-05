import { redirect } from "next/navigation"
import { getSession } from "@/lib/session"
import { getAdminMilestoneHistory } from "@/app/actions/milestones"
import { Card } from "@/components/ui/card"

export const dynamic = "force-dynamic"

export default async function RejectedMilestonesPage() {
  const user = await getSession()
  if (!user) return redirect("/sign-in")
  if (user.role !== "admin") return redirect("/dashboard")

  const history = await getAdminMilestoneHistory()
  const rejected = history.filter((m: any) => m.status === "rejected")

  return (
    <div className="flex min-h-svh flex-col bg-background">
      <main className="mx-auto w-full max-w-6xl px-4 py-12">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-foreground">Rejected milestones</h1>
            <p className="mt-1 text-muted-foreground">Milestones that were rejected.</p>
          </div>
        </div>

        <div className="grid gap-4">
          {rejected.length > 0 ? (
            rejected.map((m: any) => (
              <Card key={m.id} className="p-4 border border-border/70 bg-card">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-foreground">{m.title}</p>
                    <p className="text-sm text-muted-foreground">{m.projectTitle}</p>
                  </div>
                  <div className="text-sm text-muted-foreground">{new Date(m.updatedAt).toLocaleString()}</div>
                </div>
              </Card>
            ))
          ) : (
            <Card className="p-12 text-center">
              <p className="text-muted-foreground">No rejected milestones.</p>
            </Card>
          )}
        </div>
      </main>
    </div>
  )
}
