import { redirect } from "next/navigation"
import { getSession } from "@/lib/session"

export const dynamic = "force-dynamic"

export default async function OwnerLayout({ children }: { children: React.ReactNode }) {
  const user = await getSession()
  if (!user) return redirect("/sign-in")
  if (user.role !== "owner") return redirect("/dashboard")

  return <>{children}</>
}
