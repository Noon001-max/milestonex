import { Card } from "@/components/ui/card"
import Link from "next/link"

export const dynamic = "force-dynamic"

export default function SupportPage() {
  return (
    <div className="flex min-h-svh flex-col bg-background">
      <main className="mx-auto w-full max-w-4xl px-4 py-16">
        <div className="mb-8">
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">Support</h1>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            If you need help with your account or a suspended status, please reach out to our support team.
          </p>
        </div>

        <Card className="p-6 space-y-6">
          <div>
            <h2 className="text-xl font-semibold text-foreground">Contact options</h2>
            <p className="mt-3 text-sm leading-7 text-muted-foreground">
              Send an email to support@example.com with your account details and issue. Our team will review your request and reply as soon as possible.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-foreground">Need faster help?</h2>
            <p className="mt-3 text-sm leading-7 text-muted-foreground">
              You can also open a support ticket through our help portal if available.
            </p>
            <Link
              href="mailto:support@example.com"
              className="inline-flex items-center justify-center rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
            >
              Email support
            </Link>
          </div>

          <div className="rounded-lg border border-border bg-muted p-4">
            <p className="text-sm text-muted-foreground">
              If your account was suspended, include your user name, email address, and the reason you believe the suspension is incorrect.
            </p>
          </div>
        </Card>
      </main>
    </div>
  )
}
