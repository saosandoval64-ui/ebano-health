"use server"

import { db } from "../../lib/db"
import { getSessionPayload } from "../../lib/auth"
import bcrypt from "bcryptjs"
import { revalidatePath } from "next/cache"

async function checkClinicAdmin() {
  const session = await getSessionPayload()
  return session && session.role === "CLINIC_ADMIN" ? session : null
}

export async function createClinic(formData: FormData) {
  const session = await checkClinicAdmin()
  if (!session) return { success: false, message: "No autorizado." }

  const name = formData.get("name") as string
  const description = formData.get("description") as string
  const phone = formData.get("phone") as string
  const email = formData.get("email") as string
  const address = formData.get("address") as string
  const website = formData.get("website") as string
  const logo = formData.get("logo") as string

  if (!name) return { success: false, message: "El nombre es requerido." }

  const slug = name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")

  try {
    const existing = await db.clinic.findUnique({ where: { adminId: session.userId } })
    if (existing) return { success: false, message: "Ya tienes una clínica registrada." }

    await db.clinic.create({
      data: {
        name,
        slug,
        description: description || null,
        phone: phone || null,
        email: email || null,
        address: address || null,
        website: website || null,
        logo: logo || null,
        adminId: session.userId,
      },
    })

    revalidatePath("/clinic-admin/dashboard")
    revalidatePath("/clinic-admin/clinic")
    return { success: true, message: "Clínica creada correctamente." }
  } catch (error) {
    console.error("Error creating clinic:", error)
    return { success: false, message: "Error al crear la clínica." }
  }
}

export async function updateClinic(formData: FormData) {
  const session = await checkClinicAdmin()
  if (!session) return { success: false, message: "No autorizado." }

  const clinicId = formData.get("clinicId") as string
  const name = formData.get("name") as string
  const description = formData.get("description") as string
  const phone = formData.get("phone") as string
  const email = formData.get("email") as string
  const address = formData.get("address") as string
  const website = formData.get("website") as string
  const logo = formData.get("logo") as string

  if (!clinicId || !name) return { success: false, message: "Faltan campos requeridos." }

  const slug = name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")

  try {
    const clinic = await db.clinic.findUnique({ where: { id: clinicId } })
    if (!clinic || clinic.adminId !== session.userId) {
      return { success: false, message: "No autorizado para editar esta clínica." }
    }

    await db.clinic.update({
      where: { id: clinicId },
      data: {
        name,
        slug,
        description: description || null,
        phone: phone || null,
        email: email || null,
        address: address || null,
        website: website || null,
        logo: logo || null,
      },
    })

    revalidatePath("/clinic-admin/clinic")
    revalidatePath("/clinic-admin/dashboard")
    return { success: true, message: "Clínica actualizada correctamente." }
  } catch (error) {
    console.error("Error updating clinic:", error)
    return { success: false, message: "Error al actualizar la clínica." }
  }
}

export async function createClinicDoctor(formData: FormData) {
  const session = await checkClinicAdmin()
  if (!session) return { success: false, message: "No autorizado." }

  const clinic = await db.clinic.findUnique({ where: { adminId: session.userId } })
  if (!clinic) return { success: false, message: "No se encontró tu clínica." }

  const name = formData.get("name") as string
  const lastName = formData.get("lastName") as string
  const email = formData.get("email") as string
  const password = formData.get("password") as string
  const phone = formData.get("phone") as string
  const specialty = formData.get("specialty") as string
  const license = formData.get("license") as string
  const bio = formData.get("bio") as string
  const imageUrl = formData.get("imageUrl") as string || "/avatars/avatar-3.svg"

  if (!name || !lastName || !email || !password || !specialty || !license) {
    return { success: false, message: "Faltan campos requeridos." }
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10)

    await db.user.create({
      data: {
        name,
        lastName,
        email,
        password: hashedPassword,
        role: "DOCTOR",
        phone: phone || null,
        doctorProfile: {
          create: {
            specialty,
            license,
            bio: bio || null,
            imageUrl,
            clinicId: clinic.id,
          },
        },
      },
    })

    revalidatePath("/clinic-admin/doctors")
    return { success: true, message: "Médico creado y vinculado a la clínica." }
  } catch (error) {
    console.error("Error creating clinic doctor:", error)
    return { success: false, message: "El correo electrónico ya está registrado." }
  }
}

export async function updateClinicDoctor(formData: FormData) {
  const session = await checkClinicAdmin()
  if (!session) return { success: false, message: "No autorizado." }

  const clinic = await db.clinic.findUnique({ where: { adminId: session.userId } })
  if (!clinic) return { success: false, message: "No se encontró tu clínica." }

  const userId = formData.get("userId") as string
  const name = formData.get("name") as string
  const lastName = formData.get("lastName") as string
  const email = formData.get("email") as string
  const phone = formData.get("phone") as string
  const specialty = formData.get("specialty") as string
  const license = formData.get("license") as string
  const bio = formData.get("bio") as string
  const imageUrl = formData.get("imageUrl") as string

  if (!userId || !name || !lastName || !email || !specialty || !license) {
    return { success: false, message: "Faltan campos requeridos." }
  }

  try {
    const doctorProfile = await db.doctorProfile.findFirst({ where: { userId } })
    if (!doctorProfile || doctorProfile.clinicId !== clinic.id) {
      return { success: false, message: "No autorizado para editar este médico." }
    }

    await db.user.update({
      where: { id: userId },
      data: {
        name,
        lastName,
        email,
        phone: phone || null,
        doctorProfile: {
          update: {
            specialty,
            license,
            bio: bio || null,
            imageUrl: imageUrl || undefined,
          },
        },
      },
    })

    revalidatePath("/clinic-admin/doctors")
    return { success: true, message: "Médico actualizado correctamente." }
  } catch (error) {
    console.error("Error updating clinic doctor:", error)
    return { success: false, message: "Error al actualizar el médico." }
  }
}

export async function deleteClinicDoctor(userId: string) {
  const session = await checkClinicAdmin()
  if (!session) return { success: false, message: "No autorizado." }

  const clinic = await db.clinic.findUnique({ where: { adminId: session.userId } })
  if (!clinic) return { success: false, message: "No se encontró tu clínica." }

  try {
    const doctorProfile = await db.doctorProfile.findFirst({ where: { userId } })
    if (!doctorProfile || doctorProfile.clinicId !== clinic.id) {
      return { success: false, message: "No autorizado para eliminar este médico." }
    }

    await db.user.delete({ where: { id: userId } })

    revalidatePath("/clinic-admin/doctors")
    return { success: true, message: "Médico eliminado correctamente." }
  } catch (error) {
    console.error("Error deleting clinic doctor:", error)
    return { success: false, message: "Error al eliminar el médico." }
  }
}
