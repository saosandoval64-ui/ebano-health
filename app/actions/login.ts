"use server"

import { db } from "../../lib/db"
import bcrypt from "bcryptjs"
import { cookies } from "next/headers"
import { SignJWT } from "jose"

const SECRET_KEY = "tu_clave_secreta_aqui" 

export async function loginUser(formData: FormData) {
  const email = formData.get("email") as string
  const password = formData.get("password") as string

  // Buscar el usuario en la base de datos
  const user = await db.user.findUnique({ where: { email } })
  
  // Validar credenciales
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return { success: false, message: "Credenciales incorrectas" }
  }

  // Crear el token de sesión
  const secret = new TextEncoder().encode(SECRET_KEY)
  const token = await new SignJWT({ userId: user.id, role: user.role })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("24h")
    .sign(secret)

  // Guardar en cookies (await es requerido en Next.js App Router)
  const cookieStore = await cookies()
  cookieStore.set("session", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24, // 24 horas
    path: "/",
  })

  return { success: true, message: "Login exitoso", role: user.role }
}