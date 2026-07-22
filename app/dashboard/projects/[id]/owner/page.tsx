import Link from "next/link"
import Image from "next/image"
import { notFound, redirect } from "next/navigation"
import { Edit2, FileText, Lock, PlusCircle, Receipt, Banknote } from "lucide-react"
import { getSession } from "@/lib/session"
import {
  getProjectById,
  getProjectMilestones,
  getProjectTransactions,
} from "@/lib/queries"
import { formatCurrency } from "@/lib/roles"
// SiteHeader is provided by the dashboard layout (DashboardShell)
import { SiteFooter } from "@/components/site-footer"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FundingProgress } from "@/components/funding-progress"
import { MilestoneTimeline } from "@/components/milestone-timeline"
import { StatusBadge } from "@/components/status-badge"
import { AuditTrailList } from "@/components/audit-trail-list"

export const dynamic = "force-dynamic"

export default async function OwnerProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const projectId = Number(id)
  if (Number.isNaN(projectId)) notFound()

  const [user, project, milestones, transactions] = await Promise.all([
    getSession(),
    getProjectById(projectId),
    getProjectMilestones(projectId),
    getProjectTransactions(projectId),
  ])

  if (!project) notFound()
  if (!user) redirect(`/sign-in`)
  if (user.id !== project.ownerId) redirect(`/dashboard/projects/${projectId}`)

  return (
    <div className="w-full overflow-x-clip">
      <main className="mx-auto w-full max-w-6xl overflow-hidden px-4 py-6 sm:px-4 sm:py-8 lg:px-6">
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="flex min-w-0 flex-col gap-6 lg:col-span-2">
            <div className="relative aspect-[16/9] overflow-hidden rounded-xl border border-border bg-muted">
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

            <div className="min-w-0">
              <p className="text-sm text-muted-foreground">
                Project proposer dashboard for this project. Controls and reports are private to you.
              </p>
              <h1 className="mt-2 break-words text-balance text-3xl font-semibold tracking-tight text-foreground">
                {project.title}
              </h1>
              <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
                <Link href={`/dashboard/projects/${projectId}/edit`}>
                  <Button variant="outline">
                    <Edit2 className="mr-2 size-4" />
                    Edit project
                  </Button>
                </Link>
                <Link href={`/dashboard/projects/${projectId}/milestones`}>
                  <Button variant="default">
                    <PlusCircle className="mr-2 size-4" />
                    Manage milestones
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
                <h2 className="text-lg font-bold text-foreground">Milestones</h2>
                <Link href={`/dashboard/projects/${projectId}/milestones`}>
                  <Button variant="ghost" size="sm">Manage</Button>
                </Link>
              </div>
              <MilestoneTimeline milestones={milestones} ownerView />
            </Card>

            <Card className="border border-border/80 bg-card p-6 shadow-sm">
              <div className="mb-5 flex items-center gap-2 border-b border-border/60 pb-3">
                <Receipt className="size-5 text-primary" />
                <h2 className="text-lg font-bold text-foreground">Audit Trail</h2>
              </div>
              <AuditTrailList transactions={transactions} />
            </Card>
          </div>

          <div className="flex flex-col gap-6">
            <Card className="border border-border/80 bg-card p-6 shadow-sm">
              <FundingProgress
                funded={project.fundedAmount}
                goal={project.fundingGoal}
                released={project.releasedAmount}
              />
              <dl className="mt-5 grid grid-cols-1 gap-4 border-t border-border/60 pt-5 text-sm sm:grid-cols-2">
                <div className="flex flex-col gap-1">
                  <dt className="flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    <Lock className="size-3.5 text-primary/70" /> Escrow
                  </dt>
                  <dd className="mt-0.5 text-base font-bold text-foreground">
                    {formatCurrency(project.escrowBalance)}
                  </dd>
                </div>
                <div className="flex flex-col gap-1">
                  <dt className="flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    <Banknote className="size-3.5 text-primary/70" /> Released
                  </dt>
                  <dd className="mt-0.5 text-base font-bold text-foreground">
                    {formatCurrency(project.releasedAmount)}
                  </dd>
                </div>
                <div className="flex flex-col gap-1">
                  <dt className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Milestones</dt>
                  <dd className="mt-0.5 text-base font-bold text-foreground">{milestones.length}</dd>
                </div>
                <div className="flex flex-col gap-1">
                  <dt className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Status</dt>
                  <dd className="mt-0.5 text-base font-bold text-foreground capitalize">{project.status}</dd>
                </div>
              </dl>

              <div className="mt-5 flex flex-col gap-2">
                <Link href={`/dashboard/projects/${projectId}/settings`} className="w-full">
                  <Button variant="outline" className="w-full">Project Settings</Button>
                </Link>
                <Link href={`/dashboard/projects/${projectId}/payouts`} className="w-full">
                  <Button variant="secondary" className="w-full">Payouts</Button>
                </Link>
              </div>
            </Card>

            <Card className="border border-border/80 bg-card p-6 text-sm text-muted-foreground shadow-sm">
              <FileText className="mb-3 size-6 text-primary/80" />
              <p className="font-semibold text-foreground">Helpful tips</p>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-sm">
                <li>Keep milestone descriptions clear and time-bound.</li>
                <li>Upload progress evidence to accelerate releases.</li>
                <li>Respond to supporter messages promptly.</li>
              </ul>
            </Card>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}
