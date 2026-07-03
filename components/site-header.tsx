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
    <Link href="/" className="flex items-center gap-3 group">
      <Image
        src="/logo.png"
        alt="Milestone X"
        width={44}
        height={44}
        className="rounded-2xl transition-transform duration-200 group-hover:scale-105"
      />
      <span className="text-lg font-bold tracking-tight text-foreground">
        Milestone X
      </span>
    </Link>
  )

  return (
    <header className="sticky top-0 z-40 border-b border-border/20 bg-background/60 dark:bg-background/60 backdrop-blur-xl shadow-sm">
      <div className="mx-auto grid h-18 max-w-6xl grid-cols-[auto_1fr_auto] items-center px-4 py-2">
        <div className="flex items-center min-w-[4rem]">
          {user ? (
            showMenuButton ? (
              <button
                type="button"
                onClick={onMenuClick}
                className="inline-flex items-center justify-center rounded-lg p-2 text-foreground hover:bg-muted transition-all duration-200 md:hidden active:scale-95"
                aria-label="Open menu"
              >
                <Menu className="size-5" />
              </button>
            ) : null
          ) : (
            renderLogo()
          )}
        </div>

        <div className="flex items-center justify-center">
          {user ? (
            renderLogo()
          ) : (
            !hideNavigation && (
              <nav className="hidden items-center gap-8 text-sm md:flex">
                <a
                  href="/projects"
                  className="font-medium text-muted-foreground transition-colors duration-200 hover:text-primary"
                >
                  Projects
                </a>
                <a
                  href="/transparency"
                  className="font-medium text-muted-foreground transition-colors duration-200 hover:text-primary"
                >
                  Transparency
                </a>
                <a
                  href="/#how-it-works"
                  className="font-medium text-muted-foreground transition-colors duration-200 hover:text-primary"
                >
                  How it works
                </a>
              </nav>
            )
          )}
        </div>

        <div className="flex items-center gap-3 justify-end min-w-[10rem]">
          {user ? (
            (() => {
              const initials = user.name
                .split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase()

              return (
                <div className="flex items-center gap-3">
                  <Link
                    href="/dashboard/notifications"
                    className={`relative p-2 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-all duration-200 ${
                      unreadCount > 0 ? "animate-wiggle" : ""
                    }`}
                    title="Notifications"
                  >
                    <Bell className="size-5" />
                    {unreadCount > 0 && (
                      <span className="absolute top-0 right-0 flex size-5 items-center justify-center rounded-full bg-destructive text-destructive-foreground text-[10px] font-bold ring-2 ring-background">
                        {unreadCount > 99 ? "99+" : unreadCount}
                      </span>
                    )}
                  </Link>

                  <Link
                    href="/dashboard/profile"
                    className="group flex items-center gap-2 rounded-lg p-1 hover:bg-muted transition-all duration-200"
                    aria-label="Profile"
                  >
                    {user.image ? (
                      <div className="h-8 w-8 overflow-hidden rounded-full border border-border">
                        <Image
                          src={user.image}
                          alt={`${user.name}'s avatar`}
                          width={36}
                          height={36}
                          className="h-full w-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-muted text-foreground border border-border flex items-center justify-center text-xs font-bold">
                        {initials}
                      </div>
                    )}
                    <span className="hidden lg:block text-xs font-medium text-muted-foreground group-hover:text-foreground transition-colors max-w-[100px] truncate">
                      {user.name.split(" ")[0]}
                    </span>
                  </Link>
                </div>
              )
            })()
          ) : (
            <div className="flex items-center gap-4">
              <a
                href="/sign-in"
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors duration-200"
              >
                Sign in
              </a>
              <a
                href="/sign-up"
                className="inline-flex items-center justify-center rounded-lg bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground shadow-md hover:bg-primary/90 transition-all duration-200"
              >
                Get Started
              </a>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
