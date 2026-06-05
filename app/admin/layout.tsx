import { getCurrentUser } from "../../lib/auth"
import { redirect } from "next/navigation"
import Sidebar from "../../components/layouts/sidebar/Sidebar"
import type { User } from "@prisma/client"

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser()
  if (!user || user.role !== "ADMIN") {
    redirect("/login")
  }

  const typedUser = user as User & { avatar?: string }

  return (
    <div className="min-h-screen bg-[#FDF6CD] text-black font-sans flex flex-col md:flex-row selection:bg-[#E2CE7D] animate-fadeInScale">
      <Sidebar 
        userName={`${user.name} ${user.lastName || ""}`} 
        userEmail={user.email} 
        role="ADMIN"
        userAvatar={typedUser.avatar || "1"}
      />
      <main className="flex-1 p-6 sm:p-8 md:p-12 overflow-y-auto h-screen animate-slideInUp">
        {children}
      </main>
    </div>
  )
}
