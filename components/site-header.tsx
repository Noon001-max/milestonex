"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useTheme } from "next-themes"
import type { SessionUser } from "@/lib/session"
import { Bell, Menu, Moon, Sun, X } from "lucide-react"

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

  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <header className="sticky top-0 z-40 border-b border-border/20 bg-background/60 dark:bg-background/60 backdrop-blur-xl shadow-sm">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-2 px-3 py-2 sm:h-18 sm:px-4">
        <div className="flex min-w-0 flex-1 items-center">
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
            <div className="min-w-0">
              {renderLogo()}
            </div>
          )}
        </div>

        <div className="flex min-w-0 flex-1 items-center justify-center">
          {user ? (
            <div className="min-w-0">
              {renderLogo()}
            </div>
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

        <div className="flex flex-1 items-center justify-end">
          {user ? (
            <div className="flex items-center gap-2 sm:gap-3">
              <Link
                href="/dashboard/notifications"
                className={`relative hidden p-2 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-all duration-200 sm:inline-flex ${
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
                className="group hidden items-center gap-2 rounded-lg p-1 hover:bg-muted transition-all duration-200 sm:flex"
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
          ) : (
            <div className="hidden items-center gap-2 sm:flex sm:gap-4">
              <a
                href="/sign-in"
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors duration-200"
              >
                Sign in
              </a>
              <a
                href="/sign-up"
                className="inline-flex items-center justify-center rounded-lg bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground shadow-md hover:bg-primary/90 transition-all duration-200 sm:px-5"
              >
                Get Started
              </a>
            </div>
          )}

          <button
            type="button"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="inline-flex items-center justify-center rounded-lg p-2 text-foreground hover:bg-muted transition-all duration-200 active:scale-95"
            aria-label="Toggle theme"
          >
            {mounted && theme === "dark" ? (
              <Sun className="size-5" />
            ) : (
              <Moon className="size-5" />
            )}
          </button>

          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="inline-flex items-center justify-center rounded-lg p-2 text-foreground hover:bg-muted transition-all duration-200 md:hidden active:scale-95"
            aria-label="Open navigation menu"
          >
            {mobileMenuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="border-t border-border/50 bg-background/95 px-3 py-4 shadow-sm backdrop-blur md:hidden">
          <div className="flex flex-col gap-3">
            {!user ? (
              <>
                <a
                  href="/sign-in"
                  className="rounded-lg px-3 py-2 text-sm font-medium text-foreground hover:bg-muted"
                >
                  Sign in
                </a>
                <a
                  href="/sign-up"
                  className="rounded-lg bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground text-center"
                >
                  Get Started
                </a>
              </>
            ) : (
              <>
                <Link
                  href="/dashboard/notifications"
                  className="flex items-center justify-between rounded-lg px-3 py-2 text-sm font-medium text-foreground hover:bg-muted"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span>Notifications</span>
                  {unreadCount > 0 && (
                    <span className="rounded-full bg-destructive px-2 py-0.5 text-[10px] font-bold text-destructive-foreground">
                      {unreadCount > 99 ? "99+" : unreadCount}
                    </span>
                  )}
                </Link>
                <Link
                  href="/dashboard/profile"
                  className="rounded-lg px-3 py-2 text-sm font-medium text-foreground hover:bg-muted"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Profile
                </Link>
              </>
            )}

            {!hideNavigation && (
              <>
                <a
                  href="/projects"
                  className="rounded-lg px-3 py-2 text-sm font-medium text-foreground hover:bg-muted"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Projects
                </a>
                <a
                  href="/transparency"
                  className="rounded-lg px-3 py-2 text-sm font-medium text-foreground hover:bg-muted"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Transparency
                </a>
                <a
                  href="/#how-it-works"
                  className="rounded-lg px-3 py-2 text-sm font-medium text-foreground hover:bg-muted"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  How it works
                </a>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
