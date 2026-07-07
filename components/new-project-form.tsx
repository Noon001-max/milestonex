"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, ArrowRight, ClipboardList, Info, Layers, Layout, Loader2, MapPin, Plus, Trash2 } from "lucide-react"
import { createProject } from "@/app/actions/projects"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { ImageUpload } from "@/components/image-upload"
import { StatusBadge } from "@/components/status-badge"
import { formatCurrency } from "@/lib/roles"
import { CATEGORIES } from "@/lib/categories"

const MAX_MILESTONES = 10

function createBlankMilestone() {
  return { title: "", amount: "", description: "" }
}

export function NewProjectForm() {
  const router = useRouter()
  const formRef = React.useRef<HTMLFormElement | null>(null)

  const [step, setStep] = React.useState(1)
  const [category, setCategory] = React.useState("community")
  const [submitting, setSubmitting] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const [preview, setPreview] = React.useState({
    title: "",
    summary: "",
    description: "",
    category: "community",
    location: "",
    imageUrl: "",
    milestones: [
      { title: "Initial Setup", amount: "1000", description: "Project prep and launch setup" },
      createBlankMilestone(),
      createBlankMilestone(),
    ],
  })

  React.useEffect(() => {
    setPreview((current) => ({ ...current, category }))
  }, [category])

  function updateField<K extends keyof typeof preview>(key: K, value: (typeof preview)[K]) {
    setPreview((current) => ({ ...current, [key]: value }))
  }

  function updateMilestone(index: number, field: string, value: string) {
    setPreview((current) => {
      const milestones = [...current.milestones]
      milestones[index] = { ...milestones[index], [field]: value }
      return { ...current, milestones }
    })
  }

  function validateStep(currentStep: number) {
    setError(null)

    if (currentStep === 1) {
      if (!preview.title.trim()) return setError("Please enter a project title"), false
      if (!preview.summary.trim()) return setError("Please enter a project summary"), false
      if (!preview.location.trim()) return setError("Please enter a project location"), false
    }

    if (currentStep === 2) {
      if (!preview.description.trim()) return setError("Please enter a project description"), false
      if (preview.description.trim().length < 50) {
        return setError("Please write a more detailed description (at least 50 characters)"), false
      }
    }

    if (currentStep === 3) {
      const validMilestones = preview.milestones.filter((milestone) => milestone.title.trim() && milestone.amount)
      if (validMilestones.length === 0) {
        return setError("Please add at least one milestone with a title and amount"), false
      }
    }

    return true
  }

  function handleNext() {
    if (validateStep(step)) {
      setStep((current) => current + 1)
    }
  }

  function handleBack() {
    setError(null)
    setStep((current) => current - 1)
  }

  function addMilestone() {
    setPreview((current) => {
      if (current.milestones.length >= MAX_MILESTONES) return current
      return { ...current, milestones: [...current.milestones, createBlankMilestone()] }
    })
  }

  function deleteMilestone(index: number) {
    setPreview((current) => {
      const milestones = current.milestones.filter((_, milestoneIndex) => milestoneIndex !== index)
      return { ...current, milestones: milestones.length === 0 ? [createBlankMilestone()] : milestones }
    })
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)

    if (!validateStep(1) || !validateStep(2) || !validateStep(3)) return

    const validMilestones = preview.milestones.filter((milestone) => milestone.title.trim() && milestone.amount)
    if (validMilestones.length === 0) {
      setError("Please add at least one milestone with a title and amount")
      return
    }

    const totalGoal = validMilestones.reduce((sum, milestone) => sum + Number(milestone.amount || 0), 0)
    if (totalGoal <= 0) {
      setError("At least one milestone must have a funding amount greater than 0")
      return
    }

    setSubmitting(true)
    try {
      const formEl = formRef.current
      if (!formEl) throw new Error("Could not submit form")

      const formData = new FormData(formEl)
      formData.set("title", preview.title)
      formData.set("summary", preview.summary)
      formData.set("description", preview.description)
      formData.set("category", category)
      formData.set("location", preview.location)

      preview.milestones.forEach((milestone, index) => {
        formData.set(`milestones[${index}].title`, milestone.title || "")
        formData.set(`milestones[${index}].description`, milestone.description || "")
        formData.set(`milestones[${index}].amount`, String(milestone.amount || ""))
      })

      await createProject(formData)
      router.push("/dashboard/projects")
      router.refresh()
    } catch (err) {
      const message = err instanceof Error ? err.message : "Something went wrong"
      setError(message)
      setSubmitting(false)
    }
  }

  const totalGoal = preview.milestones.reduce((sum, milestone) => sum + Number(milestone.amount || 0), 0)

  return (
    <div className="relative grid grid-cols-1 gap-8 lg:grid-cols-12" aria-busy={submitting}>
      {submitting && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 px-4 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-2xl border border-border/70 bg-card p-6 text-center shadow-2xl">
            <Loader2 className="mx-auto size-10 animate-spin text-primary" />
            <h3 className="mt-4 text-lg font-semibold text-foreground">Creating project</h3>
            <p className="mt-2 text-sm text-muted-foreground">Please wait while your proposal and image are being saved.</p>
          </div>
        </div>
      )}

      <div className="lg:col-span-7">
        <div className="mb-8 rounded-2xl border border-border/80 bg-card p-4 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            {[1, 2, 3, 4].map((number) => (
              <React.Fragment key={number}>
                {number > 1 && <div className="mx-3 flex-1 border-t border-dashed border-border" />}
                <button
                  type="button"
                  onClick={() => {
                    if (number === 1) return setStep(1)
                    if (number === 2 && validateStep(1)) return setStep(2)
                    if (number === 3 && validateStep(1) && validateStep(2)) return setStep(3)
                    if (number === 4 && validateStep(1) && validateStep(2) && validateStep(3)) return setStep(4)
                  }}
                  className={`flex items-center gap-2 text-xs font-bold transition-all ${
                    step === number ? "text-primary" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <div
                    className={`flex size-6 items-center justify-center rounded-full border font-bold text-xs ${
                      step === number
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border/80 bg-secondary/50"
                    }`}
                  >
                    {number}
                  </div>
                  <span className="hidden sm:inline">
                    {number === 1 ? "Basics" : number === 2 ? "Narrative" : number === 3 ? "Milestones" : "Image"}
                  </span>
                </button>
              </React.Fragment>
            ))}
          </div>
        </div>

        <form ref={formRef} onSubmit={handleSubmit} className="w-full">
          <Card className="space-y-6 border border-border bg-card p-6 shadow-sm">
            {step === 1 && (
              <section className="space-y-5 animate-fade-in">
                <div className="flex items-center gap-2.5 border-b border-border/60 pb-2 text-foreground">
                  <Layout className="size-5 text-primary" />
                  <h3 className="font-bold">Project Basics</h3>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="title" className="text-xs font-semibold text-foreground">Project Title</Label>
                  <Input
                    id="title"
                    name="title"
                    required
                    value={preview.title}
                    onChange={(e) => updateField("title", e.target.value)}
                    placeholder="e.g., Clean Water Access for Kibera"
                    className="rounded-xl"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="summary" className="text-xs font-semibold text-foreground">Brief Summary</Label>
                  <Input
                    id="summary"
                    name="summary"
                    required
                    value={preview.summary}
                    onChange={(e) => updateField("summary", e.target.value)}
                    placeholder="One clear sentence describing the project"
                    className="rounded-xl"
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="category-select" className="text-xs font-semibold text-foreground">Category</Label>
                    <Select value={category} onValueChange={(value) => value && setCategory(value)}>
                      <SelectTrigger id="category-select" className="w-full rounded-xl">
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        {CATEGORIES.map((item) => (
                          <SelectItem key={item.value} value={item.value}>{item.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <input type="hidden" name="category" value={category} />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="location" className="text-xs font-semibold text-foreground">Location</Label>
                    <Input
                      id="location"
                      name="location"
                      required
                      value={preview.location}
                      onChange={(e) => updateField("location", e.target.value)}
                      placeholder="e.g., Nairobi, Kenya"
                      className="rounded-xl"
                    />
                  </div>
                </div>
              </section>
            )}

            {step === 2 && (
              <section className="space-y-5 animate-fade-in">
                <div className="flex items-center gap-2.5 border-b border-border/60 pb-2 text-foreground">
                  <Layers className="size-5 text-primary" />
                  <h3 className="font-bold">Project Narrative</h3>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="description" className="text-xs font-semibold text-foreground">Full Description & Implementation Details</Label>
                  <Textarea
                    id="description"
                    name="description"
                    required
                    rows={12}
                    value={preview.description}
                    onChange={(e) => updateField("description", e.target.value)}
                    placeholder="Describe the problem, your approach, and the expected impact."
                    className="resize-none rounded-xl p-4 text-sm leading-relaxed"
                  />
                  <div className="mt-1 flex items-center justify-between text-[11px] text-muted-foreground">
                    <span>Minimum 50 characters</span>
                    <span>{preview.description.trim().length} characters entered</span>
                  </div>
                </div>
              </section>
            )}

            {step === 3 && (
              <section className="space-y-5 animate-fade-in">
                <div className="flex items-center gap-2.5 border-b border-border/60 pb-2 text-foreground">
                  <ClipboardList className="size-5 text-primary" />
                  <h3 className="font-bold">Funding Milestones</h3>
                </div>

                <div className="flex gap-3 rounded-xl border border-primary/10 bg-primary/5 p-4 text-xs leading-relaxed text-muted-foreground">
                  <Info className="mt-0.5 size-4 flex-shrink-0 text-primary" />
                  <p>Define milestones in order. Funds remain in escrow and are released only after each step is validated.</p>
                </div>

                <div className="space-y-4">
                  {preview.milestones.map((milestone, index) => (
                    <div key={index} className="relative space-y-3 rounded-xl border border-border/70 bg-secondary/20 p-4">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Milestone {index + 1}</span>
                        {preview.milestones.length > 1 && (
                          <button
                            type="button"
                            onClick={() => deleteMilestone(index)}
                            className="inline-flex items-center gap-1.5 text-xs font-bold text-destructive transition-colors hover:text-destructive/80"
                          >
                            <Trash2 className="size-3.5" />
                            <span>Remove</span>
                          </button>
                        )}
                      </div>

                      <div className="grid gap-3 sm:grid-cols-4">
                        <div className="space-y-1.5 sm:col-span-2">
                          <Input
                            name={`milestones[${index}].title`}
                            placeholder="Milestone Title"
                            value={milestone.title}
                            onChange={(e) => updateMilestone(index, "title", e.target.value)}
                            className="h-9 rounded-lg text-xs"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <Input
                            name={`milestones[${index}].amount`}
                            type="number"
                            min="0"
                            placeholder="Amount (Ksh)"
                            value={milestone.amount}
                            onChange={(e) => updateMilestone(index, "amount", e.target.value)}
                            className="h-9 rounded-lg text-xs"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <Input
                            name={`milestones[${index}].description`}
                            placeholder="Description"
                            value={milestone.description}
                            onChange={(e) => updateMilestone(index, "description", e.target.value)}
                            className="h-9 rounded-lg text-xs"
                          />
                        </div>
                      </div>
                    </div>
                  ))}

                  <div className="flex flex-col gap-2 pt-2 sm:flex-row sm:items-center sm:justify-between">
                    <button
                      type="button"
                      onClick={addMilestone}
                      disabled={preview.milestones.length >= MAX_MILESTONES}
                      className="inline-flex items-center gap-1.5 text-sm font-bold text-primary transition-colors hover:text-primary/80 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      <Plus className="size-4" />
                      <span>Add custom milestone</span>
                    </button>
                    <span className="text-xs font-semibold text-muted-foreground">{preview.milestones.length} of {MAX_MILESTONES} milestones defined</span>
                  </div>
                </div>
              </section>
            )}

            {step === 4 && (
              <section className="space-y-5 animate-fade-in">
                <div className="flex items-center gap-2.5 border-b border-border/60 pb-2 text-foreground">
                  <Info className="size-5 text-primary" />
                  <h3 className="font-bold">Project Review</h3>
                </div>

                <div className="space-y-1.5 rounded-xl border border-border/60 bg-card/70 p-4">
                  <Label className="text-xs font-semibold text-foreground">Project Hero Image</Label>
                  <ImageUpload
                    name="imageUrl"
                    className="mt-1"
                    onChange={(url) => updateField("imageUrl", url)}
                  />
                  <p className="text-xs text-muted-foreground">
                    Pick the image here when you are satisfied, then click Submit Proposal to upload everything together.
                  </p>
                </div>

                <div className="grid gap-4 rounded-xl border border-border/60 bg-card/70 p-4 sm:grid-cols-2">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">Title</p>
                    <p className="mt-1 text-sm font-semibold text-foreground">{preview.title || "Untitled Project Proposal"}</p>
                  </div>
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">Funding Goal</p>
                    <p className="mt-1 text-sm font-semibold text-foreground">{formatCurrency(totalGoal)}</p>
                  </div>
                </div>
              </section>
            )}

            <div className="border-t border-border/80 pt-4.5">
              {error && (
                <p className="mb-4 rounded-xl border border-destructive/20 bg-destructive/10 p-3 text-xs font-bold text-destructive animate-pulse">
                  {error}
                </p>
              )}

              <div className="flex items-center justify-between gap-3">
                {step > 1 ? (
                  <button
                    type="button"
                    onClick={handleBack}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-border/80 bg-card px-5 py-2.5 text-xs font-bold text-muted-foreground shadow-sm transition hover:scale-[1.01] hover:text-foreground"
                  >
                    <ArrowLeft className="size-4" />
                    <span>Back</span>
                  </button>
                ) : (
                  <div />
                )}

                {step < 4 ? (
                  <button
                    type="button"
                    onClick={handleNext}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-6 py-2.5 text-xs font-bold text-primary-foreground shadow-sm transition hover:scale-[1.02] hover:bg-primary/95"
                  >
                    <span>Continue</span>
                    <ArrowRight className="size-4" />
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={submitting}
                    className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-2.5 text-xs font-bold text-primary-foreground shadow-md shadow-primary/10 transition hover:scale-[1.02] hover:bg-primary/95 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {submitting ? <Loader2 className="size-4 animate-spin" /> : null}
                    <span>Submit Proposal</span>
                  </button>
                )}
              </div>
            </div>
          </Card>
        </form>
      </div>

      <div className="hidden lg:block lg:col-span-5">
        <div className="sticky top-24 space-y-4">
          <div className="flex items-center gap-2 px-1 text-xs font-bold uppercase tracking-widest text-muted-foreground">
            <span>Proposal Live Preview</span>
          </div>

          <Card className="overflow-hidden border border-border/80 bg-card p-0 shadow-md">
            <div className="relative aspect-[16/10] w-full overflow-hidden bg-secondary/50">
              {preview.imageUrl ? (
                <img src={preview.imageUrl} alt={preview.title || "Project preview"} className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-muted-foreground">
                  <svg className="size-10 opacity-30" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375 0 11-.75 0 .375 0 01.75 0z" />
                  </svg>
                  <span className="text-[11px] font-semibold tracking-wide">Hero image placeholder</span>
                </div>
              )}
              <div className="absolute left-3 top-3">
                <StatusBadge status="pending" />
              </div>
            </div>

            <div className="flex flex-col gap-3.5 p-5">
              <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground">
                <span className="capitalize">{preview.category}</span>
                {preview.location && (
                  <>
                    <span aria-hidden>•</span>
                    <span className="inline-flex items-center gap-1">
                      <MapPin className="size-3" />
                      {preview.location}
                    </span>
                  </>
                )}
              </div>

              <h3 className="line-clamp-2 min-h-[3.5rem] text-balance text-lg font-bold leading-snug text-foreground">
                {preview.title || "Untitled Project Proposal"}
              </h3>

              <p className="min-h-[2.5rem] line-clamp-2 text-sm text-muted-foreground">
                {preview.summary || "This summary details the core impact and focus of your community funding project."}
              </p>

              <div className="mt-2 border-t border-border/60 pt-4">
                <div className="mb-1.5 flex items-center justify-between text-xs font-bold text-foreground">
                  <span>Funding Goal</span>
                  <span>{formatCurrency(totalGoal)}</span>
                </div>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-secondary">
                  <div className="h-full w-0 rounded-full bg-primary transition-all duration-300" />
                </div>
                <div className="mt-1 flex items-center justify-between text-[10px] font-semibold text-muted-foreground">
                  <span>Ksh 0 funded</span>
                  <span>0% raised</span>
                </div>
              </div>

              {preview.milestones.some((milestone) => milestone.title.trim() && milestone.amount) && (
                <div className="mt-1 space-y-1.5 border-t border-border/60 pt-3.5">
                  <span className="block text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Escrow Milestones</span>
                  <div className="max-h-24 space-y-1 overflow-y-auto pr-1">
                    {preview.milestones.filter((milestone) => milestone.title.trim() && milestone.amount).map((milestone, index) => (
                      <div key={index} className="flex items-center justify-between text-[11px]">
                        <span className="max-w-[70%] truncate text-foreground">{milestone.title}</span>
                        <span className="font-bold text-primary">{formatCurrency(Number(milestone.amount))}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}