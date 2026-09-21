"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { signOut } from "next-auth/react"
import { AvatarSelectorModal } from "@/components/AvatarSelectorModal"
import { useAvatarUpdate } from "@/hooks/useAvatarUpdate"
import { normalizeAvatar } from "@/lib/avatar"
import {
  LayoutDashboard, Calendar, User, Settings, LogOut, Users, Clock,
  Stethoscope, Heart, CreditCard, FileText, FolderOpen, Bell,
  BarChart3, CalendarCheck, Video, MessageSquare, ChevronRight
} from "lucide-react"
import { useState } from "react"

interface SidebarProps {
  userName: string
  userEmail?: string
  role: "PATIENT" | "DOCTOR" | "ADMIN" | "CLINIC_ADMIN"
  userAvatar?: string
}

type NavLink = { name: string; href: string; icon: React.ComponentType<{ className?: string }> }

export default function Sidebar({ userName, role, userAvatar }: SidebarProps) {
  const pathname = usePathname()
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false)
  const [avatar, setAvatar] = useState(userAvatar)
  const { updateAvatar } = useAvatarUpdate()

  const handleAvatarSelect = async (selectedAvatar: string) => {
    const success = await updateAvatar(selectedAvatar)
    if (success) setAvatar(selectedAvatar)
    setIsAvatarModalOpen(false)
  }

  const handleLogout = async () => {
    document.cookie = "session=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT"
    await signOut({ redirect: true, redirectTo: "/" })
  }

  const getNavLinks = (): NavLink[] => {
    switch (role) {
      case "PATIENT":
        return [
          { name: "Inicio", href: "/patient/dashboard", icon: LayoutDashboard },
          { name: "Mis Turnos", href: "/patient/appointments", icon: Calendar },
          { name: "Mis Médicos", href: "/patient/my-doctors", icon: Heart },
          { name: "Historia Clínica", href: "/patient/medical-history", icon: FileText },
          { name: "Controles", href: "/patient/follow-ups", icon: CalendarCheck },
          { name: "Documentos", href: "/patient/documents", icon: FolderOpen },
          { name: "Mensajes", href: "/mensajes", icon: MessageSquare },
          { name: "Notificaciones", href: "/patient/notifications", icon: Bell },
          { name: "Mi Perfil", href: "/patient/profile", icon: User },
          { name: "Configuración", href: "/patient/settings", icon: Settings },
        ]
      case "DOCTOR":
        return [
          { name: "Inicio", href: "/doctor/dashboard", icon: LayoutDashboard },
          { name: "Turnos", href: "/doctor/appointments", icon: Calendar },
          { name: "Pacientes", href: "/doctor/patients", icon: Users },
          { name: "Historias", href: "/doctor/medical-records", icon: FileText },
          { name: "Documentos", href: "/doctor/documents", icon: FolderOpen },
          { name: "Mensajes", href: "/mensajes", icon: MessageSquare },
          { name: "Seguidores", href: "/doctor/followers", icon: Heart },
          { name: "Disponibilidad", href: "/doctor/availability", icon: Clock },
          { name: "Telemedicina", href: "/doctor/telemedicine", icon: Video },
          { name: "Configuración", href: "/doctor/settings", icon: Settings },
        ]
      case "ADMIN":
        return [
          { name: "Panel", href: "/admin/dashboard", icon: LayoutDashboard },
          { name: "Médicos", href: "/admin/doctors", icon: Stethoscope },
          { name: "Pacientes", href: "/admin/patients", icon: Users },
          { name: "Turnos", href: "/admin/appointments", icon: Calendar },
          { name: "Reportes", href: "/admin/reports", icon: BarChart3 },
          { name: "Pagos", href: "/admin/payments", icon: CreditCard },
          { name: "Configuración", href: "/admin/settings", icon: Settings },
        ]
      case "CLINIC_ADMIN":
        return [
          { name: "Panel", href: "/clinic-admin/dashboard", icon: LayoutDashboard },
          { name: "Mi Clínica", href: "/clinic-admin/clinic", icon: Stethoscope },
          { name: "Médicos", href: "/clinic-admin/doctors", icon: Users },
          { name: "Turnos", href: "/clinic-admin/appointments", icon: Calendar },
          { name: "Configuración", href: "/clinic-admin/settings", icon: Settings },
        ]
      default:
        return []
    }
  }

  const navLinks = getNavLinks()
  // Para móvil mostramos solo los 4 primeros links más relevantes
  const mobileLinks = navLinks.slice(0, 4)

  return (
    <>
      {/* ── SIDEBAR DESKTOP ─────────────────────────────── */}
      <aside className="hidden md:flex sticky top-0 left-0 h-screen w-56 bg-white border-r border-gray-100 flex-col py-5 px-3 shrink-0">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 px-2 mb-6">
          <div className="w-8 h-8 rounded-lg bg-[#F4C443] flex items-center justify-center shrink-0">
            <span className="text-black font-serif font-black text-sm">É</span>
          </div>
          <div className="leading-tight">
            <p className="font-serif font-black text-sm text-black leading-none">Ébano</p>
            <p className="text-[9px] font-bold uppercase tracking-widest text-black/30 leading-none mt-0.5">Hearst</p>
          </div>
        </Link>

        {/* User chip */}
        <button
          onClick={() => setIsAvatarModalOpen(true)}
          className="flex items-center gap-2.5 px-2 mb-5 group"
        >
          <div className="w-8 h-8 rounded-lg bg-[#F4C443]/20 flex items-center justify-center overflow-hidden shrink-0">
            {avatar ? (
              <img src={normalizeAvatar(avatar)} alt={userName} className="w-full h-full object-cover" />
            ) : (
              <span className="text-black font-bold text-sm">{userName.charAt(0)}</span>
            )}
          </div>
          <div className="flex-1 min-w-0 text-left">
            <p className="text-xs font-bold text-black truncate">{userName}</p>
            <p className="text-[9px] text-black/30 font-medium uppercase tracking-wider">
              {role === "PATIENT" ? "Paciente" : role === "DOCTOR" ? "Médico" : role === "ADMIN" ? "Admin" : "Clínica"}
            </p>
          </div>
          <ChevronRight className="w-3 h-3 text-black/20 group-hover:text-black/40 transition-colors shrink-0" />
        </button>

        {/* Nav */}
        <nav className="flex-1 space-y-0.5 overflow-y-auto">
          {navLinks.map((link) => {
            const isActive = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href + "/"))
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-sm font-semibold transition-all duration-150 ${
                  isActive
                    ? "bg-black text-white"
                    : "text-black/50 hover:text-black hover:bg-black/5"
                }`}
              >
                <link.icon className={`w-4 h-4 shrink-0 ${isActive ? "text-[#F4C443]" : ""}`} />
                <span className="truncate">{link.name}</span>
              </Link>
            )
          })}
        </nav>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-sm font-semibold text-black/40 hover:text-red-500 hover:bg-red-50 transition-all mt-2"
        >
          <LogOut className="w-4 h-4 shrink-0" />
          <span>Cerrar sesión</span>
        </button>
      </aside>

      {/* ── BOTTOM NAV MÓVIL ────────────────────────────── */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-100 flex items-center justify-around px-2 safe-area-bottom">
        {mobileLinks.map((link) => {
          const isActive = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href + "/"))
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex flex-col items-center gap-0.5 py-3 px-3 min-w-0 transition-colors ${
                isActive ? "text-black" : "text-black/30"
              }`}
            >
              <link.icon className={`w-5 h-5 shrink-0 ${isActive ? "text-[#F4C443] stroke-[2.5]" : ""}`} />
              <span className="text-[9px] font-bold uppercase tracking-wide truncate max-w-[56px] text-center">
                {link.name}
              </span>
            </Link>
          )
        })}
        {/* Más opciones */}
        <button
          onClick={() => setIsAvatarModalOpen(true)}
          className="flex flex-col items-center gap-0.5 py-3 px-3 text-black/30"
        >
          <div className="w-5 h-5 rounded-full bg-[#F4C443]/30 flex items-center justify-center overflow-hidden">
            {avatar ? (
              <img src={normalizeAvatar(avatar)} alt={userName} className="w-full h-full object-cover" />
            ) : (
              <span className="text-black font-bold text-[8px]">{userName.charAt(0)}</span>
            )}
          </div>
          <span className="text-[9px] font-bold uppercase tracking-wide">Perfil</span>
        </button>
      </nav>

      <AvatarSelectorModal
        isOpen={isAvatarModalOpen}
        onClose={() => setIsAvatarModalOpen(false)}
        onSelect={handleAvatarSelect}
      />
    </>
  )
}
