"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { signOut } from "next-auth/react"
import { AvatarSelectorModal } from "@/components/AvatarSelectorModal"
import { useAvatarUpdate } from "@/hooks/useAvatarUpdate"
import { normalizeAvatar } from "@/lib/avatar"
import {
  LayoutDashboard,
  Calendar,
  User,
  Settings,
  LogOut,
  Users,
  Clock,
  Stethoscope,
  Heart,
  CreditCard,
  Home,
  FileText,
  FolderOpen,
  Bell,
  BarChart3,
  CalendarCheck,
  Video
} from "lucide-react"
import { useState, useEffect } from "react"

interface SidebarProps {
  userName: string
  userEmail: string
  role: "PATIENT" | "DOCTOR" | "ADMIN" | "SECRETARY"
  userAvatar?: string
}

export default function Sidebar({ userName, userEmail, role, userAvatar }: SidebarProps) {
  const pathname = usePathname()
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false)
  const [avatar, setAvatar] = useState(userAvatar)
  const { updateAvatar } = useAvatarUpdate()

  useEffect(() => {
    setAvatar(userAvatar)
  }, [userAvatar])

  const handleAvatarSelect = async (selectedAvatar: string) => {
    const success = await updateAvatar(selectedAvatar)
    if (success) {
      setAvatar(selectedAvatar)
    }
    setIsAvatarModalOpen(false)
  }

  const handleLogout = async () => {
    document.cookie = "session=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT"
    await signOut({
      redirect: true,
      redirectTo: "/"
    })
  }

  const getNavLinks = () => {
    switch (role) {
      case "PATIENT":
        return [
          { name: "Inicio", href: "/patient/dashboard", icon: LayoutDashboard },
          { name: "Mis Turnos", href: "/patient/appointments", icon: Calendar },
          { name: "Mis Médicos", href: "/patient/my-doctors", icon: Heart },
          { name: "Historia Clínica", href: "/patient/medical-history", icon: FileText },
          { name: "Controles", href: "/patient/follow-ups", icon: CalendarCheck },
          { name: "Documentos", href: "/patient/documents", icon: FolderOpen },
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
          { name: "Seguidores", href: "/doctor/followers", icon: Heart },
          { name: "Disponibilidad", href: "/doctor/availability", icon: Clock },
          { name: "Telemedicina", href: "/doctor/telemedicine", icon: Video },
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
      case "SECRETARY":
        return [
          { name: "Inicio", href: "/admin/dashboard", icon: LayoutDashboard },
          { name: "Pacientes", href: "/admin/patients", icon: Users },
          { name: "Turnos", href: "/admin/appointments", icon: Calendar },
          { name: "Configuración", href: "/admin/settings", icon: Settings },
        ]
      default:
        return []
    }
  }

  const navLinks = getNavLinks()

  return (
    <>
      {/* Sidebar - Desktop only */}
      <aside className="hidden md:flex sticky top-0 left-0 h-screen w-[88px] bg-[#F4C443] flex-col items-center py-6 shrink-0">
        {/* Logo */}
        <Link href="/" className="mb-6 flex flex-col items-center gap-1">
          <div className="w-12 h-12 rounded-xl overflow-hidden shadow-md">
            <img src="/avatars/avatar-4.svg" alt="Ébano" className="w-full h-full object-cover" />
          </div>
          <span className="text-[11px] font-serif font-black text-black leading-none">Ébano</span>
          <span className="text-[7px] font-bold uppercase tracking-[0.15em] text-black/50 leading-none">Health</span>
        </Link>

        {/* Navigation */}
        <nav className="flex-1 flex flex-col items-center gap-2 w-full">
          {navLinks.map((link) => {
            const isActive = pathname === link.href || pathname.startsWith(link.href + "/")
            return (
              <Link
                key={link.href}
                href={link.href}
                title={link.name}
                className={`
                  w-12 h-12 rounded-xl flex items-center justify-center
                  transition-all duration-200
                  ${isActive
                    ? "bg-black text-[#F4C443] shadow-md"
                    : "text-black/60 hover:bg-black/10 hover:text-black"
                  }
                `}
              >
                <link.icon className="w-5 h-5" />
              </Link>
            )
          })}
        </nav>

        {/* Home */}
        <Link
          href="/"
          title="Volver al inicio"
          className="w-12 h-12 rounded-xl flex items-center justify-center text-black/60 hover:bg-black/10 hover:text-black transition-all mb-3"
        >
          <Home className="w-5 h-5" />
        </Link>

        {/* User Avatar */}
        <button
          onClick={() => setIsAvatarModalOpen(true)}
          className="w-12 h-12 rounded-xl bg-white/30 flex items-center justify-center overflow-hidden mb-3 hover:bg-white/50 transition-all"
        >
          {avatar ? (
            <img src={normalizeAvatar(avatar)} alt={userName} className="w-full h-full object-cover" />
          ) : (
            <span className="text-black font-bold text-sm">{userName.charAt(0)}</span>
          )}
        </button>

        {/* Logout */}
        <button
          onClick={handleLogout}
          title="Cerrar sesión"
          className="w-12 h-12 rounded-xl flex items-center justify-center text-black/50 hover:bg-red-100 hover:text-red-600 transition-all"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </aside>

      <AvatarSelectorModal
        isOpen={isAvatarModalOpen}
        onClose={() => setIsAvatarModalOpen(false)}
        onSelect={handleAvatarSelect}
      />
    </>
  )
}
