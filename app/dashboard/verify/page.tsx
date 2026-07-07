import Link from "next/link"
import { CheckCircle2, Clock, ShieldCheck, ArrowRight } from "lucide-react"
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
        <div className="mb-8 overflow-hidden rounded-[2rem] border border-border/70 bg-card shadow-sm">
          <div className="grid gap-0 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="p-6 sm:p-8">
              <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                <ShieldCheck className="size-3.5" />
                Community verifier
              </div>
              <h1 className="mt-3 text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
                Verification queue
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base">
                Review milestone evidence, confirm delivery, and keep the approval flow moving.
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  href="/dashboard/release-funds"
                  className="inline-flex h-9 items-center justify-center rounded-full bg-primary px-4 text-sm font-medium text-primary-foreground transition-all hover:opacity-90"
                >
                  Release queue
                  <ArrowRight className="ml-2 size-4" />
                </Link>
              </div>
            </div>

            <div className="grid gap-3 border-t border-border/70 bg-secondary/20 p-6 sm:p-8 lg:border-l lg:border-t-0">
              <Card className="rounded-[1.5rem] border border-border/70 bg-background/80 p-4 shadow-sm">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">Pending reviews</p>
                    <p className="mt-2 text-2xl font-bold text-foreground">{queue.length}</p>
                  </div>
                  <div className="rounded-2xl bg-primary/10 p-3 text-primary">
                    <Clock className="size-5" />
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>

        {queue.length > 0 ? (
          <div>
            <div className="mb-4 flex items-end justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold text-foreground">Milestones to review</h2>
                <p className="mt-1 text-sm text-muted-foreground">Each card shows the evidence, amount, and submission status.</p>
              </div>
            </div>
            <div className="grid gap-4">
              {queue.map((m, idx) => (
                <Card key={m.id} className="border border-border/70 bg-card p-6 shadow-sm transition-shadow hover:shadow-md">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="mb-2 flex items-center gap-2">
                        <a
                          href={`/projects/${m.projectId}`}
                          className="text-xs font-semibold uppercase tracking-wider text-muted-foreground transition-colors hover:text-primary"
                        >
                          {m.projectTitle}
                        </a>
                        <Badge variant="outline" className="border-border/50 bg-secondary/50 px-2 py-0.5 text-[10px] font-semibold">
                          Milestone {(m as any).orderIndex != null ? (m as any).orderIndex + 1 : idx + 1}
                        </Badge>
                      </div>
                      <p className="text-lg font-semibold text-foreground">
                        {m.title}
                      </p>
                      <p className="mt-2 max-w-2xl text-sm leading-7 text-muted-foreground">
                        {m.evidenceNote || m.description}
                      </p>
                      {m.evidenceUrls && m.evidenceUrls.length > 0 && (
                        <div className="mt-3.5">
                          <span className="inline-flex items-center gap-1 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-semibold text-primary">
                            📎 {m.evidenceUrls.length} file(s) attached
                          </span>
                        </div>
                      )}
                    </div>
                    <StatusBadge status={m.status} />
                  </div>

                  <div className="mt-6 grid gap-3 sm:grid-cols-3 text-sm">
                    <div className="rounded-2xl border border-border/40 bg-secondary/50 p-4">
                      <span className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">Milestone amount</span>
                      <span className="mt-1 block text-base font-bold text-foreground">
                        {formatCurrency(m.amount)}
                      </span>
                    </div>
                    <div className="rounded-2xl border border-border/40 bg-secondary/50 p-4">
                      <span className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">Due date</span>
                      <span className="mt-1 block text-base font-bold text-foreground">
                        {typeof (m as any).dueDate === "string" ? new Date((m as any).dueDate).toLocaleDateString() : "No date"}
                      </span>
                    </div>
                    <div className="rounded-2xl border border-border/40 bg-secondary/50 p-4">
                      <span className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">Submitted</span>
                      <span className="mt-1 block text-base font-bold text-foreground">
                        {m.submittedAt ? new Date(m.submittedAt).toLocaleDateString() : "Pending"}
                      </span>
                    </div>
                  </div>

                  <div className="mt-5 flex justify-end border-t border-border/60 pt-5">
                    <a
                      href={`/dashboard/verify/${m.id}`}
                      className="inline-flex items-center justify-center rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm transition duration-200 hover:scale-[1.01]"
                    >
                      Review Milestone
                    </a>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        ) : (
          <Card className="rounded-[1.75rem] p-12 text-center">
            <CheckCircle2 className="mx-auto mb-4 size-12 text-primary" />
            <p className="mb-2 text-lg font-medium text-foreground">
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
