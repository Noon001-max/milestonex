import { put } from "@vercel/blob"
import { type NextRequest, NextResponse } from "next/server"
import { requireUser } from "@/lib/session"

export async function POST(request: NextRequest) {
  try {
    // Only authenticated users can upload
    await requireUser()

    const formData = await request.formData()
    const file = formData.get("file") as File | null

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    if (!file.type.startsWith("image/")) {
      return NextResponse.json(
        { error: "Only image files are allowed" },
        { status: 400 },
      )
    }

    // 8MB limit
    if (file.size > 8 * 1024 * 1024) {
      return NextResponse.json(
        { error: "Image must be smaller than 8MB" },
        { status: 400 },
      )
    }

    const blob = await put(`projects/${Date.now()}-${file.name}`, file, {
      access: "public",
      addRandomSuffix: true,
    })

    return NextResponse.json({ url: blob.url })
  } catch (error) {
    console.error("[v0] Upload error:", error)
    return NextResponse.json({ error: "Upload failed" }, { status: 500 })
  }
}
