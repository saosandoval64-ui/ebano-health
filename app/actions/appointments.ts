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

// Obtener la disponibilidad semanal de un médico
export async function getDoctorAvailability(doctorId: string) {
  try {
    const availability = await db.availability.findMany({
      where: { doctorId },
      orderBy: { dayOfWeek: "asc" },
    })
    return availability.map((a) => ({
      dayOfWeek: a.dayOfWeek,
      startTime: a.startTime,
      endTime: a.endTime,
      isActive: a.isActive,
    }))
  } catch (error) {
    console.error("Error fetching availability:", error)
    return []
  }
}

// Guardar disponibilidad semanal del médico
export async function saveDoctorAvailability(formData: FormData) {
  const session = await getSessionPayload()
  if (!session || session.role !== "DOCTOR") {
    return { success: false, message: "No autorizado." }
  }

  try {
    const doctorProfile = await db.doctorProfile.findUnique({
      where: { userId: session.userId },
    })
    if (!doctorProfile) {
      return { success: false, message: "Perfil de médico no encontrado." }
    }

    const daysRaw = formData.get("days") as string
    if (!daysRaw) {
      return { success: false, message: "No se recibieron días." }
    }

    const days = JSON.parse(daysRaw) as {
      dayOfWeek: number
      startTime: string
      endTime: string
      isActive: boolean
    }[]

    // Eliminar entries existentes y crear nuevas (upsert no es práctico para bulk)
    await db.availability.deleteMany({
      where: { doctorId: doctorProfile.id },
    })

    if (days.length > 0) {
      await db.availability.createMany({
        data: days.map((d) => ({
          doctorId: doctorProfile.id,
          dayOfWeek: d.dayOfWeek,
          startTime: d.startTime,
          endTime: d.endTime,
          isActive: d.isActive,
        })),
      })
    }

    revalidatePath("/doctor/availability")

    return { success: true, message: "Disponibilidad guardada correctamente." }
  } catch (error) {
    console.error("Error saving availability:", error)
    return { success: false, message: "Error al guardar disponibilidad." }
  }
}

// --- Seguir/Dejar de seguir médicos ---

export async function toggleFollowDoctor(doctorProfileId: string) {
  const session = await getSessionPayload()
  if (!session || session.role !== "PATIENT") {
    return { success: false, message: "Debes iniciar sesión como paciente." }
  }

  try {
    const existing = await db.favoriteDoctor.findUnique({
      where: { patientId_doctorId: { patientId: session.userId, doctorId: doctorProfileId } },
    })

    if (existing) {
      await db.favoriteDoctor.delete({ where: { id: existing.id } })
      revalidatePath(`/especialistas/${doctorProfileId}`)
      revalidatePath("/patient/dashboard")
      return { success: true, following: false, message: "Dejaste de seguir a este médico." }
    } else {
      await db.favoriteDoctor.create({
        data: { patientId: session.userId, doctorId: doctorProfileId },
      })
      revalidatePath(`/especialistas/${doctorProfileId}`)
      revalidatePath("/patient/dashboard")
      return { success: true, following: true, message: "Ahora sigues a este médico." }
    }
  } catch (error) {
    console.error("Error toggling follow:", error)
    return { success: false, message: "Error al seguir/dejar de seguir." }
  }
}

export async function isFollowingDoctor(doctorProfileId: string) {
  const session = await getSessionPayload()
  if (!session) return false

  try {
    const existing = await db.favoriteDoctor.findUnique({
      where: { patientId_doctorId: { patientId: session.userId, doctorId: doctorProfileId } },
    })
    return !!existing
  } catch {
    return false
  }
}

export async function getFollowedDoctors() {
  const session = await getSessionPayload()
  if (!session || session.role !== "PATIENT") return []

  try {
    const favorites = await db.favoriteDoctor.findMany({
      where: { patientId: session.userId },
      include: {
        doctor: {
          include: {
            user: { select: { name: true, lastName: true, avatar: true } },
            availability: { where: { isActive: true }, orderBy: { dayOfWeek: "asc" } },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    })

    return favorites.map((f) => ({
      id: f.doctor.id,
      userId: f.doctor.userId,
      name: `${f.doctor.user.name} ${f.doctor.user.lastName || ""}`,
      specialty: f.doctor.specialty,
      avatar: f.doctor.user.avatar,
      availability: f.doctor.availability.map((a) => ({
        dayOfWeek: a.dayOfWeek,
        startTime: a.startTime,
        endTime: a.endTime,
      })),
    }))
  } catch (error) {
    console.error("Error fetching followed doctors:", error)
    return []
  }
}

export async function getDoctorFollowers() {
  const session = await getSessionPayload()
  if (!session || session.role !== "DOCTOR") return []

  try {
    const profile = await db.doctorProfile.findUnique({
      where: { userId: session.userId },
      include: {
        followedBy: {
          include: {
            patient: { select: { name: true, lastName: true, avatar: true, email: true } },
          },
          orderBy: { createdAt: "desc" },
        },
      },
    })

    if (!profile) return []

    return profile.followedBy.map((f) => ({
      id: f.id,
      patientId: f.patientId,
      name: `${f.patient.name} ${f.patient.lastName || ""}`,
      email: f.patient.email,
      avatar: f.patient.avatar,
      since: f.createdAt,
    }))
  } catch (error) {
    console.error("Error fetching doctor followers:", error)
    return []
  }
}
