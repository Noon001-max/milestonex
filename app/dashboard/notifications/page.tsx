import { Bell, Banknote, GitBranch, AlertCircle, Calendar, Check, CheckCheck, Inbox } from "lucide-react"
import { getSession } from "@/lib/session"
import { getMyNotifications, markAllNotificationsRead, markNotificationRead } from "@/app/actions/notifications"
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
  const unreadCount = notifications.filter((notification) => !notification.read).length

  return (
    <div className="min-h-svh bg-background px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-12">
      <main className="mx-auto w-full max-w-4xl">
        <div className="flex flex-col gap-4 rounded-3xl border border-border/70 bg-card p-5 shadow-sm sm:p-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                <Inbox className="size-3.5" />
                Activity center
              </div>
              <h1 className="mt-3 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
                Notifications
              </h1>
              <p className="mt-2 max-w-2xl text-sm text-muted-foreground sm:text-base">
                Keep track of project updates, verification events, and funding activity in one place.
              </p>
            </div>

            {unreadCount > 0 && (
              <form
                action={async function markEverythingRead() {
                  "use server"
                  await markAllNotificationsRead()
                }}
              >
                <button
                  type="submit"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm transition hover:bg-primary/90"
                >
                  <CheckCheck className="size-4" />
                  Mark all as read
                </button>
              </form>
            )}
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <Card className="rounded-2xl border border-border/70 bg-secondary/25 p-4 shadow-none">
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-muted-foreground">Total</p>
              <p className="mt-2 text-2xl font-semibold text-foreground">{notifications.length}</p>
              <p className="mt-1 text-xs text-muted-foreground">Messages received</p>
            </Card>
            <Card className="rounded-2xl border border-border/70 bg-secondary/25 p-4 shadow-none">
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-muted-foreground">Unread</p>
              <p className="mt-2 text-2xl font-semibold text-foreground">{unreadCount}</p>
              <p className="mt-1 text-xs text-muted-foreground">Still need attention</p>
            </Card>
            <Card className="rounded-2xl border border-border/70 bg-secondary/25 p-4 shadow-none">
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-muted-foreground">Read</p>
              <p className="mt-2 text-2xl font-semibold text-foreground">{notifications.length - unreadCount}</p>
              <p className="mt-1 text-xs text-muted-foreground">Already reviewed</p>
            </Card>
          </div>
        </div>

        <div className="mt-6 space-y-3">
          {notifications.length > 0 ? (
            notifications.map((n) => {
              const { icon: Icon, bgColor } = getNotificationConfig(n.title, n.body)
              return (
                <Card
                  key={n.id}
                  className={`overflow-hidden rounded-2xl border border-border/70 bg-card shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md ${
                    !n.read ? "ring-1 ring-primary/15" : ""
                  }`}
                >
                  <div className={`h-1 w-full ${!n.read ? "bg-primary" : "bg-border/60"}`} />

                  <div className="flex flex-col gap-4 p-4 sm:p-5">
                    <div className="flex items-start gap-4">
                      <div className={`flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-2xl ${bgColor}`}>
                        <Icon className="size-4.5" />
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className={`text-sm font-semibold text-foreground ${!n.read ? "text-primary" : ""}`}>
                            {n.title}
                          </p>
                          {!n.read && (
                            <span className="inline-flex items-center rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.18em] text-primary">
                              New
                            </span>
                          )}
                        </div>
                        <p className="mt-1 text-sm leading-6 text-muted-foreground">{n.body}</p>
                        <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                          <span className="inline-flex items-center gap-1 rounded-full bg-secondary/60 px-2.5 py-1 font-medium">
                            <Calendar className="size-3" />
                            {new Date(n.createdAt).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>

                    {!n.read && (
                      <div className="flex justify-end border-t border-border/60 pt-4">
                        <form
                          action={async function readNotification() {
                            "use server"
                            await markNotificationRead(n.id)
                          }}
                        >
                          <button
                            type="submit"
                            className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-border/70 bg-background px-4 py-2 text-xs font-semibold text-foreground transition-colors hover:bg-secondary"
                          >
                            <Check className="size-3.5 text-primary" />
                            Mark read
                          </button>
                        </form>
                      </div>
                    )}
                  </div>
                </Card>
              )
            })
          ) : (
            <Card className="rounded-2xl border border-border/70 bg-card p-10 text-center shadow-sm">
              <Bell className="mx-auto size-10 text-muted-foreground/70" />
              <p className="mt-4 text-lg font-semibold text-foreground">You’re all caught up</p>
              <p className="mt-1 text-sm text-muted-foreground">New activity will appear here when projects move forward.</p>
            </Card>
          )}
        </div>
      </main>
    </div>
  )
}