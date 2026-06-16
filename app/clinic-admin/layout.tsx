import { auth } from "../../lib/auth"
import { redirect } from "next/navigation"
import Sidebar from "../../components/layouts/sidebar/Sidebar"
import { db } from "../../lib/db"
import { normalizeAvatar } from "../../lib/avatar"

export default async function ClinicAdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()
  if (!session?.user || session.user.role !== "CLINIC_ADMIN") {
    return redirect("/login/clinic-admin")
  }

  const user = await db.user.findUnique({
    where: { id: session.user.id },
    select: { name: true, lastName: true, email: true, avatar: true },
  })

  if (!user) return redirect("/login")

  const avatar = normalizeAvatar(user.avatar)

  return (
    <div className="min-h-screen text-black font-sans flex flex-col md:flex-row selection:bg-[#E2CE7D]">
      <Sidebar
        userName={`${user.name} ${user.lastName || ""}`}
        userEmail={user.email}
        role="CLINIC_ADMIN"
        userAvatar={avatar}
      />
      <main className="flex-1 min-h-screen md:h-screen overflow-y-auto pb-24 md:pb-0">
        {children}
      </main>
    </div>
  )
}
