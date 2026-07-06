import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { milestones, projects } from "@/lib/db/schema"
import { requireRole } from "@/lib/session"
import { eq } from "drizzle-orm"

export async function POST(req: Request) {
  const u = await requireRole(["owner"])
  const url = new URL(req.url)
  const parts = url.pathname.split("/")
  const projectId = Number(parts[3])
  if (Number.isNaN(projectId)) return NextResponse.json({ error: "Invalid id" }, { status: 400 })

  const body = await req.json()
  const items = Array.isArray(body.milestones) ? body.milestones : []

  const rows = await db.select().from(projects).where(eq(projects.id, projectId))
  const p = rows[0]
  if (!p) return NextResponse.json({ error: "Project not found" }, { status: 404 })
  if (p.ownerId !== u.id) return NextResponse.json({ error: "Forbidden" }, { status: 403 })

  // Delete existing milestones for project and insert new ones
  await db.delete(milestones).where(eq(milestones.projectId, projectId))

  const toInsert = items.map((m: any, idx: number) => ({
    projectId,
    title: m.title || "",
    description: m.description || "",
    amount: Number(m.amount) || 0,
    orderIndex: idx,
    status: "pending",
  }))

  if (toInsert.length > 0) {
    await db.insert(milestones).values(toInsert)
  }

  return NextResponse.json({ ok: true })
}
