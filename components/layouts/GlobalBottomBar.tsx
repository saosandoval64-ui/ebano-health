"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { signOut } from "next-auth/react"
import {
  Home,
  Search,
  Phone,
  User,
  UserPlus,
  Calendar,
  Users,
  Clock,
  Stethoscope,
  Settings,
  LogOut,
  LayoutDashboard,
  Heart,
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
  { name: "Contacto", href: "/#contact", icon: Phone },
  { name: "Mi Cuenta", href: "/login/patient", icon: User },
  { name: "Registrarse", href: "/register/patient", icon: UserPlus, isAction: true },
]

const patientTabs: Tab[] = [
  { name: "Dashboard", href: "/patient/dashboard", icon: LayoutDashboard },
  { name: "Perfil", href: "/patient/profile", icon: User },
  { name: "Turnos", href: "/patient/appointments", icon: Calendar },
  { name: "Config", href: "/patient/settings", icon: Settings },
  { name: "Salir", href: "/", icon: LogOut, isLogout: true },
]

const doctorTabs: Tab[] = [
  { name: "Dashboard", href: "/doctor/dashboard", icon: LayoutDashboard },
  { name: "Pacientes", href: "/doctor/patients", icon: Users },
  { name: "Turnos", href: "/doctor/appointments", icon: Calendar },
  { name: "Horarios", href: "/doctor/availability", icon: Clock },
  { name: "Salir", href: "/", icon: LogOut, isLogout: true },
]

const adminTabs: Tab[] = [
  { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
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

export default function GlobalBottomBar() {
  const pathname = usePathname()

  if (pathname.startsWith("/login") || pathname.startsWith("/register")) {
    return null
  }

  const tabs = getTabsForPath(pathname)

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-black/90 backdrop-blur-xl z-50 flex items-center justify-around px-1 safe-area-bottom border-t border-white/10">
      {tabs.map((tab) => {
        const isActive = !tab.isLogout && !tab.isAction && (pathname === tab.href || (tab.href !== "/" && pathname.startsWith(tab.href)))
        return tab.isLogout ? (
          <button
            key={tab.name}
            onClick={() => signOut({ redirect: true, redirectTo: "/" })}
            className="flex flex-col items-center justify-center gap-0.5 flex-1 py-2 text-white/50 hover:text-red-400 active:scale-95 transition-all"
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
            <span className="text-[9px] font-bold text-white/50 mt-0.5">{tab.name}</span>
          </Link>
        ) : (
          <Link
            key={tab.name}
            href={tab.href}
            className="flex flex-col items-center justify-center gap-0.5 flex-1 py-2 relative"
          >
            <tab.icon
              className={`w-5 h-5 transition-colors duration-150 ${
                isActive ? "text-[#F4C443]" : "text-white/50"
              }`}
            />
            <span
              className={`text-[9px] font-bold transition-colors duration-150 ${
                isActive ? "text-[#F4C443]" : "text-white/50"
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
  )
}
