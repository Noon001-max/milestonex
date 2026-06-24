import Link from "next/link"
import { Gift, DollarSign, Lock, TrendingUp, CheckCircle2 } from "lucide-react"
import { getSession } from "@/lib/session"
import { getMyDonations } from "@/app/actions/donations"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { StatusBadge } from "@/components/status-badge"
import { formatCurrency } from "@/lib/roles"

export const dynamic = "force-dynamic"

export default async function DonorDashboard() {
  const user = await getSession()
  if (!user) {
    return (
      <div className="flex min-h-svh flex-col bg-background">
        <main className="mx-auto w-full max-w-6xl px-4 py-16">
          <p className="text-muted-foreground">
            <Link href="/sign-in" className="text-primary hover:underline">
              Sign in
            </Link>{" "}
            to view your contributions.
          </p>
        </main>
      </div>
    )
  }

  const donations = await getMyDonations()
  const totalGiven = donations.reduce((sum, d) => sum + d.amount, 0)
  const donationsCount = donations.filter((d) => d.kind === "donation").length
  const investmentsCount = donations.filter((d) => d.kind === "investment").length
  const activeProjects = new Set(donations.map((d) => d.projectId)).size

  return (
    <div className="flex min-h-svh flex-col bg-background">
      <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold tracking-tight text-foreground">
            My contributions
          </h1>
          <p className="mt-2 text-muted-foreground">
            Track your donations and investments across community projects
          </p>
        </div>

        {/* Stats Cards */}
        <div className="mb-8 grid gap-4 sm:grid-cols-4">
          <Card className="p-6 border-l-4 border-l-primary/50">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total contributed</p>
                <p className="mt-2 text-3xl font-bold text-foreground">
                  {formatCurrency(totalGiven)}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">Across all projects</p>
              </div>
              <div className="rounded-lg bg-primary/10 p-2">
                <DollarSign className="size-5 text-primary" />
              </div>
            </div>
          </Card>

          <Card className="p-6 border-l-4 border-l-blue-500/50">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Donations</p>
                <p className="mt-2 text-3xl font-bold text-foreground">
                  {donationsCount}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">Gifts to projects</p>
              </div>
              <div className="rounded-lg bg-blue-100 dark:bg-blue-900/30 p-2">
                <Gift className="size-5 text-blue-700 dark:text-blue-400" />
              </div>
            </div>
          </Card>

          <Card className="p-6 border-l-4 border-l-amber-500/50">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Investments</p>
                <p className="mt-2 text-3xl font-bold text-foreground">
                  {investmentsCount}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">Stake in projects</p>
              </div>
              <div className="rounded-lg bg-amber-100 dark:bg-amber-900/30 p-2">
                <TrendingUp className="size-5 text-amber-700 dark:text-amber-400" />
              </div>
            </div>
          </Card>

          <Card className="p-6 border-l-4 border-l-emerald-500/50">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active projects</p>
                <p className="mt-2 text-3xl font-bold text-foreground">
                  {activeProjects}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">Contributing to</p>
              </div>
              <div className="rounded-lg bg-emerald-100 dark:bg-emerald-900/30 p-2">
                <CheckCircle2 className="size-5 text-emerald-700 dark:text-emerald-400" />
              </div>
            </div>
          </Card>
        </div>

        {/* Contributions List */}
        {donations.length > 0 ? (
          <div>
            <h2 className="text-lg font-semibold text-foreground mb-4">
              Your contributions
            </h2>
            <div className="grid gap-4">
              {donations.map((d) => (
                <Card key={d.id} className="p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <a
                        href={`/projects/${d.projectId}`}
                        className="text-lg font-semibold text-foreground hover:text-primary transition"
                      >
                        {d.projectTitle}
                      </a>
                      <p className="mt-2 text-sm text-muted-foreground">
                        {d.kind === "donation" ? "💝 Donation" : "📈 Investment"}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-foreground">
                        {formatCurrency(d.amount)}
                      </p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {new Date(d.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 flex items-center gap-2">
                    <Badge variant="secondary" className="capitalize">
                      {d.kind}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {d.projectStatus === "funding" ? "🟡 Fundraising" : d.projectStatus === "started" ? "🟢 Active" : d.projectStatus === "completed" ? "✓ Completed" : "⏳ Pending"}
                    </Badge>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        ) : (
          <Card className="p-12 text-center">
            <Gift className="size-12 text-primary mx-auto mb-4" />
            <p className="text-lg font-medium text-foreground mb-2">
              You haven't made any contributions yet
            </p>
            <p className="text-muted-foreground mb-6">
              Start by exploring and supporting community projects
            </p>
            <a
              href="/projects"
              className="inline-block rounded-lg bg-primary px-6 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition"
            >
              Browse projects
            </a>
          </Card>
        )}
      </main>
    </div>
  )
}
a
                    href={`/projects/${d.projectId}`}
                    className="font-medium text-foreground hover:underline"
                  >
                    {d.projectTitle}
                  </a>
                  <span className="font-semibold text-primary">
                    {formatCurrency(d.amount)}
                  </span>
                </div>
                <div className="mt-2 flex items-center gap-3 text-xs">
                  <span className="capitalize text-muted-foreground">
                    {d.kind}
                  </span>
                  <span className="text-muted-foreground">•</span>
                  <StatusBadge status={d.projectStatus} />
                  <span className="text-muted-foreground">
                    {new Date(d.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="p-8 text-center">
            <p className="text-muted-foreground mb-4">
              You haven't contributed to any projects yet.
            </p>
            <a href="/projects" className="inline-block rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
              Browse projects
            </a>
          </Card>
        )}
      </main>
    </div>
  )
}