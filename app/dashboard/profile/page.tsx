import Link from "next/link"
import Image from "next/image"
import { getSession } from "@/lib/session"
import { Card } from "@/components/ui/card"
import { ROLE_LABELS } from "@/lib/roles"
import { LogoutButton } from "@/components/logout-button"

export const dynamic = "force-dynamic"

export default async function ProfilePage() {
  const user = await getSession()

  if (!user) {
    return (
      <div className="flex min-h-svh flex-col bg-background">
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
      <main className="mx-auto w-full max-w-3xl px-4 py-12">
        <Card className="p-6 mb-6">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-6">
              {user.image ? (
                <Image
                  src={user.image}
                  alt={`${user.name}'s profile photo`}
                  width={96}
                  height={96}
                  className="h-24 w-24 rounded-full object-cover"
                />
              ) : (
                <div className="flex h-24 w-24 items-center justify-center rounded-full bg-primary text-primary-foreground text-3xl font-bold">
                  {initials}
                </div>
              )}
              <div>
                <p className="text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground">
                  Profile
                </p>
                <h1 className="text-3xl font-semibold tracking-tight text-foreground">
                  My Profile
                </h1>
                <p className="mt-1 text-muted-foreground">{user.email}</p>
                <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary capitalize">
                  <span>Role:</span>
                  <span>{ROLE_LABELS[user.role] || user.role}</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3 sm:items-end">
              <Link
                href="/dashboard/profile/edit"
                className="inline-flex items-center justify-center rounded-lg border border-border bg-background px-4 py-2 text-sm font-medium text-foreground transition hover:border-primary hover:text-primary"
              >
                Edit profile
              </Link>
              <Link
                href="/dashboard/settings"
                className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
              >
                Account Settings
              </Link>
              <LogoutButton className="w-full sm:w-auto" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Account Information</h3>
          <div className="grid gap-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Email Verified</label>
              <p className="text-foreground mt-1">
                {user.emailVerified ? (
                  <span className="text-green-600 font-medium">Verified</span>
                ) : (
                  <span className="text-yellow-600 font-medium">Pending verification</span>
                )}
              </p>
            </div>
          </div>
        </Card>
      </main>
    </div>
  )
}
