import { ArrowLeft } from "lucide-react"
import { getSession } from "@/lib/session"
import { SiteHeader } from "@/components/site-header"
import { NewProjectForm } from "@/components/new-project-form"

export const dynamic = "force-dynamic"

export default async function NewProjectPage() {
  const user = await getSession()

  return (
    <div className="flex min-h-svh flex-col bg-background">
      <SiteHeader user={user} />
      <main className="mx-auto w-full max-w-3xl px-4 py-12">
        <div className="mb-4">
          <a
            href="/dashboard/projects"
            className="text-sm text-muted-foreground hover:text-foreground inline-flex items-center gap-1"
          >
            <ArrowLeft className="size-4" />
            My projects
          </a>
        </div>

        <h1 className="text-3xl font-semibold tracking-tight text-foreground mb-2">
          Submit a new project
        </h1>
        <p className="text-muted-foreground mb-8">
          Describe your project, set milestones, and request funding.
        </p>

        <NewProjectForm />
      </main>
    </div>
  )
}
