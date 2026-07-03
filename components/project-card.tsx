import Link from "next/link"
import Image from "next/image"
import { MapPin } from "lucide-react"
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
  return (
    <Link href={`${hrefPrefix}/${project.id}`} className="group block">
      <Card className="overflow-hidden p-0 h-full transition-all duration-200 hover:shadow-lg border-0 shadow-sm">
        <div className="relative aspect-[16/10] w-full overflow-hidden bg-muted">
          <Image
            src={
              project.imageUrl ||
              "/hero-community.png"
            }
            alt={project.title}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute left-3 top-3">
            <StatusBadge status={project.status} />
          </div>
        </div>
        <div className="flex flex-col gap-4 p-4">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span className="capitalize font-medium">{project.category}</span>
            {project.location && (
              <>
                <span aria-hidden>•</span>
                <span className="inline-flex items-center gap-1">
                  <MapPin className="size-3.5" />
                  {project.location}
                </span>
              </>
            )}
          </div>
          <h3 className="text-base font-semibold leading-tight text-foreground line-clamp-2">
            {project.title}
          </h3>
          <p className="line-clamp-2 text-sm text-muted-foreground leading-relaxed">
            {project.summary}
          </p>
          <div className="mt-1 pt-2 border-t border-border">
            <FundingProgress
              funded={project.fundedAmount}
              goal={project.fundingGoal}
            />
          </div>
        </div>
      </Card>
    </Link>
  )
}
