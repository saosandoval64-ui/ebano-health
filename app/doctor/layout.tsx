import { auth } from "../../lib/auth"
import { redirect } from "next/navigation"
import Sidebar from "../../components/layouts/sidebar/Sidebar"
import { db } from "../../lib/db"

// Normalizar avatar: si es un número o nombre de archivo, convertirlo a ruta completa
function normalizeAvatar(avatar?: string | null): string {
  if (!avatar) return "/avatars/avatar-1.svg"
  if (avatar.startsWith("data:")) return avatar
  if (avatar.startsWith("/avatars/")) return avatar
  if (avatar.includes(".svg")) return `/avatars/${avatar}`
  if (/^\d+$/.test(avatar)) return `/avatars/avatar-${avatar}.svg`
  return "/avatars/avatar-1.svg"
}

export default async function DoctorLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()
  if (!session?.user || session.user.role !== "DOCTOR") {
    return redirect("/login?role=doctor")
  }

  const user = await db.user.findUnique({
    where: { id: session.user.id },
    select: { name: true, lastName: true, email: true, avatar: true },
  })

  if (!user) return redirect("/login")

  const avatar = normalizeAvatar(user.avatar)

  return (
    <div className="min-h-screen bg-[#FDF6CD] text-black font-sans flex flex-col md:flex-row selection:bg-[#E2CE7D]">
      <Sidebar 
        userName={`Dr. ${user.name} ${user.lastName || ""}`} 
        userEmail={user.email} 
        role="DOCTOR"
        userAvatar={avatar}
      />
      <main className="flex-1 p-4 sm:p-6 md:p-12 overflow-y-auto min-h-screen md:h-screen pt-16 md:pt-12">
        {children}
      </main>
    </div>
  )
}