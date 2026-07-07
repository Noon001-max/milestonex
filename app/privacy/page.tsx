import { Card } from "@/components/ui/card"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { getSession } from "@/lib/session"

export const dynamic = "force-dynamic"

export default async function PrivacyPolicyPage() {
  const user = await getSession()

  const sections = [
    {
      title: "Information we collect",
      body: "We collect the information you provide when you create an account, launch a project, donate, submit evidence, or contact support. This may include your name, email address, profile details, payment activity, project submissions, and verification records.",
    },
    {
      title: "How we use information",
      body: "We use your information to operate the platform, process payments, track milestones, verify progress, detect fraud, respond to support requests, and improve the overall user experience.",
    },
    {
      title: "When we share information",
      body: "We only share data when it is necessary to run the platform, such as with payment and infrastructure providers, or when disclosure is required by law. We do not sell your personal data.",
    },
    {
      title: "Retention and security",
      body: "We retain data for as long as needed to provide the service, meet legal obligations, resolve disputes, and maintain audit trails. We apply reasonable administrative, technical, and organizational safeguards to protect information.",
    },
    {
      title: "Your choices",
      body: "You can review and update account details in your profile settings, and you may request corrections or account deletion where applicable. Some records may still be preserved for compliance or fraud prevention.",
    },
  ]

  return (
    <div className="flex min-h-svh flex-col bg-background">
      <SiteHeader user={user} />

      <main className="mx-auto w-full max-w-4xl px-4 py-12 sm:py-16 lg:py-20">
        <div className="mb-8 space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">Privacy</p>
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">Privacy Policy</h1>
          <p className="max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base">
            This policy explains what we collect, why we collect it, and how we protect it while you use Milestone X.
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
            <h2 className="text-lg font-semibold text-foreground">Contact us</h2>
            <p className="mt-3 text-sm leading-7 text-muted-foreground">
              If you have questions about privacy, email support@example.com and include Privacy Policy in the subject line.
            </p>
          </Card>
        </div>
      </main>

      <SiteFooter isLoggedIn={!!user} />
    </div>
  )
}