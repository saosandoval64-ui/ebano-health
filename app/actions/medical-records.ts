"use server"

import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { revalidatePath } from "next/cache"

export async function getPatientMedicalRecords(patientId: string) {
  const session = await auth()
  if (!session?.user) return []

  return db.medicalRecord.findMany({
    where: { patientId },
    include: {
      doctor: {
        include: { user: { select: { name: true, lastName: true } } },
      },
      appointment: true,
    },
    orderBy: { consultationDate: "desc" },
  })
}

export async function getDoctorMedicalRecords(doctorProfileId: string) {
  const session = await auth()
  if (!session?.user) return []

  return db.medicalRecord.findMany({
    where: { doctorId: doctorProfileId },
    include: {
      patient: { select: { name: true, lastName: true, dni: true, avatar: true } },
      appointment: true,
    },
    orderBy: { consultationDate: "desc" },
  })
}

export async function createMedicalRecord(data: {
  patientId: string
  appointmentId?: string
  reason: string
  diagnosis: string
  treatment?: string
  notes?: string
  prescriptions?: string
  vitalSigns?: string
  followUpDate?: string
  followUpNotes?: string
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
    const record = await db.medicalRecord.create({
      data: {
        patientId: data.patientId,
        doctorId: doctorProfile.id,
        appointmentId: data.appointmentId || null,
        reason: data.reason,
        diagnosis: data.diagnosis,
        treatment: data.treatment || null,
        notes: data.notes || null,
        prescriptions: data.prescriptions || null,
        vitalSigns: data.vitalSigns || null,
        followUpDate: data.followUpDate ? new Date(data.followUpDate) : null,
        followUpNotes: data.followUpNotes || null,
      },
    })

    // Create notification for patient
    await db.notification.create({
      data: {
        userId: data.patientId,
        type: "MEDICAL_RECORD",
        title: "Nueva historia clínica",
        message: `Tu médico ha registrado una nueva consulta. Diagnóstico: ${data.diagnosis}`,
        metadata: JSON.stringify({ recordId: record.id }),
      },
    })

    revalidatePath("/doctor/medical-records")
    revalidatePath("/patient/medical-history")
    return { success: true, message: "Registro creado exitosamente" }
  } catch {
    return { success: false, message: "Error al crear el registro" }
  }
}

export async function updateMedicalRecord(
  recordId: string,
  data: {
    reason?: string
    diagnosis?: string
    treatment?: string
    notes?: string
    prescriptions?: string
    vitalSigns?: string
    followUpDate?: string
    followUpNotes?: string
  }
) {
  const session = await auth()
  if (!session?.user || session.user.role !== "DOCTOR") {
    return { success: false, message: "No autorizado" }
  }

  try {
    await db.medicalRecord.update({
      where: { id: recordId },
      data: {
        ...data,
        followUpDate: data.followUpDate ? new Date(data.followUpDate) : undefined,
      },
    })

    revalidatePath("/doctor/medical-records")
    revalidatePath("/patient/medical-history")
    return { success: true, message: "Registro actualizado" }
  } catch {
    return { success: false, message: "Error al actualizar" }
  }
}

export async function deleteMedicalRecord(recordId: string) {
  const session = await auth()
  if (!session?.user || session.user.role !== "DOCTOR") {
    return { success: false, message: "No autorizado" }
  }

  try {
    await db.medicalRecord.delete({ where: { id: recordId } })
    revalidatePath("/doctor/medical-records")
    revalidatePath("/patient/medical-history")
    return { success: true, message: "Registro eliminado" }
  } catch {
    return { success: false, message: "Error al eliminar" }
  }
}
