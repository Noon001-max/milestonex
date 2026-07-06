import { redirect } from "next/navigation"
import { getSession } from "@/lib/session"
import { getAdminMilestoneHistory } from "@/app/actions/milestones"
import { MilestoneCard } from "@/components/status-cards"

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
              <MilestoneCard
                key={m.id}
                id={m.id}
                title={m.title}
                subtitle={m.projectTitle}
                status={"rejected"}
                date={m.updatedAt ? new Date(m.updatedAt).toLocaleString() : undefined}
                href={`/dashboard/admin/projects/${m.projectId}`}
              />
            ))
          ) : (
            <div className="p-12 text-center">
              <p className="text-muted-foreground">No rejected milestones.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
