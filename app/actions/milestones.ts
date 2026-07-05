"use server"

import { db } from "@/lib/db"
import { milestones, projects, verifications } from "@/lib/db/schema"
import { requireRole, requireUser } from "@/lib/session"
import { notify } from "@/lib/notify"
import { eq, inArray, desc } from "drizzle-orm"
import { revalidatePath } from "next/cache"

// Project proposer submits milestone completion + evidence
export async function submitMilestoneEvidence(
  milestoneId: number,
  evidenceNote: string,
  evidenceUrls: string,
) {
  const u = await requireUser()

  const [m] = await db
    .select({
      id: milestones.id,
      projectId: milestones.projectId,
      title: milestones.title,
      description: milestones.description,
      amount: milestones.amount,
      dueDate: milestones.dueDate,
      orderIndex: milestones.orderIndex,
      status: milestones.status,
      evidenceNote: milestones.evidenceNote,
      evidenceUrls: milestones.evidenceUrls,
      submittedAt: milestones.submittedAt,
      createdAt: milestones.createdAt,
      updatedAt: milestones.updatedAt,
    })
    .from(milestones)
    .where(eq(milestones.id, milestoneId))
  if (!m) throw new Error("Milestone not found")

  const [project] = await db
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
    .where(eq(projects.id, m.projectId))
  if (!project) throw new Error("Project not found")
  if (project.ownerId !== u.id && u.role !== "admin") {
    throw new Error("Only the project proposer can submit evidence")
  }

  await db
    .update(milestones)
    .set({
      status: "submitted",
      evidenceNote,
      evidenceUrls,
      submittedAt: new Date(),
      updatedAt: new Date(),
    })
    .where(eq(milestones.id, milestoneId))

  await notify({
    userId: u.id,
    title: "Milestone submitted",
    body: `"${m.title}" is awaiting community verification.`,
    type: "verification",
  })

  revalidatePath(`/projects/${m.projectId}`)
  revalidatePath("/dashboard/projects")
  revalidatePath("/dashboard/verify")
}

// Community verifier submits an inspection report
export async function submitVerification(
  milestoneId: number,
  decision: "approve" | "reject",
  report: string,
) {
  const u = await requireRole(["verifier", "admin"])

  const [m] = await db
    .select()
    .from(milestones)
    .where(eq(milestones.id, milestoneId))
  if (!m) throw new Error("Milestone not found")

  await db.insert(verifications).values({
    milestoneId,
    projectId: m.projectId,
    verifierId: u.id,
    verifierName: u.name,
    decision,
    report,
  })

  await db
    .update(milestones)
    .set({ status: "verifying", updatedAt: new Date() })
    .where(eq(milestones.id, milestoneId))

  const [project] = await db
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
    .where(eq(projects.id, m.projectId))
  if (project) {
    await notify({
      userId: project.ownerId,
      title: "Verification report submitted",
      body: `A verifier ${decision === "approve" ? "recommended approval" : "raised concerns"} for "${m.title}".`,
      type: "verification",
    })
  }

  revalidatePath(`/projects/${m.projectId}`)
  revalidatePath("/dashboard/verify")
  revalidatePath("/dashboard/admin")
}

// Admin reviews verification reports and approves/rejects the milestone
export async function decideMilestone(
  milestoneId: number,
  approve: boolean,
) {
  const u = await requireRole(["admin"])

  const [m] = await db
    .select()
    .from(milestones)
    .where(eq(milestones.id, milestoneId))
  if (!m) throw new Error("Milestone not found")

  await db
    .update(milestones)
    .set({
      status: approve ? "approved" : "rejected",
      updatedAt: new Date(),
      approvedBy: approve ? u.id : null,
    })
    .where(eq(milestones.id, milestoneId))

  const [project] = await db
    .select()
    .from(projects)
    .where(eq(projects.id, m.projectId))
  if (project) {
    await notify({
      userId: project.ownerId,
      title: approve ? "Milestone approved" : "Milestone rejected",
      body: approve
        ? `"${m.title}" was approved. Funds can now be released from escrow.`
        : `"${m.title}" was rejected. Payment is on hold.`,
      type: "milestone",
    })
  }

  revalidatePath(`/projects/${m.projectId}`)
  revalidatePath("/dashboard/admin")
  revalidatePath("/dashboard/projects")
}

export async function getAdminMilestoneQueue() {
  await requireRole(["admin"])
  return db
    .select({
      id: milestones.id,
      title: milestones.title,
      description: milestones.description,
      amount: milestones.amount,
      status: milestones.status,
      evidenceNote: milestones.evidenceNote,
      evidenceUrls: milestones.evidenceUrls,
      submittedAt: milestones.submittedAt,
      projectId: milestones.projectId,
      projectTitle: projects.title,
    })
    .from(milestones)
    .innerJoin(projects, eq(projects.id, milestones.projectId))
    .where(eq(milestones.status, "verifying"))
}

export async function getAdminMilestoneHistory() {
  await requireRole(["admin"])
  return db
    .select({
      id: milestones.id,
      title: milestones.title,
      description: milestones.description,
      amount: milestones.amount,
      status: milestones.status,
      projectId: milestones.projectId,
      projectTitle: projects.title,
      updatedAt: milestones.updatedAt,
    })
    .from(milestones)
    .innerJoin(projects, eq(projects.id, milestones.projectId))
    .where(inArray(milestones.status, ["approved", "rejected"]))
}

// Milestones awaiting verification (for verifier queue)
export async function getVerificationQueue() {
  await requireRole(["verifier", "admin"])
  return db
    .select({
      id: milestones.id,
      title: milestones.title,
      description: milestones.description,
      amount: milestones.amount,
      status: milestones.status,
      evidenceNote: milestones.evidenceNote,
      evidenceUrls: milestones.evidenceUrls,
      submittedAt: milestones.submittedAt,
      projectId: milestones.projectId,
      projectTitle: projects.title,
    })
    .from(milestones)
    .innerJoin(projects, eq(projects.id, milestones.projectId))
    .where(eq(milestones.status, "submitted"))
}

export async function getCompletedVerifications() {
  const user = await requireRole(["verifier", "admin"])

  return db
    .select({
      id: verifications.id,
      milestoneId: verifications.milestoneId,
      projectId: verifications.projectId,
      verifierName: verifications.verifierName,
      decision: verifications.decision,
      report: verifications.report,
      reviewedAt: verifications.createdAt,
      projectTitle: projects.title,
      milestoneTitle: milestones.title,
      milestoneAmount: milestones.amount,
      milestoneStatus: milestones.status,
    })
    .from(verifications)
    .innerJoin(projects, eq(projects.id, verifications.projectId))
    .innerJoin(milestones, eq(milestones.id, verifications.milestoneId))
    .where(eq(verifications.verifierId, user.id))
}

export async function getApprovedMilestonesByAdmin() {
  const u = await requireRole(["admin"])

  return db
    .select({
      id: milestones.id,
      projectId: milestones.projectId,
      title: milestones.title,
      amount: milestones.amount,
      status: milestones.status,
      approvedBy: milestones.approvedBy,
      updatedAt: milestones.updatedAt,
      projectTitle: projects.title,
    })
    .from(milestones)
    .innerJoin(projects, eq(projects.id, milestones.projectId))
    .where(eq(milestones.approvedBy, u.id))
    .orderBy(desc(milestones.updatedAt))
}
