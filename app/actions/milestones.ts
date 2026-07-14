"use server"

import { db } from "@/lib/db"
import { milestones, projects, verifications, verificationAssignments } from "@/lib/db/schema"
import { requireRole, requireUser } from "@/lib/session"
import { notify } from "@/lib/notify"
import { eq, inArray, desc, and } from "drizzle-orm"
import { revalidatePath } from "next/cache"
import { assignVerifiersForMilestone, evaluateVerificationLocation, insertVerificationRecord, recordVerificationSubmission, updateVerifierReputation } from "@/lib/verification"

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

  await assignVerifiersForMilestone(milestoneId, m.projectId, m.amount)

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
  verifierLatitude?: number | null,
  verifierLongitude?: number | null,
) {
  const u = await requireRole(["verifier", "admin"])

  const [m] = await db
    .select()
    .from(milestones)
    .where(eq(milestones.id, milestoneId))
  if (!m) throw new Error("Milestone not found")

  if (u.role === "verifier") {
    const [assignment] = await db
      .select()
      .from(verificationAssignments)
      .where(and(eq(verificationAssignments.milestoneId, milestoneId), eq(verificationAssignments.assignedVerifierId, u.id)))

    if (!assignment) {
      throw new Error("You are not assigned to verify this milestone")
    }

    const [projectLocation] = await db
      .select({ latitude: projects.latitude, longitude: projects.longitude })
      .from(projects)
      .where(eq(projects.id, m.projectId))

    const parsedLatitude = Number(verifierLatitude)
    const parsedLongitude = Number(verifierLongitude)
    const locationCheck = evaluateVerificationLocation(
      projectLocation?.latitude ?? null,
      projectLocation?.longitude ?? null,
      Number.isFinite(parsedLatitude) ? parsedLatitude : null,
      Number.isFinite(parsedLongitude) ? parsedLongitude : null,
    )

    if (!locationCheck.locationMatch) {
      throw new Error(
        locationCheck.distanceMeters == null
          ? "Project coordinates are missing. The proposer must add site coordinates before verification can proceed."
          : `Verification location is outside the 50m radius. Your submitted coordinates were ${locationCheck.distanceMeters}m away from the project site.`,
      )
    }

    await insertVerificationRecord({
      milestoneId,
      projectId: m.projectId,
      verifierId: u.id,
      verifierName: u.name,
      decision,
      report,
      verifierLatitude: parsedLatitude,
      verifierLongitude: parsedLongitude,
      locationDistanceMeters: locationCheck.distanceMeters,
      locationMatch: true,
    })

    const assignmentResult = await recordVerificationSubmission(milestoneId, u.id, u.name, decision, report)
    if (!assignmentResult.updated) {
      throw new Error("You are not assigned to verify this milestone")
    }
    await updateVerifierReputation(u.id, decision)
  } else {
    await db
      .update(milestones)
      .set({ status: "verifying", updatedAt: new Date() })
      .where(eq(milestones.id, milestoneId))
  }

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

  // Ensure the admin approved the parent project before deciding
  const [parentProject] = await db
    .select({ id: projects.id, approvedBy: projects.approvedBy })
    .from(projects)
    .where(eq(projects.id, m.projectId))
  if (!parentProject) throw new Error("Parent project not found")
  if (parentProject.approvedBy !== u.id) {
    throw new Error("Only the admin who approved this project can decide its milestones")
  }

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
  const u = await requireRole(["admin"])

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
    .where(and(eq(milestones.status, "verifying"), eq(projects.approvedBy, u.id)))
}

export async function getAdminMilestoneHistory() {
  const u = await requireRole(["admin"])

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
    .where(and(inArray(milestones.status, ["approved", "rejected"]), eq(projects.approvedBy, u.id)))
}

// Milestones awaiting verification (for verifier queue)
export async function getVerificationQueue() {
  const actor = await requireRole(["verifier", "admin"])

  if (actor.role === "verifier") {
    const assignments = await db
      .select({ milestoneId: verificationAssignments.milestoneId })
      .from(verificationAssignments)
      .where(eq(verificationAssignments.assignedVerifierId, actor.id))

    if (assignments.length === 0) return []

    const milestoneIds = assignments.map((item) => item.milestoneId)

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
      .where(and(inArray(milestones.id, milestoneIds), eq(milestones.status, "submitted")))
  }

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
      verifierId: verifications.verifierId,
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
