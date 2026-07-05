import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { user as userTable } from "@/lib/db/schema"
import { ROLES } from "@/lib/roles"
import { eq } from "drizzle-orm"

const ALLOWED = ROLES.filter((r) => r.value !== "suspended").map((r) => r.value)

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const role = body?.role
    if (!role || !ALLOWED.includes(role)) return NextResponse.json({ ok: false, error: "invalid_role" }, { status: 400 })

    const session = await auth.api.getSession({ headers: request.headers as any })
    if (!session?.user) return NextResponse.json({ ok: false, error: "unauthenticated" }, { status: 401 })

    await db
      .update(userTable)
      .set({ role, updatedAt: new Date() })
      .where(eq(userTable.id, session.user.id))

    return NextResponse.json({ ok: true })
  } catch (e) {
    return NextResponse.json({ ok: false, error: "server_error" }, { status: 500 })
  }
}
