import { redirect } from "next/navigation"
import { getSession } from "@/lib/session"
import { getApprovedProjectsByAdmin } from "@/app/actions/projects"
import { ProposalCard } from "@/components/status-cards"

export const dynamic = "force-dynamic"

export default async function ApprovedProjectsPage() {
  const user = await getSession()
  if (!user) return redirect("/sign-in")
  if (user.role !== "admin") return redirect("/dashboard")

  const projects = await getApprovedProjectsByAdmin()

  return (
    <div className="flex min-h-svh flex-col bg-background">
      <main className="mx-auto w-full max-w-6xl px-4 py-12">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-foreground">Approved projects</h1>
            <p className="mt-1 text-muted-foreground">Projects you've approved recently.</p>
          </div>
        </div>

        <div className="grid gap-4">
          {projects.length > 0 ? (
            projects.map((p) => (
              <ProposalCard
                key={p.id}
                id={p.id}
                title={p.title}
                subtitle={p.summary}
                status={"approved"}
                date={new Date(p.updatedAt).toLocaleString()}
                href={`/dashboard/admin/projects/${p.id}`}
              />
            ))
          ) : (
            <div className="p-12 text-center">
              <p className="text-muted-foreground">You haven't approved any projects yet.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
