import { NextResponse } from "next/server"
import { requireUser } from "@/lib/session"
import { db } from "@/lib/db"
import { notifications } from "@/lib/db/schema"
import { sql } from "drizzle-orm"

export async function GET() {
  try {
    const user = await requireUser()

    const res = await db.select({ count: sql<number>`count(*)::int` }).from(notifications).where(sql`${notifications.userId} = ${user.id} AND ${notifications.read} = false`)
    const unread = (res[0]?.count as number) ?? 0
    return NextResponse.json({ unread })
  } catch (err) {
    return NextResponse.json({ unread: 0 })
  }
}
