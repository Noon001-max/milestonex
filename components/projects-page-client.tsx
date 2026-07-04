"use client"

import { useMemo, useState } from "react"
import { Search, SlidersHorizontal, Sparkles, TrendingUp, X } from "lucide-react"
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

const categoryOptions = [
  { value: "community", label: "Community", icon: "👥" },
  { value: "infrastructure", label: "Infrastructure", icon: "🏗️" },
  { value: "education", label: "Education", icon: "📚" },
  { value: "health", label: "Health", icon: "🏥" },
  { value: "environment", label: "Environment", icon: "🌍" },
  { value: "technology", label: "Technology", icon: "💻" },
]

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

  const stats = useMemo(() => {
    const totalRaised = projects.reduce((sum, project) => sum + Number(project.fundedAmount || 0), 0)
    const activeProjects = projects.filter((project) => normalizeStatus(project.status) !== "draft").length
    const categoriesInUse = availableCategories.length

    return [
      { label: "Projects", value: projects.length.toString(), icon: Sparkles },
      { label: "Active", value: activeProjects.toString(), icon: TrendingUp },
      { label: "Categories", value: categoriesInUse.toString(), icon: SlidersHorizontal },
      { label: "Raised", value: `KSh ${totalRaised.toLocaleString()}`, icon: Sparkles },
    ]
  }, [availableCategories.length, projects])

  return (
    <div className="flex min-h-svh flex-col bg-background">
      <SiteHeader user={user} />
      <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        <section className="mb-8 rounded-[2rem] border border-border/60 bg-gradient-to-br from-primary/10 via-background to-background p-6 shadow-sm sm:p-8 lg:p-10">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <p className="mb-3 inline-flex items-center rounded-full border border-primary/20 bg-background/80 px-3 py-1 text-sm font-medium text-primary">
                <Sparkles className="mr-2 size-4" />
                Discover impact-driven projects
              </p>
              <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
                Browse projects that are changing communities
              </h1>
              <p className="mt-3 text-base leading-7 text-muted-foreground sm:text-lg">
                Search by cause, location, or milestone and fund the work that matters most.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:min-w-[360px]">
              {stats.map((stat) => {
                const Icon = stat.icon
                return (
                  <div key={stat.label} className="rounded-2xl border border-border/60 bg-background/90 p-4 shadow-sm">
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-sm font-medium text-muted-foreground">{stat.label}</span>
                      <Icon className="size-4 text-primary" />
                    </div>
                    <p className="text-xl font-semibold text-foreground">{stat.value}</p>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {!dbUnavailable && projects.length > 0 && (
          <section className="mb-8 rounded-[1.5rem] border border-border/60 bg-card/70 p-4 shadow-sm sm:p-5">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div className="relative flex-1">
                <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  placeholder="Search by project, cause, or place"
                  className="w-full rounded-full border border-border bg-background py-3 pl-11 pr-4 text-sm shadow-sm transition focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <label className="flex items-center gap-2 rounded-full border border-border bg-background px-3 py-2 text-sm shadow-sm">
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

                <label className="flex items-center gap-2 rounded-full border border-border bg-background px-3 py-2 text-sm shadow-sm">
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

                <label className="flex items-center gap-2 rounded-full border border-border bg-background px-3 py-2 text-sm shadow-sm">
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
            </div>

            <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-border/60 pt-4">
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
