import { redirect } from "next/navigation"
import { getSession } from "@/lib/session"
import DashboardShell from "@/components/dashboard-shell"

export const dynamic = "force-dynamic"

export default async function DonorLayout({ children }: { children: React.ReactNode }) {
  const user = await getSession()
  if (!user) return redirect("/sign-in")
  if (user.role !== "donor") return redirect("/dashboard")

  return <DashboardShell user={user}>{children}</DashboardShell>
}
