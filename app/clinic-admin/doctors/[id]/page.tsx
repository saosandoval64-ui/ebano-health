import { db } from "../../../../lib/db"
import { getCurrentUser } from "../../../../lib/auth"
import { redirect, notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Award, Calendar, Clock } from "lucide-react"
import AvatarDisplay from "@/components/AvatarDisplay"
import BookAppointmentClient from "./BookAppointmentClient"

export const dynamic = "force-dynamic"

const DAY_LABELS = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"]

interface DoctorProfilePageProps {
  params: Promise<{ id: string }>
}

export default async function ClinicAdminDoctorProfilePage({ params }: DoctorProfilePageProps) {
  const { id } = await params

  const user = await getCurrentUser()
  if (!user || user.role !== "CLINIC_ADMIN") return redirect("/login")

  const clinic = await db.clinic.findUnique({ where: { adminId: user.id } })
  if (!clinic) return redirect("/clinic-admin/dashboard")

  const doctor = await db.user.findUnique({
    where: { id },
    include: {
      doctorProfile: {
        include: {
          availability: {
            where: { isActive: true },
            orderBy: { dayOfWeek: "asc" },
          },
        },
      },
    },
  })

  if (!doctor || !doctor.doctorProfile || doctor.doctorProfile.clinicId !== clinic.id) {
    notFound()
  }

  const profile = doctor.doctorProfile

  const followersCount = await db.favoriteDoctor.count({
    where: { doctorId: profile.id },
  })

  const upcomingAppointments = await db.appointment.findMany({
    where: {
      doctorId: profile.id,
      status: { in: ["RESERVED", "PENDING"] },
      dateTime: { gte: new Date() },
    },
    include: {
      patient: { select: { name: true, lastName: true, email: true } },
    },
    orderBy: { dateTime: "asc" },
    take: 10,
  })

  return (
    <div className="max-w-5xl mx-auto px-8 pt-8 pb-8 space-y-8 font-sans text-black">
      <Link
        href="/clinic-admin/doctors"
        className="inline-flex items-center gap-2 text-[10px] sm:text-[11px] font-bold uppercase tracking-widest text-black/50 hover:text-black transition-colors"
      >
        <ArrowLeft className="h-3.5 w-3.5" /> Volver a Médicos
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Perfil del médico */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white border border-gray-100 p-8 sm:p-10 rounded-3xl shadow-sm">
            <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-6 mb-8">
              <AvatarDisplay
                avatar={doctor.doctorProfile?.imageUrl || doctor.avatar}
                name={`${doctor.name} ${doctor.lastName}`}
                size="lg"
              />
              <div className="space-y-2 pt-2">
                <span className="text-[10px] uppercase font-bold tracking-[0.25em] text-black/50">
                  Profesional de la Salud
                </span>
                <h1 className="text-3xl sm:text-4xl font-serif font-black text-black leading-tight">
                  Dr. {doctor.name} {doctor.lastName}
                </h1>
                <p className="text-[11px] uppercase tracking-[0.2em] text-[#F4C443] font-extrabold">
                  {profile.specialty}
                </p>
              </div>
            </div>

            <div className="space-y-4 text-black/70 leading-relaxed bg-gray-50 border border-gray-100 p-6 sm:p-8 rounded-2xl">
              <h3 className="font-bold text-black text-sm uppercase tracking-wider">Sobre el Profesional</h3>
              <p className="text-sm font-medium">
                {profile.bio || "Médico especialista comprometido con brindar una atención personalizada, humana y de máxima calidad científica para el bienestar del paciente."}
              </p>
            </div>

            <div className="mt-8 pt-6 border-t border-black/5 flex flex-wrap items-center gap-4 text-black/50 text-xs font-bold uppercase tracking-widest">
              <span className="flex items-center gap-1.5">
                <Award className="h-4 w-4 text-[#F4C443]" />
                Matrícula: {profile.license}
              </span>
              <span className="flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5" />
                {followersCount} seguidor{followersCount !== 1 ? "es" : ""}
              </span>
              {doctor.phone && (
                <span className="text-black/60 normal-case tracking-normal">Tel: {doctor.phone}</span>
              )}
            </div>
          </div>

          {/* Disponibilidad semanal */}
          <div className="bg-white border border-gray-100 p-8 rounded-3xl shadow-sm">
            <h3 className="font-serif font-black text-lg mb-4 flex items-center gap-2">
              <Clock className="h-4 w-4 text-[#F4C443]" /> Disponibilidad Semanal
            </h3>
            {profile.availability.length === 0 ? (
              <p className="text-sm text-black/40">Este médico aún no configuró sus horarios de atención.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {profile.availability.map((avail) => (
                  <div
                    key={avail.dayOfWeek}
                    className="flex items-center justify-between bg-gray-50 rounded-xl px-4 py-3 border border-gray-100"
                  >
                    <span className="text-sm font-bold text-black">{DAY_LABELS[avail.dayOfWeek]}</span>
                    <span className="text-sm font-semibold text-black/60">
                      {avail.startTime} - {avail.endTime}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Próximas citas */}
          {upcomingAppointments.length > 0 && (
            <div className="bg-white border border-gray-100 p-8 rounded-3xl shadow-sm">
              <h3 className="font-serif font-black text-lg mb-4">Próximas Citas</h3>
              <div className="space-y-2">
                {upcomingAppointments.map((app) => (
                  <div
                    key={app.id}
                    className="flex items-center justify-between bg-gray-50 rounded-xl px-4 py-3 border border-gray-100"
                  >
                    <div>
                      <span className="text-sm font-bold text-black">
                        {app.patient.name} {app.patient.lastName || ""}
                      </span>
                      <span className="text-xs text-black/40 ml-2">{app.patient.email}</span>
                    </div>
                    <span className="text-xs font-semibold text-black/60">
                      {new Date(app.dateTime).toLocaleDateString("es-AR", {
                        day: "numeric",
                        month: "short",
                      })}{" "}
                      {String(new Date(app.dateTime).getHours()).padStart(2, "0")}:
                      {String(new Date(app.dateTime).getMinutes()).padStart(2, "0")} hs
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Reservar turno */}
        <div className="md:col-span-1">
          <BookAppointmentClient doctorId={profile.id} />
        </div>
      </div>
    </div>
  )
}
