import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { jwtVerify } from "jose"

const SECRET_KEY = "tu_clave_secreta_aqui"

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const sessionCookie = request.cookies.get("session")?.value

  let userId: string | null = null
  let role: "PATIENT" | "DOCTOR" | "ADMIN" | null = null

  if (sessionCookie) {
    try {
      const secret = new TextEncoder().encode(SECRET_KEY)
      const { payload } = await jwtVerify(sessionCookie, secret)
      userId = payload.userId as string
      role = payload.role as "PATIENT" | "DOCTOR" | "ADMIN"
    } catch (error) {
      // Token expirado o inválido: eliminar cookie y redirigir
      const response = NextResponse.redirect(new URL("/login", request.url))
      response.cookies.delete("session")
      return response
    }
  }

  // 1. Rutas protegidas
  const isPatientPath = pathname.startsWith("/patient")
  const isDoctorPath = pathname.startsWith("/doctor")
  const isAdminPath = pathname.startsWith("/admin")
  const isProtectedPath = isPatientPath || isDoctorPath || isAdminPath

  if (isProtectedPath) {
    if (!userId || !role) {
      return NextResponse.redirect(new URL("/login", request.url))
    }

    // Validación de Roles
    if (isPatientPath && role !== "PATIENT") {
      const target = role === "DOCTOR" ? "/doctor/dashboard" : "/admin/dashboard"
      return NextResponse.redirect(new URL(target, request.url))
    }
    if (isDoctorPath && role !== "DOCTOR") {
      const target = role === "PATIENT" ? "/patient/dashboard" : "/admin/dashboard"
      return NextResponse.redirect(new URL(target, request.url))
    }
    if (isAdminPath && role !== "ADMIN") {
      const target = role === "PATIENT" ? "/patient/dashboard" : "/doctor/dashboard"
      return NextResponse.redirect(new URL(target, request.url))
    }
  }

  // 2. Si ya está autenticado, no debería ir a Login o Register
  const isAuthPath = pathname === "/login" || pathname === "/register"
  if (isAuthPath && userId && role) {
    let dashboardPath = "/patient/dashboard"
    if (role === "DOCTOR") dashboardPath = "/doctor/dashboard"
    if (role === "ADMIN") dashboardPath = "/admin/dashboard"
    return NextResponse.redirect(new URL(dashboardPath, request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/patient/:path*",
    "/doctor/:path*",
    "/admin/:path*",
    "/login",
    "/register"
  ],
}
