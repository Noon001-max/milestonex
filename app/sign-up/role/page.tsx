import dynamic from "next/dynamic"

// Render a client-side role selector that will finalize signup when a role is chosen.
const RoleSelectorClient = dynamic(() => import("./RoleSelectorClient"), { ssr: false })

export default function RoleSelectionPage() {
  return (
    <main className="min-h-svh bg-background flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-5xl">
        <RoleSelectorClient />
      </div>
    </main>
  )
}
