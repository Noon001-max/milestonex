import { getSession } from "@/lib/session"
import { getMyDonations } from "@/app/actions/donations"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { formatCurrency, ROLE_LABELS } from "@/lib/roles"
import { Users, FileText, CheckCircle2, AlertCircle, FileSearch } from "lucide-react"
import { StatusBadge } from "@/components/status-badge"

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

  const donations = await getMyDonations()

  return (
    <div className="flex min-h-svh flex-col bg-background">
      <main className="mx-auto w-full max-w-6xl px-4 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">
            Welcome back, {user.name}
          </h1>
          <p className="mt-1 text-muted-foreground">
            Role:{" "}
            <Badge variant="secondary">
              {ROLE_LABELS[user.role] || user.role}
            </Badge>
          </p>
        </div>

        <div className="mb-8 grid gap-4">
          <h2 className="text-lg font-semibold text-foreground">
            Your contributions
          </h2>
          {donations.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {donations.slice(0, 6).map((d) => (
                <Card key={d.id} className="p-4">
                  <div className="flex justify-between">
                    <span className="font-medium text-foreground">
                      {d.projectTitle}
                    </span>
                    <span className="font-semibold text-primary">
                      {formatCurrency(d.amount)}
                    </span>
                  </div>
                  <div className="mt-1 flex gap-2 text-xs">
                    <Badge variant="outline" className="capitalize">
                      {d.kind}
                    </Badge>
                    <StatusBadge status={d.projectStatus} />
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="p-6 text-center">
              <p className="text-muted-foreground">No contributions yet.</p>
              <a href="/projects" className="inline-block mt-4 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
                Browse projects
              </a>
            </Card>
          )}
        </div>

        <div className="grid gap-4">
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-foreground">
              Use the sidebar to access your role dashboard
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Navigation for your current role is available on the left. The dashboard content here shows your recent contributions and summary information.
            </p>
          </Card>
        </div>
      </main>
    </div>
  )
}