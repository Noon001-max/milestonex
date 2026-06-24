import Link from "next/link"
import { getSession } from "@/lib/session"
import { getMyProjects } from "@/app/actions/projects"
import { getProjectMilestones } from "@/lib/queries"
import OwnerProjectsClient from "@/components/owner-projects-client"

export const dynamic = "force-dynamic"

export default async function OwnerDashboard() {
  const user = await getSession()

  if (!user) {
    return (
      <div className="flex min-h-svh flex-col bg-background">
        <main className="mx-auto w-full max-w-6xl px-4 py-16">
          <p className="text-muted-foreground">
            <Link href="/sign-in" className="text-primary hover:underline">
              Sign in
            </Link>{" "}
            to manage your projects.
          </p>
        </main>
      </div>
    )
  }

  if (user.role !== "owner") {
    return (
      <div className="flex min-h-svh flex-col bg-background">
        <main className="mx-auto w-full max-w-6xl px-4 py-16">
          <p className="text-muted-foreground">
            This page is for project proposers only. Please check your dashboard for your role.
          </p>
        </main>
      </div>
    )
  }

  const projects = await getMyProjects()
  const allMilestones = await Promise.all(
    projects.map((project) => getProjectMilestones(project.id)),
  )

  const projectsWithMilestones = projects.map((project, index) => ({
    ...project,
    milestones: allMilestones[index] || [],
  }))

  return <OwnerProjectsClient projects={projectsWithMilestones} />
}
