import Link from "next/link"
import { CheckCircle2, Clock, FileText } from "lucide-react"
import { getSession } from "@/lib/session"
import { redirect } from "next/navigation"
import { getVerificationQueue } from "@/app/actions/milestones"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { formatCurrency } from "@/lib/roles"
import { StatusBadge } from "@/components/status-badge"

export const dynamic = "force-dynamic"

export default async function VerifierDashboard() {
  const user = await getSession()
  if (!user) return redirect("/sign-in")
  if (user.role !== "verifier") return redirect("/dashboard")
  const queue = await getVerificationQueue()

  return (
    <div className="flex min-h-svh flex-col bg-background">
      <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold tracking-tight text-foreground">
            Verification queue
          </h1>
          <p className="mt-2 text-muted-foreground">
            Review milestone submissions and verify evidence from project owners
          </p>
        </div>

        {/* Stats */}
        {queue.length > 0 && (
          <div className="mb-8 grid gap-4 sm:grid-cols-2">
            <Card className="p-6 border-l-4 border-l-primary/50">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Pending verification</p>
                  <p className="mt-2 text-3xl font-bold text-foreground">{queue.length}</p>
                  <p className="mt-1 text-xs text-muted-foreground">Milestones awaiting review</p>
                </div>
                <div className="rounded-lg bg-primary/10 p-2">
                  <Clock className="size-5 text-primary" />
                </div>
              </div>
            </Card>

            <Card className="p-6 border-l-4 border-l-blue-500/50">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Projects involved</p>
                  <p className="mt-2 text-3xl font-bold text-foreground">
                    {new Set(queue.map((m) => m.projectId)).size}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">With pending milestones</p>
                </div>
                <div className="rounded-lg bg-blue-100 dark:bg-blue-900/30 p-2">
                  <FileText className="size-5 text-blue-700 dark:text-blue-400" />
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Verification Queue */}
        {queue.length > 0 ? (
          <div>
            <h2 className="text-lg font-semibold text-foreground mb-4">
              Milestones to review
            </h2>
            <div className="grid gap-4">
              {queue.map((m, idx) => (
                <Card key={m.id} className="p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <a
                          href={`/projects/${m.projectId}`}
                          className="text-sm font-medium text-muted-foreground hover:text-primary transition"
                        >
                          {m.projectTitle}
                        </a>
                        <Badge variant="outline" className="text-xs">
                          Milestone {(m as any).orderIndex != null ? (m as any).orderIndex + 1 : idx + 1}
                        </Badge>
                      </div>
                      <p className="text-lg font-semibold text-foreground">
                        {m.title}
                      </p>
                      <p className="mt-2 text-sm text-muted-foreground max-w-2xl">
                        {m.evidenceNote || m.description}
                      </p>
                      {m.evidenceUrls && m.evidenceUrls.length > 0 && (
                        <div className="mt-3">
                          <p className="text-xs text-muted-foreground mb-2">
                            📎 {m.evidenceUrls.length} file(s) attached
                          </p>
                        </div>
                      )}
                    </div>
                    <StatusBadge status={m.status} />
                  </div>

                  <div className="mt-4 grid gap-3 sm:grid-cols-3 text-sm">
                    <div className="rounded-lg bg-muted p-3">
                      <span className="text-xs text-muted-foreground block">Milestone amount</span>
                      <span className="text-lg font-semibold text-foreground">
                        {formatCurrency(m.amount)}
                      </span>
                    </div>
                    <div className="rounded-lg bg-muted p-3">
                      <span className="text-xs text-muted-foreground block">Due date</span>
                      <span className="text-lg font-semibold text-foreground">
                        {typeof (m as any).dueDate === "string" ? new Date((m as any).dueDate).toLocaleDateString() : "No date"}
                      </span>
                    </div>
                    <div className="rounded-lg bg-muted p-3">
                      <span className="text-xs text-muted-foreground block">Submitted</span>
                      <span className="text-lg font-semibold text-foreground">
                        {m.submittedAt ? new Date(m.submittedAt).toLocaleDateString() : "Pending"}
                      </span>
                    </div>
                  </div>

                  <div className="mt-4">
                    <a
                      href={`/dashboard/verify/${m.id}`}
                      className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition"
                    >
                      Review milestone
                    </a>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        ) : (
          <Card className="p-12 text-center">
            <CheckCircle2 className="size-12 text-primary mx-auto mb-4" />
            <p className="text-lg font-medium text-foreground mb-2">
              All caught up!
            </p>
            <p className="text-muted-foreground">
              No milestones are pending verification at the moment.
            </p>
          </Card>
        )}
      </main>
    </div>
  )
}
