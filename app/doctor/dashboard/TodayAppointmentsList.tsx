"use client"

import { useState, useTransition } from "react"
import { completeAppointment, cancelAppointment } from "../../actions/appointments"
import { Check, X, Loader2, Calendar } from "lucide-react"
import AvatarDisplay from "@/components/AvatarDisplay"

interface AppointmentData {
  id: string
  dateTime: Date
  status: "PENDING" | "RESERVED" | "COMPLETED" | "CANCELLED"
  patient: {
    name: string
    lastName: string | null
    phone: string | null
    insurance: string | null
    avatar?: string | null
  }
}

interface TodayAppointmentsListProps {
  initialAppointments: AppointmentData[]
}

export default function TodayAppointmentsList({ initialAppointments }: TodayAppointmentsListProps) {
  const [appointments, setAppointments] = useState<AppointmentData[]>(initialAppointments)
  const [isPending, startTransition] = useTransition()
  const [message, setMessage] = useState("")

  const activeApps = appointments.filter((app) => app.status === "RESERVED")

  const handleComplete = (appId: string) => {
    setMessage("")
    startTransition(async () => {
      const result = await completeAppointment(appId)
      if (result.success) {
        setAppointments((prev) =>
          prev.map((app) => (app.id === appId ? { ...app, status: "COMPLETED" } : app))
        )
      } else {
        setMessage(result.message)
      }
    })
  }

  const handleCancel = (appId: string) => {
    if (!confirm("¿Seguro que deseas cancelar esta consulta?")) return
    setMessage("")
    startTransition(async () => {
      const result = await cancelAppointment(appId)
      if (result.success) {
        setAppointments((prev) =>
          prev.map((app) => (app.id === appId ? { ...app, status: "CANCELLED" } : app))
        )
      } else {
        setMessage(result.message)
      }
    })
  }

  if (activeApps.length === 0) {
    return (
      <div className="p-8 border border-dashed border-black/10 rounded-[28px] text-center bg-white/20">
        <p className="text-sm font-medium text-black/45">No hay consultas pendientes agendadas para hoy.</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {message && <p className="text-red-500 text-xs font-bold">{message}</p>}
      
      {activeApps.map((app) => {
        const appDate = new Date(app.dateTime)
        return (
          <div 
            key={app.id} 
            className="bg-white/40 border border-white/50 p-5 rounded-[24px] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 transition-all hover:bg-white/70"
          >
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-2xl bg-black/5 border border-black/10 flex items-center justify-center overflow-hidden shrink-0">
                <AvatarDisplay avatar={app.patient.avatar} name={`${app.patient.name} ${app.patient.lastName || ""}`} size="sm" />
              </div>
              <div className="space-y-0.5">
                <h4 className="font-bold text-sm text-black">
                  {app.patient.name} {app.patient.lastName}
                </h4>
                <div className="flex flex-wrap gap-x-3 text-[10px] text-black/50 font-bold uppercase tracking-wider">
                  <span>Tel: {app.patient.phone || "Sin teléfono"}</span>
                  <span>●</span>
                  <span>Prepaga: {app.patient.insurance || "Ninguna"}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between sm:justify-end gap-6">
              <div className="text-left sm:text-right font-medium">
                <p className="text-sm font-bold text-[#E5B534]">
                  {String(appDate.getHours()).padStart(2, "0")}:{String(appDate.getMinutes()).padStart(2, "0")} hs
                </p>
                <p className="text-[9px] text-black/40 font-bold uppercase tracking-widest">
                  Hoy
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  disabled={isPending}
                  onClick={() => handleComplete(app.id)}
                  title="Finalizar consulta"
                  className="h-8 w-8 rounded-xl bg-[#F4C443] hover:bg-[#E5B534] text-white flex items-center justify-center transition-all active:scale-90 disabled:opacity-50"
                >
                  <Check className="h-4 w-4" />
                </button>
                <button
                  disabled={isPending}
                  onClick={() => handleCancel(app.id)}
                  title="Cancelar consulta"
                  className="h-8 w-8 rounded-xl bg-transparent hover:bg-red-50 text-red-600 hover:text-red-700 border border-red-200/50 hover:border-red-300 transition-all flex items-center justify-center active:scale-90 disabled:opacity-50"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
