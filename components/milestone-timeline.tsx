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
}: {
  milestones: Milestone[]
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
        <li key={m.id} className="flex gap-4 group">
          <div className="flex flex-col items-center">
            <StepIcon status={m.status} />
            {i < milestones.length - 1 && (
              <span className="my-1.5 w-[2px] flex-1 bg-border/60 group-hover:bg-primary/20 transition-all duration-300" aria-hidden />
            )}
          </div>
          <div className="flex-1 pb-6 pt-0.5">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-1.5">
              <h4 className="font-semibold text-foreground text-sm sm:text-base group-hover:text-primary transition-colors duration-200">
                {m.title}
              </h4>
              <div className="flex items-center gap-2.5">
                <span className="text-xs sm:text-sm font-bold text-foreground bg-secondary/80 px-2 py-0.5 rounded-md border border-border/40">
                  {formatCurrency(m.amount)}
                </span>
                <StatusBadge status={m.status} />
              </div>
            </div>
            <p className="text-xs sm:text-sm leading-relaxed text-muted-foreground max-w-2xl">
              {m.description}
            </p>
          </div>
        </li>
      ))}
    </ol>
  )
}
