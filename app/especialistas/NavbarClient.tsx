"use client"

import Link from "next/link"
import { UserPlus } from "lucide-react"
import { Button } from "@/components/ui/button"
import Logo from "@/components/Logo"

export default function NavbarClient() {
  return (
    <header className="w-full max-w-7xl mx-auto px-4 sm:px-8 py-4 sm:py-6 flex items-center justify-between gap-4">
      <Link href="/">
        <Logo size="sm" />
      </Link>

      <nav className="hidden md:flex items-center gap-10 text-xs font-bold uppercase tracking-widest text-black/80">
        <Link href="/" className="hover:text-black transition-colors">Home</Link>
        <Link href="/especialistas" className="pb-1 border-b-2 border-black transition-all">Especialistas</Link>
        <Link href="/contact" className="hover:text-black transition-colors">Contacto</Link>
      </nav>

      <div className="flex items-center gap-4 sm:gap-6">
        <Link href="/login/patient" className="text-xs font-bold uppercase tracking-widest text-black/80 hover:text-black transition-colors">
          Sign In
        </Link>
        <Button asChild className="rounded-full bg-[#F4C443] hover:bg-[#E5B534] text-black border border-black/10 px-4 sm:px-6 py-2 text-xs font-bold uppercase tracking-wider shadow-sm transition-transform active:scale-95">
          <Link href="/register" className="flex items-center gap-1.5">
            <UserPlus className="h-3.5 w-3.5" /> Sign Up
          </Link>
        </Button>
      </div>
    </header>
  )
}
