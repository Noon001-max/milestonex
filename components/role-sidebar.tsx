"use client"

import React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, X } from "lucide-react"
import type { SessionUser } from "@/lib/session"
import { ROLE_LABELS } from "@/lib/roles"

type Item = {
  id: string
  label: string
  href: string
}

type RoleSidebarProps = {
  user: SessionUser
  overrides?: Item[]
  open?: boolean
  onOpen?: () => void
  onClose?: () => void
  hideToggleButton?: boolean
}

export default function RoleSidebar({
  user,
  overrides,
  open,
  onOpen,
  onClose,
  hideToggleButton = false,
}: RoleSidebarProps) {
  const [internalOpen, setInternalOpen] = React.useState(false)
  const isOpen = open ?? internalOpen

  const handleOpen = () => {
    if (onOpen) {
      onOpen()
    } else {
      setInternalOpen(true)
    }
  }

  const handleClose = () => {
    if (onClose) {
      onClose()
    } else {
      setInternalOpen(false)
    }
  }

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
      { id: "approve-projects", label: "Approve projects", href: "/dashboard/admin/projects" },
      { id: "approve-milestones", label: "Approve milestones", href: "/dashboard/admin/milestones" },
      { id: "users", label: "Manage users", href: "/dashboard/admin/users" },
    ],
    auditor: [
      { id: "auditor", label: "Audit dashboard", href: "/dashboard/auditor" },
      { id: "milestones", label: "Release funds", href: "/dashboard/auditor/milestones" },
      { id: "released", label: "Released funds report", href: "/dashboard/auditor/released" },
      { id: "disputes", label: "Disputes", href: "/dashboard/disputes" },
    ],
    suspended: [
      { id: "dashboard", label: "Account status", href: "/dashboard/suspended" },
      { id: "help", label: "Account help", href: "/support" },
    ],
  }

  const pathname = usePathname()
  const items = overrides ?? (baseItems[user.role] ?? [])

  const getItemClassName = (href: string) => {
    const isActive = pathname === href || pathname?.startsWith(`${href}/`)
    return `block px-3 py-2 rounded ${isActive ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:bg-muted"}`
  }

  return (
    <>
      <aside className="hidden md:flex flex-col w-72 h-screen fixed left-0 top-16 p-4 border-r border-sidebar-border bg-popover z-30">
        <h3 className="text-lg font-medium">{ROLE_LABELS[user.role] || user.role}</h3>
        <nav className="mt-4 flex-1 flex flex-col gap-2">
          {items.map((it) => (
            <Link key={it.id} href={it.href} className={getItemClassName(it.href)}>
              {it.label}
            </Link>
          ))}
        </nav>
      </aside>

      {!hideToggleButton && (
        <button
          aria-label="Open menu"
          onClick={handleOpen}
          className="md:hidden inline-flex items-center justify-center rounded-md p-2 text-muted-foreground hover:bg-accent/50"
        >
          <Menu className="size-5" />
        </button>
      )}

      {isOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div className="w-72 max-w-full bg-popover p-4 border-r border-sidebar-border h-screen">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">{ROLE_LABELS[user.role] || user.role}</h3>
              <button onClick={handleClose} className="p-2 rounded-md text-muted-foreground hover:bg-accent/50">
                <X />
              </button>
            </div>

            <nav className="mt-4 flex flex-col gap-2">
              {items.map((it) => (
                <Link
                  key={it.id}
                  href={it.href}
                  className={getItemClassName(it.href)}
                  onClick={handleClose}
                >
                  {it.label}
                </Link>
              ))}
            </nav>
          </div>

          <div className="flex-1" onClick={handleClose} role="button" aria-hidden />
        </div>
      )}
    </>
  )
}
