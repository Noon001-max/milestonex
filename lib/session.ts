import { auth } from "@/lib/auth"
import { headers } from "next/headers"

export type Role =
  | "donor"
  | "owner"
  | "verifier"
  | "admin"
  | "auditor"
  | "suspended"

export type SessionUser = {
  id: string
  name: string
  email: string
  emailVerified: boolean
  image: string | null
  role: Role
}

export async function getSession() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) return null
  return {
    id: session.user.id,
    name: session.user.name,
    email: session.user.email,
    emailVerified: (session.user as { emailVerified?: boolean }).emailVerified ?? false,
    image: (session.user as { image?: string | null }).image ?? null,
    role: ((session.user as { role?: string }).role ?? "donor") as Role,
  } satisfies SessionUser
}

export async function requireUser(): Promise<SessionUser> {
  const user = await getSession()
  if (!user) throw new Error("Unauthorized")
  return user
}

export async function requireRole(roles: Role[]): Promise<SessionUser> {
  const user = await requireUser()
  if (!roles.includes(user.role)) {
    throw new Error("Forbidden: insufficient permissions")
  }
  return user
}
