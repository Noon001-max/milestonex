import * as React from "react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter, CardAction } from "@/components/ui/card"
import { StatusBadge } from "@/components/status-badge"
import { CheckCircle2, X, Calendar, Clock } from "lucide-react"
import Link from "next/link"

type BaseProps = {
  id: number | string
  title: string
  subtitle?: string
  amount?: number
  date?: string
  status: string
  href?: string
}

export function ProposalCard({ id, title, subtitle, amount, date, status, href }: BaseProps) {
  return (
    <Card className="flex flex-col sm:flex-row items-stretch gap-4 p-4">
      <div className="flex items-center justify-center w-14 h-14 rounded-lg bg-muted/50">
        {status === "approved" ? (
          <CheckCircle2 className="text-emerald-500" />
        ) : status === "rejected" ? (
          <X className="text-rose-500" />
        ) : (
          <Clock className="text-slate-500" />
        )}
      </div>

      <div className="flex-1 min-w-0">
        <CardHeader className="p-0">
          <div className="flex items-start justify-between gap-2 w-full">
            <div className="min-w-0">
              <CardTitle>{title}</CardTitle>
              {subtitle ? <CardDescription>{subtitle}</CardDescription> : null}
            </div>
            <CardAction>
              <StatusBadge status={status} />
            </CardAction>
          </div>
        </CardHeader>

        <CardContent className="p-0 mt-3 flex items-center justify-between text-sm text-muted-foreground">
          <div className="truncate">
            {amount ? <div className="font-medium">{new Intl.NumberFormat(undefined, { style: "currency", currency: "USD" }).format(amount)}</div> : null}
            {date ? <div className="text-xs">{date}</div> : null}
          </div>
          {href ? (
            <Link href={href} className="text-primary hover:underline">
              View
            </Link>
          ) : null}
        </CardContent>
      </div>
    </Card>
  )
}

export function MilestoneCard({ id, title, subtitle, amount, date, status, href }: BaseProps) {
  return (
    <Card className="flex flex-col sm:flex-row items-stretch gap-4 p-4">
      <div className="flex items-center justify-center w-14 h-14 rounded-lg bg-muted/50">
        {status === "approved" ? (
          <CheckCircle2 className="text-emerald-500" />
        ) : status === "rejected" ? (
          <X className="text-rose-500" />
        ) : (
          <Calendar className="text-slate-500" />
        )}
      </div>

      <div className="flex-1 min-w-0">
        <CardHeader className="p-0">
          <div className="flex items-start justify-between gap-2 w-full">
            <div className="min-w-0">
              <CardTitle>{title}</CardTitle>
              {subtitle ? <CardDescription>{subtitle}</CardDescription> : null}
            </div>
            <CardAction>
              <StatusBadge status={status} />
            </CardAction>
          </div>
        </CardHeader>

        <CardContent className="p-0 mt-3 flex items-center justify-between text-sm text-muted-foreground">
          <div className="truncate">
            {amount ? <div className="font-medium">{new Intl.NumberFormat(undefined, { style: "currency", currency: "USD" }).format(amount)}</div> : null}
            {date ? <div className="text-xs">{date}</div> : null}
          </div>
          {href ? (
            <Link href={href} className="text-primary hover:underline">
              Details
            </Link>
          ) : null}
        </CardContent>
      </div>
    </Card>
  )
}

export default ProposalCard
