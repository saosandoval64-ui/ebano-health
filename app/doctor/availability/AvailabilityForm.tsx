"use client"

import { useState, useTransition, useEffect, useCallback } from "react"
import { updateDoctorSelfProfile, saveDoctorAvailability, getDoctorAvailability } from "../../actions/appointments"
import { ShieldCheck, Loader2, Clock, Save, Sun, Moon, Cloud } from "lucide-react"

interface AvailabilityFormProps {
  initialData: {
    name: string
    lastName: string | null
    phone: string | null
    specialty: string
    license: string
    bio: string | null
  }
  doctorProfileId: string
}

const DAY_LABELS = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"]

interface DayConfig {
  dayOfWeek: number
  startTime: string
  endTime: string
  isActive: boolean
}

function generateTimeSlots(): string[] {
  const slots: string[] = []
  for (let h = 0; h < 24; h++) {
    slots.push(`${String(h).padStart(2, "0")}:00`)
    slots.push(`${String(h).padStart(2, "0")}:30`)
  }
  return slots
}

const TIME_SLOTS = generateTimeSlots()

export default function AvailabilityForm({ initialData, doctorProfileId }: AvailabilityFormProps) {
  const [isPending, startTransition] = useTransition()
  const [savingAvail, setSavingAvail] = useState(false)
  const [message, setMessage] = useState("")
  const [availMessage, setAvailMessage] = useState("")
  const [isSuccess, setIsSuccess] = useState(false)

  const [days, setDays] = useState<DayConfig[]>(
    Array.from({ length: 7 }, (_, i) => ({
      dayOfWeek: i,
      startTime: "09:00",
      endTime: "17:00",
      isActive: i < 5,
    }))
  )

  useEffect(() => {
    async function load() {
      const data = await getDoctorAvailability(doctorProfileId)
      if (data.length > 0) {
        setDays(
          Array.from({ length: 7 }, (_, i) => {
            const existing = data.find((d) => d.dayOfWeek === i)
            return existing || { dayOfWeek: i, startTime: "09:00", endTime: "17:00", isActive: false }
          })
        )
      }
    }
    load()
  }, [doctorProfileId])

  const updateDay = useCallback((index: number, field: keyof DayConfig, value: string | boolean) => {
    setDays((prev) => prev.map((d, i) => (i === index ? { ...d, [field]: value } : d)))
  }, [])

  const toggleDay = useCallback((index: number) => {
    setDays((prev) => prev.map((d, i) => (i === index ? { ...d, isActive: !d.isActive } : d)))
  }, [])

  const handleSaveProfile = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    setMessage("")
    setIsSuccess(false)
    startTransition(async () => {
      const result = await updateDoctorSelfProfile(formData)
      setMessage(result.message)
      if (result.success) setIsSuccess(true)
    })
  }

  const handleSaveAvailability = () => {
    setAvailMessage("")
    setSavingAvail(true)
    const formData = new FormData()
    formData.append("days", JSON.stringify(days))
    startTransition(async () => {
      const result = await saveDoctorAvailability(formData)
      setAvailMessage(result.message)
      setSavingAvail(false)
    })
  }

  const activeDaysCount = days.filter((d) => d.isActive).length
  const weeklyRange = activeDaysCount > 0
    ? `${days.find((d) => d.isActive)?.startTime || "09:00"} - ${days.find((d) => d.isActive)?.endTime || "17:00"}`
    : "Sin días activos"

  return (
    <div className="space-y-8">
      {/* Perfil del Profesional */}
      <form onSubmit={handleSaveProfile} className="bg-white/40 border border-white/50 p-8 rounded-[32px] shadow-sm space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-serif font-black text-black">Datos del Profesional</h3>
          <button type="submit" disabled={isPending}
            className="px-6 rounded-full bg-black hover:bg-black/80 text-[#FDF6CD] font-bold text-xs uppercase tracking-widest h-10 shadow-sm transition-transform active:scale-[0.98] flex items-center justify-center gap-2">
            {isPending ? <><Loader2 className="h-4 w-4 animate-spin" /> Guardando...</> : "Guardar Perfil"}
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-black/70 pl-1 block">Nombre</label>
            <input name="name" type="text" required defaultValue={initialData.name}
              className="w-full rounded-xl border border-black/10 bg-white/60 focus:bg-white text-black h-11 px-4 text-sm outline-none focus:ring-2 focus:ring-[#A2B676] transition-all" />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-black/70 pl-1 block">Apellido</label>
            <input name="lastName" type="text" required defaultValue={initialData.lastName || ""}
              className="w-full rounded-xl border border-black/10 bg-white/60 focus:bg-white text-black h-11 px-4 text-sm outline-none focus:ring-2 focus:ring-[#A2B676] transition-all" />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-black/70 pl-1 block">Especialidad</label>
            <input name="specialty" type="text" required defaultValue={initialData.specialty}
              className="w-full rounded-xl border border-black/10 bg-white/60 focus:bg-white text-black h-11 px-4 text-sm outline-none focus:ring-2 focus:ring-[#A2B676] transition-all" />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-black/70 pl-1 block">Matrícula</label>
            <input name="license" type="text" required defaultValue={initialData.license}
              className="w-full rounded-xl border border-black/10 bg-white/60 focus:bg-white text-black h-11 px-4 text-sm outline-none focus:ring-2 focus:ring-[#A2B676] transition-all" />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-black/70 pl-1 block">Teléfono</label>
            <input name="phone" type="tel" defaultValue={initialData.phone || ""}
              className="w-full rounded-xl border border-black/10 bg-white/60 focus:bg-white text-black h-11 px-4 text-sm outline-none focus:ring-2 focus:ring-[#A2B676] transition-all" />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold uppercase tracking-wider text-black/70 pl-1 block">Biografía</label>
          <textarea name="bio" rows={3} defaultValue={initialData.bio || ""}
            className="w-full rounded-xl border border-black/10 bg-white/60 focus:bg-white text-black p-4 text-sm outline-none focus:ring-2 focus:ring-[#A2B676] transition-all resize-none" />
        </div>

        {message && (
          <p className={`text-xs font-bold text-center ${isSuccess ? "text-[#8F9F68]" : "text-red-500"}`}>{message}</p>
        )}
      </form>

      {/* Disponibilidad Horaria - Rediseñada */}
      <div className="bg-white/40 border border-white/50 p-8 rounded-[32px] shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-xl font-serif font-black text-black flex items-center gap-2">
              <Clock className="h-5 w-5 text-[#A2B676]" /> Disponibilidad Horaria
            </h3>
            <p className="text-sm text-black/50 font-medium mt-1">
              {activeDaysCount > 0
                ? `${activeDaysCount} día${activeDaysCount !== 1 ? "s" : ""} activo${activeDaysCount !== 1 ? "s" : ""} · ${weeklyRange} hs`
                : "Ningún día configurado — los pacientes no podrán agendar turnos"}
            </p>
          </div>
          <button
            type="button"
            onClick={handleSaveAvailability}
            disabled={savingAvail}
            className="px-6 rounded-full bg-[#A2B676] hover:bg-black hover:text-[#FDF6CD] text-black font-bold text-xs uppercase tracking-widest h-10 shadow-sm transition-all active:scale-[0.98] flex items-center justify-center gap-2">
            {savingAvail ? <><Loader2 className="h-4 w-4 animate-spin" /> Guardando...</> : <><Save className="h-4 w-4" /> Guardar Disponibilidad</>}
          </button>
        </div>

        {availMessage && (
          <p className="text-sm font-bold text-center text-[#8F9F68] bg-[#A2B676]/10 py-2 rounded-xl">{availMessage}</p>
        )}

        {/* Grilla Semanal */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {days.map((day, i) => {
            const isWeekend = i >= 5
            return (
              <div
                key={i}
                className={`rounded-2xl border-2 transition-all overflow-hidden ${
                  day.isActive
                    ? "border-[#A2B676] bg-[#A2B676]/10 shadow-sm"
                    : "border-black/10 bg-white/40 opacity-60"
                }`}
              >
                {/* Cabecera del día */}
                <div
                  className={`flex items-center justify-between px-4 py-3 ${
                    day.isActive ? "bg-[#A2B676]" : "bg-black/5"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {isWeekend ? <Moon className="h-4 w-4 text-black/40" /> : <Sun className="h-4 w-4 text-black" />}
                    <span className={`font-bold text-sm ${day.isActive ? "text-black" : "text-black/50"}`}>
                      {DAY_LABELS[i]}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => toggleDay(i)}
                    className={`text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full transition-all border ${
                      day.isActive
                        ? "bg-black/20 text-black border-transparent hover:bg-black/30"
                        : "bg-white/80 text-black/50 border-black/20 hover:bg-white"
                    }`}
                  >
                    {day.isActive ? "Activo" : "Inactivo"}
                  </button>
                </div>

                {/* Controles de horario */}
                {day.isActive && (
                  <div className="p-4 space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="flex-1">
                        <label className="text-[10px] uppercase font-bold tracking-widest text-black/50 block mb-1">Entrada</label>
                        <select
                          value={day.startTime}
                          onChange={(e) => updateDay(i, "startTime", e.target.value)}
                          className="w-full h-10 rounded-xl border border-[#A2B676]/30 bg-white text-black text-sm font-bold px-3 outline-none focus:ring-2 focus:ring-[#A2B676] transition-all cursor-pointer"
                        >
                          {TIME_SLOTS.map((t) => (
                            <option key={t} value={t}>{t}</option>
                          ))}
                        </select>
                      </div>
                      <div className="flex-1">
                        <label className="text-[10px] uppercase font-bold tracking-widest text-black/50 block mb-1">Salida</label>
                        <select
                          value={day.endTime}
                          onChange={(e) => updateDay(i, "endTime", e.target.value)}
                          className="w-full h-10 rounded-xl border border-[#A2B676]/30 bg-white text-black text-sm font-bold px-3 outline-none focus:ring-2 focus:ring-[#A2B676] transition-all cursor-pointer"
                        >
                          {TIME_SLOTS.map((t) => (
                            <option key={t} value={t}>{t}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                )}

                {!day.isActive && (
                  <div className="p-4 flex items-center justify-center">
                    <span className="text-xs text-black/30 font-medium flex items-center gap-1.5">
                      <Cloud className="h-3.5 w-3.5" /> No atiende
                    </span>
                  </div>
                )}
              </div>
            )
          })}
        </div>

        <div className="flex items-start gap-2 text-xs text-black/40 leading-relaxed font-medium pt-2 border-t border-black/10">
          <ShieldCheck className="h-4 w-4 text-[#A2B676] shrink-0" />
          <span>Los pacientes solo podrán agendar citas en los días y horarios marcados como activos.</span>
        </div>
      </div>
    </div>
  )
}
