"use client"

import { useState, useMemo } from "react"
import { ProjectCard } from "@/components/project-card"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Search, Filter, X } from "lucide-react"
import { CATEGORIES } from "@/lib/categories"

interface DashboardExploreClientProps {
  projects: any[]
}

export function DashboardExploreClient({ projects }: DashboardExploreClientProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [expandedFilters, setExpandedFilters] = useState(false)

  const categories = Array.from(new Set(projects.map((p) => p.category).filter(Boolean))) as string[]

  const baseOptions = CATEGORIES.map((c) => ({ value: c.value, label: c.label, icon: "" }))
  const categoryOptions = [
    { value: "community", label: "Community", icon: "👥" },
    { value: "infrastructure", label: "Infrastructure", icon: "🏗️" },
    { value: "education", label: "Education", icon: "📚" },
    { value: "healthcare", label: "Healthcare", icon: "🏥" },
    { value: "environment", label: "Environment", icon: "🌍" },
  ]
    .concat(
      baseOptions.filter((b) => !["community", "infrastructure", "education", "healthcare", "environment"].includes(b.value))
    )
    .filter((cat) => categories.includes(cat.value) || cat.value === "community")

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
    <div className="w-full">
      {/* Header */}
      <div className="mb-12">
        <h1 className="text-4xl font-bold text-foreground">Explore Projects</h1>
        <p className="mt-3 text-lg text-muted-foreground">
          Browse and fund community-driven projects
        </p>
      </div>

      {/* Search and Filters */}
      <div className="mb-8 flex flex-col gap-4">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 size-5 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search projects..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-lg border border-border bg-card pl-12 pr-4 py-3 text-sm placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 shadow-sm"
          />
        </div>

        <div className="flex items-center justify-between">
          <button
            onClick={() => setExpandedFilters(!expandedFilters)}
            className="flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2.5 text-sm font-medium hover:bg-muted transition shadow-sm duration-200"
          >
            <Filter className="size-4 text-muted-foreground" />
            <span>Filters</span>
            {selectedCategories.length > 0 && <Badge variant="secondary">{selectedCategories.length}</Badge>}
          </button>

          {(searchTerm || selectedCategories.length > 0) && (
            <button
              onClick={handleClearFilters}
              className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition duration-200"
            >
              <X className="size-4" />
              Clear
            </button>
          )}
        </div>

        {expandedFilters && categoryStats.length > 0 && (
          <Card className="p-6 border border-border bg-card shadow-sm">
            <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-5">
              {categoryStats.map((cat) => (
                <button
                  key={cat.value}
                  onClick={() => toggleCategory(cat.value)}
                  className={`rounded-lg border p-4 text-left transition-all duration-200 ${
                    selectedCategories.includes(cat.value)
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border bg-card hover:bg-muted"
                  }`}
                >
                  <p className="text-2xl mb-2">{cat.icon}</p>
                  <p className="text-sm font-medium text-foreground">{cat.label}</p>
                  <p className="text-xs text-muted-foreground mt-2">{cat.count} projects</p>
                </button>
              ))}
            </div>
          </Card>
        )}

        <div className="flex items-center justify-between text-xs font-medium pt-2 px-1">
          <p className="text-muted-foreground">
            Showing <span className="text-foreground">{filteredProjects.length}</span> of{" "}
            <span className="text-foreground">{projects.length}</span> projects
          </p>

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

      {/* Projects Grid */}
      {filteredProjects.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredProjects.map((p) => (
            <ProjectCard key={p.id} project={p} hrefPrefix="/dashboard/explore" />
          ))}
        </div>
      ) : (
        <Card className="p-16 text-center border border-border bg-card shadow-sm">
          <p className="text-lg font-semibold text-foreground">No projects found</p>
          <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
            No projects matched your active search query or selected category filters. Try resetting the filters.
          </p>
          <button
            onClick={handleClearFilters}
            className="mt-6 inline-flex items-center justify-center rounded-xl bg-primary px-5 py-2.5 text-xs font-bold text-primary-foreground shadow-sm hover:scale-[1.02] active:scale-95 transition-all"
          >
            Reset search & filters
          </button>
        </Card>
      )}
    </div>
  )
}
