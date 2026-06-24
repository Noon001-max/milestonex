"use client"

import { useState, useMemo } from "react"
import { getSession } from "@/lib/session"
import { isDbAvailable } from "@/lib/db/check"
import { getPublicProjects } from "@/lib/queries"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { ProjectCard } from "@/components/project-card"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Search, Filter, X } from "lucide-react"

export const dynamic = "force-dynamic"

async function ProjectsPageContent() {
  let user = null
  let projects: any[] = []
  let dbUnavailable = false

  try {
    const ok = await isDbAvailable()
    if (!ok) {
      dbUnavailable = true
      user = await getSession()
    } else {
      ;[user, projects] = await Promise.all([
        getSession(),
        getPublicProjects(),
      ])
    }
  } catch (error) {
    console.error("Projects page load failed:", error)
    dbUnavailable = true
    user = await getSession()
  }

  return <ProjectsPageClient user={user} projects={projects} dbUnavailable={dbUnavailable} />
}

function ProjectsPageClient({ user, projects, dbUnavailable }: { user: any; projects: any[]; dbUnavailable: boolean }) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [expandedFilters, setExpandedFilters] = useState(false)

  const categories = Array.from(new Set(projects.map((p) => p.category).filter(Boolean))) as string[]

  const categoryOptions = [
    { value: "community", label: "Community", icon: "👥" },
    { value: "infrastructure", label: "Infrastructure", icon: "🏗️" },
    { value: "education", label: "Education", icon: "📚" },
    { value: "health", label: "Health", icon: "🏥" },
    { value: "environment", label: "Environment", icon: "🌍" },
    { value: "technology", label: "Technology", icon: "💻" },
  ].filter((cat) => categories.includes(cat.value) || cat.value === categories[0])

  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      const matchesSearch =
        project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.summary?.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(project.category)
      return matchesSearch && matchesCategory
    })
  }, [projects, searchTerm, selectedCategories])

  const toggleCategory = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category]
    )
  }

  const handleClearFilters = () => {
    setSearchTerm("")
    setSelectedCategories([])
  }

  const categoryStats = categoryOptions.map((cat) => ({
    ...cat,
    count: projects.filter((p) => p.category === cat.value).length,
  }))

  return (
    <div className="flex min-h-svh flex-col bg-background">
      <SiteHeader user={user} />
      <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold tracking-tight text-foreground">
            Community projects
          </h1>
          <p className="mt-2 text-muted-foreground">
            Browse vetted projects and fund the milestones that matter
          </p>
        </div>

        {!dbUnavailable && projects.length > 0 && (
          <>
            {/* Search and Filter */}
            <div className="mb-6 flex flex-col gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 size-5 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search projects by name or description..."
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
                  Filters {selectedCategories.length > 0 && <Badge variant="secondary">{selectedCategories.length}</Badge>}
                </button>

                {(searchTerm || selectedCategories.length > 0) && (
                  <button
                    onClick={handleClearFilters}
                    className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition"
                  >
                    <X className="size-4" />
                    Clear filters
                  </button>
                )}
              </div>

              {/* Category Filter Panel */}
              {expandedFilters && categoryStats.length > 0 && (
                <Card className="p-4">
                  <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                    {categoryStats.map((cat) => (
                      <button
                        key={cat.value}
                        onClick={() => toggleCategory(cat.value)}
                        className={`rounded-lg border-2 p-3 text-left transition ${
                          selectedCategories.includes(cat.value)
                            ? "border-primary bg-primary/10"
                            : "border-border bg-background hover:border-muted-foreground/50"
                        }`}
                      >
                        <p className="text-lg mb-1">{cat.icon}</p>
                        <p className="text-sm font-medium text-foreground">{cat.label}</p>
                        <p className="text-xs text-muted-foreground mt-1">{cat.count} projects</p>
                      </button>
                    ))}
                  </div>
                </Card>
              )}

              {/* Results Summary */}
              <div className="flex items-center justify-between text-sm">
                <p className="text-muted-foreground">
                  Showing <span className="font-semibold text-foreground">{filteredProjects.length}</span> of{" "}
                  <span className="font-semibold text-foreground">{projects.length}</span> projects
                </p>

                {/* Active Filters Display */}
                {selectedCategories.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {selectedCategories.map((cat) => {
                      const catInfo = categoryOptions.find((c) => c.value === cat)
                      return (
                        <Badge key={cat} variant="outline" className="text-xs">
                          {catInfo?.label || cat}
                        </Badge>
                      )
                    })}
                  </div>
                )}
              </div>
            </div>
            </>
        )}

        {/* Projects Grid */}
        {dbUnavailable ? (
          <Card className="p-12 text-center text-muted-foreground">
            Project data is temporarily unavailable. Please try again later.
          </Card>
        ) : filteredProjects.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredProjects.map((p) => (
              <ProjectCard key={p.id} project={p} />
            ))}
          </div>
        ) : (
          <Card className="p-12 text-center">
            {projects.length === 0 ? (
              <>
                <p className="text-lg font-medium text-foreground">No projects are live yet</p>
                <p className="mt-2 text-muted-foreground">Check back soon for new projects</p>
              </>
            ) : (
              <>
                <p className="text-lg font-medium text-foreground">No projects match your filters</p>
                <p className="mt-2 text-muted-foreground">Try adjusting your search or filters</p>
              </>
            )}
          </Card>
        )}
      </main>
      <SiteFooter />
    </div>
  )
}

export default ProjectsPageContent
