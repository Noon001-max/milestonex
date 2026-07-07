"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { Loader2, ArrowRight, ArrowLeft, Plus, Trash2, MapPin, Layout, Layers, ClipboardList, Info } from "lucide-react"
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
    imageUrl: "",
    milestones: [
      { title: "Initial Setup", amount: "1000", description: "Project prep and launch setup" },
      createBlankMilestone(),
      createBlankMilestone()
    ],
  })

  // Synchronize category state changes to preview structure
  React.useEffect(() => {
    setPreview(p => ({ ...p, category }))
  }, [category])

  function validateStep(currentStep: number): boolean {
    setError(null)
    if (currentStep === 1) {
      if (!preview.title?.trim()) {
        setError("Please enter a project title")
        return false
      }
      if (!preview.summary?.trim()) {
        setError("Please enter a project summary")
        return false
      }
      if (!preview.location?.trim()) {
        setError("Please enter a project location")
        return false
      }
    } else if (currentStep === 2) {
      if (!preview.description?.trim()) {
        setError("Please enter a project description")
        return false
      }
      if (preview.description.trim().length < 50) {
        setError("Please write a more detailed description (at least 50 characters)")
        return false
      }
    } else if (currentStep === 3) {
      const validMilestones = preview.milestones.filter(m => m.title?.trim() && m.amount)
      if (validMilestones.length === 0) {
        setError("Please add at least one milestone with a title and amount")
        return false
      }
    }
    return true
  }

  function handleNext() {
    if (validateStep(step)) {
      setStep(prev => prev + 1)
    }
  }

  function handleBack() {
    setError(null)
    setStep(prev => prev - 1)
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    
    // Complete validation
    if (!validateStep(1) || !validateStep(2)) return

    const validMilestones = preview.milestones.filter(m => m.title?.trim() && m.amount)
    if (validMilestones.length === 0) {
      setError("Please add at least one milestone with a title and amount")
      return
    }

    const totalGoal = validMilestones.reduce((sum, m) => sum + Number(m.amount || 0), 0)
    if (totalGoal <= 0) {
      setError("At least one milestone must have a funding amount greater than 0")
      return
    }
    
    setSubmitting(true)
    try {
      const formEl = formRef.current
      if (!formEl) {
        throw new Error("Could not submit form")
      }

      // If a local objectUrl exists, we grab the raw file upload to send
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
      // Ensure controlled values are copied into FormData in case any inputs
      // are not reflected in the DOM (safer for custom input components).
      formData.set("title", preview.title)
      formData.set("summary", preview.summary)
      formData.set("description", preview.description)
      formData.set("category", category)
      formData.set("location", preview.location)
      // Copy milestone fields explicitly
      preview.milestones.forEach((m, i) => {
        formData.set(`milestones[${i}].title`, m.title || "")
        formData.set(`milestones[${i}].description`, m.description || "")
        formData.set(`milestones[${i}].amount`, String(m.amount || ""))
      })
      
      if (uploadedUrl) {
        formData.delete("imageUrl")
        formData.set("imageUrl", uploadedUrl)
      } else if (preview.imageUrl && !preview.imageUrl.startsWith("blob:")) {
        formData.set("imageUrl", preview.imageUrl)
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

  function deleteMilestone(index: number) {
    setPreview((p) => {
      const ms = p.milestones.filter((_, i) => i !== index)
      return { ...p, milestones: ms.length === 0 ? [createBlankMilestone()] : ms }
    })
  }

  const totalGoal = preview.milestones.reduce((sum, m) => sum + Number(m.amount || 0), 0)

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
      {/* Left panel - Form Steps */}
      <div className="lg:col-span-7">
        {/* Step Indicator Header */}
          <div className="mb-8 border border-border/80 bg-card rounded-2xl p-4.5 flex items-center justify-between shadow-sm">
          <button 
            type="button" 
            onClick={() => step > 1 && setStep(1)}
            className={`flex items-center gap-2 text-xs font-bold transition-all ${
              step === 1 ? "text-primary" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <div className={`size-6 rounded-full flex items-center justify-center border font-bold text-xs ${
              step === 1 ? "bg-primary text-primary-foreground border-primary" : "border-border/80 bg-secondary/50"
            }`}>1</div>
            <span className="hidden sm:inline">Basics</span>
          </button>
          <div className="flex-1 border-t border-dashed border-border mx-3" />
          <button 
            type="button" 
            onClick={() => validateStep(1) && setStep(2)}
            className={`flex items-center gap-2 text-xs font-bold transition-all ${
              step === 2 ? "text-primary" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <div className={`size-6 rounded-full flex items-center justify-center border font-bold text-xs ${
              step === 2 ? "bg-primary text-primary-foreground border-primary" : "border-border/80 bg-secondary/50"
            }`}>2</div>
            <span className="hidden sm:inline">Narrative</span>
          </button>
          <div className="flex-1 border-t border-dashed border-border mx-3" />
          <button 
            type="button" 
            onClick={() => validateStep(1) && validateStep(2) && setStep(3)}
            className={`flex items-center gap-2 text-xs font-bold transition-all ${
              step === 3 ? "text-primary" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <div className={`size-6 rounded-full flex items-center justify-center border font-bold text-xs ${
              step === 3 ? "bg-primary text-primary-foreground border-primary" : "border-border/80 bg-secondary/50"
            }`}>3</div>
            <span className="hidden sm:inline">Milestones</span>
          </button>
          <div className="flex-1 border-t border-dashed border-border mx-3" />
          <button 
            type="button" 
            onClick={() => validateStep(1) && validateStep(2) && validateStep(3) && setStep(4)}
            className={`flex items-center gap-2 text-xs font-bold transition-all ${
              step === 4 ? "text-primary" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <div className={`size-6 rounded-full flex items-center justify-center border font-bold text-xs ${
              step === 4 ? "bg-primary text-primary-foreground border-primary" : "border-border/80 bg-secondary/50"
            }`}>4</div>
            <span className="hidden sm:inline">Image</span>
          </button>
        </div>

        <form ref={formRef} onSubmit={handleSubmit} className="w-full">
          <Card className="p-6 border border-border bg-card shadow-sm space-y-6">
            
            {/* STEP 1: BASICS */}
            {step === 1 && (
              <div className="space-y-5 animate-fade-in">
                <div className="flex items-center gap-2.5 text-foreground pb-2 border-b border-border/60">
                  <Layout className="size-5 text-primary" />
                  <h3 className="font-bold">Project Basics</h3>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="title" className="font-semibold text-xs text-foreground">Project Title</Label>
                  <Input 
                    id="title" 
                    name="title" 
                    required 
                    placeholder="e.g., Clean Water Access for Kibera" 
                    value={preview.title} 
                    onChange={(e) => updateField('title', e.target.value)} 
                    className="rounded-xl"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="summary" className="font-semibold text-xs text-foreground">Brief Summary</Label>
                  <Input
                    id="summary"
                    name="summary"
                    required
                    placeholder="One clear sentence explaining the central objective of this project"
                    value={preview.summary}
                    onChange={(e) => updateField('summary', e.target.value)}
                    className="rounded-xl"
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="category-select" className="font-semibold text-xs text-foreground">Category</Label>
                    <Select value={category} onValueChange={(v) => { if (v) { setCategory(v); updateField('category', v) } }}>
                      <SelectTrigger id="category-select" className="w-full rounded-xl">
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

                  <div className="space-y-1.5">
                    <Label htmlFor="location" className="font-semibold text-xs text-foreground">Location</Label>
                    <Input 
                      id="location" 
                      name="location" 
                      required
                      placeholder="e.g., Nairobi, Kenya" 
                      value={preview.location} 
                      onChange={(e) => updateField('location', e.target.value)} 
                      className="rounded-xl"
                    />
                  </div>
                </div>

                {/* image moved to final step */}
              </div>
            )}

            {/* STEP 2: NARRATIVE */}
            {step === 2 && (
              <div className="space-y-5 animate-fade-in">
                <div className="flex items-center gap-2.5 text-foreground pb-2 border-b border-border/60">
                  <Layers className="size-5 text-primary" />
                  <h3 className="font-bold">Project Narrative</h3>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="description" className="font-semibold text-xs text-foreground">Full Description & Implementation Details</Label>
                  <Textarea
                    id="description"
                    name="description"
                    required
                    rows={12}
                    placeholder="Provide a detailed breakdown of your project. Explain the background, the exact problem you aim to solve, the methodology you will apply, and why your team is suited to perform this work. Backers will read this to evaluate your transparency."
                    value={preview.description}
                    onChange={(e) => updateField('description', e.target.value)}
                    className="rounded-xl resize-none font-sans leading-relaxed text-sm p-4"
                  />
                  <div className="flex items-center justify-between text-[11px] text-muted-foreground mt-1">
                    <span>Minimum 50 characters</span>
                    <span>{preview.description.trim().length} characters entered</span>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 3: MILESTONES */}
            {step === 3 && (
              <div className="space-y-5 animate-fade-in">
                <div className="flex items-center gap-2.5 text-foreground pb-2 border-b border-border/60">
                  <ClipboardList className="size-5 text-primary" />
                  <h3 className="font-bold">Funding Milestones</h3>
                </div>

                <div className="bg-primary/5 rounded-xl border border-primary/10 p-4 text-xs text-muted-foreground flex gap-3 items-start leading-relaxed">
                  <Info className="size-4 text-primary flex-shrink-0 mt-0.5" />
                  <p>
                    Define discrete chronological milestones. Funds are locked in escrow and only released to you as each milestone is successfully validated by platform auditors.
                  </p>
                </div>

                <div className="space-y-4">
                  {preview.milestones.map((milestone, i) => (
                    <div key={i} className="p-4 border border-border/70 rounded-xl bg-secondary/20 relative space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Milestone {i + 1}</span>
                        {preview.milestones.length > 1 && (
                          <button
                            type="button"
                            onClick={() => deleteMilestone(i)}
                            className="text-xs text-destructive hover:text-destructive/80 font-bold flex items-center gap-1.5 transition-colors"
                          >
                            <Trash2 className="size-3.5" />
                            <span>Remove</span>
                          </button>
                        )}
                      </div>

                      <div className="grid gap-3 sm:grid-cols-4">
                        <div className="sm:col-span-2 space-y-1.5">
                          <Input 
                            name={`milestones[${i}].title`} 
                            placeholder="Milestone Title" 
                            value={milestone.title} 
                            onChange={(e) => updateMilestone(i, 'title', e.target.value)} 
                            className="rounded-lg h-9 text-xs"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <Input
                            name={`milestones[${i}].amount`}
                            type="number"
                            min="0"
                            placeholder="Amount (Ksh)"
                            value={milestone.amount}
                            onChange={(e) => updateMilestone(i, 'amount', e.target.value)}
                            className="rounded-lg h-9 text-xs"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <Input 
                            name={`milestones[${i}].description`} 
                            placeholder="Description" 
                            value={milestone.description} 
                            onChange={(e) => updateMilestone(i, 'description', e.target.value)} 
                            className="rounded-lg h-9 text-xs"
                          />
                        </div>
                      </div>
                    </div>
                  ))}

                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between pt-2">
                    <button
                      type="button"
                      className="inline-flex items-center gap-1.5 text-sm font-bold text-primary hover:text-primary/80 transition-colors"
                      onClick={addMilestone}
                      disabled={preview.milestones.length >= MAX_MILESTONES}
                    >
                      <Plus className="size-4" />
                      <span>Add custom milestone</span>
                    </button>
                    <span className="text-xs text-muted-foreground font-semibold">
                      {preview.milestones.length} of {MAX_MILESTONES} milestones defined
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 4: IMAGE & REVIEW */}
            {step === 4 && (
              <div className="space-y-5 animate-fade-in">
                <div className="flex items-center gap-2.5 text-foreground pb-2 border-b border-border/60">
                  <Info className="size-5 text-primary" />
                  <h3 className="font-bold">Project Review</h3>
                </div>

                <div className="space-y-1.5 rounded-xl border border-border/60 bg-card/70 p-4">
                  <Label className="font-semibold text-xs text-foreground">Project Hero Image</Label>
                  <ImageUpload
                    name="imageUrl"
                    className="mt-1"
                    onChange={(url) => updateField("imageUrl", url)}
                  />
                  <p className="text-xs text-muted-foreground">
                    Add the final hero image here, then click Submit Proposal to upload everything together.
                  </p>
                </div>

                <div className="rounded-xl border border-border/60 bg-card/70 p-3 text-sm">
                  <h4 className="font-semibold">Quick review</h4>
                  <p className="text-xs text-muted-foreground mt-2">Title, summary, description, milestones and image will be submitted together. Please review before submitting.</p>
                </div>
              </div>
            )}

            {/* Bottom Actions and Message Alerts */}
            <div className="border-t border-border/80 pt-4.5">
              {error && (
                <p className="text-xs font-bold text-destructive mb-4 p-3 bg-destructive/10 rounded-xl border border-destructive/20 animate-pulse">
                  {error}
                </p>
              )}

              <div className="flex items-center justify-between gap-3">
                {step > 1 ? (
                  <button
                    type="button"
                    onClick={handleBack}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-muted-foreground hover:text-foreground border border-border/80 bg-card rounded-xl px-5 py-2.5 transition shadow-sm hover:scale-[1.01]"
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
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-primary-foreground bg-primary rounded-xl px-6 py-2.5 transition shadow-sm hover:scale-[1.02] hover:bg-primary/95"
                  >
                    <span>Continue</span>
                    <ArrowRight className="size-4" />
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={submitting || uploadingImage}
                    className="inline-flex items-center gap-2 text-xs font-bold text-primary-foreground bg-primary rounded-xl px-6 py-2.5 transition shadow-md shadow-primary/10 disabled:opacity-60 disabled:cursor-not-allowed hover:scale-[1.02] hover:bg-primary/95"
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

      {/* Right panel - Desktop Live Preview */}
      <div className="hidden lg:block lg:col-span-5">
        <div className="sticky top-24 space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground uppercase tracking-widest px-1">
            <span>Proposal Live Preview</span>
          </div>

          <Card className="overflow-hidden p-0 border border-border/80 bg-card shadow-md">
            <div className="relative aspect-[16/10] w-full overflow-hidden bg-secondary/50">
              {preview.imageUrl ? (
                <img
                  src={preview.imageUrl}
                  alt={preview.title || "Project preview"}
                  className="h-full w-full object-cover transition-transform duration-300"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground gap-2">
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
              <h3 className="text-balance text-lg font-bold leading-snug text-foreground min-h-[3.5rem] line-clamp-2">
                {preview.title || "Untitled Project Proposal"}
              </h3>
              <p className="line-clamp-2 text-sm text-muted-foreground min-h-[2.5rem]">
                {preview.summary || "This summary details the core impact and focus of your community funding project."}
              </p>
              
              <div className="mt-2 pt-4 border-t border-border/60">
                <div className="flex items-center justify-between text-xs font-bold text-foreground mb-1.5">
                  <span>Funding Goal</span>
                  <span>{formatCurrency(totalGoal)}</span>
                </div>
                <div className="w-full bg-secondary rounded-full h-1.5 overflow-hidden">
                  <div className="h-full bg-primary rounded-full transition-all duration-300 w-0" />
                </div>
                <div className="flex items-center justify-between text-[10px] text-muted-foreground font-semibold mt-1">
                  <span>Ksh 0 funded</span>
                  <span>0% raised</span>
                </div>
              </div>

              {preview.milestones.some(m => m.title?.trim() && m.amount) && (
                <div className="mt-1 pt-3.5 border-t border-border/60 space-y-1.5">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">Escrow Milestones</span>
                  <div className="space-y-1 max-h-24 overflow-y-auto pr-1">
                    {preview.milestones.filter(m => m.title?.trim() && m.amount).map((m, idx) => (
                      <div key={idx} className="flex items-center justify-between text-[11px]">
                        <span className="truncate text-foreground max-w-[70%]">{m.title}</span>
                        <span className="font-bold text-primary">{formatCurrency(Number(m.amount))}</span>
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
