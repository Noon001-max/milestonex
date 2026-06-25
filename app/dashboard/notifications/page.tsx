import { Bell, Banknote, GitBranch, AlertCircle, CheckCircle2, Calendar, Activity, Check } from "lucide-react"
import { getSession } from "@/lib/session"
import { getMyNotifications, markAllNotificationsRead, markNotificationRead } from "@/app/actions/notifications"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

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
    <div className="flex min-h-svh flex-col bg-background">
      <main className="mx-auto w-full max-w-4xl px-4 py-8 sm:py-12">
        
        {/* Header Section */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-primary uppercase tracking-widest mb-1.5">
              <Activity className="size-4 animate-pulse" />
              <span>User Alerts</span>
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight text-foreground">
              Notifications
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Stay updated on project funding progress, escrow activations, and milestone verifications.
            </p>
          </div>

          {hasUnread && (
            <form action={markAllNotificationsRead} className="self-start sm:self-center">
              <button
                type="submit"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-xs font-bold text-primary-foreground shadow-md shadow-primary/10 hover:shadow-primary/20 hover:scale-[1.01] active:scale-98 transition-all"
              >
                <CheckCircle2 className="size-4" />
                <span>Mark all read</span>
              </button>
            </form>
          )}
        </div>

        {/* Notifications list */}
        {notifications.length > 0 ? (
          <Card className="overflow-hidden border border-border bg-card shadow-sm divide-y divide-border/60">
            {notifications.map((n) => {
              const { icon: Icon, bgColor } = getNotificationConfig(n.title, n.body)
              return (
                <div 
                  key={n.id} 
                  className={`p-5 transition-all duration-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                    !n.read 
                      ? "bg-primary/5 hover:bg-primary/10" 
                      : "hover:bg-secondary/15"
                  }`}
                >
                  <div className="flex items-start gap-4 min-w-0">
                    <div className={`p-2.5 rounded-xl flex-shrink-0 ${bgColor}`}>
                      <Icon className="size-4.5" />
                    </div>
                    <div className="min-w-0 space-y-0.5">
                      <div className="flex items-center gap-2.5 flex-wrap">
                        <p className={`font-bold text-sm text-foreground ${!n.read ? "text-primary" : ""}`}>
                          {n.title}
                        </p>
                        {!n.read && (
                          <span className="inline-flex items-center text-[9px] font-black text-primary bg-primary/10 px-1.5 py-0.5 rounded-full border border-primary/20 uppercase tracking-wider">
                            New
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed">{n.body}</p>
                      <span className="inline-flex items-center gap-1 text-[10px] text-muted-foreground font-semibold pt-1">
                        <Calendar className="size-3" />
                        {new Date(n.createdAt).toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {/* Actions column */}
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
                        className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-border/80 bg-card px-4 py-2 text-xs font-bold text-foreground hover:bg-secondary hover:border-primary/20 hover:scale-[1.02] transition-all shadow-sm"
                      >
                        <Check className="size-3.5 text-primary" />
                        <span>Mark read</span>
                      </button>
                    </form>
                  )}
                </div>
              )
            })}
          </Card>
        ) : (
          <Card className="p-16 text-center border border-border bg-card shadow-sm max-w-md mx-auto">
            <Bell className="size-12 text-primary mx-auto mb-4 opacity-40" />
            <p className="text-lg font-bold text-foreground mb-2">No alerts yet</p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              When projects submit milestones or escrow payments are processed, updates will appear here.
            </p>
          </Card>
        )}
      </main>
    </div>
  )
}