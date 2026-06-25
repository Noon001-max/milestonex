"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { Loader2, Check, User, Info, ImagePlus } from "lucide-react"
import { updateProfile } from "@/app/actions/profile"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ImageUpload } from "@/components/image-upload"

type ProfileFormProps = {
  defaultName: string
  defaultImage: string | null
  email: string
}

export function ProfileForm({ defaultName, defaultImage, email }: ProfileFormProps) {
  const router = useRouter()
  const [submitting, setSubmitting] = React.useState(false)
  const [saved, setSaved] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    setSaved(false)
    setSubmitting(true)
    try {
      const formData = new FormData(e.currentTarget)
      await updateProfile(formData)
      setSaved(true)
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save your changes")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <Card className="p-6 border border-border bg-card shadow-sm space-y-6">
        
        {/* Profile Image Section */}
        <div className="space-y-2">
          <Label className="font-semibold text-xs text-foreground flex items-center gap-1.5">
            <ImagePlus className="size-4 text-primary" />
            <span>Profile Photo</span>
          </Label>
          <div className="mt-1.5 max-w-md">
            <ImageUpload name="image" defaultValue={defaultImage} />
          </div>
        </div>

        {/* Full Name Input */}
        <div className="space-y-2">
          <Label htmlFor="profile-name" className="font-semibold text-xs text-foreground flex items-center gap-1.5">
            <User className="size-4 text-primary" />
            <span>Full Name</span>
          </Label>
          <Input
            id="profile-name"
            name="name"
            required
            maxLength={120}
            defaultValue={defaultName}
            placeholder="Your name"
            className="rounded-xl mt-1 h-10.5 text-sm"
          />
        </div>

        {/* Email Address Read-Only Section */}
        <div className="space-y-2">
          <Label className="font-semibold text-xs text-muted-foreground">Registered Email</Label>
          <div className="bg-secondary/35 border border-border/60 rounded-xl px-4 py-3 text-sm text-foreground font-semibold flex items-center justify-between">
            <span>{email}</span>
            <span className="inline-flex items-center text-[10px] font-bold text-muted-foreground uppercase bg-secondary/50 px-2 py-0.5 rounded border border-border/80">
              Read-Only
            </span>
          </div>
          <div className="bg-primary/5 rounded-xl border border-primary/10 p-3.5 text-[11px] text-muted-foreground flex gap-2.5 items-start mt-1 leading-relaxed">
            <Info className="size-3.5 text-primary flex-shrink-0 mt-0.5" />
            <p>
              Your email address is linked to your authentication provider. To change your registered email, go to the security settings.
            </p>
          </div>
        </div>

        {/* Action Panel */}
        <div className="border-t border-border/60 pt-5 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-2.5 text-xs font-bold text-primary-foreground shadow-md shadow-primary/10 hover:bg-primary/95 disabled:opacity-60 disabled:cursor-not-allowed hover:scale-[1.02] active:scale-98 transition duration-200"
            >
              {submitting ? <Loader2 className="size-4 animate-spin" /> : null}
              <span>Save Changes</span>
            </button>
            {saved && !submitting ? (
              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 animate-pulse">
                <Check className="size-4" />
                <span>Saved successfully</span>
              </span>
            ) : null}
          </div>
          
          {error && (
            <p className="text-xs font-semibold text-destructive max-w-[50%] text-right truncate">
              {error}
            </p>
          )}
        </div>
      </Card>
    </form>
  )
}
