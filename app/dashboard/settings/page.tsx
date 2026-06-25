import Link from "next/link"
import { ArrowLeft, Bell, Shield, Eye, AlertTriangle, Key, Smartphone, Monitor } from "lucide-react"
import { getSession } from "@/lib/session"
import { Card } from "@/components/ui/card"

export const dynamic = "force-dynamic"

export default async function SettingsPage() {
  const user = await getSession()

  if (!user) {
    return (
      <div className="flex min-h-svh flex-col bg-background">
        <main className="mx-auto w-full max-w-4xl px-4 py-12">
          <p className="text-muted-foreground">
            <Link href="/sign-in" className="text-primary hover:underline">
              Sign in
            </Link>{" "}
            to access settings.
          </p>
        </main>
      </div>
    )
  }

  if (user.role === "suspended") {
    return (
      <div className="flex min-h-svh flex-col bg-background">
        <main className="mx-auto w-full max-w-4xl px-4 py-12">
          <p className="text-muted-foreground">
            Your account is suspended. You can view your profile and notifications, but account settings are disabled. Please contact support for help.
          </p>
        </main>
      </div>
    )
  }

  return (
    <div className="flex min-h-svh flex-col bg-background">
      <main className="mx-auto w-full max-w-3xl px-4 py-12">
        
        {/* Settings Header */}
        <div className="mb-8">
          <Link
            href="/dashboard/profile"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-muted-foreground hover:text-foreground transition-colors mb-4"
          >
            <ArrowLeft className="size-3.5" />
            <span>Back to profile</span>
          </Link>
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
            Account Settings
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Configure system alerts, security layers, and privacy permissions.
          </p>
        </div>

        <div className="space-y-6">
          
          {/* Preferences Section */}
          <Card className="p-6 border border-border/80 bg-card shadow-sm space-y-5">
            <div className="flex items-center gap-2 text-foreground pb-2 border-b border-border/60">
              <Bell className="size-4.5 text-primary" />
              <h2 className="text-sm font-bold">Preferences & Notifications</h2>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-0.5">
                  <label className="text-xs font-bold text-foreground">Email Notifications</label>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Receive email updates about projects and platform announcements.
                  </p>
                </div>
                <input type="checkbox" defaultChecked className="w-4.5 h-4.5 rounded border-border bg-secondary text-primary focus:ring-primary focus:ring-offset-background" />
              </div>
              
              <div className="flex items-start justify-between gap-4 border-t border-border/60 pt-4">
                <div className="space-y-0.5">
                  <label className="text-xs font-bold text-foreground">Project Milestone Alerts</label>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Get notified when projects you follow submit milestone evidence.
                  </p>
                </div>
                <input type="checkbox" defaultChecked className="w-4.5 h-4.5 rounded border-border bg-secondary text-primary focus:ring-primary focus:ring-offset-background" />
              </div>
              
              <div className="flex items-start justify-between gap-4 border-t border-border/60 pt-4">
                <div className="space-y-0.5">
                  <label className="text-xs font-bold text-foreground">Escrow Payout Alerts</label>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Receive updates when funds are unlocked or active disputes are raised.
                  </p>
                </div>
                <input type="checkbox" defaultChecked className="w-4.5 h-4.5 rounded border-border bg-secondary text-primary focus:ring-primary focus:ring-offset-background" />
              </div>
            </div>
          </Card>

          {/* Security Section */}
          <Card className="p-6 border border-border/80 bg-card shadow-sm space-y-5">
            <div className="flex items-center gap-2 text-foreground pb-2 border-b border-border/60">
              <Shield className="size-4.5 text-primary" />
              <h2 className="text-sm font-bold">Security Credentials</h2>
            </div>

            <div className="grid gap-3 sm:grid-cols-3 text-xs">
              <button className="flex flex-col items-center justify-center gap-2 p-4 border border-border/60 bg-secondary/15 rounded-xl hover:border-primary/25 hover:bg-secondary/40 transition duration-200 text-center font-bold text-foreground group">
                <Key className="size-5 text-muted-foreground group-hover:text-primary transition-colors" />
                <span>Change Password</span>
              </button>
              
              <button className="flex flex-col items-center justify-center gap-2 p-4 border border-border/60 bg-secondary/15 rounded-xl hover:border-primary/25 hover:bg-secondary/40 transition duration-200 text-center font-bold text-foreground group">
                <Smartphone className="size-5 text-muted-foreground group-hover:text-primary transition-colors" />
                <span>Two-Factor Auth</span>
              </button>
              
              <button className="flex flex-col items-center justify-center gap-2 p-4 border border-border/60 bg-secondary/15 rounded-xl hover:border-primary/25 hover:bg-secondary/40 transition duration-200 text-center font-bold text-foreground group">
                <Monitor className="size-5 text-muted-foreground group-hover:text-primary transition-colors" />
                <span>Active Sessions</span>
              </button>
            </div>
          </Card>

          {/* Privacy Section */}
          <Card className="p-6 border border-border/80 bg-card shadow-sm space-y-5">
            <div className="flex items-center gap-2 text-foreground pb-2 border-b border-border/60">
              <Eye className="size-4.5 text-primary" />
              <h2 className="text-sm font-bold">Privacy Visibility</h2>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-0.5">
                  <label className="text-xs font-bold text-foreground">Anonymous Contributions</label>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Hide your name on the public donors board of projects you support.
                  </p>
                </div>
                <input type="checkbox" className="w-4.5 h-4.5 rounded border-border bg-secondary text-primary focus:ring-primary focus:ring-offset-background" />
              </div>
              
              <div className="flex items-start justify-between gap-4 border-t border-border/60 pt-4">
                <div className="space-y-0.5">
                  <label className="text-xs font-bold text-foreground">Public Activity Log</label>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Display proposed or funded milestones under your profile timeline.
                  </p>
                </div>
                <input type="checkbox" defaultChecked className="w-4.5 h-4.5 rounded border-border bg-secondary text-primary focus:ring-primary focus:ring-offset-background" />
              </div>
            </div>
          </Card>

          {/* Danger Zone */}
          <Card className="p-6 border border-destructive/20 bg-destructive/5 space-y-5">
            <div className="flex items-center gap-2 text-destructive pb-2 border-b border-destructive/15">
              <AlertTriangle className="size-4.5 text-destructive" />
              <h2 className="text-sm font-black uppercase tracking-wider">Danger Zone</h2>
            </div>
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
              <div className="space-y-0.5">
                <p className="font-bold text-foreground">Deactivate Account</p>
                <p className="text-muted-foreground leading-relaxed">
                  Temporarily disable your profile, project associations, and notifications.
                </p>
              </div>
              <button className="flex-shrink-0 rounded-xl bg-destructive text-destructive-foreground px-5 py-2.5 font-bold hover:bg-destructive/90 hover:scale-[1.01] active:scale-98 transition duration-200 shadow-sm shadow-destructive/10">
                Deactivate account
              </button>
            </div>
          </Card>
          
        </div>
      </main>
    </div>
  )
}
