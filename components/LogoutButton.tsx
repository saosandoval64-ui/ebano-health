"use client"

import { signOut } from "next-auth/react"

export function LogoutButton() {
  const handleLogout = async () => {
    await signOut({ redirectTo: "/login" })
  }

  return (
    <button 
      onClick={handleLogout}
      className="text-[10px] font-bold text-black/50 hover:text-black uppercase tracking-widest transition-colors cursor-pointer"
    >
      Cerrar Sesión
    </button>
  )
}