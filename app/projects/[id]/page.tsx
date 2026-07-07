import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, Banknote, Calendar, Lock, MapPin, Receipt, Sparkles, Users } from "lucide-react"
import { getSession } from "@/lib/session"
import {
  getProjectById,
  getProjectMilestones,
  getProjectDonations,
  getProjectTransactions,
} from "@/lib/queries"
import { getOwnerName } from "@/app/actions/projects"
import { formatCurrency } from "@/lib/roles"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Card } from "@/components/ui/card"
import { StatusBadge } from "@/components/status-badge"
import { FundingProgress } from "@/components/funding-progress"
import { MilestoneTimeline } from "@/components/milestone-timeline"
import { DonateWidget } from "@/components/donate-widget"
import { DisputeForm } from "@/components/dispute-form"

export const dynamic = "force-dynamic"

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const projectId = Number(id)
  if (Number.isNaN(projectId)) notFound()

  const project = await getProjectById(projectId)
  if (!project) notFound()

  const [user, milestones, donations, transactions, ownerName] =
    await Promise.all([
      getSession(),
      getProjectMilestones(projectId),
      getProjectDonations(projectId),
      getProjectTransactions(projectId),
      getOwnerName(project.ownerId),
    ])

  const canFund = ["approved", "funding", "started"].includes(project.status)

  return (
    <div className="flex min-h-svh flex-col bg-background">
      <SiteHeader user={user} />
      <main className="mx-auto w-full max-w-6xl overflow-hidden px-4 py-8 sm:py-12">
        <Link
          href="/projects"
          className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          Back to projects
        </Link>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Main column */}
          <div className="flex flex-col gap-6 lg:col-span-2">
            <div className="relative aspect-[16/9] overflow-hidden rounded-2xl border border-border bg-muted shadow-sm">
              <Image
                src={project.imageUrl || "/hero-community.png"}
                alt={project.title}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 66vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/35 via-transparent to-transparent" />
              <div className="absolute left-4 top-4">
                <StatusBadge status={project.status} />
              </div>
            </div>

            <div className="min-w-0 rounded-2xl border border-border/70 bg-card p-5 shadow-sm sm:p-6">
              <div className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                <span className="rounded-full bg-secondary/60 px-2.5 py-1 text-foreground/80 capitalize">{project.category}</span>
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
              <p className="mt-2 text-sm text-muted-foreground">
                by {ownerName}
              </p>
              <p className="mt-4 max-w-3xl whitespace-pre-line text-sm leading-7 text-foreground/80 sm:text-base">
                {project.summary || project.description || "No summary has been added yet."}
              </p>
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
                  <p className="mt-1 text-sm text-muted-foreground">All the key facts in one compact view.</p>
                </div>
              </div>

              <dl className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
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
                  <dt className="text-[11px] font-bold uppercase tracking-[0.18em] text-muted-foreground">Contributors</dt>
                  <dd className="mt-1.5 text-sm font-semibold text-foreground">{donations.length}</dd>
                </div>
                <div className="rounded-xl border border-border/70 bg-secondary/25 p-3.5">
                  <dt className="text-[11px] font-bold uppercase tracking-[0.18em] text-muted-foreground">Milestones</dt>
                  <dd className="mt-1.5 text-sm font-semibold text-foreground">{milestones.length}</dd>
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
                  <dt className="text-[11px] font-bold uppercase tracking-[0.18em] text-muted-foreground">Owner</dt>
                  <dd className="mt-1.5 text-sm font-semibold text-foreground">{ownerName}</dd>
                </div>
              </dl>
            </Card>

            <Card className="p-6 border border-border/80 bg-card shadow-sm">
              <h2 className="mb-3 text-lg font-bold text-foreground">
                Milestones
              </h2>
              <MilestoneTimeline milestones={milestones} />
            </Card>

            {/* Transparency / audit trail */}
            <Card className="p-6 border border-border/80 bg-card shadow-sm">
              <div className="mb-5 flex items-center gap-2 pb-3 border-b border-border/60">
                <Receipt className="size-5 text-primary" />
                <h2 className="text-lg font-bold text-foreground">
                  Audit Trail
                </h2>
              </div>
              {transactions.length === 0 ? (
                <p className="text-sm text-muted-foreground py-2">
                  No transactions recorded yet.
                </p>
              ) : (
                <ul className="flex flex-col divide-y divide-border/60">
                  {transactions.map((t) => {
                    const isRelease = t.type === "release"
                    return (
                      <li
                        key={t.id}
                        className="flex items-center justify-between gap-3 py-3.5"
                      >
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-foreground">
                            {t.note ?? t.type}
                          </p>
                          <p className="text-xs capitalize text-muted-foreground mt-0.5">
                            {t.type.replace("_", " ")} •{" "}
                            {new Date(t.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <span
                          className={`text-sm font-bold ${
                            isRelease
                              ? "text-amber-600 dark:text-amber-400"
                              : "text-emerald-600 dark:text-emerald-400"
                          }`}
                        >
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

          {/* Sidebar */}
          <div className="flex flex-col gap-6">
            <Card className="p-6 border border-border/80 bg-card shadow-sm">
              <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                <Sparkles className="size-4 text-primary" />
                Project overview
              </div>
              <div className="mt-4 grid grid-cols-2 gap-3">
                <div className="rounded-2xl bg-secondary/30 p-4">
                  <div className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-[0.18em] text-muted-foreground">
                    <Users className="size-3.5" /> Supporters
                  </div>
                  <div className="mt-2 text-2xl font-semibold text-foreground">{donations.length}</div>
                </div>
                <div className="rounded-2xl bg-secondary/30 p-4">
                  <div className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-[0.18em] text-muted-foreground">
                    <Calendar className="size-3.5" /> Milestones
                  </div>
                  <div className="mt-2 text-2xl font-semibold text-foreground">{milestones.length}</div>
                </div>
              </div>
              <FundingProgress
                funded={project.fundedAmount}
                goal={project.fundingGoal}
                released={project.releasedAmount}
              />
              <dl className="mt-5 grid grid-cols-2 gap-4 border-t border-border/60 pt-5 text-sm">
                <div className="flex flex-col gap-1">
                  <dt className="flex items-center gap-1 text-muted-foreground font-semibold text-xs uppercase tracking-wider">
                    <Lock className="size-3.5 text-primary/70" /> Escrow
                  </dt>
                  <dd className="font-bold text-foreground text-base mt-0.5">
                    {formatCurrency(project.escrowBalance)}
                  </dd>
                </div>
                <div className="flex flex-col gap-1">
                  <dt className="flex items-center gap-1 text-muted-foreground font-semibold text-xs uppercase tracking-wider">
                    <Banknote className="size-3.5 text-primary/70" /> Released
                  </dt>
                  <dd className="font-bold text-foreground text-base mt-0.5">
                    {formatCurrency(project.releasedAmount)}
                  </dd>
                </div>
                <div className="flex flex-col gap-1">
                  <dt className="text-muted-foreground font-semibold text-xs uppercase tracking-wider">Contributors</dt>
                  <dd className="font-bold text-foreground text-base mt-0.5">
                    {donations.length}
                  </dd>
                </div>
                <div className="flex flex-col gap-1">
                  <dt className="text-muted-foreground font-semibold text-xs uppercase tracking-wider">Milestones</dt>
                  <dd className="font-bold text-foreground text-base mt-0.5">
                    {milestones.length}
                  </dd>
                </div>
              </dl>
            </Card>

            {canFund ? (
              <Card className="p-6">
                <h2 className="mb-4 text-lg font-semibold text-foreground">
                  Support this project
                </h2>
                <DonateWidget projectId={project.id} isAuthed={!!user} />
              </Card>
            ) : (
              <Card className="p-6 text-sm text-muted-foreground">
                This project is not currently accepting contributions.
              </Card>
            )}

            <Card className="flex items-center justify-between gap-3 p-6">
              <div>
                <p className="text-sm font-medium text-foreground">
                  See something wrong?
                </p>
                <p className="text-xs text-muted-foreground">
                  Report it to administrators.
                </p>
              </div>
              <DisputeForm projectId={project.id} isAuthed={!!user} />
            </Card>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}
