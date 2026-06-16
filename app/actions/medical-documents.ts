"use server"

import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { revalidatePath } from "next/cache"

export async function getPatientDocuments(patientId: string) {
  const session = await auth()
  if (!session?.user) return []

  return db.medicalDocument.findMany({
    where: { patientId },
    include: {
      doctor: {
        include: { user: { select: { name: true, lastName: true } } },
      },
    },
    orderBy: { uploadedAt: "desc" },
  })
}

export async function uploadDocument(data: {
  patientId: string
  title: string
  description?: string
  fileUrl: string
  fileType: string
}) {
  const session = await auth()
  if (!session?.user || session.user.role !== "DOCTOR") {
    return { success: false, message: "No autorizado" }
  }

  const doctorProfile = await db.doctorProfile.findUnique({
    where: { userId: session.user.id },
  })
  if (!doctorProfile) {
    return { success: false, message: "Perfil de médico no encontrado" }
  }

  try {
    await db.medicalDocument.create({
      data: {
        patientId: data.patientId,
        doctorId: doctorProfile.id,
        title: data.title,
        description: data.description || null,
        fileUrl: data.fileUrl,
        fileType: data.fileType,
      },
    })

    await db.notification.create({
      data: {
        userId: data.patientId,
        type: "MEDICAL_DOCUMENT",
        title: "Nuevo documento médico",
        message: `Tu médico ha subido un nuevo documento: ${data.title}`,
      },
    })

    revalidatePath("/doctor/documents")
    revalidatePath("/patient/documents")
    return { success: true, message: "Documento subido exitosamente" }
  } catch {
    return { success: false, message: "Error al subir el documento" }
  }
}

export async function deleteDocument(id: string) {
  const session = await auth()
  if (!session?.user || session.user.role !== "DOCTOR") {
    return { success: false, message: "No autorizado" }
  }

  try {
    await db.medicalDocument.delete({ where: { id } })
    revalidatePath("/doctor/documents")
    revalidatePath("/patient/documents")
    return { success: true, message: "Documento eliminado" }
  } catch {
    return { success: false, message: "Error al eliminar" }
  }
}
