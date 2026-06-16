import { db } from "../../../lib/db"
import { getCurrentUser } from "../../../lib/auth"
import { redirect } from "next/navigation"
import ClinicAppointmentsList from "./ClinicAppointmentsList"

export default async function ClinicAdminAppointmentsPage() {
  const user = await getCurrentUser()
  if (!user || user.role !== "CLINIC_ADMIN") return redirect("/login")

  const clinic = await db.clinic.findUnique({
    where: { adminId: user.id },
  })

  if (!clinic) return redirect("/clinic-admin/dashboard")

  const appointments = await db.appointment.findMany({
    where: {
      doctor: {
        clinicId: clinic.id,
      },
    },
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
      <div className="space-y-1">
        <h1 className="text-3xl font-serif font-black tracking-tight">Turnos de la Clínica</h1>
        <p className="text-sm font-medium text-black/60">
          Supervisión y gestión de turnos de los médicos de {clinic.name}.
        </p>
      </div>

      <ClinicAppointmentsList initialAppointments={appointments} />
    </div>
  )
}
