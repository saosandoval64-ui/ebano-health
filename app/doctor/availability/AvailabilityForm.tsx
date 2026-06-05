"use client"

import { useState, useTransition } from "react"
import { updateDoctorSelfProfile } from "../../actions/appointments"
import { ShieldCheck, Loader2, Clock } from "lucide-react"

interface AvailabilityFormProps {
  initialData: {
    name: string
    lastName: string | null
    phone: string | null
    specialty: string
    license: string
    bio: string | null
  }
}

export default function AvailabilityForm({ initialData }: AvailabilityFormProps) {
  const [isPending, startTransition] = useTransition()
  const [message, setMessage] = useState("")
  const [isSuccess, setIsSuccess] = useState(false)

  // Configuración de disponibilidad visual de ejemplo (días laborables de un médico)
  const [activeDays, setActiveDays] = useState(["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"])
  const daysOfWeek = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"]

  const toggleDay = (day: string) => {
    if (day === "Sábado" || day === "Domingo") return // Mantener cerrado los fines de semana en el MVP
    if (activeDays.includes(day)) {
      setActiveDays(activeDays.filter((d) => d !== day))
    } else {
      setActiveDays([...activeDays, day])
    }
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)

    setMessage("")
    setIsSuccess(false)

    startTransition(async () => {
      const result = await updateDoctorSelfProfile(formData)
      setMessage(result.message)
      if (result.success) {
        setIsSuccess(true)
      }
    })
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Columna Izquierda: Datos Profesionales (2/3 de la pantalla) */}
      <div className="lg:col-span-2 space-y-6">
        <form onSubmit={handleSubmit} className="space-y-6 bg-white/40 border border-white/50 p-8 rounded-[32px] shadow-sm">
          <h3 className="text-lg font-serif font-black text-black mb-4">Datos del Profesional</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label htmlFor="name" className="text-xs font-bold uppercase tracking-wider text-black/70 pl-1 block">
                Nombre
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                defaultValue={initialData.name}
                className="w-full rounded-xl border border-black/10 bg-white/60 focus:bg-white text-black h-11 px-4 text-sm outline-none focus:ring-2 focus:ring-[#A2B676] transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="lastName" className="text-xs font-bold uppercase tracking-wider text-black/70 pl-1 block">
                Apellido
              </label>
              <input
                id="lastName"
                name="lastName"
                type="text"
                required
                defaultValue={initialData.lastName || ""}
                className="w-full rounded-xl border border-black/10 bg-white/60 focus:bg-white text-black h-11 px-4 text-sm outline-none focus:ring-2 focus:ring-[#A2B676] transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label htmlFor="specialty" className="text-xs font-bold uppercase tracking-wider text-black/70 pl-1 block">
                Especialidad
              </label>
              <input
                id="specialty"
                name="specialty"
                type="text"
                required
                defaultValue={initialData.specialty}
                className="w-full rounded-xl border border-black/10 bg-white/60 focus:bg-white text-black h-11 px-4 text-sm outline-none focus:ring-2 focus:ring-[#A2B676] transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="license" className="text-xs font-bold uppercase tracking-wider text-black/70 pl-1 block">
                Matrícula Profesional
              </label>
              <input
                id="license"
                name="license"
                type="text"
                required
                defaultValue={initialData.license}
                className="w-full rounded-xl border border-black/10 bg-white/60 focus:bg-white text-black h-11 px-4 text-sm outline-none focus:ring-2 focus:ring-[#A2B676] transition-all"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="phone" className="text-xs font-bold uppercase tracking-wider text-black/70 pl-1 block">
              Teléfono de Contacto
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              defaultValue={initialData.phone || ""}
              className="w-full rounded-xl border border-black/10 bg-white/60 focus:bg-white text-black h-11 px-4 text-sm outline-none focus:ring-2 focus:ring-[#A2B676] transition-all"
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="bio" className="text-xs font-bold uppercase tracking-wider text-black/70 pl-1 block">
              Biografía / Presentación
            </label>
            <textarea
              id="bio"
              name="bio"
              rows={4}
              defaultValue={initialData.bio || ""}
              className="w-full rounded-xl border border-black/10 bg-white/60 focus:bg-white text-black p-4 text-sm outline-none focus:ring-2 focus:ring-[#A2B676] transition-all resize-none"
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
              className="w-full sm:w-auto px-8 rounded-full bg-black hover:bg-black/80 text-[#FDF6CD] font-bold text-xs uppercase tracking-widest h-11 shadow-sm transition-transform active:scale-[0.98] flex items-center justify-center gap-2"
            >
              {isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Guardando...
                </>
              ) : (
                "Guardar Perfil"
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Columna Derecha: Configuración de Disponibilidad (1/3 de la pantalla) */}
      <div className="space-y-6">
        <div className="bg-black text-[#FDF6CD] p-8 rounded-[32px] shadow-2xl space-y-6">
          <h3 className="text-lg font-serif font-black text-[#FDF6CD] flex items-center gap-2">
            <Clock className="h-5 w-5 text-[#A2B676]" /> Disponibilidad Horaria
          </h3>

          <div className="space-y-4">
            <div>
              <p className="text-[10px] uppercase font-bold tracking-widest text-[#FDF6CD]/60 mb-2">Rango de Trabajo</p>
              <div className="bg-[#FDF6CD]/5 border border-[#FDF6CD]/10 p-4 rounded-2xl flex items-center justify-between text-xs font-bold uppercase tracking-wider">
                <span>Lunes a Viernes</span>
                <span className="text-[#A2B676]">09:00 - 17:00 hs</span>
              </div>
            </div>

            <div>
              <p className="text-[10px] uppercase font-bold tracking-widest text-[#FDF6CD]/60 mb-2">Días de Atención</p>
              <div className="flex flex-col gap-2">
                {daysOfWeek.map((day) => {
                  const isActive = activeDays.includes(day)
                  const isWeekend = day === "Sábado" || day === "Domingo"

                  return (
                    <button
                      key={day}
                      onClick={() => toggleDay(day)}
                      disabled={isWeekend}
                      className={`h-10 px-4 rounded-xl text-[10px] font-bold uppercase tracking-widest text-left flex items-center justify-between transition-all border outline-none ${
                        isWeekend
                          ? "bg-white/5 border-transparent text-[#FDF6CD]/20 cursor-not-allowed"
                          : isActive
                          ? "bg-[#A2B676] border-[#A2B676] text-black font-black"
                          : "bg-transparent border-white/10 text-[#FDF6CD] hover:border-white/30"
                      }`}
                    >
                      <span>{day}</span>
                      <span>{isWeekend ? "Cerrado" : isActive ? "Activo" : "Inactivo"}</span>
                    </button>
                  )
                })}
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-[#FDF6CD]/10 flex items-start gap-2 text-[10px] text-[#FDF6CD]/40 leading-relaxed font-medium">
            <ShieldCheck className="h-4 w-4 text-[#A2B676] shrink-0" />
            <span>
              Los pacientes solo podrán agendar citas en los días marcados como activos y en intervalos de 30 minutos.
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
