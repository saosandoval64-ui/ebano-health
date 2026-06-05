import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"

interface ContactFormData {
  nombre: string
  email: string
  asunto: string
  mensaje: string
}

export async function POST(request: NextRequest) {
  try {
    const { nombre, email, asunto, mensaje } = await request.json() as ContactFormData

    if (!nombre || !email || !asunto || !mensaje) {
      return NextResponse.json(
        { success: false, message: "Todos los campos son requeridos" },
        { status: 400 }
      )
    }

    // Guardar en la base de datos (cuando se ejecute la migración)
    await db.contactForm.create({
      data: {
        nombre,
        email,
        asunto,
        mensaje,
        leido: false,
      },
    })

    return NextResponse.json(
      { success: true, message: "Mensaje enviado correctamente" },
      { status: 200 }
    )
  } catch (error) {
    console.error("Error al guardar contacto:", error)
    return NextResponse.json(
      { success: false, message: "Error al procesar tu solicitud" },
      { status: 500 }
    )
  }
}
