"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Bell, X } from "lucide-react"
import { getMyNotifications, markNotificationRead } from "@/app/actions/notifications"

type Notification = {
  id: number
  title: string
  body: string
  read: boolean
  createdAt: Date
  type: string
}

export function NotificationsPopover({ unreadCount = 0 }: { unreadCount?: number }) {
  const [open, setOpen] = useState(false)
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (open && notifications.length === 0) {
      loadNotifications()
    }
  }, [open, notifications.length])

  const loadNotifications = async () => {
    setLoading(true)
    try {
      const data = await getMyNotifications()
      setNotifications(data as Notification[])
    } catch (error) {
      console.error("Failed to load notifications:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleMarkAsRead = async (id: number) => {
    try {
      await markNotificationRead(id)
      setNotifications(notifications.map(n => 
        n.id === id ? { ...n, read: true } : n
      ))
    } catch (error) {
      console.error("Failed to mark notification as read:", error)
    }
  }

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="relative p-2 rounded-lg hover:bg-muted transition-colors"
        title="Notifications"
      >
        <Bell className="size-5 text-muted-foreground" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 flex size-4 items-center justify-center rounded-full bg-destructive text-destructive-foreground text-xs font-bold">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setOpen(false)}
          />
          
          {/* Popover */}
          <div className="absolute right-0 mt-2 w-96 max-h-[500px] rounded-lg border border-border bg-background shadow-lg z-50 flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-border p-4">
              <h3 className="font-semibold text-foreground">Notifications</h3>
              <button
                onClick={() => setOpen(false)}
                className="p-1 hover:bg-muted rounded transition-colors"
              >
                <X className="size-4" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto">
              {loading ? (
                <div className="p-4 text-center text-sm text-muted-foreground">
                  Loading notifications...
                </div>
              ) : notifications.length === 0 ? (
                <div className="p-4 text-center text-sm text-muted-foreground">
                  No notifications yet
                </div>
              ) : (
                <div className="divide-y divide-border">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-4 cursor-pointer transition-colors ${
                        notification.read
                          ? "bg-background hover:bg-muted/50"
                          : "bg-primary/5 hover:bg-primary/10"
                      }`}
                      onClick={() => handleMarkAsRead(notification.id)}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <h4 className="font-medium text-foreground text-sm">
                            {notification.title}
                          </h4>
                          <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                            {notification.body}
                          </p>
                          <span className="text-xs text-muted-foreground mt-2 block">
                            {new Date(notification.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        {!notification.read && (
                          <div className="flex-shrink-0 w-2 h-2 rounded-full bg-primary mt-1" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {notifications.length > 0 && (
              <div className="border-t border-border p-4 flex justify-center">
                <Link
                  href="/dashboard/notifications"
                  className="text-sm text-primary hover:underline font-medium"
                  onClick={() => setOpen(false)}
                >
                  View all notifications
                </Link>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}
