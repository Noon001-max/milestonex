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
            <Card className="p-5 border border-border/80 border-l-4 border-l-primary/70 bg-card shadow-sm hover:shadow hover:-translate-y-0.5 transition-all duration-200">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Pending Verification</p>
                  <p className="mt-2 text-2xl font-extrabold text-foreground">{queue.length}</p>
                  <p className="mt-1 text-xs text-muted-foreground">Milestones awaiting review</p>
                </div>
                <div className="rounded-xl bg-primary/10 p-2.5">
                  <Clock className="size-4.5 text-primary" />
                </div>
              </div>
            </Card>

            <Card className="p-5 border border-border/80 border-l-4 border-l-indigo-500/70 bg-card shadow-sm hover:shadow hover:-translate-y-0.5 transition-all duration-200">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Projects Involved</p>
                  <p className="mt-2 text-2xl font-extrabold text-foreground font-mono">
                    {new Set(queue.map((m) => m.projectId)).size}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">With pending milestones</p>
                </div>
                <div className="rounded-xl bg-indigo-500/10 p-2.5">
                  <FileText className="size-4.5 text-indigo-500" />
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Verification Queue */}
        {queue.length > 0 ? (
          <div>
            <h2 className="text-lg font-bold text-foreground mb-4">
              Milestones to review
            </h2>
            <div className="grid gap-4">
              {queue.map((m, idx) => (
                <Card key={m.id} className="p-6 border border-border/80 bg-card hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <a
                          href={`/projects/${m.projectId}`}
                          className="text-xs font-bold text-muted-foreground hover:text-primary transition-colors uppercase tracking-wider"
                        >
                          {m.projectTitle}
                        </a>
                        <Badge variant="outline" className="text-[10px] font-bold px-2 py-0.5 bg-secondary/50 border-border/50">
                          Milestone {(m as any).orderIndex != null ? (m as any).orderIndex + 1 : idx + 1}
                        </Badge>
                      </div>
                      <p className="text-lg font-bold text-foreground">
                        {m.title}
                      </p>
                      <p className="mt-2 text-sm text-muted-foreground max-w-2xl leading-relaxed">
                        {m.evidenceNote || m.description}
                      </p>
                      {m.evidenceUrls && m.evidenceUrls.length > 0 && (
                        <div className="mt-3.5">
                          <span className="inline-flex items-center gap-1 text-xs font-bold text-primary bg-primary/5 px-2.5 py-1 rounded-md border border-primary/20">
                            📎 {m.evidenceUrls.length} file(s) attached
                          </span>
                        </div>
                      )}
                    </div>
                    <StatusBadge status={m.status} />
                  </div>

                  <div className="mt-6 grid gap-3 sm:grid-cols-3 text-sm">
                    <div className="rounded-xl bg-secondary/50 p-4 border border-border/40">
                      <span className="text-xs text-muted-foreground font-semibold block uppercase tracking-wider">Milestone Amount</span>
                      <span className="text-base font-extrabold text-foreground mt-1 block">
                        {formatCurrency(m.amount)}
                      </span>
                    </div>
                    <div className="rounded-xl bg-secondary/50 p-4 border border-border/40">
                      <span className="text-xs text-muted-foreground font-semibold block uppercase tracking-wider">Due Date</span>
                      <span className="text-base font-extrabold text-foreground mt-1 block">
                        {typeof (m as any).dueDate === "string" ? new Date((m as any).dueDate).toLocaleDateString() : "No date"}
                      </span>
                    </div>
                    <div className="rounded-xl bg-secondary/50 p-4 border border-border/40">
                      <span className="text-xs text-muted-foreground font-semibold block uppercase tracking-wider">Submitted</span>
                      <span className="text-base font-extrabold text-foreground mt-1 block">
                        {m.submittedAt ? new Date(m.submittedAt).toLocaleDateString() : "Pending"}
                      </span>
                    </div>
                  </div>

                  <div className="mt-5 pt-5 border-t border-border/60 flex justify-end">
                    <a
                      href={`/dashboard/verify/${m.id}`}
                      className="inline-flex items-center justify-center rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground shadow-sm hover:scale-[1.01] transition duration-200"
                    >
                      Review Milestone
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
