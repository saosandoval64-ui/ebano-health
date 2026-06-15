import { auth } from "../../../lib/auth"
import { db } from "../../../lib/db"
import { redirect } from "next/navigation"
import { Stethoscope, Users, Calendar, DollarSign, ArrowRight, Activity, Shield, TrendingUp } from "lucide-react"
import CollapsibleCard from "@/components/CollapsibleCard"
import Link from "next/link"

export default async function AdminDashboard() {
  const session = await auth()
  if (!session?.user || session.user.role !== "ADMIN") {
    return redirect("/login/admin")
  }

  const doctorCount = await db.user.count({ where: { role: "DOCTOR" } })
  const patientCount = await db.user.count({ where: { role: "PATIENT" } })
  const appointmentCount = await db.appointment.count()

  const recentAppointments = await db.appointment.findMany({
    take: 5,
    include: {
      patient: true,
      doctor: {
        include: {
          user: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  })

  return (
    <div className="max-w-7xl mx-auto">
      {/* Mobile Header */}
      <div className="md:hidden px-5 pt-8 pb-4">
        <div className="text-center">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#F4C443] to-[#F9A825] flex items-center justify-center mx-auto mb-3 shadow-lg">
            <Shield className="w-7 h-7 text-black" />
          </div>
          <h1 className="text-2xl font-serif font-black text-black tracking-tight">
            Panel Admin
          </h1>
          <p className="text-sm text-black/50 font-medium mt-1">Vista general del sistema</p>
        </div>
      </div>

      {/* Desktop Header */}
      <div className="hidden md:flex items-center justify-between px-8 pt-8 pb-6">
        <div>
          <p className="text-xs font-bold text-black/40 uppercase tracking-widest mb-1">Administración</p>
          <h1 className="text-3xl md:text-4xl font-serif font-black text-black tracking-tight">
            Panel de Administración
          </h1>
          <p className="text-sm font-medium text-black/50 mt-1">
            Vista general de las métricas y la actividad del sistema.
          </p>
        </div>
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#F4C443] to-[#F9A825] flex items-center justify-center shadow-lg">
          <Shield className="w-6 h-6 text-black" />
        </div>
      </div>

      <div className="px-5 md:px-8 space-y-8 md:space-y-10 pb-8">
        {/* Mobile: Metrics */}
        <div className="md:hidden">
          <h2 className="text-base font-serif font-black text-black mb-4">Métricas</h2>
          <div className="grid grid-cols-2 gap-3">
            <CollapsibleCard id="admin-doctors">
              <div className="bg-[#F4C443]/15 p-4 rounded-2xl text-center">
                <div className="w-11 h-11 rounded-xl bg-[#F4C443] flex items-center justify-center text-black mx-auto mb-2">
                  <Stethoscope className="h-5 w-5" />
                </div>
                <h3 className="text-2xl font-serif font-black">{doctorCount}</h3>
                <p className="text-[10px] uppercase font-bold tracking-widest text-black/50 mt-1">Especialistas</p>
              </div>
            </CollapsibleCard>
            <CollapsibleCard id="admin-patients">
              <div className="bg-black/5 p-4 rounded-2xl text-center">
                <div className="w-11 h-11 rounded-xl bg-black/10 flex items-center justify-center text-black mx-auto mb-2">
                  <Users className="h-5 w-5" />
                </div>
                <h3 className="text-2xl font-serif font-black">{patientCount}</h3>
                <p className="text-[10px] uppercase font-bold tracking-widest text-black/50 mt-1">Pacientes</p>
              </div>
            </CollapsibleCard>
            <CollapsibleCard id="admin-appointments">
              <div className="bg-black/5 p-4 rounded-2xl text-center">
                <div className="w-11 h-11 rounded-xl bg-black/10 flex items-center justify-center text-black mx-auto mb-2">
                  <Calendar className="h-5 w-5" />
                </div>
                <h3 className="text-2xl font-serif font-black">{appointmentCount}</h3>
                <p className="text-[10px] uppercase font-bold tracking-widest text-black/50 mt-1">Turnos</p>
              </div>
            </CollapsibleCard>
            <CollapsibleCard id="admin-revenue">
              <div className="bg-black/5 p-4 rounded-2xl text-center">
                <div className="w-11 h-11 rounded-xl bg-black/10 flex items-center justify-center text-black mx-auto mb-2">
                  <DollarSign className="h-5 w-5" />
                </div>
                <h3 className="text-xl font-serif font-black">${doctorCount * 49}</h3>
                <p className="text-[10px] uppercase font-bold tracking-widest text-black/50 mt-1">USD/mes</p>
              </div>
            </CollapsibleCard>
          </div>
        </div>

        {/* Desktop: Metrics */}
        <div className="hidden md:grid grid-cols-2 lg:grid-cols-4 gap-5">
          <CollapsibleCard id="admin-doctors">
            <div className="bg-[#F4C443]/15 p-6 rounded-3xl flex items-center gap-4">
              <div className="w-13 h-13 rounded-2xl bg-[#F4C443] flex items-center justify-center text-black shrink-0">
                <Stethoscope className="h-6 w-6" />
              </div>
              <div>
                <p className="text-[10px] uppercase font-bold tracking-widest text-black/50">Especialistas</p>
                <h3 className="text-2xl font-serif font-black">{doctorCount}</h3>
              </div>
            </div>
          </CollapsibleCard>

          <CollapsibleCard id="admin-patients">
            <div className="bg-white p-6 rounded-3xl border border-gray-100 flex items-center gap-4">
              <div className="w-13 h-13 rounded-2xl bg-black/5 flex items-center justify-center text-black shrink-0">
                <Users className="h-6 w-6" />
              </div>
              <div>
                <p className="text-[10px] uppercase font-bold tracking-widest text-black/50">Pacientes</p>
                <h3 className="text-2xl font-serif font-black">{patientCount}</h3>
              </div>
            </div>
          </CollapsibleCard>

          <CollapsibleCard id="admin-appointments">
            <div className="bg-white p-6 rounded-3xl border border-gray-100 flex items-center gap-4">
              <div className="w-13 h-13 rounded-2xl bg-black/5 flex items-center justify-center text-black shrink-0">
                <Calendar className="h-6 w-6" />
              </div>
              <div>
                <p className="text-[10px] uppercase font-bold tracking-widest text-black/50">Turnos Totales</p>
                <h3 className="text-2xl font-serif font-black">{appointmentCount}</h3>
              </div>
            </div>
          </CollapsibleCard>

          <CollapsibleCard id="admin-revenue">
            <div className="bg-white p-6 rounded-3xl border border-gray-100 flex items-center gap-4">
              <div className="w-13 h-13 rounded-2xl bg-black/5 flex items-center justify-center text-black shrink-0">
                <DollarSign className="h-6 w-6" />
              </div>
              <div>
                <p className="text-[10px] uppercase font-bold tracking-widest text-black/50">Suscripción SaaS</p>
                <h3 className="text-2xl font-serif font-black">$ {doctorCount * 49} USD/mes</h3>
              </div>
            </div>
          </CollapsibleCard>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Columna Izquierda: Actividad Reciente */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg md:text-xl font-serif font-black tracking-tight">Últimas Reservas</h2>
              <Link 
                href="/admin/appointments" 
                className="text-xs font-bold text-black/40 hover:text-black transition-colors inline-flex items-center gap-1"
              >
                Ver todos <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            {recentAppointments.length === 0 ? (
              <div className="p-10 border border-dashed border-black/10 rounded-3xl text-center bg-white/20">
                <Activity className="w-10 h-10 text-black/15 mx-auto mb-3" />
                <p className="text-sm font-medium text-black/40">No hay reservas recientes registradas.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {recentAppointments.map((app) => {
                  const appDate = new Date(app.dateTime)
                  return (
                    <div 
                      key={app.id} 
                      className="bg-white/60 border border-white/80 p-4 rounded-2xl flex items-center justify-between gap-4 shadow-sm"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-xl bg-[#F4C443]/20 border border-[#F4C443]/30 flex items-center justify-center font-bold text-black text-xs shrink-0">
                          {app.patient.name.charAt(0)}
                        </div>
                        <div>
                          <h4 className="font-bold text-xs text-black">
                            {app.patient.name} {app.patient.lastName} con Dr. {app.doctor.user.name}
                          </h4>
                          <p className="text-[10px] uppercase font-bold tracking-widest text-black/40 mt-0.5">
                            {app.doctor.specialty}
                          </p>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <p className="text-xs font-bold text-black">
                          {appDate.toLocaleDateString("es-ES", {
                            day: "numeric",
                            month: "short",
                          })}
                        </p>
                        <p className="text-[10px] text-black/50">
                          {String(appDate.getHours()).padStart(2, "0")}:{String(appDate.getMinutes()).padStart(2, "0")} hs
                        </p>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          {/* Columna Derecha: Estado del Sistema */}
          <div className="space-y-4">
            <h2 className="text-lg md:text-xl font-serif font-black tracking-tight">Estado del Sistema</h2>
            <div className="bg-gradient-to-br from-black to-gray-800 text-[#FDF6CD] p-6 rounded-3xl shadow-lg space-y-4">
              <div className="flex items-center gap-3 pb-3 border-b border-white/10">
                <TrendingUp className="w-5 h-5 text-[#F4C443]" />
                <span className="text-xs font-bold uppercase tracking-wider opacity-70">Infraestructura</span>
              </div>
              <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider">
                <span className="opacity-60">Base de Datos</span>
                <span className="text-[#F4C443]">PostgreSQL Activa</span>
              </div>
              <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider border-t border-white/10 pt-3">
                <span className="opacity-60">Prisma Client</span>
                <span className="text-[#F4C443]">Conectado</span>
              </div>
              <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider border-t border-white/10 pt-3">
                <span className="opacity-60">Google Calendar API</span>
                <span className="text-[#F4C443]">Listo</span>
              </div>
              <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider border-t border-white/10 pt-3">
                <span className="opacity-60">Seguridad SSL</span>
                <span className="text-[#F4C443]">Activo</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
