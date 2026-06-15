"use server"

import { db } from "../../lib/db"
import bcrypt from "bcryptjs"
import { getSessionPayload } from "../../lib/auth"
import { revalidatePath } from "next/cache"

export async function loginUser(formData: FormData) {
  const email = formData.get("email") as string
  const password = formData.get("password") as string
  const expectedRole = formData.get("expectedRole") as string | undefined

  if (!email || !password) {
    return { success: false, message: "Faltan datos obligatorios." }
  }

  try {
    const user = await db.user.findUnique({ where: { email } })
    if (!user) {
      return { success: false, message: "Credenciales incorrectas." }
    }

    const isValid = await bcrypt.compare(password, user.password)
    if (!isValid) {
      return { success: false, message: "Credenciales incorrectas." }
    }

    if (expectedRole && user.role !== expectedRole) {
      return { success: false, message: "No tienes acceso a este portal." }
    }

    const dashboards: Record<string, string> = {
      PATIENT: "/patient/dashboard",
      DOCTOR: "/doctor/dashboard",
      ADMIN: "/admin/dashboard",
    }

    return {
      success: true,
      user: {
        id: user.id,
        name: `${user.name}${user.lastName ? ` ${user.lastName}` : ""}`,
        email: user.email,
        role: user.role,
        image: user.avatar ? `/avatars/avatar-${user.avatar}.svg` : null,
      },
      redirectTo: dashboards[user.role] || "/patient/dashboard",
    }
  } catch (error) {
    console.error("Error al iniciar sesión:", error)
    return { 
      success: false, 
      message: "Error en el servidor. Intenta de nuevo." 
    }
  }
}

export async function updatePatientProfile(formData: FormData) {
  const session = await getSessionPayload()
  if (!session || session.role !== "PATIENT") {
    return { success: false, message: "No autorizado." }
  }

  const name = formData.get("nombre") as string
  const lastName = formData.get("apellido") as string
  const phone = formData.get("telefono") as string
  const dni = formData.get("dni") as string
  const insurance = formData.get("obraSocial") as string
  const birthDateInput = formData.get("fechaNacimiento") as string

  if (!name || !lastName) {
    return { success: false, message: "Nombre y Apellido son requeridos." }
  }

  try {
    await db.user.update({
      where: { id: session.userId },
      data: {
        name,
        lastName,
        phone: phone || null,
        dni: dni || null,
        insurance: insurance || null,
        birthDate: birthDateInput ? new Date(birthDateInput) : null,
      },
    })

    revalidatePath("/patient/dashboard")
    revalidatePath("/patient/profile")

    return { success: true, message: "Perfil actualizado correctamente." }
  } catch (error) {
    console.error("Error updating profile:", error)
    return { success: false, message: "Error al guardar los cambios en el servidor." }
  }
}

export async function changePassword(formData: FormData) {
  const session = await getSessionPayload()
  if (!session) {
    return { success: false, message: "No autorizado." }
  }

  const currentPassword = formData.get("currentPassword") as string
  const newPassword = formData.get("newPassword") as string
  const confirmPassword = formData.get("confirmPassword") as string

  if (!currentPassword || !newPassword || !confirmPassword) {
    return { success: false, message: "Todos los campos de contraseña son requeridos." }
  }

  if (newPassword !== confirmPassword) {
    return { success: false, message: "La nueva contraseña y su confirmación no coinciden." }
  }

  if (newPassword.length < 6) {
    return { success: false, message: "La nueva contraseña debe tener al menos 6 caracteres." }
  }

  try {
    const user = await db.user.findUnique({
      where: { id: session.userId },
    })

    if (!user) {
      return { success: false, message: "Usuario no encontrado." }
    }

    const matches = await bcrypt.compare(currentPassword, user.password)
    if (!matches) {
      return { success: false, message: "La contraseña actual es incorrecta." }
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10)
    await db.user.update({
      where: { id: session.userId },
      data: { password: hashedPassword },
    })

    return { success: true, message: "Contraseña cambiada exitosamente." }
  } catch (error) {
    console.error("Error changing password:", error)
    return { success: false, message: "Error en el servidor al intentar cambiar la contraseña." }
  }
}
