import Link from "next/link"
import { ShieldCheck } from "lucide-react"

export function SiteFooter() {
  const teamMembers = [
    { name: "PRUDENCE ODHIAMBO", id: "25S01ACPS003" },
    { name: "SALLY MARO", id: "24S01ACPS002" },
    { name: "IMAI MICKEN AKISA", id: "25M01ABA011" },
    { name: "DANIELLA WANGARI", id: "26J01AXRM007" },
    { name: "SHADRACK KIPTOO", id: "26JO1ACS009" },
  ]

  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto w-full max-w-6xl px-4 py-12">
        <div className="grid gap-8 md:grid-cols-2">
          {/* About Section */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="flex size-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
                <ShieldCheck className="size-5" />
              </span>
              <span className="text-base font-semibold tracking-tight text-foreground">
                Milestone X
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              Transparent community development funding with escrow-based milestone verification and accountable fund release.
            </p>
          </div>

          {/* Team Members Section */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Team Members</h3>
            <ul className="space-y-2">
              {teamMembers.map((member) => (
                <li key={member.id} className="text-sm text-muted-foreground">
                  <span className="font-medium text-foreground">{member.name}</span>
                  <span className="text-xs text-muted-foreground ml-2">({member.id})</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-border my-8"></div>

        {/* Bottom */}
        <div className="flex flex-col md:flex-row items-center justify-between text-sm text-muted-foreground">
          <p>&copy; 2026 Milestone X. All rights reserved.</p>
          <div className="flex gap-4 mt-4 md:mt-0">
            <a href="/projects" className="hover:text-foreground transition-colors">
              Projects
            </a>
            <a href="/transparency" className="hover:text-foreground transition-colors">
              Transparency
            </a>
            <a href="/#how-it-works" className="hover:text-foreground transition-colors">
              How it works
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
