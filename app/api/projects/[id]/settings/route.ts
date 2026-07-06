import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { projects } from "@/lib/db/schema"
import { requireRole } from "@/lib/session"
import { eq } from "drizzle-orm"

export async function POST(req: Request) {
  const u = await requireRole(["owner"])
  const url = new URL(req.url)
  const parts = url.pathname.split("/")
  const projectId = Number(parts[3])
  if (Number.isNaN(projectId)) return NextResponse.json({ error: "Invalid id" }, { status: 400 })

  const body = await req.json()
  const title = (body.title || "").trim()
  const description = (body.description || "").trim()
  if (!title) return NextResponse.json({ error: "Title required" }, { status: 400 })

  // Ensure owner owns the project
  const rows = await db.select().from(projects).where(eq(projects.id, projectId))
  const p = rows[0]
  if (!p) return NextResponse.json({ error: "Project not found" }, { status: 404 })
  if (p.ownerId !== u.id) return NextResponse.json({ error: "Forbidden" }, { status: 403 })

  await db.update(projects).set({ title, description }).where(eq(projects.id, projectId))
  return NextResponse.json({ ok: true })
}
