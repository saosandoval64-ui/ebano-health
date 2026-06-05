"use server"

import { db } from "../../lib/db"
import { getSessionPayload } from "../../lib/auth"
import bcrypt from "bcryptjs"
import { revalidatePath } from "next/cache"

// Verificar si es administrador
async function checkAdmin() {
  const session = await getSessionPayload()
  return session && session.role === "ADMIN"
}

// Crear un médico
export async function createDoctor(formData: FormData) {
  if (!(await checkAdmin())) {
    return { success: false, message: "No autorizado." }
  }

  const name = formData.get("name") as string
  const lastName = formData.get("lastName") as string
  const email = formData.get("email") as string
  const password = formData.get("password") as string
  const phone = formData.get("phone") as string
  const specialty = formData.get("specialty") as string
  const license = formData.get("license") as string
  const bio = formData.get("bio") as string
  const imageUrl = formData.get("imageUrl") as string || "/avatars/avatar-3.svg" // Avatar por defecto

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
          },
        },
      },
    })

    revalidatePath("/admin/doctors")
    revalidatePath("/especialistas")
    return { success: true, message: "Médico creado correctamente." }
  } catch (error) {
    console.error("Error creating doctor:", error)
    return { success: false, message: "El correo electrónico ya está registrado." }
  }
}

// Actualizar un médico
export async function updateDoctor(formData: FormData) {
  if (!(await checkAdmin())) {
    return { success: false, message: "No autorizado." }
  }

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

    revalidatePath("/admin/doctors")
    revalidatePath("/especialistas")
    revalidatePath(`/especialistas/${userId}`)
    return { success: true, message: "Médico actualizado correctamente." }
  } catch (error) {
    console.error("Error updating doctor:", error)
    return { success: false, message: "Error al actualizar la información." }
  }
}

// Eliminar un usuario (médico o paciente)
export async function deleteUser(userId: string) {
  if (!(await checkAdmin())) {
    return { success: false, message: "No autorizado." }
  }

  try {
    await db.user.delete({
      where: { id: userId },
    })

    revalidatePath("/admin/doctors")
    revalidatePath("/admin/patients")
    revalidatePath("/especialistas")
    return { success: true, message: "Usuario eliminado correctamente." }
  } catch (error) {
    console.error("Error deleting user:", error)
    return { success: false, message: "Error al eliminar el usuario." }
  }
}

// Actualizar un paciente desde admin
export async function updatePatient(formData: FormData) {
  if (!(await checkAdmin())) {
    return { success: false, message: "No autorizado." }
  }

  const userId = formData.get("userId") as string
  const name = formData.get("name") as string
  const lastName = formData.get("lastName") as string
  const email = formData.get("email") as string
  const phone = formData.get("phone") as string
  const dni = formData.get("dni") as string
  const insurance = formData.get("insurance") as string
  const birthDateInput = formData.get("birthDate") as string

  if (!userId || !name || !lastName || !email) {
    return { success: false, message: "Faltan campos requeridos." }
  }

  try {
    await db.user.update({
      where: { id: userId },
      data: {
        name,
        lastName,
        email,
        phone: phone || null,
        dni: dni || null,
        insurance: insurance || null,
        birthDate: birthDateInput ? new Date(birthDateInput) : null,
      },
    })

    revalidatePath("/admin/patients")
    return { success: true, message: "Paciente actualizado correctamente." }
  } catch (error) {
    console.error("Error updating patient:", error)
    return { success: false, message: "Error al actualizar paciente." }
  }
}
