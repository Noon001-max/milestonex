"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { authClient } from "@/lib/auth-client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"

export function AuthForm({ mode }: { mode: "sign-in" | "sign-up" }) {
  const router = useRouter()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
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
        })
      : await authClient.signIn.email({ email, password })

    setLoading(false)

    if (result.error) {
      setError(result.error.message ?? "Something went wrong")
      return
    }

    setSuccess(isSignUp ? "Account created — continue to role selection..." : "Signed in — redirecting...")
    setTimeout(() => {
      router.push(isSignUp ? "/sign-up/role" : "/dashboard")
      router.refresh()
    }, 700)
  }

  return (
    <main className="min-h-svh bg-background flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-5xl">
        <div className="mb-10 flex flex-col items-center gap-4 text-center">
          <div className="inline-flex items-center justify-center rounded-3xl bg-primary/10 px-4 py-2 text-sm font-semibold uppercase tracking-[0.35em] text-primary shadow-sm shadow-primary/10">
            {isSignUp ? "Join Milestone X" : "Sign in"}
          </div>
          <div className="space-y-3">
            <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              {isSignUp ? "Create an account to launch trusted community projects" : "Sign in to continue."}
            </h1>
            <p className="mx-auto max-w-2xl text-sm text-muted-foreground sm:text-base">
              {isSignUp
                ? "Set up your account quickly and join a transparent funding marketplace with escrow protection and milestone accountability."
                : "Enter your email and password to access your dashboard."}
            </p>
          </div>
        </div>

        <Card className="rounded-[2rem] border border-border/70 bg-card p-8 shadow-xl sm:p-10">
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-semibold text-foreground">{isSignUp ? "Create your account" : "Welcome back"}</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                {isSignUp
                  ? "Sign up quickly and choose your role on the next page."
                  : "Enter your email and password to continue."}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              {isSignUp && (
                <div className="flex flex-col gap-2">
                  <Label htmlFor="name">Full name</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    autoComplete="name"
                    placeholder="Jane Doe"
                  />
                </div>
              )}
              <div className="flex flex-col gap-2">
                <Label htmlFor="email">Email address</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                  placeholder="you@example.com"
                />
              </div>
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between gap-3">
                  <Label htmlFor="password">Password</Label>
                  <span className="text-xs text-muted-foreground">8+ characters</span>
                </div>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={8}
                  autoComplete={isSignUp ? "new-password" : "current-password"}
                  placeholder="Enter a secure password"
                />
              </div>

              {isSignUp && (
                <div className="rounded-[1.75rem] border border-border/70 bg-background/80 p-5 text-sm text-muted-foreground shadow-sm">
                  <p className="font-semibold text-foreground mb-2">Choose your role next.</p>
                  <p>Your role selection will happen after signup, so you can decide later.</p>
                </div>
              )}

              {error && (
                <p className="rounded-2xl border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive" role="alert">
                  {error}
                </p>
              )}

              {success && (
                <p className="rounded-2xl border border-success/20 bg-success/10 px-4 py-3 text-sm text-success" role="status">
                  {success}
                </p>
              )}

              <Button type="submit" disabled={loading} className="w-full rounded-full py-3">
                {loading ? "Please wait..." : isSignUp ? "Create account" : "Sign in"}
              </Button>
            </form>

            <p className="text-sm text-muted-foreground text-center mt-6">
              {isSignUp ? "Already have an account? " : "Don't have an account? "}
              <Link
                href={isSignUp ? "/sign-in" : "/sign-up"}
                className="text-primary font-medium underline-offset-4 hover:underline"
              >
                {isSignUp ? "Sign in" : "Sign up"}
              </Link>
            </p>
          </div>
        </Card>
      </div>
    </main>
  )
}
