import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { redirect } from "next/navigation"
import DoctorDocumentsClient from "./DoctorDocumentsClient"

export default async function DoctorDocumentsPage() {
  const session = await auth()
  if (!session?.user || session.user.role !== "DOCTOR") return redirect("/login")

  const doctorProfile = await db.doctorProfile.findUnique({
    where: { userId: session.user.id },
    select: { id: true },
  })

  if (!doctorProfile) return redirect("/doctor/dashboard")

  // Pacientes del médico (con cita previa)
  const appointments = await db.appointment.findMany({
    where: { doctorId: doctorProfile.id },
    include: {
      patient: {
        select: { id: true, name: true, lastName: true },
      },
    },
    orderBy: { dateTime: "desc" },
  })

  const patientMap = new Map<string, { id: string; name: string; lastName: string | null }>()
  appointments.forEach((a) => {
    if (!patientMap.has(a.patientId)) {
      patientMap.set(a.patientId, a.patient)
    }
  })
  const patients = Array.from(patientMap.values())

  // Documentos que ya subió este médico
  const documents = await db.medicalDocument.findMany({
    where: { doctorId: doctorProfile.id },
    include: {
      patient: { select: { name: true, lastName: true } },
    },
    orderBy: { uploadedAt: "desc" },
  })

  return <DoctorDocumentsClient patients={patients} documents={documents} />
}
