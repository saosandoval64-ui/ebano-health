import { db } from "../../../lib/db"
import { getCurrentUser } from "../../../lib/auth"
import { redirect } from "next/navigation"
import { Stethoscope, Users, Calendar, DollarSign, ArrowRight } from "lucide-react"
import Link from "next/link"

export default async function AdminDashboard() {
  const user = await getCurrentUser()
  if (!user || user.role !== "ADMIN") return redirect("/login")

  // Consultar métricas del sistema
  const doctorCount = await db.user.count({ where: { role: "DOCTOR" } })
  const patientCount = await db.user.count({ where: { role: "PATIENT" } })
  const appointmentCount = await db.appointment.count()

  // Buscar las últimas 5 citas registradas
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
    <div className="space-y-8 font-sans text-black">
      {/* Encabezado */}
      <div className="space-y-1">
        <h1 className="text-3xl font-serif font-black tracking-tight">Panel de Administración</h1>
        <p className="text-sm font-medium text-black/60">
          Vista general de las métricas y la actividad del sistema Ébano Health.
        </p>
      </div>

      {/* Grid de Métricas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Médicos */}
        <div className="bg-[#A2B676]/10 border border-[#A2B676]/30 p-6 rounded-[28px] flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#A2B676] flex items-center justify-center text-white shrink-0">
            <Stethoscope className="h-6 w-6" />
          </div>
          <div>
            <p className="text-[10px] uppercase font-bold tracking-widest text-[#8F9F68]">Especialistas</p>
            <h3 className="text-2xl font-serif font-black">{doctorCount}</h3>
          </div>
        </div>

        {/* Pacientes */}
        <div className="bg-black/5 border border-black/10 p-6 rounded-[28px] flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-black/10 flex items-center justify-center text-black shrink-0">
            <Users className="h-6 w-6" />
          </div>
          <div>
            <p className="text-[10px] uppercase font-bold tracking-widest text-black/50">Pacientes</p>
            <h3 className="text-2xl font-serif font-black">{patientCount}</h3>
          </div>
        </div>

        {/* Turnos */}
        <div className="bg-black/5 border border-black/10 p-6 rounded-[28px] flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-black/10 flex items-center justify-center text-black shrink-0">
            <Calendar className="h-6 w-6" />
          </div>
          <div>
            <p className="text-[10px] uppercase font-bold tracking-widest text-black/50">Turnos Totales</p>
            <h3 className="text-2xl font-serif font-black">{appointmentCount}</h3>
          </div>
        </div>

        {/* Ingresos Estimados */}
        <div className="bg-black/5 border border-black/10 p-6 rounded-[28px] flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-black/10 flex items-center justify-center text-black shrink-0">
            <DollarSign className="h-6 w-6" />
          </div>
          <div>
            <p className="text-[10px] uppercase font-bold tracking-widest text-black/50">Suscripción SaaS</p>
            <h3 className="text-2xl font-serif font-black">$ {doctorCount * 49} USD/mes</h3>
          </div>
        </div>

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Columna Izquierda: Actividad Reciente (2/3 de pantalla) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-serif font-black tracking-tight">Últimas Reservas</h2>
            <Link 
              href="/admin/appointments" 
              className="text-xs font-bold uppercase tracking-wider text-black hover:text-[#8F9F68] transition-colors inline-flex items-center gap-1"
            >
              Ver todos <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          {recentAppointments.length === 0 ? (
            <div className="p-8 border border-dashed border-black/10 rounded-[28px] text-center bg-white/20">
              <p className="text-sm font-medium text-black/40">No hay reservas recientes registradas.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentAppointments.map((app) => {
                const appDate = new Date(app.dateTime)
                return (
                  <div 
                    key={app.id} 
                    className="bg-white/40 border border-white/50 p-4 rounded-[22px] flex items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[#A2B676]/20 border border-[#A2B676]/30 flex items-center justify-center font-bold text-black text-xs shrink-0">
                        {app.patient.name.charAt(0)}
                      </div>
                      <div>
                        <h4 className="font-bold text-xs text-black">
                          {app.patient.name} {app.patient.lastName} con Dr. {app.doctor.user.name}
                        </h4>
                        <p className="text-[9px] uppercase font-bold tracking-widest text-black/40">
                          {app.doctor.specialty}
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
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

        {/* Columna Derecha: Estado del Sistema (1/3 de pantalla) */}
        <div className="space-y-4">
          <h2 className="text-xl font-serif font-black tracking-tight">Estado del Sistema</h2>
          <div className="bg-black text-[#FDF6CD] p-6 rounded-[28px] shadow-lg space-y-4">
            <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider">
              <span className="opacity-60">Base de Datos</span>
              <span className="text-[#A2B676]">PostgreSQL Activa</span>
            </div>
            <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider border-t border-white/10 pt-3">
              <span className="opacity-60">Prisma Client</span>
              <span className="text-[#A2B676]">Conectado</span>
            </div>
            <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider border-t border-white/10 pt-3">
              <span className="opacity-60">Google Calendar API</span>
              <span className="text-[#F4C443]">Listo</span>
            </div>
            <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider border-t border-white/10 pt-3">
              <span className="opacity-60">Seguridad SSL</span>
              <span className="text-[#A2B676]">Activo</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
