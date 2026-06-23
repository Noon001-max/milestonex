"use client"

import { useState } from "react"
import Link from "next/link"
import { authClient } from "@/lib/auth-client"
import { Avatar } from "@/components/ui/avatar"
import type { SessionUser } from "@/lib/session"

export function UserProfileMenu({ user }: { user: SessionUser }) {
  const [open, setOpen] = useState(false)

  const handleLogout = async () => {
    await authClient.signOut()
    window.location.href = "/"
  }

  const initials = user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 rounded-full p-1 hover:bg-muted transition-colors"
        aria-label="User menu"
      >
        <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-semibold">
          {initials}
        </div>
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-48 rounded-lg border border-border bg-background shadow-lg z-50">
          <div className="border-b border-border p-3">
            <p className="font-medium text-foreground text-sm">{user.name}</p>
            <p className="text-xs text-muted-foreground">{user.email}</p>
            <p className="text-xs text-muted-foreground capitalize mt-1">
              Role: {user.role}
            </p>
          </div>

          <div className="p-2">
            <Link
              href="/dashboard/profile"
              className="block w-full text-left px-3 py-2 text-sm text-foreground hover:bg-muted rounded-lg transition-colors"
              onClick={() => setOpen(false)}
            >
              Profile
            </Link>
            <Link
              href="/dashboard/settings"
              className="block w-full text-left px-3 py-2 text-sm text-foreground hover:bg-muted rounded-lg transition-colors"
              onClick={() => setOpen(false)}
            >
              Settings
            </Link>
          </div>

          <div className="border-t border-border p-2">
            <button
              onClick={handleLogout}
              className="block w-full text-left px-3 py-2 text-sm text-destructive hover:bg-muted rounded-lg transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      )}

      {open && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setOpen(false)}
        />
      )}
    </div>
  )
}
