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
}

export function AdminProjectCard({
  id,
  title,
  summary,
  fundingGoal,
  status,
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
    <Card className="overflow-hidden border border-border/70 bg-card p-0 shadow-sm transition-all duration-200 hover:shadow-md">
      <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex-1">
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <StatusBadge status={status} />
            <span className="rounded-full border border-border bg-background px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
              Project review
            </span>
          </div>
          <Link
            href={`/dashboard/projects/${id}`}
            className="text-base font-semibold text-foreground transition hover:text-primary"
          >
            {title}
          </Link>
          <p className="mt-2 text-sm leading-6 text-muted-foreground line-clamp-2">
            {summary}
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            <span className="rounded-full bg-muted/70 px-2.5 py-1">Goal: {formatCurrency(fundingGoal)}</span>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 sm:flex-col">
          <Button
            onClick={handleApprove}
            disabled={isLoading}
            size="sm"
            className="gap-1"
            variant="default"
          >
            <CheckCircle className="size-4" />
            <span>Approve</span>
          </Button>
          <Button
            onClick={handleReject}
            disabled={isLoading}
            size="sm"
            className="gap-1"
            variant="outline"
          >
            <XCircle className="size-4" />
            <span>Reject</span>
          </Button>
        </div>
      </div>
    </Card>
  )
}
