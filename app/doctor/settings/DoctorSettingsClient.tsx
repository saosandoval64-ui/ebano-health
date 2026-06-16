"use client"

import { useState, useTransition } from "react"
import { changePassword } from "../../actions/auth"
import { Loader2, Camera } from "lucide-react"
import { AvatarSelectorModal } from "@/components/AvatarSelectorModal"
import { useAvatarUpdate } from "@/hooks/useAvatarUpdate"
import AvatarDisplay from "@/components/AvatarDisplay"

interface DoctorSettingsClientProps {
  initialAvatar?: string
}

export default function DoctorSettingsClient({ initialAvatar }: DoctorSettingsClientProps) {
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
    <div className="space-y-8">
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-100 shadow-sm">
        <h2 className="text-lg font-serif font-black mb-4">Mi Avatar</h2>
        <div className="flex items-center gap-6">
          <div className="relative group">
            <div className="w-24 h-24 rounded-3xl overflow-hidden border-2 border-gray-100 shadow-sm">
              <AvatarDisplay avatar={avatar} name="Doctor" size="lg" />
            </div>
            <button
              onClick={() => setIsAvatarModalOpen(true)}
              className="absolute inset-0 rounded-3xl bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"
            >
              <Camera className="w-6 h-6 text-white" />
            </button>
          </div>
          <div>
            <p className="text-sm font-bold mb-1">Cambiar avatar</p>
            <p className="text-xs text-black/50">Haz clic en tu foto para elegir un nuevo avatar</p>
            <button
              onClick={() => setIsAvatarModalOpen(true)}
              className="mt-2 text-xs font-bold text-[#F4C443] hover:text-[#E5B534] transition-colors"
            >
              Seleccionar avatar
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-100 shadow-sm">
        <h2 className="text-lg font-serif font-black mb-4">Cambiar Contraseña</h2>
        <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-wider text-black/50 block">Contraseña Actual</label>
            <input name="currentPassword" type="password" required className="w-full rounded-xl border border-gray-200 bg-gray-50 focus:bg-white h-11 px-4 text-sm outline-none focus:ring-2 focus:ring-[#F4C443] transition-all" />
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-wider text-black/50 block">Nueva Contraseña</label>
            <input name="newPassword" type="password" required minLength={6} className="w-full rounded-xl border border-gray-200 bg-gray-50 focus:bg-white h-11 px-4 text-sm outline-none focus:ring-2 focus:ring-[#F4C443] transition-all" />
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-wider text-black/50 block">Confirmar Contraseña</label>
            <input name="confirmPassword" type="password" required minLength={6} className="w-full rounded-xl border border-gray-200 bg-gray-50 focus:bg-white h-11 px-4 text-sm outline-none focus:ring-2 focus:ring-[#F4C443] transition-all" />
          </div>
          <button type="submit" disabled={isPending} className="w-full rounded-full bg-black hover:bg-black/80 text-[#FDF6CD] font-bold text-xs tracking-wider uppercase h-11 disabled:opacity-60 flex items-center justify-center gap-2 transition-all active:scale-[0.98]">
            {isPending ? (<><Loader2 className="h-4 w-4 animate-spin" /> Guardando...</>) : "Cambiar Contraseña"}
          </button>
          {message && (
            <p className={`text-xs font-bold text-center p-3 rounded-xl ${isSuccess ? "text-green-600 bg-green-50 border border-green-100" : "text-red-500 bg-red-50 border border-red-100"}`}>
              {message}
            </p>
          )}
        </form>
      </div>

      <AvatarSelectorModal
        isOpen={isAvatarModalOpen}
        onClose={() => setIsAvatarModalOpen(false)}
        onSelect={handleAvatarSelect}
      />
    </div>
  )
}
