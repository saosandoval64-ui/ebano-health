import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"

type Role = "PATIENT" | "DOCTOR" | "ADMIN"

const DASHBOARD_BY_ROLE: Record<Role, string> = {
  PATIENT: "/patient/dashboard",
  DOCTOR: "/doctor/dashboard",
  ADMIN: "/admin/dashboard",
}

export default async function proxy(req: Request) {
  const url = new URL(req.url)
  const pathname = url.pathname
  
  // Obtener sesión usando NextAuth
  const session = await auth()
  const role = session?.user?.role as Role | undefined
  
  const isLoggedIn = !!role

  // Rutas públicas (incluyendo NextAuth)
  const publicPaths = ["/login", "/register", "/", "/especialistas", "/contact", "/api/auth", "/api"]
  const isPublicPath = publicPaths.some((p) => pathname.startsWith(p))

  // Rutas de login/register
  const isLoginPath = pathname === "/login"
  const isLoginAdminPath = pathname === "/login/admin"
  const isLoginPatientPath = pathname === "/login/patient"
  const isLoginDoctorPath = pathname === "/login/doctor"
  const isRegisterPath = pathname === "/register"
  const isAnyLoginPath = isLoginPath || isLoginAdminPath || isLoginPatientPath || isLoginDoctorPath

  // Si es ruta pública, permitir
  if (isPublicPath) {
    const response = NextResponse.next()
    // Anti-caché en páginas de login/register
    if (isAnyLoginPath || isRegisterPath) {
      response.headers.set("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate")
      response.headers.set("Pragma", "no-cache")
      response.headers.set("Expires", "0")
    }
    return response
  }

  // Si no está autenticado, redirigir a login
  if (!isLoggedIn) {
    if (pathname.startsWith("/admin")) return NextResponse.redirect(new URL("/login/admin", url))
    if (pathname.startsWith("/doctor")) return NextResponse.redirect(new URL("/login/doctor", url))
    return NextResponse.redirect(new URL("/login/patient", url))
  }

  // Verificar acceso por rol
  if (pathname.startsWith("/patient") && role !== "PATIENT") {
    return NextResponse.redirect(new URL(DASHBOARD_BY_ROLE[role!], url))
  }

  if (pathname.startsWith("/doctor") && role !== "DOCTOR") {
    return NextResponse.redirect(new URL(DASHBOARD_BY_ROLE[role!], url))
  }

  if (pathname.startsWith("/admin") && role !== "ADMIN") {
    return NextResponse.redirect(new URL(DASHBOARD_BY_ROLE[role!], url))
  }

  // Anti-caché en rutas protegidas
  const isProtectedPath = pathname.startsWith("/patient") || pathname.startsWith("/doctor") || pathname.startsWith("/admin")
  const response = NextResponse.next()
  if (isProtectedPath) {
    response.headers.set("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate")
  }
  return response
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
}
