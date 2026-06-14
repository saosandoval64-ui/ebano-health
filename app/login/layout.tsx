"use client"

import { useSession } from "next-auth/react"
import { useRouter, usePathname } from "next/navigation"
import { useEffect } from "react"
import Logo from "@/components/Logo"

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const pathname = usePathname()

  // Solo redirigir desde la página genérica /login, no desde /login/admin, /login/doctor, /login/patient
  const isGenericLoginPage = pathname === "/login"

  useEffect(() => {
    if (status === "authenticated" && session?.user?.role && isGenericLoginPage) {
      const dashboards: Record<string, string> = {
        PATIENT: "/patient/dashboard",
        DOCTOR: "/doctor/dashboard",
        ADMIN: "/admin/dashboard",
      }
      const target = dashboards[session.user.role] || "/patient/dashboard"
      router.replace(target)
    }
  }, [status, session, router, isGenericLoginPage])

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Logo size="md" />
          <div className="w-6 h-6 border-2 border-black/20 border-t-black rounded-full animate-spin" />
        </div>
      </div>
    )
  }

  if (status === "authenticated" && isGenericLoginPage) {
    return null
  }

  return <>{children}</>
}
