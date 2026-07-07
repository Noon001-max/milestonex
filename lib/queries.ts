import { db, pool } from "@/lib/db"
import {
  projects,
  milestones,
  donations,
  transactions,
  verifications,
  disputes,
} from "@/lib/db/schema"
import { user } from "@/lib/db/schema"
import { and, desc, eq, sql } from "drizzle-orm"

export async function getPublicProjects() {
  return db
    .select({
      id: projects.id,
      title: projects.title,
      summary: projects.summary,
      category: projects.category,
      location: projects.location,
      imageUrl: projects.imageUrl,
      fundingGoal: projects.fundingGoal,
      fundedAmount: projects.fundedAmount,
      escrowBalance: projects.escrowBalance,
      releasedAmount: projects.releasedAmount,
      status: projects.status,
      createdAt: projects.createdAt,
      updatedAt: projects.updatedAt,
    })
    .from(projects)
    .where(
      sql`${projects.status} in ('approved', 'funding', 'started', 'completed')`,
    )
    .orderBy(desc(projects.createdAt))
}

export async function getAllProjects() {
  return db
    .select({
      id: projects.id,
      title: projects.title,
      fundingGoal: projects.fundingGoal,
      status: projects.status,
      ownerId: projects.ownerId,
      fundedAmount: projects.fundedAmount,
      escrowBalance: projects.escrowBalance,
      category: projects.category,
      imageUrl: projects.imageUrl,
      location: projects.location,
      createdAt: projects.createdAt,
    })
    .from(projects)
    .orderBy(desc(projects.createdAt))
}

export async function getPendingProjects() {
  return db
    .select({
      id: projects.id,
      title: projects.title,
      summary: projects.summary,
      fundingGoal: projects.fundingGoal,
      status: projects.status,
      ownerId: projects.ownerId,
      ownerName: user.name,
      imageUrl: projects.imageUrl,
      location: projects.location,
      createdAt: projects.createdAt,
    })
    .from(projects)
    .leftJoin(user, eq(projects.ownerId, user.id))
    .where(eq(projects.status, "pending"))
    .orderBy(desc(projects.createdAt))
}

export async function getProjectById(id: number): Promise<any> {
  // Check whether the `allocationDone` column exists in the deployed DB.
  const colRes = await pool.query(
    `select column_name from information_schema.columns where table_name = $1 and column_name = $2`,
    ["projects", "allocationDone"],
  )
  const hasAllocation = (colRes?.rowCount ?? 0) > 0

  if (hasAllocation) {
    const rows = await db
      .select({
        id: projects.id,
        ownerId: projects.ownerId,
        title: projects.title,
        summary: projects.summary,
        description: projects.description,
        category: projects.category,
        location: projects.location,
        imageUrl: projects.imageUrl,
        fundingGoal: projects.fundingGoal,
        fundedAmount: projects.fundedAmount,
        escrowBalance: projects.escrowBalance,
        releasedAmount: projects.releasedAmount,
        allocationDone: projects.allocationDone,
        status: projects.status,
        createdAt: projects.createdAt,
        updatedAt: projects.updatedAt,
      })
      .from(projects)
      .where(eq(projects.id, id))
    return rows[0] ?? null
  }

  // Fallback for older DBs without the column: select the other fields and
  // synthesize `allocationDone: false` so callers have a consistent shape.
  const rows = await db
    .select({
      id: projects.id,
      ownerId: projects.ownerId,
      title: projects.title,
      summary: projects.summary,
      description: projects.description,
      category: projects.category,
      location: projects.location,
      imageUrl: projects.imageUrl,
      fundingGoal: projects.fundingGoal,
      fundedAmount: projects.fundedAmount,
      escrowBalance: projects.escrowBalance,
      releasedAmount: projects.releasedAmount,
      status: projects.status,
      createdAt: projects.createdAt,
      updatedAt: projects.updatedAt,
    })
    .from(projects)
    .where(eq(projects.id, id))

  const project = rows[0] ?? null
  if (project) {
    const p: any = project
    p.allocationDone = false
  }
  return project
}

export async function getProjectMilestones(projectId: number) {
  return db
    .select()
    .from(milestones)
    .where(eq(milestones.projectId, projectId))
    .orderBy(milestones.orderIndex)
}

export async function getProjectDonations(projectId: number) {
  return db
    .select()
    .from(donations)
    .where(eq(donations.projectId, projectId))
    .orderBy(desc(donations.createdAt))
}

export async function getProjectTransactions(projectId: number) {
  return db
    .select()
    .from(transactions)
    .where(eq(transactions.projectId, projectId))
    .orderBy(desc(transactions.createdAt))
}

export async function getMilestoneVerifications(milestoneId: number) {
  return db
    .select()
    .from(verifications)
    .where(eq(verifications.milestoneId, milestoneId))
    .orderBy(desc(verifications.createdAt))
}

export async function getPlatformStats() {
  const result = await db
    .select({
      totalProjects: sql<number>`count(*)::int`,
      totalRaised: sql<number>`coalesce(sum(${projects.fundedAmount}), 0)::int`,
      totalEscrow: sql<number>`coalesce(sum(${projects.escrowBalance}), 0)::int`,
      totalReleased: sql<number>`coalesce(sum(${projects.releasedAmount}), 0)::int`,
    })
    .from(projects)
    .where(sql`${projects.status} in ('approved', 'funding', 'started', 'completed')`)

  const agg = result[0] ?? {
    totalProjects: 0,
    totalRaised: 0,
    totalEscrow: 0,
    totalReleased: 0,
  }

  const milestoneResult = await db
    .select({
      verified: sql<number>`count(*) filter (where ${milestones.status} in ('approved','released'))::int`,
      total: sql<number>`count(*)::int`,
    })
    .from(milestones)

  const milestoneAgg = milestoneResult[0] ?? { verified: 0, total: 0 }

  return {
    totalProjects: agg.totalProjects ?? 0,
    totalRaised: agg.totalRaised ?? 0,
    totalEscrow: agg.totalEscrow ?? 0,
    totalReleased: agg.totalReleased ?? 0,
    verifiedMilestones: milestoneAgg.verified ?? 0,
    totalMilestones: milestoneAgg.total ?? 0,
  }
}

export async function getRecentActivity(limit = 8) {
  return db
    .select()
    .from(transactions)
    .orderBy(desc(transactions.createdAt))
    .limit(limit)
}

export async function getOpenDisputes() {
  return db
    .select()
    .from(disputes)
    .where(and(eq(disputes.status, "open")))
    .orderBy(desc(disputes.createdAt))
}
