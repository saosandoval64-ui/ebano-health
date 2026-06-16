import { db } from "../../../lib/db"
import { getCurrentUser } from "../../../lib/auth"
import { redirect } from "next/navigation"
import ClinicDoctorsClient from "./ClinicDoctorsClient"

export default async function ClinicAdminDoctorsPage() {
  const user = await getCurrentUser()
  if (!user || user.role !== "CLINIC_ADMIN") return redirect("/login")

  const clinic = await db.clinic.findUnique({
    where: { adminId: user.id },
  })

  if (!clinic) return redirect("/clinic-admin/dashboard")

  const doctors = await db.user.findMany({
    where: {
      role: "DOCTOR",
      doctorProfile: {
        clinicId: clinic.id,
      },
    },
    include: {
      doctorProfile: true,
    },
    orderBy: {
      name: "asc",
    },
  })

  return (
    <div className="max-w-5xl mx-auto px-8 pt-8 pb-8 space-y-8 font-sans text-black">
      <div className="space-y-1">
        <h1 className="text-3xl font-serif font-black tracking-tight">Médicos de la Clínica</h1>
        <p className="text-sm font-medium text-black/60">
          Administra los profesionales médicos vinculados a {clinic.name}.
        </p>
      </div>

      <ClinicDoctorsClient initialDoctors={doctors} />
    </div>
  )
}
