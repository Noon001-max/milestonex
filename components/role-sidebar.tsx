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
      { id: "explore", label: "Explore projects", href: "/dashboard/explore", icon: Compass },
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
      { id: "users", label: "Manage users", href: "/dashboard/admin/users", icon: Users },
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
      return `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
        isActive
          ? "bg-destructive/10 text-destructive"
          : "text-destructive/70 hover:bg-destructive/5 hover:text-destructive"
      }`
    }

    return `group/item relative flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
      isActive
        ? "bg-primary/10 text-primary"
        : "text-muted-foreground hover:bg-muted hover:text-foreground"
    }`
  }

  const getActiveIndicator = (href: string) => {
    const isActive = pathname === href || pathname?.startsWith(`${href}/`)
    if (!isActive || user.role === "suspended") return null
    return (
      <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-full bg-primary animate-scale-in" />
    )
  }

  const initials = user.name
    ? user.name
        .split(/\s+/)
        .map((n) => n[0] || "")
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "MX"

  const sidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Role Label */}
      <div className="px-4 py-3 border-b border-border">
        <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
          {ROLE_LABELS[user.role] || user.role}
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 mt-4 flex flex-col gap-1 px-2">
        {items.map((it) => {
          const Icon = it.icon
          return (
            <Link
              key={it.id}
              href={it.href}
              className={getItemClassName(it.href)}
            >
              {getActiveIndicator(it.href)}
              <Icon className="size-[18px] flex-shrink-0 transition-transform duration-200 group-hover/item:scale-110" />
              <span>{it.label}</span>
            </Link>
          )
        })}
      </nav>

      {/* Bottom Profile and Signout Section */}
      <div className="mt-auto border-t border-border pt-4 pb-3 px-2 space-y-3">
        <div className="flex items-center gap-3 px-2 py-2">
          <div className="size-8 rounded-lg bg-muted text-foreground flex items-center justify-center font-bold text-xs border border-border">
            {initials}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-foreground truncate leading-tight">{user.name}</p>
            <p className="text-xs text-muted-foreground truncate capitalize mt-0.5">{user.role}</p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-destructive/80 hover:text-destructive hover:bg-destructive/8 transition-colors duration-200"
        >
          <LogOut className="size-[18px]" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  )

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden md:flex flex-col w-72 h-[calc(100vh-4rem)] fixed left-0 top-16 p-3 border-r border-border bg-background z-30">
        {sidebarContent()}
      </aside>

      {!hideToggleButton && (
        <button
          aria-label="Open menu"
          onClick={handleOpen}
          className="md:hidden inline-flex items-center justify-center rounded-lg p-2 text-muted-foreground hover:bg-muted transition-colors"
        >
          <Menu className="size-5" />
        </button>
      )}

      {/* Mobile drawer with smooth animation */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/20 animate-fade-in"
            onClick={handleClose}
          />
          
          {/* Sidebar panel */}
          <div className="relative w-72 max-w-[85vw] bg-background p-3 border-r border-border h-screen flex flex-col z-10 animate-slide-in-right shadow-lg">
            <div className="flex items-center justify-between pb-3 border-b border-border px-2">
              <h3 className="text-sm font-semibold text-foreground">Menu</h3>
              <button
                onClick={handleClose}
                className="p-2 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors duration-200"
              >
                <X className="size-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto mt-4">
              {sidebarContent()}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
