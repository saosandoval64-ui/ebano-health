import { getCurrentUser } from "../../../lib/auth"
import ProfileForm from "./ProfileForm"

export default async function PatientProfilePage() {
  const user = await getCurrentUser()
  if (!user) return null

  const profileData = {
    name: user.name,
    lastName: user.lastName,
    email: user.email,
    dni: user.dni,
    phone: user.phone,
    insurance: user.insurance,
    birthDate: user.birthDate,
  }

  return (
    <div className="max-w-5xl mx-auto px-8 pt-8 pb-8 mb-20 md:mb-0 space-y-8 font-sans text-black">
      {/* Encabezado */}
      <div className="space-y-1">
        <h1 className="text-3xl font-serif font-black tracking-tight">Mi Perfil</h1>
        <p className="text-sm font-medium text-black/60">
          Actualiza tus datos de contacto y detalles de obra social.
        </p>
      </div>

      {/* Formulario de Perfil */}
      <ProfileForm initialData={profileData} />
    </div>
  )
}
