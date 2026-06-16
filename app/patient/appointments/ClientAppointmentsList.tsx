"use client"

import { useState, useTransition } from "react"
import { cancelAppointment } from "../../actions/appointments"
import { Calendar, Clock, XCircle, AlertCircle, Loader2 } from "lucide-react"
import AvatarDisplay from "@/components/AvatarDisplay"

interface AppointmentData {
  id: string
  dateTime: Date
  status: "PENDING" | "RESERVED" | "COMPLETED" | "CANCELLED"
  doctor: {
    specialty: string
    user: {
      name: string
      lastName: string | null
      avatar?: string | null
    }
  }
}

interface ClientAppointmentsListProps {
  initialAppointments: AppointmentData[]
}

export default function ClientAppointmentsList({ initialAppointments }: ClientAppointmentsListProps) {
  const [appointments, setAppointments] = useState<AppointmentData[]>(initialAppointments)
  const [isPending, startTransition] = useTransition()
  const [activeTab, setActiveTab] = useState<"ACTIVE" | "PAST">("ACTIVE")
  const [message, setMessage] = useState("")

  const activeApps = appointments.filter(
    (app) => app.status === "RESERVED" && new Date(app.dateTime) >= new Date()
  )
  
  const pastApps = appointments.filter(
    (app) => app.status === "COMPLETED" || app.status === "CANCELLED" || (app.status === "RESERVED" && new Date(app.dateTime) < new Date())
  )

  const handleCancel = (appId: string) => {
    if (!confirm("¿Estás seguro de que deseas cancelar esta cita?")) return

    setMessage("")
    startTransition(async () => {
      const result = await cancelAppointment(appId)
      if (result.success) {
        // Actualizar el estado localmente
        setAppointments((prev) =>
          prev.map((app) => (app.id === appId ? { ...app, status: "CANCELLED" } : app))
        )
      } else {
        setMessage(result.message)
      }
    })
  }

  const getStatusLabel = (app: AppointmentData) => {
    if (app.status === "CANCELLED") {
      return <span className="px-2.5 py-1 rounded-full text-[9px] font-extrabold uppercase tracking-widest bg-red-100 text-red-700">Cancelado</span>
    }
    if (app.status === "COMPLETED") {
      return <span className="px-2.5 py-1 rounded-full text-[9px] font-extrabold uppercase tracking-widest bg-green-100 text-green-700">Completado</span>
    }
    if (new Date(app.dateTime) < new Date()) {
      return <span className="px-2.5 py-1 rounded-full text-[9px] font-extrabold uppercase tracking-widest bg-gray-150 text-gray-500">Pasado</span>
    }
    return <span className="px-2.5 py-1 rounded-full text-[9px] font-extrabold uppercase tracking-widest bg-[#F4C443] text-black">Reservado</span>
  }

  const renderAppList = (list: AppointmentData[]) => {
    if (list.length === 0) {
      return (
        <div className="p-10 border border-dashed border-black/10 rounded-[30px] text-center bg-white/20">
          <AlertCircle className="h-8 w-8 text-black/30 mx-auto mb-3" />
          <p className="text-sm font-medium text-black/45">No se encontraron citas en esta categoría.</p>
        </div>
      )
    }

    return (
      <div className="space-y-4">
        {list.map((app) => {
          const appDate = new Date(app.dateTime)
          const canCancel = app.status === "RESERVED" && appDate >= new Date()

          return (
            <div 
              key={app.id} 
              className="bg-white/40 border border-white/50 p-6 rounded-[28px] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 transition-all hover:bg-white/60"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-[#F4C443]/20 border border-[#F4C443]/30 flex items-center justify-center overflow-hidden shrink-0">
                  <AvatarDisplay avatar={app.doctor.user.avatar} name={`${app.doctor.user.name} ${app.doctor.user.lastName || ""}`} size="sm" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-bold text-base text-black">
                    Dr. {app.doctor.user.name} {app.doctor.user.lastName}
                  </h4>
                  <p className="text-[10px] uppercase font-bold tracking-widest text-[#E5B534]">
                    {app.doctor.specialty}
                  </p>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-black/60 pt-1 font-medium">
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

              <div className="flex items-center justify-between sm:justify-end gap-4 border-t sm:border-t-0 pt-3 sm:pt-0 border-black/5">
                {getStatusLabel(app)}
                
                {canCancel && (
                  <button
                    disabled={isPending}
                    onClick={() => handleCancel(app.id)}
                    className="h-9 px-4 rounded-xl text-[10px] font-bold uppercase tracking-widest bg-transparent hover:bg-red-50 text-red-600 hover:text-red-700 border border-red-200/50 hover:border-red-300 transition-all flex items-center gap-1 active:scale-95 disabled:opacity-50"
                  >
                    {isPending ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <>
                        <XCircle className="h-3.5 w-3.5" /> Cancelar
                      </>
                    )}
                  </button>
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
          onClick={() => setActiveTab("ACTIVE")}
          className={`pb-3 px-4 border-b-2 transition-all outline-none ${
            activeTab === "ACTIVE"
              ? "border-black text-black font-black"
              : "border-transparent hover:text-black"
          }`}
        >
          Próximas Citas ({activeApps.length})
        </button>
        <button
          onClick={() => setActiveTab("PAST")}
          className={`pb-3 px-4 border-b-2 transition-all outline-none ${
            activeTab === "PAST"
              ? "border-black text-black font-black"
              : "border-transparent hover:text-black"
          }`}
        >
          Historial y Canceladas ({pastApps.length})
        </button>
      </div>

      {/* Contenido */}
      <div>
        {activeTab === "ACTIVE" ? renderAppList(activeApps) : renderAppList(pastApps)}
      </div>
    </div>
  )
}
