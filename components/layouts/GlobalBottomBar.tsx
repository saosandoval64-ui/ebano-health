"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Home,
  Search,
  Calendar,
  User,
  Users,
  Clock,
  Stethoscope,
  Heart,
  CreditCard,
  Settings,
  Plus,
  LayoutDashboard,
} from "lucide-react"

const publicTabs = [
  { name: "Home", href: "/", icon: Home },
  { name: "Especialistas", href: "/especialistas", icon: Search },
  { name: "Agendar", href: "/especialistas", icon: Plus, isAction: true },
  { name: "Contacto", href: "/#contact", icon: Heart },
  { name: "Sign In", href: "/login/patient", icon: User },
]

const patientTabs = [
  { name: "Inicio", href: "/patient/dashboard", icon: Home },
  { name: "Buscar", href: "/especialistas", icon: Search },
  { name: "Agendar", href: "/especialistas", icon: Plus, isAction: true },
  { name: "Turnos", href: "/patient/appointments", icon: Calendar },
  { name: "Perfil", href: "/patient/profile", icon: User },
]

const doctorTabs = [
  { name: "Inicio", href: "/doctor/dashboard", icon: Home },
  { name: "Pacientes", href: "/doctor/patients", icon: Users },
  { name: "Turnos", href: "/doctor/appointments", icon: Calendar, isAction: true },
  { name: "Horarios", href: "/doctor/availability", icon: Clock },
  { name: "Perfil", href: "/doctor/profile", icon: User },
]

const adminTabs = [
  { name: "Inicio", href: "/admin/dashboard", icon: Home },
  { name: "Médicos", href: "/admin/doctors", icon: Stethoscope },
  { name: "Turnos", href: "/admin/appointments", icon: Calendar, isAction: true },
  { name: "Pacientes", href: "/admin/patients", icon: Users },
  { name: "Config", href: "/admin/settings", icon: Settings },
]

function getTabsForPath(pathname: string) {
  if (pathname.startsWith("/admin")) return adminTabs
  if (pathname.startsWith("/doctor")) return doctorTabs
  if (pathname.startsWith("/patient")) return patientTabs
  return publicTabs
}

export default function GlobalBottomBar() {
  const pathname = usePathname()

  if (pathname.startsWith("/login") || pathname.startsWith("/register")) {
    return null
  }

  const tabs = getTabsForPath(pathname)

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-white/95 backdrop-blur-xl border-t border-gray-100 z-40 flex items-center justify-around px-2 safe-area-bottom">
      {tabs.map((tab) => {
        const isActive = pathname === tab.href || (tab.href !== "/" && pathname.startsWith(tab.href) && !tab.isAction)
        return (
          <Link
            key={tab.name}
            href={tab.href}
            className={`
              flex flex-col items-center justify-center gap-0.5
              transition-all duration-200 relative
              ${tab.isAction ? "w-12 h-12 -mt-4" : "flex-1 py-2"}
            `}
          >
            {tab.isAction ? (
              <div className="w-12 h-12 rounded-full bg-[#F4C443] flex items-center justify-center shadow-lg shadow-[#F4C443]/30 hover:scale-105 active:scale-95 transition-transform">
                <tab.icon className="w-6 h-6 text-black" />
              </div>
            ) : (
              <>
                <tab.icon
                  className={`w-5 h-5 transition-colors ${
                    isActive ? "text-[#F4C443]" : "text-gray-400"
                  }`}
                />
                <span
                  className={`text-[9px] font-bold transition-colors ${
                    isActive ? "text-[#F4C443]" : "text-gray-400"
                  }`}
                >
                  {tab.name}
                </span>
                {isActive && (
                  <div className="absolute -top-px left-1/2 -translate-x-1/2 w-5 h-0.5 bg-[#F4C443] rounded-full" />
                )}
              </>
            )}
          </Link>
        )
      })}
    </nav>
  )
}
