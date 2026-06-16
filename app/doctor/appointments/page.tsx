import { db } from "../../../lib/db"
import { getCurrentUser } from "../../../lib/auth"
import { redirect } from "next/navigation"
import DoctorAppointmentsList from "./DoctorAppointmentsList"

export default async function DoctorAppointmentsPage() {
  const user = await getCurrentUser()
  if (!user || user.role !== "DOCTOR") return redirect("/login")

  const doctorProfile = await db.doctorProfile.findUnique({
    where: { userId: user.id },
  })

  if (!doctorProfile) {
    return (
      <div className="p-8 bg-red-50 border border-red-200 text-red-700 rounded-3xl">
        No se encontró el perfil de médico asociado.
      </div>
    )
  }

  const appointments = await db.appointment.findMany({
    where: {
      doctorId: doctorProfile.id,
    },
    include: {
      patient: {
        select: { name: true, lastName: true, avatar: true, email: true, phone: true, insurance: true },
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
        <h1 className="text-3xl font-serif font-black tracking-tight">Consultas Médicas</h1>
        <p className="text-sm font-medium text-black/60">
          Administra todas tus citas agendadas, finalizadas y canceladas.
        </p>
      </div>

      {/* Lista Interactiva */}
      <DoctorAppointmentsList initialAppointments={appointments} />
    </div>
  )
}
