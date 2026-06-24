import Link from "next/link"
import { ArrowLeft, FileText, Users } from "lucide-react"
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
  const readyToStartCount = readyToStart.length
  const pendingMilestones = milestones.length

  return (
    <div className="flex min-h-svh flex-col bg-background">
      <main className="mx-auto w-full max-w-6xl px-4 py-12">
        <div className="mb-6">
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">
            Admin overview
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            Review administrator metrics and navigate to Projects, Users, and Milestone approvals from the sidebar or links below.
          </p>
        </div>

        <div className="mb-8 grid gap-4 sm:grid-cols-3">
          <Card className="p-4">
            <div className="flex items-center gap-2 text-muted-foreground">
              <FileText className="size-4" />
              <span>Pending approvals</span>
            </div>
            <p className="mt-3 text-2xl font-semibold text-foreground">{pendingProjects.length}</p>
            <Link href="/dashboard/admin/projects" className="mt-4 inline-flex text-sm font-medium text-primary hover:underline">
              Review projects
            </Link>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Users className="size-4" />
              <span>Total users</span>
            </div>
            <p className="mt-3 text-2xl font-semibold text-foreground">{allUsers.length}</p>
            <Link href="/dashboard/admin/users" className="mt-4 inline-flex text-sm font-medium text-primary hover:underline">
              Manage users
            </Link>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-2 text-muted-foreground">
              <ArrowLeft className="size-4" />
              <span>Milestone approvals</span>
            </div>
            <p className="mt-3 text-2xl font-semibold text-foreground">{pendingMilestones}</p>
            <Link href="/dashboard/admin/milestones" className="mt-4 inline-flex text-sm font-medium text-primary hover:underline">
              Review milestones
            </Link>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-2 text-muted-foreground">
              <ArrowLeft className="size-4" />
              <span>Ready to start</span>
            </div>
            <p className="mt-3 text-2xl font-semibold text-foreground">{readyToStartCount}</p>
            <Link href="/dashboard/admin/ready-to-start" className="mt-4 inline-flex text-sm font-medium text-primary hover:underline">
              Review ready-to-start
            </Link>
          </Card>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <Card className="p-4">
            <h2 className="text-base font-semibold text-foreground">Project approvals</h2>
            <p className="mt-2 text-sm text-muted-foreground">Approve or reject new project submissions from creators.</p>
          </Card>
          <Card className="p-4">
            <h2 className="text-base font-semibold text-foreground">User management</h2>
            <p className="mt-2 text-sm text-muted-foreground">Review accounts, roles, and platform access.</p>
          </Card>
          <Card className="p-4">
            <h2 className="text-base font-semibold text-foreground">Dispute review</h2>
            <p className="mt-2 text-sm text-muted-foreground">Track complaints and resolve disputes raised by donors or auditors.</p>
          </Card>
        </div>
      </main>
    </div>
  )
}
