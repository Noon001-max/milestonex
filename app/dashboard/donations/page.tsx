import Link from "next/link"
import { Gift, DollarSign, Lock, TrendingUp, CheckCircle2, ArrowRight, Sparkles } from "lucide-react"
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
        <div className="mb-8 animate-fade-in-up">
          <h1 className="text-4xl font-extrabold tracking-tight text-foreground">
            My contributions
          </h1>
          <p className="mt-2 text-muted-foreground">
            Track your donations and investments across community projects
          </p>
        </div>

        {/* Stats Cards */}
        <div className="mb-8 grid gap-4 sm:grid-cols-4 stagger-children">
          <Card className="group p-5 border border-border/80 border-l-4 border-l-primary/70 bg-card shadow-sm hover-glow hover:-translate-y-0.5 transition-all duration-300 animate-fade-in-up">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Total Contributed</p>
                <p className="mt-2 text-2xl font-extrabold text-foreground tracking-tight">
                  {formatCurrency(totalGiven)}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">Across all projects</p>
              </div>
              <div className="rounded-xl bg-primary/10 p-2.5 group-hover:bg-primary/15 transition-colors duration-200">
                <DollarSign className="size-4.5 text-primary" />
              </div>
            </div>
          </Card>

          <Card className="group p-5 border border-border/80 border-l-4 border-l-indigo-500/70 bg-card shadow-sm hover-glow hover:-translate-y-0.5 transition-all duration-300 animate-fade-in-up">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Donations</p>
                <p className="mt-2 text-2xl font-extrabold text-foreground tracking-tight">
                  {donationsCount}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">Gifts to projects</p>
              </div>
              <div className="rounded-xl bg-indigo-500/10 p-2.5 group-hover:bg-indigo-500/15 transition-colors duration-200">
                <Gift className="size-4.5 text-indigo-500" />
              </div>
            </div>
          </Card>

          <Card className="group p-5 border border-border/80 border-l-4 border-l-amber-500/70 bg-card shadow-sm hover-glow hover:-translate-y-0.5 transition-all duration-300 animate-fade-in-up">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Investments</p>
                <p className="mt-2 text-2xl font-extrabold text-foreground tracking-tight">
                  {investmentsCount}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">Stake in projects</p>
              </div>
              <div className="rounded-xl bg-amber-500/10 p-2.5 group-hover:bg-amber-500/15 transition-colors duration-200">
                <TrendingUp className="size-4.5 text-amber-500" />
              </div>
            </div>
          </Card>

          <Card className="group p-5 border border-border/80 border-l-4 border-l-emerald-500/70 bg-card shadow-sm hover-glow hover:-translate-y-0.5 transition-all duration-300 animate-fade-in-up">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Active Projects</p>
                <p className="mt-2 text-2xl font-extrabold text-foreground tracking-tight">
                  {activeProjects}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">Contributing to</p>
              </div>
              <div className="rounded-xl bg-emerald-500/10 p-2.5 group-hover:bg-emerald-500/15 transition-colors duration-200">
                <CheckCircle2 className="size-4.5 text-emerald-500" />
              </div>
            </div>
          </Card>
        </div>

        {/* Contributions List */}
        {donations.length > 0 ? (
          <div className="animate-fade-in-up" style={{ animationDelay: "300ms" }}>
            <h2 className="text-lg font-bold text-foreground mb-4">
              Your contributions
            </h2>
            <div className="grid gap-4 stagger-children">
              {donations.map((d) => (
                <Card key={d.id} className="group p-6 border border-border/80 bg-card hover-glow transition-all duration-300 animate-fade-in-up">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <a
                        href={`/projects/${d.projectId}`}
                        className="text-lg font-bold text-foreground hover:text-primary transition-colors duration-200 group-hover:text-primary"
                      >
                        {d.projectTitle}
                      </a>
                      <p className="mt-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        {d.kind === "donation" ? "💝 Donation" : "📈 Investment"}
                      </p>
                    </div>
                    <div className="text-left sm:text-right flex-shrink-0">
                      <p className="text-2xl font-extrabold text-foreground tracking-tight">
                        {formatCurrency(d.amount)}
                      </p>
                      <p className="mt-1 text-xs text-muted-foreground font-semibold">
                        Contributed: {new Date(d.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-border/40 flex flex-wrap items-center gap-2">
                    <Badge variant="secondary" className="capitalize text-xs font-semibold px-2.5 py-0.5">
                      {d.kind}
                    </Badge>
                    <Badge variant="outline" className="text-xs font-semibold px-2.5 py-0.5 bg-secondary/30">
                      {d.projectStatus === "funding" ? "🟡 Fundraising" : d.projectStatus === "started" ? "🟢 Active" : d.projectStatus === "completed" ? "✓ Completed" : "⏳ Pending"}
                    </Badge>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        ) : (
          <Card className="p-16 text-center border-dashed bg-card/40 animate-fade-in-up">
            <div className="animate-float mx-auto mb-4">
              <Gift className="size-12 text-primary/80 mx-auto" />
            </div>
            <p className="text-xl font-semibold text-foreground mb-2">
              You haven&apos;t made any contributions yet
            </p>
            <p className="text-muted-foreground text-sm mb-6 max-w-md mx-auto">
              Explore live community proposals and support projects with escrow protection.
            </p>
            <a
              href="/dashboard/explore"
              className="group inline-flex items-center justify-center rounded-full bg-primary px-6 py-3 text-sm font-bold text-primary-foreground hover:bg-primary/90 hover:scale-[1.02] active:scale-98 transition shadow-md"
            >
              Browse Projects
              <ArrowRight className="size-4 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
            </a>
          </Card>
        )}
      </main>
    </div>
  )
}
