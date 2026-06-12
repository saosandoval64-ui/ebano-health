import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import bcrypt from "bcryptjs"

export async function POST(request: NextRequest) {
  try {
    const { email, password, expectedRole } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ success: false, message: "Faltan datos obligatorios." }, { status: 400 })
    }

    const user = await db.user.findUnique({ where: { email } })
    if (!user) {
      return NextResponse.json({ success: false, message: "Credenciales incorrectas." }, { status: 401 })
    }

    const isValid = await bcrypt.compare(password, user.password)
    if (!isValid) {
      return NextResponse.json({ success: false, message: "Credenciales incorrectas." }, { status: 401 })
    }

    if (expectedRole && user.role !== expectedRole) {
      return NextResponse.json({ success: false, message: "No tienes acceso a este portal." }, { status: 403 })
    }

    const dashboards: Record<string, string> = {
      PATIENT: "/patient/dashboard",
      DOCTOR: "/doctor/dashboard",
      ADMIN: "/admin/dashboard",
    }

    return NextResponse.json({ 
      success: true, 
      role: user.role,
      redirectTo: dashboards[user.role] || "/patient/dashboard"
    })
  } catch (error) {
    console.error("Error en custom login:", error)
    return NextResponse.json({ success: false, message: "Error en el servidor." }, { status: 500 })
  }
}
