"use client"

import * as React from "react"
import Image from "next/image"
import { ImagePlus, Loader2, X } from "lucide-react"
import { cn } from "@/lib/utils"

type ImageUploadProps = {
  /** The form field name that will carry the uploaded image URL. */
  name: string
  defaultValue?: string | null
  className?: string
}

export function ImageUpload({ name, defaultValue, className }: ImageUploadProps) {
  const [url, setUrl] = React.useState<string>(defaultValue ?? "")
  const [uploading, setUploading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const inputRef = React.useRef<HTMLInputElement>(null)

  async function handleFiles(files: FileList | null) {
    const file = files?.[0]
    if (!file) return

    setError(null)
    setUploading(true)
    try {
      const formData = new FormData()
      formData.append("file", file)
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })
      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error || "Upload failed")
      }
      setUrl(data.url)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed")
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className={cn("space-y-2", className)}>
      {/* Carries the uploaded URL into the form submission */}
      <input type="hidden" name={name} value={url} />

      {url ? (
        <div className="relative overflow-hidden rounded-lg border border-input">
          <Image
            src={url || "/placeholder.svg"}
            alt="Project image preview"
            width={800}
            height={400}
            className="h-48 w-full object-cover"
          />
          <button
            type="button"
            onClick={() => {
              setUrl("")
              if (inputRef.current) inputRef.current.value = ""
            }}
            className="absolute right-2 top-2 inline-flex size-8 items-center justify-center rounded-full bg-background/90 text-foreground shadow-sm hover:bg-background"
            aria-label="Remove image"
          >
            <X className="size-4" />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="flex h-48 w-full flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-input bg-muted/30 text-muted-foreground transition-colors hover:bg-muted/50 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {uploading ? (
            <>
              <Loader2 className="size-6 animate-spin" />
              <span className="text-sm">Uploading...</span>
            </>
          ) : (
            <>
              <ImagePlus className="size-6" />
              <span className="text-sm font-medium">Click to upload an image</span>
              <span className="text-xs">PNG or JPG, up to 8MB</span>
            </>
          )}
        </button>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="sr-only"
        onChange={(e) => handleFiles(e.target.files)}
      />

      {error ? <p className="text-sm text-destructive">{error}</p> : null}
    </div>
  )
}
