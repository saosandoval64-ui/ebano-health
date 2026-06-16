import { auth } from "../../../lib/auth"
import { db } from "../../../lib/db"
import { redirect } from "next/navigation"
import TodayAppointmentsList from "./TodayAppointmentsList"
import { Calendar, Users, Activity, Heart, ArrowRight, Clock, User } from "lucide-react"
import AvatarDisplay from "@/components/AvatarDisplay"
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
      <div className="max-w-5xl mx-auto px-5 md:px-8 py-8">
        <div className="p-8 bg-red-50 border border-red-200 text-red-700 rounded-3xl text-center">
          No se encontró el perfil de médico asociado. Comunícate con un administrador.
        </div>
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
    <div className="max-w-5xl mx-auto px-5 md:px-8">
      {/* Header */}
      <div className="flex items-center justify-between pt-8 pb-6">
        <div>
          <p className="text-xs font-bold text-black/40 uppercase tracking-widest mb-1">Mi consultorio</p>
          <h1 className="text-2xl md:text-3xl font-serif font-black text-black tracking-tight">
            Dr. {user?.name}
          </h1>
        </div>
        <Link href="/doctor/availability" className="shrink-0">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#F4C443] to-[#F9A825] flex items-center justify-center overflow-hidden border-2 border-white shadow-lg hover:scale-105 active:scale-95 transition-transform">
            <AvatarDisplay avatar={user?.avatar} name={user?.name || ""} size="sm" />
          </div>
        </Link>
      </div>

      {/* Day Selector */}
      <div className="mb-8">
        <DaySelector />
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-10">
        <div className="bg-[#F4C443]/15 p-5 rounded-2xl flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-[#F4C443] flex items-center justify-center text-black shrink-0">
            <Calendar className="h-6 w-6" />
          </div>
          <div>
            <p className="text-[10px] uppercase font-bold tracking-widest text-black/50">Hoy</p>
            <h3 className="text-2xl font-serif font-black">{countToday}</h3>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-100 flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-black/5 flex items-center justify-center shrink-0">
            <Users className="h-6 w-6 text-black/60" />
          </div>
          <div>
            <p className="text-[10px] uppercase font-bold tracking-widest text-black/50">Pacientes</p>
            <h3 className="text-2xl font-serif font-black">{patientCount}</h3>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-100 flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-black/5 flex items-center justify-center shrink-0">
            <Activity className="h-6 w-6 text-black/60" />
          </div>
          <div>
            <p className="text-[10px] uppercase font-bold tracking-widest text-black/50">Pendientes</p>
            <h3 className="text-2xl font-serif font-black">{pendingTotal}</h3>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-100 flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-rose-50 flex items-center justify-center shrink-0">
            <Heart className="h-6 w-6 text-rose-400" />
          </div>
          <div>
            <p className="text-[10px] uppercase font-bold tracking-widest text-black/50">Seguidores</p>
            <h3 className="text-2xl font-serif font-black">{followersCount}</h3>
          </div>
        </div>
      </div>

      {/* Today's Appointments */}
      <div className="mb-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-serif font-black tracking-tight">Pacientes Citados Hoy</h2>
          <Link
            href="/doctor/appointments"
            className="text-xs font-bold text-black/40 hover:text-black transition-colors inline-flex items-center gap-1"
          >
            Ver todos <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
        <TodayAppointmentsList initialAppointments={todayAppointments} />
      </div>

      {/* Bottom Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-10">
        {/* Profile Card */}
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
          <h3 className="text-xs font-bold uppercase tracking-widest text-black/40 mb-4">Mi Perfil</h3>
          <div className="flex items-center gap-4 mb-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#F4C443] to-[#F9A825] flex items-center justify-center overflow-hidden shrink-0">
              <AvatarDisplay avatar={user?.avatar} name={user?.name || ""} size="sm" />
            </div>
            <div>
              <p className="font-bold text-black">Dr. {user?.name} {user?.lastName}</p>
              <p className="text-xs text-[#F4C443] font-semibold">{doctorProfile.specialty}</p>
            </div>
          </div>
          <div className="space-y-2 mb-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-[#F4C443]/10 flex items-center justify-center">
                <User className="w-4 h-4 text-[#F4C443]" />
              </div>
              <div>
                <p className="text-[9px] text-black/40 uppercase font-bold tracking-wider">DNI</p>
                <p className="text-xs font-bold text-black">{user?.dni || "No registrado"}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-[#8B5A2B]/10 flex items-center justify-center">
                <Activity className="w-4 h-4 text-[#8B5A2B]" />
              </div>
              <div>
                <p className="text-[9px] text-black/40 uppercase font-bold tracking-wider">Matrícula</p>
                <p className="text-xs font-bold text-black">{doctorProfile.license || "No registrada"}</p>
              </div>
            </div>
          </div>
          <Link
            href="/doctor/availability"
            className="inline-flex items-center justify-center gap-2 w-full px-4 py-2.5 bg-black/5 text-black rounded-xl font-bold text-xs hover:bg-black/10 transition-all"
          >
            Editar disponibilidad
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Followers */}
        <DoctorFollowersSection doctorProfileId={doctorProfile.id} />
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
    take: 5,
  })

  if (followers.length === 0) {
    return (
      <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
        <h3 className="text-xs font-bold uppercase tracking-widest text-black/40 mb-4">Pacientes que te siguen</h3>
        <p className="text-xs text-black/40">Aún no tenés seguidores</p>
      </div>
    )
  }

  return (
    <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
      <h3 className="text-xs font-bold uppercase tracking-widest text-black/40 mb-4 flex items-center gap-2">
        <Heart className="h-3.5 w-3.5 text-rose-400" />
        Pacientes que te siguen
      </h3>
      <div className="space-y-2">
        {followers.map((f) => (
          <div key={f.id} className="flex items-center gap-3 p-2 rounded-xl">
            <div className="w-10 h-10 rounded-xl bg-[#F4C443]/10 flex items-center justify-center overflow-hidden shrink-0">
              <AvatarDisplay avatar={f.patient.avatar} name={`${f.patient.name} ${f.patient.lastName || ""}`} size="sm" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-bold text-black truncate">{f.patient.name} {f.patient.lastName}</p>
              <p className="text-[10px] text-black/40 truncate">{f.patient.email}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
