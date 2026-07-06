import { redirect } from "next/navigation"
import { getSession } from "@/lib/session"
import { getApprovedMilestonesByAdmin } from "@/app/actions/milestones"
import { MilestoneCard } from "@/components/status-cards"

export const dynamic = "force-dynamic"

export default async function ApprovedMilestonesPage() {
  const user = await getSession()
  if (!user) return redirect("/sign-in")
  if (user.role !== "admin") return redirect("/dashboard")

  const milestones = await getApprovedMilestonesByAdmin()

  return (
    <div className="flex min-h-svh flex-col bg-background">
      <main className="mx-auto w-full max-w-6xl px-4 py-12">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-foreground">Approved milestones</h1>
            <p className="mt-1 text-muted-foreground">Milestones you've approved recently.</p>
          </div>
        </div>

        <div className="grid gap-4">
          {milestones.length > 0 ? (
            milestones.map((m) => (
              <MilestoneCard
                key={m.id}
                id={m.id}
                title={m.title}
                subtitle={m.projectTitle}
                status={"approved"}
                date={m.updatedAt ? new Date(m.updatedAt).toLocaleString() : undefined}
                href={`/dashboard/admin/projects/${m.projectId}`}
              />
            ))
          ) : (
            <div className="p-12 text-center">
              <p className="text-muted-foreground">You haven't approved any milestones yet.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
