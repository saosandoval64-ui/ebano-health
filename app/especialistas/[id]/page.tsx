import { db } from "../../../lib/db"
import { getSessionPayload } from "../../../lib/auth"
import { notFound } from "next/navigation"
import { ArrowLeft, Award, User } from "lucide-react"
import Link from "next/link"
import BookingSection from "./BookingSection"
import { normalizeAvatar } from "../utils"

interface SpecialistPageProps {
  params: Promise<{ id: string }>
}

export default async function DoctorPage({ params }: SpecialistPageProps) {
  // En Next.js 15+, los parámetros de ruta dinámicos se manejan como una promesa
  const { id } = await params

  const doctor = await db.user.findUnique({
    where: { id },
    include: { doctorProfile: true }
  })

  if (!doctor || !doctor.doctorProfile) {
    notFound()
  }

  // Verificar si el usuario está autenticado y su rol
  const session = await getSessionPayload()
  const isLoggedIn = !!session

  return (
    <div className="min-h-screen bg-[#FDF6CD] p-6 sm:p-8 md:p-16 font-sans text-black selection:bg-[#E2CE7D]">
      <div className="max-w-5xl mx-auto">
        <Link 
          href="/especialistas" 
          className="inline-flex items-center gap-2 text-[10px] sm:text-[11px] font-bold uppercase tracking-widest text-black/50 hover:text-black mb-8 transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Volver a Especialistas
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Columna Izquierda: Perfil (Ocupa 2 de 3 partes) */}
          <div className="md:col-span-2 space-y-6">
            <div className="bg-white/40 backdrop-blur-md border border-white/50 p-8 sm:p-10 rounded-[40px] shadow-[0_20px_50px_rgba(0,0,0,0.03)]">
              
              <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-6 mb-8">
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-[32px] bg-white/70 border border-white flex items-center justify-center overflow-hidden shadow-inner shrink-0">
                  {doctor.avatar ? (
                    <img 
                      src={normalizeAvatar(doctor.avatar)} 
                      alt={doctor.name} 
                      className="w-full h-full object-cover" 
                    />
                  ) : (
                    <User className="text-black/20 w-12 h-12" />
                  )}
                </div>
                <div className="space-y-2 pt-2">
                  <span className="text-[10px] uppercase font-bold tracking-[0.25em] text-black/50">
                    Profesional de la Salud
                  </span>
                  <h1 className="text-3xl sm:text-4xl font-serif font-black text-black leading-tight">
                    Dr. {doctor.name} {doctor.lastName}
                  </h1>
                  <p className="text-[11px] uppercase tracking-[0.2em] text-[#A2B676] font-extrabold">
                    {doctor.doctorProfile.specialty}
                  </p>
                </div>
              </div>
              
              <div className="space-y-4 text-black/70 leading-relaxed bg-white/30 border border-white/20 p-6 sm:p-8 rounded-[28px]">
                <h3 className="font-bold text-black text-sm uppercase tracking-wider">Sobre el Profesional</h3>
                <p className="text-sm font-medium">
                  {doctor.doctorProfile.bio || "Médico especialista comprometido con brindar una atención personalizada, humana y de máxima calidad científica para el bienestar del paciente."}
                </p>
              </div>

              <div className="mt-8 pt-6 border-t border-black/5 flex items-center gap-3 text-black/50 text-xs font-bold uppercase tracking-widest">
                <Award className="h-4 w-4 text-[#A2B676]" /> 
                <span>Matrícula Profesional: {doctor.doctorProfile.license}</span>
              </div>
            </div>
          </div>

          {/* Columna Derecha: Reserva Interactiva */}
          <div className="md:col-span-1">
            <BookingSection doctorId={doctor.doctorProfile.id} isLoggedIn={isLoggedIn} userRole={session?.role} />
          </div>
        </div>
      </div>
    </div>
  )
}