"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { Calendar, ClipboardList, Edit2, FileText, Filter, LayoutGrid, Plus, Search, X } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { StatusBadge } from "@/components/status-badge"
import { FundingProgress } from "@/components/funding-progress"
import { formatCurrency } from "@/lib/roles"

type ProjectStatus = "pending" | "approved" | "rejected" | "funding" | "started" | "completed"

type OwnerProjectsClientProps = {
  projects: any[]
}

export default function OwnerProjectsClient({ projects }: OwnerProjectsClientProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedStatuses, setSelectedStatuses] = useState<ProjectStatus[]>([])
  const [expandedFilters, setExpandedFilters] = useState(false)

  const statusOptions: { value: ProjectStatus; label: string; icon: string }[] = [
    { value: "pending", label: "Pending review", icon: "⏳" },
    { value: "approved", label: "Approved", icon: "✓" },
    { value: "rejected", label: "Rejected", icon: "✕" },
    { value: "funding", label: "Fundraising", icon: "💰" },
    { value: "started", label: "Active", icon: "▶" },
    { value: "completed", label: "Completed", icon: "✔" },
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
    setSelectedStatuses((prev) => (prev.includes(status) ? prev.filter((item) => item !== status) : [...prev, status]))
  }

  const handleClearFilters = () => {
    setSearchTerm("")
    setSelectedStatuses([])
  }

  const totalProjects = projects.length
  const totalRaised = projects.reduce((sum, project) => sum + Number(project.fundedAmount || 0), 0)
  const totalEscrow = projects.reduce((sum, project) => sum + Number(project.escrowBalance || 0), 0)

  const creatorMetrics = [
    { label: "Total projects", value: totalProjects, icon: LayoutGrid },
    { label: "Total raised", value: formatCurrency(totalRaised), icon: LayoutGrid },
    { label: "Escrow balance", value: formatCurrency(totalEscrow), icon: LayoutGrid },
  ]

  const projectStats = statusOptions.map((status) => ({
    ...status,
    count: projects.filter((project) => project.status === status.value).length,
  }))

  return (
    <div className="flex min-h-svh flex-col bg-background">
      <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:py-12">
        <div className="mb-6 flex flex-col gap-4 rounded-2xl border border-border/70 bg-card/80 p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:p-5">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">Project proposer dashboard</h1>
            <p className="mt-2 max-w-2xl text-sm text-muted-foreground sm:text-base">
              Track your proposals in one place and open any project when you need more detail.
            </p>
          </div>
          <a
            href="/dashboard/projects/new"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4.5 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm transition-all hover:scale-[1.01] hover:shadow-md"
          >
            <Plus className="size-4.5" />
            <span>Create new proposal</span>
          </a>
        </div>

        <div className="mb-8 grid gap-3 grid-cols-1 sm:grid-cols-3">
          {creatorMetrics.map((metric) => {
            const Icon = metric.icon
            return (
              <Card key={metric.label} className="flex flex-col justify-between border border-border/70 bg-card p-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold uppercase tracking-[0.24em] text-muted-foreground">{metric.label}</span>
                  <div className="rounded-xl bg-primary/10 p-2 text-primary">
                    <Icon className="size-4.5" />
                  </div>
                </div>
                <div className="mt-3">
                  <p className="text-lg font-semibold tracking-tight text-foreground">{metric.value}</p>
                </div>
              </Card>
            )
          })}
        </div>

        {projects.length > 0 ? (
          <>
            <div className="mb-8 flex flex-col gap-4">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 size-5 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search your proposals..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full rounded-xl border border-border bg-card pl-12 pr-4 py-3 text-sm placeholder-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all duration-200 shadow-sm"
                />
              </div>

              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setExpandedFilters(!expandedFilters)}
                  className="flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-2.5 text-sm font-medium hover:bg-muted transition shadow-sm duration-200"
                >
                  <Filter className="size-4 text-muted-foreground" />
                  <span>Filters</span>
                  {selectedStatuses.length > 0 && <Badge variant="secondary">{selectedStatuses.length}</Badge>}
                </button>

                {(searchTerm || selectedStatuses.length > 0) && (
                  <button
                    type="button"
                    onClick={handleClearFilters}
                    className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition duration-200"
                  >
                    <X className="size-4" />
                    Clear
                  </button>
                )}
              </div>

              {expandedFilters && (
                <Card className="p-5 border border-border/80 bg-card shadow-sm">
                  <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 lg:grid-cols-6">
                    {projectStats.map((status) => (
                      <button
                        key={status.value}
                        type="button"
                        onClick={() => toggleStatus(status.value)}
                        disabled={status.count === 0}
                        className={`rounded-xl border p-4 text-left transition-all duration-200 ${
                          status.count === 0 ? "cursor-not-allowed opacity-40" : "hover:scale-102 hover:shadow-sm"
                        } ${
                          selectedStatuses.includes(status.value)
                            ? "border-primary bg-primary/5 text-primary ring-1 ring-primary/25"
                            : "border-border/80 bg-card hover:border-primary/20 hover:bg-secondary/40"
                        }`}
                      >
                        <p className="text-xl mb-1.5">{status.icon}</p>
                        <p className="text-xs font-bold text-foreground truncate">{status.label}</p>
                        <p className="mt-1 text-[10px] font-bold text-muted-foreground">{status.count} projects</p>
                      </button>
                    ))}
                  </div>
                </Card>
              )}

              <div className="flex items-center justify-between text-sm pt-2 px-1">
                <p className="text-xs text-muted-foreground font-semibold">
                  Showing <span className="text-foreground font-bold">{filteredProjects.length}</span> of <span className="text-foreground font-bold">{projects.length}</span> projects
                </p>

                {selectedStatuses.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {selectedStatuses.map((status) => {
                      const statusInfo = statusOptions.find((item) => item.value === status)
                      return (
                        <Badge key={status} variant="outline" className="text-[10px] bg-secondary/40 border-border/60 uppercase font-black tracking-wide">
                          {statusInfo?.label || status}
                        </Badge>
                      )
                    })}
                  </div>
                )}
              </div>
            </div>

            <div className="grid gap-5">
              {filteredProjects.map((project) => {
                const progress = project.fundingGoal > 0
                  ? Math.min(100, Math.round((Number(project.fundedAmount || 0) / Number(project.fundingGoal || 1)) * 100))
                  : 0

                return (
                  <Card key={project.id} className="overflow-hidden rounded-2xl border border-border/70 bg-card p-0 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg">
                    <div className="p-5 sm:p-6">
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                        <div className="min-w-0 space-y-2">
                          <div className="flex flex-wrap items-center gap-2">
                            <StatusBadge status={project.status} />
                            <span className="inline-flex items-center gap-1 rounded-full bg-secondary/60 px-2.5 py-1 text-[11px] font-medium text-muted-foreground">
                              <Calendar className="size-3" />
                              {new Date(project.createdAt).toLocaleDateString()}
                            </span>
                          </div>

                          <Link href={`/dashboard/projects/${project.id}`} className="block">
                            <h2 className="truncate text-lg font-semibold tracking-tight text-foreground transition-colors hover:text-primary sm:text-xl">
                              {project.title}
                            </h2>
                          </Link>
                          <p className="line-clamp-2 max-w-2xl text-sm leading-6 text-muted-foreground">{project.summary}</p>
                        </div>

                        <div className="rounded-2xl bg-muted/40 px-4 py-3 sm:text-right">
                          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">Funding progress</p>
                          <p className="mt-1 text-sm font-semibold text-foreground">{progress}% funded</p>
                        </div>
                      </div>

                      <div className="mt-4 space-y-3 border-t border-border pt-4">
                        <FundingProgress funded={project.fundedAmount} goal={project.fundingGoal} />
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Raised</span>
                          <span className="font-semibold text-foreground">{formatCurrency(project.fundedAmount || 0)}</span>
                        </div>

                        <div className="flex flex-wrap gap-2 pt-1">
                          <Link
                            href={`/dashboard/projects/${project.id}`}
                            className="inline-flex items-center gap-2 rounded-xl border border-border bg-background px-3.5 py-2 text-xs font-semibold text-foreground transition hover:bg-muted"
                          >
                            <FileText className="size-3.5" />
                            <span>View project</span>
                          </Link>
                          <Link
                            href={`/dashboard/projects/${project.id}/milestones`}
                            className="inline-flex items-center gap-2 rounded-xl border border-border bg-background px-3.5 py-2 text-xs font-semibold text-foreground transition hover:bg-muted"
                          >
                            <ClipboardList className="size-3.5" />
                            <span>Manage milestones</span>
                          </Link>
                          <Link
                            href={`/dashboard/projects/${project.id}/edit`}
                            className="inline-flex items-center gap-2 rounded-xl bg-primary px-3.5 py-2 text-xs font-semibold text-primary-foreground transition hover:bg-primary/95"
                          >
                            <Edit2 className="size-3.5" />
                            <span>Edit project</span>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </Card>
                )
              })}
            </div>
          </>
        ) : (
          <Card className="mx-auto mt-8 max-w-xl border border-border bg-card p-12 text-center shadow-sm">
            <FileText className="mx-auto mb-4 size-12 text-primary" />
            <p className="mb-2 text-lg font-bold text-foreground">No project proposals submitted</p>
            <p className="mb-6 text-sm leading-relaxed text-muted-foreground">
              Start by building your first proposal with a clear title, summary, and milestone plan.
            </p>
            <a
              href="/dashboard/projects/new"
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground shadow-md shadow-primary/10 transition-all hover:scale-[1.02] active:scale-95"
            >
              <Plus className="size-4.5" />
              <span>Create project proposal</span>
            </a>
          </Card>
        )}
      </main>
    </div>
  )
}
