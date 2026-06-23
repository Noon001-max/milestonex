import { getSession } from "@/lib/session"
import { isDbAvailable } from "@/lib/db/check"
import { getPublicProjects } from "@/lib/queries"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { ProjectCard } from "@/components/project-card"
import { Card } from "@/components/ui/card"

export const dynamic = "force-dynamic"

export default async function ProjectsPage() {
  let user = null
  let projects: any[] = []
  let dbUnavailable = false

  try {
    const ok = await isDbAvailable()
    if (!ok) {
      dbUnavailable = true
      user = await getSession()
    } else {
      ;[user, projects] = await Promise.all([
        getSession(),
        getPublicProjects(),
      ])
    }
  } catch (error) {
    console.error("Projects page load failed:", error)
    dbUnavailable = true
    user = await getSession()
  }

  return (
    <div className="flex min-h-svh flex-col bg-background">
      <SiteHeader user={user} />
      <main className="mx-auto w-full max-w-6xl px-4 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">
            Community projects
          </h1>
          <p className="mt-1 text-muted-foreground">
            Browse vetted projects and fund the milestones that matter.
          </p>
        </div>

        {dbUnavailable ? (
          <Card className="p-12 text-center text-muted-foreground">
            Project data is temporarily unavailable. Please try again later.
          </Card>
        ) : projects.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((p) => (
              <ProjectCard key={p.id} project={p} />
            ))}
          </div>
        ) : (
          <Card className="p-12 text-center text-muted-foreground">
            No projects are live yet. Check back soon.
          </Card>
        )}
      </main>
      <SiteFooter />
    </div>
  )
}
