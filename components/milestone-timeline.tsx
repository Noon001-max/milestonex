import { CheckCircle2, Circle, Clock, XCircle } from "lucide-react"
import { StatusBadge } from "@/components/status-badge"
import { formatCurrency } from "@/lib/roles"

type Milestone = {
  id: number
  title: string
  description: string
  amount: number
  status: string
  orderIndex: number
}

function StepIcon({ status }: { status: string }) {
  if (status === "released" || status === "approved") {
    return (
      <span className="flex size-8 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 shadow-sm animate-fade-in">
        <CheckCircle2 className="size-4.5" />
      </span>
    )
  }
  if (status === "rejected") {
    return (
      <span className="flex size-8 items-center justify-center rounded-full bg-rose-500/10 text-rose-500 border border-rose-500/20 shadow-sm">
        <XCircle className="size-4.5" />
      </span>
    )
  }
  if (status === "submitted" || status === "verifying") {
    return (
      <span className="flex size-8 items-center justify-center rounded-full bg-violet-500/10 text-violet-500 border border-violet-500/20 shadow-sm animate-pulse-subtle">
        <Clock className="size-4.5" />
      </span>
    )
  }
  return (
    <span className="flex size-8 items-center justify-center rounded-full bg-secondary text-muted-foreground border border-border/80 shadow-inner">
      <Circle className="size-3.5" />
    </span>
  )
}

export function MilestoneTimeline({
  milestones,
  ownerView,
}: {
  milestones: Milestone[]
  ownerView?: boolean
}) {
  if (milestones.length === 0) {
    return (
      <div className="text-center py-6">
        <p className="text-sm text-muted-foreground font-medium">
          No milestones defined for this project.
        </p>
      </div>
    )
  }

  return (
    <ol className="flex flex-col gap-1">
      {milestones.map((m, i) => (
        <li key={m.id} className="flex flex-col gap-3 group sm:flex-row sm:gap-4">
          <div className="flex flex-row items-start gap-3 sm:flex-col sm:items-center sm:gap-0">
            <StepIcon status={m.status} />
            {i < milestones.length - 1 && (
              <span
                className="hidden min-h-6 w-[2px] flex-1 bg-border/60 transition-all duration-300 group-hover:bg-primary/20 sm:block"
                aria-hidden
              />
            )}
          </div>
          <div className="min-w-0 flex-1 pb-6 pt-0.5">
            <div className="mb-1.5 flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
              <h4 className="break-words font-semibold text-foreground text-sm transition-colors duration-200 group-hover:text-primary sm:text-base">
                {m.title}
              </h4>
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="text-xs sm:text-sm font-bold text-foreground bg-secondary/80 px-2 py-0.5 rounded-md border border-border/40">
                  {formatCurrency(m.amount)}
                </span>
                <StatusBadge status={m.status} />
              </div>
            </div>
            <p className="max-w-full break-words text-xs leading-relaxed text-muted-foreground sm:text-sm sm:max-w-2xl">
              {m.description}
            </p>
          </div>
        </li>
      ))}
    </ol>
  )
}
