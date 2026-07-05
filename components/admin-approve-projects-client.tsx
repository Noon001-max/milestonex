"use client"

import React from "react"
import { Card } from "@/components/ui/card"
import { AdminProjectCard } from "@/components/admin-project-card"

export function AdminApproveProjectsSimple({ projects }: { projects: any[] }) {
  return (
    <div className="flex min-h-svh flex-col bg-background">
      <main className="mx-auto w-full max-w-4xl px-4 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-foreground">Projects awaiting approval</h1>
          <p className="mt-1 text-sm text-muted-foreground">Only projects with status “pending” are shown here for quick review.</p>
        </div>

        {projects.length > 0 ? (
          <div className="space-y-3">
            {projects.map((project) => (
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
          <Card className="p-8 text-center">
            <p className="text-muted-foreground">No projects awaiting approval.</p>
          </Card>
        )}
      </main>
    </div>
  )
}
