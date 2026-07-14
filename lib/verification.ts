import { db, pool } from "@/lib/db"
import { milestones, user, verificationAssignments, verifications } from "@/lib/db/schema"
import { and, eq, sql } from "drizzle-orm"

function getRequiredConsensus(amount: number) {
  if (amount >= 50000) return 2
  if (amount >= 20000) return 2
  return 1
}

async function hasTable(tableName: string) {
  const result = await pool.query("select to_regclass($1) as table_name", [`public.${tableName}`])
  return Boolean(result.rows[0]?.table_name)
}

async function hasColumns(tableName: string, columnNames: string[]) {
  const placeholders = columnNames.map((_, index) => `$${index + 2}`).join(", ")
  const result = await pool.query(
    `select column_name from information_schema.columns where table_schema = 'public' and table_name = $1 and column_name in (${placeholders})`,
    [tableName, ...columnNames],
  )
  const found = new Set(result.rows.map((row) => row.column_name))
  return columnNames.every((columnName) => found.has(columnName))
}

export function calculateDistanceMeters(
  latitude1: number,
  longitude1: number,
  latitude2: number,
  longitude2: number,
) {
  const toRadians = (value: number) => (value * Math.PI) / 180
  const earthRadiusMeters = 6371000
  const dLat = toRadians(latitude2 - latitude1)
  const dLon = toRadians(longitude2 - longitude1)
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRadians(latitude1)) * Math.cos(toRadians(latitude2)) * Math.sin(dLon / 2) ** 2
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return Math.round(earthRadiusMeters * c)
}

export function evaluateVerificationLocation(
  projectLatitude: number | null,
  projectLongitude: number | null,
  verifierLatitude: number | null,
  verifierLongitude: number | null,
) {
  if (
    projectLatitude == null || projectLongitude == null || verifierLatitude == null || verifierLongitude == null
  ) {
    return { distanceMeters: null, locationMatch: false }
  }

  const distanceMeters = calculateDistanceMeters(projectLatitude, projectLongitude, verifierLatitude, verifierLongitude)
  return { distanceMeters, locationMatch: distanceMeters <= 50 }
}

export async function getProjectLocation(projectId: number) {
  if (!(await hasTable("projects"))) {
    return { latitude: null, longitude: null, available: false }
  }

  if (!(await hasColumns("projects", ["latitude", "longitude"]))) {
    return { latitude: null, longitude: null, available: false }
  }

  const result = await pool.query("select latitude, longitude from projects where id = $1", [projectId])
  const row = result.rows[0] ?? {}
  return {
    latitude: typeof row.latitude === "number" ? row.latitude : null,
    longitude: typeof row.longitude === "number" ? row.longitude : null,
    available: true,
  }
}

export async function insertVerificationRecord(input: {
  milestoneId: number
  projectId: number
  verifierId: string
  verifierName: string | null
  decision: "approve" | "reject"
  report: string
  verifierLatitude?: number | null
  verifierLongitude?: number | null
  locationDistanceMeters?: number | null
  locationMatch?: boolean
}) {
  const hasGeoColumns = await hasColumns("verifications", ["verifierLatitude", "verifierLongitude", "locationDistanceMeters", "locationMatch"])
  const latitude = Number.isFinite(input.verifierLatitude ?? NaN) ? input.verifierLatitude : null
  const longitude = Number.isFinite(input.verifierLongitude ?? NaN) ? input.verifierLongitude : null
  const distance = Number.isFinite(input.locationDistanceMeters ?? NaN) ? input.locationDistanceMeters : null
  const match = input.locationMatch ?? false

  if (hasGeoColumns) {
    await pool.query(
      `insert into verifications (milestoneId, projectId, verifierId, verifierName, decision, report, verifierLatitude, verifierLongitude, locationDistanceMeters, locationMatch, createdAt)
       values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, now())`,
      [input.milestoneId, input.projectId, input.verifierId, input.verifierName, input.decision, input.report, latitude, longitude, distance, match],
    )
  } else {
    await pool.query(
      `insert into verifications (milestoneId, projectId, verifierId, verifierName, decision, report, createdAt)
       values ($1, $2, $3, $4, $5, $6, now())`,
      [input.milestoneId, input.projectId, input.verifierId, input.verifierName, input.decision, input.report],
    )
  }
}

export async function assignVerifiersForMilestone(milestoneId: number, projectId: number, amount: number) {
  if (!(await hasTable("verification_assignments"))) {
    return []
  }

  const requiredConsensus = getRequiredConsensus(amount)
  const verifierCandidates = await db
    .select({
      id: user.id,
      name: user.name,
      reputation: user.verifierReputationScore,
      isBanned: user.verifierIsBanned,
    })
    .from(user)
    .where(and(eq(user.role, "verifier"), sql`${user.verifierIsBanned} = false`))

  if (verifierCandidates.length === 0) {
    return []
  }

  const ranked = [...verifierCandidates].sort((a, b) => b.reputation - a.reputation)
  const selectedCount = Math.max(1, Math.min(amount >= 50000 ? 3 : amount >= 20000 ? 2 : 1, ranked.length))
  const selected = ranked.slice(0, selectedCount)

  await db.delete(verificationAssignments).where(eq(verificationAssignments.milestoneId, milestoneId))

  await db.insert(verificationAssignments).values(
    selected.map((verifier) => ({
      milestoneId,
      projectId,
      assignedVerifierId: verifier.id,
      assignedVerifierName: verifier.name,
      requiredConsensus,
      status: "assigned",
    })),
  )

  await db
    .update(milestones)
    .set({ status: "submitted", updatedAt: new Date() })
    .where(eq(milestones.id, milestoneId))

  return selected
}

export async function recordVerificationSubmission(
  milestoneId: number,
  verifierId: string,
  verifierName: string | null,
  decision: "approve" | "reject",
  report: string,
) {
  if (!(await hasTable("verification_assignments"))) {
    await db
      .update(milestones)
      .set({ status: "verifying", updatedAt: new Date() })
      .where(eq(milestones.id, milestoneId))
    return { updated: true, consensusReached: true, reviewCount: 1 }
  }

  const [assignment] = await db
    .select()
    .from(verificationAssignments)
    .where(and(eq(verificationAssignments.milestoneId, milestoneId), eq(verificationAssignments.assignedVerifierId, verifierId)))

  if (!assignment) {
    return { updated: false }
  }

  const decisionCount = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(verifications)
    .where(eq(verifications.milestoneId, milestoneId))

  const reviewCount = Number(decisionCount[0]?.count ?? 0)
  const requiredConsensus = Number(assignment.requiredConsensus ?? 1)
  const consensusReached = reviewCount >= requiredConsensus

  await db
    .update(verificationAssignments)
    .set({
      status: consensusReached ? "completed" : "submitted",
      decision,
      report,
      consensusReached,
      reviewedAt: new Date(),
      updatedAt: new Date(),
    })
    .where(eq(verificationAssignments.id, assignment.id))

  if (consensusReached) {
    await db
      .update(milestones)
      .set({ status: "verifying", updatedAt: new Date() })
      .where(eq(milestones.id, milestoneId))
  }

  return { updated: true, consensusReached, reviewCount }
}

export async function updateVerifierReputation(verifierId: string, decision: "approve" | "reject") {
  if (!(await hasColumns("user", ["verifierReputationScore", "verifierApprovedReviews", "verifierRejectedReviews"]))) {
    return
  }

  const [current] = await db.select({ id: user.id, reputation: user.verifierReputationScore, approved: user.verifierApprovedReviews, rejected: user.verifierRejectedReviews }).from(user).where(eq(user.id, verifierId))
  if (!current) return

  const nextStats = {
    verifierReputationScore: decision === "approve"
      ? Math.min(100, (current.reputation ?? 100) + 5)
      : Math.max(0, (current.reputation ?? 100) - 10),
    verifierApprovedReviews: decision === "approve" ? (current.approved ?? 0) + 1 : current.approved ?? 0,
    verifierRejectedReviews: decision === "reject" ? (current.rejected ?? 0) + 1 : current.rejected ?? 0,
  }

  await db.update(user).set(nextStats).where(eq(user.id, verifierId))
}
