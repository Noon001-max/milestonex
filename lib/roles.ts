import type { Role } from "@/lib/session"

export const ROLES: {
  value: Role
  label: string
  description: string
}[] = [
  {
    value: "donor",
    label: "Donor / Investor",
    description: "Fund projects, follow milestone progress, and keep funds accountable.",
  },
  {
    value: "owner",
    label: "Project Proposer",
    description: "Submit projects, define milestones, and request escrow releases.",
  },
  {
    value: "verifier",
    label: "Community Verifier",
    description: "Inspect work, verify milestone evidence, and submit verification reports.",
  },
  {
    value: "admin",
    label: "Administrator",
    description: "Approve projects, manage disputes, and enforce platform policy.",
  },
  {
    value: "auditor",
    label: "Auditor / Partner",
    description: "Review escrow accounting, audits, and financial accountability.",
  },
  {
    value: "suspended",
    label: "Suspended account",
    description: "Limited access while your account is under review. Contact support for assistance.",
  },
]

export const ROLE_LABELS: Record<Role, string> = {
  donor: "Donor / Investor",
  owner: "Project Proposer",
  verifier: "Community Verifier",
  admin: "Administrator",
  auditor: "Auditor / Partner",
  suspended: "Suspended account",
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-KE", {
    style: "currency",
    currency: "KSH",
    maximumFractionDigits: 0,
  }).format(amount)
}
