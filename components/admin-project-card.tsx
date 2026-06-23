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
    <Card className="p-4">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <Link
            href={`/dashboard/projects/${id}`}
            className="font-medium text-foreground hover:underline"
          >
            {title}
          </Link>
          <p className="text-sm text-muted-foreground line-clamp-1 mt-1">
            {summary}
          </p>
          <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
            <span>Goal: {formatCurrency(fundingGoal)}</span>
            <StatusBadge status={status} />
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={handleApprove}
            disabled={isLoading}
            size="sm"
            className="gap-1"
            variant="default"
          >
            <CheckCircle className="size-4" />
            <span className="hidden sm:inline">Approve</span>
          </Button>
          <Button
            onClick={handleReject}
            disabled={isLoading}
            size="sm"
            className="gap-1"
            variant="outline"
          >
            <XCircle className="size-4" />
            <span className="hidden sm:inline">Reject</span>
          </Button>
        </div>
      </div>
    </Card>
  )
}
