"use client"

import * as React from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { ImagePlus, Loader2, X } from "lucide-react"
import { submitMilestoneEvidence } from "@/app/actions/milestones"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

type EvidenceFormProps = {
  milestoneId: number
}

export function EvidenceForm({ milestoneId }: EvidenceFormProps) {
  const router = useRouter()
  const [note, setNote] = React.useState("")
  const [images, setImages] = React.useState<string[]>([])
  const [uploading, setUploading] = React.useState(false)
  const [submitting, setSubmitting] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const inputRef = React.useRef<HTMLInputElement>(null)

  async function handleFiles(files: FileList | null) {
    const selected = Array.from(files ?? [])
    if (selected.length === 0) return

    setError(null)
    setUploading(true)
    try {
      for (const file of selected) {
        const formData = new FormData()
        formData.append("file", file)
        const res = await fetch("/api/upload", { method: "POST", body: formData })
        const data = await res.json()
        if (!res.ok) throw new Error(data.error || "Upload failed")
        setImages((prev) => [...prev, data.url])
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed")
    } finally {
      setUploading(false)
      if (inputRef.current) inputRef.current.value = ""
    }
  }

  function removeImage(url: string) {
    setImages((prev) => prev.filter((u) => u !== url))
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)

    if (images.length === 0) {
      setError("Add at least one proof image before submitting.")
      return
    }

    setSubmitting(true)
    try {
      await submitMilestoneEvidence(milestoneId, note.trim(), images.join("\n"))
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not submit evidence")
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-4 space-y-3 border-t border-border pt-4">
      <div>
        <Label htmlFor={`evidenceNote-${milestoneId}`}>Evidence note</Label>
        <Textarea
          id={`evidenceNote-${milestoneId}`}
          value={note}
          onChange={(e) => setNote(e.target.value)}
          rows={3}
          className="mt-1"
          placeholder="Describe what was accomplished for this milestone."
        />
      </div>

      <div>
        <Label>Proof images</Label>
        <div className="mt-2 grid grid-cols-2 gap-3 sm:grid-cols-3">
          {images.map((url) => (
            <div key={url} className="relative overflow-hidden rounded-lg border border-input">
              <Image
                src={url || "/placeholder.svg"}
                alt="Milestone proof"
                width={400}
                height={300}
                className="h-28 w-full object-cover"
              />
              <button
                type="button"
                onClick={() => removeImage(url)}
                className="absolute right-1.5 top-1.5 inline-flex size-7 items-center justify-center rounded-full bg-background/90 text-foreground shadow-sm hover:bg-background"
                aria-label="Remove image"
              >
                <X className="size-4" />
              </button>
            </div>
          ))}

          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className="flex h-28 flex-col items-center justify-center gap-1 rounded-lg border border-dashed border-input bg-muted/30 text-muted-foreground transition-colors hover:bg-muted/50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {uploading ? (
              <>
                <Loader2 className="size-5 animate-spin" />
                <span className="text-xs">Uploading...</span>
              </>
            ) : (
              <>
                <ImagePlus className="size-5" />
                <span className="text-xs font-medium">Add photo</span>
              </>
            )}
          </button>
        </div>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          className="sr-only"
          onChange={(e) => handleFiles(e.target.files)}
        />
      </div>

      {error ? <p className="text-sm text-destructive">{error}</p> : null}

      <button
        type="submit"
        disabled={submitting || uploading}
        className="inline-flex items-center gap-2 rounded-lg bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {submitting ? <Loader2 className="size-4 animate-spin" /> : null}
        Submit for verification
      </button>
    </form>
  )
}
