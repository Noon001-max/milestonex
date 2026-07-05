"use client"

import RoleSelectorClient from "@/components/role-selector-client"
export default function RoleSelectionPage() {
  return (
    <main className="min-h-svh bg-background flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-5xl">
        <RoleSelectorClient />
      </div>
    </main>
  )
}
"use client"

import RoleSelectorClient from "./RoleSelectorClient"

export default function RoleSelectionPage() {
  return (
    <main className="min-h-svh bg-background flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-5xl">
        <RoleSelectorClient />
      </div>
    </main>
  )
}
