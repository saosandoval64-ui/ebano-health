"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { signOut } from "next-auth/react"
import {
  Home,
  Search,
  Calendar,
  User,
  Users,
  Clock,
  Stethoscope,
  Heart,
  Settings,
  Plus,
  LogOut,
} from "lucide-react"

type Tab = {
  name: string
  href: string
  icon: typeof Home
  isAction?: boolean
  isLogout?: boolean
}

const publicTabs: Tab[] = [
  { name: "Inicio", href: "/", icon: Home },
  { name: "Especialistas", href: "/especialistas", icon: Search },
  { name: "Agendar", href: "/especialistas", icon: Plus, isAction: true },
  { name: "Contacto", href: "/#contact", icon: Heart },
  { name: "Mi Cuenta", href: "/login/patient", icon: User },
]

const patientTabs: Tab[] = [
  { name: "Inicio", href: "/patient/dashboard", icon: Home },
  { name: "Buscar", href: "/especialistas", icon: Search },
  { name: "Agendar", href: "/especialistas", icon: Plus, isAction: true },
  { name: "Turnos", href: "/patient/appointments", icon: Calendar },
  { name: "Salir", href: "/", icon: LogOut, isLogout: true },
]

const doctorTabs: Tab[] = [
  { name: "Inicio", href: "/doctor/dashboard", icon: Home },
  { name: "Pacientes", href: "/doctor/patients", icon: Users },
  { name: "Turnos", href: "/doctor/appointments", icon: Calendar, isAction: true },
  { name: "Horarios", href: "/doctor/availability", icon: Clock },
  { name: "Salir", href: "/", icon: LogOut, isLogout: true },
]

const adminTabs: Tab[] = [
  { name: "Inicio", href: "/admin/dashboard", icon: Home },
  { name: "Médicos", href: "/admin/doctors", icon: Stethoscope },
  { name: "Turnos", href: "/admin/appointments", icon: Calendar, isAction: true },
  { name: "Pacientes", href: "/admin/patients", icon: Users },
  { name: "Salir", href: "/", icon: LogOut, isLogout: true },
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
    <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-white border-t border-gray-200 z-50 flex items-center justify-around px-1 safe-area-bottom shadow-[0_-2px_10px_rgba(0,0,0,0.05)]">
      {tabs.map((tab) => {
        const isActive = !tab.isLogout && (pathname === tab.href || (tab.href !== "/" && pathname.startsWith(tab.href) && !tab.isAction))
        return tab.isLogout ? (
          <button
            key={tab.name}
            onClick={() => signOut({ redirect: true, redirectTo: "/" })}
            className="flex flex-col items-center justify-center gap-0.5 flex-1 py-2 text-gray-400 hover:text-red-500 active:scale-95 transition-all"
          >
            <tab.icon className="w-5 h-5" />
            <span className="text-[9px] font-bold">{tab.name}</span>
          </button>
        ) : (
          <Link
            key={tab.name}
            href={tab.href}
            className={`
              flex flex-col items-center justify-center gap-0.5
              transition-all duration-150 relative
              ${tab.isAction ? "w-12 h-12 -mt-5" : "flex-1 py-2"}
            `}
          >
            {tab.isAction ? (
              <div className="w-12 h-12 rounded-full bg-[#F4C443] flex items-center justify-center shadow-lg shadow-[#F4C443]/30 active:scale-90 transition-transform">
                <tab.icon className="w-6 h-6 text-black" />
              </div>
            ) : (
              <>
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
