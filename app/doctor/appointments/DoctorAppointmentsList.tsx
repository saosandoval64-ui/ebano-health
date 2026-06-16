"use client"

import { useState, useTransition } from "react"
import { completeAppointment, cancelAppointment, rescheduleAppointment } from "../../actions/appointments"
import { Calendar, Clock, Check, X, Loader2, AlertCircle, RefreshCw } from "lucide-react"
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

interface DoctorAppointmentsListProps {
  initialAppointments: AppointmentData[]
}

export default function DoctorAppointmentsList({ initialAppointments }: DoctorAppointmentsListProps) {
  const [appointments, setAppointments] = useState<AppointmentData[]>(initialAppointments)
  const [isPending, startTransition] = useTransition()
  const [activeTab, setActiveTab] = useState<"PENDING" | "COMPLETED" | "CANCELLED">("PENDING")
  const [message, setMessage] = useState("")
  const [rescheduleId, setRescheduleId] = useState<string | null>(null)
  const [newDate, setNewDate] = useState("")
  const [newTime, setNewTime] = useState("")

  const pendingApps = appointments.filter((app) => app.status === "RESERVED" && new Date(app.dateTime) >= new Date())
  const completedApps = appointments.filter((app) => app.status === "COMPLETED")
  const cancelledApps = appointments.filter((app) => app.status === "CANCELLED")

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

  const handleReschedule = (appId: string) => {
    if (!newDate || !newTime) {
      setMessage("Seleccioná fecha y hora nueva")
      return
    }
    setMessage("")
    startTransition(async () => {
      const dateTime = new Date(`${newDate}T${newTime}:00`)
      const result = await rescheduleAppointment(appId, dateTime)
      if (result.success) {
        setAppointments((prev) =>
          prev.map((app) => (app.id === appId ? { ...app, dateTime: dateTime } : app))
        )
        setRescheduleId(null)
        setNewDate("")
        setNewTime("")
      } else {
        setMessage(result.message)
      }
    })
  }

  const renderList = (list: AppointmentData[]) => {
    if (list.length === 0) {
      return (
        <div className="p-10 border border-dashed border-gray-200 rounded-2xl text-center bg-gray-50">
          <AlertCircle className="h-8 w-8 text-black/30 mx-auto mb-3" />
          <p className="text-sm font-medium text-black/45">No hay consultas en esta sección.</p>
        </div>
      )
    }

    return (
      <div className="space-y-4">
        {list.map((app) => {
          const appDate = new Date(app.dateTime)
          const isPendingItem = app.status === "RESERVED" && appDate >= new Date()
          const isRescheduling = rescheduleId === app.id

          return (
            <div 
              key={app.id} 
              className="bg-white border border-gray-100 p-6 rounded-2xl flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 transition-all hover:shadow-md"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-black/5 border border-black/10 flex items-center justify-center overflow-hidden shrink-0">
                  <AvatarDisplay avatar={app.patient.avatar} name={`${app.patient.name} ${app.patient.lastName || ""}`} size="sm" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-bold text-base text-black">
                    {app.patient.name} {app.patient.lastName}
                  </h4>
                  <p className="text-xs text-black/50 font-bold uppercase tracking-wider">
                    DNI: {app.patient.phone || "Sin teléfono"}
                  </p>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-black/60 pt-1 font-semibold">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5 opacity-60" />
                      {appDate.toLocaleDateString("es-ES", {
                        weekday: "long",
                        day: "numeric",
                        month: "long",
                      })}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5 opacity-60" />
                      {String(appDate.getHours()).padStart(2, "0")}:{String(appDate.getMinutes()).padStart(2, "0")} hs
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-end gap-3 border-t sm:border-t-0 pt-3 sm:pt-0 border-black/5">
                <div className="flex items-center gap-3">
                  {app.status === "COMPLETED" && (
                    <span className="px-2.5 py-1 rounded-full text-[9px] font-extrabold uppercase tracking-widest bg-green-100 text-green-700">Completado</span>
                  )}
                  {app.status === "CANCELLED" && (
                    <span className="px-2.5 py-1 rounded-full text-[9px] font-extrabold uppercase tracking-widest bg-red-100 text-red-700">Cancelado</span>
                  )}
                  
                  {isPendingItem && !isRescheduling && (
                    <div className="flex items-center gap-2">
                      <button
                        disabled={isPending}
                        onClick={() => handleComplete(app.id)}
                        className="h-9 px-4 rounded-xl text-[10px] font-bold uppercase tracking-widest bg-[#F4C443] hover:bg-[#E5B534] text-black transition-all flex items-center gap-1 active:scale-95 disabled:opacity-50"
                      >
                        {isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Check className="h-3.5 w-3.5" />}
                        Finalizar
                      </button>
                      <button
                        disabled={isPending}
                        onClick={() => setRescheduleId(app.id)}
                        className="h-9 px-4 rounded-xl text-[10px] font-bold uppercase tracking-widest bg-blue-50 hover:bg-blue-100 text-blue-600 transition-all flex items-center gap-1 active:scale-95 disabled:opacity-50"
                      >
                        <RefreshCw className="h-3.5 w-3.5" /> Reprogramar
                      </button>
                      <button
                        disabled={isPending}
                        onClick={() => handleCancel(app.id)}
                        className="h-9 px-4 rounded-xl text-[10px] font-bold uppercase tracking-widest bg-transparent hover:bg-red-50 text-red-600 border border-red-200/50 hover:border-red-300 transition-all flex items-center gap-1 active:scale-95 disabled:opacity-50"
                      >
                        {isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <X className="h-3.5 w-3.5" />}
                        Cancelar
                      </button>
                    </div>
                  )}
                </div>

                {/* Reschedule Form */}
                {isRescheduling && (
                  <div className="flex items-center gap-2 bg-blue-50 p-3 rounded-xl">
                    <input
                      type="date"
                      value={newDate}
                      onChange={(e) => setNewDate(e.target.value)}
                      className="rounded-lg border border-blue-200 bg-white text-black h-9 px-3 text-xs outline-none focus:ring-2 focus:ring-blue-400"
                    />
                    <input
                      type="time"
                      value={newTime}
                      onChange={(e) => setNewTime(e.target.value)}
                      className="rounded-lg border border-blue-200 bg-white text-black h-9 px-3 text-xs outline-none focus:ring-2 focus:ring-blue-400"
                    />
                    <button
                      onClick={() => handleReschedule(app.id)}
                      disabled={isPending}
                      className="h-9 px-3 bg-blue-500 text-white rounded-lg text-xs font-bold hover:bg-blue-600 transition-all"
                    >
                      {isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : "OK"}
                    </button>
                    <button
                      onClick={() => setRescheduleId(null)}
                      className="h-9 px-3 bg-gray-200 text-black/60 rounded-lg text-xs font-bold hover:bg-gray-300 transition-all"
                    >
                      X
                    </button>
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {message && (
        <p className="text-red-500 text-xs font-bold bg-red-50 border border-red-150 p-3 rounded-xl">{message}</p>
      )}

      {/* Tabs */}
      <div className="flex items-center border-b border-black/10 text-xs font-bold uppercase tracking-widest text-black/40">
        <button
          onClick={() => setActiveTab("PENDING")}
          className={`pb-3 px-4 border-b-2 transition-all outline-none ${
            activeTab === "PENDING"
              ? "border-black text-black font-black"
              : "border-transparent hover:text-black"
          }`}
        >
          Pendientes ({pendingApps.length})
        </button>
        <button
          onClick={() => setActiveTab("COMPLETED")}
          className={`pb-3 px-4 border-b-2 transition-all outline-none ${
            activeTab === "COMPLETED"
              ? "border-black text-black font-black"
              : "border-transparent hover:text-black"
          }`}
        >
          Completadas ({completedApps.length})
        </button>
        <button
          onClick={() => setActiveTab("CANCELLED")}
          className={`pb-3 px-4 border-b-2 transition-all outline-none ${
            activeTab === "CANCELLED"
              ? "border-black text-black font-black"
              : "border-transparent hover:text-black"
          }`}
        >
          Canceladas ({cancelledApps.length})
        </button>
      </div>

      {/* Contenido */}
      <div>
        {activeTab === "PENDING" && renderList(pendingApps)}
        {activeTab === "COMPLETED" && renderList(completedApps)}
        {activeTab === "CANCELLED" && renderList(cancelledApps)}
      </div>
    </div>
  )
}
