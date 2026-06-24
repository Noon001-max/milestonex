import Link from "next/link"
import { redirect } from "next/navigation"
import { getSession } from "@/lib/session"
import { getReadyToStartProjects, approveProjectStart } from "@/app/actions/projects"
import { Card } from "@/components/ui/card"
import { formatCurrency } from "@/lib/roles"
import { Badge } from "@/components/ui/badge"

export const dynamic = "force-dynamic"

export default async function AdminReadyToStartPage() {
  const user = await getSession()
  if (!user) return redirect("/sign-in")
  if (user.role !== "admin") return redirect("/dashboard")

  const readyProjects = await getReadyToStartProjects()

  return (
    <div className="flex min-h-svh flex-col bg-background">
      <main className="mx-auto w-full max-w-6xl px-4 py-12">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-foreground">
              Ready to start
            </h1>
            <p className="mt-1 text-muted-foreground">
              Review projects that have reached the startup threshold and approve the first milestone for auditor release.
            </p>
          </div>
          <Badge variant="outline" className="capitalize">
            {readyProjects.length} ready
          </Badge>
        </div>

        {readyProjects.length > 0 ? (
          <div className="grid gap-4">
            {readyProjects.map((project) => (
              <Card key={`${project.projectId}-${project.milestoneId}`} className="p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-3">
                      <h2 className="text-lg font-semibold text-foreground truncate">{project.title}</h2>
                      <Badge variant="secondary" className="bg-primary/10 text-primary">
                        Ready to start
                      </Badge>
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
                      {project.summary}
                    </p>

                    <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                      <div className="rounded-md bg-muted px-3 py-2">
                        <div className="text-xs">Raised</div>
                        <div className="font-medium text-foreground">{formatCurrency(project.fundedAmount)}</div>
                      </div>
                      <div className="rounded-md bg-muted px-3 py-2">
                        <div className="text-xs">In escrow</div>
                        <div className="font-medium text-foreground">{formatCurrency(project.escrowBalance)}</div>
                      </div>
                      <div className="rounded-md bg-muted px-3 py-2">
                        <div className="text-xs">Startup milestone</div>
                        <div className="font-medium text-foreground">{formatCurrency(project.milestoneAmount)}</div>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-stretch gap-3 sm:items-end">
                    <div className="flex gap-2">
                      <Link
                        href={`/dashboard/admin/projects/${project.projectId}`}
                        className="inline-flex items-center justify-center rounded-lg border border-border bg-background px-4 py-2 text-sm font-medium text-foreground hover:bg-muted"
                      >
                        View details
                      </Link>
                    </div>

                    <form action={async function approveStart(formData: FormData) {
                      "use server"
                      const projectId = Number(formData.get("projectId"))
                      await approveProjectStart(projectId)
                    }}>
                      <input type="hidden" name="projectId" value={project.projectId} />
                      <button
                        type="submit"
                        className="inline-flex w-full items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
                      >
                        Approve startup
                      </button>
                    </form>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="p-12 text-center">
            <p className="text-muted-foreground">No projects are ready to start at the moment.</p>
          </Card>
        )}
      </main>
    </div>
  )
}
