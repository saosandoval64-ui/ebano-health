"use client"

import { useState, useTransition, useRef } from "react"
import { registerPatient } from "../../actions/register"
import { ArrowLeft, Loader2, User, ShieldCheck } from "lucide-react"
import Link from "next/link"

export default function PatientRegisterPage() {
  const [isPending, startTransition] = useTransition()
  const [message, setMessage] = useState("")
  const [successMessage, setSuccessMessage] = useState("")
  const formRef = useRef<HTMLFormElement>(null)

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    
    setMessage("")
    setSuccessMessage("")
    startTransition(async () => {
      const result = await registerPatient(formData)
      if (result.success) {
        setSuccessMessage(result.message)
        formRef.current?.reset()
        window.location.replace(result.redirectTo || "/patient/dashboard")
      } else {
        setMessage(result.message)
      }
    })
  }

  return (
    <div className="min-h-screen text-black font-sans antialiased flex flex-col bg-[#FDF6CD]">
      {/* Yellow Hero Section */}
      <div className="relative bg-[#F4C443] pt-8 pb-16 px-6 rounded-b-[40px]">
        <div className="flex items-center justify-between mb-6">
          <Link
            href="/register"
            className="h-10 w-10 rounded-full bg-black/10 flex items-center justify-center text-black hover:bg-black/20 transition-all"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
        </div>

        <div className="flex flex-col items-center text-center">
          <div className="w-14 h-14 rounded-2xl bg-black/10 flex items-center justify-center mb-3">
            <User className="w-7 h-7 text-black" />
          </div>
          <h1 className="text-2xl font-serif font-black text-black tracking-tight mb-1">
            Registro de Paciente
          </h1>
          <p className="text-sm text-black/60 font-medium">
            Portal del Paciente Ébano Health
          </p>
        </div>
      </div>

      {/* Form Card */}
      <main className="flex-1 -mt-8 px-4 pb-8 relative z-10">
        <div className="w-full max-w-md mx-auto">
          <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-xl">
            <form onSubmit={handleSubmit} ref={formRef} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-black/50 block">
                    Nombre
                  </label>
                  <input
                    name="nombre"
                    type="text"
                    required
                    placeholder="Juan"
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 focus:bg-white h-11 px-4 text-sm outline-none focus:ring-2 focus:ring-[#F4C443] transition-all"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-black/50 block">
                    Apellido
                  </label>
                  <input
                    name="apellido"
                    type="text"
                    required
                    placeholder="Pérez"
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 focus:bg-white h-11 px-4 text-sm outline-none focus:ring-2 focus:ring-[#F4C443] transition-all"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-black/50 block">
                  Correo Electrónico
                </label>
                <input
                  name="email"
                  type="email"
                  required
                  placeholder="tu@email.com"
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 focus:bg-white h-11 px-4 text-sm outline-none focus:ring-2 focus:ring-[#F4C443] transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-black/50 block">
                  Contraseña
                </label>
                <input
                  name="password"
                  type="password"
                  required
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 focus:bg-white h-11 px-4 text-sm outline-none focus:ring-2 focus:ring-[#F4C443] transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-black/50 block">
                    DNI
                  </label>
                  <input
                    name="dni"
                    type="text"
                    placeholder="12345678"
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 focus:bg-white h-11 px-4 text-sm outline-none focus:ring-2 focus:ring-[#F4C443] transition-all"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-black/50 block">
                    Teléfono
                  </label>
                  <input
                    name="telefono"
                    type="tel"
                    placeholder="+54 9 11 1234"
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 focus:bg-white h-11 px-4 text-sm outline-none focus:ring-2 focus:ring-[#F4C443] transition-all"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-black/50 block">
                  Fecha de Nacimiento
                </label>
                <input
                  name="fechaNacimiento"
                  type="date"
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 focus:bg-white h-11 px-4 text-sm outline-none focus:ring-2 focus:ring-[#F4C443] transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-black/50 block">
                  Obra Social (Opcional)
                </label>
                <input
                  name="obraSocial"
                  type="text"
                  placeholder="OSDE, Swiss Medical, etc"
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 focus:bg-white h-11 px-4 text-sm outline-none focus:ring-2 focus:ring-[#F4C443] transition-all"
                />
              </div>

              <button
                type="submit"
                disabled={isPending}
                className="w-full rounded-full bg-black hover:bg-black/80 text-[#FDF6CD] font-bold text-xs tracking-wider uppercase h-11 mt-2 disabled:opacity-60 flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
              >
                {isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Registrando...
                  </>
                ) : (
                  "Crear Cuenta"
                )}
              </button>

              {message && (
                <p className="text-red-500 text-xs font-bold text-center bg-red-50 border border-red-100 p-3 rounded-xl">
                  {message}
                </p>
              )}

              {successMessage && (
                <p className="text-green-600 text-xs font-bold text-center bg-green-50 border border-green-100 p-3 rounded-xl">
                  ✓ {successMessage} Redirigiendo...
                </p>
              )}
            </form>

            <div className="mt-6 pt-4 border-t border-gray-100 text-center">
              <p className="text-xs text-black/50">
                ¿Ya tienes cuenta?{" "}
                <Link href="/login/patient" className="font-bold text-black hover:text-[#F4C443] transition-colors">
                  Inicia sesión
                </Link>
              </p>
            </div>
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
