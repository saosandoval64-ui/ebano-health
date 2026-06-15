"use client"

import { useState, useTransition } from "react"
import { updatePatientProfile } from "../../actions/auth"
import { ShieldCheck, Loader2 } from "lucide-react"

interface ProfileFormProps {
  initialData: {
    name: string
    lastName: string | null
    email: string
    dni: string | null
    phone: string | null
    insurance: string | null
    birthDate: Date | null
  }
}

export default function ProfileForm({ initialData }: ProfileFormProps) {
  const [isPending, startTransition] = useTransition()
  const [message, setMessage] = useState("")
  const [isSuccess, setIsSuccess] = useState(false)

  // Formatear fecha para el input date (AAAA-MM-DD)
  const formatDate = (date: Date | null) => {
    if (!date) return ""
    const d = new Date(date)
    const year = d.getFullYear()
    const month = String(d.getMonth() + 1).padStart(2, "0")
    const day = String(d.getDate()).padStart(2, "0")
    return `${year}-${month}-${day}`
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)

    setMessage("")
    setIsSuccess(false)

    startTransition(async () => {
      const result = await updatePatientProfile(formData)
      setMessage(result.message)
      if (result.success) {
        setIsSuccess(true)
      }
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-xl bg-white/40 border border-white/50 p-8 sm:p-10 rounded-[32px] shadow-sm">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label htmlFor="nombre" className="text-xs font-bold uppercase tracking-wider text-black/70 pl-1 block">
            Nombre
          </label>
          <input
            id="nombre"
            name="nombre"
            type="text"
            required
            defaultValue={initialData.name}
            className="w-full rounded-xl border border-black/10 bg-white/60 focus:bg-white text-black h-11 px-4 text-sm outline-none focus:ring-2 focus:ring-[#F4C443] transition-all"
          />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="apellido" className="text-xs font-bold uppercase tracking-wider text-black/70 pl-1 block">
            Apellido
          </label>
          <input
            id="apellido"
            name="apellido"
            type="text"
            required
            defaultValue={initialData.lastName || ""}
            className="w-full rounded-xl border border-black/10 bg-white/60 focus:bg-white text-black h-11 px-4 text-sm outline-none focus:ring-2 focus:ring-[#F4C443] transition-all"
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <label htmlFor="email" className="text-xs font-bold uppercase tracking-wider text-black/40 pl-1 block">
          Correo Electrónico (No modificable)
        </label>
        <input
          id="email"
          type="email"
          disabled
          defaultValue={initialData.email}
          className="w-full rounded-xl border border-black/5 bg-black/5 text-black/40 h-11 px-4 text-sm outline-none cursor-not-allowed"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label htmlFor="dni" className="text-xs font-bold uppercase tracking-wider text-black/70 pl-1 block">
            DNI
          </label>
          <input
            id="dni"
            name="dni"
            type="text"
            defaultValue={initialData.dni || ""}
            className="w-full rounded-xl border border-black/10 bg-white/60 focus:bg-white text-black h-11 px-4 text-sm outline-none focus:ring-2 focus:ring-[#F4C443] transition-all"
          />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="telefono" className="text-xs font-bold uppercase tracking-wider text-black/70 pl-1 block">
            Teléfono
          </label>
          <input
            id="telefono"
            name="telefono"
            type="tel"
            defaultValue={initialData.phone || ""}
            className="w-full rounded-xl border border-black/10 bg-white/60 focus:bg-white text-black h-11 px-4 text-sm outline-none focus:ring-2 focus:ring-[#F4C443] transition-all"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label htmlFor="fechaNacimiento" className="text-xs font-bold uppercase tracking-wider text-black/70 pl-1 block">
            Fecha de Nacimiento
          </label>
          <input
            id="fechaNacimiento"
            name="fechaNacimiento"
            type="date"
            defaultValue={formatDate(initialData.birthDate)}
            className="w-full rounded-xl border border-black/10 bg-white/60 focus:bg-white text-black h-11 px-4 text-sm outline-none focus:ring-2 focus:ring-[#F4C443] transition-all"
          />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="obraSocial" className="text-xs font-bold uppercase tracking-wider text-black/70 pl-1 block">
            Obra Social / Prepaga
          </label>
          <input
            id="obraSocial"
            name="obraSocial"
            type="text"
            defaultValue={initialData.insurance || ""}
            className="w-full rounded-xl border border-black/10 bg-white/60 focus:bg-white text-black h-11 px-4 text-sm outline-none focus:ring-2 focus:ring-[#F4C443] transition-all"
          />
        </div>
      </div>

      <div className="pt-2">
        {message && (
          <p className={`text-xs font-bold text-center mb-4 ${isSuccess ? "text-[#E5B534]" : "text-red-500"}`}>
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
              <Loader2 className="h-4 w-4 animate-spin" /> Guardando...
            </>
          ) : (
            "Guardar Cambios"
          )}
        </button>
      </div>

      <div className="pt-6 border-t border-black/5 flex items-center gap-1.5 text-[10px] text-black/30 font-medium">
        <ShieldCheck className="h-3.5 w-3.5" /> Tus datos están encriptados y protegidos bajo la ley de confidencialidad médica.
      </div>
    </form>
  )
}
