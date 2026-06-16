"use client"

import { useState, useTransition } from "react"
import { cancelAppointment } from "../../actions/appointments"
import { Loader2, XCircle, AlertCircle, Calendar, Clock } from "lucide-react"

interface AppointmentData {
  id: string
  dateTime: Date
  status: "PENDING" | "RESERVED" | "COMPLETED" | "CANCELLED"
  patient: {
    name: string
    lastName: string | null
  }
  doctor: {
    specialty: string
    user: {
      name: string
      lastName: string | null
    }
  }
}

interface AdminAppointmentsListProps {
  initialAppointments: AppointmentData[]
}

export default function AdminAppointmentsList({ initialAppointments }: AdminAppointmentsListProps) {
  const [appointments, setAppointments] = useState<AppointmentData[]>(initialAppointments)
  const [isPending, startTransition] = useTransition()
  const [message, setMessage] = useState("")

  const handleCancel = (appId: string) => {
    if (!confirm("¿Deseas cancelar este turno administrativamente?")) return
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

  const getStatusLabel = (status: string, appDate: Date) => {
    if (status === "CANCELLED") {
      return <span className="px-2.5 py-1 rounded-full text-[9px] font-extrabold uppercase tracking-widest bg-red-100 text-red-700">Cancelado</span>
    }
    if (status === "COMPLETED") {
      return <span className="px-2.5 py-1 rounded-full text-[9px] font-extrabold uppercase tracking-widest bg-green-100 text-green-700">Completado</span>
    }
    if (new Date(appDate) < new Date()) {
      return <span className="px-2.5 py-1 rounded-full text-[9px] font-extrabold uppercase tracking-widest bg-gray-100 text-gray-500 font-bold">Pasado</span>
    }
    return <span className="px-2.5 py-1 rounded-full text-[9px] font-extrabold uppercase tracking-widest bg-[#F4C443] text-black font-bold">Reservado</span>
  }

  return (
    <div className="space-y-6">
      {message && (
        <p className="text-red-500 text-xs font-bold bg-red-50 border border-red-150 p-3 rounded-xl">{message}</p>
      )}

      {appointments.length === 0 ? (
        <div className="p-12 border border-dashed border-gray-200 rounded-2xl text-center bg-gray-50">
          <AlertCircle className="h-10 w-10 text-black/30 mx-auto mb-4" />
          <p className="text-sm font-medium text-black/40">No hay turnos registrados en el sistema.</p>
        </div>
      ) : (
        <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left text-sm text-black">
              <thead>
                <tr className="border-b border-black/5 bg-black/5 text-[10px] uppercase font-bold tracking-wider text-black/60">
                  <th className="py-4 px-6">Paciente</th>
                  <th className="py-4 px-6">Médico</th>
                  <th className="py-4 px-6">Especialidad</th>
                  <th className="py-4 px-6">Fecha y Hora</th>
                  <th className="py-4 px-6">Estado</th>
                  <th className="py-4 px-6 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/5">
                {appointments.map((app) => {
                  const appDate = new Date(app.dateTime)
                  const canCancel = app.status === "RESERVED" && appDate >= new Date()

                  return (
                    <tr key={app.id} className="hover:bg-white/40 transition-colors">
                      <td className="py-4 px-6 font-bold">
                        {app.patient.name} {app.patient.lastName}
                      </td>
                      <td className="py-4 px-6 font-semibold">
                        Dr. {app.doctor.user.name} {app.doctor.user.lastName}
                      </td>
                      <td className="py-4 px-6 text-xs font-bold text-black/50 uppercase tracking-widest">
                        {app.doctor.specialty}
                      </td>
                      <td className="py-4 px-6 text-xs font-semibold">
                        <div className="flex items-center gap-1.5 mb-0.5">
                          <Calendar className="h-3.5 w-3.5 opacity-50" />
                          <span>{appDate.toLocaleDateString("es-ES")}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-black/50 text-[10px]">
                          <Clock className="h-3.5 w-3.5 opacity-40" />
                          <span>{String(appDate.getHours()).padStart(2, "0")}:{String(appDate.getMinutes()).padStart(2, "0")} hs</span>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        {getStatusLabel(app.status, appDate)}
                      </td>
                      <td className="py-4 px-6 text-right">
                        {canCancel && (
                          <button
                            disabled={isPending}
                            onClick={() => handleCancel(app.id)}
                            className="h-8 px-3 rounded-lg border border-red-100 hover:bg-red-500 hover:border-red-500 hover:text-white flex items-center justify-center gap-1 text-xs text-red-600 transition-all cursor-pointer active:scale-95 disabled:opacity-50"
                          >
                            {isPending ? (
                              <Loader2 className="h-3 w-3 animate-spin" />
                            ) : (
                              <>
                                <XCircle className="h-3.5 w-3.5" /> Cancelar
                              </>
                            )}
                          </button>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
