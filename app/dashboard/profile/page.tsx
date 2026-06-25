import Link from "next/link"
import Image from "next/image"
import { Mail, User, Shield, Edit, Settings, ArrowRight, CheckCircle2, AlertTriangle, Key, Calendar } from "lucide-react"
import { getSession } from "@/lib/session"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ROLE_LABELS } from "@/lib/roles"
import { LogoutButton } from "@/components/logout-button"
import { db } from "@/lib/db"
import { user as userTable } from "@/lib/db/schema"
import { eq } from "drizzle-orm"

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
    ? user.name
        .split(/\s+/)
        .map((n) => n[0] || "")
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "MX"

  const dbUser = await db
    .select({ createdAt: userTable.createdAt })
    .from(userTable)
    .where(eq(userTable.id, user.id))
    .then((res) => res[0])

  const memberSince = dbUser?.createdAt
    ? new Date(dbUser.createdAt).toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      })
    : "June 2026"

  const getRoleBadgeColor = (role: string) => {
    const colors: Record<string, string> = {
      owner: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/25",
      donor: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/25",
      auditor: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/25",
      verifier: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/25",
      admin: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/25",
      suspended: "bg-slate-500/10 text-slate-600 dark:text-slate-400 border border-slate-500/25",
    }
    return colors[role] || "bg-muted text-muted-foreground"
  }

  const getRoleDescription = (role: string) => {
    const descriptions: Record<string, string> = {
      donor: "Allows you to explore live community proposals, fund accountability milestones, and track escrow payments.",
      owner: "Allows you to submit project proposals, structure funding milestones, upload progress evidence, and request auditor releases.",
      verifier: "Allows you to inspect submitted milestone evidence, evaluate deliverables, and approve project stages.",
      admin: "Allows you to audit project proposals, moderate member privileges, unlock launch stages, and oversee disputes.",
      auditor: "Allows you to review financial releases, inspect transactional transparency, and resolve active milestone disputes.",
    }
    return descriptions[role] || "Standard member access on the Milestone X escrow network."
  }

  return (
    <div className="flex min-h-svh flex-col bg-background">
      <main className="mx-auto w-full max-w-5xl px-4 py-8 sm:py-12">
        
        {/* Profile Card Header */}
        <Card className="p-6 sm:p-8 mb-8 border border-border/80 bg-card shadow-sm">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-col items-center text-center sm:flex-row sm:text-left sm:items-center gap-5">
              {user.image ? (
                <div className="relative h-24 w-24 overflow-hidden rounded-full ring-4 ring-primary/20">
                  <Image
                    src={user.image}
                    alt={`${user.name}'s profile photo`}
                    fill
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="flex h-24 w-24 items-center justify-center rounded-full bg-primary/10 border border-primary/20 text-primary text-3xl font-extrabold ring-4 ring-primary/10">
                  {initials}
                </div>
              )}
              
              <div className="space-y-1">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                  <h1 className="text-2xl font-black text-foreground sm:text-3xl tracking-tight">
                    {user.name}
                  </h1>
                  <Badge className={`capitalize font-bold text-[10px] w-fit mx-auto sm:mx-0 ${getRoleBadgeColor(user.role)}`} variant="outline">
                    {ROLE_LABELS[user.role] || user.role}
                  </Badge>
                </div>
                
                <div className="flex items-center justify-center sm:justify-start gap-1.5 text-xs text-muted-foreground font-semibold">
                  <Mail className="size-3.5 text-muted-foreground" />
                  <span>{user.email}</span>
                  {user.emailVerified && (
                    <span className="inline-flex items-center text-emerald-500 bg-emerald-500/10 px-1.5 py-0.5 rounded-full text-[9px] font-bold">
                      Verified
                    </span>
                  )}
                </div>
              </div>
            </div>

            {user.role !== "suspended" ? (
              <div className="flex flex-col gap-2.5 w-full sm:w-auto">
                <Link
                  href="/dashboard/profile/edit"
                  className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-border bg-card px-5 py-2.5 text-xs font-bold hover:bg-secondary hover:scale-[1.01] active:scale-98 transition duration-200 shadow-sm"
                >
                  <Edit className="size-4" />
                  <span>Edit profile</span>
                </Link>
                <Link
                  href="/dashboard/settings"
                  className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-primary px-5 py-2.5 text-xs font-bold text-primary-foreground hover:bg-primary/95 hover:scale-[1.01] active:scale-98 transition duration-200 shadow-md shadow-primary/10"
                >
                  <Settings className="size-4" />
                  <span>Settings</span>
                </Link>
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/20 max-w-sm">
                <div className="flex items-start gap-2.5">
                  <AlertTriangle className="size-5 text-destructive flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs text-destructive font-black uppercase tracking-wider">Account Suspended</p>
                    <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                      Your permissions are suspended. Please contact platform administration to appeal.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </Card>

        {/* Details and Operations Columns */}
        {user.role !== "suspended" && (
          <div className="grid gap-6 md:grid-cols-2">
            
            {/* Account Role Card */}
            <Card className="p-6 border border-border/80 bg-card shadow-sm flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center gap-2.5 text-foreground pb-2 border-b border-border/60">
                  <User className="size-4.5 text-primary" />
                  <h3 className="font-bold text-sm">Account Overview</h3>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-2.5 p-3 border border-border/50 bg-secondary/20 rounded-xl">
                    <Calendar className="size-4 text-primary" />
                    <div>
                      <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">Member Since</span>
                      <span className="text-xs font-bold text-foreground mt-0.5 block">
                        {memberSince}
                      </span>
                    </div>
                  </div>

                  <div className="pt-2">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">Role Capabilities</span>
                    <p className="text-xs text-muted-foreground mt-1 leading-relaxed font-medium">
                      {getRoleDescription(user.role)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="border-t border-border/60 pt-4.5 mt-6 flex justify-end">
                <LogoutButton className="inline-flex items-center justify-center rounded-xl border border-destructive/20 bg-destructive/5 text-destructive px-5 py-2.5 text-xs font-bold hover:bg-destructive/10 hover:border-destructive/30 transition-all duration-200" />
              </div>
            </Card>

            {/* Quick Preferences Shortcut Card */}
            <Card className="p-6 border border-border/80 bg-card shadow-sm space-y-4">
              <div className="flex items-center gap-2.5 text-foreground pb-2 border-b border-border/60">
                <Shield className="size-4.5 text-primary" />
                <h3 className="font-bold text-sm">Security & Settings</h3>
              </div>

              <div className="space-y-4">
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Verify or toggle preferences, notification thresholds, credentials, and authentication layers.
                </p>

                <div className="space-y-2 pt-2">
                  <Link href="/dashboard/settings" className="group flex items-center justify-between p-3 border border-border/60 bg-secondary/15 rounded-xl hover:border-primary/20 hover:bg-secondary/40 transition duration-200">
                    <div className="flex items-center gap-3">
                      <Key className="size-4 text-muted-foreground group-hover:text-primary transition-colors" />
                      <div>
                        <p className="text-xs font-bold text-foreground">Password & 2FA</p>
                        <p className="text-[10px] text-muted-foreground mt-0.5">Manage key access settings</p>
                      </div>
                    </div>
                    <ArrowRight className="size-4 text-muted-foreground group-hover:translate-x-0.5 group-hover:text-primary transition-all" />
                  </Link>

                  <Link href="/dashboard/settings" className="group flex items-center justify-between p-3 border border-border/60 bg-secondary/15 rounded-xl hover:border-primary/20 hover:bg-secondary/40 transition duration-200">
                    <div className="flex items-center gap-3">
                      <Settings className="size-4 text-muted-foreground group-hover:text-primary transition-colors" />
                      <div>
                        <p className="text-xs font-bold text-foreground">Notification Filters</p>
                        <p className="text-[10px] text-muted-foreground mt-0.5">Tweak alerts for milestones & escrow</p>
                      </div>
                    </div>
                    <ArrowRight className="size-4 text-muted-foreground group-hover:translate-x-0.5 group-hover:text-primary transition-all" />
                  </Link>
                </div>
              </div>
            </Card>
            
          </div>
        )}

      </main>
    </div>
  )
}
