import { getSession } from "@/lib/session"
import DashboardShell from "@/components/dashboard-shell"
import { getUnreadNotificationsCount } from "@/app/actions/notifications"

export const dynamic = "force-dynamic"

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const user = await getSession()

  if (!user) return <>{children}</>

  const unreadCount = await getUnreadNotificationsCount()

  return <DashboardShell user={user} unreadCount={unreadCount}>{children}</DashboardShell>
}
