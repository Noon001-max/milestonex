import { getSession } from "@/lib/session"
import { NewProjectForm } from "@/components/new-project-form"

export const dynamic = "force-dynamic"

export default async function NewProjectPage() {
  const user = await getSession()
  
  // Only project proposers can create projects
  if (!user || user.role !== "owner") {
    return (
      <div className="flex min-h-svh flex-col bg-background">
        <main className="mx-auto w-full max-w-3xl px-4 py-12">
          <p className="text-muted-foreground">
            Only project proposers can submit projects. Please contact an administrator if you need to change your role.
          </p>
        </main>
      </div>
    )
  }

  return (
    <div className="flex min-h-svh flex-col bg-background">
      <main className="mx-auto w-full max-w-6xl px-4 py-10">
        <div className="mb-6 rounded-2xl border border-border/70 bg-card/80 p-4 shadow-sm sm:p-5">
          <h1 className="text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
            New project proposal
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground sm:text-base">
            Share your idea clearly, define milestones, and give donors confidence in how the project will unfold.
          </p>
        </div>

        <div className="mb-6 rounded-2xl border border-primary/15 bg-primary/5 p-4 text-sm text-muted-foreground">
          <p className="font-medium text-foreground">A strong proposal usually includes:</p>
          <ul className="mt-2 space-y-1 pl-5">
            <li>• a clear title and summary</li>
            <li>• a detailed description of the impact</li>
            <li>• milestone-based funding goals</li>
          </ul>
        </div>

        <NewProjectForm />
      </main>
    </div>
  )
}
