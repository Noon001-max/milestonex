import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"

export async function GET(request: Request) {
  try {
    const session = await auth.api.getSession({ headers: request.headers as any })
    if (!session?.user) return NextResponse.json({ ok: false }, { status: 401 })
    return NextResponse.json({ ok: true, user: session.user })
  } catch (e) {
    return NextResponse.json({ ok: false }, { status: 500 })
  }
}
