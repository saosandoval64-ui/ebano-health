import { auth } from "../../../lib/auth"
import { db } from "../../../lib/db"
import { redirect } from "next/navigation"
import Link from "next/link"
import { FileText, FlaskConical, Image, Pill, ArrowRight } from "lucide-react"

const fileTypeConfig: Record<string, { label: string; icon: typeof FileText; color: string }> = {
  lab_result: { label: "Análisis clínico", icon: FlaskConical, color: "text-purple-500" },
  imaging: { label: "Imagenología", icon: Image, color: "text-blue-500" },
  prescription: { label: "Receta", icon: Pill, color: "text-green-500" },
  other: { label: "Documento", icon: FileText, color: "text-black/40" },
}

export default async function PatientDocumentsPage() {
  const session = await auth()
  if (!session?.user || session.user.role !== "PATIENT") return redirect("/login")

  const documents = await db.medicalDocument.findMany({
    where: { patientId: session.user.id },
    include: {
      doctor: {
        include: { user: { select: { name: true, lastName: true } } },
      },
    },
    orderBy: { uploadedAt: "desc" },
  })

  return (
    <div className="max-w-5xl mx-auto px-8 pt-8 pb-8 space-y-8 font-sans text-black">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-serif font-black tracking-tight">Documentos Médicos</h1>
          <p className="text-sm font-medium text-black/60 mt-1">
            {documents.length} documento{documents.length !== 1 ? "s" : ""}
          </p>
        </div>
        <Link href="/patient/dashboard" className="text-xs font-bold text-black/40 hover:text-black transition-colors inline-flex items-center gap-1">
          Volver al dashboard <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      {documents.length === 0 ? (
        <div className="p-14 border-2 border-dashed border-gray-200 rounded-2xl text-center bg-gray-50 space-y-4">
          <FileText className="h-12 w-12 text-black/20 mx-auto" />
          <p className="text-sm font-bold text-black/40">Aún no tenés documentos médicos</p>
          <p className="text-xs text-black/30 max-w-sm mx-auto">
            Cuando tu médico suba documentos, aparecerán aquí.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {documents.map((doc) => {
            const config = fileTypeConfig[doc.fileType] || fileTypeConfig.other
            const Icon = config.icon
            const uploadedDate = new Date(doc.uploadedAt)
            return (
              <div
                key={doc.id}
                className="bg-white border border-gray-100 p-6 rounded-2xl shadow-sm hover:shadow-md transition-all"
              >
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center shrink-0`}>
                    <Icon className={`w-5 h-5 ${config.color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-bold text-base text-black">{doc.title}</h3>
                      <span className="text-[10px] text-black/40 font-bold uppercase tracking-wider">
                        {uploadedDate.toLocaleDateString("es-ES", { day: "numeric", month: "long", year: "numeric" })}
                      </span>
                    </div>
                    <p className="text-[10px] text-[#F4C443] font-bold uppercase tracking-wider mb-2">
                      {config.label}
                    </p>
                    {doc.description && (
                      <p className="text-xs text-black/60 mb-2">{doc.description}</p>
                    )}
                    {doc.doctor && (
                      <p className="text-[10px] text-black/40 font-bold">
                        Dr. {doc.doctor.user.name} {doc.doctor.user.lastName}
                      </p>
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
