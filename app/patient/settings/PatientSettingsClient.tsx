"use client"

import { useState, useTransition } from "react"
import { changePassword } from "../../actions/auth"
import { Lock, ShieldAlert, Loader2, Camera } from "lucide-react"
import { AvatarSelectorModal } from "@/components/AvatarSelectorModal"
import { useAvatarUpdate } from "@/hooks/useAvatarUpdate"
import AvatarDisplay from "@/components/AvatarDisplay"

interface PatientSettingsClientProps {
  initialAvatar?: string
}

export default function PatientSettingsClient({ initialAvatar }: PatientSettingsClientProps) {
  const [isPending, startTransition] = useTransition()
  const [message, setMessage] = useState("")
  const [isSuccess, setIsSuccess] = useState(false)
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false)
  const [avatar, setAvatar] = useState<string | undefined>(initialAvatar)
  const { updateAvatar } = useAvatarUpdate()

  const handleAvatarSelect = async (selectedAvatar: string) => {
    const success = await updateAvatar(selectedAvatar)
    if (success) {
      setAvatar(selectedAvatar)
    }
    setIsAvatarModalOpen(false)
  }

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
        ;(e.target as HTMLFormElement).reset()
      }
    })
  }

  return (
    <div className="max-w-5xl mx-auto px-8 pt-8 pb-8 space-y-8 font-sans text-black">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-3xl font-serif font-black tracking-tight">Ajustes de Cuenta</h1>
        <p className="text-sm font-medium text-black/60">
          Administra tu perfil y seguridad.
        </p>
      </div>

      {/* Avatar Section */}
      <div className="bg-white border border-gray-100 p-6 sm:p-8 rounded-2xl shadow-sm">
        <h3 className="text-sm font-bold uppercase tracking-widest text-black/40 mb-4">Mi Avatar</h3>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsAvatarModalOpen(true)}
            className="relative group shrink-0"
          >
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#F4C443] to-[#F9A825] flex items-center justify-center overflow-hidden border-2 border-white shadow-lg group-hover:shadow-xl transition-shadow">
              <AvatarDisplay avatar={avatar} name="" size="lg" />
            </div>
            <div className="absolute inset-0 bg-black/30 rounded-2xl opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
              <Camera className="w-6 h-6 text-white" />
            </div>
          </button>
          <div className="flex-1">
            <p className="text-sm font-bold text-black">Cambiar avatar</p>
            <p className="text-xs text-black/50 mt-0.5">Elige un avatar predefinido o sube tu propia foto</p>
            <button
              onClick={() => setIsAvatarModalOpen(true)}
              className="mt-2 text-xs font-bold text-[#F4C443] hover:text-[#E5B534] transition-colors"
            >
              Seleccionar avatar →
            </button>
          </div>
        </div>
      </div>

      {/* Password Section */}
      <div className="bg-white border border-gray-100 p-6 sm:p-8 rounded-2xl shadow-sm space-y-5">
        <div>
          <h3 className="text-sm font-bold uppercase tracking-widest text-black/40 mb-1 flex items-center gap-2">
            <Lock className="w-4 h-4 text-[#F4C443]" /> Seguridad y Contraseña
          </h3>
          <p className="text-xs text-black/50 font-medium">
            Es recomendable usar una contraseña única para mantener la confidencialidad de tus datos médicos.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label htmlFor="currentPassword" className="text-[10px] font-bold uppercase tracking-wider text-black/50 block">
              Contraseña Actual
            </label>
            <input
              id="currentPassword"
              name="currentPassword"
              type="password"
              required
              placeholder="••••••••"
              className="w-full rounded-xl border border-gray-200 bg-gray-50 focus:bg-white text-black h-11 px-4 text-sm outline-none focus:ring-2 focus:ring-[#F4C443] transition-all"
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="newPassword" className="text-[10px] font-bold uppercase tracking-wider text-black/50 block">
              Nueva Contraseña
            </label>
            <input
              id="newPassword"
              name="newPassword"
              type="password"
              required
              placeholder="••••••••"
              className="w-full rounded-xl border border-gray-200 bg-gray-50 focus:bg-white text-black h-11 px-4 text-sm outline-none focus:ring-2 focus:ring-[#F4C443] transition-all"
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="confirmPassword" className="text-[10px] font-bold uppercase tracking-wider text-black/50 block">
              Confirmar Nueva Contraseña
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              required
              placeholder="••••••••"
              className="w-full rounded-xl border border-gray-200 bg-gray-50 focus:bg-white text-black h-11 px-4 text-sm outline-none focus:ring-2 focus:ring-[#F4C443] transition-all"
            />
          </div>

          <div className="pt-1">
            {message && (
              <p className={`text-xs font-bold text-center mb-3 ${isSuccess ? "text-green-600" : "text-red-500"}`}>
                {message}
              </p>
            )}

            <button
              type="submit"
              disabled={isPending}
              className="w-full px-8 rounded-full bg-black hover:bg-black/80 text-[#FDF6CD] font-bold text-xs uppercase tracking-widest h-11 shadow-sm transition-all active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-50"
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

        <div className="pt-4 border-t border-black/5 flex items-start gap-2 text-[10px] text-black/40 font-medium leading-relaxed">
          <ShieldAlert className="h-4 w-4 text-[#F4C443] shrink-0" />
          <span>
            Si sospechas que alguien ha tenido acceso a tus credenciales, cámbialas inmediatamente o comunícate con soporte.
          </span>
        </div>
      </div>

      <AvatarSelectorModal
        isOpen={isAvatarModalOpen}
        onClose={() => setIsAvatarModalOpen(false)}
        onSelect={handleAvatarSelect}
        currentAvatar={avatar}
      />
    </div>
  )
}
