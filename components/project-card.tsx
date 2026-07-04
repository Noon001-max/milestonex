import Link from "next/link"
import Image from "next/image"
import { ArrowRight, MapPin } from "lucide-react"
import { Card } from "@/components/ui/card"
import { StatusBadge } from "@/components/status-badge"
import { FundingProgress } from "@/components/funding-progress"

type ProjectCardProps = {
  project: {
    id: number
    title: string
    summary: string
    category: string
    location: string | null
    imageUrl: string | null
    fundingGoal: number
    fundedAmount: number
    releasedAmount: number
    status: string
  }
  hrefPrefix?: string
}

export function ProjectCard({ project, hrefPrefix = "/projects" }: ProjectCardProps) {
  const progress = Math.min(100, Math.round((Number(project.fundedAmount || 0) / Math.max(Number(project.fundingGoal || 1), 1)) * 100))

  return (
    <Link href={`${hrefPrefix}/${project.id}`} className="group block h-full">
      <Card className="h-full overflow-hidden rounded-[1.6rem] border border-border/70 bg-card p-0 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
        <div className="relative aspect-[16/10] w-full overflow-hidden bg-muted">
          <Image
            src={project.imageUrl || "/hero-community.png"}
            alt={project.title}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-x-0 top-0 flex items-start justify-between p-3">
            <StatusBadge status={project.status} />
            <span className="rounded-full bg-background/90 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-foreground/80 backdrop-blur">
              {project.category || "Project"}
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-4 p-5">
          {project.location && (
            <div className="inline-flex items-center gap-1 text-sm text-muted-foreground">
              <MapPin className="size-3.5" />
              {project.location}
            </div>
          )}

          <div className="space-y-2">
            <h3 className="text-lg font-semibold leading-tight text-foreground line-clamp-2">
              {project.title}
            </h3>
            <p className="line-clamp-3 text-sm leading-6 text-muted-foreground">
              {project.summary}
            </p>
          </div>

          <div className="space-y-3 border-t border-border pt-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Raised</span>
              <span className="font-semibold text-foreground">KSh {Number(project.fundedAmount || 0).toLocaleString()}</span>
            </div>
            <FundingProgress funded={project.fundedAmount} goal={project.fundingGoal} />
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>{progress}% funded</span>
              <span className="inline-flex items-center gap-1 font-medium text-primary transition group-hover:gap-2">
                View project
                <ArrowRight className="size-3.5" />
              </span>
            </div>
          </div>
        </div>
      </Card>
    </Link>
  )
}
