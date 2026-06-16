import { auth } from "../../../lib/auth"
import { db } from "../../../lib/db"
import { redirect } from "next/navigation"
import { Building2 } from "lucide-react"
import ClinicFormClient from "./ClinicFormClient"

export default async function ClinicAdminClinicPage() {
  const session = await auth()
  if (!session?.user || session.user.role !== "CLINIC_ADMIN") {
    return redirect("/login/clinic-admin")
  }

  const clinic = await db.clinic.findUnique({
    where: { adminId: session.user.id },
  })

  if (!clinic) {
    return redirect("/clinic-admin/dashboard")
  }

  return (
    <div className="max-w-5xl mx-auto px-8 pt-8 pb-8 space-y-8 font-sans text-black">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-serif font-black tracking-tight">Mi Clínica</h1>
          <p className="text-sm font-medium text-black/60">
            Visualiza y edita la información de tu clínica.
          </p>
        </div>
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#F4C443] to-[#F9A825] flex items-center justify-center shadow-lg">
          <Building2 className="w-6 h-6 text-black" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-100 shadow-sm space-y-6">
          <h2 className="text-lg font-serif font-black">Información Actual</h2>
          <div className="space-y-4">
            <div>
              <p className="text-[10px] uppercase font-bold tracking-widest text-black/40 mb-1">Nombre</p>
              <p className="text-sm font-bold">{clinic.name}</p>
            </div>
            {clinic.description && (
              <div>
                <p className="text-[10px] uppercase font-bold tracking-widest text-black/40 mb-1">Descripción</p>
                <p className="text-sm font-medium text-black/70">{clinic.description}</p>
              </div>
            )}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-[10px] uppercase font-bold tracking-widest text-black/40 mb-1">Teléfono</p>
                <p className="text-sm font-bold">{clinic.phone || "—"}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase font-bold tracking-widest text-black/40 mb-1">Email</p>
                <p className="text-sm font-bold">{clinic.email || "—"}</p>
              </div>
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold tracking-widest text-black/40 mb-1">Dirección</p>
              <p className="text-sm font-bold">{clinic.address || "—"}</p>
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold tracking-widest text-black/40 mb-1">Sitio Web</p>
              <p className="text-sm font-bold">{clinic.website || "—"}</p>
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold tracking-widest text-black/40 mb-1">Slug</p>
              <p className="text-xs font-bold text-black/40 bg-black/5 rounded-lg px-3 py-1.5 inline-block">{clinic.slug}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-100 shadow-sm space-y-6">
          <h2 className="text-lg font-serif font-black">Editar Información</h2>
          <ClinicFormClient
            mode="edit"
            clinic={{
              id: clinic.id,
              name: clinic.name,
              description: clinic.description,
              phone: clinic.phone,
              email: clinic.email,
              address: clinic.address,
              website: clinic.website,
            }}
          />
        </div>
      </div>
    </div>
  )
}
