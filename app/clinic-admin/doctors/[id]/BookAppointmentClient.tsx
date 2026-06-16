"use client"

import { useState, useEffect, useTransition } from "react"
import {
  getDoctorBookedSlots,
  getDoctorAvailability,
  searchPatientByEmail,
  bookAppointmentOnBehalf,
} from "../../../actions/appointments"
import { Calendar, Clock, Check, Loader2, Search, User } from "lucide-react"

interface BookAppointmentClientProps {
  doctorId: string
}

interface PatientResult {
  id: string
  name: string
  email: string
}

const DAY_LABELS_SHORT = ["dom", "lun", "mar", "mié", "jue", "vie", "sáb"]

export default function BookAppointmentClient({ doctorId }: BookAppointmentClientProps) {
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

  const [patientQuery, setPatientQuery] = useState("")
  const [patientResults, setPatientResults] = useState<PatientResult[]>([])
  const [selectedPatient, setSelectedPatient] = useState<PatientResult | null>(null)
  const [searchingPatient, setSearchingPatient] = useState(false)

  useEffect(() => {
    async function load() {
      const avail = await getDoctorAvailability(doctorId)
      const activeDays = avail.filter((a) => a.isActive)

      if (activeDays.length === 0) {
        setHasAvailability(false)
        setAvailLoaded(true)
        return
      }

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

      const days: { dayName: string; dateStr: string; label: string }[] = []
      const activeDayIndices = activeDays.map((a) => a.dayOfWeek)
      let count = 0
      let current = new Date()
      const maxDays = 90

      while (count < 14 && days.length < 14 && maxDays > 0) {
        const dayOfWeek = current.getDay()
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

  useEffect(() => {
    if (patientQuery.length < 3) {
      setPatientResults([])
      return
    }

    const timer = setTimeout(async () => {
      setSearchingPatient(true)
      const result = await searchPatientByEmail(patientQuery)
      if (result.success) {
        setPatientResults(result.patients)
      }
      setSearchingPatient(false)
    }, 400)

    return () => clearTimeout(timer)
  }, [patientQuery])

  const handleConfirm = () => {
    if (!selectedPatient) {
      setMessage("Debes seleccionar un paciente.")
      return
    }

    if (!selectedDate || !selectedTime) {
      setMessage("Por favor selecciona una fecha y hora.")
      return
    }

    const formData = new FormData()
    formData.append("doctorId", doctorId)
    formData.append("patientId", selectedPatient.id)
    formData.append("date", selectedDate)
    formData.append("time", selectedTime)

    setMessage("")
    startTransition(async () => {
      const result = await bookAppointmentOnBehalf(formData)
      if (result.success) {
        setIsSuccess(true)
        setMessage(result.message)
      } else {
        setMessage(result.message)
      }
    })
  }

  if (!availLoaded) {
    return (
      <div className="bg-black text-[#FDF6CD] p-6 sm:p-8 rounded-3xl flex items-center justify-center h-full min-h-[350px]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-6 w-6 animate-spin text-[#F4C443]" />
          <span className="text-[10px] uppercase font-bold tracking-widest text-white/40">Cargando disponibilidad...</span>
        </div>
      </div>
    )
  }

  if (!hasAvailability) {
    return (
      <div className="bg-black text-[#FDF6CD] p-6 sm:p-8 rounded-3xl flex flex-col items-center justify-center text-center h-full min-h-[350px]">
        <Calendar className="h-12 w-12 text-[#F4C443] mb-4" />
        <h3 className="text-xl font-serif font-black mb-2">Sin Disponibilidad</h3>
        <p className="text-sm font-medium text-[#FDF6CD]/60 max-w-xs">
          Este profesional aún no configuró sus horarios de atención.
        </p>
      </div>
    )
  }

  if (isSuccess) {
    return (
      <div className="bg-[#F4C443]/10 border-2 border-[#F4C443] text-black p-8 rounded-3xl flex flex-col items-center justify-center text-center h-full min-h-[350px]">
        <div className="w-16 h-16 rounded-full bg-[#F4C443] flex items-center justify-center text-white mb-4 animate-bounce">
          <Check className="h-8 w-8" />
        </div>
        <h3 className="text-2xl font-serif font-black mb-2">¡Reserva Confirmada!</h3>
        <p className="text-sm font-medium text-black/60 max-w-xs">{message}</p>
      </div>
    )
  }

  return (
    <div className="bg-black text-[#FDF6CD] p-6 sm:p-8 rounded-3xl flex flex-col justify-between shadow-2xl h-full">
      <div>
        <h2 className="text-xl sm:text-2xl font-serif font-black mb-6 flex items-center gap-2">
          <Calendar className="h-5 w-5 text-[#F4C443]" /> Reservar Turno
        </h2>

        {/* Patient search */}
        <div className="mb-6">
          <p className="text-xs font-bold uppercase tracking-widest text-[#FDF6CD]/60 mb-3 flex items-center gap-1.5">
            <User className="h-3.5 w-3.5" /> 1. Selecciona el Paciente
          </p>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#FDF6CD]/40" />
            <input
              type="text"
              value={selectedPatient ? `${selectedPatient.name} (${selectedPatient.email})` : patientQuery}
              onChange={(e) => {
                setSelectedPatient(null)
                setPatientQuery(e.target.value)
              }}
              placeholder="Buscar por nombre o email..."
              className="w-full h-10 pl-10 pr-3 rounded-xl bg-[#FDF6CD]/5 border border-[#FDF6CD]/10 text-[#FDF6CD] text-sm outline-none focus:border-[#F4C443] placeholder:text-[#FDF6CD]/30"
            />
            {searchingPatient && (
              <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-[#F4C443]" />
            )}
          </div>
          {patientResults.length > 0 && !selectedPatient && (
            <div className="mt-2 bg-[#1a1a1a] border border-[#FDF6CD]/10 rounded-xl overflow-hidden max-h-40 overflow-y-auto">
              {patientResults.map((p) => (
                <button
                  key={p.id}
                  onClick={() => {
                    setSelectedPatient(p)
                    setPatientQuery("")
                    setPatientResults([])
                  }}
                  className="w-full text-left px-4 py-3 hover:bg-[#F4C443]/10 transition-colors border-b border-[#FDF6CD]/5 last:border-0"
                >
                  <span className="text-sm font-bold text-[#FDF6CD]">{p.name}</span>
                  <span className="text-xs text-[#FDF6CD]/40 ml-2">{p.email}</span>
                </button>
              ))}
            </div>
          )}
          {selectedPatient && (
            <div className="mt-2 flex items-center gap-2 bg-[#F4C443]/10 border border-[#F4C443]/25 rounded-xl px-3 py-2">
              <User className="h-4 w-4 text-[#F4C443]" />
              <span className="text-sm font-bold text-[#F4C443]">{selectedPatient.name}</span>
              <button
                onClick={() => {
                  setSelectedPatient(null)
                  setPatientQuery("")
                }}
                className="ml-auto text-[#FDF6CD]/40 hover:text-[#FDF6CD] text-xs"
              >
                ✕
              </button>
            </div>
          )}
        </div>

        {/* Date selection */}
        <div className="mb-6">
          <p className="text-xs font-bold uppercase tracking-widest text-[#FDF6CD]/60 mb-3">2. Selecciona el Día</p>
          <div className="grid grid-cols-4 gap-2">
            {availableDays.map((day) => (
              <button
                key={day.dateStr}
                onClick={() => setSelectedDate(day.dateStr)}
                className={`py-2 px-1 rounded-2xl flex flex-col items-center justify-center transition-all border outline-none active:scale-95 ${
                  selectedDate === day.dateStr
                    ? "bg-[#F4C443] border-[#F4C443] text-black font-bold"
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

        {/* Time selection */}
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-[#FDF6CD]/60 mb-3 flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5" /> 3. Selecciona el Horario
          </p>

          {loadingSlots ? (
            <div className="py-12 flex flex-col items-center justify-center gap-2 text-white/40">
              <Loader2 className="h-6 w-6 animate-spin text-[#F4C443]" />
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
                        : "bg-transparent border-[#FDF6CD]/20 text-[#FDF6CD] hover:border-[#F4C443] hover:text-[#F4C443]"
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
          disabled={isPending || !selectedTime || !selectedPatient}
          className={`w-full py-4 text-xs font-black uppercase tracking-widest rounded-2xl shadow-lg transition-all active:scale-[0.98] flex items-center justify-center gap-2 ${
            isPending || !selectedTime || !selectedPatient
              ? "bg-[#F4C443]/50 text-black/50 cursor-wait"
              : "bg-[#F4C443] hover:bg-white text-black"
          }`}
        >
          {isPending ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" /> Confirmando...
            </>
          ) : (
            "Confirmar turno"
          )}
        </button>
      </div>
    </div>
  )
}
