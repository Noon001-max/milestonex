"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { contribute } from "@/app/actions/donations"
import { toast } from "sonner"

const PRESETS = [25, 50, 100, 250]

export function DonateWidget({
  projectId,
  isAuthed,
}: {
  projectId: number
  isAuthed: boolean
}) {
  const router = useRouter()
  const [amount, setAmount] = useState<number>(50)
  const [kind, setKind] = useState<"donation" | "investment">("donation")
  const [displayMode, setDisplayMode] = useState<"name" | "anonymous" | "custom">("name")
  const [customName, setCustomName] = useState("")
  const [isPending, startTransition] = useTransition()

  function handleContribute() {
    if (!isAuthed) {
      router.push("/sign-in")
      return
    }
    if (!amount || amount <= 0) {
      toast.error("Enter a valid amount")
      return
    }
    if (displayMode === "custom" && !customName.trim()) {
      toast.error("Enter a display name or company name")
      return
    }
    startTransition(async () => {
      try {
        await contribute(projectId, amount, kind, {
          displayMode,
          displayName: customName.trim(),
        })
        toast.success("Contribution secured in escrow")
        router.refresh()
      } catch (e) {
        toast.error(e instanceof Error ? e.message : "Something went wrong")
      }
    })
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        <button
          type="button"
          onClick={() => setKind("donation")}
          className={`rounded-md border px-3 py-2 text-sm font-medium transition-colors ${
            kind === "donation"
              ? "border-primary bg-primary/10 text-primary"
              : "border-border text-muted-foreground hover:bg-muted"
          }`}
        >
          Donate
        </button>
        <button
          type="button"
          onClick={() => setKind("investment")}
          className={`rounded-md border px-3 py-2 text-sm font-medium transition-colors ${
            kind === "investment"
              ? "border-primary bg-primary/10 text-primary"
              : "border-border text-muted-foreground hover:bg-muted"
          }`}
        >
          Invest
        </button>
      </div>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {PRESETS.map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => setAmount(p)}
            className={`w-full rounded-md border px-2 py-2 text-sm transition-colors ${
              amount === p
                ? "border-primary bg-primary/10 text-primary"
                : "border-border text-foreground hover:bg-muted"
            }`}
          >
            Ksh {p}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="amount">Amount (Ksh)</Label>
        <Input
          id="amount"
          type="number"
          min={1}
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
        />
      </div>

      <div className="rounded-lg border border-border/70 bg-muted/50 p-3">
        <Label className="text-sm font-medium">How should your name appear?</Label>
        <div className="mt-2 space-y-2 text-sm text-foreground">
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="display-mode"
              checked={displayMode === "name"}
              onChange={() => setDisplayMode("name")}
            />
            <span>Show my full name</span>
          </label>
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="display-mode"
              checked={displayMode === "anonymous"}
              onChange={() => setDisplayMode("anonymous")}
            />
            <span>Stay anonymous</span>
          </label>
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="display-mode"
              checked={displayMode === "custom"}
              onChange={() => setDisplayMode("custom")}
            />
            <span>Use a custom name or company</span>
          </label>
          {displayMode === "custom" && (
            <div className="flex flex-col gap-2 pt-1">
              <Label htmlFor="display-name">Display name or company</Label>
              <Input
                id="display-name"
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
                placeholder="e.g. Bright Future Ltd"
              />
            </div>
          )}
        </div>
      </div>

      <button
        onClick={handleContribute}
        disabled={isPending}
        className="inline-flex w-full items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
      >
        {isPending
          ? "Processing..."
          : isAuthed
            ? `Contribute Ksh ${amount || 0}`
            : "Sign in to contribute"}
      </button>
      <p className="text-xs text-muted-foreground">
        Funds are held in escrow and released only as milestones are verified.
      </p>
    </div>
  )
}
