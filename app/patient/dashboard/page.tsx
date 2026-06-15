import { auth } from "../../../lib/auth"
import { db } from "../../../lib/db"
import { getFollowedDoctors } from "../../actions/appointments"
import Link from "next/link"
import { Calendar, User, FileText, ArrowRight, Stethoscope, Plus, Activity, Clock, Heart, MapPin } from "lucide-react"
import AvatarDisplay from "@/components/AvatarDisplay"
import CollapsibleCard from "@/components/CollapsibleCard"
import DaySelector from "@/components/DaySelector"
import JournalCard from "@/components/JournalCard"
import QuickActionCard from "@/components/QuickActionCard"

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
    <div className="max-w-7xl mx-auto">
      {/* Mobile Header */}
      <div className="md:hidden px-5 pt-8 pb-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-black/40 uppercase tracking-widest mb-1">Mi salud</p>
            <h1 className="text-2xl font-serif font-black text-black tracking-tight">
              Hola, {user.name}
            </h1>
            <p className="text-sm text-black/50 font-medium mt-0.5">¿Cómo te sentís hoy?</p>
          </div>
          <Link href="/patient/profile" className="shrink-0">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#F4C443] to-[#F9A825] flex items-center justify-center overflow-hidden border-2 border-white shadow-lg hover:scale-105 active:scale-95 transition-transform">
              <AvatarDisplay avatar={user.avatar} name={user.name} size="sm" />
            </div>
          </Link>
        </div>
        <div className="mt-4">
          <DaySelector />
        </div>
      </div>

      {/* Desktop Header */}
      <div className="hidden md:flex items-center justify-between px-8 pt-8 pb-6">
        <div>
          <p className="text-xs font-bold text-black/40 uppercase tracking-widest mb-1">Mi salud</p>
          <h1 className="text-3xl md:text-4xl font-serif font-black text-black tracking-tight">
            {user.name} {user.lastName}
          </h1>
        </div>
        <Link
          href="/especialistas"
          className="inline-flex items-center gap-2 px-6 py-3 bg-black text-[#FDF6CD] rounded-full font-bold text-sm shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
        >
          <Plus className="w-4 h-4" />
          Agendar Turno
        </Link>
      </div>

      <div className="px-5 md:px-8 space-y-8 md:space-y-10 pb-8">
        {/* Mobile: Quick Actions */}
        <div className="md:hidden">
          <h2 className="text-base font-serif font-black text-black mb-4">Accesos Rápidos</h2>
          <div className="flex gap-3 overflow-x-auto scrollbar-none pb-2">
            <CollapsibleCard id="patient-upcoming">
              <div className="min-w-[140px] bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center gap-2.5 text-center">
                <div className="w-11 h-11 rounded-xl bg-[#F4C443]/15 flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-[#F4C443]" />
                </div>
                <p className="text-lg font-black text-black">{upcomingCount}</p>
                <p className="text-[11px] font-semibold text-black/50">Turnos</p>
              </div>
            </CollapsibleCard>
            <CollapsibleCard id="patient-specialists">
              <Link href="/especialistas" className="min-w-[140px] bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center gap-2.5 text-center block">
                <div className="w-11 h-11 rounded-xl bg-[#8B5A2B]/10 flex items-center justify-center">
                  <Stethoscope className="w-5 h-5 text-[#8B5A2B]" />
                </div>
                <p className="text-lg font-black text-black">Buscar</p>
                <p className="text-[11px] font-semibold text-black/50">Especialistas</p>
              </Link>
            </CollapsibleCard>
            <CollapsibleCard id="patient-history">
              <div className="min-w-[140px] bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center gap-2.5 text-center">
                <div className="w-11 h-11 rounded-xl bg-gray-100 flex items-center justify-center">
                  <Activity className="w-5 h-5 text-gray-500" />
                </div>
                <p className="text-lg font-black text-black">Mi Historial</p>
                <p className="text-[11px] font-semibold text-black/50">Consultas</p>
              </div>
            </CollapsibleCard>
          </div>
        </div>

        {/* Mobile: My Journal */}
        <div className="md:hidden">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-serif font-black text-black">Mis Citas</h2>
            <Link href="/patient/appointments" className="text-xs font-bold text-black/40 hover:text-black transition-colors">
              Ver todo
            </Link>
          </div>
          <div className="flex gap-3 overflow-x-auto scrollbar-none pb-2">
            {nextApp ? (
              <JournalCard
                title={`Dr. ${nextApp.doctor.user.name}`}
                subtitle={nextApp.doctor.specialty}
                variant="morning"
              />
            ) : (
              <div className="min-w-[260px] h-[180px] rounded-3xl bg-white border border-gray-100 p-6 flex flex-col items-center justify-center text-center shrink-0">
                <Calendar className="w-8 h-8 text-black/20 mb-3" />
                <p className="text-sm font-bold text-black/40">Sin citas próximas</p>
                <Link href="/especialistas" className="text-xs font-bold text-[#F4C443] mt-2">
                  Agendar ahora →
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Mobile: Quick Journal */}
        <div className="md:hidden">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-serif font-black text-black">Turnos Próximos</h2>
            <Link href="/patient/appointments" className="text-xs font-bold text-black/40 hover:text-black transition-colors">
              Ver todo
            </Link>
          </div>
          <div className="flex gap-3 overflow-x-auto scrollbar-none pb-2">
            <QuickActionCard
              title="Pausar y reflexionar"
              subtitle="¿Cómo te sentís hoy?"
              color="pink"
              tags={["Hoy", "Personal"]}
            />
            <QuickActionCard
              title="Establecer intenciones"
              subtitle="¿Qué querés lograr?"
              color="blue"
              tags={["Hoy", "Salud"]}
            />
            <QuickActionCard
              title="Seguimiento"
              subtitle="Revisá tu historial"
              color="green"
              tags={["Hoy"]}
            />
          </div>
        </div>

        {/* Desktop: Stats Cards */}
        <div className="hidden md:grid grid-cols-2 lg:grid-cols-4 gap-5">
          <CollapsibleCard id="patient-upcoming">
            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm card-hover">
              <div className="flex items-center justify-between mb-5">
                <div className="w-13 h-13 rounded-2xl bg-[#F4C443]/15 flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-[#F4C443]" />
                </div>
                <span className="text-3xl font-black text-[#F4C443]">{upcomingCount}</span>
              </div>
              <p className="text-sm font-bold text-black mb-1">Turnos Próximos</p>
              <p className="text-xs text-black/50">{upcomingCount === 1 ? "Cita programada" : "Citas programadas"}</p>
            </div>
          </CollapsibleCard>

          <CollapsibleCard id="patient-specialists">
            <Link href="/especialistas" className="block bg-white p-6 rounded-3xl border border-gray-100 shadow-sm card-hover">
              <div className="flex items-center justify-between mb-5">
                <div className="w-13 h-13 rounded-2xl bg-[#8B5A2B]/10 flex items-center justify-center">
                  <Stethoscope className="w-6 h-6 text-[#8B5A2B]" />
                </div>
                <ArrowRight className="w-5 h-5 text-black/20" />
              </div>
              <p className="text-sm font-bold text-black mb-1">Especialistas</p>
              <p className="text-xs text-black/50">Busca y agenda</p>
            </Link>
          </CollapsibleCard>

          <CollapsibleCard id="patient-history">
            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm card-hover">
              <div className="flex items-center justify-between mb-5">
                <div className="w-13 h-13 rounded-2xl bg-gray-100 flex items-center justify-center">
                  <Activity className="w-6 h-6 text-gray-600" />
                </div>
              </div>
              <p className="text-sm font-bold text-black mb-1">Mi Historial</p>
              <p className="text-xs text-black/50">Consultas pasadas</p>
            </div>
          </CollapsibleCard>

          <CollapsibleCard id="patient-profile">
            <Link href="/patient/profile" className="block bg-white p-6 rounded-3xl border border-gray-100 shadow-sm card-hover">
              <div className="flex items-center justify-between mb-5">
                <div className="w-13 h-13 rounded-2xl bg-gray-50 flex items-center justify-center">
                  <User className="w-6 h-6 text-gray-500" />
                </div>
                <ArrowRight className="w-5 h-5 text-black/20" />
              </div>
              <p className="text-sm font-bold text-black mb-1">Mi Perfil</p>
              <p className="text-xs text-black/50">Datos personales</p>
            </Link>
          </CollapsibleCard>
        </div>

        {/* Desktop: Next Appointment */}
        {nextApp && (
          <div className="hidden md:block">
            <div className="bg-gradient-to-br from-[#F4C443] to-[#F9A825] p-8 rounded-3xl text-black shadow-lg shadow-[#F4C443]/20 card-hover">
              <div className="flex items-center gap-2 mb-5">
                <Calendar className="w-5 h-5" />
                <span className="text-sm font-bold uppercase tracking-wider opacity-70">Tu próxima cita</span>
              </div>
              <div className="flex items-start gap-5">
                <div className="w-16 h-16 rounded-2xl bg-black/10 backdrop-blur flex items-center justify-center shrink-0">
                  <Stethoscope className="w-8 h-8 text-black" />
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-black">
                    Dr. {nextApp.doctor.user.name} {nextApp.doctor.user.lastName}
                  </h3>
                  <p className="opacity-70 font-medium mt-1">{nextApp.doctor.specialty}</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-3 pt-5 mt-5 border-t border-black/10">
                <div className="flex items-center gap-2 bg-black/10 px-4 py-2.5 rounded-xl">
                  <Clock className="w-4 h-4" />
                  <span className="font-semibold text-sm">
                    {nextApp.dateTime.toLocaleDateString("es-ES", {
                      weekday: "long",
                      day: "numeric",
                      month: "long",
                    })}
                  </span>
                </div>
                <div className="flex items-center gap-2 bg-black/10 px-4 py-2.5 rounded-xl">
                  <span className="text-lg font-black">
                    {String(nextApp.dateTime.getHours()).padStart(2, "0")}:
                    {String(nextApp.dateTime.getMinutes()).padStart(2, "0")}
                  </span>
                  <span className="text-sm opacity-70">hs</span>
                </div>
              </div>
              <Link
                href="/patient/appointments"
                className="inline-flex items-center gap-2 mt-6 px-6 py-3 bg-black text-[#FDF6CD] rounded-2xl font-bold text-sm hover:bg-black/80 transition-all"
              >
                Ver todos los turnos
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        )}

        {/* Desktop: Info Cards */}
        <div className="hidden md:grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
            <h3 className="text-xs font-bold uppercase tracking-widest text-black/40 mb-5">Tu información</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-[#F4C443]/10 flex items-center justify-center">
                  <User className="w-5 h-5 text-[#F4C443]" />
                </div>
                <div>
                  <p className="text-[10px] text-black/40 uppercase font-bold tracking-wider">DNI</p>
                  <p className="text-sm font-bold text-black">{user.dni || "No registrado"}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-[#8B5A2B]/10 flex items-center justify-center">
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
              className="inline-flex items-center justify-center gap-2 mt-6 w-full px-4 py-3 bg-black/5 text-black rounded-2xl font-bold text-sm hover:bg-black/10 transition-all"
            >
              Editar perfil
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
            <h3 className="text-xs font-bold uppercase tracking-widest text-black/40 mb-5">Médicos que sigo</h3>
            <PatientFollowedDoctorsInline />
          </div>

          <div className="bg-gradient-to-br from-black to-gray-800 p-6 rounded-3xl text-white shadow-lg">
            <h3 className="text-xs font-bold uppercase tracking-widest opacity-50 mb-3">¿Necesitas ayuda?</h3>
            <p className="text-sm opacity-70 mb-5">Nuestro equipo está disponible para ayudarte</p>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 w-full px-4 py-3 bg-[#F4C443] text-black rounded-2xl font-bold text-sm hover:bg-[#F4C443]/80 transition-all"
            >
              Contactar soporte
            </Link>
          </div>
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
    <div className="space-y-3">
      {followed.slice(0, 3).map((doc) => (
        <Link
          key={doc.id}
          href={`/especialistas/${doc.userId}`}
          className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-black/5 transition-all"
        >
          <div className="w-11 h-11 rounded-xl bg-[#F4C443]/10 flex items-center justify-center overflow-hidden shrink-0">
            <AvatarDisplay avatar={doc.avatar} name={doc.name} size="sm" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-bold text-black text-sm truncate">{doc.name}</p>
            <p className="text-[11px] text-[#F4C443] font-semibold">{doc.specialty}</p>
          </div>
          <ArrowRight className="w-4 h-4 text-black/20 shrink-0" />
        </Link>
      ))}
    </div>
  )
}
