import { getSession } from "@/lib/session"
import { redirect } from "next/navigation"
import { getPublicProjects } from "@/lib/queries"
import { DashboardExploreClient } from "@/components/dashboard-explore-client"
import { isDbAvailable } from "@/lib/db/check"

export const dynamic = "force-dynamic"

export default async function DashboardExplorePage() {
  const user = await getSession()
  if (!user) return redirect("/sign-in")

  let projects: any[] = []
  try {
    const ok = await isDbAvailable()
    if (ok) {
      projects = await getPublicProjects()
    }
  } catch (error) {
    console.error("Dashboard explore page failed to load projects:", error)
  }

  return (
    <div className="flex min-h-svh flex-col bg-background">
      <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:py-12">
        <DashboardExploreClient projects={projects} />
      </main>
    </div>
  )
}
