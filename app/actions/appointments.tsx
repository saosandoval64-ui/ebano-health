"use server"

import { db } from "../../lib/db"
import { getSessionPayload } from "../../lib/auth"
import { revalidatePath } from "next/cache"

// Obtener los horarios ocupados de un médico en un día
export async function getDoctorBookedSlots(doctorId: string, dateStr: string) {
  try {
    const startOfDay = new Date(`${dateStr}T00:00:00`)
    const endOfDay = new Date(`${dateStr}T23:59:59`)

    const appointments = await db.appointment.findMany({
      where: {
        doctorId,
        dateTime: {
          gte: startOfDay,
          lte: endOfDay,
        },
        status: {
          in: ["RESERVED", "PENDING"],
        },
      },
      select: {
        dateTime: true,
      },
    })

    return appointments.map((app) => {
      const hours = String(app.dateTime.getHours()).padStart(2, "0")
      const minutes = String(app.dateTime.getMinutes()).padStart(2, "0")
      return `${hours}:${minutes}`
    })
  } catch (error) {
    console.error("Error fetching booked slots:", error)
    return []
  }
}

// Reservar un turno
export async function bookAppointment(formData: FormData) {
  const session = await getSessionPayload()
  if (!session) {
    return { success: false, message: "Debes iniciar sesión para reservar una cita." }
  }

  const doctorId = formData.get("doctorId") as string
  const dateStr = formData.get("date") as string // AAAA-MM-DD
  const timeStr = formData.get("time") as string // HH:MM

  if (!doctorId || !dateStr || !timeStr) {
    return { success: false, message: "Faltan seleccionar datos de fecha u hora." }
  }

  try {
    const dateTime = new Date(`${dateStr}T${timeStr}:00`)

    const existing = await db.appointment.findFirst({
      where: {
        doctorId,
        dateTime,
        status: {
          in: ["RESERVED", "PENDING"],
        },
      },
    })

    if (existing) {
      return { success: false, message: "Este horario ya ha sido reservado. Por favor elige otro." }
    }

    await db.appointment.create({
      data: {
        patientId: session.userId,
        doctorId,
        dateTime,
        status: "RESERVED",
      },
    })

    revalidatePath(`/especialistas/${doctorId}`)
    revalidatePath("/patient/dashboard")
    revalidatePath("/patient/appointments")

    return { success: true, message: "¡Cita reservada con éxito!" }
  } catch (error) {
    console.error("Error booking appointment:", error)
    return { success: false, message: "Ocurrió un error al reservar el turno." }
  }
}

// Cancelar una cita
export async function cancelAppointment(appointmentId: string) {
  const session = await getSessionPayload()
  if (!session) {
    return { success: false, message: "No autorizado." }
  }

  try {
    const app = await db.appointment.findUnique({
      where: { id: appointmentId },
    })

    if (!app) {
      return { success: false, message: "Turno no encontrado." }
    }

    if (session.role === "PATIENT" && app.patientId !== session.userId) {
      return { success: false, message: "No tienes permiso para cancelar este turno." }
    }

    if (session.role === "DOCTOR") {
      const docProfile = await db.doctorProfile.findUnique({
        where: { userId: session.userId },
      })
      if (!docProfile || app.doctorId !== docProfile.id) {
        return { success: false, message: "No tienes permiso para cancelar este turno." }
      }
    }

    await db.appointment.update({
      where: { id: appointmentId },
      data: { status: "CANCELLED" },
    })

    revalidatePath("/patient/dashboard")
    revalidatePath("/patient/appointments")
    revalidatePath("/doctor/dashboard")
    revalidatePath("/doctor/appointments")
    revalidatePath("/admin/dashboard")
    revalidatePath("/admin/appointments")

    return { success: true, message: "Turno cancelado exitosamente." }
  } catch (error) {
    console.error("Error cancelling appointment:", error)
    return { success: false, message: "Error al cancelar." }
  }
}

// Marcar cita como completada
export async function completeAppointment(appointmentId: string) {
  const session = await getSessionPayload()
  if (!session || (session.role !== "DOCTOR" && session.role !== "ADMIN")) {
    return { success: false, message: "No autorizado." }
  }

  try {
    await db.appointment.update({
      where: { id: appointmentId },
      data: { status: "COMPLETED" },
    })

    revalidatePath("/doctor/dashboard")
    revalidatePath("/doctor/appointments")
    revalidatePath("/admin/dashboard")
    revalidatePath("/admin/appointments")

    return { success: true, message: "Consulta marcada como completada." }
  } catch (error) {
    console.error("Error completing appointment:", error)
    return { success: false, message: "Error al completar." }
  }
}

// Actualizar perfil de médico por sí mismo
export async function updateDoctorSelfProfile(formData: FormData) {
  const session = await getSessionPayload()
  if (!session || session.role !== "DOCTOR") {
    return { success: false, message: "No autorizado." }
  }

  const name = formData.get("name") as string
  const lastName = formData.get("lastName") as string
  const phone = formData.get("phone") as string
  const specialty = formData.get("specialty") as string
  const license = formData.get("license") as string
  const bio = formData.get("bio") as string

  if (!name || !lastName || !specialty || !license) {
    return { success: false, message: "Campos requeridos vacíos." }
  }

  try {
    await db.user.update({
      where: { id: session.userId },
      data: {
        name,
        lastName,
        phone: phone || null,
        doctorProfile: {
          update: {
            specialty,
            license,
            bio: bio || null,
          },
        },
      },
    })

    revalidatePath("/doctor/dashboard")
    revalidatePath("/doctor/availability")

    return { success: true, message: "Perfil y configuración guardados correctamente." }
  } catch (error) {
    console.error("Error updating doctor self profile:", error)
    return { success: false, message: "Error al guardar el perfil en el servidor." }
  }
}
