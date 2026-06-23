"use client"

import React from "react"
import Link from "next/link"
import { Menu, X } from "lucide-react"

import type { SessionUser } from "@/lib/session"

export default function QuickActionsMenu({ user }: { user: SessionUser }) {
  const [open, setOpen] = React.useState(false)

  const roleCards = [
    {
      role: "donor",
      label: "Support projects",
      href: "/dashboard/donations",
      desc: "Browse and fund community projects",
    },
    {
      role: "owner",
      label: "My projects",
      href: "/dashboard/projects",
      desc: "Submit and manage your projects",
    },
    {
      role: "verifier",
      label: "Verify milestones",
      href: "/dashboard/verify",
      desc: "Review and verify submitted evidence",
    },
    {
      role: "admin",
      label: "Admin panel",
      href: "/dashboard/admin",
      desc: "Approve projects, manage disputes",
    },
    {
      role: "auditor",
      label: "Auditor view",
      href: "/dashboard/auditor",
      desc: "Review financial and audit reports",
    },
  ]

  const availableLinks = roleCards.filter(
    (c) => c.role === user.role || user.role === "admin",
  )

  return (
    <>
      <button
        aria-label="Open quick actions"
        onClick={() => setOpen(true)}
        className="inline-flex items-center justify-center rounded-md p-2 text-muted-foreground hover:bg-accent/50"
      >
        <Menu className="size-5" />
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex">
          <div className="w-72 max-w-full bg-sidebar p-4 border-r border-sidebar-border">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Quick actions</h3>
              <button
                aria-label="Close quick actions"
                onClick={() => setOpen(false)}
                className="p-2 rounded-md text-muted-foreground hover:bg-accent/50"
              >
                <X />
              </button>
            </div>

            <div className="mt-4 space-y-3">
              {availableLinks.map((c) => (
                <Link
                  key={c.role}
                  href={c.href}
                  className="flex items-start gap-3 rounded-md border border-border p-3 hover:bg-muted"
                  onClick={() => setOpen(false)}
                >
                  <div>
                    <p className="font-medium text-foreground">{c.label}</p>
                    <p className="text-xs text-muted-foreground">{c.desc}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          <div
            className="flex-1"
            onClick={() => setOpen(false)}
            role="button"
            aria-hidden
          />
        </div>
      )}
    </>
  )
}
