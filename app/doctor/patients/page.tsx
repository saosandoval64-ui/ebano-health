import { db } from "../../../lib/db"
import { getCurrentUser } from "../../../lib/auth"
import { redirect } from "next/navigation"
import { Calendar, Users, Award, ShieldCheck, Mail, Phone, Heart } from "lucide-react"
import { Prisma } from "@prisma/client"

type PatientInfo = Prisma.UserGetPayload<{}> & { lastAppointment: Date }

export default async function DoctorPatientsPage() {
  const user = await getCurrentUser()
  if (!user || user.role !== "DOCTOR") return redirect("/login")

  const doctorProfile = await db.doctorProfile.findUnique({
    where: { userId: user.id },
  })

  if (!doctorProfile) {
    return (
      <div className="p-8 bg-red-50 border border-red-200 text-red-700 rounded-3xl">
        Perfil de médico no encontrado.
      </div>
    )
  }

  // Obtener citas únicas y sus pacientes
  const appointments = await db.appointment.findMany({
    where: {
      doctorId: doctorProfile.id,
    },
    include: {
      patient: true,
    },
    orderBy: {
      dateTime: "desc",
    },
  })

  // Agrupar por paciente único
  const patientMap = new Map<string, PatientInfo>()
  appointments.forEach((app) => {
    if (!patientMap.has(app.patientId)) {
      patientMap.set(app.patientId, {
        ...app.patient,
        lastAppointment: app.dateTime,
      })
    }
  })

  const patients = Array.from(patientMap.values())

  return (
    <div className="max-w-5xl mx-auto px-8 pt-8 pb-8 mb-20 md:mb-0 space-y-8 font-sans text-black">
      {/* Encabezado */}
      <div className="space-y-1">
        <h1 className="text-3xl font-serif font-black tracking-tight">Registro de Pacientes</h1>
        <p className="text-sm font-medium text-black/60">
          Listado de pacientes que han reservado consultas contigo.
        </p>
      </div>

      {patients.length === 0 ? (
        <div className="p-12 border border-dashed border-gray-200 rounded-2xl text-center bg-gray-50">
          <Users className="h-10 w-10 text-black/30 mx-auto mb-4" />
          <p className="text-sm font-medium text-black/40">Aún no tienes pacientes registrados en tu agenda.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {patients.map((patient) => (
            <div 
              key={patient.id} 
              className="bg-white border border-gray-100 p-6 rounded-2xl shadow-sm flex flex-col justify-between hover:shadow-md transition-all"
            >
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-2xl bg-black text-[#FDF6CD] flex items-center justify-center font-bold text-sm shrink-0">
                    {patient.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-black leading-tight">
                      {patient.name} {patient.lastName}
                    </h3>
                    <span className="text-[9px] uppercase font-bold tracking-widest text-[#E5B534]">
                      Paciente Activo
                    </span>
                  </div>
                </div>

                <div className="space-y-2 border-t border-black/5 pt-4 text-xs font-semibold text-black/75">
                  <div className="flex items-center gap-2">
                    <Award className="h-3.5 w-3.5 opacity-60 text-black" />
                    <span>DNI: {patient.dni || "No registrado"}</span>
                  </div>
                  {patient.birthDate && (
                    <div className="flex items-center gap-2">
                      <Calendar className="h-3.5 w-3.5 opacity-60 text-black" />
                      <span>
                        Nacimiento: {new Date(patient.birthDate).toLocaleDateString("es-ES", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <Heart className="h-3.5 w-3.5 opacity-60 text-[#E5B534]" />
                    <span>Prepaga: {patient.insurance || "Ninguna"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="h-3.5 w-3.5 opacity-60 text-black" />
                    <span className="truncate">{patient.email}</span>
                  </div>
                  {patient.phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="h-3.5 w-3.5 opacity-60 text-black" />
                      <span>Tel: {patient.phone}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-6 border-t border-black/5 mt-6 flex items-center justify-between text-[9px] font-bold text-black/40 uppercase tracking-widest">
                <span>Última visita</span>
                <span>
                  {new Date(patient.lastAppointment).toLocaleDateString("es-ES", {
                    day: "numeric",
                    month: "short",
                  })}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
