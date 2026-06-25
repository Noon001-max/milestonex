import Image from "next/image"
import Link from "next/link"
import { notFound, redirect } from "next/navigation"
import { ArrowLeft, MapPin, Lock, Banknote, Receipt } from "lucide-react"
import { getSession } from "@/lib/session"
import {
  getProjectById,
  getProjectMilestones,
  getProjectDonations,
  getProjectTransactions,
} from "@/lib/queries"
import { getOwnerName } from "@/app/actions/projects"
import { formatCurrency } from "@/lib/roles"
import { Card } from "@/components/ui/card"
import { StatusBadge } from "@/components/status-badge"
import { FundingProgress } from "@/components/funding-progress"
import { MilestoneTimeline } from "@/components/milestone-timeline"
import { DonateWidget } from "@/components/donate-widget"
import { DisputeForm } from "@/components/dispute-form"

export const dynamic = "force-dynamic"

export default async function DashboardProjectDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const projectId = Number(id)
  if (Number.isNaN(projectId)) notFound()

  const user = await getSession()
  if (!user) {
    redirect("/sign-in")
  }

  const project = await getProjectById(projectId)
  if (!project) notFound()

  const [milestones, donations, transactions, ownerName] =
    await Promise.all([
      getProjectMilestones(projectId),
      getProjectDonations(projectId),
      getProjectTransactions(projectId),
      getOwnerName(project.ownerId),
    ])

  const canFund = ["approved", "funding", "started"].includes(project.status)

  return (
    <div className="flex min-h-svh flex-col bg-background">
      <main className="mx-auto w-full max-w-6xl px-4 py-8">
        <Link
          href="/dashboard/explore"
          className="mb-6 inline-flex items-center gap-1.5 text-xs font-bold text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="size-3.5" />
          <span>Back to explorer</span>
        </Link>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Main column */}
          <div className="flex flex-col gap-6 lg:col-span-2">
            <div className="relative aspect-[16/9] overflow-hidden rounded-2xl border border-border shadow-sm">
              <Image
                src={project.imageUrl || "/hero-community.png"}
                alt={project.title}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 66vw"
                className="object-cover"
              />
              <div className="absolute left-4 top-4">
                <StatusBadge status={project.status} />
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-primary uppercase tracking-wider">
                <span className="capitalize">{project.category}</span>
                {project.location && (
                  <>
                    <span className="text-muted-foreground" aria-hidden>•</span>
                    <span className="inline-flex items-center gap-1 font-semibold text-muted-foreground">
                      <MapPin className="size-3.5" />
                      {project.location}
                    </span>
                  </>
                )}
              </div>
              <h1 className="mt-2.5 text-balance text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
                {project.title}
              </h1>
              <p className="mt-1 text-xs text-muted-foreground font-semibold">
                Proposed by <span className="text-foreground font-bold">{ownerName}</span>
              </p>
            </div>

            <Card className="p-6 border border-border bg-card shadow-sm">
              <h2 className="mb-4 text-base font-bold text-foreground uppercase tracking-wider">
                About this project
              </h2>
              <p className="whitespace-pre-line leading-relaxed text-muted-foreground text-sm sm:text-base font-medium">
                {project.description}
              </p>
            </Card>

            <Card className="p-6 border border-border bg-card shadow-sm">
              <h2 className="mb-5 text-base font-bold text-foreground uppercase tracking-wider">
                Project Milestones
              </h2>
              <MilestoneTimeline milestones={milestones} />
            </Card>

            {/* Transparency / audit trail */}
            <Card className="p-6 border border-border bg-card shadow-sm">
              <div className="mb-5 flex items-center gap-2 pb-3 border-b border-border/65">
                <Receipt className="size-5 text-primary" />
                <h2 className="text-base font-bold text-foreground uppercase tracking-wider">
                  Audit Trail
                </h2>
              </div>
              {transactions.length === 0 ? (
                <p className="text-xs text-muted-foreground py-2 font-semibold">
                  No escrow movements or validations recorded.
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
                          <p className="truncate text-xs font-bold text-foreground">
                            {t.note ?? t.type}
                          </p>
                          <p className="text-[10px] capitalize text-muted-foreground mt-0.5 font-bold">
                            {t.type.replace("_", " ")} •{" "}
                            {new Date(t.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <span
                          className={`text-xs font-bold ${
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
            <Card className="p-6 border border-border bg-card shadow-sm">
              <FundingProgress
                funded={project.fundedAmount}
                goal={project.fundingGoal}
                released={project.releasedAmount}
              />
              <dl className="mt-5 grid grid-cols-2 gap-4 border-t border-border/60 pt-5 text-xs">
                <div className="flex flex-col gap-1">
                  <dt className="flex items-center gap-1 text-muted-foreground font-bold uppercase tracking-wider">
                    <Lock className="size-3.5 text-primary/70" /> Escrow
                  </dt>
                  <dd className="font-extrabold text-foreground text-base mt-0.5">
                    {formatCurrency(project.escrowBalance)}
                  </dd>
                </div>
                <div className="flex flex-col gap-1">
                  <dt className="flex items-center gap-1 text-muted-foreground font-bold uppercase tracking-wider">
                    <Banknote className="size-3.5 text-primary/70" /> Released
                  </dt>
                  <dd className="font-extrabold text-foreground text-base mt-0.5">
                    {formatCurrency(project.releasedAmount)}
                  </dd>
                </div>
                <div className="flex flex-col gap-1 pt-1.5">
                  <dt className="text-muted-foreground font-bold uppercase tracking-wider">Contributors</dt>
                  <dd className="font-extrabold text-foreground text-base mt-0.5">
                    {donations.length}
                  </dd>
                </div>
                <div className="flex flex-col gap-1 pt-1.5">
                  <dt className="text-muted-foreground font-bold uppercase tracking-wider">Milestones</dt>
                  <dd className="font-extrabold text-foreground text-base mt-0.5">
                    {milestones.length}
                  </dd>
                </div>
              </dl>
            </Card>

            {canFund ? (
              <Card className="p-6 border border-border bg-card shadow-sm">
                <h2 className="mb-4 text-sm font-bold text-foreground uppercase tracking-wider">
                  Support Project
                </h2>
                <DonateWidget projectId={project.id} isAuthed={true} />
              </Card>
            ) : (
              <Card className="p-6 text-xs text-muted-foreground font-bold text-center border border-border bg-card shadow-sm">
                Contributions are disabled for this stage.
              </Card>
            )}

            <Card className="flex items-center justify-between gap-3 p-6 border border-border bg-card shadow-sm">
              <div>
                <p className="text-xs font-bold text-foreground">
                  Raise milestone claim dispute?
                </p>
                <p className="text-[10px] text-muted-foreground leading-relaxed mt-0.5">
                  Submit a ticket for audit evaluation.
                </p>
              </div>
              <DisputeForm projectId={project.id} isAuthed={true} />
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
