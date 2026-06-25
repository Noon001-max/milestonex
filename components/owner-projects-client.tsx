'use client'

import React, { useMemo, useState } from "react"
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
        
        {/* Title Header */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight text-foreground">Creator Center</h1>
            <p className="mt-2 text-muted-foreground">
              Submit new funding proposals, track escrow payouts, and manage milestone progression.
            </p>
          </div>
          <a
            href="/dashboard/projects/new"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground shadow-md shadow-primary/10 hover:shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all self-start sm:self-center"
          >
            <Plus className="size-4.5" />
            <span>New proposal</span>
          </a>
        </div>

        {/* Creator Control Panel Metrics */}
        <div className="mb-10 grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {creatorMetrics.map((metric) => {
            const Icon = metric.icon
            return (
              <Card key={metric.label} className="p-5 border border-border/80 bg-card shadow-sm flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">{metric.label}</span>
                  <div className={`p-2 rounded-xl ${metric.color}`}>
                    <Icon className="size-4.5" />
                  </div>
                </div>
                <div className="mt-4">
                  <p className="text-2xl font-black text-foreground tracking-tight">{metric.value}</p>
                  <p className="text-[10px] text-muted-foreground mt-1 font-semibold">{metric.desc}</p>
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
                const completed = milestones.filter((m: any) =>
                  ["approved", "released"].includes(m.status),
                ).length
                const total = milestones.length

                return (
                  <Card key={project.id} className="p-6 border border-border/80 bg-card hover:shadow-md transition-all duration-300 flex flex-col justify-between">
                    
                    {/* Project Header Info */}
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                      <div className="space-y-1.5 min-w-0">
                        <div className="flex items-center gap-2.5">
                          <span className="text-[11px] font-bold text-primary uppercase tracking-widest">{project.category}</span>
                          <span className="text-xs text-muted-foreground">•</span>
                          <span className="text-xs text-muted-foreground font-semibold inline-flex items-center gap-1">
                            <Calendar className="size-3" />
                            {new Date(project.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <a
                          href={`/projects/${project.id}`}
                          className="text-xl font-bold text-foreground hover:text-primary transition-colors duration-200 block truncate"
                        >
                          {project.title}
                        </a>
                        <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                          {project.summary}
                        </p>
                      </div>
                      <div className="flex-shrink-0 self-start">
                        <StatusBadge status={project.status} />
                      </div>
                    </div>

                    {/* Milestone Progress Timeline Node Track */}
                    {total > 0 && (
                      <div className="my-6 border-t border-b border-border/50 py-4.5 space-y-3">
                        <div className="flex items-center justify-between text-xs font-bold text-foreground px-1">
                          <span>Milestone Pipeline</span>
                          <span className="text-[11px] text-muted-foreground font-semibold">{completed} of {total} verified</span>
                        </div>

                        <div className="flex items-center w-full px-4 pt-2 pb-1.5 overflow-x-auto gap-1">
                          {milestones.map((m: any, idx: number) => {
                            const isReleased = ["approved", "released"].includes(m.status)
                            const isUnderReview = m.status === "pending" && m.submittedAt !== null
                            const isUnlocked = m.status === "pending" && m.submittedAt === null && (idx === 0 || milestones.slice(0, idx).every((p: any) => p.submittedAt !== null))
                            
                            let nodeColor = "bg-secondary text-muted-foreground border-border/80"
                            let statusText = "Locked"
                            if (isReleased) {
                              nodeColor = "bg-emerald-500 text-white border-emerald-500 shadow-sm shadow-emerald-500/20"
                              statusText = "Verified & Released"
                            } else if (isUnderReview) {
                              nodeColor = "bg-amber-500 text-white border-amber-500 animate-pulse shadow-sm shadow-amber-500/20"
                              statusText = "Under Review"
                            } else if (isUnlocked) {
                              nodeColor = "bg-primary/10 border-primary text-primary font-bold border-2"
                              statusText = "Unlocked"
                            }

                            return (
                              <React.Fragment key={m.id}>
                                <div className="flex flex-col items-center flex-1 min-w-[70px] relative group">
                                  <div className={`size-8 rounded-full border flex items-center justify-center text-xs font-bold transition-all ${nodeColor}`} title={`${m.title} - ${statusText}`}>
                                    {idx + 1}
                                  </div>
                                  <span className="text-[9px] font-bold text-muted-foreground truncate max-w-[80px] mt-1.5" title={m.title}>
                                    {m.title}
                                  </span>
                                  {/* Tooltip */}
                                  <div className="absolute bottom-full mb-2 hidden group-hover:block bg-slate-900 text-white text-[10px] rounded p-2 z-10 w-44 shadow-lg text-center font-medium border border-slate-800">
                                    <p className="font-bold text-white truncate">{m.title}</p>
                                    <p className="text-slate-400 mt-0.5">{statusText} ({formatCurrency(m.amount)})</p>
                                  </div>
                                </div>
                                {idx < total - 1 && (
                                  <div className={`h-0.5 flex-1 min-w-[15px] -mt-5 ${
                                    isReleased ? "bg-emerald-500" : "bg-border"
                                  }`} />
                                )}
                              </React.Fragment>
                            )
                          })}
                        </div>
                      </div>
                    )}

                    {/* Financial Metrics Cards */}
                    <div className="grid gap-3 grid-cols-2 sm:grid-cols-4 text-xs">
                      <div className="rounded-xl bg-secondary/40 p-3.5 border border-border/40">
                        <span className="text-[10px] text-muted-foreground font-bold block uppercase tracking-wider">Funded Goal</span>
                        <span className="text-base font-extrabold text-foreground mt-1 block">
                          {formatCurrency(project.fundingGoal)}
                        </span>
                      </div>
                      <div className="rounded-xl bg-secondary/40 p-3.5 border border-border/40">
                        <span className="text-[10px] text-muted-foreground font-bold block uppercase tracking-wider">Total Raised</span>
                        <span className="text-base font-extrabold text-foreground mt-1 block">
                          {formatCurrency(project.fundedAmount)}
                        </span>
                      </div>
                      <div className="rounded-xl bg-primary/5 p-3.5 border border-primary/20">
                        <span className="text-[10px] text-primary/70 font-bold block uppercase tracking-wider">Escrow Balance</span>
                        <span className="text-base font-black text-primary mt-1 block">
                          {formatCurrency(project.escrowBalance)}
                        </span>
                      </div>
                      <div className="rounded-xl bg-secondary/40 p-3.5 border border-border/40">
                        <span className="text-[10px] text-muted-foreground font-bold block uppercase tracking-wider">Released Payouts</span>
                        <span className="text-base font-extrabold text-foreground mt-1 block">
                          {formatCurrency(project.releasedAmount)}
                        </span>
                      </div>
                    </div>

                    {/* Action Panel Footer */}
                    <div className="mt-5 pt-4.5 border-t border-border/60 flex items-center justify-between gap-3 flex-wrap">
                      <div className="flex gap-2">
                        <a
                          href={`/dashboard/projects/${project.id}`}
                          className="inline-flex items-center justify-center rounded-xl border border-border bg-card px-4.5 py-2.5 text-xs font-bold hover:bg-secondary hover:scale-[1.01] transition duration-200 shadow-sm"
                        >
                          Manage Escrow Milestones
                        </a>
                        <a
                          href={`/projects/${project.id}`}
                          className="inline-flex items-center justify-center rounded-xl border border-border/80 bg-card px-4.5 py-2.5 text-xs font-bold text-muted-foreground hover:text-foreground hover:bg-secondary transition duration-200"
                        >
                          View Public Page
                        </a>
                      </div>

                      <a 
                        href={`/dashboard/projects/${project.id}`} 
                        className="text-xs font-bold text-primary hover:underline inline-flex items-center gap-1 group/link"
                      >
                        <span>Milestone operations</span>
                        <ArrowRight className="size-3.5 group-hover/link:translate-x-0.5 transition-transform" />
                      </a>
                    </div>
                  </Card>
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
