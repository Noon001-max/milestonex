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
        <div className="mb-6">
          <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-foreground">
            New project proposal
          </h1>
          <p className="text-muted-foreground mt-2 max-w-2xl">
            Propose your project with clear goals and milestones. Fill in all details and define your funding milestones.
          </p>
        </div>

        <NewProjectForm />
      </main>
    </div>
  )
}
