"use client"

import React, { useState } from "react"
import { Card } from "@/components/ui/card"
import { AdminProjectCard } from "@/components/admin-project-card"

export function AdminApproveProjectsSimple({ projects }: { projects: any[] }) {
  const [visibleCount, setVisibleCount] = useState(10)

  const handleLoadMore = () => setVisibleCount((c) => c + 10)
  return (
    <div className="flex min-h-svh flex-col bg-background">
      <main className="mx-auto w-full max-w-6xl px-4 py-12">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-foreground">Projects awaiting approval</h1>
          <p className="mt-1 text-sm text-muted-foreground">Only projects with status “pending” are shown here for quick review.</p>
        </div>

        {projects.length > 0 ? (
          <>
            <div className="space-y-3">
              {projects.slice(0, visibleCount).map((project) => (
                <AdminProjectCard
                  key={project.id}
                  id={project.id}
                  title={project.title}
                  summary={project.summary}
                  fundingGoal={project.fundingGoal}
                  status={project.status}
                  proposerName={project.ownerName}
                />
              ))}
            </div>
            {visibleCount < projects.length ? (
              <div className="mt-6 flex justify-center">
                <button className="btn btn-outline" onClick={handleLoadMore}>Load more</button>
              </div>
            ) : null}
          </>
        ) : (
          <Card className="p-8 text-center">
            <p className="text-muted-foreground">No projects awaiting approval.</p>
          </Card>
        )}
      </main>
    </div>
  )
}
