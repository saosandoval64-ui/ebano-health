"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { logoutUser } from "@/app/actions/auth"
import { AvatarSelector } from "../../avatar-selector"
import { useAvatarUpdate } from "../../../hooks/useAvatarUpdate"
import { 
  LayoutDashboard, 
  Calendar, 
  User, 
  Settings, 
  LogOut, 
  Users, 
  Clock, 
  Stethoscope, 
  CreditCard,
  Menu,
  X
} from "lucide-react"
import { useState, memo, useMemo } from "react"

interface SidebarProps {
  userName: string
  userEmail: string
  role: "PATIENT" | "DOCTOR" | "ADMIN"
  userAvatar?: string
}

const Sidebar = memo(function Sidebar({ userName, userEmail, role, userAvatar = "1" }: SidebarProps) {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const [avatar, setAvatar] = useState(userAvatar)
  const { updateAvatar } = useAvatarUpdate()

  const handleAvatarSelect = async (selectedAvatar: string) => {
    const success = await updateAvatar(selectedAvatar)
    if (success) {
      setAvatar(selectedAvatar)
    }
  }

  // Memoizar los links para evitar recálculos
  const links = useMemo(() => {
    switch (role) {
      case "PATIENT":
        return [
          { name: "Dashboard", href: "/patient/dashboard", icon: LayoutDashboard },
          { name: "Mis Citas", href: "/patient/appointments", icon: Calendar },
          { name: "Mi Perfil", href: "/patient/profile", icon: User },
          { name: "Ajustes", href: "/patient/settings", icon: Settings },
        ]
      case "DOCTOR":
        return [
          { name: "Dashboard", href: "/doctor/dashboard", icon: LayoutDashboard },
          { name: "Consultas", href: "/doctor/appointments", icon: Calendar },
          { name: "Pacientes", href: "/doctor/patients", icon: Users },
          { name: "Disponibilidad", href: "/doctor/availability", icon: Clock },
        ]
      case "ADMIN":
        return [
          { name: "Panel Admin", href: "/admin/dashboard", icon: LayoutDashboard },
          { name: "Médicos (CRUD)", href: "/admin/doctors", icon: Stethoscope },
          { name: "Pacientes", href: "/admin/patients", icon: Users },
          { name: "Ver Turnos", href: "/admin/appointments", icon: Calendar },
          { name: "Pagos & Stripe", href: "/admin/payments", icon: CreditCard },
          { name: "Ajustes", href: "/admin/settings", icon: Settings },
        ]
      default:
        return []
    }
  }, [role])

  const handleLogout = async () => {
    await logoutUser()
  }

  const roleLabels = {
    PATIENT: "Paciente",
    DOCTOR: "Médico",
    ADMIN: "Administrador"
  }

  return (
    <>
      {/* Botón de Hamburguesa para Móvil */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="h-10 w-10 rounded-full bg-black text-[#FDF6CD] flex items-center justify-center shadow-lg border border-black/10 hover:scale-105 active:scale-95 link-transition"
        >
          {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Overlay para Móvil */}
      {isOpen && (
        <div 
          onClick={() => setIsOpen(false)}
          className="md:hidden fixed inset-0 bg-black/40 backdrop-blur-sm z-40 tab-transition animate-fadeIn"
        />
      )}

      {/* Menú Lateral (Sidebar) */}
      <aside className={`fixed md:sticky top-0 left-0 h-screen w-[260px] bg-black/5 border-r border-black/10 flex flex-col justify-between py-6 px-4 shrink-0 tab-transition z-40 ${
        isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
      }`}>
        
        {/* Superior: Logo y Enlaces */}
        <div className="space-y-8">
          {/* Logo */}
          <div className="pl-3 pt-2">
            <span className="text-xl sm:text-2xl font-serif font-black tracking-tight text-black block">
              Ébano<span className="text-[#A2B676]">.</span>
            </span>
            <span className="text-[9px] uppercase font-bold tracking-[0.25em] text-[#A2B676]">
              {roleLabels[role]}
            </span>
          </div>

          {/* Enlaces de Navegación */}
          <nav className="space-y-1.5">
            {links.map((link) => {
              const Icon = link.icon
              const isActive = pathname === link.href

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={`w-full h-11 px-4 rounded-2xl flex items-center gap-3 text-xs font-bold uppercase tracking-wider link-transition border outline-none active:scale-[0.98] ${
                    isActive
                      ? "bg-black text-[#FDF6CD] border-black shadow-sm"
                      : "bg-transparent border-transparent hover:bg-black/5 hover:border-black/5 text-black/75 hover:text-black"
                  }`}
                >
                  <Icon className={`h-4.5 w-4.5 shrink-0 ${isActive ? "text-[#A2B676]" : "text-black/60"}`} />
                  <span>{link.name}</span>
                </Link>
              )
            })}
          </nav>
        </div>

        {/* Inferior: Info del Usuario y Cerrar Sesión */}
        <div className="pt-6 border-t border-black/10 space-y-4">
          <div className="flex items-center gap-3 px-3">
            <AvatarSelector onSelect={handleAvatarSelect} currentAvatar={avatar} />
            <div className="overflow-hidden leading-tight">
              <h4 className="font-bold text-sm text-black truncate">{userName}</h4>
              <p className="text-[10px] text-black/40 truncate">{userEmail}</p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full h-11 px-4 rounded-2xl flex items-center gap-3 text-xs font-bold uppercase tracking-wider text-red-600 hover:bg-red-50 hover:border-red-100 border border-transparent link-transition outline-none active:scale-[0.98]"
          >
            <LogOut className="h-4.5 w-4.5 text-red-600 shrink-0" />
            <span>Cerrar Sesión</span>
          </button>
        </div>

      </aside>
    </>
  )
})

export default Sidebar
