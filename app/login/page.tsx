"use client"

import { Suspense, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useSession } from "next-auth/react"
import { Loader2 } from "lucide-react"
import Logo from "@/components/Logo"

function LoginPageInner() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { data: session, status } = useSession()

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
      case "clinicadmin":
        router.replace("/login/clinic-admin")
        break
      case "patient":
      default:
        router.replace("/login/patient")
        break
    }
  }, [router, searchParams])

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

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen text-black font-sans antialiased flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <Logo size="md" />
            <Loader2 className="h-6 w-6 animate-spin text-black/40" />
            <p className="text-sm text-black/50">Cargando...</p>
          </div>
        </div>
      }
    >
      <LoginPageInner />
    </Suspense>
  )
}
