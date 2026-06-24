import { redirect } from "next/navigation"
import { getSession } from "@/lib/session"
import { getAllProjects } from "@/lib/queries"
import { AdminProjectsPageClient } from "@/components/admin-projects-page-client"

export const dynamic = "force-dynamic"

export default async function Page() {
  const user = await getSession()
  if (!user) return redirect("/sign-in")
  if (user.role !== "admin") return redirect("/dashboard")

  const projects = await getAllProjects()

  return <AdminProjectsPageClient projects={projects} />
}

