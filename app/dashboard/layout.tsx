import { getSession } from "@/lib/session"
import DashboardShell from "@/components/dashboard-shell"

export const dynamic = "force-dynamic"

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const user = await getSession()

  return user ? <DashboardShell user={user}>{children}</DashboardShell> : <>{children}</>
}
