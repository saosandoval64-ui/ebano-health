import { auth } from "../../../lib/auth"
import { getFollowedDoctors } from "../../actions/appointments"
import Link from "next/link"
import { Heart, Calendar, MapPin, ArrowRight, User } from "lucide-react"
import AvatarDisplay from "@/components/AvatarDisplay"

const DAY_LABELS = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"]

export default async function MyDoctorsPage() {
  const session = await auth()
  if (!session?.user) return null

  const followed = await getFollowedDoctors()

  return (
    <div className="max-w-5xl mx-auto px-8 pt-8 pb-8 space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-serif font-black text-black tracking-tight flex items-center gap-3">
            <Heart className="h-7 w-7 text-red-400" /> Mis Médicos
          </h1>
          <p className="text-sm font-medium text-black/50 mt-1">
            {followed.length} médico{followed.length !== 1 ? "s" : ""} que sigo
          </p>
        </div>
        <Link
          href="/especialistas"
          className="inline-flex items-center gap-2 px-5 py-3 bg-black text-[#FDF6CD] rounded-2xl font-bold text-sm shadow-lg shadow-black/10 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
        >
          Explorar especialistas <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {followed.length === 0 ? (
        <div className="p-14 border-2 border-dashed border-gray-200 rounded-2xl text-center bg-gray-50 space-y-4">
          <Heart className="h-12 w-12 text-black/20 mx-auto" />
          <p className="text-sm font-bold text-black/40">No seguís a ningún médico todavía</p>
          <p className="text-xs text-black/30 max-w-sm mx-auto">
            Explorá especialistas y seguilos para ver su disponibilidad y agendar turnos rápidamente.
          </p>
          <Link
            href="/especialistas"
            className="inline-flex items-center gap-2 mt-4 px-6 py-3 bg-black text-[#FDF6CD] rounded-full text-xs font-bold uppercase tracking-widest hover:bg-black/80 transition-all"
          >
            Ver Especialistas <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {followed.map((doc) => (
            <div
              key={doc.id}
              className="group bg-white border border-gray-100 p-6 rounded-2xl shadow-sm hover:shadow-md hover:border-[#F4C443]/30 transition-all duration-300 flex flex-col overflow-hidden"
            >
              <div className="flex items-center gap-4 mb-5">
                <div className="w-14 h-14 rounded-2xl bg-[#F4C443]/10 flex items-center justify-center overflow-hidden">
                  <AvatarDisplay avatar={doc.avatar} name={doc.name} size="md" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-black text-base truncate">{doc.name}</h3>
                  <p className="text-xs text-[#F4C443] font-bold uppercase tracking-wider">{doc.specialty}</p>
                </div>
                <span className="flex items-center gap-1 text-[10px] text-red-400 font-bold">
                  <Heart className="h-3 w-3 fill-red-400 text-red-400" /> Siguiendo
                </span>
              </div>

              <div className="flex-1 space-y-1.5 mb-5">
                {doc.availability.length > 0 ? (
                  doc.availability.map((a, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs text-black/60">
                      <MapPin className="h-3 w-3 text-[#F4C443] shrink-0" />
                      <span className="font-bold text-black/70">{DAY_LABELS[a.dayOfWeek]}:</span>
                      <span>{a.startTime} - {a.endTime}</span>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-black/30 italic">Sin horarios configurados</p>
                )}
              </div>

              <Link
                href={`/especialistas/${doc.userId}`}
                className="w-full py-3 bg-black text-[#FDF6CD] text-center rounded-[18px] text-[11px] font-bold uppercase tracking-wider hover:bg-[#F4C443] hover:text-black transition-all"
              >
                Ver perfil y agendar
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
