import Link from "next/link"
import { redirect } from "next/navigation"
import { getSession } from "@/lib/session"
import { Card } from "@/components/ui/card"

export const dynamic = "force-dynamic"

export default async function SuspendedDashboard() {
  const user = await getSession()
  if (!user) return redirect("/sign-in")
  if (user.role !== "suspended") return redirect("/dashboard")

  return (
    <div className="flex min-h-svh flex-col bg-background">
      <main className="mx-auto w-full max-w-6xl px-4 py-12">
        <div className="mb-6">
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">
            Account suspended
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            Your account has been suspended. You can still view support information and contact the team for help.
          </p>
        </div>

        <Card className="p-6">
          <h2 className="text-xl font-semibold text-foreground">What this means</h2>
          <p className="mt-4 text-sm leading-7 text-muted-foreground">
            Your access is temporarily restricted. You cannot create or manage projects, verify milestones, or release funds until the suspension is lifted.
          </p>
          <div className="mt-6 space-y-4 text-sm text-muted-foreground">
            <p>
              If you believe this suspension is an error, please contact support and request reinstatement.
            </p>
            <p>
              You can still sign in, review your dashboard status, and follow the support instructions below.
            </p>
          </div>

          <div className="mt-8">
            <Link
              href="/support"
              className="inline-flex items-center justify-center rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
            >
              Contact support
            </Link>
          </div>
        </Card>
      </main>
    </div>
  )
}
