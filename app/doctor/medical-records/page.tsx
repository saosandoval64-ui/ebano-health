import { auth } from "../../../lib/auth"
import { db } from "../../../lib/db"
import { redirect } from "next/navigation"
import MedicalRecordsClient from "./MedicalRecordsClient"

export default async function DoctorMedicalRecordsPage() {
  const session = await auth()
  if (!session?.user || session.user.role !== "DOCTOR") return redirect("/login")

  const doctorProfile = await db.doctorProfile.findUnique({
    where: { userId: session.user.id },
  })
  if (!doctorProfile) return redirect("/doctor/dashboard")

  const records = await db.medicalRecord.findMany({
    where: { doctorId: doctorProfile.id },
    include: {
      patient: { select: { name: true, lastName: true, dni: true, avatar: true } },
    },
    orderBy: { consultationDate: "desc" },
  })

  // Get patients who have appointments with this doctor
  const appointments = await db.appointment.findMany({
    where: { doctorId: doctorProfile.id },
    select: { patientId: true },
    distinct: ["patientId"],
  })

  const patientIds = appointments.map((a) => a.patientId)
  const patients = await db.user.findMany({
    where: { id: { in: patientIds } },
    select: { id: true, name: true, lastName: true, dni: true, avatar: true },
  })

  // Serialize dates for client component
  const serializedRecords = records.map((r) => ({
    ...r,
    consultationDate: r.consultationDate.toISOString(),
    followUpDate: r.followUpDate?.toISOString() || null,
  }))

  return <MedicalRecordsClient initialRecords={serializedRecords as any} patients={patients} />
}
