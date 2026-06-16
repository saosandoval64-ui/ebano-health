import { auth } from "../../../lib/auth"
import { db } from "../../../lib/db"
import { getFollowedDoctors } from "../../actions/appointments"
import Link from "next/link"
import { Calendar, User, FileText, ArrowRight, Stethoscope, Activity, Clock, Heart } from "lucide-react"
import AvatarDisplay from "@/components/AvatarDisplay"
import DaySelector from "@/components/DaySelector"

export default async function PatientDashboard() {
  const session = await auth()
  if (!session?.user) return null

  const user = await db.user.findUnique({
    where: { id: session.user.id },
  })
  if (!user) return null

  const appointments = await db.appointment.findMany({
    where: {
      patientId: user.id,
      dateTime: { gte: new Date() },
      status: "RESERVED",
    },
    include: {
      doctor: {
        include: { user: true },
      },
    },
    orderBy: { dateTime: "asc" },
  })

  const nextApp = appointments[0]
  const upcomingCount = appointments.length

  return (
    <div className="max-w-5xl mx-auto px-5 md:px-8">
      {/* Header */}
      <div className="flex items-center justify-between pt-8 pb-6">
        <div>
          <p className="text-xs font-bold text-black/40 uppercase tracking-widest mb-1">Mi salud</p>
          <h1 className="text-2xl md:text-3xl font-serif font-black text-black tracking-tight">
            Hola, {user.name}
          </h1>
        </div>
        <Link href="/patient/profile" className="shrink-0">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#F4C443] to-[#F9A825] flex items-center justify-center overflow-hidden border-2 border-white shadow-lg hover:scale-105 active:scale-95 transition-transform">
            <AvatarDisplay avatar={user.avatar} name={user.name} size="sm" />
          </div>
        </Link>
      </div>

      {/* Day Selector */}
      <div className="mb-8">
        <DaySelector />
      </div>

      {/* Quick Actions Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-10">
        <Link href="/patient/appointments" className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center gap-3 text-center hover:shadow-md transition-shadow active:scale-[0.98]">
          <div className="w-12 h-12 rounded-xl bg-[#F4C443]/15 flex items-center justify-center">
            <Calendar className="w-6 h-6 text-[#F4C443]" />
          </div>
          <div>
            <p className="text-lg font-black text-black">{upcomingCount}</p>
            <p className="text-[11px] font-semibold text-black/50">Turnos</p>
          </div>
        </Link>

        <Link href="/especialistas" className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center gap-3 text-center hover:shadow-md transition-shadow active:scale-[0.98]">
          <div className="w-12 h-12 rounded-xl bg-[#8B5A2B]/10 flex items-center justify-center">
            <Stethoscope className="w-6 h-6 text-[#8B5A2B]" />
          </div>
          <div>
            <p className="text-lg font-black text-black">Buscar</p>
            <p className="text-[11px] font-semibold text-black/50">Especialistas</p>
          </div>
        </Link>

        <Link href="/patient/my-doctors" className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center gap-3 text-center hover:shadow-md transition-shadow active:scale-[0.98]">
          <div className="w-12 h-12 rounded-xl bg-rose-50 flex items-center justify-center">
            <Heart className="w-6 h-6 text-rose-400" />
          </div>
          <div>
            <p className="text-lg font-black text-black">Mis</p>
            <p className="text-[11px] font-semibold text-black/50">Médicos</p>
          </div>
        </Link>

        <Link href="/patient/profile" className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center gap-3 text-center hover:shadow-md transition-shadow active:scale-[0.98]">
          <div className="w-12 h-12 rounded-xl bg-black/5 flex items-center justify-center">
            <User className="w-6 h-6 text-black/50" />
          </div>
          <div>
            <p className="text-lg font-black text-black">Mi</p>
            <p className="text-[11px] font-semibold text-black/50">Perfil</p>
          </div>
        </Link>
      </div>

      {/* Next Appointment */}
      {nextApp && (
        <div className="mb-10">
          <div className="bg-gradient-to-br from-[#F4C443] to-[#F9A825] p-6 md:p-8 rounded-3xl text-black shadow-lg">
            <div className="flex items-center gap-2 mb-4">
              <Calendar className="w-4 h-4" />
              <span className="text-xs font-bold uppercase tracking-wider opacity-70">Tu próxima cita</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-black/10 flex items-center justify-center shrink-0">
                <Stethoscope className="w-7 h-7 text-black" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-xl font-black truncate">
                  Dr. {nextApp.doctor.user.name} {nextApp.doctor.user.lastName}
                </h3>
                <p className="opacity-70 font-medium text-sm">{nextApp.doctor.specialty}</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-black/10">
              <div className="flex items-center gap-1.5 bg-black/10 px-3 py-1.5 rounded-xl">
                <Clock className="w-3.5 h-3.5" />
                <span className="font-semibold text-xs">
                  {nextApp.dateTime.toLocaleDateString("es-ES", { weekday: "long", day: "numeric", month: "long" })}
                </span>
              </div>
              <div className="flex items-center gap-1.5 bg-black/10 px-3 py-1.5 rounded-xl">
                <span className="text-sm font-black">
                  {String(nextApp.dateTime.getHours()).padStart(2, "0")}:{String(nextApp.dateTime.getMinutes()).padStart(2, "0")}
                </span>
                <span className="text-xs opacity-70">hs</span>
              </div>
            </div>
            <Link
              href="/patient/appointments"
              className="inline-flex items-center gap-2 mt-4 px-5 py-2.5 bg-black text-[#FDF6CD] rounded-xl font-bold text-xs hover:bg-black/80 transition-all"
            >
              Ver todos los turnos
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      )}

      {/* Bottom Info Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pb-10">
        {/* Info Card */}
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
          <h3 className="text-xs font-bold uppercase tracking-widest text-black/40 mb-4">Tu información</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#F4C443]/10 flex items-center justify-center">
                <User className="w-5 h-5 text-[#F4C443]" />
              </div>
              <div>
                <p className="text-[10px] text-black/40 uppercase font-bold tracking-wider">DNI</p>
                <p className="text-sm font-bold text-black">{user.dni || "No registrado"}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#8B5A2B]/10 flex items-center justify-center">
                <FileText className="w-5 h-5 text-[#8B5A2B]" />
              </div>
              <div>
                <p className="text-[10px] text-black/40 uppercase font-bold tracking-wider">Obra Social</p>
                <p className="text-sm font-bold text-black">{user.insurance || "No registrada"}</p>
              </div>
            </div>
          </div>
          <Link
            href="/patient/profile"
            className="inline-flex items-center justify-center gap-2 mt-4 w-full px-4 py-2.5 bg-black/5 text-black rounded-xl font-bold text-xs hover:bg-black/10 transition-all"
          >
            Editar perfil
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Followed Doctors */}
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
          <h3 className="text-xs font-bold uppercase tracking-widest text-black/40 mb-4">Médicos que sigo</h3>
          <PatientFollowedDoctorsInline />
        </div>

        {/* Help */}
        <div className="bg-gradient-to-br from-black to-gray-800 p-5 rounded-2xl text-white shadow-lg">
          <h3 className="text-xs font-bold uppercase tracking-widest opacity-50 mb-2">¿Necesitas ayuda?</h3>
          <p className="text-xs opacity-70 mb-4">Nuestro equipo está disponible para ayudarte</p>
          <Link
            href="/contact"
            className="inline-flex items-center justify-center gap-2 w-full px-4 py-2.5 bg-[#F4C443] text-black rounded-xl font-bold text-xs hover:bg-[#F4C443]/80 transition-all"
          >
            Contactar soporte
          </Link>
        </div>
      </div>
    </div>
  )
}

async function PatientFollowedDoctorsInline() {
  const followed = await getFollowedDoctors()
  if (followed.length === 0) {
    return <p className="text-xs text-black/40">Aún no seguís a ningún médico</p>
  }

  return (
    <div className="space-y-2">
      {followed.slice(0, 3).map((doc) => (
        <Link
          key={doc.id}
          href={`/especialistas/${doc.userId}`}
          className="flex items-center gap-3 p-2 rounded-xl hover:bg-black/5 transition-all"
        >
          <div className="w-10 h-10 rounded-xl bg-[#F4C443]/10 flex items-center justify-center overflow-hidden shrink-0">
            <AvatarDisplay avatar={doc.avatar} name={doc.name} size="sm" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-bold text-black text-sm truncate">{doc.name}</p>
            <p className="text-[10px] text-[#F4C443] font-semibold">{doc.specialty}</p>
          </div>
          <ArrowRight className="w-3.5 h-3.5 text-black/20 shrink-0" />
        </Link>
      ))}
    </div>
  )
}
