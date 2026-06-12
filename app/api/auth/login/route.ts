import { NextRequest, NextResponse } from "next/server"
import { loginUser } from "../../../actions/auth"
import { cookies } from "next/headers"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const result = await loginUser(formData)
    
    console.log("[LOGIN API] Resultado:", result)
    
    if (result.success && result.user) {
      // Establecer cookie de sesión manual para compatibilidad con middleware
      const sessionPayload = {
        userId: result.user.id,
        role: result.user.role,
      }
      const sessionCookie = Buffer.from(JSON.stringify(sessionPayload)).toString("base64")
      const cookieStore = await cookies()
      cookieStore.set("session", sessionCookie, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 30 * 24 * 60 * 60, // 30 días
        path: "/",
      })

      console.log("[LOGIN API] Cookie establecida, redirigiendo a:", result.redirectTo)
      
      return NextResponse.json({
        success: true,
        redirectTo: result.redirectTo || "/patient/dashboard",
        user: result.user,
      })
    } else {
      console.log("[LOGIN API] Login fallido:", result)
      return NextResponse.json(result, { status: 401 })
    }
  } catch (error) {
    console.error("[LOGIN API] Error:", error)
    return NextResponse.json({ success: false, message: "Error en el servidor." }, { status: 500 })
  }
}
