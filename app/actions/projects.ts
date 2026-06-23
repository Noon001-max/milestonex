"use server"

import { db } from "@/lib/db"
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
  const u = await requireRole(["owner"])

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

  const fundingGoal = parsedMilestones.reduce(
    (sum, m) => sum + (Number(m.amount) || 0),
    0,
  )

  const [project] = await db
    .insert(projects)
    .values({
      ownerId: u.id,
      title: formData.get("title") as string,
      summary: formData.get("summary") as string,
      description: formData.get("description") as string,
      category: (formData.get("category") as string) || "community",
      location: formData.get("location") as string,
      imageUrl: (formData.get("imageUrl") as string) || null,
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
    body: `Your project "${formData.get("title")}" was submitted for review.`,
    type: "project",
  })

  revalidatePath("/dashboard/projects")
  revalidatePath("/dashboard/admin")
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
  await requireRole(["admin"])

  const [project] = await db
    .update(projects)
    .set({
      status: approve ? "approved" : "rejected",
      updatedAt: new Date(),
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

// Get approved milestones for auditor release
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

// Allocate milestone amounts when project first reaches start threshold (50% funded)
export async function allocateMilestonesOnStart(projectId: number) {
  // Fetch project and milestones
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
  if (project) {
    const proj: any = project
    if (proj.allocationDone) return
  }

  const goal = project.fundingGoal || 0
  // startup allocation: 30% of funding goal
  const startup = Math.round(goal * 0.3)
  const remainingTotal = goal - startup

  if (ms.length === 1) {
    // single milestone gets the whole goal
    await db
      .update(milestones)
      .set({ amount: goal, updatedAt: new Date() })
      .where(eq(milestones.id, ms[0].id))
    return
  }

  // update first milestone to startup amount
  await db
    .update(milestones)
    .set({ amount: startup, updatedAt: new Date() })
    .where(eq(milestones.id, ms[0].id))

  // Auto-release the startup portion to the owner (deduct from escrow)
  const releaseAmount = Math.min(startup, project.escrowBalance || 0)
  if (releaseAmount > 0) {
    // mark first milestone released
    await db
      .update(milestones)
      .set({ status: "released", updatedAt: new Date() })
      .where(eq(milestones.id, ms[0].id))

    // update project escrow and released totals and mark allocation done + started
    await db
      .update(projects)
      .set({
        escrowBalance: (project.escrowBalance || 0) - releaseAmount,
        releasedAmount: (project.releasedAmount || 0) + releaseAmount,
        allocationDone: true,
        status: "started",
        updatedAt: new Date(),
      })
      .where(eq(projects.id, projectId))

    // record transaction
    await db.insert(transactions).values({
      projectId,
      milestoneId: ms[0].id,
      type: "release",
      amount: releaseAmount,
      actorId: null,
      note: `Initial startup release for milestone "${ms[0].title}"`,
    })

    // notify owner
    try {
      await notify({
        userId: project.ownerId,
        title: "Initial funds released",
        body: `${releaseAmount} released to your project "${project.title}" to start work.`,
        type: "fund_release",
      })
    } catch (err) {
      // ignore notify errors
    }

    revalidatePath(`/projects/${projectId}`)
    revalidatePath("/dashboard")
    revalidatePath("/dashboard/projects")
    revalidatePath("/dashboard/released-funds-report")
  } else {
    // ensure allocationDone flag is set even if nothing was released
    await db
      .update(projects)
      .set({ allocationDone: true, status: "started", updatedAt: new Date() })
      .where(eq(projects.id, projectId))
  }

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

