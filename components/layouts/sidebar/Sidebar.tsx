"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { signOut } from "next-auth/react"
import { AvatarSelectorModal } from "@/components/AvatarSelectorModal"
import { useAvatarUpdate } from "@/hooks/useAvatarUpdate"
import Logo from "@/components/Logo"
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
  Menu,
  X,
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
  const [isOpen, setIsOpen] = useState(false)
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
      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-white/90 backdrop-blur-xl border-b border-gray-100 z-40 flex items-center justify-between px-4">
        <Link href="/">
          <Logo size="sm" />
        </Link>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 rounded-xl hover:bg-gray-50 transition-all"
        >
          {isOpen ? <X className="w-6 h-6 text-black" /> : <Menu className="w-6 h-6 text-black" />}
        </button>
      </div>

      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/30 backdrop-blur-sm z-30 animate-fadeIn"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`
          fixed md:sticky top-0 left-0 h-full md:h-screen z-40
          w-72 bg-white border-r border-gray-100 shadow-xl
          transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}
      >
        <div className="h-full flex flex-col p-6">
          {/* Logo */}
          <Link href="/" className="mb-8 mt-2">
            <Logo size="lg" subtext="Health" />
          </Link>

          {/* Navigation */}
          <nav className="flex-1 space-y-2">
            <p className="text-xs font-bold uppercase tracking-[0.15em] text-gray-400 px-3 mb-3">
              Menú
            </p>
            {navLinks.map((link) => {
              const isActive = pathname === link.href
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={`
                    flex items-center gap-3 px-4 py-3.5 rounded-2xl text-sm font-medium
                    transition-all duration-200 group
                    ${isActive
                      ? "bg-[#1A1A1A] text-white shadow-md shadow-[#1A1A1A]/10"
                      : "text-gray-600 hover:bg-gray-50 hover:text-black"
                    }
                  `}
                >
                  <link.icon
                    className={`w-5 h-5 ${isActive ? "text-white" : "text-gray-400 group-hover:text-[#A2B676]"}`}
                  />
                  {link.name}
                </Link>
              )
            })}
          </nav>

          {/* Quick Access to Home */}
          <div className="mt-4">
            <Link
              href="/"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-4 py-3.5 rounded-2xl text-sm font-medium text-gray-500 hover:bg-gray-50 hover:text-black transition-all duration-200"
            >
              <Home className="w-5 h-5 text-gray-400" />
              Volver al Inicio
            </Link>
          </div>

          {/* User Profile & Logout */}
          <div className="mt-8 pt-6 border-t border-gray-100">
            <div
              onClick={() => setIsAvatarModalOpen(true)}
              className="flex items-center gap-4 mb-4 p-3 rounded-2xl hover:bg-gray-50 transition-all cursor-pointer"
            >
              <div className="relative">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#A2B676] to-[#8B5A2B] flex items-center justify-center overflow-hidden border-2 border-white shadow-lg">
                  {avatar ? (
                    <img
                      src={normalizeAvatar(avatar)}
                      alt={userName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-white font-bold text-lg">{userName.charAt(0)}</span>
                  )}
                </div>
                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-[#A2B676] rounded-full flex items-center justify-center border-2 border-white">
                  <div className="w-2 h-2 bg-white rounded-full" />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-black truncate">{userName}</p>
                <p className="text-xs text-gray-500 truncate">{userEmail}</p>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 px-4 py-3.5 rounded-2xl text-sm font-semibold text-red-600 bg-red-50 hover:bg-red-100 transition-all duration-200"
            >
              <LogOut className="w-4 h-4" />
              Cerrar Sesión
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Sidebar */}
      <div className="md:hidden h-16" />

      <AvatarSelectorModal
        isOpen={isAvatarModalOpen}
        onClose={() => setIsAvatarModalOpen(false)}
        onSelect={handleAvatarSelect}
      />
    </>
  )
}
