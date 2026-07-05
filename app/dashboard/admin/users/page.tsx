import { redirect } from "next/navigation"
import { getSession } from "@/lib/session"
import { getAllUsers, suspendUser, updateUserRole, deleteUser } from "@/app/actions/admin"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export const dynamic = "force-dynamic"

export default async function AdminUsersPage() {
  const user = await getSession()
  if (!user) return redirect("/sign-in")
  if (user.role !== "admin") return redirect("/dashboard")

  const users = await getAllUsers()

  return (
    <div className="flex min-h-svh flex-col bg-background">
      <main className="mx-auto w-full max-w-6xl px-4 py-12">
        <div className="mb-6 rounded-2xl border border-border/70 bg-card/80 p-4 shadow-sm sm:p-5">
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">
            User management
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground sm:text-base">
            Review registered accounts, adjust roles, and manage account access from one place.
          </p>
        </div>

        {users.length > 0 ? (
          <>
            {/* Desktop/tablet: table layout */}
            <div className="hidden md:block">
              <Card className="overflow-hidden border border-border/70 bg-card shadow-sm">
                <table className="w-full text-sm">
                      <thead className="border-b border-border">
                        <tr>
                          <th className="text-left p-2">Name</th>
                          <th className="text-left p-2">Email</th>
                          <th className="text-left p-2">Role</th>
                          <th className="text-left p-2">Joined</th>
                          <th className="text-left p-2">Actions</th>
                        </tr>
                      </thead>
                  <tbody>
                    {users.map((u) => (
                      <tr key={u.id} className="border-b border-border last:border-0">
                        <td className="p-2 font-medium text-foreground">{u.name}</td>
                        <td className="p-2 text-muted-foreground">{u.email}</td>
                        <td className="p-2">
                          <Badge variant="outline" className="capitalize">
                            {u.role}
                          </Badge>
                        </td>
                        <td className="p-2 text-muted-foreground">
                          {new Date(u.createdAt).toLocaleDateString()}
                        </td>
                        <td className="p-2">
                          <div className="flex items-center gap-3">
                            {u.role === "suspended" ? (
                              <form action={async function unsuspend(formData: FormData) {
                                "use server"
                                const id = String(formData.get("userId"))
                                await updateUserRole(id, "donor")
                              }}>
                                <input type="hidden" name="userId" value={u.id} />
                                <button type="submit" className="text-sm rounded-md px-3 py-1 border border-border bg-background text-foreground">Unsuspend</button>
                              </form>
                            ) : (
                              <form action={async function suspend(formData: FormData) {
                                "use server"
                                const id = String(formData.get("userId"))
                                await suspendUser(id)
                              }}>
                                <input type="hidden" name="userId" value={u.id} />
                                <button type="submit" className="text-sm rounded-md px-3 py-1 border border-destructive/30 text-destructive hover:bg-destructive/6">Suspend</button>
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
                <Card key={u.id} className="border border-border/70 bg-card p-4 shadow-sm">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <div className="flex items-center gap-3">
                        <h3 className="text-sm font-medium text-foreground truncate">{u.name}</h3>
                        <Badge variant="outline" className="capitalize text-xs">
                          {u.role}
                        </Badge>
                      </div>
                      <p className="mt-1 text-xs text-muted-foreground truncate">{u.email}</p>
                    </div>
                    <div className="flex-shrink-0 text-right">
                      <div className="text-sm text-muted-foreground">Joined</div>
                      <div className="text-sm font-medium text-foreground">{new Date(u.createdAt).toLocaleDateString()}</div>
                    </div>
                  </div>

                  <div className="mt-3 flex items-center justify-end gap-2">
                    {u.role === "suspended" ? (
                      <form action={async function unsuspendMobile(formData: FormData) {
                        "use server"
                        const id = String(formData.get("userId"))
                        await updateUserRole(id, "donor")
                      }}>
                        <input type="hidden" name="userId" value={u.id} />
                        <button type="submit" className="rounded-md px-3 py-1 text-sm text-foreground border border-border">Unsuspend</button>
                      </form>
                    ) : (
                      <form action={async function suspendMobile(formData: FormData) {
                        "use server"
                        const id = String(formData.get("userId"))
                        await suspendUser(id)
                      }}>
                        <input type="hidden" name="userId" value={u.id} />
                        <button type="submit" className="rounded-md px-3 py-1 text-sm text-destructive border border-destructive/30">Suspend</button>
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
