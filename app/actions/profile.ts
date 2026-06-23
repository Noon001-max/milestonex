"use server"

import { db } from "@/lib/db"
import { user } from "@/lib/db/schema"
import { requireUser } from "@/lib/session"
import { eq } from "drizzle-orm"
import { revalidatePath } from "next/cache"

// Update the signed-in user's own profile (name + avatar image).
// Scoped strictly to the session user id — a user can never edit another user's row.
export async function updateProfile(formData: FormData) {
  const current = await requireActiveUser()

  const name = (formData.get("name") as string | null)?.trim() ?? ""
  const image = ((formData.get("image") as string | null) ?? "").trim()

  if (!name) {
    throw new Error("Name is required")
  }
  if (name.length > 120) {
    throw new Error("Name is too long")
  }

  await db
    .update(user)
    .set({
      name,
      image: image || null,
      updatedAt: new Date(),
    })
    .where(eq(user.id, current.id))

  revalidatePath("/dashboard/profile")
  revalidatePath("/dashboard/settings")
  revalidatePath("/dashboard")
}
