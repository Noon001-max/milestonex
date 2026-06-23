import { redirect } from "next/navigation"
import { getSession } from "@/lib/session"
import { getAllProjects } from "@/lib/queries"
import { Card } from "@/components/ui/card"
import { formatCurrency } from "@/lib/roles"
import { StatusBadge } from "@/components/status-badge"
import { AdminProjectCard } from "@/components/admin-project-card"

export const dynamic = "force-dynamic"

export default async function AdminProjectsPage() {
  const user = await getSession()
  if (!user) return redirect("/sign-in")
  if (user.role !== "admin") return redirect("/dashboard")

  const projects = await getAllProjects()
  const pendingProjects = projects.filter((project) => project.status === "pending")

  return (
    <div className="flex min-h-svh flex-col bg-background">
      <main className="mx-auto w-full max-w-6xl px-4 py-12">
        <div className="mb-6">
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">
            Project approvals
          </h1>
          <p className="mt-1 text-muted-foreground">
            Review and approve pending projects before they go live.
          </p>
        </div>

        {pendingProjects.length > 0 ? (
          <div className="grid gap-4">
            {pendingProjects.map((project) => (
              <AdminProjectCard
                key={project.id}
                id={project.id}
                title={project.title}
                summary={project.summary}
                fundingGoal={project.fundingGoal}
                status={project.status}
              />
            ))}
          </div>
        ) : (
          <Card className="p-12 text-center">
            <p className="text-muted-foreground">No pending projects to review.</p>
          </Card>
        )}
      </main>
    </div>
  )
}
