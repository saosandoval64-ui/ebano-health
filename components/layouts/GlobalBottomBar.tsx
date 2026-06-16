"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { signOut } from "next-auth/react"
import { useState } from "react"
import {
  Home,
  Search,
  Phone,
  User,
  Calendar,
  Users,
  Clock,
  Stethoscope,
  Settings,
  LogOut,
  LayoutDashboard,
  X,
  UserPlus,
} from "lucide-react"

type Tab = {
  name: string
  href: string
  icon: typeof Home
  isAction?: boolean
  isLogout?: boolean
  isAccount?: boolean
}

const publicTabs: Tab[] = [
  { name: "Inicio", href: "/", icon: Home },
  { name: "Especialistas", href: "/especialistas", icon: Search },
  { name: "Contacto", href: "/contact", icon: Phone },
  { name: "Mi Cuenta", href: "#account", icon: User, isAccount: true },
  { name: "Registrarse", href: "/register", icon: UserPlus, isAction: true },
]

const patientTabs: Tab[] = [
  { name: "Inicio", href: "/patient/dashboard", icon: LayoutDashboard },
  { name: "Perfil", href: "/patient/profile", icon: User },
  { name: "Turnos", href: "/patient/appointments", icon: Calendar },
  { name: "Config", href: "/patient/settings", icon: Settings },
  { name: "Salir", href: "/", icon: LogOut, isLogout: true },
]

const doctorTabs: Tab[] = [
  { name: "Inicio", href: "/doctor/dashboard", icon: LayoutDashboard },
  { name: "Pacientes", href: "/doctor/patients", icon: Users },
  { name: "Turnos", href: "/doctor/appointments", icon: Calendar },
  { name: "Horarios", href: "/doctor/availability", icon: Clock },
  { name: "Salir", href: "/", icon: LogOut, isLogout: true },
]

const adminTabs: Tab[] = [
  { name: "Inicio", href: "/admin/dashboard", icon: LayoutDashboard },
  { name: "Médicos", href: "/admin/doctors", icon: Stethoscope },
  { name: "Turnos", href: "/admin/appointments", icon: Calendar },
  { name: "Pacientes", href: "/admin/patients", icon: Users },
  { name: "Config", href: "/admin/settings", icon: Settings },
]

function getTabsForPath(pathname: string) {
  if (pathname.startsWith("/admin")) return adminTabs
  if (pathname.startsWith("/doctor")) return doctorTabs
  if (pathname.startsWith("/patient")) return patientTabs
  return publicTabs
}

function AccountModal({ onClose }: { onClose: () => void }) {
  return (
    <>
      <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="fixed inset-0 z-50 flex items-end justify-center p-4">
        <div className="w-full max-w-sm bg-white rounded-t-3xl shadow-2xl p-6 animate-slideInUp">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-serif font-black text-black">Mi Cuenta</h3>
            <button onClick={onClose} className="h-8 w-8 rounded-full bg-black/5 flex items-center justify-center">
              <X className="w-4 h-4 text-black/50" />
            </button>
          </div>
          <div className="space-y-3">
            <Link
              href="/login/patient"
              onClick={onClose}
              className="flex items-center gap-4 p-4 rounded-2xl border border-gray-100 hover:bg-[#F4C443]/10 hover:border-[#F4C443]/30 transition-all active:scale-[0.98]"
            >
              <div className="w-12 h-12 rounded-xl bg-[#F4C443]/15 flex items-center justify-center">
                <User className="w-6 h-6 text-[#F4C443]" />
              </div>
              <div>
                <p className="font-bold text-black text-sm">Soy Paciente</p>
                <p className="text-xs text-black/50">Busca especialistas y agenda citas</p>
              </div>
            </Link>
            <Link
              href="/login/doctor"
              onClick={onClose}
              className="flex items-center gap-4 p-4 rounded-2xl border border-gray-100 hover:bg-[#8B5A2B]/10 hover:border-[#8B5A2B]/30 transition-all active:scale-[0.98]"
            >
              <div className="w-12 h-12 rounded-xl bg-[#8B5A2B]/10 flex items-center justify-center">
                <Stethoscope className="w-6 h-6 text-[#8B5A2B]" />
              </div>
              <div>
                <p className="font-bold text-black text-sm">Soy Médico</p>
                <p className="text-xs text-black/50">Administra tu agenda y pacientes</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}

export default function GlobalBottomBar() {
  const pathname = usePathname()
  const [showAccount, setShowAccount] = useState(false)

  if (pathname.startsWith("/login") || pathname.startsWith("/register") || pathname.startsWith("/admin") || pathname.startsWith("/doctor") || pathname.startsWith("/patient")) {
    return null
  }

  const tabs = getTabsForPath(pathname)

  return (
    <>
      <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-white border-t border-gray-200 z-50 flex items-center justify-around px-1 safe-area-bottom">
        {tabs.map((tab) => {
          const isActive = !tab.isLogout && !tab.isAction && !tab.isAccount && (pathname === tab.href || (tab.href !== "/" && pathname.startsWith(tab.href)))
          return tab.isLogout ? (
            <button
              key={tab.name}
              onClick={() => signOut({ redirect: true, redirectTo: "/" })}
              className="flex flex-col items-center justify-center gap-0.5 flex-1 py-2 text-gray-400 hover:text-red-500 active:scale-95 transition-all"
            >
              <tab.icon className="w-5 h-5" />
              <span className="text-[9px] font-bold">{tab.name}</span>
            </button>
          ) : tab.isAccount ? (
            <button
              key={tab.name}
              onClick={() => setShowAccount(true)}
              className="flex flex-col items-center justify-center gap-0.5 flex-1 py-2 text-gray-400 hover:text-[#F4C443] active:scale-95 transition-all"
            >
              <tab.icon className="w-5 h-5" />
              <span className="text-[9px] font-bold">{tab.name}</span>
            </button>
          ) : tab.isAction ? (
            <Link
              key={tab.name}
              href={tab.href}
              className="flex flex-col items-center justify-center gap-0.5 flex-1 py-2"
            >
              <div className="w-10 h-10 rounded-full bg-[#F4C443] flex items-center justify-center shadow-md active:scale-90 transition-transform">
                <tab.icon className="w-5 h-5 text-black" />
              </div>
              <span className="text-[9px] font-bold text-gray-400 mt-0.5">{tab.name}</span>
            </Link>
          ) : (
            <Link
              key={tab.name}
              href={tab.href}
              className="flex flex-col items-center justify-center gap-0.5 flex-1 py-2 relative"
            >
              <tab.icon
                className={`w-5 h-5 transition-colors duration-150 ${
                  isActive ? "text-[#F4C443]" : "text-gray-400"
                }`}
              />
              <span
                className={`text-[9px] font-bold transition-colors duration-150 ${
                  isActive ? "text-[#F4C443]" : "text-gray-400"
                }`}
              >
                {tab.name}
              </span>
              {isActive && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-5 h-0.5 bg-[#F4C443] rounded-full" />
              )}
            </Link>
          )
        })}
      </nav>

      {showAccount && <AccountModal onClose={() => setShowAccount(false)} />}
    </>
  )
}
