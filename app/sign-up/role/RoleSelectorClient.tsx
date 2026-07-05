"use client"

import React, { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { authClient } from "@/lib/auth-client"
import { ROLES } from "@/lib/roles"
import { Card } from "@/components/ui/card"
import { ShieldCheck, Users, Briefcase, CheckCircle2, Banknote } from "lucide-react"

export default function RoleSelectorClient() {
  const router = useRouter()
  const [temp, setTemp] = useState<{ name: string; email: string; password: string } | null>(null)
  const [loadingRole, setLoadingRole] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem("signup_temp")
      if (raw) setTemp(JSON.parse(raw))
    } catch (e) {
      // ignore
    }
  }, [])

  const handleRole = async (role: string) => {
    setError(null)
    if (!temp) return setError("No signup data found. Please start from the sign up form.")
    setLoadingRole(role)
    try {
      const res = await authClient.signUp.email({
        email: temp.email,
        password: temp.password,
        name: temp.name,
      })

      if (res.error) {
        setError(res.error.message || "Failed to create account")
        setLoadingRole(null)
        return
      }

      // cleanup and redirect to the server role handler which finalizes the role
      sessionStorage.removeItem("signup_temp")
      router.push(`/sign-up/role/${role}`)
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err))
      setLoadingRole(null)
    }
  }

  if (!temp) {
    return (
      <div className="text-center">
        <h2 className="text-2xl font-semibold text-foreground">Select a role to finish sign up</h2>
        <p className="mt-2 text-sm text-muted-foreground">Start from the sign up form first.</p>
        <div className="mt-6">
          <Link href="/sign-up" className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">Start sign up</Link>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-8 text-center">
        <div className="inline-flex items-center justify-center rounded-3xl bg-primary/10 px-4 py-2 text-sm font-semibold uppercase tracking-[0.35em] text-primary shadow-sm shadow-primary/10">
          Role selection
        </div>
        <h1 className="mt-6 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">Create account</h1>
        <p className="mx-auto mt-4 max-w-2xl text-sm text-muted-foreground sm:text-base">Select the role that best matches your goals to finish creating your account.</p>
      </div>

      <Card className="grid gap-6 rounded-[2rem] border border-border/70 bg-card p-8 shadow-xl sm:p-10">
        <div className="grid gap-4 sm:grid-cols-2">
          {ROLES.filter((r) => r.value !== "suspended").map((role) => {
            const Icon = role.value === "donor" ? Users : role.value === "owner" ? Briefcase : role.value === "verifier" ? CheckCircle2 : role.value === "admin" ? ShieldCheck : Banknote
            return (
              <button
                key={role.value}
                onClick={() => handleRole(role.value)}
                disabled={!!loadingRole}
                className={`group text-left flex items-start gap-4 rounded-3xl border border-border bg-background p-5 transition-all duration-200 hover:border-primary/50 hover:bg-primary/5 ${loadingRole ? "opacity-70 cursor-not-allowed" : ""}`}
              >
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-primary/10 text-primary"><Icon className="size-5" /></span>
                <div>
                  <p className="text-base font-semibold text-foreground">{role.label}</p>
                  <p className="mt-2 text-sm text-muted-foreground">{role.description}</p>
                </div>
                <div className="ml-auto flex items-center">
                  {loadingRole === role.value ? <span className="text-sm text-muted-foreground">Creating account...</span> : null}
                </div>
              </button>
            )
          })}
        </div>

        <div className="rounded-[1.75rem] border border-border/70 bg-primary/5 p-6 text-sm text-muted-foreground">
          <p className="font-semibold text-foreground">Tip</p>
          <p className="mt-2">Choose the role that best fits your current goals to complete account setup.</p>
        </div>

        {error ? <p className="text-sm text-destructive mt-2">{error}</p> : null}
      </Card>
    </div>
  )
}
