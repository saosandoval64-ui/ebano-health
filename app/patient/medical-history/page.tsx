import { auth } from "../../../lib/auth"
import { db } from "../../../lib/db"
import { redirect } from "next/navigation"
import Link from "next/link"
import { FileText, Calendar, Stethoscope, ArrowRight, Pill, Activity } from "lucide-react"
import AvatarDisplay from "@/components/AvatarDisplay"

export default async function PatientMedicalHistoryPage() {
  const session = await auth()
  if (!session?.user || session.user.role !== "PATIENT") return redirect("/login")

  const records = await db.medicalRecord.findMany({
    where: { patientId: session.user.id },
    include: {
      doctor: {
        include: { user: { select: { name: true, lastName: true, avatar: true } } },
      },
      appointment: true,
    },
    orderBy: { consultationDate: "desc" },
  })

  return (
    <div className="max-w-5xl mx-auto px-8 pt-8 pb-8 space-y-8 font-sans text-black">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-serif font-black tracking-tight">Historia Clínica</h1>
          <p className="text-sm font-medium text-black/60 mt-1">
            {records.length} registro{records.length !== 1 ? "s" : ""} médico{records.length !== 1 ? "s" : ""}
          </p>
        </div>
        <Link href="/patient/dashboard" className="text-xs font-bold text-black/40 hover:text-black transition-colors inline-flex items-center gap-1">
          Volver al dashboard <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      {/* Records */}
      {records.length === 0 ? (
        <div className="p-14 border-2 border-dashed border-gray-200 rounded-2xl text-center bg-gray-50 space-y-4">
          <FileText className="h-12 w-12 text-black/20 mx-auto" />
          <p className="text-sm font-bold text-black/40">Aún no tenés registros médicos</p>
          <p className="text-xs text-black/30 max-w-sm mx-auto">
            Cuando consultes a un médico, tus registros aparecerán aquí.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {records.map((record) => {
            const consultationDate = new Date(record.consultationDate)
            return (
              <div
                key={record.id}
                className="bg-white border border-gray-100 p-6 rounded-2xl shadow-sm hover:shadow-md transition-all"
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
                      <span className="text-[10px] text-black/40 font-bold uppercase tracking-wider">
                        {consultationDate.toLocaleDateString("es-ES", { day: "numeric", month: "long", year: "numeric" })}
                      </span>
                    </div>
                    <p className="text-[10px] text-[#F4C443] font-bold uppercase tracking-wider mb-3">
                      {record.doctor.specialty}
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="flex items-start gap-2">
                        <Stethoscope className="w-3.5 h-3.5 text-[#8B5A2B] mt-0.5 shrink-0" />
                        <div>
                          <p className="text-[9px] uppercase font-bold tracking-widest text-black/40">Motivo</p>
                          <p className="text-xs font-semibold text-black">{record.reason}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <Activity className="w-3.5 h-3.5 text-[#F4C443] mt-0.5 shrink-0" />
                        <div>
                          <p className="text-[9px] uppercase font-bold tracking-widest text-black/40">Diagnóstico</p>
                          <p className="text-xs font-semibold text-black">{record.diagnosis}</p>
                        </div>
                      </div>
                      {record.treatment && (
                        <div className="flex items-start gap-2">
                          <Pill className="w-3.5 h-3.5 text-green-500 mt-0.5 shrink-0" />
                          <div>
                            <p className="text-[9px] uppercase font-bold tracking-widest text-black/40">Tratamiento</p>
                            <p className="text-xs font-semibold text-black">{record.treatment}</p>
                          </div>
                        </div>
                      )}
                      {record.prescriptions && (
                        <div className="flex items-start gap-2">
                          <FileText className="w-3.5 h-3.5 text-blue-500 mt-0.5 shrink-0" />
                          <div>
                            <p className="text-[9px] uppercase font-bold tracking-widest text-black/40">Receta</p>
                            <p className="text-xs font-semibold text-black">{record.prescriptions}</p>
                          </div>
                        </div>
                      )}
                    </div>

                    {record.notes && (
                      <div className="mt-3 p-3 bg-gray-50 rounded-xl">
                        <p className="text-[9px] uppercase font-bold tracking-widest text-black/40 mb-1">Notas del médico</p>
                        <p className="text-xs text-black/70">{record.notes}</p>
                      </div>
                    )}

                    {record.followUpDate && (
                      <div className="mt-3 inline-flex items-center gap-1.5 bg-[#F4C443]/10 px-3 py-1.5 rounded-xl">
                        <Calendar className="w-3 h-3 text-[#F4C443]" />
                        <span className="text-[10px] font-bold text-black/60">
                          Próximo control: {new Date(record.followUpDate).toLocaleDateString("es-ES", { day: "numeric", month: "long" })}
                        </span>
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
  )
}
