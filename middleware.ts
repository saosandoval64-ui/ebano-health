import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"

type Role = "PATIENT" | "DOCTOR" | "ADMIN" | "CLINIC_ADMIN"

const DASHBOARD_BY_ROLE: Record<Role, string> = {
  PATIENT: "/patient/dashboard",
  DOCTOR: "/doctor/dashboard",
  ADMIN: "/admin/dashboard",
  CLINIC_ADMIN: "/clinic-admin/dashboard",
}

export default async function proxy(req: Request) {
  const url = new URL(req.url)
  const pathname = url.pathname
  
  const session = await auth()
  const role = session?.user?.role as Role | undefined
  
  const isLoggedIn = !!role

  const publicPaths = ["/login", "/register", "/", "/especialistas", "/contact", "/api/auth", "/api", "/features"]
  const isPublicPath = publicPaths.some((p) => pathname.startsWith(p))

  const isLoginPath = pathname === "/login"
  const isLoginAdminPath = pathname === "/login/admin"
  const isLoginPatientPath = pathname === "/login/patient"
  const isLoginDoctorPath = pathname === "/login/doctor"
  const isLoginClinicPath = pathname === "/login/clinic-admin"
  const isRegisterPath = pathname === "/register"
  const isAnyLoginPath = isLoginPath || isLoginAdminPath || isLoginPatientPath || isLoginDoctorPath || isLoginClinicPath

  if (isPublicPath) {
    const response = NextResponse.next()
    if (isAnyLoginPath || isRegisterPath) {
      response.headers.set("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate")
      response.headers.set("Pragma", "no-cache")
      response.headers.set("Expires", "0")
    }
    return response
  }

  if (!isLoggedIn) {
    if (pathname.startsWith("/admin")) return NextResponse.redirect(new URL("/login/admin", url))
    if (pathname.startsWith("/clinic-admin")) return NextResponse.redirect(new URL("/login/clinic-admin", url))
    if (pathname.startsWith("/doctor")) return NextResponse.redirect(new URL("/login/doctor", url))
    return NextResponse.redirect(new URL("/login/patient", url))
  }

  if (pathname.startsWith("/patient") && role !== "PATIENT") {
    return NextResponse.redirect(new URL(DASHBOARD_BY_ROLE[role!], url))
  }

  if (pathname.startsWith("/doctor") && role !== "DOCTOR") {
    return NextResponse.redirect(new URL(DASHBOARD_BY_ROLE[role!], url))
  }

  if (pathname.startsWith("/admin") && role !== "ADMIN") {
    return NextResponse.redirect(new URL(DASHBOARD_BY_ROLE[role!], url))
  }

  if (pathname.startsWith("/clinic-admin") && role !== "CLINIC_ADMIN") {
    return NextResponse.redirect(new URL(DASHBOARD_BY_ROLE[role!], url))
  }

  const isProtectedPath = pathname.startsWith("/patient") || pathname.startsWith("/doctor") || pathname.startsWith("/admin") || pathname.startsWith("/clinic-admin")
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
