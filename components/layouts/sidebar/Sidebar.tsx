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
  Home
} from "lucide-react"
import { useState, useEffect } from "react"

interface SidebarProps {
  userName: string
  userEmail: string
  role: "PATIENT" | "DOCTOR" | "ADMIN"
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
          { name: "Mi Perfil", href: "/patient/profile", icon: User },
          { name: "Configuración", href: "/patient/settings", icon: Settings },
        ]
      case "DOCTOR":
        return [
          { name: "Inicio", href: "/doctor/dashboard", icon: LayoutDashboard },
          { name: "Turnos", href: "/doctor/appointments", icon: Calendar },
          { name: "Pacientes", href: "/doctor/patients", icon: Users },
          { name: "Seguidores", href: "/doctor/followers", icon: Heart },
          { name: "Disponibilidad", href: "/doctor/availability", icon: Clock },
        ]
      case "ADMIN":
        return [
          { name: "Panel", href: "/admin/dashboard", icon: LayoutDashboard },
          { name: "Médicos", href: "/admin/doctors", icon: Stethoscope },
          { name: "Pacientes", href: "/admin/patients", icon: Users },
          { name: "Turnos", href: "/admin/appointments", icon: Calendar },
          { name: "Pagos", href: "/admin/payments", icon: CreditCard },
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
      <aside className="hidden md:flex sticky top-0 left-0 h-screen w-[72px] bg-[#F4C443] flex-col items-center py-5 shrink-0">
        {/* Navigation */}
        <nav className="flex-1 flex flex-col items-center gap-1.5 w-full">
          {navLinks.map((link) => {
            const isActive = pathname === link.href || pathname.startsWith(link.href + "/")
            return (
              <Link
                key={link.href}
                href={link.href}
                title={link.name}
                className={`
                  w-11 h-11 rounded-xl flex items-center justify-center
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
          className="w-11 h-11 rounded-xl flex items-center justify-center text-black/60 hover:bg-black/10 hover:text-black transition-all mb-2"
        >
          <Home className="w-5 h-5" />
        </Link>

        {/* User Avatar */}
        <button
          onClick={() => setIsAvatarModalOpen(true)}
          className="w-11 h-11 rounded-xl bg-white/30 flex items-center justify-center overflow-hidden mb-2 hover:bg-white/50 transition-all"
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
          className="w-11 h-11 rounded-xl flex items-center justify-center text-black/50 hover:bg-red-100 hover:text-red-600 transition-all"
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
