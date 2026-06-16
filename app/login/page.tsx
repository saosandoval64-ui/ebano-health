"use client"

import { useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useSession } from "next-auth/react"
import { Loader2 } from "lucide-react"
import Logo from "@/components/Logo"

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { data: session, status } = useSession()

  // Si ya está autenticado, no hacer nada - dejar que el layout redirija
  if (status === "authenticated" && session?.user?.role) {
    return (
      <div className="min-h-screen text-black font-sans antialiased flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Logo size="md" />
          <Loader2 className="h-6 w-6 animate-spin text-black/40" />
          <p className="text-sm text-black/50">Redirigiendo...</p>
        </div>
      </div>
    )
  }

  useEffect(() => {
    const role = searchParams.get("role")

    switch (role) {
      case "doctor":
        router.replace("/login/doctor")
        break
      case "admin":
        router.replace("/login/admin")
        break
      case "secretary":
        router.replace("/login/secretary")
        break
      case "patient":
      default:
        router.replace("/login/patient")
        break
    }
  }, [router, searchParams])

  if (status === "loading") {
    return (
      <div className="min-h-screen text-black font-sans antialiased flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Logo size="md" />
          <Loader2 className="h-6 w-6 animate-spin text-black/40" />
          <p className="text-sm text-black/50">Redirigiendo...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen text-black font-sans antialiased flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <Logo size="md" />
        <Loader2 className="h-6 w-6 animate-spin text-black/40" />
        <p className="text-sm text-black/50">Redirigiendo...</p>
      </div>
    </div>
  )
}
