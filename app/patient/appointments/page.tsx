import { db } from "../../../lib/db"
import { getCurrentUser } from "../../../lib/auth"
import ClientAppointmentsList from "./ClientAppointmentsList"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

export default async function PatientAppointmentsPage() {
  const user = await getCurrentUser()
  if (!user) return null

  const appointments = await db.appointment.findMany({
    where: {
      patientId: user.id,
    },
    include: {
      doctor: {
        include: {
          user: {
            select: { name: true, lastName: true, avatar: true },
          },
        },
      },
    },
    orderBy: {
      dateTime: "desc",
    },
  })

  return (
    <div className="space-y-8 font-sans text-black">
      {/* Encabezado */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-serif font-black tracking-tight">Mis Turnos</h1>
          <p className="text-sm font-medium text-black/60">
            Administra tus consultas agendadas e historial médico.
          </p>
        </div>

        <Button asChild className="rounded-full bg-[#F4C443] hover:bg-[#E5B534] text-white border border-black/5 px-6 py-4 font-bold text-xs uppercase tracking-wider shadow-sm transition-transform active:scale-95 sm:self-center self-start">
          <Link href="/especialistas" className="flex items-center gap-1.5">
            <Plus className="h-4 w-4" /> Reservar Turno
          </Link>
        </Button>
      </div>

      {/* Lista Interactiva de Turnos */}
      <ClientAppointmentsList initialAppointments={appointments} />
    </div>
  )
}
