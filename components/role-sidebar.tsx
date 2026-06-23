"use client"

import React from "react"
import Link from "next/link"
import { Menu, X } from "lucide-react"
import type { SessionUser } from "@/lib/session"
import { ROLE_LABELS } from "@/lib/roles"

type Item = {
  id: string
  label: string
  href: string
}

export default function RoleSidebar({ user, overrides }: { user: SessionUser; overrides?: Item[] }) {
  const [open, setOpen] = React.useState(false)

  const baseItems: Record<string, Item[]> = {
    donor: [
      { id: "explore", label: "Explore projects", href: "/projects" },
      { id: "donations", label: "My donations", href: "/dashboard/donations" },
    ],
    owner: [
      { id: "my-projects", label: "My projects", href: "/dashboard/projects" },
      { id: "new-project", label: "Create project", href: "/dashboard/projects/new" },
    ],
    verifier: [
      { id: "queue", label: "Verification queue", href: "/dashboard/verify" },
      { id: "completed", label: "Completed verifications", href: "/dashboard/verify/completed" },
    ],
    admin: [
      { id: "overview", label: "Overview", href: "/dashboard/admin" },
      { id: "approve", label: "Approve projects", href: "/dashboard/admin/projects" },
      { id: "users", label: "Manage users", href: "/dashboard/admin/users" },
      { id: "disputes", label: "Disputes", href: "/dashboard/admin/disputes" },
    ],
    auditor: [
      { id: "auditor", label: "Audit dashboard", href: "/dashboard/auditor" },
    ],
    suspended: [
      { id: "help", label: "Account help", href: "/support" },
    ],
  }

  const items = overrides ?? (baseItems[user.role] ?? [])

  return (
    <>
      {/* Sidebar for md+ */}
      <aside className="hidden md:flex flex-col w-72 h-screen fixed left-0 top-16 p-4 border-r border-sidebar-border bg-popover z-30">
        <h3 className="text-lg font-medium">{ROLE_LABELS[user.role] || user.role}</h3>
        <nav className="mt-4 flex-1 flex flex-col gap-2">
          {items.map((it) => (
            <Link key={it.id} href={it.href} className="block px-3 py-2 rounded hover:bg-muted">
              {it.label}
            </Link>
          ))}
        </nav>
      </aside>

      {/* Mobile drawer */}
      <button
        aria-label="Open menu"
        onClick={() => setOpen(true)}
        className="md:hidden inline-flex items-center justify-center rounded-md p-2 text-muted-foreground hover:bg-accent/50"
      >
        <Menu className="size-5" />
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex">
          <div className="w-72 max-w-full bg-popover p-4 border-r border-sidebar-border h-screen">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">{ROLE_LABELS[user.role] || user.role}</h3>
              <button onClick={() => setOpen(false)} className="p-2 rounded-md text-muted-foreground hover:bg-accent/50">
                <X />
              </button>
            </div>

            <nav className="mt-4 flex flex-col gap-2">
              {items.map((it) => (
                <Link key={it.id} href={it.href} className="block px-3 py-2 rounded hover:bg-muted" onClick={() => setOpen(false)}>
                  {it.label}
                </Link>
              ))}
            </nav>
          </div>

          <div className="flex-1" onClick={() => setOpen(false)} role="button" aria-hidden />
        </div>
      )}
    </>
  )
}
