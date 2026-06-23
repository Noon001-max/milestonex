import { redirect } from "next/navigation"
import { getSession } from "@/lib/session"

export const dynamic = "force-dynamic"

export default async function AdminDisputesPage() {
  const user = await getSession()
  if (!user) return redirect("/sign-in")
  if (user.role !== "admin") return redirect("/dashboard")

  return redirect("/dashboard/disputes")
}
