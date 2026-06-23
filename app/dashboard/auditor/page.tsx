import Link from "next/link"
import { ArrowLeft, Banknote, FileText, TrendingUp } from "lucide-react"
import { getSession } from "@/lib/session"
import { redirect } from "next/navigation"
import { getMyProjects } from "@/app/actions/projects"
import { Card } from "@/components/ui/card"
import { formatCurrency } from "@/lib/roles"
import { StatusBadge } from "@/components/status-badge"

export const dynamic = "force-dynamic"

export default async function AuditorDashboard() {
  const user = await getSession()
  if (!user) return redirect("/sign-in")
  if (user.role !== "auditor") return redirect("/dashboard")
  const projects = await getMyProjects()

  return (
    <div className="flex min-h-svh flex-col bg-background">
      <main className="mx-auto w-full max-w-6xl px-4 py-12">
        <div className="mb-6">
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">
            Auditor view
          </h1>
          <p className="mt-1 text-muted-foreground">
            Review financial records and accountability reports.
          </p>
        </div>

        <div className="grid gap-6">
          {projects.length > 0 ? (
            projects.map((p) => (
              <Card key={p.id} className="p-6">
                <div className="flex items-center justify-between">
                  <a
                    href={`/projects/${p.id}`}
                    className="font-semibold text-lg text-foreground hover:underline"
                  >
                    {p.title}
                  </a>
                  <StatusBadge status={p.status} />
                </div>
                <div className="mt-4 grid gap-3 sm:grid-cols-3 text-sm">
                  <div>
                    <span className="text-muted-foreground">Total raised:</span>
                    <span className="ml-1 font-medium text-foreground">
                      {formatCurrency(p.fundedAmount)}
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">In escrow:</span>
                    <span className="ml-1 font-medium text-primary">
                      {formatCurrency(p.escrowBalance)}
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Released:</span>
                    <span className="ml-1 font-medium text-foreground">
                      {formatCurrency(p.releasedAmount)}
                    </span>
                  </div>
                </div>
              </Card>
            ))
          ) : (
            <Card className="p-12 text-center">
              <FileText className="size-12 text-primary mx-auto mb-4" />
              <p className="text-muted-foreground">No projects to audit.</p>
            </Card>
          )}
        </div>
      </main>
    </div>
  )
}