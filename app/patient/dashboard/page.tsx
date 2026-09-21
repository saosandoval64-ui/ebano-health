import { auth } from "../../../lib/auth"
import { db } from "../../../lib/db"
import { getFollowedDoctors } from "../../actions/appointments"
import Link from "next/link"
import { Calendar, User, FileText, ArrowRight, Stethoscope, Activity, Clock, Heart, MessageSquare } from "lucide-react"
import AvatarDisplay from "@/components/AvatarDisplay"

export default async function PatientDashboard() {
  const session = await auth()
  if (!session?.user) return null

  const user = await db.user.findUnique({
    where: { id: session.user.id },
    select: { id: true, name: true, lastName: true, dni: true, insurance: true, avatar: true },
  })
  if (!user) return null

  const now = new Date()

  const [appointments, pastCount, recordsCount] = await Promise.all([
    db.appointment.findMany({
      where: { patientId: user.id, dateTime: { gte: now }, status: "RESERVED" },
      include: {
        doctor: {
          select: {
            specialty: true,
            user: { select: { name: true, lastName: true, avatar: true } },
          },
        },
      },
      orderBy: { dateTime: "asc" },
      take: 3,
    }),
    db.appointment.count({ where: { patientId: user.id, dateTime: { lt: now } } }),
    db.medicalRecord.count({ where: { patientId: user.id } }),
  ])

  const nextApp = appointments[0]
  const upcomingCount = appointments.length

  return (
    <div className="max-w-5xl mx-auto px-6 md:px-8">
      {/* Header */}
      <div className="flex items-center justify-between pt-8 pb-8">
        <div>
          <p className="text-xs font-bold text-black/40 uppercase tracking-widest mb-1">Mi salud</p>
          <h1 className="text-3xl font-serif font-black text-black tracking-tight">
            Hola, {user.name}
          </h1>
        </div>
        <Link href="/patient/profile" className="shrink-0">
          <div className="w-11 h-11 rounded-2xl bg-[#F4C443]/20 flex items-center justify-center overflow-hidden hover:scale-105 active:scale-95 transition-transform">
            <AvatarDisplay avatar={user.avatar} name={user.name} size="sm" />
          </div>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-8">
        <Link href="/patient/appointments" className="bg-white border border-gray-100 rounded-2xl p-4 hover:border-gray-200 hover:shadow-sm transition-all">
          <p className="text-[10px] font-bold uppercase tracking-widest text-black/40 mb-1">Próximos</p>
          <p className="text-2xl font-serif font-black text-black">{upcomingCount}</p>
          <p className="text-[10px] text-black/40 font-medium">turnos</p>
        </Link>
        <Link href="/patient/medical-history" className="bg-white border border-gray-100 rounded-2xl p-4 hover:border-gray-200 hover:shadow-sm transition-all">
          <p className="text-[10px] font-bold uppercase tracking-widest text-black/40 mb-1">Historia</p>
          <p className="text-2xl font-serif font-black text-black">{recordsCount}</p>
          <p className="text-[10px] text-black/40 font-medium">consultas</p>
        </Link>
        <Link href="/patient/appointments" className="bg-white border border-gray-100 rounded-2xl p-4 hover:border-gray-200 hover:shadow-sm transition-all">
          <p className="text-[10px] font-bold uppercase tracking-widest text-black/40 mb-1">Historial</p>
          <p className="text-2xl font-serif font-black text-black">{pastCount}</p>
          <p className="text-[10px] text-black/40 font-medium">pasados</p>
        </Link>
      </div>

      {/* Próxima cita */}
      {nextApp ? (
        <div className="mb-8 bg-black rounded-3xl p-6 text-white">
          <p className="text-[10px] font-bold uppercase tracking-widest text-white/40 mb-4">Tu próxima cita</p>
          <div className="flex items-center gap-4 mb-5">
            <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center overflow-hidden shrink-0">
              <AvatarDisplay avatar={nextApp.doctor.user.avatar} name={nextApp.doctor.user.name} size="sm" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-black text-base truncate">
                Dr. {nextApp.doctor.user.name} {nextApp.doctor.user.lastName}
              </p>
              <p className="text-sm text-white/50 font-medium truncate">{nextApp.doctor.specialty}</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 pt-4 border-t border-white/10">
            <span className="inline-flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-xl text-xs font-bold">
              <Calendar className="w-3 h-3" />
              {nextApp.dateTime.toLocaleDateString("es-ES", { weekday: "long", day: "numeric", month: "long" })}
            </span>
            <span className="inline-flex items-center gap-1.5 bg-[#F4C443] text-black px-3 py-1.5 rounded-xl text-xs font-black">
              <Clock className="w-3 h-3" />
              {String(nextApp.dateTime.getHours()).padStart(2, "0")}:{String(nextApp.dateTime.getMinutes()).padStart(2, "0")} hs
            </span>
          </div>
        </div>
      ) : (
        <div className="mb-8 border-2 border-dashed border-gray-100 rounded-3xl p-8 text-center">
          <Calendar className="w-8 h-8 text-black/10 mx-auto mb-3" />
          <p className="font-bold text-black/40 text-sm mb-3">Sin turnos próximos</p>
          <Link href="/especialistas" className="inline-flex items-center gap-2 px-5 py-2.5 bg-black text-white rounded-xl font-bold text-xs hover:bg-black/80 transition-all">
            <Stethoscope className="w-3.5 h-3.5" /> Buscar especialistas
          </Link>
        </div>
      )}

      {/* Acciones rápidas */}
      <div className="grid grid-cols-2 gap-3 mb-8">
        <Link href="/especialistas" className="flex items-center gap-3 bg-white border border-gray-100 rounded-2xl p-4 hover:border-gray-200 hover:shadow-sm transition-all">
          <div className="w-9 h-9 rounded-xl bg-[#8B5A2B]/10 flex items-center justify-center shrink-0">
            <Stethoscope className="w-4 h-4 text-[#8B5A2B]" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-bold text-black">Buscar médico</p>
            <p className="text-[10px] text-black/40">Especialistas disponibles</p>
          </div>
        </Link>
        <Link href="/mensajes" className="flex items-center gap-3 bg-white border border-gray-100 rounded-2xl p-4 hover:border-gray-200 hover:shadow-sm transition-all">
          <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
            <MessageSquare className="w-4 h-4 text-blue-400" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-bold text-black">Mensajes</p>
            <p className="text-[10px] text-black/40">Contactar médicos</p>
          </div>
        </Link>
        <Link href="/patient/medical-history" className="flex items-center gap-3 bg-white border border-gray-100 rounded-2xl p-4 hover:border-gray-200 hover:shadow-sm transition-all">
          <div className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0">
            <FileText className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-bold text-black">Historia clínica</p>
            <p className="text-[10px] text-black/40">Ver consultas</p>
          </div>
        </Link>
        <Link href="/patient/documents" className="flex items-center gap-3 bg-white border border-gray-100 rounded-2xl p-4 hover:border-gray-200 hover:shadow-sm transition-all">
          <div className="w-9 h-9 rounded-xl bg-purple-50 flex items-center justify-center shrink-0">
            <Activity className="w-4 h-4 text-purple-400" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-bold text-black">Documentos</p>
            <p className="text-[10px] text-black/40">Análisis y estudios</p>
          </div>
        </Link>
      </div>

      {/* Info + Médicos */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-10">
        <div className="bg-white border border-gray-100 rounded-2xl p-5">
          <p className="text-xs font-bold uppercase tracking-widest text-black/40 mb-4">Tu información</p>
          <div className="space-y-3">
            <div>
              <p className="text-[10px] text-black/30 uppercase font-bold tracking-wider">DNI</p>
              <p className="text-sm font-bold text-black">{user.dni || "—"}</p>
            </div>
            <div>
              <p className="text-[10px] text-black/30 uppercase font-bold tracking-wider">Obra social</p>
              <p className="text-sm font-bold text-black">{user.insurance || "—"}</p>
            </div>
          </div>
          <Link href="/patient/profile" className="inline-flex items-center gap-1.5 mt-4 text-xs font-bold text-black/40 hover:text-black transition-colors">
            <User className="w-3 h-3" /> Editar perfil
          </Link>
        </div>

        <div className="bg-white border border-gray-100 rounded-2xl p-5">
          <p className="text-xs font-bold uppercase tracking-widest text-black/40 mb-4">Médicos que sigo</p>
          <PatientFollowedDoctorsInline />
          <Link href="/patient/my-doctors" className="inline-flex items-center gap-1.5 mt-4 text-xs font-bold text-black/40 hover:text-black transition-colors">
            <Heart className="w-3 h-3" /> Ver todos
          </Link>
        </div>
      </div>
    </div>
  )
}

async function PatientFollowedDoctorsInline() {
  const followed = await getFollowedDoctors()
  if (followed.length === 0) {
    return <p className="text-xs text-black/30">Aún no seguís ningún médico</p>
  }
  return (
    <div className="space-y-2">
      {followed.slice(0, 3).map((doc) => (
        <Link key={doc.id} href={`/especialistas/${doc.userId}`} className="flex items-center gap-3 py-1.5 rounded-xl hover:bg-black/3 transition-all group">
          <div className="w-8 h-8 rounded-xl bg-[#F4C443]/10 flex items-center justify-center overflow-hidden shrink-0">
            <AvatarDisplay avatar={doc.avatar} name={doc.name} size="sm" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-bold text-black text-xs truncate">{doc.name}</p>
            <p className="text-[10px] text-[#8B5A2B] font-semibold truncate">{doc.specialty}</p>
          </div>
          <ArrowRight className="w-3 h-3 text-black/20 group-hover:text-black/40 transition-colors shrink-0" />
        </Link>
      ))}
    </div>
  )
}
