"use client"

import { useState, useEffect, useTransition } from "react"
import { getDoctorBookedSlots, bookAppointment, getDoctorAvailability } from "../../actions/appointments"
import { Calendar, Clock, Check, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"

interface BookingSectionProps {
  doctorId: string
  isLoggedIn: boolean
  userRole?: string | null
}

const DAY_LABELS_SHORT = ["dom", "lun", "mar", "mié", "jue", "vie", "sáb"]
const DAY_LABELS = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"]

export default function BookingSection({ doctorId, isLoggedIn, userRole }: BookingSectionProps) {
  const isPatient = isLoggedIn && userRole === "PATIENT"
  const router = useRouter()
  const [selectedDate, setSelectedDate] = useState("")
  const [selectedTime, setSelectedTime] = useState("")
  const [bookedSlots, setBookedSlots] = useState<string[]>([])
  const [loadingSlots, setLoadingSlots] = useState(false)
  const [isPending, startTransition] = useTransition()
  const [message, setMessage] = useState("")
  const [isSuccess, setIsSuccess] = useState(false)
  const [availableDays, setAvailableDays] = useState<{ dayName: string; dateStr: string; label: string }[]>([])
  const [timeSlots, setTimeSlots] = useState<string[]>([])
  const [availLoaded, setAvailLoaded] = useState(false)
  const [hasAvailability, setHasAvailability] = useState(true)

  // Cargar disponibilidad del médico
  useEffect(() => {
    async function load() {
      const avail = await getDoctorAvailability(doctorId)
      const activeDays = avail.filter((a) => a.isActive)

      if (activeDays.length === 0) {
        setHasAvailability(false)
        setAvailLoaded(true)
        return
      }

      // Generar time slots desde el rango del médico
      const slots: string[] = []
      for (const entry of activeDays) {
        const [startH, startM] = entry.startTime.split(":").map(Number)
        const [endH, endM] = entry.endTime.split(":").map(Number)
        const startMinutes = startH * 60 + startM
        const endMinutes = endH * 60 + endM
        for (let m = startMinutes; m + 30 <= endMinutes; m += 30) {
          const h = String(Math.floor(m / 60)).padStart(2, "0")
          const min = String(m % 60).padStart(2, "0")
          const slot = `${h}:${min}`
          if (!slots.includes(slot)) slots.push(slot)
        }
      }
      slots.sort()
      setTimeSlots(slots)

      // Generar próximos días según los días activos del médico
      const days: { dayName: string; dateStr: string; label: string }[] = []
      const activeDayIndices = activeDays.map((a) => a.dayOfWeek)
      let count = 0
      let current = new Date()
      const maxDays = 90

      while (count < 14 && days.length < 14 && maxDays > 0) {
        const dayOfWeek = current.getDay()
        // Convertir JS Sunday=0, Monday=1... a nuestro Monday=0, Tuesday=1... Sunday=6
        const ourDay = dayOfWeek === 0 ? 6 : dayOfWeek - 1
        if (activeDayIndices.includes(ourDay)) {
          const year = current.getFullYear()
          const month = String(current.getMonth() + 1).padStart(2, "0")
          const date = String(current.getDate()).padStart(2, "0")
          const dateStr = `${year}-${month}-${date}`
          days.push({
            dayName: DAY_LABELS_SHORT[dayOfWeek],
            label: `${current.getDate()} ${current.toLocaleDateString("es-ES", { month: "short" })}`,
            dateStr,
          })
        }
        current.setDate(current.getDate() + 1)
        count++
      }

      setAvailableDays(days)
      if (days.length > 0) {
        setSelectedDate(days[0].dateStr)
      }
      setAvailLoaded(true)
    }
    load()
  }, [doctorId])

  // Buscar turnos ocupados cuando cambia la fecha
  useEffect(() => {
    if (!selectedDate) return

    async function fetchSlots() {
      setLoadingSlots(true)
      const booked = await getDoctorBookedSlots(doctorId, selectedDate)
      setBookedSlots(booked)
      setLoadingSlots(false)
      setSelectedTime("")
    }

    fetchSlots()
  }, [selectedDate, doctorId])

  const handleConfirm = () => {
    if (!isLoggedIn) {
      router.push(`/login?role=patient`)
      return
    }

    if (!selectedDate || !selectedTime) {
      setMessage("Por favor selecciona una fecha y hora.")
      return
    }

    const formData = new FormData()
    formData.append("doctorId", doctorId)
    formData.append("date", selectedDate)
    formData.append("time", selectedTime)

    setMessage("")
    startTransition(async () => {
      const result = await bookAppointment(formData)
      if (result.success) {
        setIsSuccess(true)
        setMessage(result.message)
        setTimeout(() => {
          router.push("/patient/appointments")
        }, 1500)
      } else {
        setMessage(result.message)
      }
    })
  }

  if (!availLoaded) {
    return (
      <div className="bg-black text-[#FDF6CD] p-6 sm:p-8 rounded-[40px] flex items-center justify-center h-full min-h-[350px]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-6 w-6 animate-spin text-[#A2B676]" />
          <span className="text-[10px] uppercase font-bold tracking-widest text-white/40">Cargando disponibilidad...</span>
        </div>
      </div>
    )
  }

  if (!hasAvailability) {
    return (
      <div className="bg-black text-[#FDF6CD] p-6 sm:p-8 rounded-[40px] flex flex-col items-center justify-center text-center h-full min-h-[350px]">
        <Calendar className="h-12 w-12 text-[#A2B676] mb-4" />
        <h3 className="text-xl font-serif font-black mb-2">Sin Disponibilidad</h3>
        <p className="text-sm font-medium text-[#FDF6CD]/60 max-w-xs">
          Este profesional aún no configuró sus horarios de atención. Consultá más tarde.
        </p>
      </div>
    )
  }

  if (isSuccess) {
    return (
      <div className="bg-[#A2B676]/10 border-2 border-[#A2B676] text-black p-8 rounded-[40px] flex flex-col items-center justify-center text-center h-full min-h-[350px]">
        <div className="w-16 h-16 rounded-full bg-[#A2B676] flex items-center justify-center text-white mb-4 animate-bounce">
          <Check className="h-8 w-8" />
        </div>
        <h3 className="text-2xl font-serif font-black mb-2">¡Reserva Confirmada!</h3>
        <p className="text-sm font-medium text-black/60 max-w-xs">{message}</p>
        <p className="text-xs text-[#A2B676] font-bold uppercase tracking-widest mt-6 animate-pulse">Redirigiendo a tus citas...</p>
      </div>
    )
  }

  return (
    <div className="bg-black text-[#FDF6CD] p-6 sm:p-8 rounded-[40px] flex flex-col justify-between shadow-2xl h-full">
      <div>
        <h2 className="text-xl sm:text-2xl font-serif font-black mb-6 flex items-center gap-2">
          <Calendar className="h-5 w-5 text-[#A2B676]" /> Reservar Consulta
        </h2>

        <div className="mb-6">
          <p className="text-xs font-bold uppercase tracking-widest text-[#FDF6CD]/60 mb-3">1. Selecciona el Día</p>
          <div className="grid grid-cols-4 gap-2">
            {availableDays.map((day) => (
              <button
                key={day.dateStr}
                onClick={() => setSelectedDate(day.dateStr)}
                className={`py-2 px-1 rounded-2xl flex flex-col items-center justify-center transition-all border outline-none active:scale-95 ${
                  selectedDate === day.dateStr
                    ? "bg-[#A2B676] border-[#A2B676] text-black font-bold"
                    : "bg-[#FDF6CD]/5 border-[#FDF6CD]/10 hover:border-[#FDF6CD]/30 text-[#FDF6CD]"
                }`}
              >
                <span className="text-[10px] uppercase opacity-60 tracking-wider">{day.dayName}</span>
                <span className="text-sm font-black">{day.label.split(" ")[0]}</span>
                <span className="text-[8px] uppercase tracking-tighter opacity-70">{day.label.split(" ")[1]}</span>
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-[#FDF6CD]/60 mb-3 flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5" /> 2. Selecciona el Horario
          </p>

          {loadingSlots ? (
            <div className="py-12 flex flex-col items-center justify-center gap-2 text-white/40">
              <Loader2 className="h-6 w-6 animate-spin text-[#A2B676]" />
              <span className="text-[10px] uppercase font-bold tracking-widest">Buscando horarios...</span>
            </div>
          ) : (
            <div className="grid grid-cols-4 gap-2 max-h-[180px] overflow-y-auto pr-1 scrollbar-none">
              {timeSlots.map((slot) => {
                const isBooked = bookedSlots.includes(slot)
                const isSelected = selectedTime === slot

                return (
                  <button
                    key={slot}
                    disabled={isBooked}
                    onClick={() => setSelectedTime(slot)}
                    className={`py-2 rounded-xl text-xs font-bold transition-all border outline-none active:scale-95 ${
                      isBooked
                        ? "bg-white/5 border-white/5 text-[#FDF6CD]/25 line-through cursor-not-allowed"
                        : isSelected
                        ? "bg-[#FDF6CD] border-[#FDF6CD] text-black font-black"
                        : "bg-transparent border-[#FDF6CD]/20 text-[#FDF6CD] hover:border-[#A2B676] hover:text-[#A2B676]"
                    }`}
                  >
                    {slot}
                  </button>
                )
              })}
            </div>
          )}
        </div>
      </div>

      <div className="mt-8">
        {message && !isSuccess && (
          <p className="text-red-400 text-xs font-bold text-center mb-3">{message}</p>
        )}

        <button
          onClick={handleConfirm}
          disabled={isPending || (!selectedTime && isLoggedIn)}
          className={`w-full py-4 text-xs font-black uppercase tracking-widest rounded-[20px] shadow-lg transition-all active:scale-[0.98] flex items-center justify-center gap-2 ${
            isPending
              ? "bg-[#A2B676]/50 text-black/50 cursor-wait"
              : !isLoggedIn
              ? "bg-[#F4C443] hover:bg-[#E5B534] text-black"
              : "bg-[#A2B676] hover:bg-white text-black"
          }`}
        >
          {isPending ? (
            <><Loader2 className="h-4 w-4 animate-spin" /> Confirmando...</>
          ) : !isLoggedIn ? (
            "Iniciar sesión para reservar"
          ) : (
            "Confirmar turno"
          )}
        </button>
      </div>
    </div>
  )
}
