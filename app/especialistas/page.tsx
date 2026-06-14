import { db } from "../../lib/db"
import Link from "next/link"
import { User, Clock, Heart, Calendar, MapPin } from "lucide-react"
import AvatarDisplay from "@/components/AvatarDisplay"
import NavbarClient from "./NavbarClient"

export const dynamic = "force-dynamic"

const DAY_LABELS = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"]

export default async function EspecialistasPage() {
  const doctors = await db.user.findMany({
    where: { role: "DOCTOR" },
    include: {
      doctorProfile: {
        include: {
          _count: { select: { followedBy: true } },
          availability: { where: { isActive: true }, orderBy: { dayOfWeek: "asc" } },
        },
      },
    },
    orderBy: { name: "asc" },
  })

  return (
    <div className="min-h-screen text-black font-sans antialiased selection:bg-[#E2CE7D]">
      <NavbarClient />

      <main className="mx-auto max-w-7xl w-full px-4 sm:px-8 py-16 space-y-10 relative z-10">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div className="space-y-2">
            <h1 className="text-3xl sm:text-4xl font-serif font-black tracking-tight text-black">
              Nuestros Especialistas<span className="text-[#A2B676]">.</span>
            </h1>
            <p className="text-sm font-medium text-black/60 max-w-md">
              Encontrá al profesional ideal y reservá tu turno en minutos.
            </p>
          </div>
          <span className="text-[10px] uppercase font-bold tracking-widest text-black/40 shrink-0">
            {doctors.length} {doctors.length === 1 ? "especialista" : "especialistas"} disponibles
          </span>
        </div>

        {doctors.length === 0 ? (
          <div className="p-14 border-2 border-dashed border-black/10 rounded-[36px] text-center bg-white/20 space-y-3">
            <User className="h-12 w-12 text-black/20 mx-auto" />
            <p className="text-sm font-bold text-black/40">Aún no hay especialistas registrados.</p>
            <p className="text-xs text-black/30">Volvé más tarde o contactá al equipo de Ébano Health.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {doctors.map((doctor) => {
              const avail = doctor.doctorProfile?.availability || []
              const activeDays = avail.filter((a) => a.isActive)
              const hasAvailability = activeDays.length > 0
              const avgStart = activeDays[0]?.startTime || ""
              const avgEnd = activeDays[activeDays.length - 1]?.endTime || ""
              const followersCount = doctor.doctorProfile?._count?.followedBy || 0

              return (
                <div
                  key={doctor.id}
                  className="group bg-white/40 backdrop-blur-md border border-white/50 p-6 sm:p-8 rounded-[32px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-xl hover:bg-white/60 transition-all duration-300 flex flex-col"
                >
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-16 h-16 rounded-2xl bg-white/70 border border-white flex items-center justify-center overflow-hidden shadow-inner shrink-0">
                      <AvatarDisplay avatar={doctor.avatar} name={doctor.name} size="md" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h2 className="font-bold text-lg text-black leading-tight truncate">
                        Dr. {doctor.name} {doctor.lastName}
                      </h2>
                      <p className="text-[10px] uppercase tracking-widest text-[#A2B676] font-extrabold mt-0.5">
                        {doctor.doctorProfile?.specialty || "Médico"}
                      </p>
                      <div className="flex items-center gap-3 mt-2 text-[10px] text-black/40">
                        <span className="flex items-center gap-1">
                          <Heart className="h-3 w-3 text-red-300" /> {followersCount}
                        </span>
                        {hasAvailability && (
                          <span className="flex items-center gap-1 text-[#A2B676]">
                            <Calendar className="h-3 w-3" /> {activeDays.length} días
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {doctor.doctorProfile?.bio && (
                    <p className="text-xs font-medium text-black/55 leading-relaxed mb-4 line-clamp-2">
                      {doctor.doctorProfile.bio}
                    </p>
                  )}

                  {hasAvailability && (
                    <div className="flex flex-wrap gap-1.5 mb-5">
                      {activeDays.slice(0, 5).map((a, i) => (
                        <span key={i} className="text-[9px] bg-[#A2B676]/10 text-[#8F9F68] font-bold px-2 py-1 rounded-full uppercase tracking-wider">
                          {DAY_LABELS[a.dayOfWeek]} {a.startTime}-{a.endTime}
                        </span>
                      ))}
                      {activeDays.length > 5 && (
                        <span className="text-[9px] text-black/30 font-bold px-2 py-1">+{activeDays.length - 5} más</span>
                      )}
                    </div>
                  )}

                  {!hasAvailability && (
                    <div className="flex items-center gap-1.5 mb-5 text-[10px] text-black/30 italic">
                      <Clock className="h-3 w-3" /> Sin horarios disponibles aún
                    </div>
                  )}

                  <div className="mt-auto pt-4 border-t border-black/5">
                    <Link
                      href={`/especialistas/${doctor.id}`}
                      className="block w-full py-3 bg-black text-[#FDF6CD] text-center rounded-[18px] text-[11px] font-bold uppercase tracking-wider hover:bg-[#A2B676] hover:text-black transition-all"
                    >
                      Ver perfil y reservar
                    </Link>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </main>

      <footer className="w-full border-t border-black/5 py-6 mt-16 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold tracking-wider text-black font-serif">ÉBANO</span>
            <p className="text-[10px] text-black/40">© {new Date().getFullYear()} Ébano Health.</p>
          </div>
          <Link href="/login" className="text-xs font-bold uppercase tracking-widest text-black/50 hover:text-black transition-colors">
            Iniciar Sesión →
          </Link>
        </div>
      </footer>
    </div>
  )
}
