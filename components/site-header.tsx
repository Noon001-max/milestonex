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
  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-card/95 backdrop-blur-xl shadow-sm shadow-slate-900/5">
      <div className="mx-auto flex h-20 max-w-6xl items-center justify-between gap-4 px-4">
        <div className="flex items-center gap-3">
          {user && showMenuButton ? (
            <button
              type="button"
              onClick={onMenuClick}
              className="inline-flex items-center justify-center rounded-2xl border border-border px-2.5 py-2 text-foreground hover:border-primary/40 hover:bg-primary/10 transition-all duration-200 md:hidden active:scale-95"
              aria-label="Open menu"
            >
              <Menu className="size-5" />
            </button>
          ) : null}

          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/logo.png"
              alt="Milestone X"
              width={40}
              height={40}
              className="rounded-2xl"
            />
            <div>
              <p className="text-sm font-semibold tracking-tight text-foreground">
                Milestone X
              </p>
              <p className="text-[11px] uppercase tracking-[0.32em] text-muted-foreground">
                Trust, verified
              </p>
            </div>
          </Link>
        </div>

        <div className="flex-1">
          {!user && !hideNavigation && (
            <nav className="hidden items-center justify-center gap-10 text-sm md:flex">
              <a
                href="/projects"
                className="font-semibold text-muted-foreground transition-colors duration-200 hover:text-primary"
              >
                Projects
              </a>
              <a
                href="/transparency"
                className="font-semibold text-muted-foreground transition-colors duration-200 hover:text-primary"
              >
                Transparency
              </a>
              <a
                href="/#how-it-works"
                className="font-semibold text-muted-foreground transition-colors duration-200 hover:text-primary"
              >
                How it works
              </a>
            </nav>
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
                    className={`relative inline-flex items-center justify-center rounded-2xl border border-border px-3 py-2 text-muted-foreground hover:border-primary/40 hover:text-foreground transition-all duration-200 ${
                      unreadCount > 0 ? "animate-wiggle" : ""
                    }`}
                    title="Notifications"
                  >
                    <Bell className="size-5" />
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-destructive text-destructive-foreground text-[10px] font-bold ring-2 ring-background">
                        {unreadCount > 99 ? "99+" : unreadCount}
                      </span>
                    )}
                  </Link>

                  <Link
                    href="/dashboard/profile"
                    className="group inline-flex items-center gap-2.5 rounded-full border border-border px-2 py-1 transition-all duration-200 hover:border-primary/40 hover:bg-primary/10"
                    aria-label="Profile"
                  >
                    {user.image ? (
                      <div className="h-9 w-9 overflow-hidden rounded-full border-2 border-primary/20 transition-all duration-200">
                        <Image
                          src={user.image}
                          alt={`${user.name}'s avatar`}
                          width={36}
                          height={36}
                          className="h-full w-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-primary/20 bg-primary/10 text-xs font-bold text-primary">
                        {initials}
                      </div>
                    )}
                    <span className="hidden lg:block max-w-[100px] truncate text-xs font-semibold text-muted-foreground group-hover:text-foreground">
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
                className="text-sm font-semibold text-muted-foreground transition-colors duration-200 hover:text-foreground"
              >
                Sign in
              </a>
              <a
                href="/sign-up"
                className="inline-flex items-center justify-center rounded-full border border-primary/20 bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-colors duration-200 hover:bg-primary/90"
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
