import { getSession } from "@/lib/session"
import { redirect } from "next/navigation"
import Link from "next/link"

export const dynamic = "force-dynamic"

export default async function DashboardPage() {
  const user = await getSession()

  if (!user) {
    return (
      <div className="flex min-h-svh flex-col bg-background">
        <main className="mx-auto w-full max-w-6xl px-4 py-16">
          <p className="text-muted-foreground">
            <Link href="/sign-in" className="text-primary hover:underline">
              Sign in
            </Link>{" "}
            to access your dashboard.
          </p>
        </main>
      </div>
    )
  }

  switch (user.role) {
    case "donor":
      redirect("/dashboard/donations")
    case "owner":
      redirect("/dashboard/projects")
    case "verifier":
      redirect("/dashboard/verify")
    case "admin":
      redirect("/dashboard/admin")
    case "auditor":
      redirect("/dashboard/auditor")
    default:
      return (
        <div className="flex min-h-svh flex-col bg-background">
          <main className="mx-auto w-full max-w-6xl px-4 py-16">
            <p className="text-muted-foreground">
              Your account role is not linked to a dashboard yet.
            </p>
          </main>
        </div>
      )
  }
}
