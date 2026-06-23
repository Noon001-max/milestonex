import { redirect } from "next/navigation"
import { getSession } from "@/lib/session"
import { getAllDisputes } from "@/app/actions/disputes"
import { Card } from "@/components/ui/card"
import { StatusBadge } from "@/components/status-badge"

export const dynamic = "force-dynamic"

export default async function AdminDisputesPage() {
  const user = await getSession()
  if (!user) return redirect("/sign-in")
  if (user.role !== "admin") return redirect("/dashboard")

  const disputes = await getAllDisputes()

  return (
    <div className="flex min-h-svh flex-col bg-background">
      <main className="mx-auto w-full max-w-6xl px-4 py-12">
        <div className="mb-6">
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">
            Disputes
          </h1>
          <p className="mt-1 text-muted-foreground">
            Review complaints and status updates across the platform.
          </p>
        </div>

        {disputes.length > 0 ? (
          <div className="grid gap-4">
            {disputes.map((d) => (
              <Card key={d.id} className="p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-medium text-foreground">{d.subject}</p>
                    <p className="text-sm text-muted-foreground line-clamp-1">
                      {d.details}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Raised by: {d.raisedByName}
                    </p>
                  </div>
                  <StatusBadge status={d.status} />
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="p-12 text-center">
            <p className="text-muted-foreground">No disputes recorded.</p>
          </Card>
        )}
      </main>
    </div>
  )
}
