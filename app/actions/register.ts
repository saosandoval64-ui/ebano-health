"use server"

import { db } from "../../lib/db"
import bcrypt from "bcryptjs"
import { signIn } from "../../lib/auth"

type RoleType = "PATIENT" | "DOCTOR"

export async function registerPatient(formData: FormData) {
  const name = formData.get("nombre") as string
  const lastName = formData.get("apellido") as string
  const email = formData.get("email") as string
  const password = formData.get("password") as string
  const dni = formData.get("dni") as string
  const phone = formData.get("telefono") as string
  const birthDateInput = formData.get("fechaNacimiento") as string
  const insurance = formData.get("obraSocial") as string

  if (!email || !password || !name) {
    return { success: false, message: "Faltan datos obligatorios." }
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10)

    await db.user.create({
      data: {
        name,
        lastName,
        email,
        password: hashedPassword,
        dni: dni || null,
        phone: phone || null,
        birthDate: birthDateInput ? new Date(birthDateInput) : null,
        insurance: insurance || null,
        role: "PATIENT",
      },
    })

    // Crear sesión con NextAuth
    await signIn("credentials", {
      email,
      password,
      expectedRole: "PATIENT",
      redirect: false,
    })

    return { success: true, message: "Registro exitoso.", redirectTo: "/patient/dashboard" }
  } catch (error: any) {
    // Si el error es por redirect, es normal (NextAuth redirige tras signIn en server action)
    if (error?.message?.includes("redirect") || error?.digest?.includes("NEXT_REDIRECT")) {
      return { success: true, message: "Registro exitoso.", redirectTo: "/patient/dashboard" }
    }
    console.error("Error al registrar:", error)
    return { 
      success: false, 
      message: "Error en el servidor. El correo o DNI ya podrían estar registrados." 
    }
  }
}

export async function registerDoctor(formData: FormData) {
  const name = formData.get("nombre") as string
  const lastName = formData.get("apellido") as string
  const email = formData.get("email") as string
  const password = formData.get("password") as string
  const phone = formData.get("telefono") as string
  const matricula = formData.get("matricula") as string
  const especialidad = formData.get("especialidad") as string
  const bio = formData.get("consultorio") as string

  if (!email || !password || !name || !matricula) {
    return { success: false, message: "Faltan datos obligatorios." }
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await db.user.create({
      data: {
        name,
        lastName,
        email,
        password: hashedPassword,
        phone: phone || null,
        role: "DOCTOR",
      },
    })

    await db.doctorProfile.create({
      data: {
        userId: user.id,
        license: matricula,
        specialty: especialidad,
        bio: bio || null,
      },
    })

    await signIn("credentials", {
      email,
      password,
      expectedRole: "DOCTOR",
      redirect: false,
    })

    return { success: true, message: "Registro de médico exitoso.", redirectTo: "/doctor/dashboard" }
  } catch (error: any) {
    console.error("[REGISTRO MÉDICO] ERROR COMPLETO:", error)
    if (error?.message?.includes("redirect") || error?.digest?.includes("NEXT_REDIRECT")) {
      return { success: true, message: "Registro de médico exitoso.", redirectTo: "/doctor/dashboard" }
    }
    return { 
      success: false, 
      message: `Error en el servidor: ${error.message || 'Error desconocido'}` 
    }
  }
}