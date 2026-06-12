"use client"

import { useState } from "react"
import { Menu, X } from "lucide-react"
import Link from "next/link"

export function MobileMenuClient() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <>
      <button
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        className="md:hidden h-10 w-10 rounded-full bg-black text-[#FDF6CD] flex items-center justify-center shadow-lg border border-black/10 hover:scale-105 active:scale-95 link-transition"
        aria-label="Abrir menú"
      >
        {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-black/40 backdrop-blur-sm tab-transition animate-fadeIn">
          <div className="fixed top-0 right-0 h-full w-[280px] bg-[#FDF6CD] shadow-2xl border-l border-black/10 p-6 animate-slideInRight">
            <div className="flex justify-end mb-8">
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="h-9 w-9 rounded-full bg-black/5 hover:bg-black/10 flex items-center justify-center text-black/70 hover:text-black border border-black/5 link-transition"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <nav className="flex flex-col gap-3">
              <Link
                href="/"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full h-11 px-4 rounded-2xl flex items-center text-xs font-bold uppercase tracking-wider text-black/75 hover:bg-black/5 hover:text-black link-transition"
              >
                Home
              </Link>
              <Link
                href="/especialistas"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full h-11 px-4 rounded-2xl flex items-center text-xs font-bold uppercase tracking-wider text-black/75 hover:bg-black/5 hover:text-black link-transition"
              >
                Especialistas
              </Link>
              <Link
                href="/contact"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full h-11 px-4 rounded-2xl flex items-center text-xs font-bold uppercase tracking-wider text-black/75 hover:bg-black/5 hover:text-black link-transition"
              >
                Contacto
              </Link>
              <div className="border-t border-black/10 my-4" />
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full h-11 px-4 rounded-2xl flex items-center text-xs font-bold uppercase tracking-wider text-black/75 hover:bg-black/5 hover:text-black link-transition"
              >
                Sign In
              </Link>
              <Link
                href="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full h-11 px-4 rounded-2xl flex items-center text-xs font-bold uppercase tracking-wider bg-[#F4C443] text-black hover:bg-[#E5B534] link-transition"
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