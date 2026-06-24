import Link from "next/link"
import Image from "next/image"
import { Mail, User, Lock, LogOut, Edit, Settings } from "lucide-react"
import { getSession } from "@/lib/session"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
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

  const getRoleBadgeColor = (role: string) => {
    const colors: Record<string, string> = {
      owner: "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300",
      donor: "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300",
      auditor: "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300",
      verifier: "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300",
      admin: "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300",
      suspended: "bg-gray-100 dark:bg-gray-900/30 text-gray-700 dark:text-gray-300",
    }
    return colors[role] || "bg-muted text-muted-foreground"
  }

  return (
    <div className="flex min-h-svh flex-col bg-background">
      <main className="mx-auto w-full max-w-5xl px-4 py-8 sm:py-12">
        {/* Profile Header */}
        <Card className="p-6 sm:p-8 mb-8 bg-gradient-to-br from-primary/5 to-primary/10">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-6">
              {user.image ? (
                <Image
                  src={user.image}
                  alt={`${user.name}'s profile photo`}
                  width={96}
                  height={96}
                  className="h-24 w-24 rounded-full object-cover ring-4 ring-primary/30"
                />
              ) : (
                <div className="flex h-24 w-24 items-center justify-center rounded-full bg-primary text-primary-foreground text-3xl font-bold ring-4 ring-primary/30">
                  {initials}
                </div>
              )}
              <div>
                <h1 className="text-3xl font-bold tracking-tight text-foreground">
                  {user.name}
                </h1>
                <div className="flex items-center gap-2 mt-2 text-muted-foreground">
                  <Mail className="size-4" />
                  <p className="text-sm">{user.email}</p>
                </div>
                <div className="mt-4">
                  <Badge className={`capitalize ${getRoleBadgeColor(user.role)}`}>
                    {ROLE_LABELS[user.role] || user.role}
                  </Badge>
                </div>
              </div>
            </div>

            {user.role !== "suspended" ? (
              <div className="flex flex-col gap-3 sm:items-end w-full sm:w-auto">
                <Link
                  href="/dashboard/profile/edit"
                  className="inline-flex items-center justify-center gap-2 rounded-lg border border-primary/30 bg-primary/5 px-4 py-2 text-sm font-medium text-foreground transition hover:bg-primary/10 hover:border-primary"
                >
                  <Edit className="size-4" />
                  Edit profile
                </Link>
                <Link
                  href="/dashboard/settings"
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition"
                >
                  <Settings className="size-4" />
                  Settings
                </Link>
                <LogoutButton className="w-full sm:w-auto" />
              </div>
            ) : (
              <div className="p-4 rounded-lg bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800">
                <p className="text-sm text-red-700 dark:text-red-300 font-medium">
                  Your account is suspended. Contact support for assistance.
                </p>
              </div>
            )}
          </div>
        </Card>

        {/* Account Information */}
        <div className="grid gap-6 sm:grid-cols-2">
          <Card className="p-6">
            <div className="flex items-start gap-3">
              <div className="rounded-lg bg-blue-100 dark:bg-blue-900/30 p-2">
                <Mail className="size-5 text-blue-700 dark:text-blue-400" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-foreground">Email</h3>
                <p className="text-sm text-muted-foreground mt-1">{user.email}</p>
                <div className="mt-2">
                  {user.emailVerified ? (
                    <Badge className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300">
                      ✓ Verified
                    </Badge>
                  ) : (
                    <Badge className="bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300">
                      ⏳ Pending verification
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-start gap-3">
              <div className="rounded-lg bg-purple-100 dark:bg-purple-900/30 p-2">
                <User className="size-5 text-purple-700 dark:text-purple-400" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-foreground">Account Type</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {ROLE_LABELS[user.role] || "Community Member"}
                </p>
                <div className="mt-2">
                  <Badge className={getRoleBadgeColor(user.role)}>
                    {ROLE_LABELS[user.role] || user.role}
                  </Badge>
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-start gap-3">
              <div className="rounded-lg bg-amber-100 dark:bg-amber-900/30 p-2">
                <Lock className="size-5 text-amber-700 dark:text-amber-400" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-foreground">Security</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Manage password and security settings
                </p>
                <Link
                  href="/dashboard/settings"
                  className="text-sm text-primary hover:underline font-medium mt-2"
                >
                  Go to settings →
                </Link>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-start gap-3">
              <div className="rounded-lg bg-teal-100 dark:bg-teal-900/30 p-2">
                <LogOut className="size-5 text-teal-700 dark:text-teal-400" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-foreground">Session</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Sign out of your account
                </p>
                <LogoutButton className="text-sm mt-2 h-auto px-2 py-1 bg-transparent text-primary hover:bg-primary/10" />
              </div>
            </div>
          </Card>
        </div>
      </main>
    </div>
  )
}

