import Link from "next/link"
import { CheckCircle2, Clock, AlertCircle, Users, TrendingUp, GitBranch } from "lucide-react"
import { getSession } from "@/lib/session"
import { redirect } from "next/navigation"
import { getAllProjects } from "@/lib/queries"
import { getAllUsers } from "@/app/actions/admin"
import { getAdminMilestoneQueue } from "@/app/actions/milestones"
import { getReadyToStartProjects } from "@/app/actions/projects"
import { Card } from "@/components/ui/card"

export const dynamic = "force-dynamic"

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
  
  const readyToStartCount = readyToStart.length
  const pendingMilestones = milestones.length
  const totalProjects = projects.length

  const projectStats = [
    { label: "Pending Review", value: pendingProjects.length, icon: Clock, color: "bg-yellow-50 dark:bg-yellow-950", textColor: "text-yellow-700 dark:text-yellow-300", borderColor: "border-yellow-200 dark:border-yellow-800", barColor: "bg-yellow-500 dark:bg-yellow-600" },
    { label: "Approved", value: approvedProjects.length, icon: CheckCircle2, color: "bg-blue-50 dark:bg-blue-950", textColor: "text-blue-700 dark:text-blue-300", borderColor: "border-blue-200 dark:border-blue-800", barColor: "bg-blue-500 dark:bg-blue-600" },
    { label: "Funding", value: fundingProjects.length, icon: TrendingUp, color: "bg-green-50 dark:bg-green-950", textColor: "text-green-700 dark:text-green-300", borderColor: "border-green-200 dark:border-green-800", barColor: "bg-green-500 dark:bg-green-600" },
    { label: "Active", value: startedProjects.length, icon: GitBranch, color: "bg-purple-50 dark:bg-purple-950", textColor: "text-purple-700 dark:text-purple-300", borderColor: "border-purple-200 dark:border-purple-800", barColor: "bg-purple-500 dark:bg-purple-600" },
    { label: "Completed", value: completedProjects.length, icon: CheckCircle2, color: "bg-emerald-50 dark:bg-emerald-950", textColor: "text-emerald-700 dark:text-emerald-300", borderColor: "border-emerald-200 dark:border-emerald-800", barColor: "bg-emerald-500 dark:bg-emerald-600" },
  ]

  return (
    <div className="flex min-h-svh flex-col bg-background">
      <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold tracking-tight text-foreground">
            Admin dashboard
          </h1>
          <p className="mt-2 text-muted-foreground">
            Monitor platform activity, approve projects, and manage milestones
          </p>
        </div>

        {/* Critical Actions */}
        <div className="mb-8 grid gap-4 sm:grid-cols-4">
          <Link href="/dashboard/admin/ready-to-start">
            <Card className="p-6 border-2 border-primary/30 hover:border-primary hover:bg-primary/5 transition-all cursor-pointer group">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Ready to start</p>
                  <p className="mt-2 text-3xl font-bold text-foreground">{readyToStartCount}</p>
                  <p className="mt-1 text-xs text-primary font-medium">Projects awaiting approval</p>
                </div>
                <div className="rounded-lg bg-primary/10 p-2 group-hover:bg-primary/20 transition">
                  <AlertCircle className="size-5 text-primary" />
                </div>
              </div>
            </Card>
          </Link>

          <Link href="/dashboard/admin/projects">
            <Card className="p-6 hover:bg-muted/50 transition-all cursor-pointer group">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Pending approvals</p>
                  <p className="mt-2 text-3xl font-bold text-foreground">{pendingProjects.length}</p>
                  <p className="mt-1 text-xs text-muted-foreground">New submissions</p>
                </div>
                <div className="rounded-lg bg-yellow-100 dark:bg-yellow-900/30 p-2">
                  <Clock className="size-5 text-yellow-700 dark:text-yellow-400" />
                </div>
              </div>
            </Card>
          </Link>

          <Link href="/dashboard/admin/milestones">
            <Card className="p-6 hover:bg-muted/50 transition-all cursor-pointer group">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Milestone queue</p>
                  <p className="mt-2 text-3xl font-bold text-foreground">{pendingMilestones}</p>
                  <p className="mt-1 text-xs text-muted-foreground">Awaiting review</p>
                </div>
                <div className="rounded-lg bg-blue-100 dark:bg-blue-900/30 p-2">
                  <GitBranch className="size-5 text-blue-700 dark:text-blue-400" />
                </div>
              </div>
            </Card>
          </Link>

          <Link href="/dashboard/admin/users">
            <Card className="p-6 hover:bg-muted/50 transition-all cursor-pointer group">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total users</p>
                  <p className="mt-2 text-3xl font-bold text-foreground">{allUsers.length}</p>
                  <p className="mt-1 text-xs text-muted-foreground">Platform members</p>
                </div>
                <div className="rounded-lg bg-green-100 dark:bg-green-900/30 p-2">
                  <Users className="size-5 text-green-700 dark:text-green-400" />
                </div>
              </div>
            </Card>
          </Link>
        </div>

        {/* Project Status Overview */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-foreground mb-4">Project status overview</h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {projectStats.map((stat) => {
              const Icon = stat.icon
              const percentage = totalProjects > 0 ? Math.round((stat.value / totalProjects) * 100) : 0
              return (
                <Card key={stat.label} className={`p-4 border ${stat.borderColor} ${stat.color}`}>
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-white/20 dark:bg-black/20 p-2">
                      <Icon className={`size-4 ${stat.textColor}`} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className={`text-xs font-medium ${stat.textColor}`}>{stat.label}</p>
                      <p className={`text-2xl font-bold ${stat.textColor}`}>{stat.value}</p>
                      {totalProjects > 0 && (
                        <div className="mt-2">
                          <div className="w-full bg-white/30 dark:bg-black/30 rounded-full h-1.5">
                            <div 
                              className={`h-full rounded-full transition-all ${stat.barColor}`}
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                          <p className={`text-xs mt-1 ${stat.textColor}`}>{percentage}% of total</p>
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              )
            })}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="mb-8 grid gap-4 sm:grid-cols-3">
          <Card className="p-6 border-l-4 border-l-primary/50">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold text-foreground">Total projects</h3>
                <p className="mt-3 text-3xl font-bold text-foreground">{totalProjects}</p>
                <p className="mt-2 text-sm text-muted-foreground">
                  {fundingProjects.length} currently funding
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6 border-l-4 border-l-blue-500/50">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold text-foreground">Milestones</h3>
                <p className="mt-3 text-3xl font-bold text-foreground">{pendingMilestones}</p>
                <p className="mt-2 text-sm text-muted-foreground">
                  Awaiting evidence & approval
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6 border-l-4 border-l-emerald-500/50">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold text-foreground">Completion rate</h3>
                <p className="mt-3 text-3xl font-bold text-foreground">
                  {totalProjects > 0 ? Math.round((completedProjects.length / totalProjects) * 100) : 0}%
                </p>
                <p className="mt-2 text-sm text-muted-foreground">
                  {completedProjects.length} completed projects
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Action Cards */}
        <div className="grid gap-4 sm:grid-cols-3">
          <Link href="/dashboard/admin/projects" className="group">
            <Card className="p-6 h-full hover:shadow-md hover:border-primary/30 transition-all">
              <div className="flex items-center gap-3 mb-3">
                <div className="rounded-lg bg-yellow-100 dark:bg-yellow-900/30 p-2">
                  <Clock className="size-5 text-yellow-700 dark:text-yellow-400" />
                </div>
                <h3 className="font-semibold text-foreground">Project approvals</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Review and approve new project submissions from creators. {pendingProjects.length} awaiting review.
              </p>
              <p className="mt-4 text-sm font-medium text-primary group-hover:underline">
                Go to project reviews →
              </p>
            </Card>
          </Link>

          <Link href="/dashboard/admin/users" className="group">
            <Card className="p-6 h-full hover:shadow-md hover:border-primary/30 transition-all">
              <div className="flex items-center gap-3 mb-3">
                <div className="rounded-lg bg-green-100 dark:bg-green-900/30 p-2">
                  <Users className="size-5 text-green-700 dark:text-green-400" />
                </div>
                <h3 className="font-semibold text-foreground">User management</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Manage user accounts, roles, and platform permissions. {allUsers.length} users on platform.
              </p>
              <p className="mt-4 text-sm font-medium text-primary group-hover:underline">
                Manage users →
              </p>
            </Card>
          </Link>

          <Link href="/dashboard/disputes" className="group">
            <Card className="p-6 h-full hover:shadow-md hover:border-primary/30 transition-all">
              <div className="flex items-center gap-3 mb-3">
                <div className="rounded-lg bg-red-100 dark:bg-red-900/30 p-2">
                  <AlertCircle className="size-5 text-red-700 dark:text-red-400" />
                </div>
                <h3 className="font-semibold text-foreground">Dispute review</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Monitor and resolve disputes raised by donors, auditors, or project owners on the platform.
              </p>
              <p className="mt-4 text-sm font-medium text-primary group-hover:underline">
                View disputes →
              </p>
            </Card>
          </Link>
        </div>
      </main>
    </div>
  )
}
