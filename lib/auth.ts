import { cookies } from "next/headers"
import { jwtVerify } from "jose"
import { db } from "./db"

const SECRET_KEY = "tu_clave_secreta_aqui"

export interface SessionPayload {
  userId: string
  role: "PATIENT" | "DOCTOR" | "ADMIN"
}

export async function getSessionPayload(): Promise<SessionPayload | null> {
  try {
    const cookieStore = await cookies()
    const sessionToken = cookieStore.get("session")?.value

    if (!sessionToken) return null

    const secret = new TextEncoder().encode(SECRET_KEY)
    const { payload } = await jwtVerify(sessionToken, secret)
    
    return payload as unknown as SessionPayload
  } catch (error) {
    console.error("Error verifying session:", error)
    return null
  }
}

export async function getCurrentUser() {
  const payload = await getSessionPayload()
  if (!payload) return null

  try {
    const user = await db.user.findUnique({
      where: { id: payload.userId },
      include: {
        doctorProfile: true
      }
    })
    return user
  } catch (error) {
    console.error("Error fetching current user:", error)
    return null
  }
}
