"use client"

import { useMemo, useState } from "react"
import { Search, X } from "lucide-react"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { ProjectCard } from "@/components/project-card"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"

interface ProjectsPageClientProps {
  user: any
  projects: any[]
  dbUnavailable: boolean
}

import { CATEGORIES } from "@/lib/categories"

const categoryOptions = CATEGORIES.map((c) => ({ value: c.value, label: c.label, icon: undefined }))

const statusOptions = [
  { value: "all", label: "All statuses" },
  { value: "funding", label: "Funding" },
  { value: "in-progress", label: "In progress" },
  { value: "completed", label: "Completed" },
  { value: "draft", label: "Draft" },
]

function normalizeStatus(status?: string) {
  const value = (status || "").toLowerCase()
  if (value.includes("complete") || value.includes("released") || value === "done") return "completed"
  if (value.includes("progress") || value.includes("active") || value.includes("live")) return "in-progress"
  if (value.includes("fund")) return "funding"
  return value || "draft"
}

export function ProjectsPageClient({ user, projects, dbUnavailable }: ProjectsPageClientProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [sortBy, setSortBy] = useState("featured")

  const availableCategories = useMemo(() => {
    const categories = new Set<string>()
    projects.forEach((project) => {
      if (project.category) categories.add(project.category)
    })
    return Array.from(categories)
  }, [projects])

  const filteredProjects = useMemo(() => {
    const term = searchTerm.trim().toLowerCase()

    const sorted = [...projects].filter((project) => {
      const matchesSearch =
        !term ||
        [project.title, project.summary, project.location, project.category]
          .filter(Boolean)
          .join(" ")
          .toLowerCase()
          .includes(term)

      const matchesCategory = selectedCategory === "all" || project.category === selectedCategory
      const matchesStatus = selectedStatus === "all" || normalizeStatus(project.status) === selectedStatus

      return matchesSearch && matchesCategory && matchesStatus
    })

    return sorted.sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return Number(b.id || 0) - Number(a.id || 0)
        case "funded":
          return (Number(b.fundedAmount || 0) + Number(b.releasedAmount || 0)) - (Number(a.fundedAmount || 0) + Number(a.releasedAmount || 0))
        case "goal":
          return (Number(b.fundingGoal || 0) - Number(a.fundingGoal || 0))
        default:
          return (Number(b.fundedAmount || 0) / Math.max(Number(b.fundingGoal || 1), 1)) - (Number(a.fundedAmount || 0) / Math.max(Number(a.fundingGoal || 1), 1))
      }
    })
  }, [projects, searchTerm, selectedCategory, selectedStatus, sortBy])

  const clearFilters = () => {
    setSearchTerm("")
    setSelectedCategory("all")
    setSelectedStatus("all")
    setSortBy("featured")
  }

  return (
    <div className="flex min-h-svh flex-col bg-background">
      <SiteHeader user={user} />
      <main className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-10">
        <section className="mb-6 rounded-[1.5rem] border border-border/60 bg-card/80 p-5 shadow-sm sm:p-6">
          <div className="space-y-2">
            <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
              Browse projects
            </h1>
            <p className="text-sm leading-6 text-muted-foreground sm:text-base">
              Search by cause, location, or milestone and discover the work that matters most.
            </p>
          </div>
        </section>

        {!dbUnavailable && projects.length > 0 && (
          <section className="mb-6 rounded-[1.25rem] border border-border/60 bg-card/70 p-3 shadow-sm sm:p-4">
            <div className="space-y-3">
              <div className="relative">
                <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  placeholder="Search projects"
                  className="w-full rounded-full border border-border bg-background py-3 pl-10 pr-4 text-sm shadow-sm transition focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
                <label className="flex items-center justify-between gap-2 rounded-full border border-border bg-background px-3 py-2 text-sm shadow-sm sm:justify-start">
                  <span className="text-muted-foreground">Category</span>
                  <select
                    value={selectedCategory}
                    onChange={(event) => setSelectedCategory(event.target.value)}
                    className="bg-transparent font-medium text-foreground outline-none"
                  >
                    <option value="all">All</option>
                    {categoryOptions
                      .filter((option) => availableCategories.includes(option.value))
                      .map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                  </select>
                </label>

                <label className="flex items-center justify-between gap-2 rounded-full border border-border bg-background px-3 py-2 text-sm shadow-sm sm:justify-start">
                  <span className="text-muted-foreground">Status</span>
                  <select
                    value={selectedStatus}
                    onChange={(event) => setSelectedStatus(event.target.value)}
                    className="bg-transparent font-medium text-foreground outline-none"
                  >
                    {statusOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="flex items-center justify-between gap-2 rounded-full border border-border bg-background px-3 py-2 text-sm shadow-sm sm:justify-start">
                  <span className="text-muted-foreground">Sort</span>
                  <select
                    value={sortBy}
                    onChange={(event) => setSortBy(event.target.value)}
                    className="bg-transparent font-medium text-foreground outline-none"
                  >
                    <option value="featured">Featured</option>
                    <option value="funded">Most funded</option>
                    <option value="goal">Largest goal</option>
                    <option value="newest">Newest</option>
                  </select>
                </label>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border/60 pt-3">
                <div className="flex flex-wrap items-center gap-2">
                  {selectedCategory !== "all" && (
                    <Badge variant="secondary" className="rounded-full">
                      {categoryOptions.find((option) => option.value === selectedCategory)?.label || selectedCategory}
                    </Badge>
                  )}
                  {selectedStatus !== "all" && (
                    <Badge variant="outline" className="rounded-full">
                      {statusOptions.find((option) => option.value === selectedStatus)?.label || selectedStatus}
                    </Badge>
                  )}
                </div>

                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <span>
                    Showing <span className="font-semibold text-foreground">{filteredProjects.length}</span> of <span className="font-semibold text-foreground">{projects.length}</span>
                  </span>
                  {(searchTerm || selectedCategory !== "all" || selectedStatus !== "all" || sortBy !== "featured") && (
                    <button
                      type="button"
                      onClick={clearFilters}
                      className="inline-flex items-center gap-1 rounded-full border border-border bg-background px-3 py-1.5 font-medium text-foreground transition hover:bg-muted"
                    >
                      <X className="size-3.5" />
                      Clear
                    </button>
                  )}
                </div>
              </div>
            </div>
          </section>
        )}

        {dbUnavailable ? (
          <Card className="p-10 text-center text-muted-foreground shadow-sm">
            Project data is temporarily unavailable. Please try again later.
          </Card>
        ) : filteredProjects.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {filteredProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        ) : (
          <Card className="p-12 text-center shadow-sm">
            <p className="text-lg font-semibold text-foreground">No projects match your search yet</p>
            <p className="mt-2 text-sm text-muted-foreground">
              Try another keyword, category, or status to explore more impact projects.
            </p>
          </Card>
        )}
      </main>
      <SiteFooter />
    </div>
  )
}
