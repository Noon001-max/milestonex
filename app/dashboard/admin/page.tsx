import Link from "next/link"
import { Clock, Users, TrendingUp, GitBranch, Landmark, ArrowRight, Activity } from "lucide-react"
import { getSession } from "@/lib/session"
import { redirect } from "next/navigation"
import { getAllProjects } from "@/lib/queries"
import { getAllUsers } from "@/app/actions/admin"
import { getAdminMilestoneHistory, getAdminMilestoneQueue, getApprovedMilestonesByAdmin } from "@/app/actions/milestones"
import { getReadyToStartProjects, getApprovedProjectsByAdmin } from "@/app/actions/projects"
import { Card } from "@/components/ui/card"
import { formatCurrency } from "@/lib/roles"

export const dynamic = "force-dynamic"


export default async function AdminDashboard() {
  const user = await getSession()
  if (!user) return redirect("/sign-in")
  if (user.role !== "admin") return redirect("/dashboard")

  const [projects, allUsers, milestones, readyToStart, milestoneHistory, myApprovedProjects, myApprovedMilestones] = await Promise.all([
    getAllProjects(),
    getAllUsers(),
    getAdminMilestoneQueue(),
    getReadyToStartProjects(),
    getAdminMilestoneHistory(),
    getApprovedProjectsByAdmin(),
    getApprovedMilestonesByAdmin(),
  ])

  const pendingProjects = projects.filter((project) => project.status === "pending")
  const approvedProjects = projects.filter((project) => project.status === "approved")
  const rejectedProjects = projects.filter((project) => project.status === "rejected")
  const fundingProjects = projects.filter((project) => project.status === "funding")
  const startedProjects = projects.filter((project) => project.status === "started")
  const completedProjects = projects.filter((project) => project.status === "completed")
  const approvedMilestones = milestoneHistory.filter((milestone) => milestone.status === "approved")
  const rejectedMilestones = milestoneHistory.filter((milestone) => milestone.status === "rejected")

  const totalProjects = projects.length
  const readyToStartCount = readyToStart.length
  const pendingMilestones = milestones.length
  
  const totalRaised = projects.reduce((acc, p) => acc + Number(p.fundedAmount || 0), 0)
  const totalEscrow = projects.reduce((acc, p) => acc + Number(p.escrowBalance || 0), 0)
  const completionRate = totalProjects > 0 ? Math.round((completedProjects.length / totalProjects) * 100) : 0

  const keyMetrics = [
    { label: "Platform members", value: allUsers.length, icon: Users, subtext: "Active registered accounts", color: "text-primary bg-primary/10" },
    { label: "Open project requests", value: pendingProjects.length, icon: Clock, subtext: "New project proposals awaiting review", color: "text-foreground bg-primary/10" },
    { label: "Milestones pending", value: pendingMilestones, icon: GitBranch, subtext: "Milestones waiting validation", color: "text-primary bg-primary/10" },
    { label: "Escrow balance", value: formatCurrency(totalEscrow), icon: Landmark, subtext: "Funds held until milestone completion", color: "text-foreground bg-primary/10" },
  ]

  const actionItems = [
    {
      title: "Review projects",
      href: "/dashboard/admin/projects",
      count: pendingProjects.length,
      description: "Approve or reject incoming project proposals.",
      icon: Clock,
      color: "border-l-primary/70 text-foreground bg-background hover:bg-muted",
      badgeColor: "bg-primary/10 text-primary"
    },
    {
      title: "Approve milestones",
      href: "/dashboard/admin/milestones",
      count: pendingMilestones,
      description: "Verify work submissions and release escrow payments.",
      icon: GitBranch,
      color: "border-l-primary/70 text-foreground bg-background hover:bg-muted",
      badgeColor: "bg-primary/10 text-primary"
    },
    {
      title: "Launch readiness",
      href: "/dashboard/admin/ready-to-start",
      count: readyToStartCount,
      description: "Authorize fully funded projects to begin delivery.",
      icon: ArrowRight,
      color: "border-l-primary/70 text-foreground bg-background hover:bg-muted",
      badgeColor: "bg-primary/10 text-primary"
    },
    {
      title: "Manage users",
      href: "/dashboard/admin/users",
      count: allUsers.length,
      description: "Update permissions and review account status.",
      icon: Users,
      color: "border-l-primary/70 text-foreground bg-background hover:bg-muted",
      badgeColor: "bg-primary/10 text-primary"
    },
  ]

  const pipelineStats = [
    { label: "Pending review", value: pendingProjects.length, percentage: totalProjects > 0 ? Math.round((pendingProjects.length / totalProjects) * 100) : 0, barColor: "bg-primary" },
    { label: "Approved", value: approvedProjects.length, percentage: totalProjects > 0 ? Math.round((approvedProjects.length / totalProjects) * 100) : 0, barColor: "bg-muted" },
    { label: "Fundraising", value: fundingProjects.length, percentage: totalProjects > 0 ? Math.round((fundingProjects.length / totalProjects) * 100) : 0, barColor: "bg-primary/80" },
    { label: "Completed", value: completedProjects.length, percentage: totalProjects > 0 ? Math.round((completedProjects.length / totalProjects) * 100) : 0, barColor: "bg-muted/70" },
  ]

  return (
    <div className="flex min-h-svh flex-col bg-background">
      <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:py-12">
        
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.24em] text-primary">
            <Activity className="size-4" />
            <span>Operational Console</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Admin Dashboard
          </h1>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground sm:text-base">
            Monitor projects, reviews, and milestone activity from one place.
          </p>
        </div>

        {/* Key Metrics Grid */}
        <div className="mb-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {keyMetrics.map((metric) => {
            const Icon = metric.icon
            return (
              <Card key={metric.label} className="flex flex-col justify-between border border-border/70 bg-card p-4 shadow-sm sm:p-5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{metric.label}</span>
                  <div className={`p-2 rounded-xl ${metric.color}`}>
                    <Icon className="size-4.5" />
                  </div>
                </div>
                <div className="mt-3">
                  <p className="text-xl font-bold tracking-tight text-foreground">{metric.value}</p>
                  <p className="mt-1 text-[11px] font-medium leading-5 text-muted-foreground">{metric.subtext}</p>
                </div>
              </Card>
            )
          })}
        </div>

        <div className="space-y-3">
          <div>
            <h2 className="mb-1 text-lg font-semibold tracking-tight text-foreground">Quick actions</h2>
            <p className="text-sm text-muted-foreground">The main tasks that need attention.</p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {actionItems.map((item) => {
              const Icon = item.icon
              return (
                <Link key={item.title} href={item.href} className="group block">
                  <Card className={`flex items-center justify-between gap-4 border border-border/70 border-l-4 p-4 shadow-sm transition-all duration-200 group-hover:translate-x-1 sm:p-5 ${item.color}`}>
                    <div className="flex items-start gap-3 min-w-0">
                      <div className="mt-0.5 rounded-xl border border-border bg-card p-2.5 text-foreground shadow-sm">
                        <Icon className="size-4.5" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2.5 flex-wrap">
                          <h3 className="text-sm font-semibold text-foreground transition-colors group-hover:text-primary">{item.title}</h3>
                          {item.count !== null && item.count > 0 && (
                            <span className={`inline-flex items-center justify-center rounded-full px-2 py-0.5 text-[10px] font-bold ${item.badgeColor}`}>
                              {item.count}
                            </span>
                          )}
                        </div>
                        <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{item.description}</p>
                      </div>
                    </div>
                    <ArrowRight className="size-4 text-muted-foreground transition-all group-hover:translate-x-0.5 group-hover:text-primary" />
                  </Card>
                </Link>
              )
            })}
          </div>
        
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <Card className="border border-border/70 bg-card p-4">
              <h3 className="text-sm font-semibold text-foreground">Projects you approved</h3>
              <p className="text-sm text-muted-foreground mt-1">Recent projects you approved.</p>
              <div className="mt-3 space-y-2">
                {myApprovedProjects.length > 0 ? (
                  myApprovedProjects.slice(0,5).map((p) => (
                    <div key={p.id} className="rounded-xl border border-border/60 bg-background p-3 text-sm">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-foreground">{p.title}</p>
                          <p className="text-xs text-muted-foreground">{p.summary}</p>
                        </div>
                        <p className="text-xs text-muted-foreground">{new Date(p.updatedAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">You haven't approved any projects yet.</p>
                )}
              </div>
            </Card>

            <Card className="border border-border/70 bg-card p-4">
              <h3 className="text-sm font-semibold text-foreground">Milestones you approved</h3>
              <p className="text-sm text-muted-foreground mt-1">Recent milestone approvals you performed.</p>
              <div className="mt-3 space-y-2">
                {myApprovedMilestones.length > 0 ? (
                  myApprovedMilestones.slice(0,5).map((m) => (
                    <div key={m.id} className="rounded-xl border border-border/60 bg-background p-3 text-sm">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-foreground">{m.title}</p>
                          <p className="text-xs text-muted-foreground">{m.projectTitle}</p>
                        </div>
                        <p className="text-xs text-muted-foreground">{new Date(m.updatedAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">You haven't approved any milestones yet.</p>
                )}
              </div>
            </Card>
          </div>
        </div>

      </main>
    </div>
  )
}

function PlayCircleIcon(props: React.ComponentProps<"svg">) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <polygon points="10 8 16 12 10 16 10 8" />
    </svg>
  )
}

