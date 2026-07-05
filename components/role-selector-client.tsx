"use client"

import React, { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ROLES } from "@/lib/roles"
import { Card } from "@/components/ui/card"
import { ShieldCheck, Users, Briefcase, CheckCircle2, Banknote } from "lucide-react"
import { authClient } from "@/lib/auth-client"

export default function RoleSelectorClient() {
  const router = useRouter()
  const [signupData, setSignupData] = useState<{ name: string; email: string; password: string } | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loadingRole, setLoadingRole] = useState<string | null>(null)

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem("signupData")
      if (raw) setSignupData(JSON.parse(raw))
    } catch (err) {
      // ignore
    }
  }, [])

  async function handleSelect(role: string) {
    setError(null)
    if (!signupData) {
      setError("Please complete the account basics first.")
      // visually indicate error for a short time
      return
    }

    setLoadingRole(role)
    try {
      const res = await authClient.signUp.email({
        email: signupData.email,
        password: signupData.password,
        name: signupData.name,
      })
      if (res.error) {
        setError(res.error.message || "Failed to create account")
        setLoadingRole(null)
        return
      }

      // after signing up, navigate to server-side role setter which requires an authenticated session
      router.push(`/sign-up/role/${role}`)
      router.refresh()
    } catch (err) {
      setError((err as Error)?.message || "An unexpected error occurred")
      setLoadingRole(null)
    }
  }

  return (
    <main className="min-h-svh bg-background flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-5xl">
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center rounded-3xl bg-primary/10 px-4 py-2 text-sm font-semibold uppercase tracking-[0.35em] text-primary shadow-sm shadow-primary/10">
            Role selection
          </div>
          <h1 className="mt-6 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">Finish account setup</h1>
          <p className="mx-auto mt-4 max-w-2xl text-sm text-muted-foreground sm:text-base">
            Choose the role that best matches your goals. If you haven't entered your account details yet, you'll see an error below.
          </p>
        </div>

        {error && (
          <div className="rounded-2xl border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive mb-4">
            {error}
          </div>
        )}

        <div className="grid gap-6 rounded-[2rem] border border-border/70 bg-card p-6 shadow-xl sm:p-8">
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

              const busy = loadingRole && loadingRole !== role.value

              return (
                <button
                  key={role.value}
                  onClick={() => handleSelect(role.value)}
                  disabled={!!loadingRole}
                  className={`group flex items-start gap-4 rounded-3xl border px-5 py-5 transition-all duration-200 text-left ${
                    !signupData ? "hover:translate-y-0" : "hover:border-primary/50 hover:bg-primary/5"
                  } ${busy ? "opacity-60" : ""}`}
                >
                  <span className="grid h-12 w-12 place-items-center rounded-2xl bg-primary/10 text-primary">
                    <Icon className="size-5" />
                  </span>
                  <div>
                    <p className="text-base font-semibold text-foreground">{role.label}</p>
                    <p className="mt-2 text-sm text-muted-foreground">{role.description}</p>
                  </div>
                </button>
              )
            })}
          </div>

          <div className="rounded-[1.75rem] border border-border/70 bg-primary/5 p-4 text-sm text-muted-foreground">
            <p className="font-semibold text-foreground">Tip</p>
            <p className="mt-2">Complete the account basics first — name, email and password — then select a role to finish account creation.</p>
          </div>
        </div>
      </div>
    </main>
  )
}
