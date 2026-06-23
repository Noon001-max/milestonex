import Link from "next/link"
import Image from "next/image"
import type { SessionUser } from "@/lib/session"
import { Bell, Menu } from "lucide-react"

export function SiteHeader({
  user,
  unreadCount = 0,
  hideNavigation = false,
  showMenuButton = false,
  onMenuClick,
}: {
  user: SessionUser | null
  unreadCount?: number
  hideNavigation?: boolean
  showMenuButton?: boolean
  onMenuClick?: () => void
}) {
  const renderLogo = () => (
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
  )

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center px-4">
        <div className="flex items-center">
          {user ? (
            showMenuButton ? (
              <button
                type="button"
                onClick={onMenuClick}
                className="inline-flex items-center justify-center rounded-md p-2 text-muted-foreground hover:bg-accent/50 md:hidden"
                aria-label="Open menu"
              >
                <Menu className="size-5" />
              </button>
            ) : null
          ) : (
            renderLogo()
          )}
        </div>

        <div className="flex flex-1 items-center justify-center">
          {user ? (
            renderLogo()
          ) : (
            !hideNavigation && (
              <nav className="hidden items-center gap-6 text-sm md:flex">
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
            )
          )}
        </div>

        <div className="flex items-center gap-4 justify-end">
          {user ? (
            (() => {
              const initials = user.name
                .split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase()

              return (
                <div className="flex items-center gap-2">
                  <Link
                    href="/dashboard/notifications"
                    className="relative p-2 rounded-lg hover:bg-muted transition-colors"
                    title="Notifications"
                  >
                    <Bell className="size-5 text-muted-foreground" />
                    {unreadCount > 0 && (
                      <span className="absolute top-1 right-1 flex size-4 items-center justify-center rounded-full bg-destructive text-destructive-foreground text-xs font-bold">
                        {unreadCount > 99 ? "99+" : unreadCount}
                      </span>
                    )}
                  </Link>

                  <Link
                    href="/dashboard/profile"
                    className="flex items-center gap-2 rounded-full p-1 hover:bg-muted transition-colors"
                    aria-label="Profile"
                  >
                    {user.image ? (
                      <div className="h-8 w-8 overflow-hidden rounded-full">
                        <Image
                          src={user.image}
                          alt={`${user.name}'s avatar`}
                          width={32}
                          height={32}
                          className="h-full w-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-semibold">
                        {initials}
                      </div>
                    )}
                  </Link>
                </div>
              )
            })()
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
