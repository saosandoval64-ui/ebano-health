"use client"

import Link from "next/link"
import { ArrowLeft, Home } from "lucide-react"

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
      <div className="w-20 h-20 rounded-3xl bg-[#F4C443]/15 flex items-center justify-center mb-6">
        <span className="text-4xl font-serif font-black text-[#F4C443]">?</span>
      </div>

      <h1 className="text-6xl md:text-8xl font-serif font-black text-black/10 mb-2">404</h1>
      <h2 className="text-xl font-serif font-black text-black mb-2">Página no encontrada</h2>
      <p className="text-sm text-black/50 font-medium max-w-md mb-8">
        La página que buscás no existe o fue movida a otra ubicación.
      </p>

      <div className="flex items-center gap-3">
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-black text-[#FDF6CD] rounded-xl font-bold text-xs hover:bg-black/80 transition-all"
        >
          <Home className="w-3.5 h-3.5" />
          Volver al inicio
        </Link>
        <button
          onClick={() => window.history.back()}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-black/5 text-black rounded-xl font-bold text-xs hover:bg-black/10 transition-all"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Volver
        </button>
      </div>
    </div>
  )
}
