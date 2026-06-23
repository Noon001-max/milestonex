"use client"

import { useRouter } from "next/navigation"
import { signOut } from "@/lib/auth-client"
import { Button } from "@/components/ui/button"
import { MouseEvent } from "react"

type LogoutButtonProps = {
  className?: string
}

export function LogoutButton({ className }: LogoutButtonProps) {
  const router = useRouter()

  const handleLogout = async (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
    await signOut()
    router.push("/sign-in")
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
