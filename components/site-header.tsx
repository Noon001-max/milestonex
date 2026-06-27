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
    <Link href="/" className="flex items-center gap-2.5 group">
      <Image
        src="/logo.png"
        alt="Milestone X"
        width={36}
        height={36}
        className="rounded-lg transition-transform duration-200 group-hover:scale-105"
      />
      <span className="text-base font-bold tracking-tight text-foreground">
        Milestone X
      </span>
    </Link>
  )

  return (
    <header className="sticky top-0 z-40 border-b border-border/50 bg-background/70 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60 shadow-sm">
      <div className="mx-auto grid h-16 max-w-6xl grid-cols-[auto_1fr_auto] items-center px-4">
        <div className="flex items-center min-w-[3rem]">
          {user ? (
            showMenuButton ? (
              <button
                type="button"
                onClick={onMenuClick}
                className="inline-flex items-center justify-center rounded-xl p-2 text-foreground hover:bg-secondary transition-all duration-200 md:hidden active:scale-95"
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
                  className="font-bold text-muted-foreground transition-all duration-200 hover:text-primary hover:-translate-y-0.5"
                >
                  Projects
                </a>
                <a
                  href="/transparency"
                  className="font-bold text-muted-foreground transition-all duration-200 hover:text-primary hover:-translate-y-0.5"
                >
                  Transparency
                </a>
                <a
                  href="/#how-it-works"
                  className="font-bold text-muted-foreground transition-all duration-200 hover:text-primary hover:-translate-y-0.5"
                >
                  How it works
                </a>
              </nav>
            )
          )}
        </div>

        <div className="flex items-center gap-4 justify-end min-w-[10rem]">
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
                    className={`relative p-2.5 rounded-xl hover:bg-secondary text-muted-foreground hover:text-foreground transition-all duration-200 hover:scale-105 ${
                      unreadCount > 0 ? "animate-wiggle" : ""
                    }`}
                    title="Notifications"
                  >
                    <Bell className="size-5" />
                    {unreadCount > 0 && (
                      <span className="absolute top-1 right-1 flex size-4.5 items-center justify-center rounded-full bg-destructive text-destructive-foreground text-[10px] font-bold ring-2 ring-background animate-pulse-subtle">
                        {unreadCount > 99 ? "99+" : unreadCount}
                      </span>
                    )}
                  </Link>

                  <Link
                    href="/dashboard/profile"
                    className="group flex items-center gap-2.5 rounded-full p-1 hover:bg-secondary/60 transition-all duration-200"
                    aria-label="Profile"
                  >
                    {user.image ? (
                      <div className="h-8 w-8 overflow-hidden rounded-full border-2 border-primary/20 ring-2 ring-transparent group-hover:ring-primary/10 transition-all duration-200">
                        <Image
                          src={user.image}
                          alt={`${user.name}'s avatar`}
                          width={32}
                          height={32}
                          className="h-full w-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/15 to-indigo-500/15 text-primary border-2 border-primary/20 flex items-center justify-center text-xs font-bold ring-2 ring-transparent group-hover:ring-primary/10 transition-all duration-200">
                        {initials}
                      </div>
                    )}
                    {/* Name on hover — desktop only */}
                    <span className="hidden lg:block text-xs font-bold text-muted-foreground group-hover:text-foreground transition-colors max-w-[100px] truncate">
                      {user.name.split(" ")[0]}
                    </span>
                  </Link>
                </div>
              )
            })()
          ) : (
            <div className="flex items-center gap-5">
              <a
                href="/sign-in"
                className="text-sm font-bold text-muted-foreground hover:text-foreground transition-colors duration-200"
              >
                Sign in
              </a>
              <a
                href="/sign-up"
                className="inline-flex items-center justify-center rounded-full bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground shadow-md shadow-primary/15 hover:shadow-primary/25 hover:scale-[1.03] active:scale-95 transition-all duration-200"
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
