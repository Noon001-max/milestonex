import { redirect } from "next/navigation"
import { getSession } from "@/lib/session"
import { getAllUsers, suspendUser, updateUserRole, deleteUser } from "@/app/actions/admin"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ShieldCheck, Users, UserMinus, UserCog, CalendarDays } from "lucide-react"

export const dynamic = "force-dynamic"

export default async function AdminUsersPage() {
  const user = await getSession()
  if (!user) return redirect("/sign-in")
  if (user.role !== "admin") return redirect("/dashboard")

  const users = await getAllUsers()
  const totalUsers = users.length
  const suspendedUsers = users.filter((u) => u.role === "suspended").length
  const adminUsers = users.filter((u) => u.role === "admin").length
  const activeUsers = totalUsers - suspendedUsers

  const stats = [
    { label: "Total users", value: totalUsers, icon: Users, tone: "bg-primary/10 text-primary" },
    { label: "Active accounts", value: activeUsers, icon: ShieldCheck, tone: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" },
    { label: "Suspended", value: suspendedUsers, icon: UserMinus, tone: "bg-rose-500/10 text-rose-600 dark:text-rose-400" },
    { label: "Admins", value: adminUsers, icon: UserCog, tone: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400" },
  ]

  const getInitials = (name: string) =>
    name
      .split(/\s+/)
      .map((part) => part[0] || "")
      .join("")
      .toUpperCase()
      .slice(0, 2)

  return (
    <div className="flex min-h-svh flex-col bg-background">
      <main className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-6 rounded-[2rem] border border-border/70 bg-card/80 p-5 shadow-sm backdrop-blur sm:p-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-primary">Administration</p>
              <h1 className="mt-2 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            User management
              </h1>
              <p className="mt-2 max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base">
                Review registered accounts, adjust roles, and manage account access from one place.
              </p>
            </div>
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/5 px-4 py-2 text-sm font-medium text-primary">
              <CalendarDays className="size-4" />
              <span>Live account control</span>
            </div>
          </div>
        </div>

        <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat) => {
            const Icon = stat.icon
            return (
              <Card key={stat.label} className="rounded-[1.75rem] border border-border/70 bg-card p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">{stat.label}</p>
                    <p className="mt-3 text-3xl font-bold tracking-tight text-foreground">{stat.value}</p>
                  </div>
                  <div className={`rounded-2xl p-3 ${stat.tone}`}>
                    <Icon className="size-5" />
                  </div>
                </div>
              </Card>
            )
          })}
        </div>

        {users.length > 0 ? (
          <>
            {/* Desktop/tablet: table layout */}
            <div className="hidden md:block">
              <Card className="overflow-hidden rounded-[2rem] border border-border/70 bg-card shadow-sm">
                <div className="border-b border-border/70 px-6 py-4">
                  <p className="text-sm font-semibold text-foreground">Registered accounts</p>
                  <p className="mt-1 text-sm text-muted-foreground">Role changes take effect immediately.</p>
                </div>
                <table className="w-full text-sm">
                  <thead className="bg-muted/40 text-xs uppercase tracking-[0.2em] text-muted-foreground">
                    <tr>
                      <th className="px-6 py-4 text-left font-semibold">Name</th>
                      <th className="px-6 py-4 text-left font-semibold">Email</th>
                      <th className="px-6 py-4 text-left font-semibold">Role</th>
                      <th className="px-6 py-4 text-left font-semibold">Joined</th>
                      <th className="px-6 py-4 text-left font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60">
                    {users.map((u) => (
                      <tr key={u.id} className="transition-colors hover:bg-muted/30">
                        <td className="px-6 py-4 font-medium text-foreground">{u.name}</td>
                        <td className="px-6 py-4 text-muted-foreground">{u.email}</td>
                        <td className="px-6 py-4">
                          <Badge variant="outline" className="capitalize rounded-full px-3 py-1">
                            {u.role}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 text-muted-foreground">
                          {new Date(u.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            {u.role === "suspended" ? (
                              <form action={async function unsuspend(formData: FormData) {
                                "use server"
                                const id = String(formData.get("userId"))
                                await updateUserRole(id, "donor")
                              }}>
                                <input type="hidden" name="userId" value={u.id} />
                                <button type="submit" className="rounded-full border border-border bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted">
                                  Unsuspend
                                </button>
                              </form>
                            ) : (
                              <form action={async function suspend(formData: FormData) {
                                "use server"
                                const id = String(formData.get("userId"))
                                await suspendUser(id)
                              }}>
                                <input type="hidden" name="userId" value={u.id} />
                                <button type="submit" className="rounded-full border border-destructive/30 px-4 py-2 text-sm font-medium text-destructive transition-colors hover:bg-destructive/6">
                                  Suspend
                                </button>
                              </form>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </Card>
            </div>

            {/* Mobile: card list */}
            <div className="md:hidden grid gap-4">
              {users.map((u) => (
                <Card key={u.id} className="rounded-[1.75rem] border border-border/70 bg-card p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0 flex items-start gap-3">
                      <div className="flex size-11 items-center justify-center rounded-2xl bg-primary/10 text-sm font-bold text-primary">
                        {getInitials(u.name)}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="truncate text-sm font-semibold text-foreground">{u.name}</h3>
                          <Badge variant="outline" className="capitalize rounded-full px-2.5 py-0.5 text-[11px]">
                            {u.role}
                          </Badge>
                        </div>
                        <p className="mt-1 truncate text-xs text-muted-foreground">{u.email}</p>
                      </div>
                    </div>
                    <div className="flex-shrink-0 text-right">
                      <div className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Joined</div>
                      <div className="text-sm font-semibold text-foreground">{new Date(u.createdAt).toLocaleDateString()}</div>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-end gap-2">
                    {u.role === "suspended" ? (
                      <form action={async function unsuspendMobile(formData: FormData) {
                        "use server"
                        const id = String(formData.get("userId"))
                        await updateUserRole(id, "donor")
                      }}>
                        <input type="hidden" name="userId" value={u.id} />
                        <button type="submit" className="rounded-full border border-border px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted">
                          Unsuspend
                        </button>
                      </form>
                    ) : (
                      <form action={async function suspendMobile(formData: FormData) {
                        "use server"
                        const id = String(formData.get("userId"))
                        await suspendUser(id)
                      }}>
                        <input type="hidden" name="userId" value={u.id} />
                        <button type="submit" className="rounded-full border border-destructive/30 px-4 py-2 text-sm font-medium text-destructive transition-colors hover:bg-destructive/6">
                          Suspend
                        </button>
                      </form>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          </>
        ) : (
          <Card className="p-12 text-center">
            <p className="text-muted-foreground">No users found.</p>
          </Card>
        )}
      </main>
    </div>
  )
}
