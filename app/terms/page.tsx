import { Card } from "@/components/ui/card"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { getSession } from "@/lib/session"

export const dynamic = "force-dynamic"

export default async function TermsPage() {
  const user = await getSession()

  const sections = [
    {
      title: "Using the platform",
      body: "By using Milestone X, you agree to provide accurate information, follow applicable laws, and use the service only for lawful fundraising, verification, and project management activities.",
    },
    {
      title: "Accounts and responsibilities",
      body: "You are responsible for the security of your account and for all activity under it. Keep your credentials private and review your actions before submitting projects, donations, or approvals.",
    },
    {
      title: "Project and payment rules",
      body: "Funds may be held in escrow until milestones are approved. We may pause, review, or reject activity if submissions are incomplete, misleading, unsafe, or appear fraudulent.",
    },
    {
      title: "Prohibited use",
      body: "You may not use the service to mislead contributors, launder funds, harass others, violate intellectual property rights, or attempt to bypass platform controls.",
    },
    {
      title: "Limitation of liability",
      body: "We provide the service on an as-available basis. To the maximum extent allowed by law, Milestone X is not liable for indirect, incidental, or consequential damages arising from platform use.",
    },
  ]

  return (
    <div className="flex min-h-svh flex-col bg-background">
      <SiteHeader user={user} />

      <main className="mx-auto w-full max-w-4xl px-4 py-12 sm:py-16 lg:py-20">
        <div className="mb-8 space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">Legal</p>
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">Terms of Service</h1>
          <p className="max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base">
            These terms govern your access to Milestone X and explain the rules for using the platform responsibly.
          </p>
        </div>

        <div className="space-y-4">
          {sections.map((section) => (
            <Card key={section.title} className="p-6 sm:p-7">
              <h2 className="text-lg font-semibold text-foreground">{section.title}</h2>
              <p className="mt-3 text-sm leading-7 text-muted-foreground">{section.body}</p>
            </Card>
          ))}

          <Card className="p-6 sm:p-7">
            <h2 className="text-lg font-semibold text-foreground">Changes to these terms</h2>
            <p className="mt-3 text-sm leading-7 text-muted-foreground">
              We may update these terms from time to time. Continued use of the platform after changes take effect means you accept the updated terms.
            </p>
          </Card>
        </div>
      </main>

      <SiteFooter isLoggedIn={!!user} />
    </div>
  )
}