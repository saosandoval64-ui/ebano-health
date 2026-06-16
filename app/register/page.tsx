"use client"

import { useState } from "react"
import { ArrowLeft, ShieldCheck, User, Stethoscope } from "lucide-react"
import Link from "next/link"

export default function RegisterPage() {
  const [activeTab, setActiveTab] = useState<"patient" | "doctor">("patient")

  return (
    <div className="min-h-screen text-black font-sans antialiased flex flex-col bg-white">
      {/* Yellow Hero Section */}
      <div className="relative bg-[#F4C443] pt-8 pb-20 px-6 rounded-b-[40px]">
        <div className="flex items-center justify-between mb-8">
          <Link
            href="/"
            className="h-10 w-10 rounded-full bg-black/10 flex items-center justify-center text-black hover:bg-black/20 transition-all"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <Link
            href="/login/patient"
            className="text-xs font-bold uppercase tracking-wider text-black/70 hover:text-black transition-colors"
          >
            Sign In
          </Link>
        </div>

        <div className="flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-3xl overflow-hidden shadow-lg mb-4">
            <img src="/avatars/avatar-4.svg" alt="Ébano" className="w-full h-full object-cover" />
          </div>
          <h1 className="text-3xl font-serif font-black text-black tracking-tight mb-1">
            Crear Cuenta
          </h1>
          <p className="text-sm text-black/60 font-medium">
            Selecciona tu tipo de cuenta
          </p>
        </div>
      </div>

      {/* Toggle + Content */}
      <main className="flex-1 -mt-10 px-4 pb-8 relative z-10">
        <div className="w-full max-w-md mx-auto">
          {/* Toggle */}
          <div className="bg-white rounded-2xl shadow-xl p-1.5 flex items-center gap-1.5 mb-6">
            <button
              onClick={() => setActiveTab("patient")}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
                activeTab === "patient"
                  ? "bg-[#F4C443] text-black shadow-md"
                  : "text-black/50 hover:text-black/70"
              }`}
            >
              <User className="w-4 h-4" />
              Paciente
            </button>
            <button
              onClick={() => setActiveTab("doctor")}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
                activeTab === "doctor"
                  ? "bg-[#8B5A2B] text-white shadow-md"
                  : "text-black/50 hover:text-black/70"
              }`}
            >
              <Stethoscope className="w-4 h-4" />
              Médico
            </button>
          </div>

          {/* Content */}
          {activeTab === "patient" ? (
            <Link
              href="/register/patient"
              className="block bg-white p-6 rounded-3xl shadow-xl hover:shadow-2xl transition-all active:scale-[0.98] border border-gray-100"
            >
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-[#F4C443]/15 flex items-center justify-center shrink-0">
                  <User className="w-7 h-7 text-[#F4C443]" />
                </div>
                <div className="flex-1">
                  <h2 className="font-bold text-lg text-black">Soy Paciente</h2>
                  <p className="text-xs text-black/50 mt-0.5">
                    Busca especialistas y agenda citas médicas.
                  </p>
                </div>
              </div>
            </Link>
          ) : (
            <Link
              href="/register/doctor"
              className="block bg-white p-6 rounded-3xl shadow-xl hover:shadow-2xl transition-all active:scale-[0.98] border border-gray-100"
            >
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-[#8B5A2B]/10 flex items-center justify-center shrink-0">
                  <Stethoscope className="w-7 h-7 text-[#8B5A2B]" />
                </div>
                <div className="flex-1">
                  <h2 className="font-bold text-lg text-black">Soy Médico</h2>
                  <p className="text-xs text-black/50 mt-0.5">
                    Crea tu perfil profesional y administra tu agenda.
                  </p>
                </div>
              </div>
            </Link>
          )}

          {/* Already have account */}
          <div className="mt-6 text-center">
            <p className="text-xs text-black/50">
              ¿Ya tienes cuenta?{" "}
              <Link
                href={activeTab === "patient" ? "/login/patient" : "/login/doctor"}
                className="font-bold text-black hover:text-[#F4C443] transition-colors"
              >
                Inicia sesión
              </Link>
            </p>
          </div>
        </div>
      </main>

      <footer className="w-full py-4 text-center">
        <div className="flex items-center justify-center gap-2 text-xs text-black/30 font-medium">
          <ShieldCheck className="w-4 h-4" />
          Datos seguros y encriptados
        </div>
      </footer>
    </div>
  )
}
