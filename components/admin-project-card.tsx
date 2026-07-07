"use client"

import { useState } from "react"
import Link from "next/link"
import { reviewProject } from "@/app/actions/projects"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { StatusBadge } from "@/components/status-badge"
import { formatCurrency } from "@/lib/roles"
import { CheckCircle, XCircle } from "lucide-react"

interface AdminProjectCardProps {
  id: number
  title: string
  summary: string
  fundingGoal: number
  status: string
  imageUrl?: string | null
  proposerName?: string | null
}

export function AdminProjectCard({
  id,
  title,
  summary,
  fundingGoal,
  status,
  imageUrl,
  proposerName,
}: AdminProjectCardProps) {
  const [isLoading, setIsLoading] = useState(false)

  const handleApprove = async () => {
    setIsLoading(true)
    try {
      await reviewProject(id, true)
    } catch (error) {
      console.error("Failed to approve project:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleReject = async () => {
    setIsLoading(true)
    try {
      await reviewProject(id, false)
    } catch (error) {
      console.error("Failed to reject project:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="group overflow-hidden rounded-[1.75rem] border border-border/70 bg-card/80 p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-start gap-4">
          <img
            src={imageUrl || "/hero-community.png"}
            alt={title}
            className="h-20 w-28 rounded-2xl object-cover ring-1 ring-border/60"
          />

          <div className="min-w-0 space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <StatusBadge status={status} />
              <span className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">Project review</span>
            </div>
            <Link
              href={`/dashboard/admin/projects/${id}`}
              className="block truncate text-lg font-semibold tracking-tight text-foreground transition-colors hover:text-primary"
            >
              {title}
            </Link>
            {proposerName ? (
              <div className="text-sm text-muted-foreground">
                Proposed by <span className="font-medium text-foreground">{proposerName}</span>
              </div>
            ) : null}
            <p className="max-w-2xl text-sm leading-6 text-muted-foreground line-clamp-2">
              {summary}
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-3 lg:items-end">
          <div className="rounded-2xl bg-muted/40 px-4 py-3 text-sm">
            <div className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Funding goal</div>
            <div className="mt-1 font-semibold text-foreground">{formatCurrency(fundingGoal)}</div>
          </div>

          <div className="flex flex-wrap gap-2 lg:justify-end">
            <Button
              onClick={handleApprove}
              disabled={isLoading}
              size="sm"
              className="gap-1.5 rounded-full px-4"
              variant="default"
            >
              <CheckCircle className="size-4" />
              <span>Approve</span>
            </Button>
            <Button
              onClick={handleReject}
              disabled={isLoading}
              size="sm"
              className="gap-1.5 rounded-full px-4"
              variant="outline"
            >
              <XCircle className="size-4" />
              <span>Reject</span>
            </Button>
          </div>
        </div>
      </div>
    </Card>
  )
}
