export type MilestoneLike = {
  status?: string | null
}

export function isMilestoneUnlockedForSubmission(milestones: MilestoneLike[], index: number) {
  if (index <= 0) return true

  return milestones.slice(0, index).every((prev) => prev.status === "approved" || prev.status === "released")
}
