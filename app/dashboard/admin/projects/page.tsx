"use client"

import { useState, useMemo } from "react"
import { redirect } from "next/navigation"
import { getSession } from "@/lib/session"
import { getAllProjects } from "@/lib/queries"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { formatCurrency } from "@/lib/roles"
import { StatusBadge } from "@/components/status-badge"
import { AdminProjectCard } from "@/components/admin-project-card"
import { Search, Filter, X } from "lucide-react"

export const dynamic = "force-dynamic"

type ProjectStatus = "pending" | "approved" | "rejected" | "funding" | "started" | "completed"

async function Page() {
  const user = await getSession()
  if (!user) return redirect("/sign-in")
  if (user.role !== "admin") return redirect("/dashboard")

  const projects = await getAllProjects()

  return <AdminProjectsContent projects={projects} />
}

function AdminProjectsContent({ projects }: { projects: any[] }) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedStatuses, setSelectedStatuses] = useState<ProjectStatus[]>(["pending"])
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
      const matchesStatus = selectedStatuses.includes(project.status)
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
    setSelectedStatuses(["pending"])
  }

  const projectStats = statusOptions.map((stat) => ({
    ...stat,
    count: projects.filter((p) => p.status === stat.value).length,
  }))

  return (
    <div className="flex min-h-svh flex-col bg-background">
      <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold tracking-tight text-foreground">
            Project approvals
          </h1>
          <p className="mt-2 text-muted-foreground">
            Review and manage all projects on the platform
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-6 flex flex-col gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 size-5 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search projects by title or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-lg border border-border bg-background pl-10 pr-4 py-2.5 text-sm placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Filter Toggle */}
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

          {/* Status Filter Panel */}
          {expandedFilters && (
            <Card className="p-4">
              <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-6">
                {statusOptions.map((status) => (
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
                    <p className="text-xs text-muted-foreground mt-1">
                      {projects.filter((p) => p.status === status.value).length} projects
                    </p>
                  </button>
                ))}
              </div>
            </Card>
          )}
        </div>

        {/* Results Summary */}
        <div className="mb-6 flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing <span className="font-semibold text-foreground">{filteredProjects.length}</span> of{" "}
            <span className="font-semibold text-foreground">{projects.length}</span> projects
          </p>

          {/* Status Badges Summary */}
          <div className="flex flex-wrap gap-2">
            {projectStats
              .filter((stat) => stat.count > 0 && selectedStatuses.includes(stat.value))
              .map((stat) => (
                <Badge key={stat.value} variant="outline" className="text-xs">
                  {stat.label}: {stat.count}
                </Badge>
              ))}
          </div>
        </div>

        {/* Projects List */}
        {filteredProjects.length > 0 ? (
          <div className="grid gap-4">
            {filteredProjects.map((project) => (
              <AdminProjectCard
                key={project.id}
                id={project.id}
                title={project.title}
                summary={project.summary}
                fundingGoal={project.fundingGoal}
                status={project.status}
              />
            ))}
          </div>
        ) : (
          <Card className="p-12 text-center">
            <p className="text-lg font-medium text-foreground">No projects found</p>
            <p className="mt-2 text-muted-foreground">
              Try adjusting your search or filters
            </p>
          </Card>
        )}
      </main>
    </div>
  )
}

export default Page

