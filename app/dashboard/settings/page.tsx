import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { getSession } from "@/lib/session"
import { SiteHeader } from "@/components/site-header"
import { Card } from "@/components/ui/card"

export const dynamic = "force-dynamic"

export default async function SettingsPage() {
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
            to access settings.
          </p>
        </main>
      </div>
    )
  }

  return (
    <div className="flex min-h-svh flex-col bg-background">
      <SiteHeader user={user} hideNavigation={true} />
      <main className="mx-auto w-full max-w-4xl px-4 py-12">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-foreground">
              Account Settings
            </h1>
          </div>
          <a href="/dashboard/profile" className="text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="size-4 inline mr-1" />
            Back to Profile
          </a>
        </div>

        <div className="space-y-6">
          {/* Preferences Section */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-foreground mb-4">Preferences</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <label className="font-medium text-foreground">Email Notifications</label>
                  <p className="text-sm text-muted-foreground">
                    Receive email updates about projects and activities.
                  </p>
                </div>
                <input type="checkbox" defaultChecked className="w-5 h-5" />
              </div>
              <div className="flex items-center justify-between border-t border-border pt-4">
                <div>
                  <label className="font-medium text-foreground">Project Updates</label>
                  <p className="text-sm text-muted-foreground">
                    Get notified when projects you follow have updates.
                  </p>
                </div>
                <input type="checkbox" defaultChecked className="w-5 h-5" />
              </div>
              <div className="flex items-center justify-between border-t border-border pt-4">
                <div>
                  <label className="font-medium text-foreground">Milestone Alerts</label>
                  <p className="text-sm text-muted-foreground">
                    Receive alerts when milestones are completed or rejected.
                  </p>
                </div>
                <input type="checkbox" defaultChecked className="w-5 h-5" />
              </div>
            </div>
          </Card>

          {/* Security Section */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-foreground mb-4">Security</h2>
            <div className="space-y-3">
              <button className="block w-full text-left px-4 py-2 rounded-lg border border-border hover:bg-muted transition-colors">
                Change Password
              </button>
              <button className="block w-full text-left px-4 py-2 rounded-lg border border-border hover:bg-muted transition-colors">
                Two-Factor Authentication
              </button>
              <button className="block w-full text-left px-4 py-2 rounded-lg border border-border hover:bg-muted transition-colors">
                Active Sessions
              </button>
            </div>
          </Card>

          {/* Privacy Section */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-foreground mb-4">Privacy</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <label className="font-medium text-foreground">Public Profile</label>
                  <p className="text-sm text-muted-foreground">
                    Allow others to view your profile.
                  </p>
                </div>
                <input type="checkbox" defaultChecked className="w-5 h-5" />
              </div>
              <div className="flex items-center justify-between border-t border-border pt-4">
                <div>
                  <label className="font-medium text-foreground">Show Activity</label>
                  <p className="text-sm text-muted-foreground">
                    Display your donations and activities publicly.
                  </p>
                </div>
                <input type="checkbox" className="w-5 h-5" />
              </div>
            </div>
          </Card>

          {/* Danger Zone */}
          <Card className="p-6 border-destructive/50 bg-destructive/5">
            <h2 className="text-lg font-semibold text-destructive mb-4">Danger Zone</h2>
            <p className="text-sm text-muted-foreground mb-4">
              Irreversible and destructive actions.
            </p>
            <button className="px-4 py-2 rounded-lg bg-destructive text-destructive-foreground hover:bg-destructive/90 transition-colors text-sm font-medium">
              Delete Account
            </button>
          </Card>
        </div>
      </main>
    </div>
  )
}
