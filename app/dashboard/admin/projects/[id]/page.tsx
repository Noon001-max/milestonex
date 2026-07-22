import Link from "next/link"
import Image from "next/image"
import { redirect } from "next/navigation"
import { ArrowLeft, Banknote, Clock3, FileText, GitBranch, Landmark, MapPin, Receipt, ShieldCheck, Sparkles, Users } from "lucide-react"
import { getSession } from "@/lib/session"
import { getOwnerName, approveProjectStart, reviewProject } from "@/app/actions/projects"
import { getProjectById, getProjectMilestones, getProjectDonations, getProjectTransactions } from "@/lib/queries"
import { Card } from "@/components/ui/card"
import { formatCurrency } from "@/lib/roles"
import { SiteFooter } from "@/components/site-footer"
import { Button } from "@/components/ui/button"
import { StatusBadge } from "@/components/status-badge"
import { AuditTrailList } from "@/components/audit-trail-list"

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

  const [donations, transactions, ownerName] = await Promise.all([
    getProjectDonations(projectId),
    getProjectTransactions(projectId),
    getOwnerName(project.ownerId),
  ])

  return (
    <div className="flex min-h-svh flex-col bg-background">
      <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:py-12 overflow-hidden">
        <Link href="/dashboard/admin/projects" className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground transition hover:text-foreground">
          <ArrowLeft className="size-4" />
          Back to projects
        </Link>

        <div className="grid gap-8 lg:grid-cols-3">
          <div className="flex min-w-0 flex-col gap-6 lg:col-span-2">
            <div className="relative aspect-[16/9] overflow-hidden rounded-2xl border border-border bg-muted">
              <Image
                src={project.imageUrl || "/hero-community.png"}
                alt={project.title}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 66vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/45 via-transparent to-transparent" />
              <div className="absolute left-4 top-4">
                <StatusBadge status={project.status} />
              </div>
            </div>

            <div className="rounded-2xl border border-border/70 bg-card p-5 shadow-sm sm:p-6">
              <div className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                <span className="rounded-full bg-secondary/60 px-2.5 py-1 text-foreground/80">{project.category}</span>
                {project.location && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-secondary/60 px-2.5 py-1 text-foreground/80">
                    <MapPin className="size-3.5" />
                    {project.location}
                  </span>
                )}
              </div>
              <h1 className="mt-3 text-balance text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
                {project.title}
              </h1>
              <p className="mt-2 text-sm text-muted-foreground">Proposed by {ownerName}</p>
              <p className="mt-4 max-w-3xl whitespace-pre-line text-sm leading-7 text-foreground/80 sm:text-base">
                {project.summary || project.description || "No summary has been added yet."}
              </p>

              <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                {project.status === "pending" && (
                  <>
                    <form action={async function approve(formData: FormData) {
                      "use server"
                      const id = Number(formData.get("projectId"))
                      await reviewProject(id, true)
                      redirect(`/dashboard/admin/projects/${id}`)
                    }}>
                      <input type="hidden" name="projectId" value={project.id} />
                      <Button className="rounded-xl">Approve project</Button>
                    </form>
                    <form action={async function reject(formData: FormData) {
                      "use server"
                      const id = Number(formData.get("projectId"))
                      await reviewProject(id, false)
                      redirect(`/dashboard/admin/projects/${id}`)
                    }}>
                      <input type="hidden" name="projectId" value={project.id} />
                      <Button variant="outline" className="rounded-xl">Reject project</Button>
                    </form>
                  </>
                )}

                {project.status === "funding" && (
                  <form action={async function approveStartAction(formData: FormData) {
                    "use server"
                    const id = Number(formData.get("projectId"))
                    await approveProjectStart(id)
                  }}>
                    <input type="hidden" name="projectId" value={project.id} />
                    <Button className="rounded-xl bg-emerald-600 text-white hover:bg-emerald-700">Approve startup</Button>
                  </form>
                )}
              </div>
            </div>

            <Card className="border border-border/80 bg-card p-6 shadow-sm">
              <h2 className="mb-3 text-lg font-bold text-foreground">Description</h2>
              <p className="whitespace-pre-line break-words text-sm leading-relaxed text-muted-foreground sm:text-base">
                {project.description || "No detailed description has been added yet."}
              </p>
            </Card>

            <Card className="border border-border/80 bg-card p-6 shadow-sm">
              <div className="mb-4 flex items-center justify-between gap-3">
                <div>
                  <h2 className="text-lg font-bold text-foreground">Project details</h2>
                  <p className="mt-1 text-sm text-muted-foreground">Full proposal metadata and funding state.</p>
                </div>
              </div>

              <dl className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
                <div className="rounded-xl border border-border/70 bg-secondary/25 p-3.5">
                  <dt className="text-[11px] font-bold uppercase tracking-[0.18em] text-muted-foreground">Category</dt>
                  <dd className="mt-1.5 text-sm font-semibold capitalize text-foreground">{project.category}</dd>
                </div>
                <div className="rounded-xl border border-border/70 bg-secondary/25 p-3.5">
                  <dt className="text-[11px] font-bold uppercase tracking-[0.18em] text-muted-foreground">Location</dt>
                  <dd className="mt-1.5 text-sm font-semibold text-foreground">{project.location || "Not provided"}</dd>
                </div>
                <div className="rounded-xl border border-border/70 bg-secondary/25 p-3.5">
                  <dt className="text-[11px] font-bold uppercase tracking-[0.18em] text-muted-foreground">Funding goal</dt>
                  <dd className="mt-1.5 text-sm font-semibold text-foreground">{formatCurrency(project.fundingGoal)}</dd>
                </div>
                <div className="rounded-xl border border-border/70 bg-secondary/25 p-3.5">
                  <dt className="text-[11px] font-bold uppercase tracking-[0.18em] text-muted-foreground">Funds raised</dt>
                  <dd className="mt-1.5 text-sm font-semibold text-foreground">{formatCurrency(project.fundedAmount)}</dd>
                </div>
                <div className="rounded-xl border border-border/70 bg-secondary/25 p-3.5">
                  <dt className="text-[11px] font-bold uppercase tracking-[0.18em] text-muted-foreground">Escrow balance</dt>
                  <dd className="mt-1.5 text-sm font-semibold text-foreground">{formatCurrency(project.escrowBalance)}</dd>
                </div>
                <div className="rounded-xl border border-border/70 bg-secondary/25 p-3.5">
                  <dt className="text-[11px] font-bold uppercase tracking-[0.18em] text-muted-foreground">Released funds</dt>
                  <dd className="mt-1.5 text-sm font-semibold text-foreground">{formatCurrency(project.releasedAmount)}</dd>
                </div>
                <div className="rounded-xl border border-border/70 bg-secondary/25 p-3.5">
                  <dt className="text-[11px] font-bold uppercase tracking-[0.18em] text-muted-foreground">Owner</dt>
                  <dd className="mt-1.5 text-sm font-semibold text-foreground">{ownerName}</dd>
                </div>
                <div className="rounded-xl border border-border/70 bg-secondary/25 p-3.5">
                  <dt className="text-[11px] font-bold uppercase tracking-[0.18em] text-muted-foreground">Created</dt>
                  <dd className="mt-1.5 text-sm font-semibold text-foreground">{new Date(project.createdAt).toLocaleDateString()}</dd>
                </div>
                <div className="rounded-xl border border-border/70 bg-secondary/25 p-3.5">
                  <dt className="text-[11px] font-bold uppercase tracking-[0.18em] text-muted-foreground">Updated</dt>
                  <dd className="mt-1.5 text-sm font-semibold text-foreground">{new Date(project.updatedAt).toLocaleDateString()}</dd>
                </div>
                <div className="rounded-xl border border-border/70 bg-secondary/25 p-3.5">
                  <dt className="text-[11px] font-bold uppercase tracking-[0.18em] text-muted-foreground">Contributors</dt>
                  <dd className="mt-1.5 text-sm font-semibold text-foreground">{donations.length}</dd>
                </div>
                <div className="rounded-xl border border-border/70 bg-secondary/25 p-3.5">
                  <dt className="text-[11px] font-bold uppercase tracking-[0.18em] text-muted-foreground">Milestones</dt>
                  <dd className="mt-1.5 text-sm font-semibold text-foreground">{milestones.length}</dd>
                </div>
                <div className="rounded-xl border border-border/70 bg-secondary/25 p-3.5">
                  <dt className="text-[11px] font-bold uppercase tracking-[0.18em] text-muted-foreground">Status</dt>
                  <dd className="mt-1.5 text-sm font-semibold capitalize text-foreground">{project.status}</dd>
                </div>
              </dl>
            </Card>

            <Card className="border border-border/80 bg-card p-6 shadow-sm">
              <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-lg font-bold text-foreground">Milestones</h2>
                  <p className="mt-1 text-sm text-muted-foreground">Status and proof submissions for each milestone.</p>
                </div>
              </div>
              {milestones.length ? (
                <div className="space-y-4">
                  {milestones.map((m) => (
                    <Card key={m.id} className="rounded-2xl border border-border/70 bg-card p-5 shadow-sm">
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <p className="font-semibold text-foreground">{m.title}</p>
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
                                  <a key={url} href={url} target="_blank" rel="noopener noreferrer" className="overflow-hidden rounded-xl border border-border bg-muted">
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
                <Card className="rounded-2xl border border-border/70 bg-card p-8 text-center shadow-sm">
                  <p className="text-sm text-muted-foreground">No milestones defined.</p>
                </Card>
              )}
            </Card>

            <Card className="border border-border/80 bg-card p-6 shadow-sm">
              <div className="mb-5 flex items-center gap-2 border-b border-border/60 pb-3">
                <Receipt className="size-5 text-primary" />
                <h2 className="text-lg font-bold text-foreground">Audit Trail</h2>
              </div>
              {project.status === "completed" && (
                <div className="mb-4 rounded-2xl border border-amber-500/20 bg-amber-500/5 p-4">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">Overflow balance in escrow</p>
                  <p className="mt-1 text-lg font-bold text-foreground">{formatCurrency(project.escrowBalance)}</p>
                  <p className="mt-1 text-sm text-muted-foreground">Remaining escrow for this completed project.</p>
                </div>
              )}
              <AuditTrailList transactions={transactions} />
            </Card>
          </div>

          <div className="flex flex-col gap-6">
            <Card className="border border-border/80 bg-card p-6 shadow-sm">
              <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-foreground">
                <Landmark className="size-4 text-primary" />
                Funding overview
              </div>
              <div className="space-y-3 text-sm text-muted-foreground">
                <div className="rounded-2xl bg-secondary/30 p-4">
                  <div className="text-xs uppercase tracking-[0.18em]">Raised</div>
                  <div className="mt-1 text-lg font-semibold text-foreground">{formatCurrency(project.fundedAmount)}</div>
                </div>
                <div className="rounded-2xl bg-secondary/30 p-4">
                  <div className="text-xs uppercase tracking-[0.18em]">Escrow</div>
                  <div className="mt-1 text-lg font-semibold text-foreground">{formatCurrency(project.escrowBalance)}</div>
                </div>
                <div className="rounded-2xl bg-secondary/30 p-4">
                  <div className="text-xs uppercase tracking-[0.18em]">Released</div>
                  <div className="mt-1 text-lg font-semibold text-foreground">{formatCurrency(project.releasedAmount)}</div>
                </div>
              </div>
            </Card>

            <Card className="border border-border/80 bg-card p-6 shadow-sm">
              <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-foreground">
                <Sparkles className="size-4 text-primary" />
                Admin actions
              </div>
              <p className="text-sm text-muted-foreground">Use the review controls above to approve, reject, or start this project.</p>
            </Card>

            <Card className="border border-border/80 bg-card p-6 text-sm text-muted-foreground shadow-sm">
              <FileText className="mb-3 size-6 text-primary/80" />
              <p className="font-semibold text-foreground">Review notes</p>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-sm">
                <li>Check the project summary and description for completeness.</li>
                <li>Inspect milestone proof before approving downstream releases.</li>
                <li>Use the audit trail to trace funding movement.</li>
              </ul>
            </Card>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}
