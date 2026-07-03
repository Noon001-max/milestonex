import Link from "next/link"
import { redirect } from "next/navigation"
import { getSession } from "@/lib/session"
import { ROLES } from "@/lib/roles"
import { Card } from "@/components/ui/card"
import { ShieldCheck, Users, Briefcase, CheckCircle2, Banknote } from "lucide-react"

export default async function RoleSelectionPage() {
  const user = await getSession()
  if (!user) redirect("/sign-in")

  return (
    <main className="min-h-svh bg-background flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-5xl">
        <div className="mb-10 text-center">
          <div className="inline-flex items-center justify-center rounded-3xl bg-primary/10 px-4 py-2 text-sm font-semibold uppercase tracking-[0.35em] text-primary shadow-sm shadow-primary/10">
            Role selection
          </div>
          <h1 className="mt-6 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Create account
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-sm text-muted-foreground sm:text-base">
            Select the role that best matches your goals to finish creating your account.
          </p>
        </div>

        <Card className="grid gap-6 rounded-[2rem] border border-border/70 bg-card p-8 shadow-xl sm:p-10">
          <div className="grid gap-4 sm:grid-cols-2">
            {ROLES.filter((r) => r.value !== "suspended").map((role) => {
              const Icon =
                role.value === "donor"
                  ? Users
                  : role.value === "owner"
                  ? Briefcase
                  : role.value === "verifier"
                  ? CheckCircle2
                  : role.value === "admin"
                  ? ShieldCheck
                  : Banknote

              return (
                <Link
                  key={role.value}
                  href={`/sign-up/role/${role.value}`}
                  className="group flex items-start gap-4 rounded-3xl border border-border bg-background p-5 transition-all duration-200 hover:border-primary/50 hover:bg-primary/5"
                >
                  <span className="grid h-12 w-12 place-items-center rounded-2xl bg-primary/10 text-primary">
                    <Icon className="size-5" />
                  </span>
                  <div>
                    <p className="text-base font-semibold text-foreground">{role.label}</p>
                    <p className="mt-2 text-sm text-muted-foreground">{role.description}</p>
                  </div>
                </Link>
              )
            })}
          </div>
          <div className="rounded-[1.75rem] border border-border/70 bg-primary/5 p-6 text-sm text-muted-foreground">
            <p className="font-semibold text-foreground">Tip</p>
            <p className="mt-2">Choose the role that best fits your current goals to complete account setup.</p>
          </div>
        </Card>
      </div>
    </main>
  )
}
