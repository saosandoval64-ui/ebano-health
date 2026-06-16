import { db } from "../../../lib/db"
import { getCurrentUser } from "../../../lib/auth"
import { redirect } from "next/navigation"
import { Prisma } from "@prisma/client"
import PatientListClient from "./PatientListClient"

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

  return <PatientListClient patients={patients} />
}
