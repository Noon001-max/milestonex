import { redirect } from "next/navigation"
import { getSession } from "@/lib/session"
import { getAllUsers } from "@/app/actions/admin"
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
        <div className="mb-6">
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">
            Manage users
          </h1>
          <p className="mt-1 text-muted-foreground">
            View all users, roles, and account status.
          </p>
        </div>

        {users.length > 0 ? (
          <Card className="p-2">
            <table className="w-full text-sm">
              <thead className="border-b border-border">
                <tr>
                  <th className="text-left p-2">Name</th>
                  <th className="text-left p-2">Email</th>
                  <th className="text-left p-2">Role</th>
                  <th className="text-left p-2">Joined</th>
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
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        ) : (
          <Card className="p-12 text-center">
            <p className="text-muted-foreground">No users found.</p>
          </Card>
        )}
      </main>
    </div>
  )
}
