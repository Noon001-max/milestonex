"use client"

import React, { useState } from "react"

type M = { id?: number; title: string; description: string; amount: number }

export default function MilestonesManager({ projectId, initialMilestones }: any) {
  const [milestones, setMilestones] = useState<M[]>(
    (initialMilestones || []).map((m: any) => ({ id: m.id, title: m.title, description: m.description, amount: m.amount }))
  )
  const [loading, setLoading] = useState(false)

  const add = () => setMilestones((s) => [...s, { title: "", description: "", amount: 0 }])
  const remove = (i:number) => setMilestones((s) => s.filter((_, idx) => idx !== i))
  const update = (i:number, patch: Partial<M>) => setMilestones((s) => s.map((m,idx) => idx===i?{...m,...patch}:m))

  const handleSave = async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/projects/${projectId}/milestones`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ milestones }),
      })
      if (!res.ok) throw new Error(await res.text())
      alert("Milestones saved")
      location.reload()
    } catch (err:any) {
      alert(err?.message || "Failed to save milestones")
    } finally { setLoading(false) }
  }

  return (
    <div>
      <div className="space-y-4">
        {milestones.map((m, i) => (
          <div key={i} className="p-4 border rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <strong>Milestone {i+1}</strong>
              <button type="button" onClick={() => remove(i)} className="text-sm text-destructive">Remove</button>
            </div>
            <input value={m.title} onChange={(e)=>update(i,{title:e.target.value})} placeholder="Title" className="w-full mb-2 rounded border px-2 py-1" />
            <textarea value={m.description} onChange={(e)=>update(i,{description:e.target.value})} placeholder="Description" className="w-full mb-2 rounded border px-2 py-1 h-20" />
            <input type="number" value={m.amount} onChange={(e)=>update(i,{amount: Number(e.target.value)})} placeholder="Amount" className="w-48 rounded border px-2 py-1" />
          </div>
        ))}
      </div>
      <div className="mt-4 flex gap-2">
        <button onClick={add} className="px-3 py-2 rounded bg-secondary text-foreground">Add milestone</button>
        <button onClick={handleSave} disabled={loading} className="px-3 py-2 rounded bg-primary text-white">{loading?"Saving...":"Save milestones"}</button>
      </div>
    </div>
  )
}
