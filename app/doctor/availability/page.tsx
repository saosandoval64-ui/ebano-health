import { getCurrentUser } from "../../../lib/auth"
import { redirect } from "next/navigation"
import AvailabilityForm from "./AvailabilityForm"

export default async function DoctorAvailabilityPage() {
  const user = await getCurrentUser()
  if (!user || user.role !== "DOCTOR") return redirect("/login")

  if (!user.doctorProfile) {
    return (
      <div className="p-8 bg-red-50 border border-red-200 text-red-700 rounded-3xl">
        Perfil de médico no encontrado.
      </div>
    )
  }

  const doctorData = {
    name: user.name,
    lastName: user.lastName,
    phone: user.phone,
    specialty: user.doctorProfile.specialty,
    license: user.doctorProfile.license,
    bio: user.doctorProfile.bio,
  }

  return (
    <div className="max-w-5xl mx-auto px-8 pt-8 pb-8 mb-20 md:mb-0 space-y-8 font-sans text-black">
      <div className="space-y-1">
        <h1 className="text-3xl font-serif font-black tracking-tight">Disponibilidad & Perfil</h1>
        <p className="text-sm font-medium text-black/60">
          Configura tus días de atención médica y actualiza tu perfil público.
        </p>
      </div>

      <AvailabilityForm initialData={doctorData} doctorProfileId={user.doctorProfile.id} />
    </div>
  )
}
