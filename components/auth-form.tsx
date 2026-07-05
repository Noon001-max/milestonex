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
    if (isSignUp) {
      // Save the collected signup fields locally and navigate to role selection
      try {
        const payload = { name, email, password }
        sessionStorage.setItem("signup_temp", JSON.stringify(payload))
        setLoading(false)
        setSuccess("Continue to role selection to complete account setup")
        if (isSignUp) {
          // Save signup inputs temporarily and continue to role selection
          try {
            const payload = { name: name.trim(), email: email.trim(), password }
            sessionStorage.setItem("signupData", JSON.stringify(payload))
            setLoading(false)
            setSuccess("Proceed to role selection to finish creating your account")
            router.push("/sign-up/role")
            return
          } catch (err) {
            setLoading(false)
            setError("Could not save signup data — please try again")
            return
          }
        } else {
          const result = await authClient.signIn.email({ email, password })
          setLoading(false)
          if (result.error) {
            setError(result.error.message ?? "Something went wrong")
            return
          }
          setSuccess("Signed in — redirecting...")
          router.push("/dashboard")
          router.refresh()
        }
    router.push("/dashboard")
    router.refresh()
  }

  return (
    <main className="min-h-svh bg-background flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            {isSignUp ? "Create your account" : "Welcome back"}
          </h1>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            {isSignUp
              ? "Sign up quickly and continue to role selection."
              : "Sign in with your email and password to continue."}
          </p>
        </div>

        <Card className="rounded-[2rem] border border-border/70 bg-card p-8 shadow-xl sm:p-10">
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
              {loading ? "Please wait..." : isSignUp ? "Continue to role selection" : "Sign in"}
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
        </Card>
      </div>
    </main>
  )
}
