export function SkeletonCard() {
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card">
      {/* Image placeholder */}
      <div className="relative aspect-[16/10] w-full bg-muted">
        <div className="absolute inset-0 animate-shimmer" />
      </div>
      {/* Content placeholder */}
      <div className="flex flex-col gap-3 p-5">
        <div className="flex items-center gap-2">
          <div className="h-3 w-16 rounded-full bg-muted animate-shimmer" />
          <div className="h-3 w-24 rounded-full bg-muted animate-shimmer" />
        </div>
        <div className="h-5 w-3/4 rounded-md bg-muted animate-shimmer" />
        <div className="space-y-1.5">
          <div className="h-3 w-full rounded-full bg-muted animate-shimmer" />
          <div className="h-3 w-2/3 rounded-full bg-muted animate-shimmer" />
        </div>
        <div className="mt-2 space-y-2">
          <div className="h-2 w-full rounded-full bg-muted animate-shimmer" />
          <div className="flex items-center justify-between">
            <div className="h-3 w-20 rounded-full bg-muted animate-shimmer" />
            <div className="h-3 w-28 rounded-full bg-muted animate-shimmer" />
          </div>
        </div>
      </div>
    </div>
  )
}

export function SkeletonRow() {
  return (
    <div className="flex items-center gap-4 rounded-xl border border-border bg-card p-5">
      <div className="h-10 w-10 rounded-full bg-muted animate-shimmer flex-shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="h-4 w-1/3 rounded-md bg-muted animate-shimmer" />
        <div className="h-3 w-1/2 rounded-full bg-muted animate-shimmer" />
      </div>
      <div className="h-6 w-20 rounded-md bg-muted animate-shimmer flex-shrink-0" />
    </div>
  )
}

export function SkeletonStat() {
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="flex items-start justify-between">
        <div className="space-y-3 flex-1">
          <div className="h-3 w-24 rounded-full bg-muted animate-shimmer" />
          <div className="h-7 w-20 rounded-md bg-muted animate-shimmer" />
          <div className="h-2.5 w-32 rounded-full bg-muted animate-shimmer" />
        </div>
        <div className="h-9 w-9 rounded-xl bg-muted animate-shimmer flex-shrink-0" />
      </div>
    </div>
  )
}
