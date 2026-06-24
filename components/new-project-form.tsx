"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"
import { createProject } from "@/app/actions/projects"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ImageUpload } from "@/components/image-upload"

const CATEGORIES = [
  { value: "community", label: "Community Development" },
  { value: "education", label: "Education" },
  { value: "healthcare", label: "Healthcare" },
  { value: "infrastructure", label: "Infrastructure" },
  { value: "environment", label: "Environment" },
] as const

const MAX_MILESTONES = 10

function createBlankMilestone() {
  return { title: "", amount: "", description: "" }
}

export function NewProjectForm() {
  const router = useRouter()
  const [category, setCategory] = React.useState<string>("community")
  const [submitting, setSubmitting] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const [preview, setPreview] = React.useState({
    title: "",
    summary: "",
    description: "",
    category: "community",
    location: "",
    milestones: [createBlankMilestone(), createBlankMilestone(), createBlankMilestone()],
  })

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    setSubmitting(true)
    try {
      const formData = new FormData(e.currentTarget)
      // base-ui Select isn't a native field, so set the chosen value explicitly
      formData.set("category", category)
      await createProject(formData)
      router.push("/dashboard/projects")
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong")
      setSubmitting(false)
    }
  }

  function updateField<K extends keyof typeof preview>(key: K, value: any) {
    setPreview((p) => ({ ...p, [key]: value }))
  }

  function updateMilestone(index: number, field: string, value: string) {
    setPreview((p) => {
      const ms = [...p.milestones]
      ms[index] = { ...ms[index], [field]: value }
      return { ...p, milestones: ms }
    })
  }

  function addMilestone() {
    setPreview((p) => {
      if (p.milestones.length >= MAX_MILESTONES) return p
      return { ...p, milestones: [...p.milestones, createBlankMilestone()] }
    })
  }

  const totalGoal = preview.milestones.reduce((sum, m) => sum + Number(m.amount || 0), 0)

  return (
    <form onSubmit={handleSubmit} className="grid gap-6 md:grid-cols-3">
      <div className="md:col-span-2">
        <Card className="space-y-4 p-6">
        <div>
          <Label htmlFor="title">Project title</Label>
          <Input id="title" name="title" required placeholder="e.g., Clean Water Initiative" value={preview.title} onChange={(e) => updateField('title', e.target.value)} />
        </div>

        <div>
          <Label htmlFor="summary">Summary</Label>
          <Input
            id="summary"
            name="summary"
            required
            placeholder="One sentence describing the project impact"
            value={preview.summary}
            onChange={(e) => updateField('summary', e.target.value)}
          />
        </div>

        <div>
          <Label htmlFor="description">Full description</Label>
          <Textarea
            id="description"
            name="description"
            required
            rows={6}
            placeholder="Describe goals, timeline, budget, and expected outcomes"
            value={preview.description}
            onChange={(e) => updateField('description', e.target.value)}
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-2">
            <Label htmlFor="category">Category</Label>
            <Select value={category} onValueChange={(v) => { setCategory(v as string); updateField('category', v) }}>
              <SelectTrigger id="category" className="w-full">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((c) => (
                  <SelectItem key={c.value} value={c.value}>
                    {c.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <input type="hidden" name="category" value={category} />
          </div>
          <div>
            <Label htmlFor="location">Location</Label>
            <Input id="location" name="location" placeholder="e.g., Nairobi, Kenya" value={preview.location} onChange={(e) => updateField('location', e.target.value)} />
          </div>
        </div>

        <div>
          <Label>Project image (optional)</Label>
          <ImageUpload name="imageUrl" className="mt-2" />
        </div>

        <div>
          <Label>Milestones</Label>
          <div className="mt-2 space-y-3">
            {preview.milestones.map((milestone, i) => (
              <div key={i} className="grid gap-2 sm:grid-cols-3">
                <Input name={`milestones[${i}].title`} placeholder={`Milestone ${i + 1} title`} value={milestone.title} onChange={(e) => updateMilestone(i, 'title', e.target.value)} />
                <Input
                  name={`milestones[${i}].amount`}
                  type="number"
                  min="0"
                  placeholder="Amount"
                  value={milestone.amount}
                  onChange={(e) => updateMilestone(i, 'amount', e.target.value)}
                />
                <Input name={`milestones[${i}].description`} placeholder="Description" value={milestone.description} onChange={(e) => updateMilestone(i, 'description', e.target.value)} />
              </div>
            ))}
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <button
                type="button"
                className="text-sm text-primary hover:text-primary/80"
                onClick={addMilestone}
                disabled={preview.milestones.length >= MAX_MILESTONES}
              >
                + Add milestone
              </button>
              <span className="text-xs text-muted-foreground">
                You can add up to {MAX_MILESTONES} milestones.
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              Leave blank any milestones you don&apos;t need. The funding goal is the sum of
              milestone amounts.
            </p>
          </div>
        </div>

        <div className="border-t border-border/70 pt-4">
          {error ? <p className="text-sm text-destructive mb-3">{error}</p> : null}
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-end sm:items-center">
            <button
              type="button"
              className="text-sm text-muted-foreground"
              onClick={() => {
                setPreview({
                  title: '',
                  summary: '',
                  description: '',
                  category: 'community',
                  location: '',
                  milestones: [createBlankMilestone(), createBlankMilestone(), createBlankMilestone()],
                })
                setCategory('community')
              }}
            >
              Reset
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center justify-center rounded-lg bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? <Loader2 className="size-4 animate-spin" /> : null}
              Submit proposal
            </button>
          </div>
        </div>
      </Card>

      </div>

      <aside className="hidden md:block md:col-span-1">
        <div className="sticky top-20 space-y-4">
          <Card className="p-4">
            <h3 className="text-lg font-semibold">Preview</h3>
            <p className="text-sm text-muted-foreground mt-1">How your proposal appears to reviewers</p>

            <div className="mt-4">
              <div className="h-40 w-full rounded-md bg-muted/40 flex items-center justify-center text-muted-foreground">Image</div>
              <h4 className="mt-3 text-lg font-medium">{preview.title || 'Project title'}</h4>
              <p className="text-sm text-muted-foreground mt-1">{preview.summary || 'Short summary goes here.'}</p>

              <div className="mt-3">
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>Category</span>
                  <span className="font-medium text-foreground">{preview.category}</span>
                </div>
                <div className="flex items-center justify-between text-sm text-muted-foreground mt-1">
                  <span>Location</span>
                  <span className="font-medium text-foreground">{preview.location || '—'}</span>
                </div>
              </div>

              <div className="mt-4 border-t pt-3">
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>Funding goal</span>
                  <span className="font-semibold">{new Intl.NumberFormat(undefined, { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(totalGoal)}</span>
                </div>

                <div className="mt-2 space-y-2">
                  {preview.milestones.map((m, i) => (
                    <div key={i} className="flex items-start justify-between">
                      <div>
                        <div className="text-sm font-medium">{m.title || `Milestone ${i + 1}`}</div>
                        <div className="text-xs text-muted-foreground">{m.description || ''}</div>
                      </div>
                      <div className="text-sm font-semibold">{m.amount ? new Intl.NumberFormat(undefined, { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(Number(m.amount)) : '-'}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        </div>
      </aside>
    </form>
  )
}
