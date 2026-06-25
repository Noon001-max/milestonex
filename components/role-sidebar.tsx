"use client"

import React from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import {
  Compass,
  Heart,
  FolderOpen,
  PlusCircle,
  ClipboardList,
  CheckCircle2,
  LayoutDashboard,
  FileCheck,
  PlayCircle,
  CheckSquare,
  Users,
  Briefcase,
  Banknote,
  FileSpreadsheet,
  AlertTriangle,
  ShieldAlert,
  LogOut,
  Menu,
  X
} from "lucide-react"
import type { SessionUser } from "@/lib/session"
import { ROLE_LABELS } from "@/lib/roles"
import { signOut } from "@/lib/auth-client"

type Item = {
  id: string
  label: string
  href: string
  icon: React.ComponentType<{ className?: string }>
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
  const router = useRouter()
  const [internalOpen, setInternalOpen] = React.useState(false)
  const isOpen = open ?? internalOpen

  const handleOpen = () => {
    if (onOpen) onOpen()
    else setInternalOpen(true)
  }

  const handleClose = () => {
    if (onClose) onClose()
    else setInternalOpen(false)
  }

  const handleLogout = async () => {
    await signOut()
    router.push("/sign-in")
    router.refresh()
  }

  const baseItems: Record<string, Item[]> = {
    donor: [
      { id: "explore", label: "Explore projects", href: "/projects", icon: Compass },
      { id: "donations", label: "My donations", href: "/dashboard/donations", icon: Heart },
    ],
    owner: [
      { id: "my-projects", label: "My projects", href: "/dashboard/projects", icon: FolderOpen },
      { id: "new-project", label: "Create project", href: "/dashboard/projects/new", icon: PlusCircle },
    ],
    verifier: [
      { id: "queue", label: "Verification queue", href: "/dashboard/verify", icon: ClipboardList },
      { id: "completed", label: "Completed verifications", href: "/dashboard/verify/completed", icon: CheckCircle2 },
    ],
    admin: [
      { id: "overview", label: "Overview", href: "/dashboard/admin", icon: LayoutDashboard },
      { id: "approve-projects", label: "Approve projects", href: "/dashboard/admin/projects", icon: FileCheck },
      { id: "ready-to-start", label: "Ready to start", href: "/dashboard/admin/ready-to-start", icon: PlayCircle },
      { id: "approve-milestones", label: "Approve milestones", href: "/dashboard/admin/milestones", icon: CheckSquare },
      { id: "users", label: "Manage users", href: "/dashboard/manage-users", icon: Users },
    ],
    auditor: [
      { id: "auditor", label: "Audit dashboard", href: "/dashboard/auditor", icon: Briefcase },
      { id: "release-funds", label: "Release funds", href: "/dashboard/release-funds", icon: Banknote },
      { id: "released-report", label: "Released funds report", href: "/dashboard/released-funds-report", icon: FileSpreadsheet },
      { id: "disputes", label: "Disputes", href: "/dashboard/disputes", icon: AlertTriangle },
    ],
    suspended: [
      { id: "dashboard", label: "Account status", href: "/dashboard/suspended", icon: ShieldAlert },
    ],
  }

  const pathname = usePathname()
  const items = overrides ?? (baseItems[user.role] ?? [])

  const getItemClassName = (href: string) => {
    const isActive = pathname === href || pathname?.startsWith(`${href}/`)
    if (user.role === "suspended") {
      return `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
        isActive
          ? "bg-destructive/10 text-destructive border-l-2 border-destructive shadow-sm"
          : "text-destructive hover:bg-destructive/5"
      }`
    }

    return `flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
      isActive
        ? "bg-primary/10 text-primary border-l-2 border-primary shadow-sm"
        : "text-muted-foreground hover:bg-secondary/60 hover:text-foreground"
    }`
  }

  const initials = user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()

  const sidebarContent = () => (
    <div className="flex flex-col h-full">
      <div className="px-2 py-3 border-b border-border/60">
        <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-muted-foreground px-2">
          {ROLE_LABELS[user.role] || user.role} Dashboard
        </span>
      </div>

      <nav className="flex-1 mt-4 flex flex-col gap-1.5 px-1">
        {items.map((it) => {
          const Icon = it.icon
          return (
            <Link key={it.id} href={it.href} className={getItemClassName(it.href)}>
              <Icon className="size-4.5" />
              <span>{it.label}</span>
            </Link>
          )
        })}
      </nav>

      {/* Bottom Profile and Signout Section */}
      <div className="mt-auto border-t border-border/80 pt-4 pb-2 px-1 space-y-3">
        <div className="flex items-center gap-3 px-3 py-1">
          <div className="size-9 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm">
            {initials}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-bold text-foreground truncate leading-none">{user.name}</p>
            <p className="text-xs text-muted-foreground truncate capitalize mt-1">{user.role}</p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-bold text-destructive hover:bg-destructive/10 transition-all duration-200"
        >
          <LogOut className="size-4.5" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  )

  return (
    <>
      <aside className="hidden md:flex flex-col w-72 h-[calc(100vh-4rem)] fixed left-0 top-16 p-4 border-r border-border bg-card z-30">
        {sidebarContent()}
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
          {/* Backdrop */}
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={handleClose} />
          
          <div className="relative w-72 max-w-full bg-card p-4 border-r border-border h-screen flex flex-col z-10">
            <div className="flex items-center justify-between pb-4 border-b border-border/60">
              <h3 className="text-base font-bold tracking-tight text-foreground">Navigation</h3>
              <button onClick={handleClose} className="p-2 rounded-lg text-muted-foreground hover:bg-accent/50">
                <X className="size-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto mt-2">
              {sidebarContent()}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
