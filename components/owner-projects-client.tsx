'use client'

import React, { useMemo, useState } from "react"
import Link from "next/link"

import { FileText, Plus, Search, Filter, X, PiggyBank, Landmark, CheckCircle2, LayoutGrid, Calendar, ArrowRight } from "lucide-react"
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
    { value: "approved", label: "Approved", color: "bg-blue-100 dark:bg-blue-900/30", icon: "✓" },
    { value: "rejected", label: "Rejected", color: "bg-red-100 dark:bg-red-900/30", icon: "✕" },
    { value: "funding", label: "Fundraising", color: "bg-emerald-100 dark:bg-emerald-900/30", icon: "💰" },
    { value: "started", label: "Active", color: "bg-purple-100 dark:bg-purple-900/30", icon: "▶" },
    { value: "completed", label: "Completed", color: "bg-slate-100 dark:bg-slate-900/30", icon: "✔" },
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

  // Calculate Creator Stats
  const totalProjects = projects.length
  const totalRaised = projects.reduce((sum, p) => sum + Number(p.fundedAmount || 0), 0)
  const totalEscrow = projects.reduce((sum, p) => sum + Number(p.escrowBalance || 0), 0)
  const totalMilestones = projects.reduce((sum, p) => sum + (p.milestones?.length || 0), 0)
  const verifiedMilestones = projects.reduce((sum, p) => {
    const completed = p.milestones?.filter((m: any) => ["approved", "released"].includes(m.status)).length || 0
    return sum + completed
  }, 0)

  const creatorMetrics = [
    { label: "Total Projects", value: totalProjects, icon: LayoutGrid, desc: "Proposed proposals", color: "text-blue-500 bg-blue-500/10" },
    { label: "Total Funds Raised", value: formatCurrency(totalRaised), icon: PiggyBank, desc: "Across all submissions", color: "text-emerald-500 bg-emerald-500/10" },
    { label: "Active Escrow Balance", value: formatCurrency(totalEscrow), icon: Landmark, desc: "Funds locked in contracts", color: "text-indigo-500 bg-indigo-500/10" },
    { label: "Verified Milestones", value: `${verifiedMilestones}/${totalMilestones}`, icon: CheckCircle2, desc: "Milestones approved", color: "text-purple-500 bg-purple-500/10" },
  ]

  const projectStats = statusOptions.map((stat) => ({
    ...stat,
    count: projects.filter((p) => p.status === stat.value).length,
  }))

  return (
    <div className="flex min-h-svh flex-col bg-background">
      <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:py-12">
        
        <div className="mb-6 flex flex-col gap-4 rounded-2xl border border-border/70 bg-card/80 p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:p-5">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">Project proposer dashboard</h1>
            <p className="mt-2 max-w-2xl text-sm text-muted-foreground sm:text-base">
              Track proposals, review milestone progress, and keep your fundraising activity organized in one place.
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

        <div className="mb-8 grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {creatorMetrics.map((metric) => {
            const Icon = metric.icon
            return (
              <Card key={metric.label} className="flex flex-col justify-between border border-border/70 bg-card p-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold uppercase tracking-[0.24em] text-muted-foreground">{metric.label}</span>
                  <div className={`rounded-xl p-2 ${metric.color}`}>
                    <Icon className="size-4.5" />
                  </div>
                </div>
                <div className="mt-3">
                  <p className="text-xl font-semibold tracking-tight text-foreground">{metric.value}</p>
                  <p className="mt-1 text-[11px] font-medium text-muted-foreground">{metric.desc}</p>
                </div>
              </Card>
            )
          })}
        </div>

        {projects.length > 0 ? (
          <>
            {/* Filters and Search */}
            <div className="mb-8 flex flex-col gap-4">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 size-5 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search your proposals by name or description..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full rounded-xl border border-border bg-card pl-12 pr-4 py-3.5 text-sm placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 shadow-sm"
                />
              </div>

              <div className="flex items-center justify-between">
                <button
                  onClick={() => setExpandedFilters(!expandedFilters)}
                  className="flex items-center gap-2 rounded-xl border border-border bg-card px-5 py-2.5 text-sm font-bold hover:bg-secondary transition shadow-sm hover:scale-102 active:scale-98 duration-200"
                >
                  <Filter className="size-4 text-muted-foreground" />
                  <span>Filter Status</span>
                  {selectedStatuses.length > 0 && <Badge variant="secondary" className="ml-1">{selectedStatuses.length}</Badge>}
                </button>

                {(searchTerm || selectedStatuses.length > 0) && (
                  <button
                    onClick={handleClearFilters}
                    className="flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-foreground transition duration-200"
                  >
                    <X className="size-4" />
                    <span>Clear filters</span>
                  </button>
                )}
              </div>

              {expandedFilters && (
                <Card className="p-5 border border-border/80 bg-card shadow-sm animate-fade-in">
                  <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 lg:grid-cols-6">
                    {statusOptions.map((status) => {
                      const count = projectStats.find((s) => s.value === status.value)?.count || 0
                      return (
                        <button
                          key={status.value}
                          onClick={() => toggleStatus(status.value)}
                          disabled={count === 0}
                          className={`rounded-xl border p-4 text-left transition-all duration-200 ${
                            count === 0 ? "opacity-40 cursor-not-allowed" : "hover:scale-102 hover:shadow-sm"
                          } ${
                            selectedStatuses.includes(status.value)
                              ? "border-primary bg-primary/5 text-primary ring-1 ring-primary/25"
                              : "border-border/80 bg-card hover:border-primary/20 hover:bg-secondary/40"
                          }`}
                        >
                          <p className="text-xl mb-1.5">{status.icon}</p>
                          <p className="text-xs font-bold text-foreground truncate">{status.label}</p>
                          <p className="text-[10px] text-muted-foreground mt-1 font-bold">{count} projects</p>
                        </button>
                      )
                    })}
                  </div>
                </Card>
              )}

              <div className="flex items-center justify-between text-sm pt-2 px-1">
                <p className="text-xs text-muted-foreground font-semibold">
                  Showing <span className="text-foreground font-bold">{filteredProjects.length}</span> of{' '}
                  <span className="text-foreground font-bold">{projects.length}</span> projects
                </p>

                {selectedStatuses.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {selectedStatuses.map((status) => {
                      const statusInfo = statusOptions.find((s) => s.value === status)
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

            {/* Projects Grid */}
            <div className="grid gap-6">
              {filteredProjects.map((project) => {
                const milestones = project.milestones || []
                const completed = milestones.filter((m: any) => ["approved", "released"].includes(m.status)).length
                const total = milestones.length
                const progress = project.fundingGoal > 0
                  ? Math.min(100, Math.round((Number(project.fundedAmount || 0) / Number(project.fundingGoal || 1)) * 100))
                  : 0

                return (
                  <Link key={project.id} href={`/dashboard/projects/${project.id}/owner`} className="block">
                    <Card className="group overflow-hidden rounded-[1.75rem] border border-border/70 bg-card p-0 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl">
                      <div className="h-1.5 bg-gradient-to-r from-primary via-emerald-500 to-cyan-500" />

                      <div className="p-5 sm:p-6">
                        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                          <div className="min-w-0 space-y-3">
                            <div className="flex flex-wrap items-center gap-2.5">
                              <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.22em] text-primary">
                                {project.category}
                              </span>
                              <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary/50 px-3 py-1 text-[11px] font-semibold text-muted-foreground">
                                <Calendar className="size-3" />
                                {new Date(project.createdAt).toLocaleDateString()}
                              </span>
                            </div>

                            <div className="space-y-1.5">
                              <span className="block truncate text-xl font-bold tracking-tight text-foreground sm:text-2xl">
                                {project.title}
                              </span>
                              <p className="max-w-2xl text-sm leading-6 text-muted-foreground line-clamp-2">
                                {project.summary}
                              </p>
                            </div>
                          </div>

                          <div className="flex flex-col items-start gap-3 lg:items-end">
                            <StatusBadge status={project.status} />
                            <div className="rounded-2xl bg-muted/40 px-4 py-3 text-right">
                              <div className="text-[11px] font-bold uppercase tracking-[0.18em] text-muted-foreground">
                                Funding progress
                              </div>
                              <div className="mt-1 text-sm font-semibold text-foreground">
                                {progress}% funded
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="mt-5 space-y-3 rounded-3xl bg-secondary/20 p-4">
                          <div className="flex items-center justify-between text-xs font-bold text-foreground">
                            <span>Milestone pipeline</span>
                            <span className="text-[11px] text-muted-foreground font-semibold">
                              {completed} of {total} verified
                            </span>
                          </div>

                          <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1">
                            {milestones.map((m: any, idx: number) => {
                              const isReleased = ["approved", "released"].includes(m.status)
                              const isUnderReview = m.status === "pending" && m.submittedAt !== null
                              const isUnlocked = m.status === "pending" && m.submittedAt === null && (idx === 0 || milestones.slice(0, idx).every((p: any) => p.submittedAt !== null))
                              let nodeClass = "bg-background text-muted-foreground ring-1 ring-border/70"
                              let statusText = "Locked"
                              if (isReleased) {
                                nodeClass = "bg-emerald-500 text-white shadow-sm shadow-emerald-500/20"
                                statusText = "Verified & Released"
                              } else if (isUnderReview) {
                                nodeClass = "bg-amber-500 text-white shadow-sm shadow-amber-500/20 animate-pulse"
                                statusText = "Under Review"
                              } else if (isUnlocked) {
                                nodeClass = "bg-primary/10 text-primary ring-1 ring-primary/30 font-bold"
                                statusText = "Unlocked"
                              }

                              return (
                                <React.Fragment key={m.id}>
                                  <div className="flex min-w-[92px] flex-col items-center gap-2 rounded-2xl bg-card px-3 py-3 text-center shadow-sm ring-1 ring-border/60">
                                    <div className={`flex size-9 items-center justify-center rounded-full text-xs font-bold ${nodeClass}`} title={`${m.title} - ${statusText}`}>
                                      {idx + 1}
                                    </div>
                                    <span className="max-w-[86px] truncate text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground" title={m.title}>
                                      {m.title}
                                    </span>
                                  </div>
                                  {idx < total - 1 && (
                                    <div className={`h-0.5 min-w-[16px] flex-1 ${isReleased ? "bg-emerald-500" : "bg-border"}`} />
                                  )}
                                </React.Fragment>
                              )
                            })}
                          </div>
                        </div>

                        <div className="mt-5 grid gap-3 grid-cols-2 sm:grid-cols-4 text-xs">
                          <div className="rounded-2xl bg-secondary/40 p-4 shadow-sm">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block">Funded Goal</span>
                            <span className="mt-1 block text-base font-extrabold text-foreground">{formatCurrency(project.fundingGoal)}</span>
                          </div>
                          <div className="rounded-2xl bg-secondary/40 p-4 shadow-sm">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block">Total Raised</span>
                            <span className="mt-1 block text-base font-extrabold text-foreground">{formatCurrency(project.fundedAmount)}</span>
                          </div>
                          <div className="rounded-2xl bg-primary/5 p-4 shadow-sm ring-1 ring-primary/10">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-primary/70 block">Escrow Balance</span>
                            <span className="mt-1 block text-base font-black text-primary">{formatCurrency(project.escrowBalance)}</span>
                          </div>
                          <div className="rounded-2xl bg-secondary/40 p-4 shadow-sm">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block">Released Payouts</span>
                            <span className="mt-1 block text-base font-extrabold text-foreground">{formatCurrency(project.releasedAmount)}</span>
                          </div>
                        </div>

                        <div className="mt-5 flex flex-col gap-3 border-t border-border/60 pt-4 sm:flex-row sm:items-center sm:justify-between">
                          <a href={`/dashboard/projects/${project.id}/owner`} className="inline-flex items-center justify-center gap-2 rounded-full border border-border bg-card px-4 py-2.5 text-xs font-bold text-foreground transition-all hover:-translate-y-0.5 hover:bg-secondary hover:shadow-md">
                            Manage Escrow Milestones
                          </a>

                          <a href={`/dashboard/projects/${project.id}/owner`} className="inline-flex items-center gap-1.5 text-xs font-bold text-primary transition-transform hover:translate-x-0.5">
                            <span>Milestone operations</span>
                            <ArrowRight className="size-3.5" />
                          </a>
                        </div>
                      </div>
                    </Card>
                  </Link>
                )
              })}
            </div>
          </>
        ) : (
          <Card className="p-12 text-center border border-border bg-card shadow-sm max-w-xl mx-auto mt-8">
            <FileText className="size-12 text-primary mx-auto mb-4" />
            <p className="text-lg font-bold text-foreground mb-2">
              No project proposals submitted
            </p>
            <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
              Start by building your first structured funding request. Define milestones to demonstrate accountability and raise backing funds.
            </p>
            <a
              href="/dashboard/projects/new"
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground shadow-md shadow-primary/10 hover:shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all"
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
