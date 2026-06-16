import { auth } from "../../../lib/auth"
import { db } from "../../../lib/db"
import { redirect } from "next/navigation"
import { Stethoscope, Users, Calendar, Building2, ArrowRight, Activity, Plus } from "lucide-react"
import Link from "next/link"
import ClinicFormClient from "../clinic/ClinicFormClient"

export default async function ClinicAdminDashboard() {
  const session = await auth()
  if (!session?.user || session.user.role !== "CLINIC_ADMIN") {
    return redirect("/login/clinic-admin")
  }

  const clinic = await db.clinic.findUnique({
    where: { adminId: session.user.id },
    include: {
      doctors: {
        include: { user: true },
      },
    },
  })

  if (!clinic) {
    return (
      <div className="max-w-5xl mx-auto px-8 pt-8 pb-8">
        <div className="flex items-center justify-between pt-8 pb-6">
          <div>
            <p className="text-xs font-bold text-black/40 uppercase tracking-widest mb-1">Clínica</p>
            <h1 className="text-3xl font-serif font-black text-black tracking-tight">
              Panel de Administración
            </h1>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#F4C443] to-[#F9A825] flex items-center justify-center shadow-lg">
            <Building2 className="w-6 h-6 text-black" />
          </div>
        </div>

        <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm text-center max-w-lg mx-auto mt-12">
          <div className="w-16 h-16 rounded-2xl bg-[#F4C443]/15 flex items-center justify-center mx-auto mb-4">
            <Building2 className="w-8 h-8 text-[#F4C443]" />
          </div>
          <h2 className="text-xl font-serif font-black mb-2">Crea tu Clínica</h2>
          <p className="text-sm text-black/50 mb-6">
            Para comenzar a administrar médicos y turnos, primero debes registrar tu clínica.
          </p>
          <ClinicFormClient mode="create" />
        </div>
      </div>
    )
  }

  const doctorCount = clinic.doctors.length

  const patientIds = await db.appointment.findMany({
    where: {
      doctor: { clinicId: clinic.id },
    },
    select: { patientId: true },
    distinct: ["patientId"],
  })
  const patientCount = patientIds.length

  const appointmentCount = await db.appointment.count({
    where: {
      doctor: { clinicId: clinic.id },
    },
  })

  const recentAppointments = await db.appointment.findMany({
    where: {
      doctor: { clinicId: clinic.id },
    },
    take: 5,
    include: {
      patient: true,
      doctor: { include: { user: true } },
    },
    orderBy: { createdAt: "desc" },
  })

  return (
    <div className="max-w-5xl mx-auto px-8">
      <div className="flex items-center justify-between pt-8 pb-6">
        <div>
          <p className="text-xs font-bold text-black/40 uppercase tracking-widest mb-1">{clinic.name}</p>
          <h1 className="text-3xl font-serif font-black text-black tracking-tight">
            Panel de Administración
          </h1>
        </div>
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#F4C443] to-[#F9A825] flex items-center justify-center shadow-lg">
          <Building2 className="w-6 h-6 text-black" />
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-[#F4C443]/15 p-6 md:p-5 rounded-2xl flex items-center gap-3 overflow-hidden">
          <div className="w-14 h-14 md:w-12 md:h-12 rounded-xl bg-[#F4C443] flex items-center justify-center text-black shrink-0">
            <Stethoscope className="h-7 w-7 md:h-6 md:w-6" />
          </div>
          <div className="min-w-0">
            <p className="text-[10px] uppercase font-bold tracking-widest text-black/50">Médicos</p>
            <h3 className="text-2xl font-serif font-black">{doctorCount}</h3>
          </div>
        </div>

        <div className="bg-white p-6 md:p-5 rounded-2xl border border-gray-100 flex items-center gap-3 overflow-hidden">
          <div className="w-14 h-14 md:w-12 md:h-12 rounded-xl bg-black/5 flex items-center justify-center shrink-0">
            <Users className="h-7 w-7 md:h-6 md:w-6 text-black/60" />
          </div>
          <div className="min-w-0">
            <p className="text-[10px] uppercase font-bold tracking-widest text-black/50">Pacientes</p>
            <h3 className="text-2xl font-serif font-black">{patientCount}</h3>
          </div>
        </div>

        <div className="bg-white p-6 md:p-5 rounded-2xl border border-gray-100 flex items-center gap-3 overflow-hidden">
          <div className="w-14 h-14 md:w-12 md:h-12 rounded-xl bg-black/5 flex items-center justify-center shrink-0">
            <Calendar className="h-7 w-7 md:h-6 md:w-6 text-black/60" />
          </div>
          <div className="min-w-0">
            <p className="text-[10px] uppercase font-bold tracking-widest text-black/50">Turnos</p>
            <h3 className="text-2xl font-serif font-black">{appointmentCount}</h3>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pb-8">
        <div className="md:col-span-2 bg-white p-5 rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-serif font-black tracking-tight">Últimas Reservas</h2>
            <Link
              href="/clinic-admin/appointments"
              className="text-xs font-bold text-black/40 hover:text-black transition-colors inline-flex items-center gap-1"
            >
              Ver todos <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          {recentAppointments.length === 0 ? (
            <div className="py-8 text-center">
              <Activity className="w-8 h-8 text-black/15 mx-auto mb-2" />
              <p className="text-xs text-black/40">No hay reservas recientes</p>
            </div>
          ) : (
            <div className="space-y-2">
              {recentAppointments.map((app) => {
                const appDate = new Date(app.dateTime)
                return (
                  <div key={app.id} className="flex items-center justify-between gap-3 p-3 rounded-xl hover:bg-black/5 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[#F4C443]/20 flex items-center justify-center font-bold text-black text-xs shrink-0">
                        {app.patient.name.charAt(0)}
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold text-xs text-black truncate">
                          {app.patient.name} {app.patient.lastName}
                        </p>
                        <p className="text-[9px] uppercase font-bold tracking-widest text-black/40">
                          Dr. {app.doctor.user.name} · {app.doctor.specialty}
                        </p>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-xs font-bold text-black">
                        {appDate.toLocaleDateString("es-ES", { day: "numeric", month: "short" })}
                      </p>
                      <p className="text-[10px] text-black/50">
                        {String(appDate.getHours()).padStart(2, "0")}:{String(appDate.getMinutes()).padStart(2, "0")}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        <div className="bg-gradient-to-br from-black to-gray-800 text-white p-5 rounded-2xl shadow-lg">
          <h2 className="text-sm font-serif font-black tracking-tight mb-4">Tu Clínica</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider border-t border-white/10 pt-3 first:border-0 first:pt-0">
              <span className="opacity-60">Nombre</span>
              <span className="text-[#F4C443] truncate ml-2">{clinic.name}</span>
            </div>
            {clinic.phone && (
              <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider border-t border-white/10 pt-3">
                <span className="opacity-60">Teléfono</span>
                <span className="text-[#F4C443]">{clinic.phone}</span>
              </div>
            )}
            {clinic.email && (
              <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider border-t border-white/10 pt-3">
                <span className="opacity-60">Email</span>
                <span className="text-[#F4C443] truncate ml-2">{clinic.email}</span>
              </div>
            )}
            <Link
              href="/clinic-admin/clinic"
              className="block text-center mt-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-[#F4C443] text-xs font-bold uppercase tracking-wider transition-colors"
            >
              Editar Clínica
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
