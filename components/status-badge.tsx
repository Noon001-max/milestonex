import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

const STATUS_STYLES: Record<string, string> = {
  pending: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20",
  approved: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20",
  funding: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20",
  completed: "bg-emerald-500 text-white border border-emerald-600 shadow-sm",
  rejected: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20",
  submitted: "bg-violet-500/10 text-violet-600 dark:text-violet-400 border border-violet-500/20",
  verifying: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20",
  released: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20",
  open: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20",
  investigating: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20",
  resolved: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20",
}

const STATUS_LABELS: Record<string, string> = {
  pending: "Pending review",
  approved: "Approved",
  funding: "Funding",
  completed: "Completed",
  rejected: "Rejected",
  submitted: "Awaiting verification",
  verifying: "Under review",
  released: "Funds released",
  open: "Open",
  investigating: "Investigating",
  resolved: "Resolved",
}

export function StatusBadge({ status }: { status: string }) {
  return (
    <Badge
      variant="secondary"
      className={cn("font-medium border-transparent", STATUS_STYLES[status])}
    >
      {STATUS_LABELS[status] ?? status}
    </Badge>
  )
}
