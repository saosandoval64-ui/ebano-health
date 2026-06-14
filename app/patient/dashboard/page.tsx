import { auth } from "../../../lib/auth"
import { db } from "../../../lib/db"
import { getFollowedDoctors } from "../../actions/appointments"
import Link from "next/link"
import { Calendar, User, FileText, ArrowRight, Stethoscope, Plus, Activity, Clock, Heart, MapPin } from "lucide-react"
import AvatarDisplay from "@/components/AvatarDisplay"

const DAY_LABELS = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"]

export default async function PatientDashboard() {
  const session = await auth()
  if (!session?.user) return null

  const user = await db.user.findUnique({
    where: { id: session.user.id },
  })
  if (!user) return null

  // Get upcoming appointments
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
  const upcomingCount = appointments.length

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-7xl mx-auto space-y-8 animate-slideInUp">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-gray-500 mb-1">¡Bienvenido de vuelta!</p>
          <h1 className="text-3xl md:text-4xl font-serif font-black text-black tracking-tight">
            {user.name} {user.lastName}
          </h1>
        </div>
        <Link
          href="/especialistas"
          className="inline-flex items-center gap-2 px-5 py-3 bg-black text-[#FDF6CD] rounded-2xl font-bold text-sm shadow-lg shadow-black/10 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
        >
          <Plus className="w-4 h-4" />
          Agendar Turno
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm card-hover">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-2xl bg-[#A2B676]/10 flex items-center justify-center">
              <Calendar className="w-6 h-6 text-[#A2B676]" />
            </div>
            <span className="text-2xl font-black text-[#A2B676]">{upcomingCount}</span>
          </div>
          <p className="text-sm font-bold text-black mb-1">Turnos Próximos</p>
          <p className="text-xs text-gray-500">{upcomingCount === 1 ? "Cita programada" : "Citas programadas"}</p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm card-hover">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-2xl bg-[#8B5A2B]/10 flex items-center justify-center">
              <Stethoscope className="w-6 h-6 text-[#8B5A2B]" />
            </div>
            <span className="text-2xl font-black text-[#8B5A2B]">+</span>
          </div>
          <p className="text-sm font-bold text-black mb-1">Especialistas</p>
          <p className="text-xs text-gray-500">Busca y agenda</p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm card-hover">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-2xl bg-gray-100 flex items-center justify-center">
              <Activity className="w-6 h-6 text-gray-600" />
            </div>
          </div>
          <p className="text-sm font-bold text-black mb-1">Mi Historial</p>
          <p className="text-xs text-gray-500">Tus consultas pasadas</p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm card-hover">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center">
              <User className="w-6 h-6 text-gray-500" />
            </div>
          </div>
          <p className="text-sm font-bold text-black mb-1">Mi Perfil</p>
          <p className="text-xs text-gray-500">Datos personales</p>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Next Appointment Card */}
        <div className="lg:col-span-2">
          <div className="bg-gradient-to-br from-[#A2B676] to-[#A2B676]/90 p-6 sm:p-8 rounded-3xl text-white shadow-lg shadow-[#A2B676]/20 card-hover">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                <span className="text-sm font-bold uppercase tracking-wider opacity-90">Tu próxima cita</span>
              </div>
            </div>

            {nextApp ? (
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center">
                    <Stethoscope className="w-8 h-8" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-black">
                      Dr. {nextApp.doctor.user.name} {nextApp.doctor.user.lastName}
                    </h3>
                    <p className="opacity-90 font-medium">{nextApp.doctor.specialty}</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3 pt-2 border-t border-white/20 mt-4">
                  <div className="flex items-center gap-2 bg-white/10 backdrop-blur px-4 py-2 rounded-xl">
                    <Clock className="w-4 h-4" />
                    <span className="font-semibold">
                      {nextApp.dateTime.toLocaleDateString("es-ES", {
                        weekday: "long",
                        day: "numeric",
                        month: "long",
                      })}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 bg-white/10 backdrop-blur px-4 py-2 rounded-xl">
                    <span className="text-lg font-black">
                      {String(nextApp.dateTime.getHours()).padStart(2, "0")}:
                      {String(nextApp.dateTime.getMinutes()).padStart(2, "0")}
                    </span>
                    <span className="text-sm opacity-80">hs</span>
                  </div>
                </div>

                <Link
                  href="/patient/appointments"
                  className="inline-flex items-center gap-2 mt-6 px-5 py-3 bg-white text-[#A2B676] rounded-2xl font-bold text-sm hover:bg-white/90 transition-all"
                >
                  Ver todos los turnos
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-4">
                  <Calendar className="w-10 h-10" />
                </div>
                <h3 className="text-xl font-bold mb-2">No tienes turnos programados</h3>
                <p className="opacity-80 mb-6">Reserva tu primera cita ahora mismo</p>
                <Link
                  href="/especialistas"
                  className="inline-flex items-center gap-2 px-5 py-3 bg-white text-[#A2B676] rounded-2xl font-bold text-sm hover:bg-white/90 transition-all"
                >
                  Buscar especialistas
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Quick Info Card */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
            <h3 className="text-sm font-bold uppercase tracking-wider text-gray-500 mb-4">Tu información</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center">
                  <User className="w-5 h-5 text-gray-500" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">DNI</p>
                  <p className="text-sm font-bold text-black">{user.dni || "No registrado"}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center">
                  <FileText className="w-5 h-5 text-gray-500" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Obra Social</p>
                  <p className="text-sm font-bold text-black">{user.insurance || "No registrada"}</p>
                </div>
              </div>
            </div>
            <Link
              href="/patient/profile"
              className="inline-flex items-center gap-2 mt-6 w-full text-center justify-center px-4 py-3 bg-gray-50 text-black rounded-2xl font-bold text-sm hover:bg-gray-100 transition-all"
            >
              Editar perfil
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="bg-gradient-to-br from-[#1A1A1A] to-[#2D2D2D] p-6 rounded-3xl text-white shadow-lg">
            <h3 className="text-sm font-bold uppercase tracking-wider opacity-70 mb-3">¿Necesitas ayuda?</h3>
            <p className="text-sm opacity-80 mb-4">Nuestro equipo está disponible para ayudarte</p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 w-full text-center justify-center px-4 py-3 bg-white text-black rounded-2xl font-bold text-sm hover:bg-gray-100 transition-all"
            >
              Contactar soporte
            </Link>
          </div>
        </div>
      </div>

      {/* Mis Médicos Seguidos */}
      <PatientFollowedDoctors />

      {/* Upcoming Appointments List */}
      {appointments.length > 1 && (
        <div>
          <h2 className="text-xl font-bold text-black mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-[#A2B676]" />
            Próximos turnos
          </h2>
          <div className="space-y-3">
            {appointments.slice(1).map((appointment) => (
              <div
                key={appointment.id}
                className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between card-hover"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-[#A2B676]/10 flex items-center justify-center">
                    <Calendar className="w-6 h-6 text-[#A2B676]" />
                  </div>
                  <div>
                    <p className="font-bold text-black">
                      Dr. {appointment.doctor.user.name} {appointment.doctor.user.lastName}
                    </p>
                    <p className="text-xs text-gray-500">{appointment.doctor.specialty}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-black">
                    {appointment.dateTime.toLocaleDateString("es-ES", {
                      day: "numeric",
                      month: "short",
                    })}
                  </p>
                  <p className="text-xs text-gray-500">
                    {String(appointment.dateTime.getHours()).padStart(2, "0")}:
                    {String(appointment.dateTime.getMinutes()).padStart(2, "0")}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

async function PatientFollowedDoctors() {
  const followed = await getFollowedDoctors()
  if (followed.length === 0) return null

  return (
    <div>
      <h2 className="text-xl font-bold text-black mb-4 flex items-center gap-2">
        <Heart className="w-5 h-5 text-red-400" />
        Médicos que sigo
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {followed.map((doc) => (
          <Link
            key={doc.id}
            href={`/especialistas/${doc.userId}`}
            className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm card-hover block"
          >
            <div className="flex items-center gap-4 mb-3">
              <div className="w-12 h-12 rounded-2xl bg-[#A2B676]/10 flex items-center justify-center overflow-hidden">
                <AvatarDisplay avatar={doc.avatar} name={doc.name} size="sm" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-black text-sm truncate">{doc.name}</p>
                <p className="text-xs text-[#A2B676] font-semibold">{doc.specialty}</p>
              </div>
            </div>
            <div className="space-y-1">
              {doc.availability.length > 0 ? (
                doc.availability.slice(0, 3).map((a, i) => (
                  <div key={i} className="flex items-center gap-2 text-[10px] text-gray-500">
                    <MapPin className="h-3 w-3 text-[#A2B676]" />
                    <span className="font-bold">{DAY_LABELS[a.dayOfWeek]}:</span>
                    <span>{a.startTime} - {a.endTime}</span>
                  </div>
                ))
              ) : (
                <p className="text-[10px] text-gray-400 italic">Sin horarios configurados</p>
              )}
              {doc.availability.length > 3 && (
                <p className="text-[10px] text-[#A2B676] font-bold">+{doc.availability.length - 3} días más</p>
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
