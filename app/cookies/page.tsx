import { Card } from "@/components/ui/card"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { getSession } from "@/lib/session"

export const dynamic = "force-dynamic"

export default async function CookiesPage() {
  const user = await getSession()

  const sections = [
    {
      title: "What cookies are",
      body: "Cookies are small text files stored in your browser that help the site remember your preferences, session state, and usage patterns.",
    },
    {
      title: "Cookies we use",
      body: "We may use essential cookies for login and session handling, preference cookies for theme and interface settings, and analytics cookies to understand how the platform is used.",
    },
    {
      title: "Why we use them",
      body: "Cookies help keep you signed in, improve performance, remember your choices, and make it easier to use the platform across visits.",
    },
    {
      title: "Managing cookies",
      body: "You can clear or block cookies from your browser settings. Some features may not work properly if essential cookies are disabled.",
    },
    {
      title: "Updates",
      body: "We may update this policy if the cookies or tracking tools we use change. Check this page periodically for the latest information.",
    },
  ]

  return (
    <div className="flex min-h-svh flex-col bg-background">
      <SiteHeader user={user} />

      <main className="mx-auto w-full max-w-4xl px-4 py-12 sm:py-16 lg:py-20">
        <div className="mb-8 space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">Cookies</p>
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">Cookie Policy</h1>
          <p className="max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base">
            This page explains how Milestone X uses cookies and similar technologies to keep the service working well.
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
            <h2 className="text-lg font-semibold text-foreground">Questions</h2>
            <p className="mt-3 text-sm leading-7 text-muted-foreground">
              If you need help understanding cookie settings, contact support@example.com and we can point you to the right browser controls.
            </p>
          </Card>
        </div>
      </main>

      <SiteFooter isLoggedIn={!!user} />
    </div>
  )
}