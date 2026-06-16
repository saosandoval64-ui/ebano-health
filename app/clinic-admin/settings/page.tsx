import { getCurrentUser } from "../../../lib/auth"
import { redirect } from "next/navigation"
import { Settings } from "lucide-react"

export default async function ClinicAdminSettingsPage() {
  const user = await getCurrentUser()
  if (!user || user.role !== "CLINIC_ADMIN") return redirect("/login")

  return (
    <div className="max-w-5xl mx-auto px-8 pt-8 pb-8 space-y-8 font-sans text-black">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-serif font-black tracking-tight">Configuración</h1>
          <p className="text-sm font-medium text-black/60">
            Gestiona la configuración de tu cuenta y clínica.
          </p>
        </div>
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#F4C443] to-[#F9A825] flex items-center justify-center shadow-lg">
          <Settings className="w-6 h-6 text-black" />
        </div>
      </div>

      <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
        <h2 className="text-lg font-serif font-black mb-4">Próximamente</h2>
        <p className="text-sm text-black/50">
          Esta sección está en desarrollo. Pronto podrás configurar notificaciones, permisos de acceso, integraciones y más.
        </p>
      </div>
    </div>
  )
}
