import { Bell, Banknote, GitBranch, AlertCircle, Calendar, Check } from "lucide-react"
import { getSession } from "@/lib/session"
import { getMyNotifications, markNotificationRead } from "@/app/actions/notifications"
import { Card } from "@/components/ui/card"

export const dynamic = "force-dynamic"

const getNotificationConfig = (title: string, body: string) => {
  const text = `${title} ${body}`.toLowerCase()
  if (text.includes("milestone") || text.includes("evidence") || text.includes("verify")) {
    return {
      icon: GitBranch,
      bgColor: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/10",
    }
  }
  if (text.includes("donation") || text.includes("funded") || text.includes("escrow") || text.includes("payout") || text.includes("released")) {
    return {
      icon: Banknote,
      bgColor: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/10",
    }
  }
  if (text.includes("dispute") || text.includes("rejected") || text.includes("suspend") || text.includes("alert")) {
    return {
      icon: AlertCircle,
      bgColor: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/10",
    }
  }
  return {
    icon: Bell,
    bgColor: "bg-primary/10 text-primary border border-primary/10",
  }
}

export default async function NotificationsPage() {
  const user = await getSession()
  if (!user) return null

  const notifications = await getMyNotifications()

  return (
    <div className="min-h-svh bg-background px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-12">
      <main className="mx-auto w-full max-w-4xl">
        <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          Notifications
        </h1>

        <div className="mt-6 space-y-3">
          {notifications.length > 0 ? (
            notifications.map((n) => {
              const { icon: Icon, bgColor } = getNotificationConfig(n.title, n.body)
              return (
                <Card
                  key={n.id}
                  className={`flex flex-col gap-4 rounded-2xl border border-border/70 bg-card p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between ${
                    !n.read ? "bg-primary/5" : ""
                  }`}
                >
                  <div className="flex min-w-0 items-start gap-3">
                    <div className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-2xl ${bgColor}`}>
                      <Icon className="size-4" />
                    </div>
                    <div className="min-w-0">
                      <p className={`text-sm font-semibold text-foreground ${!n.read ? "text-primary" : ""}`}>
                        {n.title}
                      </p>
                      <p className="mt-1 text-sm text-muted-foreground">{n.body}</p>
                      <div className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
                        <Calendar className="size-3" />
                        <span>{new Date(n.createdAt).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  {!n.read && (
                    <form
                      action={async function readNotification() {
                        "use server"
                        await markNotificationRead(n.id)
                      }}
                    >
                      <button
                        type="submit"
                        className="inline-flex items-center justify-center gap-1.5 rounded-full bg-card px-4 py-2 text-xs font-semibold text-foreground ring-1 ring-border/60 transition-colors hover:bg-secondary"
                      >
                        <Check className="size-3.5 text-primary" />
                        Mark read
                      </button>
                    </form>
                  )}
                </Card>
              )
            })
          ) : (
            <p className="text-sm text-muted-foreground">No notifications</p>
          )}
        </div>
      </main>
    </div>
  )
}