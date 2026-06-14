"use client"

import { useState, useTransition, useRef } from "react"
import { registerDoctor } from "../../actions/register"
import { X, Loader2 } from "lucide-react"
import Link from "next/link"
import Logo from "@/components/Logo"

export default function DoctorRegisterPage() {
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
      const result = await registerDoctor(formData)
      if (result.success) {
        setSuccessMessage(result.message)
        formRef.current?.reset()
        // Auto-redirect to dashboard con replace para evitar back-button
        window.location.replace(result.redirectTo || "/doctor/dashboard")
      } else {
        setMessage(result.message)
      }
    })
  }

  return (
    <div className="min-h-screen text-black font-sans antialiased flex flex-col justify-between selection:bg-[#E2CE7D] animate-fadeInScale">
      {/* Close Button */}
      <div className="w-full max-w-7xl mx-auto px-6 pt-6 flex items-center justify-end z-10 animate-slideInDown">
        <Link
          href="/register"
          className="h-9 w-9 rounded-full bg-black/5 hover:bg-black/10 flex items-center justify-center text-black/70 hover:text-black border border-black/5 link-transition button-click"
        >
          <X className="h-4 w-4" />
        </Link>
      </div>

      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-[440px] bg-black/5 p-8 sm:p-10 rounded-[32px] border border-black/10 shadow-sm flex flex-col justify-between backdrop-blur-sm animate-slideInUp">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-2">
              <Logo size="md" />
            </div>
            <div className="inline-flex items-center gap-1.5 bg-black/5 rounded-full px-3 py-1 text-[10px] uppercase font-bold tracking-wider text-black/60 mb-4">
              🩺 Portal Médico
            </div>
            <h1 className="text-2xl font-serif font-black tracking-tight text-black">Registra tu práctica</h1>
          </div>

          <form onSubmit={handleSubmit} ref={formRef} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-black/70 pl-1 block">
                  Nombre
                </label>
                <input
                  name="nombre"
                  type="text"
                  required
                  placeholder="Dr. Juan"
                  className="w-full rounded-xl border border-black/10 bg-white/50 focus:bg-white h-11 px-4 text-sm outline-none focus:ring-2 focus:ring-[#A2B676] tab-transition"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-black/70 pl-1 block">
                  Apellido
                </label>
                <input
                  name="apellido"
                  type="text"
                  required
                  placeholder="Pérez"
                  className="w-full rounded-xl border border-black/10 bg-white/50 focus:bg-white h-11 px-4 text-sm outline-none focus:ring-2 focus:ring-[#A2B676] tab-transition"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-black/70 pl-1 block">
                Correo Electrónico
              </label>
              <input
                name="email"
                type="email"
                required
                placeholder="dr.juan@ebano.com"
                className="w-full rounded-xl border border-black/10 bg-white/50 focus:bg-white h-11 px-4 text-sm outline-none focus:ring-2 focus:ring-[#A2B676] tab-transition"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-black/70 pl-1 block">
                Contraseña
              </label>
              <input
                name="password"
                type="password"
                required
                placeholder="••••••••"
                className="w-full rounded-xl border border-black/10 bg-white/50 focus:bg-white h-11 px-4 text-sm outline-none focus:ring-2 focus:ring-[#A2B676] tab-transition"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-black/70 pl-1 block">
                  Matrícula
                </label>
                <input
                  name="matricula"
                  type="text"
                  required
                  placeholder="MP 123456"
                  className="w-full rounded-xl border border-black/10 bg-white/50 focus:bg-white h-11 px-4 text-sm outline-none focus:ring-2 focus:ring-[#A2B676] tab-transition"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-black/70 pl-1 block">
                  Especialidad
                </label>
                <select
                  name="especialidad"
                  required
                  className="w-full rounded-xl border border-black/10 bg-white/50 focus:bg-white h-11 px-4 text-sm outline-none focus:ring-2 focus:ring-[#A2B676] tab-transition"
                >
                  <option value="">Seleccionar...</option>
                  <option value="Cardiólogo">Cardiólogo</option>
                  <option value="Dermatólogo">Dermatólogo</option>
                  <option value="Endocrinólogo">Endocrinólogo</option>
                  <option value="Gastroenterólogo">Gastroenterólogo</option>
                  <option value="Neurólogo">Neurólogo</option>
                  <option value="Oftalmólogo">Oftalmólogo</option>
                  <option value="Otorrinolaringólogo">Otorrinolaringólogo</option>
                  <option value="Psiquiatra">Psiquiatra</option>
                  <option value="Traumatólogo">Traumatólogo</option>
                  <option value="Urólogo">Urólogo</option>
                  <option value="Médico General">Médico General</option>
                  <option value="Pediatra">Pediatra</option>
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-black/70 pl-1 block">
                Teléfono
              </label>
              <input
                name="telefono"
                type="tel"
                required
                placeholder="+54 9 11 1234"
                className="w-full rounded-xl border border-black/10 bg-white/50 focus:bg-white h-11 px-4 text-sm outline-none focus:ring-2 focus:ring-[#A2B676] tab-transition"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-black/70 pl-1 block">
                Consultorio/Clínica
              </label>
              <input
                name="consultorio"
                type="text"
                placeholder="Clínica San Juan"
                className="w-full rounded-xl border border-black/10 bg-white/50 focus:bg-white h-11 px-4 text-sm outline-none focus:ring-2 focus:ring-[#A2B676] tab-transition"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-black/70 pl-1 block">
                Dirección
              </label>
              <input
                name="direccion"
                type="text"
                placeholder="Av. Principal 123"
                className="w-full rounded-xl border border-black/10 bg-white/50 focus:bg-white h-11 px-4 text-sm outline-none focus:ring-2 focus:ring-[#A2B676] tab-transition"
              />
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="w-full rounded-full bg-black hover:bg-black/80 text-[#FDF6CD] font-bold text-xs tracking-wider uppercase h-11 mt-4 disabled:opacity-60 flex items-center justify-center gap-2 link-transition button-click"
            >
              {isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Registrando...
                </>
              ) : (
                "Registrar Práctica"
              )}
            </button>

            {message && (
              <p className="text-red-500 text-xs font-bold text-center bg-red-50 border border-red-100 p-3 rounded-xl animate-slideInDown">
                {message}
              </p>
            )}

            {successMessage && (
              <p className="text-green-600 text-xs font-bold text-center bg-green-50 border border-green-100 p-3 rounded-xl animate-slideInDown">
                ✓ {successMessage} Redirigiendo...
              </p>
            )}
          </form>

          <div className="mt-8 pt-6 border-t border-black/5 text-center">
            <p className="text-xs font-medium text-black/50">
              ¿Ya tienes cuenta?{" "}
              <Link href="/login/doctor" className="font-bold underline decoration-[#A2B676] link-transition hover:text-black">
                Inicia sesión
              </Link>
            </p>
          </div>
        </div>
      </main>

      <footer className="w-full py-4 text-center text-[11px] text-black/30 font-medium flex items-center justify-center gap-1.5">
        <span>🔒</span> Encriptación de datos de salud
      </footer>
    </div>
  )
}