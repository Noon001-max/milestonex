import { notFound, redirect } from "next/navigation"
import { getSession } from "@/lib/session"
import { getProjectById } from "@/lib/queries"
import ProjectSettingsForm from "@/components/project-settings-form"

export const dynamic = "force-dynamic"

export default async function ProjectSettingsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const projectId = Number(id)
  if (Number.isNaN(projectId)) notFound()

  const [user, project] = await Promise.all([getSession(), getProjectById(projectId)])
  if (!project) notFound()
  if (!user) redirect(`/sign-in`)
  if (user.id !== project.ownerId) redirect(`/dashboard/projects/${projectId}`)

  return (
    <div className="px-4 sm:px-6 py-6">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-2xl font-bold mb-3">Project settings</h1>
        <p className="text-sm text-muted-foreground mb-6">Update title, description and image for your project.</p>
        {/* Client form handles submission to API */}
        <ProjectSettingsForm project={project} />
      </div>
    </div>
  )
}
