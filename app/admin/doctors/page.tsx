import { db } from "../../../lib/db"
import { getCurrentUser } from "../../../lib/auth"
import { redirect } from "next/navigation"
import DoctorsCrud from "./DoctorsCrud"

export default async function AdminDoctorsPage() {
  const user = await getCurrentUser()
  if (!user || user.role !== "ADMIN") return redirect("/login")

  const doctors = await db.user.findMany({
    where: { role: "DOCTOR" },
    include: {
      doctorProfile: true,
    },
    orderBy: {
      name: "asc",
    },
  })

  return (
    <div className="max-w-5xl mx-auto px-8 pt-8 pb-8 space-y-8 font-sans text-black">
      {/* Encabezado */}
      <div className="space-y-1">
        <h1 className="text-3xl font-serif font-black tracking-tight">Médicos Especialistas</h1>
        <p className="text-sm font-medium text-black/60">
          Agrega, modifica y elimina cuentas de profesionales médicos en el sistema.
        </p>
      </div>

      {/* CRUD de Médicos */}
      <DoctorsCrud initialDoctors={doctors} />
    </div>
  )
}
