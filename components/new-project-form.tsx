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

export function NewProjectForm() {
  const router = useRouter()
  const [category, setCategory] = React.useState<string>("community")
  const [submitting, setSubmitting] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

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

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card className="space-y-4 p-6">
        <div>
          <Label htmlFor="title">Project title</Label>
          <Input id="title" name="title" required placeholder="e.g., Clean Water Initiative" />
        </div>

        <div>
          <Label htmlFor="summary">Summary</Label>
          <Input
            id="summary"
            name="summary"
            required
            placeholder="One sentence describing the project impact"
          />
        </div>

        <div>
          <Label htmlFor="description">Full description</Label>
          <Textarea
            id="description"
            name="description"
            required
            rows={4}
            placeholder="Describe goals, timeline, budget, and expected outcomes"
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-2">
            <Label htmlFor="category">Category</Label>
            <Select value={category} onValueChange={(v) => setCategory(v as string)}>
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
          </div>
          <div>
            <Label htmlFor="location">Location</Label>
            <Input id="location" name="location" placeholder="e.g., Nairobi, Kenya" />
          </div>
        </div>

        <div>
          <Label>Project image (optional)</Label>
          <ImageUpload name="imageUrl" className="mt-2" />
        </div>

        <div>
          <Label>Milestones</Label>
          <div className="mt-2 space-y-3">
            {[0, 1, 2].map((i) => (
              <div key={i} className="grid gap-2 sm:grid-cols-3">
                <Input name={`milestones[${i}].title`} placeholder={`Milestone ${i + 1} title`} />
                <Input
                  name={`milestones[${i}].amount`}
                  type="number"
                  min="0"
                  placeholder="Amount (USD)"
                />
                <Input name={`milestones[${i}].description`} placeholder="Description" />
              </div>
            ))}
            <p className="text-xs text-muted-foreground">
              Leave blank any milestones you don&apos;t need. The funding goal is the sum of
              milestone amounts.
            </p>
          </div>
        </div>
      </Card>

      {error ? <p className="text-sm text-destructive">{error}</p> : null}

      <button
        type="submit"
        disabled={submitting}
        className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {submitting ? <Loader2 className="size-4 animate-spin" /> : null}
        Submit for review
      </button>
    </form>
  )
}
