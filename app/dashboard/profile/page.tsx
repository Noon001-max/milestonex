import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { getSession } from "@/lib/session"
import { SiteHeader } from "@/components/site-header"
import { Card } from "@/components/ui/card"
import { ROLE_LABELS } from "@/lib/roles"

export const dynamic = "force-dynamic"

export default async function ProfilePage() {
  const user = await getSession()

  if (!user) {
    return (
      <div className="flex min-h-svh flex-col bg-background">
        <SiteHeader user={null} hideNavigation={true} />
        <main className="mx-auto w-full max-w-4xl px-4 py-12">
          <p className="text-muted-foreground">
            <Link href="/sign-in" className="text-primary hover:underline">
              Sign in
            </Link>{" "}
            to view your profile.
          </p>
        </main>
      </div>
    )
  }

  const initials = user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()

  return (
    <div className="flex min-h-svh flex-col bg-background">
      <SiteHeader user={user} hideNavigation={true} />
      <main className="mx-auto w-full max-w-4xl px-4 py-12">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-foreground">
              My Profile
            </h1>
          </div>
          <a href="/dashboard" className="text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="size-4 inline mr-1" />
            Dashboard
          </a>
        </div>

        <Card className="p-6 mb-6">
          <div className="flex items-start gap-6">
            <div className="w-20 h-20 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-2xl font-bold">
              {initials}
            </div>
            <div>
              <h2 className="text-2xl font-semibold text-foreground">{user.name}</h2>
              <p className="text-muted-foreground mt-1">{user.email}</p>
              <div className="mt-3 flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Role:</span>
                <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium capitalize">
                  {ROLE_LABELS[user.role] || user.role}
                </span>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Account Information</h3>
          <div className="grid gap-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Name</label>
              <p className="text-foreground mt-1">{user.name}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Email</label>
              <p className="text-foreground mt-1">{user.email}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">User ID</label>
              <p className="text-foreground text-xs font-mono mt-1">{user.id}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Email Verified</label>
              <p className="text-foreground mt-1">
                {user.emailVerified ? (
                  <span className="text-green-600 font-medium">✓ Verified</span>
                ) : (
                  <span className="text-yellow-600 font-medium">Pending verification</span>
                )}
              </p>
            </div>
          </div>
        </Card>

        <div className="mt-6">
          <Link
            href="/dashboard/settings"
            className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            Edit Settings
          </Link>
        </div>
      </main>
    </div>
  )
}
