import Link from "next/link"
import { getSession } from "@/lib/session"
import { redirect } from "next/navigation"
import { ProfileForm } from "@/components/profile-form"
import { Card } from "@/components/ui/card"

export const dynamic = "force-dynamic"

export default async function EditProfilePage() {
  const user = await getSession()

  if (!user) {
    redirect("/sign-in")
  }

  return (
    <div className="flex min-h-svh flex-col bg-background">
      <main className="mx-auto w-full max-w-3xl px-4 py-12">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground">
              Profile
            </p>
            <h1 className="text-3xl font-semibold tracking-tight text-foreground">
              Edit profile
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Update your name and avatar. Email changes are managed through account settings.
            </p>
          </div>
          <Link
            href="/dashboard/profile"
            className="inline-flex items-center justify-center rounded-lg border border-border bg-background px-4 py-2 text-sm font-medium text-foreground hover:border-primary hover:text-primary"
          >
            Back to profile
          </Link>
        </div>

        <Card className="p-0">
          <ProfileForm
            defaultName={user.name}
            defaultImage={user.image}
            email={user.email}
          />
        </Card>
      </main>
    </div>
  )
}
