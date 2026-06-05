import { db } from "../../../lib/db"
import { getCurrentUser } from "../../../lib/auth"
import { redirect } from "next/navigation"
import PatientsList from "./PatientsList"

export default async function AdminPatientsPage() {
  const user = await getCurrentUser()
  if (!user || user.role !== "ADMIN") return redirect("/login")

  const patients = await db.user.findMany({
    where: { role: "PATIENT" },
    orderBy: {
      name: "asc",
    },
  })

  return (
    <div className="space-y-8 font-sans text-black">
      {/* Encabezado */}
      <div className="space-y-1">
        <h1 className="text-3xl font-serif font-black tracking-tight">Registro de Pacientes</h1>
        <p className="text-sm font-medium text-black/60">
          Supervisa y actualiza los perfiles de los pacientes registrados.
        </p>
      </div>

      {/* CRUD de Pacientes */}
      <PatientsList initialPatients={patients} />
    </div>
  )
}
