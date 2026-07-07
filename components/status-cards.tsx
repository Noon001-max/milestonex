import * as React from "react"
import Link from "next/link"
import { CheckCircle2, X, Calendar, Clock, ArrowUpRight } from "lucide-react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardAction } from "@/components/ui/card"
import { StatusBadge } from "@/components/status-badge"

type BaseProps = {
  id: number | string
  title: string
  subtitle?: string
  amount?: number
  date?: string
  status: string
  href?: string
}

function getStatusTone(status: string) {
  if (status === "approved") return "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
  if (status === "rejected") return "bg-rose-500/10 text-rose-600 dark:text-rose-400"
  return "bg-slate-500/10 text-slate-600 dark:text-slate-400"
}

export function ProposalCard({ title, subtitle, amount, date, status, href }: BaseProps) {
  const statusTone = getStatusTone(status)

  return (
    <Card className="group overflow-hidden rounded-[1.75rem] border border-border/70 bg-card/80 p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-stretch">
        <div className={`flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl ${statusTone}`}>
          {status === "approved" ? (
            <CheckCircle2 className="size-5" />
          ) : status === "rejected" ? (
            <X className="size-5" />
          ) : (
            <Clock className="size-5" />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <CardHeader className="p-0">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <CardTitle className="truncate text-lg font-semibold tracking-tight text-foreground">{title}</CardTitle>
                {subtitle ? <CardDescription className="mt-1 text-sm leading-6 text-muted-foreground">{subtitle}</CardDescription> : null}
              </div>
              <CardAction>
                <StatusBadge status={status} />
              </CardAction>
            </div>
          </CardHeader>

          <CardContent className="mt-4 grid gap-3 p-0 sm:grid-cols-[1fr_auto] sm:items-end">
            <div className="min-w-0 text-sm text-muted-foreground">
              {amount ? <div className="text-base font-semibold text-foreground">{new Intl.NumberFormat(undefined, { style: "currency", currency: "USD" }).format(amount)}</div> : null}
              {date ? <div className="mt-1 text-xs uppercase tracking-[0.18em] text-muted-foreground">{date}</div> : null}
            </div>

            {href ? (
              <Link
                href={href}
                className="inline-flex items-center justify-center gap-1.5 rounded-full bg-background px-4 py-2 text-sm font-medium text-foreground ring-1 ring-border/60 transition-all hover:-translate-y-0.5 hover:shadow-md hover:ring-primary/30 group-hover:text-primary"
              >
                View
                <ArrowUpRight className="size-4" />
              </Link>
            ) : null}
          </CardContent>
        </div>
      </div>
    </Card>
  )
}

export function MilestoneCard({ title, subtitle, amount, date, status, href }: BaseProps) {
  const statusTone = getStatusTone(status)

  return (
    <Card className="group overflow-hidden rounded-[1.75rem] border border-border/70 bg-card/80 p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-stretch">
        <div className={`flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl ${statusTone}`}>
          {status === "approved" ? (
            <CheckCircle2 className="size-5" />
          ) : status === "rejected" ? (
            <X className="size-5" />
          ) : (
            <Calendar className="size-5" />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <CardHeader className="p-0">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <CardTitle className="truncate text-lg font-semibold tracking-tight text-foreground">{title}</CardTitle>
                {subtitle ? <CardDescription className="mt-1 text-sm leading-6 text-muted-foreground">{subtitle}</CardDescription> : null}
              </div>
              <CardAction>
                <StatusBadge status={status} />
              </CardAction>
            </div>
          </CardHeader>

          <CardContent className="mt-4 grid gap-3 p-0 sm:grid-cols-[1fr_auto] sm:items-end">
            <div className="min-w-0 text-sm text-muted-foreground">
              {amount ? <div className="text-base font-semibold text-foreground">{new Intl.NumberFormat(undefined, { style: "currency", currency: "USD" }).format(amount)}</div> : null}
              {date ? <div className="mt-1 text-xs uppercase tracking-[0.18em] text-muted-foreground">{date}</div> : null}
            </div>

            {href ? (
              <Link
                href={href}
                className="inline-flex items-center justify-center gap-1.5 rounded-full bg-background px-4 py-2 text-sm font-medium text-foreground ring-1 ring-border/60 transition-all hover:-translate-y-0.5 hover:shadow-md hover:ring-primary/30 group-hover:text-primary"
              >
                Details
                <ArrowUpRight className="size-4" />
              </Link>
            ) : null}
          </CardContent>
        </div>
      </div>
    </Card>
  )
}

export default ProposalCard