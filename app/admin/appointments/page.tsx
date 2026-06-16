import { db } from "../../../lib/db"
import { getCurrentUser } from "../../../lib/auth"
import { redirect } from "next/navigation"
import AdminAppointmentsList from "./AdminAppointmentsList"

export default async function AdminAppointmentsPage() {
  const user = await getCurrentUser()
  if (!user || user.role !== "ADMIN") return redirect("/login")

  const appointments = await db.appointment.findMany({
    include: {
      patient: true,
      doctor: {
        include: {
          user: true,
        },
      },
    },
    orderBy: {
      dateTime: "desc",
    },
  })

  return (
    <div className="max-w-5xl mx-auto px-8 pt-8 pb-8 space-y-8 font-sans text-black">
      {/* Encabezado */}
      <div className="space-y-1">
        <h1 className="text-3xl font-serif font-black tracking-tight">Administrar Turnos</h1>
        <p className="text-sm font-medium text-black/60">
          Supervisión, control y cancelaciones administrativas de turnos del sistema.
        </p>
      </div>

      {/* Lista Interactiva */}
      <AdminAppointmentsList initialAppointments={appointments} />
    </div>
  )
}
