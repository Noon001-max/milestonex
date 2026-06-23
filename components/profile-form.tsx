"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { Loader2, Check } from "lucide-react"
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
    <form onSubmit={handleSubmit}>
      <Card className="space-y-5 p-6">
        <div>
          <Label htmlFor="profile-image">Profile photo</Label>
          <ImageUpload name="image" defaultValue={defaultImage} className="mt-2 max-w-sm" />
        </div>

        <div>
          <Label htmlFor="profile-name">Full name</Label>
          <Input
            id="profile-name"
            name="name"
            required
            maxLength={120}
            defaultValue={defaultName}
            placeholder="Your name"
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="profile-email">Email</Label>
          <Input
            id="profile-email"
            value={email}
            disabled
            readOnly
            className="mt-1"
          />
          <p className="mt-1 text-xs text-muted-foreground">
            Email is tied to your login and can&apos;t be changed here.
          </p>
        </div>

        {error ? <p className="text-sm text-destructive">{error}</p> : null}

        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={submitting}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? <Loader2 className="size-4 animate-spin" /> : null}
            Save changes
          </button>
          {saved && !submitting ? (
            <span className="inline-flex items-center gap-1 text-sm font-medium text-primary">
              <Check className="size-4" />
              Saved
            </span>
          ) : null}
        </div>
      </Card>
    </form>
  )
}
