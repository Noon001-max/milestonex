import Image from "next/image"
import Link from "next/link"
import { notFound, redirect } from "next/navigation"
import { ArrowLeft, Banknote, Edit2, FileText, Lock, MapPin, Receipt, ShieldCheck, Sparkles } from "lucide-react"
import { getSession } from "@/lib/session"
import { getOwnerName } from "@/app/actions/projects"
import {
  getProjectById,
  getProjectMilestones,
  getProjectDonations,
  getProjectTransactions,
} from "@/lib/queries"
import { formatCurrency } from "@/lib/roles"
import { SiteFooter } from "@/components/site-footer"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FundingProgress } from "@/components/funding-progress"
import { MilestoneTimeline } from "@/components/milestone-timeline"
import { StatusBadge } from "@/components/status-badge"

export const dynamic = "force-dynamic"

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const projectId = Number(id)
  if (Number.isNaN(projectId)) notFound()

  const [user, project] = await Promise.all([getSession(), getProjectById(projectId)])
  if (!user) redirect("/sign-in")
  if (!project || project.ownerId !== user.id) notFound()

  const [milestones, donations, transactions, ownerName] = await Promise.all([
    getProjectMilestones(projectId),
    getProjectDonations(projectId),
    getProjectTransactions(projectId),
    getOwnerName(project.ownerId),
  ])

  return (
    <div className="flex min-h-svh flex-col bg-background">
      <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:py-12 overflow-hidden">
        <Link
          href="/dashboard/projects"
          className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground transition hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          Back to my proposals
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

            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                <span className="capitalize">{project.category}</span>
                {project.location && (
                  <>
                    <span aria-hidden>•</span>
                    <span className="inline-flex items-center gap-1">
                      <MapPin className="size-3.5" />
                      {project.location}
                    </span>
                  </>
                )}
              </div>
              <h1 className="mt-2 text-balance text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
                {project.title}
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">Owned by {ownerName}</p>

              <div className="mt-4 flex flex-wrap gap-3">
                <Link href={`/dashboard/projects/${projectId}/edit`}>
                  <Button variant="outline" className="rounded-xl">
                    <Edit2 className="mr-2 size-4" />
                    Edit project
                  </Button>
                </Link>
                <Link href={`/dashboard/projects/${projectId}/milestones`}>
                  <Button className="rounded-xl">
                    <ShieldCheck className="mr-2 size-4" />
                    Submit proof
                  </Button>
                </Link>
              </div>
            </div>

            <Card className="border border-border/80 bg-card p-6 shadow-sm">
              <h2 className="mb-3 text-lg font-bold text-foreground">About this project</h2>
              <p className="whitespace-pre-line break-words text-sm leading-relaxed text-muted-foreground sm:text-base">
                {project.description}
              </p>
            </Card>

            <Card className="border border-border/80 bg-card p-6 shadow-sm">
              <div className="mb-5 flex items-center justify-between gap-3">
                <div>
                  <h2 className="text-lg font-bold text-foreground">Project details</h2>
                  <p className="mt-1 text-sm text-muted-foreground">All proposal metadata in one place.</p>
                </div>
              </div>

              <dl className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                <div className="rounded-2xl border border-border/70 bg-secondary/30 p-4">
                  <dt className="text-[11px] font-bold uppercase tracking-[0.18em] text-muted-foreground">Summary</dt>
                  <dd className="mt-2 text-sm leading-6 text-foreground">{project.summary}</dd>
                </div>
                <div className="rounded-2xl border border-border/70 bg-secondary/30 p-4">
                  <dt className="text-[11px] font-bold uppercase tracking-[0.18em] text-muted-foreground">Category</dt>
                  <dd className="mt-2 text-sm font-semibold capitalize text-foreground">{project.category}</dd>
                </div>
                <div className="rounded-2xl border border-border/70 bg-secondary/30 p-4">
                  <dt className="text-[11px] font-bold uppercase tracking-[0.18em] text-muted-foreground">Location</dt>
                  <dd className="mt-2 text-sm font-semibold text-foreground">{project.location || "Not provided"}</dd>
                </div>
                <div className="rounded-2xl border border-border/70 bg-secondary/30 p-4">
                  <dt className="text-[11px] font-bold uppercase tracking-[0.18em] text-muted-foreground">Funding goal</dt>
                  <dd className="mt-2 text-sm font-semibold text-foreground">{formatCurrency(project.fundingGoal)}</dd>
                </div>
                <div className="rounded-2xl border border-border/70 bg-secondary/30 p-4">
                  <dt className="text-[11px] font-bold uppercase tracking-[0.18em] text-muted-foreground">Funds raised</dt>
                  <dd className="mt-2 text-sm font-semibold text-foreground">{formatCurrency(project.fundedAmount)}</dd>
                </div>
                <div className="rounded-2xl border border-border/70 bg-secondary/30 p-4">
                  <dt className="text-[11px] font-bold uppercase tracking-[0.18em] text-muted-foreground">Escrow balance</dt>
                  <dd className="mt-2 text-sm font-semibold text-foreground">{formatCurrency(project.escrowBalance)}</dd>
                </div>
                <div className="rounded-2xl border border-border/70 bg-secondary/30 p-4">
                  <dt className="text-[11px] font-bold uppercase tracking-[0.18em] text-muted-foreground">Released funds</dt>
                  <dd className="mt-2 text-sm font-semibold text-foreground">{formatCurrency(project.releasedAmount)}</dd>
                </div>
                <div className="rounded-2xl border border-border/70 bg-secondary/30 p-4">
                  <dt className="text-[11px] font-bold uppercase tracking-[0.18em] text-muted-foreground">Created</dt>
                  <dd className="mt-2 text-sm font-semibold text-foreground">{new Date(project.createdAt).toLocaleDateString()}</dd>
                </div>
                <div className="rounded-2xl border border-border/70 bg-secondary/30 p-4">
                  <dt className="text-[11px] font-bold uppercase tracking-[0.18em] text-muted-foreground">Updated</dt>
                  <dd className="mt-2 text-sm font-semibold text-foreground">{new Date(project.updatedAt).toLocaleDateString()}</dd>
                </div>
                <div className="rounded-2xl border border-border/70 bg-secondary/30 p-4">
                  <dt className="text-[11px] font-bold uppercase tracking-[0.18em] text-muted-foreground">Owner</dt>
                  <dd className="mt-2 text-sm font-semibold text-foreground">{ownerName}</dd>
                </div>
                <div className="rounded-2xl border border-border/70 bg-secondary/30 p-4">
                  <dt className="text-[11px] font-bold uppercase tracking-[0.18em] text-muted-foreground">Contributors</dt>
                  <dd className="mt-2 text-sm font-semibold text-foreground">{donations.length}</dd>
                </div>
                <div className="rounded-2xl border border-border/70 bg-secondary/30 p-4">
                  <dt className="text-[11px] font-bold uppercase tracking-[0.18em] text-muted-foreground">Milestones</dt>
                  <dd className="mt-2 text-sm font-semibold text-foreground">{milestones.length}</dd>
                </div>
              </dl>
            </Card>

            <Card className="border border-border/80 bg-card p-6 shadow-sm">
              <div className="mb-5 flex items-center justify-between gap-3">
                <div>
                  <h2 className="text-lg font-bold text-foreground">Milestone snapshot</h2>
                  <p className="mt-1 text-sm text-muted-foreground">Proof work lives on the dedicated proof board.</p>
                </div>
                <Link href={`/dashboard/projects/${projectId}/milestones`}>
                  <Button variant="ghost" size="sm">Open proof board</Button>
                </Link>
              </div>
              <MilestoneTimeline milestones={milestones} ownerView />
            </Card>

            <Card className="border border-border/80 bg-card p-6 shadow-sm">
              <div className="mb-5 flex items-center gap-2 border-b border-border/60 pb-3">
                <Receipt className="size-5 text-primary" />
                <h2 className="text-lg font-bold text-foreground">Audit Trail</h2>
              </div>
              {transactions.length === 0 ? (
                <p className="py-2 text-sm text-muted-foreground">No transactions recorded yet.</p>
              ) : (
                <ul className="flex flex-col divide-y divide-border/60">
                  {transactions.map((t) => {
                    const isRelease = t.type === "release"
                    return (
                      <li key={t.id} className="flex items-center justify-between gap-3 py-3.5">
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-foreground">{t.note ?? t.type}</p>
                          <p className="mt-0.5 text-xs capitalize text-muted-foreground">
                            {t.type.replace("_", " ")} • {new Date(t.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <span className={`text-sm font-bold ${isRelease ? "text-amber-600 dark:text-amber-400" : "text-emerald-600 dark:text-emerald-400"}`}>
                          {isRelease ? "-" : "+"}
                          {formatCurrency(t.amount)}
                        </span>
                      </li>
                    )
                  })}
                </ul>
              )}
            </Card>
          </div>

          <div className="flex flex-col gap-6">
            <Card className="border border-border/80 bg-card p-6 shadow-sm">
              <FundingProgress
                funded={project.fundedAmount}
                goal={project.fundingGoal}
                released={project.releasedAmount}
              />
              <dl className="mt-5 grid grid-cols-2 gap-4 border-t border-border/60 pt-5 text-sm">
                <div className="flex flex-col gap-1">
                  <dt className="flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    <Lock className="size-3.5 text-primary/70" /> Escrow
                  </dt>
                  <dd className="mt-0.5 text-base font-bold text-foreground">{formatCurrency(project.escrowBalance)}</dd>
                </div>
                <div className="flex flex-col gap-1">
                  <dt className="flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    <Banknote className="size-3.5 text-primary/70" /> Released
                  </dt>
                  <dd className="mt-0.5 text-base font-bold text-foreground">{formatCurrency(project.releasedAmount)}</dd>
                </div>
                <div className="flex flex-col gap-1">
                  <dt className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Contributors</dt>
                  <dd className="mt-0.5 text-base font-bold text-foreground">{donations.length}</dd>
                </div>
                <div className="flex flex-col gap-1">
                  <dt className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Milestones</dt>
                  <dd className="mt-0.5 text-base font-bold text-foreground">{milestones.length}</dd>
                </div>
              </dl>
            </Card>

            <Card className="border border-border/80 bg-card p-6 shadow-sm">
              <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                <Sparkles className="size-4 text-primary" />
                Quick actions
              </div>
              <div className="mt-4 flex flex-col gap-2">
                <Link href={`/dashboard/projects/${projectId}/milestones`} className="w-full">
                  <Button className="w-full rounded-xl">Open proof submission</Button>
                </Link>
                <Link href={`/dashboard/projects/${projectId}/edit`} className="w-full">
                  <Button variant="outline" className="w-full rounded-xl">Edit details</Button>
                </Link>
              </div>
            </Card>

            <Card className="border border-border/80 bg-card p-6 text-sm text-muted-foreground shadow-sm">
              <FileText className="mb-3 size-6 text-primary/80" />
              <p className="font-semibold text-foreground">Helpful tips</p>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-sm">
                <li>Keep milestone evidence specific and date-based.</li>
                <li>Use the proof board to submit work for the unlocked milestone.</li>
                <li>Review your project details before the next approval cycle.</li>
              </ul>
            </Card>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}