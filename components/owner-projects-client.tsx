'use client'

import React, { useMemo, useState } from "react"
import { FileText, Plus, Search, Filter, X } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { StatusBadge } from "@/components/status-badge"
import { formatCurrency } from "@/lib/roles"

type ProjectStatus = "pending" | "approved" | "rejected" | "funding" | "started" | "completed"

type OwnerProjectsClientProps = {
  projects: any[]
}

export default function OwnerProjectsClient({ projects }: OwnerProjectsClientProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedStatuses, setSelectedStatuses] = useState<ProjectStatus[]>([])
  const [expandedFilters, setExpandedFilters] = useState(false)

  const statusOptions: { value: ProjectStatus; label: string; color: string; icon: string }[] = [
    { value: "pending", label: "Pending review", color: "bg-yellow-100 dark:bg-yellow-900/30", icon: "⏳" },
    { value: "approved", label: "Approved", color: "bg-green-100 dark:bg-green-900/30", icon: "✓" },
    { value: "rejected", label: "Rejected", color: "bg-red-100 dark:bg-red-900/30", icon: "✕" },
    { value: "funding", label: "Fundraising", color: "bg-blue-100 dark:bg-blue-900/30", icon: "💰" },
    { value: "started", label: "Active", color: "bg-purple-100 dark:bg-purple-900/30", icon: "▶" },
    { value: "completed", label: "Completed", color: "bg-emerald-100 dark:bg-emerald-900/30", icon: "✔" },
  ]

  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      const matchesSearch =
        project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.summary?.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesStatus = selectedStatuses.length === 0 || selectedStatuses.includes(project.status)
      return matchesSearch && matchesStatus
    })
  }, [projects, searchTerm, selectedStatuses])

  const toggleStatus = (status: ProjectStatus) => {
    setSelectedStatuses((prev) =>
      prev.includes(status) ? prev.filter((s) => s !== status) : [...prev, status]
    )
  }

  const handleClearFilters = () => {
    setSearchTerm("")
    setSelectedStatuses([])
  }

  const projectStats = statusOptions.map((stat) => ({
    ...stat,
    count: projects.filter((p) => p.status === stat.value).length,
  }))

  return (
    <div className="flex min-h-svh flex-col bg-background">
      <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:py-12">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold tracking-tight text-foreground">My projects</h1>
            <p className="mt-2 text-muted-foreground">
              Submit new projects and track milestone progress
            </p>
          </div>
          <a
            href="/dashboard/projects/new"
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition"
          >
            <Plus className="size-4" />
            New project
          </a>
        </div>

        {projects.length > 0 ? (
          <>
            <div className="mb-6 flex flex-col gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 size-5 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search your projects by name or description..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full rounded-lg border border-border bg-background pl-10 pr-4 py-2.5 text-sm placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div className="flex items-center justify-between">
                <button
                  onClick={() => setExpandedFilters(!expandedFilters)}
                  className="flex items-center gap-2 rounded-lg border border-border bg-background px-4 py-2 text-sm font-medium hover:bg-muted transition"
                >
                  <Filter className="size-4" />
                  Filters {selectedStatuses.length > 0 && <Badge variant="secondary">{selectedStatuses.length}</Badge>}
                </button>

                {(searchTerm || selectedStatuses.length > 0) && (
                  <button
                    onClick={handleClearFilters}
                    className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition"
                  >
                    <X className="size-4" />
                    Clear filters
                  </button>
                )}
              </div>

              {expandedFilters && (
                <Card className="p-4">
                  <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                    {statusOptions.map((status) => {
                      const count = projectStats.find((s) => s.value === status.value)?.count || 0
                      return count > 0 ? (
                        <button
                          key={status.value}
                          onClick={() => toggleStatus(status.value)}
                          className={`rounded-lg border-2 p-3 text-left transition ${
                            selectedStatuses.includes(status.value)
                              ? "border-primary bg-primary/10"
                              : "border-border bg-background hover:border-muted-foreground/50"
                          }`}
                        >
                          <p className="text-xl mb-1">{status.icon}</p>
                          <p className="text-sm font-medium text-foreground">{status.label}</p>
                          <p className="text-xs text-muted-foreground mt-1">{count} projects</p>
                        </button>
                      ) : null
                    })}
                  </div>
                </Card>
              )}

              <div className="flex items-center justify-between text-sm">
                <p className="text-muted-foreground">
                  Showing <span className="font-semibold text-foreground">{filteredProjects.length}</span> of{' '}
                  <span className="font-semibold text-foreground">{projects.length}</span> projects
                </p>

                {selectedStatuses.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {selectedStatuses.map((status) => {
                      const statusInfo = statusOptions.find((s) => s.value === status)
                      return (
                        <Badge key={status} variant="outline" className="text-xs">
                          {statusInfo?.label || status}
                        </Badge>
                      )
                    })}
                  </div>
                )}
              </div>
            </div>

            <div className="grid gap-6">
              {filteredProjects.map((project) => {
                const milestones = project.milestones || []
                const completed = milestones.filter((m: any) =>
                  ["approved", "released"].includes(m.status),
                ).length
                const total = milestones.length
                return (
                  <Card key={project.id} className="p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <a
                          href={`/projects/${project.id}`}
                          className="text-lg font-semibold text-foreground hover:text-primary transition"
                        >
                          {project.title}
                        </a>
                        <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                          {project.summary}
                        </p>
                      </div>
                      <StatusBadge status={project.status} />
                    </div>
                    <div className="mt-4 grid gap-3 sm:grid-cols-4 text-sm">
                      <div className="rounded-lg bg-muted p-3">
                        <span className="text-xs text-muted-foreground block">Raised</span>
                        <span className="text-lg font-semibold text-foreground">
                          {formatCurrency(project.fundedAmount)}
                        </span>
                      </div>
                      <div className="rounded-lg bg-primary/5 p-3">
                        <span className="text-xs text-muted-foreground block">In Escrow</span>
                        <span className="text-lg font-semibold text-primary">
                          {formatCurrency(project.escrowBalance)}
                        </span>
                      </div>
                      <div className="rounded-lg bg-muted p-3">
                        <span className="text-xs text-muted-foreground block">Goal</span>
                        <span className="text-lg font-semibold text-foreground">
                          {formatCurrency(project.fundingGoal)}
                        </span>
                      </div>
                      <div className="rounded-lg bg-muted p-3">
                        <span className="text-xs text-muted-foreground block">Milestones</span>
                        <span className="text-lg font-semibold text-foreground">
                          {completed}/{total} verified
                        </span>
                      </div>
                    </div>
                    <div className="mt-4 flex gap-2">
                      <a
                        href={`/dashboard/projects/${project.id}`}
                        className="inline-flex items-center justify-center rounded-lg border border-border bg-background px-4 py-2 text-sm font-medium hover:bg-muted transition"
                      >
                        Manage milestones
                      </a>
                    </div>
                  </Card>
                )
              })}
            </div>
          </>
        ) : (
          <Card className="p-12 text-center">
            <FileText className="size-12 text-primary mx-auto mb-4" />
            <p className="text-lg font-medium text-foreground mb-2">
              You haven't submitted any projects yet
            </p>
            <p className="text-muted-foreground mb-6">
              Start by creating and submitting your first project for community funding
            </p>
            <a
              href="/dashboard/projects/new"
              className="inline-block rounded-lg bg-primary px-6 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition"
            >
              Submit your first project
            </a>
          </Card>
        )}
      </main>
    </div>
  )
}
