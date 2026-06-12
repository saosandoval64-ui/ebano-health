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

    const avatarStr = String(avatar)

    // Validar: si es data URL (base64), verificar tamaño < 5MB
    if (avatarStr.startsWith("data:")) {
      const sizeInBytes = (avatarStr.length * 3) / 4
      if (sizeInBytes > 5 * 1024 * 1024) {
        return NextResponse.json(
          { success: false, message: "La imagen no debe superar los 5MB" },
          { status: 400 }
        )
      }
    }

    const user = await db.user.update({
      where: { id: session.userId },
      data: { avatar: avatarStr },
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
