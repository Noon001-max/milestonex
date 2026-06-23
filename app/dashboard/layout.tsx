import React from "react"
import { getSession } from "@/lib/session"
import { SiteHeader } from "@/components/site-header"
import RoleSidebar from "@/components/role-sidebar"

export const dynamic = "force-dynamic"

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const user = await getSession()

  return (
    <div className="min-h-svh flex flex-col bg-background">
      <SiteHeader user={user} hideNavigation={true} />

      <div className="flex w-full">
        {user ? <RoleSidebar user={user} /> : null}
        <main className="flex-1 md:pl-72">{children}</main>
      </div>
    </div>
  )
}
