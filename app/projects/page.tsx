import { getSession } from "@/lib/session"
import { isDbAvailable } from "@/lib/db/check"
import { getPublicProjects } from "@/lib/queries"
import { ProjectsPageClient } from "@/components/projects-page-client"

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

  return <ProjectsPageClient user={user} projects={projects} dbUnavailable={dbUnavailable} />
}

