"use client"

import { logoutUser } from "../app/actions/auth"

export function LogoutButton() {
  return (
    <button 
      onClick={() => logoutUser()}
      className="text-[10px] font-bold text-black/50 hover:text-black uppercase tracking-widest transition-colors cursor-pointer"
    >
      Cerrar Sesión
    </button>
  )
}