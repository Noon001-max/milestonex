"use client"

import React, { useState } from "react"
import type { SessionUser } from "@/lib/session"
import { SiteHeader } from "@/components/site-header"
import RoleSidebar from "@/components/role-sidebar"

export default function DashboardShell({
  user,
  children,
}: {
  user: SessionUser
  children: React.ReactNode
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-svh flex flex-col bg-background">
      <SiteHeader
        user={user}
        hideNavigation={true}
        showMenuButton={true}
        onMenuClick={() => setSidebarOpen(true)}
      />

      <div className="flex w-full">
        <RoleSidebar
          user={user}
          open={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          hideToggleButton={true}
        />

        <main className="flex-1 md:pl-72">{children}</main>
      </div>
    </div>
  )
}
