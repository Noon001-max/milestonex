import Link from "next/link"
import Image from "next/image"
import { getSession } from "@/lib/session"
import { getProjectById, getProjectMilestones } from "@/lib/queries"
import { Card } from "@/components/ui/card"
import { formatCurrency } from "@/lib/roles"
import { StatusBadge } from "@/components/status-badge"
import { EvidenceForm } from "@/components/evidence-form"

export const dynamic = "force-dynamic"

export default async function ProjectManagePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const projectId = Number(id)
  const user = await getSession()

  if (!user) {
    return (
      <div className="flex min-h-svh flex-col bg-background">
        <main className="mx-auto w-full max-w-6xl px-4 py-16">
          <p className="text-muted-foreground">
            <Link href="/sign-in" className="text-primary hover:underline">
              Sign in
            </Link>{" "}
            to manage projects.
          </p>
        </main>
      </div>
    )
  }

  const [project, milestones] = await Promise.all([
    getProjectById(projectId),
    getProjectMilestones(projectId),
  ])

  const isMilestoneUnlocked = (index: number) =>
    index === 0 ||
    milestones.slice(0, index).every((prev) => prev.submittedAt !== null)

  if (!project || project.ownerId !== user.id) {
    return (
      <div className="flex min-h-svh flex-col bg-background">
        <main className="mx-auto w-full max-w-6xl px-4 py-16">
          <p className="text-muted-foreground">Project not found or access denied.</p>
        </main>
      </div>
    )
  }

  return (
    <div className="flex min-h-svh flex-col bg-background">
      <main className="mx-auto w-full max-w-6xl px-4 py-12">
        <div className="mb-6">
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">
            {project.title}
          </h1>
          <div className="mt-1 flex items-center gap-2">
            <StatusBadge status={project.status} />
            <span className="text-sm text-muted-foreground">
              {formatCurrency(project.fundedAmount)} raised
            </span>
          </div>
        </div>

        <div className="grid gap-6">
          <h2 className="text-lg font-semibold text-foreground">Milestones</h2>
          {milestones.length ? (
            <div className="space-y-4">
              {milestones.map((m, index) => {
                const unlocked = isMilestoneUnlocked(index)
                return (
                  <Card
                    key={m.id}
                    className={`p-5 ${
                      m.status === "pending" && !unlocked
                        ? "opacity-80 ring-1 ring-border bg-muted"
                        : ""
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-foreground">{m.title}</p>
                        <p className="text-sm text-muted-foreground">{m.description}</p>
                        <p className="mt-1 text-sm font-medium text-primary">
                          {formatCurrency(m.amount)}
                        </p>
                      </div>
                      <StatusBadge status={m.status} />
                    </div>

                    {(m.status === "pending" || (m.status === "released" && !m.submittedAt)) && unlocked && (
                      <EvidenceForm milestoneId={m.id} />
                    )}

                    {(m.status === "pending" || (m.status === "released" && !m.submittedAt)) && !unlocked && (
                      <div className="mt-4 rounded-lg border border-border bg-muted p-4 text-sm text-muted-foreground">
                        Milestone {index + 1} will unlock after the previous milestone evidence is submitted.
                      </div>
                    )}

                    {m.status !== "pending" && (m.evidenceNote || m.evidenceUrls) && (
                      <div className="mt-4 space-y-3 border-t border-border pt-4">
                        <p className="text-sm font-medium text-foreground">Submitted proof</p>
                        {m.evidenceNote ? (
                          <p className="text-sm leading-relaxed text-muted-foreground">
                            {m.evidenceNote}
                          </p>
                        ) : null}
                        {m.evidenceUrls ? (
                          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                            {m.evidenceUrls
                              .split(/\s*[\n,]\s*/)
                              .map((u) => u.trim())
                              .filter(Boolean)
                              .map((url) => (
                                <a
                                  key={url}
                                  href={url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="overflow-hidden rounded-lg border border-input"
                                >
                                  <Image
                                    src={url || "/placeholder.svg"}
                                    alt="Milestone proof"
                                    width={400}
                                    height={300}
                                    className="h-28 w-full object-cover"
                                  />
                                </a>
                              ))}
                          </div>
                        ) : null}
                      </div>
                    )}
                  </Card>
                )
              })}
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
