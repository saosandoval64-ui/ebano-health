import { auth } from "../../../lib/auth"
import { db } from "../../../lib/db"
import { redirect } from "next/navigation"
import { Heart, Calendar } from "lucide-react"
import AvatarDisplay from "@/components/AvatarDisplay"

export default async function DoctorFollowersPage() {
  const session = await auth()
  if (!session?.user || session.user.role !== "DOCTOR") {
    return redirect("/login?role=doctor")
  }

  const profile = await db.doctorProfile.findUnique({
    where: { userId: session.user.id },
  })
  if (!profile) return redirect("/doctor/dashboard")

  const followers = await db.favoriteDoctor.findMany({
    where: { doctorId: profile.id },
    include: {
      patient: { select: { name: true, lastName: true, avatar: true, email: true, createdAt: true } },
    },
    orderBy: { createdAt: "desc" },
  })

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-7xl mx-auto space-y-8 animate-slideInUp">
      <div>
        <h1 className="text-3xl md:text-4xl font-serif font-black text-black tracking-tight flex items-center gap-3">
          <Heart className="h-7 w-7 text-rose-400" /> Mis Seguidores
        </h1>
        <p className="text-sm font-medium text-black/50 mt-1">
          {followers.length} paciente{followers.length !== 1 ? "s" : ""} te siguen
        </p>
      </div>

      {followers.length === 0 ? (
        <div className="p-14 border-2 border-dashed border-black/10 rounded-[36px] text-center bg-white/20 space-y-3">
          <Heart className="h-12 w-12 text-black/20 mx-auto" />
          <p className="text-sm font-bold text-black/40">Aún no tenés seguidores</p>
          <p className="text-xs text-black/30">
            Cuando los pacientes te sigan, aparecerán aquí.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {followers.map((f) => (
            <div
              key={f.id}
              className="bg-white border border-gray-100 p-5 rounded-3xl shadow-sm hover:shadow-md transition-all flex items-center gap-4"
            >
              <div className="w-12 h-12 rounded-2xl bg-[#F4C443]/10 flex items-center justify-center overflow-hidden shrink-0">
                <AvatarDisplay avatar={f.patient.avatar} name={`${f.patient.name} ${f.patient.lastName || ""}`} size="sm" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-black truncate">{f.patient.name} {f.patient.lastName}</p>
                <p className="text-xs text-black/40 truncate">{f.patient.email}</p>
                <p className="text-[10px] text-black/30 mt-1 flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  Te sigue desde {f.createdAt.toLocaleDateString("es-ES", { day: "numeric", month: "long", year: "numeric" })}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
