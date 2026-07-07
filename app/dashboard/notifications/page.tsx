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
    <div className="flex min-h-svh flex-col bg-background lg:bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.08),_transparent_42%),radial-gradient(circle_at_bottom_right,_rgba(16,185,129,0.08),_transparent_32%)]">
      <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-14">
        <div className="relative overflow-hidden rounded-3xl border border-border/70 bg-card shadow-sm lg:border-white/10 lg:bg-card/70 lg:shadow-2xl lg:shadow-black/10 lg:backdrop-blur-md">
          <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary via-emerald-500 to-cyan-500" />
          <div className="absolute -right-16 -top-16 hidden size-40 rounded-full bg-primary/10 blur-3xl lg:block" />
          <div className="absolute -left-12 bottom-0 hidden size-32 rounded-full bg-emerald-500/10 blur-3xl lg:block" />

          <div className="relative z-10 p-4 sm:p-6 lg:p-8">
            <div className="grid gap-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(360px,0.95fr)] lg:gap-8">
              <section className="flex flex-col justify-between gap-6 lg:py-2">
                <div>
                  <div className="mb-1.5 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-primary">
                    <Activity className="size-4 animate-pulse" />
                    <span>User Alerts</span>
                  </div>
                  <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl">
                    Notifications
                  </h1>
                  <p className="mt-3 max-w-xl text-sm text-muted-foreground sm:text-base">
                    Stay updated on project funding progress, escrow activations, and milestone verifications.
                  </p>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <Card className="border border-border/70 bg-background/80 p-4 shadow-lg shadow-black/5 backdrop-blur-sm">
                    <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
                      Live feed
                    </p>
                    <p className="mt-2 text-sm font-semibold text-foreground">
                      New items float in like desktop notifications.
                    </p>
                  </Card>
                  <Card className="border border-border/70 bg-background/80 p-4 shadow-lg shadow-black/5 backdrop-blur-sm">
                    <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
                      Mobile mode
                    </p>
                    <p className="mt-2 text-sm font-semibold text-foreground">
                      The same feed stays readable as a normal page on smaller screens.
                    </p>
                  </Card>
                </div>
              </section>

              <section className="lg:sticky lg:top-6 lg:self-start">
                <div className="rounded-[2rem] border border-border/70 bg-background/85 shadow-2xl shadow-black/10 backdrop-blur-xl">
                  <div className="flex items-center justify-between gap-4 border-b border-border/60 px-4 py-4 sm:px-5">
                    <div>
                      <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
                        Notification tray
                      </p>
                      <p className="mt-1 text-sm font-semibold text-foreground">
                        {notifications.length} item{notifications.length === 1 ? "" : "s"}
                      </p>
                    </div>

                    {hasUnread && (
                      <form action={markAllNotificationsRead}>
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
                    <div className="max-h-[70vh] divide-y divide-border/60 overflow-y-auto p-2 sm:p-3">
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
                                    <span className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-1.5 py-0.5 text-[9px] font-black uppercase tracking-wider text-primary">
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
                                  className="inline-flex items-center justify-center gap-1.5 rounded-full border border-border/80 bg-card px-4 py-2 text-xs font-bold text-foreground shadow-sm transition-all hover:scale-[1.02] hover:border-primary/20 hover:bg-secondary"
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
              </section>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}