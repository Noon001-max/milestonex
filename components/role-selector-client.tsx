"use client"

import React, { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ROLES } from "@/lib/roles"
import { Card } from "@/components/ui/card"
import { ShieldCheck, Users, Briefcase, CheckCircle2, Banknote, ChevronLeft, XCircle, Loader2 } from "lucide-react"
import { authClient } from "@/lib/auth-client"

export default function RoleSelectorClient() {
  const router = useRouter()
  const [signupData, setSignupData] = useState<{ name: string; email: string; password: string } | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loadingRole, setLoadingRole] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

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
      console.debug("role-select: attempting signUp for", signupData.email)
      const res = await authClient.signUp.email({
        email: signupData.email,
        password: signupData.password,
        name: signupData.name,
      })
      console.debug("role-select: signUp result", res)
      if (res.error) {
        setError(res.error.message || "Failed to create account")
        setLoadingRole(null)
        return
      }

      // Ensure session exists by signing in (guarantees server can read the session)
      try {
        const signin = await authClient.signIn.email({ email: signupData.email, password: signupData.password })
        console.debug("role-select: signIn result", signin)
        if (signin.error) {
          setError(signin.error.message || "Failed to sign in after signup")
          setLoadingRole(null)
          return
        }

        // Poll server session endpoint to ensure cookie is visible server-side (Vercel may delay)
        const maxTries = 6
        let tries = 0
        let serverSession = false
        while (tries < maxTries) {
          // small delay between polls
          // eslint-disable-next-line no-await-in-loop
          await new Promise((r) => setTimeout(r, 400))
          // eslint-disable-next-line no-await-in-loop
          try {
            const resp = await fetch(`/api/session`, { credentials: "include" })
            if (resp.ok) {
              const json = await resp.json()
              if (json?.ok) {
                serverSession = true
                break
              }
            }
          } catch (e) {
            // ignore and retry
          }
          tries += 1
        }

        if (!serverSession) {
          setError("Could not establish authenticated session with server. Try again or use a different browser.")
          setLoadingRole(null)
          return
        }
      } catch (e) {
        console.debug("role-select: sign-in error", e)
      }

      // Clear temporary signup data and show success briefly
      try {
        sessionStorage.removeItem("signupData")
        sessionStorage.removeItem("signup_temp")
      } catch (e) {
        // ignore
      }
      setSuccess("Account created — finalizing role selection...")
      // Give a short moment for the user to see success, then navigate.
      // Use a full-page navigation to ensure auth cookies are sent to the server (Vercel environment).
      setTimeout(() => {
        setLoadingRole(null)
        try {
          window.location.href = `/sign-up/role/${role}`
        } catch (e) {
          // fallback to router if window is not available
          router.push(`/sign-up/role/${role}`)
          router.refresh()
        }
      }, 700)
    } catch (err) {
      setError((err as Error)?.message || "An unexpected error occurred")
      setLoadingRole(null)
    }
  }

  return (
    <>
      <main className="min-h-svh bg-background flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-5xl">
          <div className="mb-6 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Link href="/sign-up" className="inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium hover:bg-muted">
                <ChevronLeft className="size-4" />
                Back to signup
              </Link>
              <div className="ml-3 inline-flex items-center justify-center rounded-3xl bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.35em] text-primary shadow-sm shadow-primary/10">
                Role selection
              </div>
            </div>
            <div className="text-right">
              <h1 className="text-xl font-semibold tracking-tight text-foreground">Finish account setup</h1>
              <p className="text-sm text-muted-foreground">Choose the role that best matches your goals and permissions.</p>
            </div>
          </div>

          {error && (
            <div className="mb-4 rounded-lg border border-destructive/30 bg-destructive/6 px-4 py-3 text-sm text-destructive flex items-start gap-3">
              <XCircle className="size-5 mt-0.5 text-destructive" />
              <div className="font-medium">{error}</div>
            </div>
          )}

          {success && (
            <div className="mb-4 rounded-lg border border-success/20 bg-success/10 px-4 py-3 text-sm text-success">
              {success}
            </div>
          )}

          <div className="grid gap-6 rounded-[1.5rem] border border-border/70 bg-card p-6 shadow-xl sm:p-8">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
                  className={`group flex flex-col items-start gap-3 rounded-2xl border px-5 py-6 transition-all duration-200 text-left shadow-sm hover:shadow-md ${
                    !signupData ? "opacity-80" : "hover:border-primary/50 hover:bg-primary/5"
                  } ${busy ? "opacity-60" : ""}`}
                >
                  <div className="flex items-center gap-3">
                    <span className="grid h-12 w-12 place-items-center rounded-2xl bg-primary/10 text-primary">
                      <Icon className="size-5" />
                    </span>
                    <div>
                      <p className="text-base font-semibold text-foreground">{role.label}</p>
                      <p className="mt-1 text-sm text-muted-foreground">{role.description}</p>
                    </div>
                  </div>
                  <div className="mt-3 text-sm text-muted-foreground">Select this role to finalize your account and access the related dashboard.</div>
                </button>
              )
            })}
          </div>
            <div className="rounded-md border border-border/60 bg-muted p-4 text-sm text-muted-foreground">
              Need to change your name, email, or password? Use the Back to signup link above to update your account basics.
            </div>
          </div>
        </div>
      </main>

      {loadingRole && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/60">
          <div className="rounded-lg bg-card p-6 flex flex-col items-center gap-3">
            <div className="animate-spin">
              <Loader2 className="size-6" />
            </div>
            <p className="text-sm font-medium text-foreground">Applying role, please wait...</p>
          </div>
        </div>
      )}
    </>
  )
}
