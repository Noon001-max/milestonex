import { getSession } from "@/lib/session"
import { redirect } from "next/navigation"
import { ProfileForm } from "@/components/profile-form"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export const dynamic = "force-dynamic"

export default async function EditProfilePage() {
  const user = await getSession()

  if (!user) {
    redirect("/sign-in")
  }

  if (user.role === "suspended") {
    redirect("/dashboard/profile")
  }

  return (
    <div className="flex min-h-svh flex-col bg-background">
      <main className="mx-auto w-full max-w-2xl px-4 py-12">
        <div className="mb-8">
          <Link
            href="/dashboard/profile"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-muted-foreground hover:text-foreground transition-colors mb-4"
          >
            <ArrowLeft className="size-3.5" />
            <span>Back to profile</span>
          </Link>
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
            Edit Profile
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Update your public name and profile photo. Email controls are managed in your security configurations.
          </p>
        </div>

        <ProfileForm
          defaultName={user.name}
          defaultImage={user.image}
          email={user.email}
        />
      </main>
    </div>
  )
}
