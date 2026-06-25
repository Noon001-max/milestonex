import Link from "next/link"
import { CheckCircle2, Clock, AlertCircle, Users, TrendingUp, GitBranch, Banknote, Landmark, ArrowRight, Activity } from "lucide-react"
import { getSession } from "@/lib/session"
import { redirect } from "next/navigation"
import { getAllProjects } from "@/lib/queries"
import { getAllUsers } from "@/app/actions/admin"
import { getAdminMilestoneQueue } from "@/app/actions/milestones"
import { getReadyToStartProjects } from "@/app/actions/projects"
import { Card } from "@/components/ui/card"

export const dynamic = "force-dynamic"

const formatCurrency = (val: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(val)
}

export default async function AdminDashboard() {
  const user = await getSession()
  if (!user) return redirect("/sign-in")
  if (user.role !== "admin") return redirect("/dashboard")

  const [projects, allUsers, milestones, readyToStart] = await Promise.all([
    getAllProjects(),
    getAllUsers(),
    getAdminMilestoneQueue(),
    getReadyToStartProjects(),
  ])

  const pendingProjects = projects.filter((project) => project.status === "pending")
  const approvedProjects = projects.filter((project) => project.status === "approved")
  const fundingProjects = projects.filter((project) => project.status === "funding")
  const startedProjects = projects.filter((project) => project.status === "started")
  const completedProjects = projects.filter((project) => project.status === "completed")

  const totalProjects = projects.length
  const readyToStartCount = readyToStart.length
  const pendingMilestones = milestones.length
  
  const totalRaised = projects.reduce((acc, p) => acc + Number(p.fundedAmount || 0), 0)
  const totalEscrow = projects.reduce((acc, p) => acc + Number(p.escrowBalance || 0), 0)
  const completionRate = totalProjects > 0 ? Math.round((completedProjects.length / totalProjects) * 100) : 0

  const keyMetrics = [
    { label: "Platform Members", value: allUsers.length, icon: Users, subtext: "Total registered users", color: "text-blue-500 bg-blue-500/10" },
    { label: "Total Funds Raised", value: formatCurrency(totalRaised), icon: TrendingUp, subtext: `${fundingProjects.length} active fundraisers`, color: "text-emerald-500 bg-emerald-500/10" },
    { label: "Secured in Escrow", value: formatCurrency(totalEscrow), icon: Landmark, subtext: "Awaiting milestone releases", color: "text-indigo-500 bg-indigo-500/10" },
    { label: "Completion Rate", value: `${completionRate}%`, icon: CheckCircle2, subtext: `${completedProjects.length} completed projects`, color: "text-purple-500 bg-purple-500/10" },
  ]

  const actionItems = [
    {
      title: "Project Approvals",
      href: "/dashboard/admin/projects",
      count: pendingProjects.length,
      description: "Evaluate and approve new project proposals submitted by creators.",
      icon: Clock,
      color: "border-l-amber-500/70 text-amber-500 bg-amber-500/5 hover:bg-amber-500/10",
      badgeColor: "bg-amber-500/20 text-amber-600 dark:text-amber-400"
    },
    {
      title: "Milestone Queue",
      href: "/dashboard/admin/milestones",
      count: pendingMilestones,
      description: "Review submitted evidence from project owners and unlock payments.",
      icon: GitBranch,
      color: "border-l-indigo-500/70 text-indigo-500 bg-indigo-500/5 hover:bg-indigo-500/10",
      badgeColor: "bg-indigo-500/20 text-indigo-600 dark:text-indigo-400"
    },
    {
      title: "Launch Approvals",
      href: "/dashboard/admin/ready-to-start",
      count: readyToStartCount,
      description: "Authorize the activation of fully-funded projects to begin work.",
      icon: PlayCircleIcon,
      color: "border-l-primary/70 text-primary bg-primary/5 hover:bg-primary/10",
      badgeColor: "bg-primary/20 text-primary-foreground font-bold bg-primary/20 text-primary"
    },
    {
      title: "User Management",
      href: "/dashboard/admin/users",
      count: null,
      description: "Manage accounts, update user permissions, and suspend accounts.",
      icon: Users,
      color: "border-l-emerald-500/70 text-emerald-500 bg-emerald-500/5 hover:bg-emerald-500/10",
      badgeColor: ""
    },
    {
      title: "Dispute Review",
      href: "/dashboard/disputes",
      count: null,
      description: "Moderate and resolve claims raised regarding milestone completions.",
      icon: AlertCircle,
      color: "border-l-rose-500/70 text-rose-500 bg-rose-500/5 hover:bg-rose-500/10",
      badgeColor: ""
    }
  ]

  const pipelineStats = [
    { label: "Pending Review", value: pendingProjects.length, percentage: totalProjects > 0 ? Math.round((pendingProjects.length / totalProjects) * 100) : 0, barColor: "bg-amber-500" },
    { label: "Approved (Not Live)", value: approvedProjects.length, percentage: totalProjects > 0 ? Math.round((approvedProjects.length / totalProjects) * 100) : 0, barColor: "bg-blue-500" },
    { label: "Fundraising", value: fundingProjects.length, percentage: totalProjects > 0 ? Math.round((fundingProjects.length / totalProjects) * 100) : 0, barColor: "bg-emerald-500" },
    { label: "Active Implementation", value: startedProjects.length, percentage: totalProjects > 0 ? Math.round((startedProjects.length / totalProjects) * 100) : 0, barColor: "bg-purple-500" },
    { label: "Completed", value: completedProjects.length, percentage: totalProjects > 0 ? Math.round((completedProjects.length / totalProjects) * 100) : 0, barColor: "bg-slate-500 dark:bg-slate-400" },
  ]

  return (
    <div className="flex min-h-svh flex-col bg-background">
      <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:py-12">
        
        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center gap-2.5 text-xs font-bold text-primary uppercase tracking-widest mb-1.5">
            <Activity className="size-4" />
            <span>Operational Console</span>
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl">
            Admin Dashboard
          </h1>
          <p className="mt-2 text-base text-muted-foreground max-w-3xl">
            Monitor platform fundraising activity, evaluate project submissions, verify milestones, and moderate user dynamics.
          </p>
        </div>

        {/* Key Metrics Grid */}
        <div className="mb-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {keyMetrics.map((metric) => {
            const Icon = metric.icon
            return (
              <Card key={metric.label} className="p-6 border border-border/80 bg-card shadow-sm flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{metric.label}</span>
                  <div className={`p-2 rounded-xl ${metric.color}`}>
                    <Icon className="size-4.5" />
                  </div>
                </div>
                <div className="mt-4">
                  <p className="text-2xl font-extrabold text-foreground tracking-tight">{metric.value}</p>
                  <p className="text-[11px] text-muted-foreground font-medium mt-1">{metric.subtext}</p>
                </div>
              </Card>
            )
          })}
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Action Center - Occupies 2 columns */}
          <div className="lg:col-span-2 space-y-6">
            <div>
              <h2 className="text-xl font-bold tracking-tight text-foreground mb-1">Administrative Actions</h2>
              <p className="text-sm text-muted-foreground">Operational tasks awaiting attention or access channels.</p>
            </div>

            <div className="grid gap-4 sm:grid-cols-1">
              {actionItems.map((item) => {
                const Icon = item.icon
                return (
                  <Link key={item.title} href={item.href} className="group block">
                    <Card className={`p-5 border border-border/80 border-l-4 ${item.color} shadow-sm transition-all duration-200 group-hover:translate-x-1 cursor-pointer flex items-center justify-between gap-4`}>
                      <div className="flex items-start gap-4 min-w-0">
                        <div className="p-2.5 rounded-xl bg-card border border-border shadow-sm text-foreground mt-0.5">
                          <Icon className="size-5" />
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2.5 flex-wrap">
                            <h3 className="font-bold text-foreground text-sm group-hover:text-primary transition-colors">{item.title}</h3>
                            {item.count !== null && item.count > 0 && (
                              <span className={`inline-flex items-center justify-center text-[10px] font-bold px-2 py-0.5 rounded-full ${item.badgeColor}`}>
                                {item.count} awaiting
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{item.description}</p>
                        </div>
                      </div>
                      <ArrowRight className="size-4.5 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all flex-shrink-0" />
                    </Card>
                  </Link>
                )
              })}
            </div>
          </div>

          {/* Pipeline & Distribution Panel - Occupies 1 column */}
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold tracking-tight text-foreground mb-1">Platform Pipeline</h2>
              <p className="text-sm text-muted-foreground">Distribution of projects across stages.</p>
            </div>

            <Card className="p-6 border border-border/80 bg-card shadow-sm space-y-6">
              <div className="space-y-4">
                {pipelineStats.map((stat) => (
                  <div key={stat.label} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-semibold">
                      <span className="text-foreground">{stat.label}</span>
                      <span className="text-muted-foreground">{stat.value} ({stat.percentage}%)</span>
                    </div>
                    <div className="w-full bg-secondary rounded-full h-2 overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all duration-500 ${stat.barColor}`}
                        style={{ width: `${stat.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-border pt-4 text-center">
                <div className="inline-flex items-center gap-2.5 text-xs font-bold text-foreground">
                  <span>Total System Scope:</span>
                  <span className="px-2.5 py-0.5 rounded-full bg-secondary text-foreground text-sm font-black border border-border">
                    {totalProjects}
                  </span>
                </div>
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

