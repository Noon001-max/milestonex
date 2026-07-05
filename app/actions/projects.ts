"use server"

import { db, pool } from "@/lib/db"
import { put } from "@vercel/blob"
import { projects, milestones, user, transactions } from "@/lib/db/schema"
import { requireRole, requireUser } from "@/lib/session"
import { notify } from "@/lib/notify"
import { and, desc, eq } from "drizzle-orm"
import { revalidatePath } from "next/cache"

type MilestoneInput = {
  title: string
  description: string
  amount: number
}

export async function createProject(formData: FormData) {
  try {
    const u = await requireRole(["owner"])
    // Debug: log minimal user info to help trace server errors (dev only)
    try {
      console.debug("createProject invoked by user:", { userId: u.id })
    } catch (e) {
      // ignore
    }

    // Validate required fields
    const title = (formData.get("title") as string)?.trim()
    const summary = (formData.get("summary") as string)?.trim()
    const description = (formData.get("description") as string)?.trim()
    
    if (!title) throw new Error("Project title is required")
    if (!summary) throw new Error("Project summary is required")
    if (!description) throw new Error("Project description is required")

    const parsedMilestones = [] as MilestoneInput[]

    for (let i = 0; i < 10; i++) {
      const title = formData.get(`milestones[${i}].title`) as string
      const desc = formData.get(`milestones[${i}].description`) as string
      const amount = formData.get(`milestones[${i}].amount`) as string
      if (title || desc || amount) {
        parsedMilestones.push({
          title: title || "",
          description: desc || "",
          amount: Number(amount) || 0,
        })
      }
    }

    if (parsedMilestones.length === 0) {
      throw new Error("Please add at least one milestone")
    }

    console.debug("createProject parsedMilestones", { count: parsedMilestones.length })

    const fundingGoal = parsedMilestones.reduce(
      (sum, m) => sum + (Number(m.amount) || 0),
      0,
    )

    if (fundingGoal <= 0) {
      throw new Error("At least one milestone must have an amount greater than 0")
    }

    console.debug("createProject fundingGoal", { fundingGoal })

    // If a file was attached under 'imageUrl', upload it to blob storage
    let uploadedImageUrl: string | null = null
    try {
      const possibleFile = formData.get("imageUrl") as File | string | null
      const isFile = possibleFile && typeof (possibleFile as any).size === "number"
      console.debug("createProject image field", { type: typeof possibleFile, isFile })
      if (isFile && (possibleFile as any).size) {
        // Basic validation
        if (!(possibleFile as File).type.startsWith("image/")) {
          throw new Error("Only image files are allowed")
        }
        if ((possibleFile as File).size > 8 * 1024 * 1024) {
          throw new Error("Image must be smaller than 8MB")
        }
        const blob = await put(`projects/${Date.now()}-${(possibleFile as File).name}`, possibleFile as File, {
          access: "public",
          addRandomSuffix: true,
        })
        uploadedImageUrl = blob.url
      }
    } catch (err) {
      console.error("Image upload failed:", err)
      // continue without image
      uploadedImageUrl = null
    }

    const [project] = await db
      .insert(projects)
      .values({
        ownerId: u.id,
        title: title,
        summary: summary,
        description: description,
        category: (formData.get("category") as string) || "community",
        location: (formData.get("location") as string) || "",
        imageUrl: uploadedImageUrl || (formData.get("imageUrl") as string) || null,
        fundingGoal,
        status: "pending",
      })
      .returning({
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

    if (parsedMilestones.length > 0) {
      await db.insert(milestones).values(
        parsedMilestones.map((m, i) => ({
          projectId: project.id,
          title: m.title,
          description: m.description,
          amount: Number(m.amount) || 0,
          orderIndex: i,
          status: "pending" as const,
        })),
      )
    }

    await notify({
      userId: u.id,
      title: "Project submitted",
      body: `Your project "${title}" was submitted for review.`,
      type: "project",
    })

    revalidatePath("/dashboard/projects")
    revalidatePath("/dashboard/admin")
  } catch (err) {
    // Log server-side and rethrow a clear message for the client
    console.error("createProject error:", err)
    throw new Error(err instanceof Error ? err.message : "Failed to create project")
  }
}

export async function getMyProjects() {
  const u = await requireUser()
  return db
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
    .where(eq(projects.ownerId, u.id))
    .orderBy(desc(projects.createdAt))
}

export async function reviewProject(projectId: number, approve: boolean) {
  const u = await requireRole(["admin"])

  const [project] = await db
    .update(projects)
    .set({
      status: approve ? "approved" : "rejected",
      updatedAt: new Date(),
      approvedBy: approve ? u.id : null,
    })
    .where(eq(projects.id, projectId))
    .returning({
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

  if (project) {
    await notify({
      userId: project.ownerId,
      title: approve ? "Project approved" : "Project rejected",
      body: approve
        ? `"${project.title}" is now live and visible to donors.`
        : `"${project.title}" was not approved at this time.`,
      type: "project",
    })
  }

  revalidatePath("/dashboard/admin")
  revalidatePath("/dashboard/admin/projects")
  revalidatePath(`/dashboard/admin/projects/${projectId}`)
  revalidatePath("/projects")
  revalidatePath("/dashboard/projects")
}

export async function getOwnerName(ownerId: string) {
  const rows = await db
    .select({ name: user.name })
    .from(user)
    .where(eq(user.id, ownerId))
  return rows[0]?.name ?? "Unknown"
}

// Release approved milestone funds from escrow (auditor action)
export async function releaseMilestoneFunds(milestoneId: number) {
  const u = await requireRole(["auditor"])

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
  if (m.status !== "approved") {
    throw new Error("Only approved milestones can be released")
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
  if (!project) throw new Error("Project not found")

  const releaseAmount = Math.min(m.amount, project.escrowBalance)

  await db
    .update(milestones)
    .set({ status: "released", updatedAt: new Date() })
    .where(eq(milestones.id, milestoneId))

  const remainingMilestones = await db
    .select()
    .from(milestones)
    .where(
      and(
        eq(milestones.projectId, m.projectId),
      ),
    )
  const allReleased = remainingMilestones.every(
    (ms) => ms.id === milestoneId || ms.status === "released",
  )

  await db
    .update(projects)
    .set({
      escrowBalance: project.escrowBalance - releaseAmount,
      releasedAmount: project.releasedAmount + releaseAmount,
      status: allReleased ? "completed" : project.status,
      updatedAt: new Date(),
    })
    .where(eq(projects.id, m.projectId))

  await db.insert(transactions).values({
    projectId: m.projectId,
    milestoneId: m.id,
    type: "release",
    amount: releaseAmount,
    actorId: u.id,
    note: `Funds released for milestone "${m.title}"`,
  })

  await notify({
    userId: project.ownerId,
    title: "Funds released",
    body: `${releaseAmount} released from escrow for "${m.title}".`,
    type: "fund_release",
  })

  revalidatePath(`/projects/${m.projectId}`)
  revalidatePath("/dashboard/release-funds")
  revalidatePath("/dashboard/released-funds-report")
  revalidatePath("/dashboard/projects")
}

// Get approved milestones available for manual release
export async function getApprovedMilestones() {
  await requireRole(["auditor"])
  return db
    .select({
      id: milestones.id,
      title: milestones.title,
      description: milestones.description,
      amount: milestones.amount,
      status: milestones.status,
      projectId: milestones.projectId,
      projectTitle: projects.title,
      escrowBalance: projects.escrowBalance,
    })
    .from(milestones)
    .innerJoin(projects, eq(projects.id, milestones.projectId))
    .where(eq(milestones.status, "approved"))
    .orderBy(desc(milestones.updatedAt))
}

export async function getReadyToStartProjects() {
  await requireRole(["admin"])

  return db
    .select({
      projectId: projects.id,
      title: projects.title,
      summary: projects.summary,
      fundingGoal: projects.fundingGoal,
      fundedAmount: projects.fundedAmount,
      escrowBalance: projects.escrowBalance,
      releasedAmount: projects.releasedAmount,
      status: projects.status,
      milestoneId: milestones.id,
      milestoneTitle: milestones.title,
      milestoneAmount: milestones.amount,
      milestoneStatus: milestones.status,
    })
    .from(projects)
    .innerJoin(
      milestones,
      and(
        eq(projects.id, milestones.projectId),
        eq(milestones.orderIndex, 0),
      ),
    )
    .where(
      and(
        eq(projects.status, "funding"),
        eq(milestones.status, "pending"),
      ),
    )
    .orderBy(desc(projects.updatedAt))
}

export async function getApprovedProjectsByAdmin() {
  const u = await requireRole(["admin"])

  return db
    .select({
      id: projects.id,
      ownerId: projects.ownerId,
      title: projects.title,
      summary: projects.summary,
      status: projects.status,
      approvedBy: projects.approvedBy,
      updatedAt: projects.updatedAt,
    })
    .from(projects)
    .where(eq(projects.approvedBy, u.id))
    .orderBy(desc(projects.updatedAt))
}

export async function approveProjectStart(projectId: number) {
  const u = await requireRole(["admin"])

  const [project] = await db
    .select({
      id: projects.id,
      ownerId: projects.ownerId,
      title: projects.title,
      status: projects.status,
    })
    .from(projects)
    .where(eq(projects.id, projectId))

  if (!project) throw new Error("Project not found")

  const [milestone] = await db
    .select({
      id: milestones.id,
      status: milestones.status,
    })
    .from(milestones)
    .where(
      and(
        eq(milestones.projectId, projectId),
        eq(milestones.orderIndex, 0),
      ),
    )

  if (!milestone) throw new Error("Startup milestone not found")
  if (milestone.status !== "pending") {
    throw new Error("Startup milestone is not pending approval")
  }

  await db
    .update(milestones)
    .set({ status: "approved", updatedAt: new Date(), approvedBy: u.id })
    .where(eq(milestones.id, milestone.id))

  await db
    .update(projects)
    .set({ status: "started", updatedAt: new Date() })
    .where(eq(projects.id, projectId))

  await notify({
    userId: project.ownerId,
    title: "Project ready to start",
    body: `Your project "${project.title}" has been approved to start. Milestone 1 is now ready for release.`,
    type: "project",
  })

  revalidatePath(`/projects/${projectId}`)
  revalidatePath("/dashboard")
  revalidatePath("/dashboard/projects")
  revalidatePath("/dashboard/release-funds")
  revalidatePath("/dashboard/admin")
  revalidatePath("/dashboard/admin/ready-to-start")
}

// Allocate milestone amounts when project first reaches start threshold (50% funded)
export async function allocateMilestonesOnStart(projectId: number) {
  // Fetch project and milestones
  const hasAllocationDone = async () => {
    const colRes = await pool.query(
      `select column_name from information_schema.columns where table_name = $1 and column_name = $2`,
      ["projects", "allocationDone"],
    )
    return (colRes?.rowCount ?? 0) > 0
  }

  const allocationSupported = await hasAllocationDone()

  const [project, ms] = await Promise.all([
    db
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
      .where(eq(projects.id, projectId))
      .then((r) => r[0]),
    db
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
      .where(eq(milestones.projectId, projectId))
      .orderBy(milestones.orderIndex),
  ])
  if (!project) throw new Error("Project not found")
  if (!ms || ms.length === 0) return

  // Idempotency: do nothing if allocation already ran
  if (project && allocationSupported) {
    const proj: any = project
    if (proj.allocationDone) return
  }

  const goal = project.fundingGoal || 0
  // startup allocation: 30% of funding goal
  const startup = Math.round(goal * 0.3)
  const remainingTotal = goal - startup

  if (ms.length === 1) {
    // single milestone gets the whole goal and becomes ready for admin approval
    await db
      .update(milestones)
      .set({ amount: goal, status: "pending", updatedAt: new Date() })
      .where(eq(milestones.id, ms[0].id))

    await db
      .update(projects)
      .set({
        ...(allocationSupported ? { allocationDone: true } : {}),
        updatedAt: new Date(),
      })
      .where(eq(projects.id, projectId))

    revalidatePath(`/projects/${projectId}`)
    revalidatePath("/dashboard")
    revalidatePath("/dashboard/projects")
    revalidatePath("/dashboard/release-funds")
    revalidatePath("/dashboard/released-funds-report")
    return
  }

  // update first milestone to startup amount and keep it pending for admin approval
  await db
    .update(milestones)
    .set({ amount: startup, status: "pending", updatedAt: new Date() })
    .where(eq(milestones.id, ms[0].id))

  await db
    .update(projects)
    .set({
      ...(allocationSupported ? { allocationDone: true } : {}),
      updatedAt: new Date(),
    })
    .where(eq(projects.id, projectId))

  revalidatePath(`/projects/${projectId}`)
  revalidatePath("/dashboard")
  revalidatePath("/dashboard/projects")
  revalidatePath("/dashboard/release-funds")
  revalidatePath("/dashboard/released-funds-report")

  // distribute remaining equally among remaining milestones
  const rest = ms.slice(1)
  const per = Math.floor(remainingTotal / rest.length)
  let remainder = remainingTotal - per * rest.length

  for (const m of rest) {
    const amt = per + (remainder > 0 ? 1 : 0)
    if (remainder > 0) remainder -= 1
    await db
      .update(milestones)
      .set({ amount: amt, updatedAt: new Date() })
      .where(eq(milestones.id, m.id))
  }
}

// Get released funds history for auditor report
export async function getReleasedFundsHistory() {
  await requireRole(["auditor"])
  return db
    .select({
      id: transactions.id,
      milestoneId: transactions.milestoneId,
      projectId: transactions.projectId,
      amount: transactions.amount,
      note: transactions.note,
      createdAt: transactions.createdAt,
      projectTitle: projects.title,
      milestoneTitle: milestones.title,
    })
    .from(transactions)
    .innerJoin(projects, eq(projects.id, transactions.projectId))
    .leftJoin(milestones, eq(milestones.id, transactions.milestoneId))
    .where(eq(transactions.type, "release"))
    .orderBy(desc(transactions.createdAt))
}

