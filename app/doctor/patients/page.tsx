import { db } from "../../../lib/db"
import { getCurrentUser } from "../../../lib/auth"
import { redirect } from "next/navigation"
import { Calendar, Users, Award, ShieldCheck, Mail, Phone, Heart } from "lucide-react"

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
  const patientMap = new Map<string, any>()
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
    <div className="space-y-8 font-sans text-black">
      {/* Encabezado */}
      <div className="space-y-1">
        <h1 className="text-3xl font-serif font-black tracking-tight">Registro de Pacientes</h1>
        <p className="text-sm font-medium text-black/60">
          Listado de pacientes que han reservado consultas contigo.
        </p>
      </div>

      {patients.length === 0 ? (
        <div className="p-12 border border-dashed border-black/10 rounded-[32px] text-center bg-white/20">
          <Users className="h-10 w-10 text-black/30 mx-auto mb-4" />
          <p className="text-sm font-medium text-black/40">Aún no tienes pacientes registrados en tu agenda.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {patients.map((patient) => (
            <div 
              key={patient.id} 
              className="bg-white/40 border border-white/50 p-6 rounded-[30px] shadow-sm flex flex-col justify-between hover:bg-white/60 transition-all"
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
                    <span className="text-[9px] uppercase font-bold tracking-widest text-[#8F9F68]">
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
                    <Heart className="h-3.5 w-3.5 opacity-60 text-[#8F9F68]" />
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
