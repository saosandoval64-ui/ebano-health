import { auth } from "../../../lib/auth"
import { db } from "../../../lib/db"
import Link from "next/link"
import { Calendar, User, FileText, ArrowRight, ShieldAlert, Stethoscope } from "lucide-react"

export default async function PatientDashboard() {
  const session = await auth()
  if (!session?.user) return null

  const user = await db.user.findUnique({
    where: { id: session.user.id },
  })
  if (!user) return null

  // Buscar citas futuras
  const appointments = await db.appointment.findMany({
    where: {
      patientId: user.id,
      dateTime: { gte: new Date() },
      status: "RESERVED",
    },
    include: {
      doctor: {
        include: {
          user: true,
        },
      },
    },
    orderBy: {
      dateTime: "asc",
    },
  })

  const nextApp = appointments[0]

  return (
    <div className="space-y-8 font-sans text-black">
      {/* Encabezado */}
      <div className="space-y-1">
        <h1 className="text-3xl font-serif font-black tracking-tight">
          ¡Hola, {user.name}!
        </h1>
        <p className="text-sm font-medium text-black/60">
          Bienvenido a tu portal de salud de Ébano Health.
        </p>
      </div>

      {/* Grid de Resumen */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Próxima Cita Card */}
        <div className="md:col-span-2 bg-[#A2B676]/10 border border-[#A2B676]/30 p-6 sm:p-8 rounded-[32px] flex flex-col justify-between h-[220px]">
          <div>
            <span className="text-[10px] uppercase font-extrabold tracking-widest text-[#8F9F68] block mb-2">
              Próxima Consulta
            </span>
            {nextApp ? (
              <div className="space-y-2">
                <h3 className="text-2xl font-serif font-black leading-tight text-black">
                  Dr. {nextApp.doctor.user.name} {nextApp.doctor.user.lastName}
                </h3>
                <p className="text-xs font-bold text-[#8F9F68] uppercase tracking-wider">
                  {nextApp.doctor.specialty}
                </p>
                <div className="flex items-center gap-2 text-sm text-black/70 font-semibold pt-2">
                  <Calendar className="h-4 w-4 text-black/50" />
                  <span>
                    {nextApp.dateTime.toLocaleDateString("es-ES", {
                      weekday: "long",
                      day: "numeric",
                      month: "long",
                    })}
                  </span>
                  <span>●</span>
                  <span>
                    {String(nextApp.dateTime.getHours()).padStart(2, "0")}:
                    {String(nextApp.dateTime.getMinutes()).padStart(2, "0")} hs
                  </span>
                </div>
              </div>
            ) : (
              <div className="space-y-1.5">
                <h3 className="text-xl font-serif font-black text-black">No tienes citas programadas</h3>
                <p className="text-xs text-black/50 font-medium">Reserva un turno con cualquiera de nuestros especialistas.</p>
              </div>
            )}
          </div>
          
          <div className="pt-4 border-t border-[#A2B676]/20 flex items-center justify-between">
            <Link 
              href={nextApp ? "/patient/appointments" : "/especialistas"} 
              className="text-xs font-bold uppercase tracking-wider text-black hover:text-[#8F9F68] transition-colors inline-flex items-center gap-1"
            >
              {nextApp ? "Administrar citas" : "Buscar especialista"} <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>

        {/* Resumen del Perfil Card */}
        <div className="bg-black/5 border border-black/10 p-6 sm:p-8 rounded-[32px] flex flex-col justify-between h-[220px]">
          <div>
            <span className="text-[10px] uppercase font-extrabold tracking-widest text-black/40 block mb-3">
              Datos Personales
            </span>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-black/60">
                <FileText className="h-3.5 w-3.5 opacity-60" />
                <span>DNI: {user.dni || "No registrado"}</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-black/60">
                <User className="h-3.5 w-3.5 opacity-60" />
                <span>Prepaga: {user.insurance || "No registrada"}</span>
              </div>
            </div>
          </div>
          <div className="pt-4 border-t border-black/5">
            <Link 
              href="/patient/profile" 
              className="text-xs font-bold uppercase tracking-wider text-black hover:opacity-70 transition-opacity inline-flex items-center gap-1"
            >
              Completar perfil <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>

        {/* Botón de Agendar Cita */}
        <div className="bg-black text-[#FDF6CD] p-6 sm:p-8 rounded-[32px] flex flex-col justify-between h-[220px]">
          <div>
            <span className="text-[10px] uppercase font-extrabold tracking-widest text-[#A2B676] block mb-3">
              Agendar Consulta
            </span>
            <p className="text-sm font-medium text-white/70">
              Busca entre nuestros especialistas y reserva tu próximo turno de forma rápida y sencilla.
            </p>
          </div>
          <div className="pt-4 border-t border-white/10">
            <Link
              href="/especialistas"
              className="w-full py-3 bg-[#A2B676] hover:bg-[#8F9F68] text-black text-center rounded-[18px] text-[11px] font-bold uppercase tracking-wider transition-colors inline-flex items-center justify-center gap-2"
            >
              <Stethoscope className="h-3.5 w-3.5" /> Agendar Cita
            </Link>
          </div>
        </div>
      </div>

      {/* Historial o lista de turnos de la sección inferior */}
      <div className="space-y-4 pt-4">
        <h2 className="text-xl font-serif font-black tracking-tight">Cronograma de Consultas</h2>
        
        {appointments.length === 0 ? (
          <div className="p-8 border border-dashed border-black/10 rounded-[28px] text-center bg-white/20">
            <p className="text-sm font-medium text-black/40">No tienes citas pendientes.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {appointments.map((app) => (
              <div 
                key={app.id} 
                className="bg-white/40 border border-white/60 p-5 rounded-[24px] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 transition-all hover:bg-white/70"
              >
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-2xl bg-[#A2B676]/20 border border-[#A2B676]/30 flex items-center justify-center font-bold text-[#8F9F68] shrink-0">
                    {app.doctor.user.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-black">
                      Dr. {app.doctor.user.name} {app.doctor.user.lastName}
                    </h4>
                    <p className="text-[10px] uppercase font-bold tracking-widest text-[#8F9F68]">
                      {app.doctor.specialty}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-6">
                  <div className="text-left sm:text-right font-medium">
                    <p className="text-xs font-bold text-black/80">
                      {app.dateTime.toLocaleDateString("es-ES", {
                        day: "numeric",
                        month: "short",
                        year: "numeric"
                      })}
                    </p>
                    <p className="text-[10px] text-black/50">
                      {String(app.dateTime.getHours()).padStart(2, "0")}:
                      {String(app.dateTime.getMinutes()).padStart(2, "0")} hs
                    </p>
                  </div>
                  <span className="px-3 py-1.5 rounded-full text-[9px] font-extrabold uppercase tracking-widest bg-[#A2B676] text-black">
                    Reservado
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}