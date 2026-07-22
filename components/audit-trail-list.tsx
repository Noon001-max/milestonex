"use client"

import { useMemo, useState } from "react"
import { ChevronDown, ChevronUp } from "lucide-react"
import { formatCurrency } from "@/lib/roles"

interface TransactionItem {
  id: number
  type: string
  note?: string | null
  amount: number
  createdAt: Date | string
}

export function AuditTrailList({ transactions }: { transactions: TransactionItem[] }) {
  const [expanded, setExpanded] = useState(false)

  const visibleTransactions = useMemo(() => {
    if (!transactions.length) return []
    return expanded ? transactions : transactions.slice(0, 6)
  }, [expanded, transactions])

  if (!transactions.length) {
    return <p className="py-2 text-sm text-muted-foreground">No transactions recorded yet.</p>
  }

  return (
    <div className="space-y-3">
      <ul className="flex flex-col divide-y divide-border/60">
        {visibleTransactions.map((t) => {
          const isRelease = t.type === "release"
          return (
            <li key={t.id} className="flex items-center justify-between gap-3 py-3.5">
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-foreground">{t.note ?? t.type}</p>
                <p className="mt-0.5 text-xs capitalize text-muted-foreground">
                  {t.type.replace("_", " ")} • {new Date(t.createdAt).toLocaleDateString()}
                </p>
              </div>
              <span className={`text-sm font-bold ${isRelease ? "text-amber-600 dark:text-amber-400" : "text-emerald-600 dark:text-emerald-400"}`}>
                {isRelease ? "-" : "+"}
                {formatCurrency(t.amount)}
              </span>
            </li>
          )
        })}
      </ul>

      {transactions.length > 6 && (
        <button
          type="button"
          onClick={() => setExpanded((value) => !value)}
          className="inline-flex items-center gap-2 text-sm font-semibold text-primary transition hover:text-primary/80"
        >
          {expanded ? (
            <>
              <ChevronUp className="size-4" /> Show less
            </>
          ) : (
            <>
              <ChevronDown className="size-4" /> Show all ({transactions.length})
            </>
          )}
        </button>
      )}
    </div>
  )
}
