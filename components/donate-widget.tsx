"use client"

import { useEffect, useState, useTransition } from "react"
import { useRouter } from "next/navigation"
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
  const [isProcessing, setIsProcessing] = useState(false)
  const [processingStep, setProcessingStep] = useState(0)

  const paymentSteps = [
    "Preparing your secure payment",
    "Checking escrow and milestone safety",
    "Payment made to Milestone X",
    "Finalizing contribution",
  ]

  useEffect(() => {
    if (!isProcessing) return

    const interval = window.setInterval(() => {
      setProcessingStep((prev) => (prev < paymentSteps.length - 1 ? prev + 1 : prev))
    }, 950)

    return () => window.clearInterval(interval)
  }, [isProcessing, paymentSteps.length])

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
      setIsProcessing(true)
      setProcessingStep(0)

      try {
        await contribute(projectId, amount, kind, {
          displayMode,
          displayName: customName.trim(),
        })

        window.setTimeout(() => {
          setIsProcessing(false)
          toast.success("Contribution secured in escrow")
          router.refresh()
        }, 1800)
      } catch (e) {
        setIsProcessing(false)
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

      {isProcessing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/75 px-4 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-[1.5rem] border border-primary/20 bg-card p-6 shadow-2xl shadow-primary/10">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">Simulating secure payment</p>
                <p className="text-xs text-muted-foreground">Your contribution is being prepared for escrow.</p>
              </div>
            </div>

            <div className="mt-5 rounded-2xl border border-border/70 bg-muted/60 p-3 text-sm text-foreground">
              {paymentSteps[processingStep]}
            </div>

            <div className="mt-4 h-2 overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-primary transition-all duration-500"
                style={{ width: `${((processingStep + 1) / paymentSteps.length) * 100}%` }}
              />
            </div>

            <p className="mt-3 text-center text-xs text-muted-foreground">
              This preview makes the experience feel more practical while your contribution is secured.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
