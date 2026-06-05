import Link from "next/link"
import { LogoutButton } from "@/components/LogoutButton"

export function Navbar() {
  return (
    <nav className="flex items-center gap-6">
      <Link href="/especialistas" className="text-xs font-bold text-black/60 hover:text-black uppercase tracking-widest link-transition">
        Especialistas
      </Link>
      <Link href="/mis-turnos" className="text-xs font-bold text-black/60 hover:text-black uppercase tracking-widest link-transition">
        Mis Turnos
      </Link>
      <LogoutButton />
    </nav>
  )
}
