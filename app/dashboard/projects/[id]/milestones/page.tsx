import Image from "next/image"
import Link from "next/link"
import { notFound, redirect } from "next/navigation"
import { ArrowRight, CheckCircle2, Clock3, FileText, LockKeyhole, UploadCloud } from "lucide-react"
import { getSession } from "@/lib/session"
import { getProjectById, getProjectMilestones } from "@/lib/queries"
import { EvidenceForm } from "@/components/evidence-form"
import { MilestoneTimeline } from "@/components/milestone-timeline"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { StatusBadge } from "@/components/status-badge"
import { formatCurrency } from "@/lib/roles"

export const dynamic = "force-dynamic"

export default async function MilestonesPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const projectId = Number(id)
  if (Number.isNaN(projectId)) notFound()

  const [user, project, milestones] = await Promise.all([
    getSession(),
    getProjectById(projectId),
    getProjectMilestones(projectId),
  ])
  if (!project) notFound()
  if (!user) redirect(`/sign-in`)
  if (user.id !== project.ownerId) redirect(`/dashboard/projects/${projectId}`)
  if (project.status === "completed") redirect(`/dashboard/projects/${projectId}`)

  const isUnlocked = (index: number) =>
    index === 0 ||
    milestones.slice(0, index).every((prev) => prev.status === "approved" || prev.status === "released")

  const unlockedCount = milestones.filter((milestone, index) => isUnlocked(index)).length
  const nextReadyIndex = milestones.findIndex((milestone, index) => isUnlocked(index) && (milestone.status === "pending" || milestone.status === "rejected"))
  const currentIndex = nextReadyIndex >= 0 ? nextReadyIndex : milestones.findIndex((milestone) => milestone.status === "submitted" || milestone.status === "verifying")
  const currentMilestone = currentIndex >= 0 ? milestones[currentIndex] : null
  const completionCount = milestones.filter((milestone) => milestone.status === "approved" || milestone.status === "released").length

  return (
    <div className="flex min-h-svh flex-col bg-background">
      <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:py-12">
        <div className="relative overflow-hidden rounded-3xl border border-border/70 bg-card shadow-sm">
          <div className="grid gap-0 lg:grid-cols-[1.35fr_0.9fr]">
            <div className="relative min-h-[18rem] overflow-hidden bg-muted">
              <Image
                src={project.imageUrl || "/hero-community.png"}
                alt={project.title}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 60vw"
                className="object-cover"
              />
              <div className="absolute left-4 top-4">
                <StatusBadge status={project.status} />
              </div>
            </div>

            <div className="flex flex-col justify-between gap-5 border-t border-border/70 p-6 sm:p-8 lg:border-l lg:border-t-0">
              <div>
                <div className="space-y-3 border-b border-border/60 pb-4">
                  <span className="inline-flex items-center gap-1 rounded-full border border-border/70 bg-background/90 px-3 py-1 text-xs font-semibold text-muted-foreground shadow-sm backdrop-blur">
                    <FileText className="size-3.5" />
                    Proof submission workspace
                  </span>
                  <h1 className="text-balance text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
                    {project.title}
                  </h1>
                  <p className="text-sm leading-6 text-muted-foreground sm:text-base">
                    {project.summary}
                  </p>
                </div>

                <p className="mt-5 text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">Milestone progress</p>
                <div className="mt-4 grid grid-cols-2 gap-3">
                  <Card className="rounded-2xl border border-border/70 bg-secondary/30 p-4 shadow-sm">
                    <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-muted-foreground">Unlocked</p>
                    <p className="mt-2 text-2xl font-semibold text-foreground">{unlockedCount}</p>
                    <p className="mt-1 text-xs text-muted-foreground">Ready for proof submission</p>
                  </Card>
                  <Card className="rounded-2xl border border-border/70 bg-secondary/30 p-4 shadow-sm">
                    <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-muted-foreground">Goal</p>
                    <p className="mt-2 text-2xl font-semibold text-foreground">{formatCurrency(project.fundingGoal)}</p>
                    <p className="mt-1 text-xs text-muted-foreground">Project funding target</p>
                  </Card>
                </div>
              </div>

              <div className="space-y-3 rounded-2xl border border-border/70 bg-background/80 p-4 shadow-sm">
                <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                  <LockKeyhole className="size-4 text-primary" />
                  How it works
                </div>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex gap-2">
                    <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-emerald-500" />
                    The first milestone is unlocked automatically.
                  </li>
                  <li className="flex gap-2">
                    <UploadCloud className="mt-0.5 size-4 shrink-0 text-primary" />
                    Upload images and notes as proof of completed work.
                  </li>
                  <li className="flex gap-2">
                    <Clock3 className="mt-0.5 size-4 shrink-0 text-amber-500" />
                    The next milestone opens only after approval.
                  </li>
                </ul>
              </div>

              <div className="flex flex-wrap gap-3">
                <Link href={`/dashboard/projects/${projectId}`}>
                  <Button variant="outline" className="rounded-xl">
                    View project
                    <ArrowRight className="ml-2 size-4" />
                  </Button>
                </Link>
                <div className="inline-flex items-center gap-2 rounded-xl border border-border/70 bg-background/90 px-4 py-2 text-sm font-semibold text-foreground shadow-sm backdrop-blur">
                  <Clock3 className="size-4 text-primary" />
                  {completionCount} of {milestones.length} approved
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-[1.3fr_0.7fr]">
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
                  Milestone submissions
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Submit proof for the active milestone, then wait for approval to unlock the next step.
                </p>
              </div>
            </div>

            {milestones.length > 0 ? (
              <div className="space-y-4">
                {milestones.map((milestone, index) => {
                  const unlocked = isUnlocked(index)
                  const canSubmit = unlocked && (milestone.status === "pending" || milestone.status === "rejected")
                  const waitingReview = milestone.status === "submitted" || milestone.status === "verifying"
                  const completed = milestone.status === "approved" || milestone.status === "released"

                  return (
                    <Card
                      key={milestone.id}
                      className={`overflow-hidden rounded-2xl border border-border/70 bg-card shadow-sm transition-all duration-200 ${
                        canSubmit ? "ring-1 ring-primary/20" : ""
                      } ${!unlocked && !completed ? "opacity-75" : ""}`}
                    >
                      <div className="flex flex-col gap-4 p-5 sm:p-6">
                        <div className="flex flex-wrap items-start justify-between gap-3">
                          <div className="space-y-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="inline-flex size-7 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                                {index + 1}
                              </span>
                              <span className="text-xs font-bold uppercase tracking-[0.18em] text-muted-foreground">
                                {completed ? "Completed" : canSubmit ? "Ready for proof" : unlocked ? "Waiting on review" : "Locked"}
                              </span>
                            </div>
                            <h3 className="text-lg font-semibold text-foreground sm:text-xl">{milestone.title}</h3>
                            <p className="max-w-3xl text-sm leading-6 text-muted-foreground">{milestone.description}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="rounded-xl bg-secondary/60 px-3 py-2 text-sm font-semibold text-foreground">
                              {formatCurrency(milestone.amount)}
                            </span>
                            <StatusBadge status={milestone.status} />
                          </div>
                        </div>

                        {!unlocked && !completed && (
                          <div className="rounded-xl border border-border/70 bg-muted/50 px-4 py-3 text-sm text-muted-foreground">
                            This milestone will unlock after the previous milestone is approved.
                          </div>
                        )}

                        {canSubmit && (
                          <div className="rounded-2xl border border-primary/10 bg-primary/5 p-4 sm:p-5">
                            <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-foreground">
                              <UploadCloud className="size-4 text-primary" />
                              Submit proof of work
                            </div>
                            <EvidenceForm milestoneId={milestone.id} />
                          </div>
                        )}

                        {waitingReview && (
                          <div className="rounded-xl border border-violet-500/20 bg-violet-500/5 px-4 py-3 text-sm text-muted-foreground">
                            Proof has been submitted and is waiting for verification. The next milestone will unlock after approval.
                          </div>
                        )}

                        {completed && (
                          <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 px-4 py-3 text-sm text-muted-foreground">
                            Approved. The next milestone is now available if one exists.
                          </div>
                        )}

                        {(milestone.evidenceNote || milestone.evidenceUrls) && (milestone.status === "submitted" || milestone.status === "verifying" || milestone.status === "approved" || milestone.status === "released") && (
                          <div className="space-y-3 border-t border-border/70 pt-4">
                            <p className="text-sm font-semibold text-foreground">Submitted proof</p>
                            {milestone.evidenceNote ? (
                              <p className="whitespace-pre-line text-sm leading-relaxed text-muted-foreground">
                                {milestone.evidenceNote}
                              </p>
                            ) : null}
                            {milestone.evidenceUrls ? (
                              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                                {milestone.evidenceUrls
                                  .split(/\s*[\n,]\s*/)
                                  .map((url) => url.trim())
                                  .filter(Boolean)
                                  .map((url) => (
                                    <a
                                      key={url}
                                      href={url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="overflow-hidden rounded-xl border border-border bg-muted"
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
                      </div>
                    </Card>
                  )
                })}
              </div>
            ) : (
              <Card className="rounded-2xl border border-border/70 bg-card p-8 text-center shadow-sm">
                <p className="text-sm text-muted-foreground">No milestones have been set up yet.</p>
              </Card>
            )}
          </div>

          <div className="space-y-4 lg:sticky lg:top-6 lg:self-start">
            <Card className="rounded-2xl border border-border/70 bg-card p-5 shadow-sm">
              <div className="mb-4 flex items-center gap-2">
                <FileText className="size-4 text-primary" />
                <h3 className="font-semibold text-foreground">Milestone timeline</h3>
              </div>
              <MilestoneTimeline milestones={milestones} ownerView />
            </Card>

            <Card className="rounded-2xl border border-border/70 bg-card p-5 shadow-sm">
              <div className="mb-3 flex items-center gap-2">
                <LockKeyhole className="size-4 text-primary" />
                <h3 className="font-semibold text-foreground">Current status</h3>
              </div>
              {currentMilestone ? (
                <div className="space-y-2">
                  <p className="text-sm font-semibold text-foreground">{currentMilestone.title}</p>
                  <p className="text-sm text-muted-foreground">
                    {currentMilestone.status === "submitted" || currentMilestone.status === "verifying"
                      ? "Awaiting verification"
                      : currentMilestone.status === "rejected"
                        ? "Proof needs to be resubmitted"
                        : "Ready for proof submission"}
                  </p>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">All milestones are complete or awaiting no further action.</p>
              )}
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
