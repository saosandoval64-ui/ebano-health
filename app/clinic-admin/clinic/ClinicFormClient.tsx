"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { createClinic, updateClinic } from "../../actions/clinic"
import { Loader2 } from "lucide-react"

interface ClinicData {
  id?: string
  name?: string
  description?: string | null
  phone?: string | null
  email?: string | null
  address?: string | null
  website?: string | null
}

interface ClinicFormClientProps {
  mode: "create" | "edit"
  clinic?: ClinicData
}

export default function ClinicFormClient({ mode, clinic }: ClinicFormClientProps) {
  const [isPending, startTransition] = useTransition()
  const [message, setMessage] = useState("")
  const [isSuccess, setIsSuccess] = useState(false)
  const router = useRouter()

  const [name, setName] = useState(clinic?.name || "")
  const [description, setDescription] = useState(clinic?.description || "")
  const [phone, setPhone] = useState(clinic?.phone || "")
  const [email, setEmail] = useState(clinic?.email || "")
  const [address, setAddress] = useState(clinic?.address || "")
  const [website, setWebsite] = useState(clinic?.website || "")

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    if (mode === "edit" && clinic?.id) {
      formData.append("clinicId", clinic.id)
    }

    setMessage("")
    setIsSuccess(false)

    startTransition(async () => {
      const result = mode === "edit"
        ? await updateClinic(formData)
        : await createClinic(formData)

      setMessage(result.message)
      if (result.success) {
        setIsSuccess(true)
        router.refresh()
      }
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-1">
        <label className="text-[10px] font-bold uppercase tracking-wider text-black/60 pl-1 block">
          Nombre de la Clínica
        </label>
        <input
          name="name"
          type="text"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full rounded-xl border border-black/10 bg-white/60 focus:bg-white text-black h-10 px-3 text-sm outline-none"
        />
      </div>

      <div className="space-y-1">
        <label className="text-[10px] font-bold uppercase tracking-wider text-black/60 pl-1 block">
          Descripción
        </label>
        <textarea
          name="description"
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full rounded-xl border border-black/10 bg-white/60 focus:bg-white text-black p-3 text-sm outline-none resize-none"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-[10px] font-bold uppercase tracking-wider text-black/60 pl-1 block">
            Teléfono
          </label>
          <input
            name="phone"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full rounded-xl border border-black/10 bg-white/60 focus:bg-white text-black h-10 px-3 text-sm outline-none"
          />
        </div>
        <div className="space-y-1">
          <label className="text-[10px] font-bold uppercase tracking-wider text-black/60 pl-1 block">
            Email
          </label>
          <input
            name="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-xl border border-black/10 bg-white/60 focus:bg-white text-black h-10 px-3 text-sm outline-none"
          />
        </div>
      </div>

      <div className="space-y-1">
        <label className="text-[10px] font-bold uppercase tracking-wider text-black/60 pl-1 block">
          Dirección
        </label>
        <input
          name="address"
          type="text"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className="w-full rounded-xl border border-black/10 bg-white/60 focus:bg-white text-black h-10 px-3 text-sm outline-none"
        />
      </div>

      <div className="space-y-1">
        <label className="text-[10px] font-bold uppercase tracking-wider text-black/60 pl-1 block">
          Sitio Web
        </label>
        <input
          name="website"
          type="url"
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
          placeholder="https://..."
          className="w-full rounded-xl border border-black/10 bg-white/60 focus:bg-white text-black h-10 px-3 text-sm outline-none"
        />
      </div>

      <div className="pt-2">
        {message && (
          <p className={`text-xs font-bold text-center mb-3 ${isSuccess ? "text-[#E5B534]" : "text-red-500"}`}>
            {message}
          </p>
        )}

        <button
          type="submit"
          disabled={isPending}
          className="w-full h-11 rounded-full bg-black hover:bg-black/80 text-[#FDF6CD] font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2"
        >
          {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
          {mode === "edit" ? "Guardar Cambios" : "Crear Clínica"}
        </button>
      </div>
    </form>
  )
}
