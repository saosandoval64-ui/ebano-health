import { getCurrentUser } from "../../lib/auth"
import { redirect } from "next/navigation"
import Sidebar from "../../components/layouts/sidebar/Sidebar"

export default async function DoctorLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser()
  if (!user || user.role !== "DOCTOR") {
    redirect("/login")
  }

  return (
    <div className="min-h-screen bg-[#FDF6CD] text-black font-sans flex flex-col md:flex-row selection:bg-[#E2CE7D] animate-fadeInScale">
      <Sidebar 
        userName={`Dr. ${user.name} ${user.lastName || ""}`} 
        userEmail={user.email} 
        role="DOCTOR"
        userAvatar={(user as any).avatar || "1"}
      />
      <main className="flex-1 p-6 sm:p-8 md:p-12 overflow-y-auto h-screen animate-slideInUp">
        {children}
      </main>
    </div>
  )
}
