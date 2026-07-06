import { redirect } from "next/navigation"
import { getSession } from "@/lib/session"
import { getAllProjects } from "@/lib/queries"
import { ProposalCard } from "@/components/status-cards"

export const dynamic = "force-dynamic"

export default async function RejectedProjectsPage() {
  const user = await getSession()
  if (!user) return redirect("/sign-in")
  if (user.role !== "admin") return redirect("/dashboard")

  const projects = await getAllProjects()
  const rejected = projects.filter((p: any) => p.status === "rejected")

  return (
    <div className="flex min-h-svh flex-col bg-background">
      <main className="mx-auto w-full max-w-6xl px-4 py-12">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-foreground">Rejected projects</h1>
            <p className="mt-1 text-muted-foreground">Projects that were rejected.</p>
          </div>
        </div>

        <div className="grid gap-4">
          {rejected.length > 0 ? (
            rejected.map((p: any) => (
              <ProposalCard
                key={p.id}
                id={p.id}
                title={p.title}
                subtitle={p.summary}
                status={"rejected"}
                date={new Date(p.updatedAt).toLocaleString()}
                href={`/dashboard/admin/projects/${p.id}`}
              />
            ))
          ) : (
            <div className="p-12 text-center">
              <p className="text-muted-foreground">No rejected projects.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
