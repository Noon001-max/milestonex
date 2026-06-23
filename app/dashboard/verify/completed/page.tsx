import { CheckCircle2 } from "lucide-react"
import { getSession } from "@/lib/session"
import { redirect } from "next/navigation"
import { getCompletedVerifications } from "@/app/actions/milestones"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { formatCurrency } from "@/lib/roles"
import { StatusBadge } from "@/components/status-badge"

export const dynamic = "force-dynamic"

export default async function CompletedVerificationsPage() {
  const user = await getSession()
  if (!user) return redirect("/sign-in")
  if (user.role !== "verifier") return redirect("/dashboard")

  const reviews = await getCompletedVerifications()

  return (
    <div className="flex min-h-svh flex-col bg-background">
      <main className="mx-auto w-full max-w-6xl px-4 py-12">
        <div className="mb-6">
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">
            Completed verifications
          </h1>
          <p className="mt-1 text-muted-foreground">
            Projects and milestones you have reviewed.
          </p>
        </div>

        {reviews.length > 0 ? (
          <div className="grid gap-4">
            {reviews.map((review) => (
              <Card key={review.id} className="p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <a
                      href={`/projects/${review.projectId}`}
                      className="font-medium text-muted-foreground hover:underline"
                    >
                      {review.projectTitle}
                    </a>
                    <p className="font-semibold text-lg text-foreground mt-1">
                      {review.milestoneTitle}
                    </p>
                    <div className="mt-2 flex flex-wrap gap-2 text-xs">
                      <Badge variant="outline" className="capitalize">
                        {review.decision}
                      </Badge>
                      <span className="text-muted-foreground">
                        {formatCurrency(review.milestoneAmount)}
                      </span>
                      <StatusBadge status={review.milestoneStatus} />
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Reviewed {new Date(review.reviewedAt).toLocaleDateString()}
                  </div>
                </div>
                <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                  {review.report}
                </p>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="p-12 text-center">
            <CheckCircle2 className="size-12 text-primary mx-auto mb-4" />
            <p className="text-muted-foreground">No completed verifications yet.</p>
          </Card>
        )}
      </main>
    </div>
  )
}
