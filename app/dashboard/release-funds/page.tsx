import { redirect } from "next/navigation"
import { getSession } from "@/lib/session"
import { getApprovedMilestones, releaseMilestoneFunds } from "@/app/actions/projects"
import { Card } from "@/components/ui/card"
import { formatCurrency } from "@/lib/roles"

export const dynamic = "force-dynamic"

export default async function ReleaseFundsPage() {
  const user = await getSession()
  if (!user) return redirect("/sign-in")
  if (user.role !== "auditor") return redirect("/dashboard")

  const milestones = await getApprovedMilestones()

  return (
    <div className="flex min-h-svh flex-col bg-background">
      <main className="mx-auto w-full max-w-6xl px-4 py-12">
        <div className="mb-6">
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">
            Release funds
          </h1>
          <p className="mt-1 text-muted-foreground">
            Review approved milestones and release funds from escrow.
          </p>
        </div>

        {milestones.length > 0 ? (
          <div className="grid gap-4">
            {milestones.map((m) => (
              <Card key={m.id} className="p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-3">
                      <h2 className="text-lg font-semibold text-foreground truncate">{m.title}</h2>
                      <span className="rounded-full bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
                        Approved
                      </span>
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground">{m.description}</p>
                    <p className="mt-2 text-sm text-muted-foreground">Project: {m.projectTitle}</p>
                    <p className="mt-1 text-sm font-medium text-foreground">
                      Amount to release: {formatCurrency(m.amount)}
                    </p>
                  </div>

                  <div className="flex flex-col gap-3 sm:text-right">
                    <p className="text-sm text-muted-foreground">Available in escrow</p>
                    <p className="text-sm font-medium text-foreground">{formatCurrency(m.escrowBalance)}</p>
                  </div>
                </div>

                <div className="mt-6">
                  <form action={async function releaseFunds(formData: FormData) {
                    "use server"
                    const id = Number(formData.get("milestoneId"))
                    await releaseMilestoneFunds(id)
                  }}>
                    <input type="hidden" name="milestoneId" value={m.id} />
                    <button type="submit" className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
                      Release funds
                    </button>
                  </form>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="p-12 text-center">
            <p className="text-muted-foreground">No approved milestones pending release.</p>
          </Card>
        )}
      </main>
    </div>
  )
}
