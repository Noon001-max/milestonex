import { Bell } from "lucide-react"
import { getSession } from "@/lib/session"
import { getMyNotifications, markAllNotificationsRead } from "@/app/actions/notifications"
import { Card } from "@/components/ui/card"

export const dynamic = "force-dynamic"

export default async function NotificationsPage() {
  const user = await getSession()
  const notifications = await getMyNotifications()
  const hasUnread = notifications.some((n) => !n.read)

  return (
    <div className="flex min-h-svh flex-col bg-background">
      <main className="mx-auto w-full max-w-4xl px-4 py-12">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-foreground">
              Notifications
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Your recent alerts and activity updates.
            </p>
          </div>
          {hasUnread && (
            <form action={markAllNotificationsRead} className="self-start">
              <button
                type="submit"
                className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
              >
                Mark all as read
              </button>
            </form>
          )}
        </div>

        {notifications.length > 0 ? (
          <div className="flex flex-col divide-y divide-border">
            {notifications.map((n) => (
              <div key={n.id} className="flex gap-3 p-4">
                <span className="flex size-8 items-center justify-center rounded-md bg-primary/10 text-primary flex-shrink-0">
                  <Bell className="size-4" />
                </span>
                <div className="flex-1">
                  <p className="font-medium text-foreground">{n.title}</p>
                  <p className="text-sm text-muted-foreground">{n.body}</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {new Date(n.createdAt).toLocaleString()}
                  </p>
                </div>
                {!n.read && (
                  <span className="flex-shrink-0">
                    <span className="inline-block size-2 rounded-full bg-primary" />
                  </span>
                )}
              </div>
            ))}
          </div>
        ) : (
          <Card className="p-12 text-center">
            <Bell className="size-12 text-primary mx-auto mb-4" />
            <p className="text-muted-foreground">No notifications yet.</p>
          </Card>
        )}
      </main>
    </div>
  )
}