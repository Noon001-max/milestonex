import { notFound, redirect } from "next/navigation"
import { getSession } from "@/lib/session"
import { getProjectById, getProjectMilestones } from "@/lib/queries"
import MilestonesManager from "@/components/milestones-manager"

export const dynamic = "force-dynamic"

export default async function MilestonesPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const projectId = Number(id)
  if (Number.isNaN(projectId)) notFound()

  const [user, project, milestones] = await Promise.all([
    getSession(),
    getProjectById(projectId),
    getProjectMilestones(projectId),
  ])
  if (!project) notFound()
  if (!user) redirect(`/sign-in`)
  if (user.id !== project.ownerId) redirect(`/dashboard/projects/${projectId}`)

  return (
    <div className="px-4 sm:px-6 py-6">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-2xl font-bold mb-3">Manage milestones</h1>
        <p className="text-sm text-muted-foreground mb-6">Create, edit, reorder, and remove milestones for this project.</p>
        <MilestonesManager projectId={projectId} initialMilestones={milestones} />
      </div>
    </div>
  )
}
