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
  onChange?: (url: string) => void
}

export function ImageUpload({ name, defaultValue, className, onChange }: ImageUploadProps) {
  const [url, setUrl] = React.useState<string>(defaultValue ?? "")
  const [uploading, setUploading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const inputRef = React.useRef<HTMLInputElement>(null)
  const inputId = React.useId()

  async function handleFiles(files: FileList | null) {
    const file = files?.[0]
    if (!file) return

    setError(null)
    // Create a local preview URL and keep the selected file in the native input so
    // the form submits the file on proposal submit. We don't auto-upload here.
    try {
      const objectUrl = URL.createObjectURL(file)
      setUrl(objectUrl)
      if (onChange) onChange(objectUrl)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load image")
    }
  }

  return (
    <div className={cn("space-y-2", className)}>
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
              if (onChange) onChange("")
              // revoke object URL
              try { URL.revokeObjectURL(url) } catch (e) {}
            }}
            className="absolute right-2 top-2 inline-flex size-8 items-center justify-center rounded-full bg-background/90 text-foreground shadow-sm hover:bg-background"
            aria-label="Remove image"
          >
            <X className="size-4" />
          </button>
        </div>
      ) : (
        <label
          htmlFor={inputId}
          aria-disabled={uploading}
          className={`flex h-48 w-full flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-input bg-muted/30 text-muted-foreground transition-colors ${
            uploading ? "cursor-not-allowed opacity-60" : "cursor-pointer hover:bg-muted/50"
          }`}
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
        </label>
      )}

      <input
        ref={inputRef}
        id={inputId}
        name={name}
        type="file"
        accept="image/*"
        className="sr-only"
        onChange={(e) => handleFiles(e.target.files)}
      />

      {error ? <p className="text-sm text-destructive">{error}</p> : null}
    </div>
  )
}
