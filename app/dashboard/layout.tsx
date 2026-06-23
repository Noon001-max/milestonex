import React from "react"
import { getSession } from "@/lib/session"
import { SiteHeader } from "@/components/site-header"

export const dynamic = "force-dynamic"

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const user = await getSession()

  return (
    <div className="min-h-svh flex flex-col bg-background">
      <SiteHeader user={user} hideNavigation={true} />

      <div className="flex w-full">
        {/* Page-level layouts should render their own sidebars (admin/verify/etc.) */}
        <main className="flex-1">{children}</main>
      </div>
    </div>
  )
}
