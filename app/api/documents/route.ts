import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { supabase } from "@/lib/supabase"
import { db } from "@/lib/db"

const ALLOWED_TYPES = [
  "application/pdf",
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]
const MAX_SIZE_BYTES = 10 * 1024 * 1024 // 10 MB

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user || session.user.role !== "DOCTOR") {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const doctorProfile = await db.doctorProfile.findUnique({
      where: { userId: session.user.id },
      select: { id: true },
    })
    if (!doctorProfile) {
      return NextResponse.json({ error: "Perfil de médico no encontrado" }, { status: 404 })
    }

    const formData = await request.formData()
    const file = formData.get("file") as File | null
    const patientId = formData.get("patientId") as string | null
    const title = formData.get("title") as string | null
    const fileType = formData.get("fileType") as string | null
    const description = formData.get("description") as string | null

    if (!file || !patientId || !title || !fileType) {
      return NextResponse.json({ error: "Faltan campos requeridos" }, { status: 400 })
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: "Tipo de archivo no permitido. Solo PDF e imágenes." },
        { status: 400 }
      )
    }

    if (file.size > MAX_SIZE_BYTES) {
      return NextResponse.json(
        { error: "El archivo supera el límite de 10 MB" },
        { status: 400 }
      )
    }

    // Verificar que el médico tenga una cita con este paciente
    const hasRelation = await db.appointment.findFirst({
      where: { doctorId: doctorProfile.id, patientId },
      select: { id: true },
    })
    if (!hasRelation) {
      return NextResponse.json(
        { error: "No tenés citas registradas con este paciente" },
        { status: 403 }
      )
    }

    const ext = file.name.split(".").pop() ?? "bin"
    const fileName = `${doctorProfile.id}/${patientId}/${Date.now()}.${ext}`

    const arrayBuffer = await file.arrayBuffer()
    const { error: uploadError } = await supabase.storage
      .from("medical-documents")
      .upload(fileName, arrayBuffer, {
        contentType: file.type,
        upsert: false,
      })

    if (uploadError) {
      console.error("[DOCUMENTS API] Supabase upload error:", uploadError)
      return NextResponse.json(
        { error: "Error al subir el archivo. Intentá de nuevo." },
        { status: 500 }
      )
    }

    const { data: urlData } = supabase.storage
      .from("medical-documents")
      .getPublicUrl(fileName)

    const doc = await db.medicalDocument.create({
      data: {
        title,
        fileType,
        fileUrl: urlData.publicUrl,
        description: description ?? null,
        patientId,
        doctorId: doctorProfile.id,
      },
    })

    return NextResponse.json({ success: true, document: doc })
  } catch (error) {
    console.error("[DOCUMENTS API] Error:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}
