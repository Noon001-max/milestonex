import { notFound, redirect } from "next/navigation"
import { getSession } from "@/lib/session"
import { getProjectById, getProjectMilestones } from "@/lib/queries"
import { NewProjectForm } from "@/components/new-project-form"

export const dynamic = "force-dynamic"

export default async function EditProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const projectId = Number(id)
  if (Number.isNaN(projectId)) notFound()

  const [user, project, milestones] = await Promise.all([
    getSession(),
    getProjectById(projectId),
    getProjectMilestones(projectId),
  ])

  if (!user) redirect("/sign-in")
  if (!project || project.ownerId !== user.id) notFound()

  return (
    <div className="flex min-h-svh flex-col bg-background">
      <main className="mx-auto w-full max-w-6xl px-4 py-10">
        <div className="mb-6 rounded-2xl border border-border/70 bg-card/80 p-4 shadow-sm sm:p-5">
          <h1 className="text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
            Edit project proposal
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground sm:text-base">
            Update the project details, milestones, and image, then save your changes.
          </p>
        </div>

        <NewProjectForm
          mode="edit"
          projectId={projectId}
          initialProject={project}
          initialMilestones={milestones}
        />
      </main>
    </div>
  )
}