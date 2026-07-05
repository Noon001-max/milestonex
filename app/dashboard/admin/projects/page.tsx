import { redirect } from "next/navigation"
import { getSession } from "@/lib/session"
import { getPendingProjects } from "@/lib/queries"
import { AdminApproveProjectsSimple } from "@/components/admin-approve-projects-client"

export const dynamic = "force-dynamic"

export default async function Page() {
  const user = await getSession()
  if (!user) return redirect("/sign-in")
  if (user.role !== "admin") return redirect("/dashboard")

  const projects = await getPendingProjects()

  return <AdminApproveProjectsSimple projects={projects} />
}

