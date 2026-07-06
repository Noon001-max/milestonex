import Link from "next/link"
import Image from "next/image"
import { notFound, redirect } from "next/navigation"
import { Edit2, PlusCircle, FileText } from "lucide-react"
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
      <main className="w-full py-4 sm:py-8">
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0">
              <h1 className="break-words text-2xl font-bold text-foreground sm:text-3xl">Manage: {project.title}</h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Owner dashboard for this project — controls and reports are private to you.
              </p>
            </div>

            <div className="grid w-full gap-2 sm:w-auto sm:grid-cols-2">
              <Link href={`/dashboard/projects/${projectId}/edit`} className="w-full sm:w-auto">
                <Button variant="outline" className="w-full sm:w-auto">
                  <Edit2 className="size-4 mr-2" />
                  Edit project
                </Button>
              </Link>
              <Link href={`/dashboard/projects/${projectId}/milestones`} className="w-full sm:w-auto">
                <Button variant="default" className="w-full sm:w-auto">
                  <PlusCircle className="size-4 mr-2" />
                  Manage milestones
                </Button>
              </Link>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            <div className="flex min-w-0 flex-col gap-6 lg:col-span-2">
              <div className="relative h-56 w-full overflow-hidden rounded-2xl bg-muted sm:aspect-[16/9] sm:h-auto">
                <Image src={project.imageUrl || "/hero-community.png"} alt={project.title} fill className="object-cover" />
              </div>

              <Card className="p-6">
                <h2 className="mb-3 text-lg font-bold text-foreground">Overview</h2>
                <p className="whitespace-pre-line break-words text-sm text-muted-foreground">{project.description}</p>
              </Card>

              <Card className="min-w-0 p-6">
                <div className="flex items-start justify-between gap-3">
                  <h2 className="text-lg font-bold text-foreground">Milestones</h2>
                  <Link href={`/dashboard/projects/${projectId}/milestones`}>
                    <Button variant="ghost" size="sm">Manage</Button>
                  </Link>
                </div>
                <div className="mt-4 min-w-0 overflow-x-hidden">
                  <MilestoneTimeline milestones={milestones} ownerView />
                </div>
              </Card>

              {/* Donations removed for owner-first view */}

              <Card className="p-6">
                <h2 className="text-lg font-bold text-foreground">Audit Trail</h2>
                {transactions.length === 0 ? (
                  <p className="mt-3 text-sm text-muted-foreground">No transactions recorded.</p>
                ) : (
                  <ul className="mt-3 divide-y divide-border/60 text-sm">
                    {transactions.map((t) => (
                      <li key={t.id} className="flex flex-col gap-1 py-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
                        <div className="min-w-0">
                          <p className="truncate font-semibold text-foreground">{t.note || t.type}</p>
                          <p className="mt-0.5 text-xs text-muted-foreground">{new Date(t.createdAt).toLocaleDateString()}</p>
                        </div>
                        <div className={`font-bold ${t.type === 'release' ? 'text-amber-600' : 'text-emerald-600'}`}>
                          {(t.type === 'release' ? '-' : '+')}{formatCurrency(t.amount)}
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </Card>
            </div>

            <div className="flex min-w-0 flex-col gap-6">
              <Card className="p-6 min-w-0">
                <FundingProgress funded={project.fundedAmount} goal={project.fundingGoal} released={project.releasedAmount} />

                <dl className="mt-5 grid grid-cols-1 gap-4 border-t border-border/60 pt-5 text-sm sm:grid-cols-2">
                  <div className="flex flex-col gap-1">
                    <dt className="text-xs uppercase tracking-wider text-muted-foreground">Escrow</dt>
                    <dd className="font-bold text-foreground">{formatCurrency(project.escrowBalance)}</dd>
                  </div>
                  <div className="flex flex-col gap-1">
                    <dt className="text-xs uppercase tracking-wider text-muted-foreground">Released</dt>
                    <dd className="font-bold text-foreground">{formatCurrency(project.releasedAmount)}</dd>
                  </div>
                  <div className="flex flex-col gap-1 sm:col-span-2">
                    <dt className="text-xs uppercase tracking-wider text-muted-foreground">Milestones</dt>
                    <dd className="font-bold text-foreground">{milestones.length}</dd>
                  </div>
                </dl>

                <div className="mt-5 flex flex-col gap-2">
                  <Link href={`/dashboard/projects/${projectId}/settings`} className="w-full">
                    <Button variant="outline" className="w-full sm:w-auto">Project Settings</Button>
                  </Link>
                  <Link href={`/dashboard/projects/${projectId}/payouts`} className="w-full">
                    <Button variant="secondary" className="w-full sm:w-auto">Payouts</Button>
                  </Link>
                </div>
              </Card>

              <Card className="p-6 text-sm text-muted-foreground">
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
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}
