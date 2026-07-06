"use client"

import React, { useState } from "react"

export default function ProjectSettingsForm({ project }: any) {
  const [title, setTitle] = useState(project.title || "")
  const [description, setDescription] = useState(project.description || "")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch(`/api/projects/${project.id}/settings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description }),
      })
      if (!res.ok) throw new Error(await res.text())
      alert("Settings updated")
      location.reload()
    } catch (err: any) {
      alert(err?.message || "Failed to update")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-muted-foreground">Title</label>
        <input value={title} onChange={(e) => setTitle(e.target.value)} className="mt-1 block w-full rounded-lg border border-border px-3 py-2" />
      </div>
      <div>
        <label className="block text-sm font-medium text-muted-foreground">Description</label>
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="mt-1 block w-full rounded-lg border border-border px-3 py-2 h-32" />
      </div>
      <div className="flex gap-2">
        <button type="submit" disabled={loading} className="inline-flex items-center px-4 py-2 bg-primary text-white rounded-lg">
          {loading ? "Saving..." : "Save settings"}
        </button>
      </div>
    </form>
  )
}
