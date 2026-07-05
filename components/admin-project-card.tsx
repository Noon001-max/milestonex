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
      <div className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-4">
          {imageUrl ? (
            <img src={imageUrl} alt={title} className="h-16 w-24 rounded-md object-cover" />
          ) : (
            <div className="h-16 w-24 rounded-md bg-secondary/30 flex items-center justify-center text-xs text-muted-foreground">No image</div>
          )}

          <div className="min-w-0">
            <div className="mb-2 flex items-center gap-2">
              <StatusBadge status={status} />
              <span className="text-xs text-muted-foreground">Project review</span>
            </div>
            <Link
              href={`/dashboard/admin/projects/${id}`}
              className="text-base font-semibold text-foreground block truncate transition hover:text-primary"
            >
              {title}
            </Link>
            {proposerName ? (
              <div className="mt-1 text-sm text-muted-foreground">Proposed by <span className="font-medium text-foreground">{proposerName}</span></div>
            ) : null}
            <p className="mt-1 text-sm leading-5 text-muted-foreground line-clamp-2 max-w-xl">
              {summary}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-sm text-muted-foreground mr-2">Goal: <span className="font-semibold text-foreground">{formatCurrency(fundingGoal)}</span></div>
          <div className="flex flex-wrap gap-2">
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
      </div>
    </Card>
  )
}
