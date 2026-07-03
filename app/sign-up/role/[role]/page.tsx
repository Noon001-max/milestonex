import { redirect } from "next/navigation"
import { getSession } from "@/lib/session"
import { db } from "@/lib/db"
import { user as userTable } from "@/lib/db/schema"
import { ROLES } from "@/lib/roles"
import { eq } from "drizzle-orm"

type RoleParam = {
  params: {
    role: string
  }
}

const ALLOWED_ROLES = ROLES.filter((r) => r.value !== "suspended").map((r) => r.value)

export default async function RoleSelectionHandler({ params }: RoleParam) {
  const { role } = params
  const currentUser = await getSession()

  if (!currentUser) {
    redirect("/sign-in")
  }

  if (!ALLOWED_ROLES.includes(role)) {
    redirect("/sign-up/role")
  }

  await db
    .update(userTable)
    .set({ role, updatedAt: new Date() })
    .where(eq(userTable.id, currentUser.id))

  redirect("/dashboard")
}
