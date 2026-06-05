import { db } from "../../../lib/db"
import { getCurrentUser } from "../../../lib/auth"
import { redirect } from "next/navigation"
import TodayAppointmentsList from "./TodayAppointmentsList"
import { Calendar, Users, Activity, ArrowRight } from "lucide-react"
import Link from "next/link"

export default async function DoctorDashboard() {
  const user = await getCurrentUser()
  if (!user || user.role !== "DOCTOR") return redirect("/login")

  const doctorProfile = await db.doctorProfile.findUnique({
    where: { userId: user.id },
  })

  if (!doctorProfile) {
    return (
      <div className="p-8 bg-red-50 border border-red-200 text-red-700 rounded-3xl">
        No se encontró el perfil de médico asociado. Comunícate con un administrador.
      </div>
    )
  }

  // Definir rangos para hoy
  const now = new Date()
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0)
  const endOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59)

  // Citas del día
  const todayAppointments = await db.appointment.findMany({
    where: {
      doctorId: doctorProfile.id,
      dateTime: {
        gte: startOfToday,
        lte: endOfToday,
      },
    },
    include: {
      patient: true,
    },
    orderBy: {
      dateTime: "asc",
    },
  })

  // Estadísticas: Citas hoy, Pacientes únicos totales, Turnos totales pendientes
  const countToday = todayAppointments.filter((app) => app.status === "RESERVED").length

  const pendingTotal = await db.appointment.count({
    where: {
      doctorId: doctorProfile.id,
      status: "RESERVED",
      dateTime: { gte: now },
    },
  })

  const distinctPatients = await db.appointment.findMany({
    where: {
      doctorId: doctorProfile.id,
    },
    select: {
      patientId: true,
    },
    distinct: ["patientId"],
  })
  const patientCount = distinctPatients.length

  return (
    <div className="space-y-8 font-sans text-black">
      {/* Encabezado */}
      <div className="space-y-1">
        <h1 className="text-3xl font-serif font-black tracking-tight">
          ¡Hola, Dr. {user.name}!
        </h1>
        <p className="text-sm font-medium text-black/60">
          Esta es la actividad programada para hoy.
        </p>
      </div>

      {/* Tarjetas de Estadísticas */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        
        {/* Citas de hoy */}
        <div className="bg-[#A2B676]/10 border border-[#A2B676]/30 p-6 rounded-[28px] flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#A2B676] flex items-center justify-center text-white shrink-0">
            <Calendar className="h-6 w-6" />
          </div>
          <div>
            <p className="text-[10px] uppercase font-bold tracking-widest text-[#8F9F68]">Citas de Hoy</p>
            <h3 className="text-2xl font-serif font-black">{countToday}</h3>
          </div>
        </div>

        {/* Pacientes Activos */}
        <div className="bg-black/5 border border-black/10 p-6 rounded-[28px] flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-black/10 flex items-center justify-center text-black shrink-0">
            <Users className="h-6 w-6" />
          </div>
          <div>
            <p className="text-[10px] uppercase font-bold tracking-widest text-black/50">Total Pacientes</p>
            <h3 className="text-2xl font-serif font-black">{patientCount}</h3>
          </div>
        </div>

        {/* Pendientes Futuras */}
        <div className="bg-black/5 border border-black/10 p-6 rounded-[28px] flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-black/10 flex items-center justify-center text-black shrink-0">
            <Activity className="h-6 w-6" />
          </div>
          <div>
            <p className="text-[10px] uppercase font-bold tracking-widest text-black/50">Turnos Pendientes</p>
            <h3 className="text-2xl font-serif font-black">{pendingTotal}</h3>
          </div>
        </div>

      </div>

      {/* Consultas para Hoy */}
      <div className="space-y-4 pt-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-serif font-black tracking-tight">Pacientes Citados Hoy</h2>
          <Link 
            href="/doctor/appointments" 
            className="text-xs font-bold uppercase tracking-wider text-black hover:text-[#8F9F68] transition-colors inline-flex items-center gap-1"
          >
            Ver todos los turnos <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <TodayAppointmentsList initialAppointments={todayAppointments} />
      </div>
    </div>
  )
}
