import Link from "next/link"
import Image from "next/image"
import { notFound, redirect } from "next/navigation"
import { Edit2, PlusCircle, Users, FileText } from "lucide-react"
import { getSession } from "@/lib/session"
import {
  getProjectById,
  getProjectMilestones,
  getProjectDonations,
  getProjectTransactions,
} from "@/lib/queries"
import { formatCurrency } from "@/lib/roles"
import { SiteHeader } from "@/components/site-header"
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

  const [user, project, milestones, donations, transactions] = await Promise.all([
    getSession(),
    getProjectById(projectId),
    getProjectMilestones(projectId),
    getProjectDonations(projectId),
    getProjectTransactions(projectId),
  ])

  if (!project) notFound()
  if (!user) redirect(`/sign-in`)
  if (user.id !== project.ownerId) redirect(`/dashboard/projects/${projectId}`)

  const totalDonated = donations.reduce((s, d) => s + d.amount, 0)

  return (
    <div className="flex min-h-svh flex-col bg-background">
      <SiteHeader user={user} />
      <main className="mx-auto w-full max-w-6xl px-4 py-8">
        <div className="mb-6 flex items-center justify-between gap-4">
          <div className="min-w-0">
            <h1 className="text-3xl font-bold text-foreground">Manage: {project.title}</h1>
            <p className="mt-1 text-sm text-muted-foreground">Owner dashboard for this project — controls and reports are private to you.</p>
          </div>
          <div className="flex items-center gap-2">
            <Link href={`/dashboard/projects/${projectId}/edit`}>
              <Button variant="outline">
                <Edit2 className="size-4 mr-2" />
                Edit project
              </Button>
            </Link>
            <Link href={`/dashboard/projects/${projectId}/milestones`}>
              <Button variant="default">
                <PlusCircle className="size-4 mr-2" />
                Manage milestones
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 flex flex-col gap-6">
            <div className="relative aspect-[16/9] overflow-hidden rounded-xl border border-border bg-muted">
              <Image src={project.imageUrl || "/hero-community.png"} alt={project.title} fill className="object-cover" />
            </div>

            <Card className="p-6">
              <h2 className="text-lg font-bold text-foreground mb-3">Overview</h2>
              <p className="text-sm text-muted-foreground whitespace-pre-line">{project.description}</p>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-foreground">Milestones</h2>
                <Link href={`/dashboard/projects/${projectId}/milestones`}>
                  <Button variant="ghost" size="sm">Manage</Button>
                </Link>
              </div>
              <div className="mt-4">
                <MilestoneTimeline milestones={milestones} ownerView />
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-foreground">Donations</h2>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Users className="size-4" />
                  <span>{donations.length} supporters</span>
                </div>
              </div>

              {donations.length === 0 ? (
                <p className="mt-4 text-sm text-muted-foreground">No donations yet.</p>
              ) : (
                <ul className="mt-4 divide-y divide-border/60 text-sm">
                  {donations.map((d) => (
                    <li key={d.id} className="flex items-center justify-between py-3">
                      <div className="min-w-0">
                        <p className="truncate font-semibold text-foreground">{d.donorName || 'Anonymous'}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{new Date(d.createdAt).toLocaleDateString()}</p>
                      </div>
                      <div className="text-sm font-bold text-foreground">{formatCurrency(d.amount)}</div>
                    </li>
                  ))}
                </ul>
              )}

              <div className="mt-4 flex items-center justify-between border-t border-border/60 pt-4">
                <div className="text-sm text-muted-foreground">Total donated</div>
                <div className="text-lg font-bold text-foreground">{formatCurrency(totalDonated)}</div>
              </div>
            </Card>

            <Card className="p-6">
              <h2 className="text-lg font-bold text-foreground">Audit Trail</h2>
              {transactions.length === 0 ? (
                <p className="mt-3 text-sm text-muted-foreground">No transactions recorded.</p>
              ) : (
                <ul className="mt-3 divide-y divide-border/60 text-sm">
                  {transactions.map((t) => (
                    <li key={t.id} className="flex items-center justify-between py-3">
                      <div className="min-w-0">
                        <p className="truncate font-semibold text-foreground">{t.note || t.type}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{new Date(t.createdAt).toLocaleDateString()}</p>
                      </div>
                      <div className={`font-bold ${t.type === 'release' ? 'text-amber-600' : 'text-emerald-600'}`}>{(t.type === 'release' ? '-' : '+')}{formatCurrency(t.amount)}</div>
                    </li>
                  ))}
                </ul>
              )}
            </Card>
          </div>

          <div className="flex flex-col gap-6">
            <Card className="p-6">
              <FundingProgress funded={project.fundedAmount} goal={project.fundingGoal} released={project.releasedAmount} />

              <dl className="mt-5 grid grid-cols-2 gap-4 border-t border-border/60 pt-5 text-sm">
                <div className="flex flex-col gap-1">
                  <dt className="text-xs text-muted-foreground uppercase tracking-wider">Escrow</dt>
                  <dd className="font-bold text-foreground">{formatCurrency(project.escrowBalance)}</dd>
                </div>
                <div className="flex flex-col gap-1">
                  <dt className="text-xs text-muted-foreground uppercase tracking-wider">Released</dt>
                  <dd className="font-bold text-foreground">{formatCurrency(project.releasedAmount)}</dd>
                </div>
                <div className="flex flex-col gap-1">
                  <dt className="text-xs text-muted-foreground uppercase tracking-wider">Contributors</dt>
                  <dd className="font-bold text-foreground">{donations.length}</dd>
                </div>
                <div className="flex flex-col gap-1">
                  <dt className="text-xs text-muted-foreground uppercase tracking-wider">Milestones</dt>
                  <dd className="font-bold text-foreground">{milestones.length}</dd>
                </div>
              </dl>

              <div className="mt-5 flex flex-col gap-2">
                <Link href={`/dashboard/projects/${projectId}/settings`}>
                  <Button variant="outline">Project Settings</Button>
                </Link>
                <Link href={`/dashboard/projects/${projectId}/payouts`}>
                  <Button variant="secondary">Payouts</Button>
                </Link>
              </div>
            </Card>

            <Card className="p-6 text-sm text-muted-foreground">
              <FileText className="size-6 text-primary/80 mb-3" />
              <p className="font-semibold text-foreground">Helpful tips</p>
              <ul className="mt-2 list-disc pl-5 text-sm space-y-1">
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
