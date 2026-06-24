import Link from "next/link"
import { redirect } from "next/navigation"
import { AlertTriangle, HelpCircle, Shield } from "lucide-react"
import { getSession } from "@/lib/session"
import { Card } from "@/components/ui/card"

export const dynamic = "force-dynamic"

export default async function SuspendedDashboard() {
  const user = await getSession()
  if (!user) return redirect("/sign-in")
  if (user.role !== "suspended") return redirect("/dashboard")

  return (
    <div className="flex min-h-svh flex-col bg-background">
      <main className="mx-auto w-full max-w-4xl px-4 py-8 sm:py-16">
        {/* Alert Banner */}
        <Card className="p-6 sm:p-8 mb-8 border-l-4 border-l-red-500 bg-red-50 dark:bg-red-950/30">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
              <AlertTriangle className="size-8 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Account suspended</h1>
              <p className="mt-2 text-sm text-muted-foreground max-w-2xl">
                Your account has been temporarily suspended. Your access to the platform is restricted until this is resolved.
              </p>
            </div>
          </div>
        </Card>

        {/* What this means */}
        <div className="grid gap-6 sm:grid-cols-2 mb-8">
          <Card className="p-6 border-l-4 border-l-amber-500/50">
            <div className="flex items-start gap-3">
              <div className="rounded-lg bg-amber-100 dark:bg-amber-900/30 p-2 flex-shrink-0">
                <Shield className="size-5 text-amber-700 dark:text-amber-400" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-2">Access restricted</h3>
                <p className="text-sm text-muted-foreground">
                  You cannot create or manage projects, verify milestones, or release funds while suspended.
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6 border-l-4 border-l-blue-500/50">
            <div className="flex items-start gap-3">
              <div className="rounded-lg bg-blue-100 dark:bg-blue-900/30 p-2 flex-shrink-0">
                <HelpCircle className="size-5 text-blue-700 dark:text-blue-400" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-2">Get help</h3>
                <p className="text-sm text-muted-foreground">
                  Contact our support team to understand why this happened and how to resolve it.
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Info Card */}
        <Card className="p-8 mb-8 bg-gradient-to-br from-muted/50 to-muted">
          <h2 className="text-xl font-bold text-foreground mb-4">What you can do</h2>
          <ul className="space-y-3 text-sm text-muted-foreground">
            <li className="flex items-start gap-3">
              <span className="inline-block rounded-full bg-primary/10 text-primary font-bold text-xs p-1.5 mt-0.5">✓</span>
              <span>Sign in and view your dashboard status</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="inline-block rounded-full bg-primary/10 text-primary font-bold text-xs p-1.5 mt-0.5">✓</span>
              <span>Review your account information in the profile section</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="inline-block rounded-full bg-primary/10 text-primary font-bold text-xs p-1.5 mt-0.5">✓</span>
              <span>Contact the support team immediately to request reinstatement</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="inline-block rounded-full bg-primary/10 text-primary font-bold text-xs p-1.5 mt-0.5">✓</span>
              <span>Provide any relevant information to help resolve the issue</span>
            </li>
          </ul>
        </Card>

        {/* CTA */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/support"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition"
          >
            <HelpCircle className="size-4" />
            Contact support
          </Link>
          <Link
            href="/dashboard/profile"
            className="inline-flex items-center justify-center rounded-lg border border-primary/30 bg-primary/5 px-6 py-3 text-sm font-semibold text-foreground hover:bg-primary/10 transition"
          >
            View profile
          </Link>
        </div>
      </main>
    </div>
  )
}

}
