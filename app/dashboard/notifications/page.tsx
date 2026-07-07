import { Bell, Banknote, GitBranch, AlertCircle, CheckCircle2, Calendar, Activity, Check } from "lucide-react"
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
  const hasUnread = notifications.some((n) => !n.read)

  return (
    <div className="min-h-svh bg-background px-3 py-3 sm:px-4 sm:py-4 lg:px-6 lg:py-6">
      <main className="mx-auto flex w-full max-w-5xl min-h-[calc(100svh-1.5rem)] items-center justify-center sm:min-h-[calc(100svh-2rem)] lg:min-h-[calc(100svh-3rem)]">
        <div className="relative w-full overflow-hidden rounded-[2rem] bg-card shadow-[0_24px_80px_rgba(0,0,0,0.14)] ring-1 ring-border/50 backdrop-blur-xl">
          <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary via-emerald-500 to-cyan-500" />
          <div className="absolute -right-16 -top-16 hidden size-40 rounded-full bg-primary/10 blur-3xl sm:block" />
          <div className="absolute -left-12 bottom-0 hidden size-32 rounded-full bg-emerald-500/10 blur-3xl sm:block" />

          <div className="relative z-10 p-4 sm:p-6 lg:p-8">
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="mb-1.5 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-primary">
                  <Activity className="size-4 animate-pulse" />
                  <span>User Alerts</span>
                </div>
                <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
                  Notifications
                </h1>
                <p className="mt-2 max-w-xl text-sm text-muted-foreground sm:text-base">
                  Stay updated on project funding progress, escrow activations, and milestone verifications.
                </p>
              </div>

              {hasUnread && (
                <form action={markAllNotificationsRead} className="self-start sm:self-center">
                  <button
                    type="submit"
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-4 py-2 text-xs font-bold text-primary-foreground shadow-lg shadow-primary/15 transition-all hover:scale-[1.01] hover:shadow-primary/25 active:scale-95"
                  >
                    <CheckCircle2 className="size-4" />
                    <span>Mark all read</span>
                  </button>
                </form>
              )}
            </div>

            {notifications.length > 0 ? (
              <div className="max-h-[72svh] overflow-y-auto pr-1 sm:pr-2">
                <div className="space-y-3">
                  {notifications.map((n) => {
                    const { icon: Icon, bgColor } = getNotificationConfig(n.title, n.body)
                    return (
                      <div
                        key={n.id}
                        className={`flex flex-col justify-between gap-4 rounded-2xl p-4 transition-all duration-200 sm:flex-row sm:items-center sm:p-5 ${
                          !n.read
                            ? "bg-primary/5 shadow-sm shadow-primary/5 hover:-translate-y-0.5 hover:bg-primary/10"
                            : "hover:-translate-y-0.5 hover:bg-secondary/20"
                        }`}
                      >
                        <div className="flex min-w-0 items-start gap-4">
                          <div className={`flex-shrink-0 rounded-2xl p-3 ${bgColor}`}>
                            <Icon className="size-4.5" />
                          </div>
                          <div className="min-w-0 space-y-0.5">
                            <div className="flex flex-wrap items-center gap-2.5">
                              <p className={`text-sm font-bold text-foreground ${!n.read ? "text-primary" : ""}`}>
                                {n.title}
                              </p>
                              {!n.read && (
                                <span className="inline-flex items-center rounded-full bg-primary/10 px-1.5 py-0.5 text-[9px] font-black uppercase tracking-wider text-primary">
                                  New
                                </span>
                              )}
                            </div>
                            <p className="text-xs leading-relaxed text-muted-foreground">{n.body}</p>
                            <span className="inline-flex items-center gap-1 pt-1 text-[10px] font-semibold text-muted-foreground">
                              <Calendar className="size-3" />
                              {new Date(n.createdAt).toLocaleString()}
                            </span>
                          </div>
                        </div>

                        {!n.read && (
                          <form
                            action={async function readNotification() {
                              "use server"
                              await markNotificationRead(n.id)
                            }}
                            className="self-end sm:self-center"
                          >
                            <button
                              type="submit"
                              title="Mark as read"
                              className="inline-flex items-center justify-center gap-1.5 rounded-full bg-card px-4 py-2 text-xs font-bold text-foreground shadow-sm ring-1 ring-border/50 transition-all hover:scale-[1.02] hover:bg-secondary"
                            >
                              <Check className="size-3.5 text-primary" />
                              <span>Mark read</span>
                            </button>
                          </form>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            ) : (
              <div className="p-10 text-center sm:p-12">
                <Bell className="mx-auto mb-4 size-12 text-primary opacity-40" />
                <p className="mb-2 text-lg font-bold text-foreground">No alerts yet</p>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  When projects submit milestones or escrow payments are processed, updates will appear here.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}