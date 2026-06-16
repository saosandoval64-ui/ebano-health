import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import Credentials from "next-auth/providers/credentials"
import { db } from "./db"
import bcrypt from "bcryptjs"
import { cookies } from "next/headers"
import { normalizeAvatar } from "./avatar"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      name: string
      email: string
      role: "PATIENT" | "DOCTOR" | "ADMIN" | "CLINIC_ADMIN"
      image?: string | null
    }
  }
  interface User {
    role?: "PATIENT" | "DOCTOR" | "ADMIN" | "CLINIC_ADMIN"
  }
}

declare module "@auth/core/jwt" {
  interface JWT {
    role?: "PATIENT" | "DOCTOR" | "ADMIN" | "CLINIC_ADMIN"
    id?: string
  }
}

export interface SessionPayload {
  userId: string
  role: "PATIENT" | "DOCTOR" | "ADMIN" | "CLINIC_ADMIN"
}

export const DASHBOARD_BY_ROLE: Record<string, string> = {
  PATIENT: "/patient/dashboard",
  DOCTOR: "/doctor/dashboard",
  ADMIN: "/admin/dashboard",
  CLINIC_ADMIN: "/clinic-admin/dashboard",
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
      ? [
          Google({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            authorization: {
              params: {
                prompt: "consent",
                access_type: "offline",
                response_type: "code",
              },
            },
          }),
        ]
      : []),
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Contraseña", type: "password" },
        expectedRole: { label: "Rol", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        const email = credentials.email as string
        const password = credentials.password as string
        const expectedRole = (credentials.expectedRole as string | undefined)?.toUpperCase()

        const user = await db.user.findUnique({ where: { email } })
        if (!user) return null

        const isValid = await bcrypt.compare(password, user.password)
        if (!isValid) return null

        if (expectedRole && user.role !== expectedRole) return null

        return {
          id: user.id,
          name: `${user.name}${user.lastName ? ` ${user.lastName}` : ""}`,
          email: user.email,
          role: user.role,
          image: user.avatar ? normalizeAvatar(user.avatar) : null,
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        token.role = user.role
        token.id = user.id
      }
      if (account?.provider === "google" && token.email) {
        const dbUser = await db.user.findUnique({
          where: { email: token.email },
          select: { role: true, id: true },
        })
        if (dbUser) {
          token.role = dbUser.role
          token.id = dbUser.id
        }
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role as "PATIENT" | "DOCTOR" | "ADMIN" | "CLINIC_ADMIN"
        session.user.id = token.id as string
      }
      return session
    },
  },
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 días
  },
  trustHost: true,
})

/**
 * Wrapper de compatibilidad: reemplaza la antigua getSessionPayload
 * usando la session de NextAuth, con fallback a cookie manual.
 */
export async function getSessionPayload(): Promise<SessionPayload | null> {
  const session = await auth()
  if (session?.user) {
    return {
      userId: session.user.id,
      role: session.user.role,
    }
  }
  
  // Fallback: leer cookie de sesión manual (compatibilidad con Server Actions)
  const cookieStore = await cookies()
  const sessionCookie = cookieStore.get("session")?.value
  if (sessionCookie) {
    try {
      const sessionData = JSON.parse(Buffer.from(sessionCookie, "base64").toString("utf-8"))
      if (sessionData.userId && sessionData.role) {
        return {
          userId: sessionData.userId,
          role: sessionData.role,
        }
      }
    } catch {
      // Cookie inválida, ignorar
    }
  }
  
  return null
}

/**
 * Wrapper de compatibilidad: reemplaza la antigua getCurrentUser
 * usando la session de NextAuth + DB.
 */
export async function getCurrentUser() {
  const payload = await getSessionPayload()
  if (!payload) return null

  try {
    const user = await db.user.findUnique({
      where: { id: payload.userId },
      include: {
        doctorProfile: true,
      },
    })
    return user
  } catch (error) {
    console.error("Error fetching current user:", error)
    return null
  }
}
