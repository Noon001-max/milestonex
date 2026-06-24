import { redirect } from "next/navigation"
import { AlertCircle, CheckCircle2, Clock } from "lucide-react"
import { getSession } from "@/lib/session"
import { getAllDisputes, updateDispute } from "@/app/actions/disputes"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { StatusBadge } from "@/components/status-badge"

export const dynamic = "force-dynamic"

export default async function DisputesPage() {
  const user = await getSession()
  if (!user) return redirect("/sign-in")
  if (user.role !== "auditor") return redirect("/dashboard")

  const disputes = await getAllDisputes()
  const openDisputes = disputes.filter((d) => d.status === "open").length
  const investigatingDisputes = disputes.filter((d) => d.status === "investigating").length
  const resolvedDisputes = disputes.filter((d) => d.status === "resolved").length

  return (
    <div className="flex min-h-svh flex-col bg-background">
      <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold tracking-tight text-foreground">
            Disputes
          </h1>
          <p className="mt-2 text-muted-foreground">
            Monitor and resolve disputes raised by community members
          </p>
        </div>

        {/* Stats */}
        {disputes.length > 0 && (
          <div className="mb-8 grid gap-4 sm:grid-cols-3">
            <Card className="p-6 border-l-4 border-l-red-500/50">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Open disputes</p>
                  <p className="mt-2 text-3xl font-bold text-foreground">{openDisputes}</p>
                  <p className="mt-1 text-xs text-muted-foreground">Awaiting action</p>
                </div>
                <div className="rounded-lg bg-red-100 dark:bg-red-900/30 p-2">
                  <AlertCircle className="size-5 text-red-700 dark:text-red-400" />
                </div>
              </div>
            </Card>

            <Card className="p-6 border-l-4 border-l-yellow-500/50">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Investigating</p>
                  <p className="mt-2 text-3xl font-bold text-foreground">{investigatingDisputes}</p>
                  <p className="mt-1 text-xs text-muted-foreground">Under review</p>
                </div>
                <div className="rounded-lg bg-yellow-100 dark:bg-yellow-900/30 p-2">
                  <Clock className="size-5 text-yellow-700 dark:text-yellow-400" />
                </div>
              </div>
            </Card>

            <Card className="p-6 border-l-4 border-l-green-500/50">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Resolved</p>
                  <p className="mt-2 text-3xl font-bold text-foreground">{resolvedDisputes}</p>
                  <p className="mt-1 text-xs text-muted-foreground">Closed cases</p>
                </div>
                <div className="rounded-lg bg-green-100 dark:bg-green-900/30 p-2">
                  <CheckCircle2 className="size-5 text-green-700 dark:text-green-400" />
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Disputes List */}
        {disputes.length > 0 ? (
          <div>
            <h2 className="text-lg font-semibold text-foreground mb-4">
              All disputes
            </h2>
            <div className="grid gap-4">
              {disputes.map((d) => (
                <Card key={d.id} className="p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-lg font-semibold text-foreground">
                          {d.subject}
                        </h3>
                        <StatusBadge status={d.status} />
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        {d.details}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        🔸 Raised by: <span className="font-medium">{d.raisedByName}</span>
                      </p>
                    </div>
                  </div>

                  {d.status === "open" && (
                    <form action={updateDisputeForm} className="mt-6 space-y-3">
                      <input type="hidden" name="disputeId" value={d.id} />
                      <div>
                        <Label htmlFor={`resolution-${d.id}`} className="text-sm font-medium">
                          Resolution note
                        </Label>
                        <Textarea
                          id={`resolution-${d.id}`}
                          name="resolution"
                          placeholder="Document your findings and resolution..."
                          rows={3}
                          required
                          className="mt-2"
                        />
                      </div>
                      <div className="flex gap-2">
                        <button
                          type="submit"
                          name="status"
                          value="investigating"
                          className="inline-flex items-center justify-center rounded-lg border border-border bg-background px-4 py-2 text-sm font-medium hover:bg-muted transition"
                        >
                          Start investigation
                        </button>
                        <button
                          type="submit"
                          name="status"
                          value="resolved"
                          className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition"
                        >
                          Mark as resolved
                        </button>
                      </div>
                    </form>
                  )}

                  {d.status === "investigating" && (
                    <div className="mt-4 rounded-lg border border-yellow-200 dark:border-yellow-800 bg-yellow-50 dark:bg-yellow-950/30 p-4">
                      <p className="text-sm text-yellow-700 dark:text-yellow-200">
                        This dispute is currently under investigation.
                      </p>
                    </div>
                  )}

                  {d.status === "resolved" && (
                    <div className="mt-4 rounded-lg border border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-950/30 p-4">
                      <p className="text-sm text-green-700 dark:text-green-200">
                        ✓ This dispute has been resolved.
                      </p>
                    </div>
                  )}
                </Card>
              ))}
            </div>
          </div>
        ) : (
          <Card className="p-12 text-center">
            <CheckCircle2 className="size-12 text-primary mx-auto mb-4" />
            <p className="text-lg font-medium text-foreground mb-2">
              All clear!
            </p>
            <p className="text-muted-foreground">
              No disputes to review at the moment.
            </p>
          </Card>
        )}
      </main>
    </div>
  )
}

async function updateDisputeForm(formData: FormData) {
  "use server"
  const disputeId = Number(formData.get("disputeId"))
  const status = formData.get("status") as "investigating" | "resolved"
  const resolution = formData.get("resolution") as string
  await updateDispute(disputeId, status, resolution)
}
