"use client"

import { useState, useTransition } from "react"
import { changePassword } from "../../actions/auth"
import { Lock, ShieldAlert, Loader2 } from "lucide-react"

export default function PatientSettingsPage() {
  const [isPending, startTransition] = useTransition()
  const [message, setMessage] = useState("")
  const [isSuccess, setIsSuccess] = useState(false)

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)

    setMessage("")
    setIsSuccess(false)

    startTransition(async () => {
      const result = await changePassword(formData)
      setMessage(result.message)
      if (result.success) {
        setIsSuccess(true)
        // Reset form
        ;(e.target as HTMLFormElement).reset()
      }
    })
  }

  return (
    <div className="space-y-8 font-sans text-black">
      {/* Encabezado */}
      <div className="space-y-1">
        <h1 className="text-3xl font-serif font-black tracking-tight">Ajustes de Cuenta</h1>
        <p className="text-sm font-medium text-black/60">
          Administra la seguridad y credenciales de tu cuenta.
        </p>
      </div>

      <div className="max-w-xl bg-white/40 border border-white/50 p-8 sm:p-10 rounded-[32px] shadow-sm space-y-6">
        <div>
          <h3 className="text-lg font-serif font-black text-black mb-1 flex items-center gap-2">
            <Lock className="h-4.5 w-4.5 text-[#A2B676]" /> Seguridad y Contraseña
          </h3>
          <p className="text-xs text-black/50 font-medium">
            Es recomendable usar una contraseña única para mantener la confidencialidad de tus datos médicos.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div className="space-y-1.5">
            <label htmlFor="currentPassword" className="text-xs font-bold uppercase tracking-wider text-black/70 pl-1 block">
              Contraseña Actual
            </label>
            <input
              id="currentPassword"
              name="currentPassword"
              type="password"
              required
              placeholder="••••••••"
              className="w-full rounded-xl border border-black/10 bg-white/60 focus:bg-white text-black h-11 px-4 text-sm outline-none focus:ring-2 focus:ring-[#A2B676] transition-all"
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="newPassword" className="text-xs font-bold uppercase tracking-wider text-black/70 pl-1 block">
              Nueva Contraseña
            </label>
            <input
              id="newPassword"
              name="newPassword"
              type="password"
              required
              placeholder="••••••••"
              className="w-full rounded-xl border border-black/10 bg-white/60 focus:bg-white text-black h-11 px-4 text-sm outline-none focus:ring-2 focus:ring-[#A2B676] transition-all"
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="confirmPassword" className="text-xs font-bold uppercase tracking-wider text-black/70 pl-1 block">
              Confirmar Nueva Contraseña
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              required
              placeholder="••••••••"
              className="w-full rounded-xl border border-black/10 bg-white/60 focus:bg-white text-black h-11 px-4 text-sm outline-none focus:ring-2 focus:ring-[#A2B676] transition-all"
            />
          </div>

          <div className="pt-2">
            {message && (
              <p className={`text-xs font-bold text-center mb-4 ${isSuccess ? "text-[#8F9F68]" : "text-red-500"}`}>
                {message}
              </p>
            )}

            <button
              type="submit"
              disabled={isPending}
              className="w-full sm:w-auto px-8 rounded-full bg-black hover:bg-black/80 text-[#FDF6CD] font-bold text-xs uppercase tracking-widest h-11 shadow-sm transition-transform active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Actualizando...
                </>
              ) : (
                "Cambiar Contraseña"
              )}
            </button>
          </div>
        </form>

        <div className="pt-6 border-t border-black/5 flex items-start gap-2 text-[10px] text-black/40 font-medium leading-relaxed">
          <ShieldAlert className="h-4 w-4 text-[#A2B676] shrink-0" />
          <span>
            Si sospechas que alguien ha tenido acceso a tus credenciales, cámbialas inmediatamente o comunícate con soporte de Ébano Health.
          </span>
        </div>
      </div>
    </div>
  )
}
