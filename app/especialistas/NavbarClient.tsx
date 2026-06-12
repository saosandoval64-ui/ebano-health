"use client"

import { useState } from "react"
import Link from "next/link"
import { UserPlus, Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function NavbarClient() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <>
      <header className="w-full max-w-7xl mx-auto px-4 sm:px-8 py-6 sm:py-8 flex items-center justify-between gap-4 bg-white rounded-[40px] mt-6 mx-6 sm:mx-auto shadow-lg">
        <Link href="/" className="flex items-center gap-1 cursor-pointer shrink-0">
          <span className="text-xl sm:text-2xl font-serif font-black tracking-tight text-black">
            Ébano<span className="text-[#A2B676]">.</span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-10 text-xs font-bold uppercase tracking-widest text-black/80">
          <Link href="/" className="hover:text-black transition-colors">Home</Link>
          <Link href="/especialistas" className="pb-1 border-b-2 border-black transition-all">Especialistas</Link>
          <Link href="/contact" className="hover:text-black transition-colors">Contacto</Link>
        </nav>

        <div className="hidden md:flex items-center gap-4 sm:gap-6">
          <Link href="/login/patient" className="text-xs font-bold uppercase tracking-widest text-black/80 hover:text-black transition-colors">
            Sign In
          </Link>
          <Button asChild className="rounded-full bg-[#F4C443] hover:bg-[#E5B534] text-black border border-black/10 px-4 sm:px-6 py-2 text-xs font-bold uppercase tracking-wider shadow-sm transition-transform active:scale-95">
            <Link href="/register" className="flex items-center gap-1.5">
              <UserPlus className="h-3.5 w-3.5" /> Sign Up
            </Link>
          </Button>
        </div>

        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden h-10 w-10 rounded-full bg-black text-[#FDF6CD] flex items-center justify-center shadow-lg border border-black/10 hover:scale-105 active:scale-95"
          aria-label="Abrir menú"
        >
          {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </header>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-black/40 backdrop-blur-sm">
          <div className="fixed top-0 right-0 h-full w-[280px] bg-[#FDF6CD] shadow-2xl border-l border-black/10 p-6">
            <div className="flex justify-end mb-8">
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="h-9 w-9 rounded-full bg-black/5 hover:bg-black/10 flex items-center justify-center text-black/70"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <nav className="flex flex-col gap-3">
              <Link
                href="/"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full h-11 px-4 rounded-2xl flex items-center text-xs font-bold uppercase tracking-wider text-black/75 hover:bg-black/5 hover:text-black"
              >
                Home
              </Link>
              <Link
                href="/especialistas"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full h-11 px-4 rounded-2xl flex items-center text-xs font-bold uppercase tracking-wider text-black/75 hover:bg-black/5 hover:text-black"
              >
                Especialistas
              </Link>
              <Link
                href="/contact"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full h-11 px-4 rounded-2xl flex items-center text-xs font-bold uppercase tracking-wider text-black/75 hover:bg-black/5 hover:text-black"
              >
                Contacto
              </Link>
              <div className="border-t border-black/10 my-4" />
              <Link
                href="/login/patient"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full h-11 px-4 rounded-2xl flex items-center text-xs font-bold uppercase tracking-wider text-black/75 hover:bg-black/5 hover:text-black"
              >
                Sign In
              </Link>
              <Link
                href="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full h-11 px-4 rounded-2xl flex items-center text-xs font-bold uppercase tracking-wider bg-[#F4C443] text-black hover:bg-[#E5B534]"
              >
                Sign Up
              </Link>
            </nav>
          </div>
        </div>
      )}
    </>
  )
}
