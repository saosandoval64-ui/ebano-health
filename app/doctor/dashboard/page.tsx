import { auth } from "../../../lib/auth"
import { db } from "../../../lib/db"
import { redirect } from "next/navigation"
import TodayAppointmentsList from "./TodayAppointmentsList"
import { Calendar, Users, Activity, Heart, ArrowRight, Clock, User, MapPin } from "lucide-react"
import AvatarDisplay from "@/components/AvatarDisplay"
import CollapsibleCard from "@/components/CollapsibleCard"
import DaySelector from "@/components/DaySelector"
import Link from "next/link"

export default async function DoctorDashboard() {
  const session = await auth()
  if (!session?.user || session.user.role !== "DOCTOR") {
    return redirect("/login?role=doctor")
  }

  const user = await db.user.findUnique({
    where: { id: session.user.id },
  })

  const doctorProfile = await db.doctorProfile.findUnique({
    where: { userId: session.user.id },
  })

  if (!doctorProfile) {
    return (
      <div className="p-8 bg-red-50 border border-red-200 text-red-700 rounded-3xl">
        No se encontró el perfil de médico asociado. Comunícate con un administrador.
      </div>
    )
  }

  const now = new Date()
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0)
  const endOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59)

  const todayAppointments = await db.appointment.findMany({
    where: {
      doctorId: doctorProfile.id,
      dateTime: { gte: startOfToday, lte: endOfToday },
    },
    include: { patient: true },
    orderBy: { dateTime: "asc" },
  })

  const countToday = todayAppointments.filter((app) => app.status === "RESERVED").length

  const pendingTotal = await db.appointment.count({
    where: {
      doctorId: doctorProfile.id,
      status: "RESERVED",
      dateTime: { gte: now },
    },
  })

  const distinctPatients = await db.appointment.findMany({
    where: { doctorId: doctorProfile.id },
    select: { patientId: true },
    distinct: ["patientId"],
  })
  const patientCount = distinctPatients.length

  const followersCount = await db.favoriteDoctor.count({
    where: { doctorId: doctorProfile.id },
  })

  return (
    <div className="max-w-7xl mx-auto">
      {/* Mobile Header */}
      <div className="md:hidden px-5 pt-8 pb-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-black/40 uppercase tracking-widest mb-1">Mi consultorio</p>
            <h1 className="text-2xl font-serif font-black text-black tracking-tight">
              Dr. {user?.name}
            </h1>
            <p className="text-sm text-black/50 font-medium mt-0.5">Actividad de hoy</p>
          </div>
          <Link href="/patient/profile" className="shrink-0">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#F4C443] to-[#F9A825] flex items-center justify-center overflow-hidden border-2 border-white shadow-lg hover:scale-105 active:scale-95 transition-transform">
              <AvatarDisplay avatar={user?.avatar} name={user?.name || ""} size="sm" />
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
          <p className="text-xs font-bold text-black/40 uppercase tracking-widest mb-1">Mi consultorio</p>
          <h1 className="text-3xl md:text-4xl font-serif font-black text-black tracking-tight">
            ¡Hola, Dr. {user?.name}!
          </h1>
          <p className="text-sm font-medium text-black/50 mt-1">
            Esta es la actividad programada para hoy.
          </p>
        </div>
        <Link
          href="/doctor/appointments"
          className="inline-flex items-center gap-2 px-6 py-3 bg-black text-[#FDF6CD] rounded-full font-bold text-sm shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
        >
          <Calendar className="w-4 h-4" />
          Ver Turnos
        </Link>
      </div>

      <div className="px-5 md:px-8 space-y-8 md:space-y-10 pb-8">
        {/* Mobile: Quick Stats */}
        <div className="md:hidden">
          <h2 className="text-base font-serif font-black text-black mb-4">Resumen del Día</h2>
          <div className="flex gap-3 overflow-x-auto scrollbar-none pb-2">
            <CollapsibleCard id="doctor-today">
              <div className="min-w-[140px] bg-[#F4C443]/15 p-4 rounded-2xl flex items-center gap-3 shrink-0">
                <div className="w-11 h-11 rounded-xl bg-[#F4C443] flex items-center justify-center text-black shrink-0">
                  <Calendar className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-[9px] uppercase font-bold tracking-widest text-black/50">Hoy</p>
                  <h3 className="text-xl font-serif font-black">{countToday}</h3>
                </div>
              </div>
            </CollapsibleCard>
            <CollapsibleCard id="doctor-patients">
              <div className="min-w-[140px] bg-white p-4 rounded-2xl border border-gray-100 flex items-center gap-3 shrink-0">
                <div className="w-11 h-11 rounded-xl bg-black/5 flex items-center justify-center shrink-0">
                  <Users className="h-5 w-5 text-black/60" />
                </div>
                <div>
                  <p className="text-[9px] uppercase font-bold tracking-widest text-black/50">Pacientes</p>
                  <h3 className="text-xl font-serif font-black">{patientCount}</h3>
                </div>
              </div>
            </CollapsibleCard>
            <CollapsibleCard id="doctor-followers">
              <div className="min-w-[140px] bg-white p-4 rounded-2xl border border-gray-100 flex items-center gap-3 shrink-0">
                <div className="w-11 h-11 rounded-xl bg-rose-50 flex items-center justify-center shrink-0">
                  <Heart className="h-5 w-5 text-rose-400" />
                </div>
                <div>
                  <p className="text-[9px] uppercase font-bold tracking-widest text-black/50">Seguidores</p>
                  <h3 className="text-xl font-serif font-black">{followersCount}</h3>
                </div>
              </div>
            </CollapsibleCard>
          </div>
        </div>

        {/* Desktop: Stats */}
        <div className="hidden md:grid grid-cols-2 lg:grid-cols-4 gap-5">
          <CollapsibleCard id="doctor-today">
            <div className="bg-[#F4C443]/15 p-6 rounded-3xl flex items-center gap-4">
              <div className="w-13 h-13 rounded-2xl bg-[#F4C443] flex items-center justify-center text-black shrink-0">
                <Calendar className="h-6 w-6" />
              </div>
              <div>
                <p className="text-[10px] uppercase font-bold tracking-widest text-black/50">Citas de Hoy</p>
                <h3 className="text-2xl font-serif font-black">{countToday}</h3>
              </div>
            </div>
          </CollapsibleCard>
          <CollapsibleCard id="doctor-patients">
            <div className="bg-white p-6 rounded-3xl border border-gray-100 flex items-center gap-4">
              <div className="w-13 h-13 rounded-2xl bg-black/5 flex items-center justify-center shrink-0">
                <Users className="h-6 w-6 text-black/60" />
              </div>
              <div>
                <p className="text-[10px] uppercase font-bold tracking-widest text-black/50">Pacientes</p>
                <h3 className="text-2xl font-serif font-black">{patientCount}</h3>
              </div>
            </div>
          </CollapsibleCard>
          <CollapsibleCard id="doctor-pending">
            <div className="bg-white p-6 rounded-3xl border border-gray-100 flex items-center gap-4">
              <div className="w-13 h-13 rounded-2xl bg-black/5 flex items-center justify-center shrink-0">
                <Activity className="h-6 w-6 text-black/60" />
              </div>
              <div>
                <p className="text-[10px] uppercase font-bold tracking-widest text-black/50">Pendientes</p>
                <h3 className="text-2xl font-serif font-black">{pendingTotal}</h3>
              </div>
            </div>
          </CollapsibleCard>
          <CollapsibleCard id="doctor-followers">
            <div className="bg-white p-6 rounded-3xl border border-gray-100 flex items-center gap-4">
              <div className="w-13 h-13 rounded-2xl bg-rose-50 flex items-center justify-center shrink-0">
                <Heart className="h-6 w-6 text-rose-400" />
              </div>
              <div>
                <p className="text-[10px] uppercase font-bold tracking-widest text-black/50">Seguidores</p>
                <h3 className="text-2xl font-serif font-black">{followersCount}</h3>
              </div>
            </div>
          </CollapsibleCard>
        </div>

        {/* Today's Appointments */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg md:text-xl font-serif font-black tracking-tight">Pacientes Citados Hoy</h2>
            <Link
              href="/doctor/appointments"
              className="text-xs font-bold text-black/40 hover:text-black transition-colors inline-flex items-center gap-1"
            >
              Ver todos <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <TodayAppointmentsList initialAppointments={todayAppointments} />
        </div>

        {/* Profile Card - Mobile */}
        <div className="md:hidden">
          <Link href="/patient/profile" className="block bg-white p-5 rounded-3xl border border-gray-100 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#F4C443] to-[#F9A825] flex items-center justify-center overflow-hidden shrink-0">
                <AvatarDisplay avatar={user?.avatar} name={user?.name || ""} size="sm" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-black truncate">Mi Perfil</p>
                <p className="text-xs text-black/50 mt-0.5">Ver y editar datos personales</p>
              </div>
              <ArrowRight className="w-5 h-5 text-black/20 shrink-0" />
            </div>
          </Link>
        </div>

        {/* Desktop: Profile & Quick Links */}
        <div className="hidden md:grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
            <h3 className="text-xs font-bold uppercase tracking-widest text-black/40 mb-5">Mi Perfil</h3>
            <div className="flex items-center gap-4 mb-5">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#F4C443] to-[#F9A825] flex items-center justify-center overflow-hidden shrink-0">
                <AvatarDisplay avatar={user?.avatar} name={user?.name || ""} size="sm" />
              </div>
              <div>
                <p className="font-bold text-black">Dr. {user?.name} {user?.lastName}</p>
                <p className="text-xs text-[#F4C443] font-semibold">{doctorProfile.specialty}</p>
              </div>
            </div>
            <div className="space-y-3 mb-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#F4C443]/10 flex items-center justify-center">
                  <User className="w-5 h-5 text-[#F4C443]" />
                </div>
                <div>
                  <p className="text-[10px] text-black/40 uppercase font-bold tracking-wider">DNI</p>
                  <p className="text-sm font-bold text-black">{user?.dni || "No registrado"}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#8B5A2B]/10 flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-[#8B5A2B]" />
                </div>
                <div>
                  <p className="text-[10px] text-black/40 uppercase font-bold tracking-wider">Matrícula</p>
                  <p className="text-sm font-bold text-black">{doctorProfile.license || "No registrada"}</p>
                </div>
              </div>
            </div>
            <Link
              href="/patient/profile"
              className="inline-flex items-center justify-center gap-2 w-full px-4 py-3 bg-black/5 text-black rounded-2xl font-bold text-sm hover:bg-black/10 transition-all"
            >
              Editar perfil
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="lg:col-span-2 space-y-4">
            <DoctorFollowersSection doctorProfileId={doctorProfile.id} />
          </div>
        </div>

        {/* Mobile: Followers */}
        <div className="md:hidden">
          <DoctorFollowersSection doctorProfileId={doctorProfile.id} />
        </div>
      </div>
    </div>
  )
}

async function DoctorFollowersSection({ doctorProfileId }: { doctorProfileId: string }) {
  const followers = await db.favoriteDoctor.findMany({
    where: { doctorId: doctorProfileId },
    include: {
      patient: { select: { name: true, lastName: true, avatar: true, email: true } },
    },
    orderBy: { createdAt: "desc" },
    take: 10,
  })

  if (followers.length === 0) return null

  return (
    <div className="space-y-4">
      <h2 className="text-lg md:text-xl font-serif font-black tracking-tight flex items-center gap-2">
        <Heart className="h-5 w-5 text-rose-400" />
        Pacientes que te siguen
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {followers.map((f) => (
          <div
            key={f.id}
            className="bg-white p-4 rounded-2xl border border-gray-100 flex items-center gap-3"
          >
            <div className="w-11 h-11 rounded-xl bg-[#F4C443]/10 flex items-center justify-center overflow-hidden shrink-0">
              <AvatarDisplay avatar={f.patient.avatar} name={`${f.patient.name} ${f.patient.lastName || ""}`} size="sm" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-bold text-black truncate">{f.patient.name} {f.patient.lastName}</p>
              <p className="text-[11px] text-black/40 truncate">{f.patient.email}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
