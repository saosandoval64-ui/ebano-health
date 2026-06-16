import { auth } from "../../../lib/auth"
import { db } from "../../../lib/db"
import { redirect } from "next/navigation"
import Link from "next/link"
import { CalendarCheck, ArrowRight, Clock, CheckCircle2 } from "lucide-react"
import AvatarDisplay from "@/components/AvatarDisplay"

export default async function PatientFollowUpsPage() {
  const session = await auth()
  if (!session?.user || session.user.role !== "PATIENT") return redirect("/login")

  const now = new Date()

  const records = await db.medicalRecord.findMany({
    where: {
      patientId: session.user.id,
      followUpDate: { not: null },
    },
    include: {
      doctor: {
        include: { user: { select: { name: true, lastName: true, avatar: true } } },
      },
    },
    orderBy: { followUpDate: "asc" },
  })

  const upcoming = records.filter((r) => new Date(r.followUpDate!) >= now)
  const past = records.filter((r) => new Date(r.followUpDate!) < now)

  return (
    <div className="max-w-5xl mx-auto px-8 pt-8 pb-8 space-y-8 font-sans text-black">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-serif font-black tracking-tight">Controles</h1>
          <p className="text-sm font-medium text-black/60 mt-1">
            {records.length} control{records.length !== 1 ? "es" : ""} programado{records.length !== 1 ? "s" : ""}
          </p>
        </div>
        <Link href="/patient/dashboard" className="text-xs font-bold text-black/40 hover:text-black transition-colors inline-flex items-center gap-1">
          Volver al dashboard <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      {records.length === 0 ? (
        <div className="p-14 border-2 border-dashed border-gray-200 rounded-2xl text-center bg-gray-50 space-y-4">
          <CalendarCheck className="h-12 w-12 text-black/20 mx-auto" />
          <p className="text-sm font-bold text-black/40">Aún no tenés controles programados</p>
          <p className="text-xs text-black/30 max-w-sm mx-auto">
            Cuando tu médico programe un control, aparecerá aquí.
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Upcoming */}
          {upcoming.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-xs font-bold uppercase tracking-widest text-[#F4C443] flex items-center gap-2">
                <Clock className="h-3.5 w-3.5" />
                Próximos controles
              </h2>
              {upcoming.map((record) => {
                const followUpDate = new Date(record.followUpDate!)
                return (
                  <div
                    key={record.id}
                    className="bg-white border-2 border-[#F4C443]/30 p-6 rounded-2xl shadow-sm hover:shadow-md transition-all"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-[#F4C443]/10 flex items-center justify-center overflow-hidden shrink-0">
                        <AvatarDisplay
                          avatar={record.doctor.user.avatar}
                          name={`${record.doctor.user.name} ${record.doctor.user.lastName || ""}`}
                          size="sm"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-bold text-base text-black">
                            Dr. {record.doctor.user.name} {record.doctor.user.lastName}
                          </h3>
                          <span className="text-[10px] text-[#F4C443] font-bold uppercase tracking-wider">
                            {followUpDate.toLocaleDateString("es-ES", { day: "numeric", month: "long", year: "numeric" })}
                          </span>
                        </div>
                        <p className="text-[10px] text-[#F4C443] font-bold uppercase tracking-wider mb-3">
                          {record.doctor.specialty}
                        </p>
                        {record.followUpNotes && (
                          <div className="mt-2 p-3 bg-[#F4C443]/5 rounded-xl">
                            <p className="text-[9px] uppercase font-bold tracking-widest text-black/40 mb-1">Notas del control</p>
                            <p className="text-xs text-black/70">{record.followUpNotes}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}

          {/* Past */}
          {past.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-xs font-bold uppercase tracking-widest text-black/40 flex items-center gap-2">
                <CheckCircle2 className="h-3.5 w-3.5" />
                Controles realizados
              </h2>
              {past.map((record) => {
                const followUpDate = new Date(record.followUpDate!)
                return (
                  <div
                    key={record.id}
                    className="bg-white border border-gray-100 p-6 rounded-2xl shadow-sm hover:shadow-md transition-all opacity-60"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-gray-100 flex items-center justify-center overflow-hidden shrink-0">
                        <AvatarDisplay
                          avatar={record.doctor.user.avatar}
                          name={`${record.doctor.user.name} ${record.doctor.user.lastName || ""}`}
                          size="sm"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-bold text-base text-black">
                            Dr. {record.doctor.user.name} {record.doctor.user.lastName}
                          </h3>
                          <span className="text-[10px] text-black/40 font-bold uppercase tracking-wider">
                            {followUpDate.toLocaleDateString("es-ES", { day: "numeric", month: "long", year: "numeric" })}
                          </span>
                        </div>
                        <p className="text-[10px] text-black/40 font-bold uppercase tracking-wider mb-3">
                          {record.doctor.specialty}
                        </p>
                        {record.followUpNotes && (
                          <div className="mt-2 p-3 bg-gray-50 rounded-xl">
                            <p className="text-[9px] uppercase font-bold tracking-widest text-black/40 mb-1">Notas del control</p>
                            <p className="text-xs text-black/70">{record.followUpNotes}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
