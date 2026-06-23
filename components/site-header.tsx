import Link from "next/link"
import Image from "next/image"
import { MoreHorizontal } from "lucide-react"
import type { SessionUser } from "@/lib/session"
import { UserProfileMenu } from "@/components/user-profile-menu"
import { NotificationsPopover } from "@/components/notifications-popover"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu"

export function SiteHeader({ 
  user, 
  unreadCount = 0,
  hideNavigation = false 
}: { 
  user: SessionUser | null
  unreadCount?: number
  hideNavigation?: boolean
}) {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center px-4">
        {/* Left: quick actions menu (shows when logged in) */}
        <div className="flex items-center w-12">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  aria-label="Quick actions"
                  className="inline-flex items-center justify-center rounded-md p-2 text-muted-foreground hover:bg-accent/50"
                >
                  <MoreHorizontal className="size-5" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent side="bottom" align="start">
                <DropdownMenuLabel>Quick actions</DropdownMenuLabel>
                <DropdownMenuItem asChild>
                  <a href="/projects/new">New project</a>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <a href="/projects">My projects</a>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <a href="/dashboard">Dashboard</a>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div />
          )}
        </div>

        {/* Center: logo and navigation */}
        <div className="flex-1 flex items-center justify-center">
          <div className="flex items-center gap-2">
            <Link href="/" className="flex items-center gap-2">
              <Image
                src="/logo.png"
                alt="Milestone X"
                width={36}
                height={36}
                className="rounded-md"
              />
              <span className="text-base font-semibold tracking-tight text-foreground">
                Milestone X
              </span>
            </Link>

            {!hideNavigation && (
              <nav className="hidden items-center gap-6 text-sm md:flex ml-6">
                <a
                  href="/projects"
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  Projects
                </a>
                <a
                  href="/transparency"
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  Transparency
                </a>
                <a
                  href="/#how-it-works"
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  How it works
                </a>
              </nav>
            )}
          </div>
        </div>

        {/* Right: user controls */}
        <div className="flex items-center gap-4 w-48 justify-end">
          {user ? (
            <div className="flex items-center gap-2">
              <NotificationsPopover unreadCount={unreadCount} />
              <UserProfileMenu user={user} />
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <a
                href="/sign-in"
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                Sign in
              </a>
              <a
                href="/sign-up"
                className="inline-flex items-center justify-center rounded-lg bg-primary px-3 py-1 text-sm font-medium text-primary-foreground hover:bg-primary/90"
              >
                Get started
              </a>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
