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
  const formRef = React.useRef<HTMLFormElement | null>(null)
  const [category, setCategory] = React.useState<string>("community")
  const [submitting, setSubmitting] = React.useState(false)
  const [uploadingImage, setUploadingImage] = React.useState(false)
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
    
    // Validate required fields
    if (!preview.title?.trim()) {
      setError("Please enter a project title")
      return
    }
    if (!preview.summary?.trim()) {
      setError("Please enter a project summary")
      return
    }
    if (!preview.description?.trim()) {
      setError("Please enter a project description")
      return
    }
    
    const hasMilestones = preview.milestones.some(m => m.title?.trim() && m.amount)
    if (!hasMilestones) {
      setError("Please add at least one milestone with a title and amount")
      return
    }
    
    setSubmitting(true)
    try {
      const formEl = formRef.current
      if (!formEl) {
        throw new Error("Could not submit form")
      }

      // If an image file was selected, upload it to /api/upload first to avoid
      // sending large file bodies to the Server Action (which has a 1MB limit).
      const fileInput = formEl.querySelector('input[name="imageUrl"]') as HTMLInputElement | null
      let uploadedUrl: string | null = null
      if (fileInput?.files?.[0]) {
        setUploadingImage(true)
        const uploadForm = new FormData()
        uploadForm.append("file", fileInput.files[0])
        const res = await fetch("/api/upload", { method: "POST", body: uploadForm })
        setUploadingImage(false)
        if (!res.ok) {
          const payload = await res.json().catch(() => ({}))
          throw new Error(payload?.error || "Image upload failed")
        }
        const data = await res.json()
        uploadedUrl = data.url
      }

      const formData = new FormData(formEl)
      // Ensure category is set
      formData.set("category", category)
      // If we uploaded the image, replace the file entry with the returned URL
      if (uploadedUrl) {
        formData.delete("imageUrl")
        formData.set("imageUrl", uploadedUrl)
      }

      await createProject(formData)
      router.push("/dashboard/projects")
      router.refresh()
    } catch (err) {
      const message = err instanceof Error ? err.message : "Something went wrong"
      setError(message)
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
    <form ref={formRef} onSubmit={handleSubmit} className="w-full">
      <div className="w-full max-w-2xl">
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
          {uploadingImage ? (
            <p className="text-sm text-muted-foreground mb-3">Uploading image...</p>
          ) : null}
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
    </form>
  )
}
