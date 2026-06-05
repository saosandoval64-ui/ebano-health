"use client"

import { useState, useEffect, useTransition } from "react"
import { getDoctorBookedSlots, bookAppointment } from "../../actions/appointments"
import { Calendar, Clock, Check, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"

interface BookingSectionProps {
  doctorId: string
  isLoggedIn: boolean
}

const TIME_SLOTS = [
  "09:00", "09:30", "10:00", "10:30", 
  "11:00", "11:30", "12:00", "12:30", 
  "13:00", "13:30", "14:00", "14:30", 
  "15:00", "15:30", "16:00", "16:30"
]

export default function BookingSection({ doctorId, isLoggedIn }: BookingSectionProps) {
  const router = useRouter()
  const [selectedDate, setSelectedDate] = useState("")
  const [selectedTime, setSelectedTime] = useState("")
  const [bookedSlots, setBookedSlots] = useState<string[]>([])
  const [loadingSlots, setLoadingSlots] = useState(false)
  const [isPending, startTransition] = useTransition()
  const [message, setMessage] = useState("")
  const [isSuccess, setIsSuccess] = useState(false)

  // Generar los próximos 7 días laborables
  const [availableDays, setAvailableDays] = useState<{ dayName: string; dateStr: string; label: string }[]>([])

  useEffect(() => {
    const days = []
    const options: Intl.DateTimeFormatOptions = { weekday: "short", day: "numeric", month: "short" }
    let count = 0
    let current = new Date()

    while (count < 7) {
      // 0: Domingo, 6: Sábado
      const dayOfWeek = current.getDay()
      if (dayOfWeek !== 0 && dayOfWeek !== 6) { // Solo lunes a viernes
        const year = current.getFullYear()
        const month = String(current.getMonth() + 1).padStart(2, "0")
        const date = String(current.getDate()).padStart(2, "0")
        const dateStr = `${year}-${month}-${date}`

        days.push({
          dayName: current.toLocaleDateString("es-ES", { weekday: "short" }),
          label: current.toLocaleDateString("es-ES", { day: "numeric", month: "short" }),
          dateStr,
        })
        count++
      }
      current.setDate(current.getDate() + 1)
    }

    setAvailableDays(days)
    if (days.length > 0) {
      setSelectedDate(days[0].dateStr)
    }
  }, [])

  // Buscar turnos ocupados cuando cambia la fecha
  useEffect(() => {
    if (!selectedDate) return

    async function fetchSlots() {
      setLoadingSlots(true)
      const booked = await getDoctorBookedSlots(doctorId, selectedDate)
      setBookedSlots(booked)
      setLoadingSlots(false)
      setSelectedTime("") // Reset select time
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

        {/* Selector de Fecha Corrediza (Lunes a Viernes) */}
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

        {/* Selector de Hora en Cuadrícula */}
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
              {TIME_SLOTS.map((slot) => {
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
            <>
              <Loader2 className="h-4 w-4 animate-spin" /> Confirmando...
            </>
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
