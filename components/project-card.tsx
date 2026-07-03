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
    <Link href={`${hrefPrefix}/${project.id}`} className="group block h-full">
      <Card className="overflow-hidden p-0 h-full rounded-[1.75rem] border border-border/80 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">
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
        <div className="flex flex-col gap-4 p-5">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span className="capitalize rounded-full bg-primary/10 px-2 py-1 font-medium text-primary">
              {project.category}
            </span>
            {project.location && (
              <>
                <span aria-hidden>•</span>
                <span className="inline-flex items-center gap-1 text-sm text-muted-foreground">
                  <MapPin className="size-3.5" />
                  {project.location}
                </span>
              </>
            )}
          </div>
          <h3 className="text-lg font-semibold leading-tight text-foreground line-clamp-2">
            {project.title}
          </h3>
          <p className="line-clamp-2 text-sm text-muted-foreground leading-relaxed">
            {project.summary}
          </p>
          <div className="mt-1 pt-4 border-t border-border">
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
