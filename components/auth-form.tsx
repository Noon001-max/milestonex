"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { authClient } from "@/lib/auth-client"
import { ROLES } from "@/lib/roles"
import type { Role } from "@/lib/session"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { ShieldCheck, Users, Briefcase, CheckCircle2, Banknote } from "lucide-react"

export function AuthForm({ mode }: { mode: "sign-in" | "sign-up" }) {
  const router = useRouter()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [role, setRole] = useState<Role>("donor")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [success, setSuccess] = useState<string | null>(null)

  const isSignUp = mode === "sign-up"

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    // Basic inline validation for sign-up
    if (isSignUp) {
      if (!name || name.trim().length < 2) {
        setLoading(false)
        setError("Please enter your full name")
        return
      }
      if (!email.includes("@")) {
        setLoading(false)
        setError("Enter a valid email address")
        return
      }
      if (!password || password.length < 8) {
        setLoading(false)
        setError("Password must be at least 8 characters")
        return
      }
    }

    const result = isSignUp
      ? await authClient.signUp.email({
          email,
          password,
          name,
          // @ts-expect-error role is a registered additional field
          role,
        })
      : await authClient.signIn.email({ email, password })

    setLoading(false)

    if (result.error) {
      setError(result.error.message ?? "Something went wrong")
      return
    }

    setSuccess(isSignUp ? "Account created — redirecting..." : "Signed in — redirecting...")
    setTimeout(() => {
      router.push("/dashboard")
      router.refresh()
    }, 700)
  }

  return (
    <main className="min-h-svh bg-background flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        <Link
          href="/"
          className="mb-6 flex items-center justify-center gap-3 text-foreground"
        >
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-secondary text-xl font-bold text-primary-foreground">
            MX
          </span>
          <span className="text-lg font-semibold tracking-tight">
            Milestone X
          </span>
        </Link>

        <Card className="p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">
              {isSignUp ? "Create your account" : "Welcome back"}
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              {isSignUp
                ? "Join the transparent funding platform"
                : "Sign in to your account to continue"}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {isSignUp && (
              <div className="flex flex-col gap-2">
                <Label htmlFor="name">Full name</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  autoComplete="name"
                />
              </div>
            )}
            <div className="flex flex-col gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
                autoComplete={isSignUp ? "new-password" : "current-password"}
              />
            </div>

            {isSignUp && (
              <fieldset className="flex flex-col gap-2">
                <legend className="text-sm font-medium text-foreground mb-2">
                  Account type
                </legend>
                <p className="text-xs text-muted-foreground mb-2">
                  Choose the role that best matches how you'll use the platform.
                </p>

                <div className="flex items-center gap-3 mb-2">
                  <label className="text-sm text-muted-foreground">Advanced options</label>
                  <button
                    type="button"
                    onClick={() => setShowAdvanced((s) => !s)}
                    className="text-sm text-primary underline-offset-4 hover:underline"
                  >
                    {showAdvanced ? "Hide" : "Show"}
                  </button>
                </div>

                {showAdvanced ? (
                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                    {ROLES.filter((r) => r.value !== "suspended").map((r) => {
                      const Icon =
                        r.value === "donor"
                          ? Users
                          : r.value === "owner"
                          ? Briefcase
                          : r.value === "verifier"
                          ? CheckCircle2
                          : r.value === "admin"
                          ? ShieldCheck
                          : Banknote
                      const selected = role === r.value
                      return (
                        <button
                          key={r.value}
                          type="button"
                          onClick={() => {
                            setRole(r.value)
                            setShowAdvanced(false)
                          }}
                          aria-pressed={selected}
                          className={`group relative flex items-start gap-3 rounded-2xl border p-4 text-left transition-all text-sm shadow-sm ${
                            selected
                              ? "border-primary bg-primary/10 shadow-primary/20"
                              : "border-border bg-background hover:border-primary hover:bg-muted"
                          }`}
                        >
                          <span className={`grid h-10 w-10 place-items-center rounded-2xl transition-colors ${selected ? "bg-primary text-primary-foreground" : "bg-primary/10 text-primary"}`}>
                            <Icon className="size-5" />
                          </span>
                          <span className="flex-1">
                            <span className="block text-sm font-semibold text-foreground">
                              {r.label}
                            </span>
                            <span className="block text-xs text-muted-foreground">
                              {r.description}
                            </span>
                          </span>
                          {selected ? (
                            <span className="absolute right-3 top-3 inline-flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground">
                              ✓
                            </span>
                          ) : null}
                        </button>
                      )
                    })}
                  </div>
                ) : (
                  <div className="rounded-md border border-border bg-muted p-3 text-sm text-muted-foreground">
                    Default role: <strong className="text-foreground">Donor / Investor</strong>
                  </div>
                )}
              </fieldset>
            )}

            {error && (
              <p className="text-sm text-destructive" role="alert">
                {error}
              </p>
            )}

            {success && (
              <p className="text-sm text-success" role="status">
                {success}
              </p>
            )}

            <Button type="submit" disabled={loading} className="w-full">
              {loading
                ? "Please wait..."
                : isSignUp
                  ? "Create account"
                  : "Sign in"}
            </Button>
          </form>

          <p className="text-sm text-muted-foreground text-center mt-6">
            {isSignUp ? "Already have an account? " : "Don't have an account? "}
            <Link
              href={isSignUp ? "/sign-in" : "/sign-up"}
              className="text-foreground font-medium underline-offset-4 hover:underline"
            >
              {isSignUp ? "Sign in" : "Sign up"}
            </Link>
          </p>
        </Card>
      </div>
    </main>
  )
}
