import { auth } from "../../../lib/auth"
import { db } from "../../../lib/db"
import { redirect } from "next/navigation"
import { normalizeAvatar } from "../../../lib/avatar"
import DoctorSettingsClient from "./DoctorSettingsClient"

export default async function DoctorSettingsPage() {
  const session = await auth()
  if (!session?.user || session.user.role !== "DOCTOR") return redirect("/login/doctor")

  const user = await db.user.findUnique({
    where: { id: session.user.id },
    select: { avatar: true },
  })

  const avatar = normalizeAvatar(user?.avatar)

  return (
    <div className="max-w-5xl mx-auto px-8 pt-8 pb-8 space-y-8 font-sans text-black">
      <div>
        <h1 className="text-3xl font-serif font-black tracking-tight">Configuración</h1>
        <p className="text-sm font-medium text-black/60">
          Gestiona tu avatar, contraseña y preferencias.
        </p>
      </div>

      <DoctorSettingsClient initialAvatar={avatar} />
    </div>
  )
}
