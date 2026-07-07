import Image from "next/image"
import Link from "next/link"
import { CheckCircle2, XCircle } from "lucide-react"
import { redirect } from "next/navigation"
import { getSession } from "@/lib/session"
import { getProjectById, getProjectMilestones } from "@/lib/queries"
import { getMilestoneVerifications } from "@/lib/queries"
import { submitVerification } from "@/app/actions/milestones"
import { Card } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { formatCurrency } from "@/lib/roles"
import { StatusBadge } from "@/components/status-badge"

export const dynamic = "force-dynamic"

export default async function VerifyMilestonePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const milestoneId = Number(id)
  const user = await getSession()

  if (!user || !["verifier", "admin"].includes(user.role)) {
    return (
      <div className="flex min-h-svh flex-col bg-background">
        <main className="mx-auto w-full max-w-6xl px-4 py-16">
          <p className="text-muted-foreground">
            Access denied. Verifier or admin role required.
          </p>
        </main>
      </div>
    )
  }

  const { db } = await import("@/lib/db")
  const { milestones: ms } = await import("@/lib/db/schema")
  const { eq } = await import("drizzle-orm")

  const rows = await db.select().from(ms).where(eq(ms.id, milestoneId))
  const milestone = rows[0]
  if (!milestone) {
    return (
      <div className="flex min-h-svh flex-col bg-background">
        <main className="mx-auto w-full max-w-6xl px-4 py-16">
          <p className="text-muted-foreground">Milestone not found.</p>
        </main>
      </div>
    )
  }

  const project = await getProjectById(milestone.projectId)
  if (!project) {
    return (
      <div className="flex min-h-svh flex-col bg-background">
        <main className="mx-auto w-full max-w-6xl px-4 py-16">
          <p className="text-muted-foreground">Project not found.</p>
        </main>
      </div>
    )
  }

  const verifications = await getMilestoneVerifications(milestoneId)
  const latestVerification = verifications[0]

  return (
    <div className="flex min-h-svh flex-col bg-background">
      <main className="mx-auto w-full max-w-4xl px-4 py-12">
        <div className="mb-6 overflow-hidden rounded-[2rem] border border-border/70 bg-card p-6 shadow-sm sm:p-8">
          <div className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
            Milestone review
          </div>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Milestone verification
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-7 text-muted-foreground">
            Confirm the evidence, review the proposer notes, and leave a clear verification report.
          </p>
        </div>

        <Card className="mb-6 rounded-[1.75rem] border border-border/70 p-6 shadow-sm">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <Link href={`/projects/${project.id}`} className="font-medium text-foreground transition hover:text-primary">
                {project.title}
              </Link>
              <p className="mt-1 text-lg font-semibold text-foreground">
                {milestone.title}
              </p>
            </div>
            <StatusBadge status={milestone.status} />
          </div>
          <p className="mt-3 text-sm leading-7 text-muted-foreground">
            {milestone.description}
          </p>
          <p className="mt-2 text-sm font-medium text-primary">
            {formatCurrency(milestone.amount)}
          </p>
        </Card>

        {verifications.length > 0 && latestVerification && (
          <Card className="mb-6 rounded-[1.75rem] border border-border/70 p-6 shadow-sm">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h3 className="font-semibold text-foreground">Verification details</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Last reviewed by {latestVerification.verifierName || latestVerification.verifierId}
                </p>
              </div>
              <div className="text-sm text-muted-foreground">
                {new Date(latestVerification.createdAt).toLocaleString()}
              </div>
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-border/40 bg-secondary/50 p-4 text-sm">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Verifier ID</p>
                <p className="mt-1 font-medium text-foreground">{latestVerification.verifierId}</p>
              </div>
              <div className="rounded-2xl border border-border/40 bg-secondary/50 p-4 text-sm">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Decision</p>
                <p className="mt-1 font-medium capitalize text-foreground">{latestVerification.decision}</p>
              </div>
            </div>

            <p className="mt-4 whitespace-pre-line text-sm leading-7 text-muted-foreground">
              {latestVerification.report}
            </p>
          </Card>
        )}

        {(milestone.evidenceNote || milestone.evidenceUrls) && (
          <Card className="mb-6 rounded-[1.75rem] border border-border/70 p-6 shadow-sm">
            <h3 className="mb-2 font-semibold text-foreground">Evidence submitted</h3>
            {milestone.evidenceNote ? (
              <p className="whitespace-pre-line text-sm leading-7 text-muted-foreground">
                {milestone.evidenceNote}
              </p>
            ) : null}
            {milestone.evidenceUrls ? (
              <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {milestone.evidenceUrls
                  .split(/\s*[\n,]\s*/)
                  .map((u) => u.trim())
                  .filter(Boolean)
                  .map((url) => (
                    <a
                      key={url}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="overflow-hidden rounded-[1.25rem] border border-input bg-background"
                    >
                      <Image
                        src={url || "/placeholder.svg"}
                        alt="Milestone proof"
                        width={400}
                        height={300}
                        className="h-36 w-full object-cover"
                      />
                    </a>
                  ))}
              </div>
            ) : null}
          </Card>
        )}

        <form action={submitVerificationForm} className="space-y-4 rounded-[1.75rem] border border-border/70 bg-card p-6 shadow-sm">
          <input type="hidden" name="milestoneId" value={milestoneId} />

          <div>
            <Label htmlFor="report">Verification report</Label>
            <Textarea
              id="report"
              name="report"
              required
              rows={4}
              placeholder="Summarize what you checked, what evidence supports it, and your recommendation."
            />
          </div>

          <div className="flex flex-col gap-2 sm:flex-row">
            <button
              type="submit"
              name="decision"
              value="approve"
              className="inline-flex flex-1 items-center justify-center rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
            >
              <CheckCircle2 className="size-4 mr-2" />
              Recommend approval
            </button>
            <button
              type="submit"
              name="decision"
              value="reject"
              className="inline-flex flex-1 items-center justify-center rounded-full border border-border bg-background px-4 py-2 text-sm font-medium hover:bg-muted"
            >
              <XCircle className="size-4 mr-2" />
              Raise concerns
            </button>
          </div>
        </form>
      </main>
    </div>
  )
}

async function submitVerificationForm(formData: FormData) {
  "use server"
  const milestoneId = Number(formData.get("milestoneId"))
  const decision = formData.get("decision") as "approve" | "reject"
  const report = formData.get("report") as string

  await submitVerification(milestoneId, decision, report)
  redirect("/dashboard/verify")
}
