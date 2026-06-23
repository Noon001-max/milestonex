"use client"

import { signOut } from "@/lib/auth-client"
import { Button } from "@/components/ui/button"
import { MouseEvent } from "react"

type LogoutButtonProps = {
  className?: string
}

export function LogoutButton({ className }: LogoutButtonProps) {
  const handleLogout = async (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
    await signOut()
  }

  return (
    <Button
      type="button"
      variant="destructive"
      className={className}
      onClick={handleLogout}
    >
      Log out
    </Button>
  )
}
