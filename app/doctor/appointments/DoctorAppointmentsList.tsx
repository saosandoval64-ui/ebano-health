"use client"

import { useState, useTransition } from "react"
import { completeAppointment, cancelAppointment } from "../../actions/appointments"
import { Calendar, Clock, Check, X, Loader2, AlertCircle } from "lucide-react"
import AvatarDisplay from "@/components/AvatarDisplay"

interface AppointmentData {
  id: string
  dateTime: Date
  status: "PENDING" | "RESERVED" | "COMPLETED" | "CANCELLED"
  patient: {
    name: string
    lastName: string | null
    phone: string | null
    email: string
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

  const renderList = (list: AppointmentData[]) => {
    if (list.length === 0) {
      return (
        <div className="p-10 border border-dashed border-black/10 rounded-[30px] text-center bg-white/20">
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

          return (
            <div 
              key={app.id} 
              className="bg-white/40 border border-white/50 p-6 rounded-[28px] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 transition-all hover:bg-white/60"
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
                    DNI: {app.patient.phone || "Sin teléfono"} | {app.patient.email}
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

              <div className="flex items-center justify-between sm:justify-end gap-3 border-t sm:border-t-0 pt-3 sm:pt-0 border-black/5">
                {app.status === "COMPLETED" && (
                  <span className="px-2.5 py-1 rounded-full text-[9px] font-extrabold uppercase tracking-widest bg-green-100 text-green-700">Completado</span>
                )}
                {app.status === "CANCELLED" && (
                  <span className="px-2.5 py-1 rounded-full text-[9px] font-extrabold uppercase tracking-widest bg-red-100 text-red-700">Cancelado</span>
                )}
                
                {isPendingItem && (
                  <div className="flex items-center gap-2">
                    <button
                      disabled={isPending}
                      onClick={() => handleComplete(app.id)}
                      className="h-9 px-4 rounded-xl text-[10px] font-bold uppercase tracking-widest bg-[#F4C443] hover:bg-[#E5B534] text-black hover:text-white transition-all flex items-center gap-1 active:scale-95 disabled:opacity-50"
                    >
                      {isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Check className="h-3.5 w-3.5" />}
                      Finalizar
                    </button>
                    <button
                      disabled={isPending}
                      onClick={() => handleCancel(app.id)}
                      className="h-9 px-4 rounded-xl text-[10px] font-bold uppercase tracking-widest bg-transparent hover:bg-red-50 text-red-600 hover:text-red-700 border border-red-200/50 hover:border-red-300 transition-all flex items-center gap-1 active:scale-95 disabled:opacity-50"
                    >
                      {isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <X className="h-3.5 w-3.5" />}
                      Cancelar
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
