import Link from "next/link"
import Image from "next/image"
import { redirect } from "next/navigation"
import { getSession } from "@/lib/session"
import { getProjectById, getProjectMilestones } from "@/lib/queries"
import { Card } from "@/components/ui/card"
import { formatCurrency } from "@/lib/roles"
import { StatusBadge } from "@/components/status-badge"

export const dynamic = "force-dynamic"

export default async function AdminProjectDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const projectId = Number(id)
  const user = await getSession()

  if (!user) return redirect("/sign-in")
  if (user.role !== "admin") return redirect("/dashboard")

  const [project, milestones] = await Promise.all([
    getProjectById(projectId),
    getProjectMilestones(projectId),
  ])

  if (!project) {
    return (
      <div className="flex min-h-svh flex-col bg-background">
        <main className="mx-auto w-full max-w-6xl px-4 py-16">
          <p className="text-muted-foreground">Project not found.</p>
        </main>
      </div>
    )
  }

  return (
    <div className="flex min-h-svh flex-col bg-background">
      <main className="mx-auto w-full max-w-6xl px-4 py-12">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-foreground">{project.title}</h1>
            <div className="mt-1 flex items-center gap-2">
              <StatusBadge status={project.status} />
              <span className="text-sm text-muted-foreground">{formatCurrency(project.fundedAmount)} raised</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/dashboard/admin/projects" className="text-sm text-muted-foreground hover:underline">Back to projects</Link>
          </div>
        </div>

        <div className="grid gap-6">
          <Card className="p-6">
            <p className="text-sm text-muted-foreground">{project.summary}</p>
            <div className="mt-4 grid gap-3 sm:grid-cols-3 text-sm">
              <div>
                <span className="font-medium text-foreground">{formatCurrency(project.fundedAmount)}</span>
                <span className="ml-1">raised</span>
              </div>
              <div>
                <span className="font-medium text-foreground">{formatCurrency(project.escrowBalance)}</span>
                <span className="ml-1">in escrow</span>
              </div>
              <div>
                <span className="font-medium text-foreground">{formatCurrency(project.fundingGoal)}</span>
                <span className="ml-1">goal</span>
              </div>
            </div>
          </Card>

          <h2 className="text-lg font-semibold text-foreground">Milestones</h2>
          {milestones.length ? (
            <div className="space-y-4">
              {milestones.map((m) => (
                <Card key={m.id} className="p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-foreground">{m.title}</p>
                      <p className="text-sm text-muted-foreground">{m.description}</p>
                      <p className="mt-1 text-sm font-medium text-primary">{formatCurrency(m.amount)}</p>
                    </div>
                    <StatusBadge status={m.status} />
                  </div>
                  {m.evidenceNote || m.evidenceUrls ? (
                    <div className="mt-4 space-y-3 border-t border-border pt-4">
                      <p className="text-sm font-medium text-foreground">Submitted proof</p>
                      {m.evidenceNote ? <p className="text-sm leading-relaxed text-muted-foreground">{m.evidenceNote}</p> : null}
                      {m.evidenceUrls ? (
                        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                          {m.evidenceUrls
                            .split(/\s*[\n,]\s*/)
                            .map((u) => u.trim())
                            .filter(Boolean)
                            .map((url) => (
                              <a key={url} href={url} target="_blank" rel="noopener noreferrer" className="overflow-hidden rounded-lg border border-input">
                                <Image src={url || "/placeholder.svg"} alt="Milestone proof" width={400} height={300} className="h-28 w-full object-cover" />
                              </a>
                            ))}
                        </div>
                      ) : null}
                    </div>
                  ) : null}
                </Card>
              ))}
            </div>
          ) : (
            <Card className="p-6">
              <p className="text-muted-foreground">No milestones defined.</p>
            </Card>
          )}
        </div>
      </main>
    </div>
  )
}
