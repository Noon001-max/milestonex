"use client"

import React, { useState } from "react"
import type { SessionUser } from "@/lib/session"
import { SiteHeader } from "@/components/site-header"
import RoleSidebar from "@/components/role-sidebar"

export default function DashboardShell({
  user,
  children,
  unreadCount = 0,
}: {
  user: SessionUser
  children: React.ReactNode
  unreadCount?: number
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-svh flex flex-col bg-background">
      <SiteHeader
        user={user}
        unreadCount={unreadCount}
        hideNavigation={true}
        showMenuButton={true}
        onMenuClick={() => setSidebarOpen(true)}
      />

      <div className="flex w-full min-w-0 overflow-x-clip">
        <RoleSidebar
          user={user}
          open={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          hideToggleButton={true}
        />

        <main className="min-w-0 flex-1 md:pl-72">
          <div className="border-b border-border" />
          
          <div className="animate-fade-in">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
