import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { getSessionPayload } from "@/lib/auth"
import type { User } from "@prisma/client"

export async function PUT(request: NextRequest) {
  try {
    const session = await getSessionPayload()
    if (!session) {
      return NextResponse.json(
        { success: false, message: "No autorizado" },
        { status: 401 }
      )
    }

    const { avatar } = await request.json() as { avatar: unknown }

    if (!avatar) {
      return NextResponse.json(
        { success: false, message: "Avatar no proporcionado" },
        { status: 400 }
      )
    }

    // Nota: Este endpoint funciona después de ejecutar las migraciones de Prisma
    const user = await db.user.update({
      where: { id: session.userId },
      data: { avatar: String(avatar) },
    })

    const typedUser = user as User & { avatar?: string }

    return NextResponse.json(
      { success: true, avatar: typedUser.avatar },
      { status: 200 }
    )
  } catch (error) {
    console.error("Error al actualizar avatar:", error)
    return NextResponse.json(
      { success: false, message: "Error al actualizar avatar" },
      { status: 500 }
    )
  }
}
