import { auth } from "../../../lib/auth"
import { db } from "../../../lib/db"
import { redirect } from "next/navigation"
import { BarChart3, Users, Stethoscope, Calendar, TrendingUp, DollarSign } from "lucide-react"

export default async function AdminReportsPage() {
  const session = await auth()
  if (!session?.user || session.user.role !== "ADMIN") {
    return redirect("/login/admin")
  }

  const doctorCount = await db.user.count({ where: { role: "DOCTOR" } })
  const patientCount = await db.user.count({ where: { role: "PATIENT" } })
  const appointmentCount = await db.appointment.count()

  const appointmentsByStatus = await db.appointment.groupBy({
    by: ["status"],
    _count: { status: true },
  })

  const statusMap: Record<string, number> = {}
  for (const entry of appointmentsByStatus) {
    statusMap[entry.status] = entry._count.status
  }

  const now = new Date()
  const monthlyData: { label: string; count: number }[] = []
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    const nextD = new Date(now.getFullYear(), now.getMonth() - i + 1, 1)
    const label = d.toLocaleDateString("es-ES", { month: "short" })
    const count = await db.appointment.count({
      where: {
        dateTime: { gte: d, lt: nextD },
      },
    })
    monthlyData.push({ label, count })
  }

  const topDoctors = await db.appointment.groupBy({
    by: ["doctorId"],
    _count: { doctorId: true },
    orderBy: { _count: { doctorId: "desc" } },
    take: 5,
  })

  const topDoctorsWithNames = await Promise.all(
    topDoctors.map(async (entry) => {
      const profile = await db.doctorProfile.findUnique({
        where: { id: entry.doctorId },
        include: { user: { select: { name: true, lastName: true } } },
      })
      return {
        name: `Dr. ${profile?.user.name ?? "Desconocido"} ${profile?.user.lastName ?? ""}`.trim(),
        specialty: profile?.specialty ?? "",
        count: entry._count.doctorId,
      }
    })
  )

  const maxDoctorCount = Math.max(...topDoctorsWithNames.map((d) => d.count), 1)
  const maxMonthlyCount = Math.max(...monthlyData.map((m) => m.count), 1)

  const totalStatusCount =
    (statusMap["RESERVED"] ?? 0) + (statusMap["COMPLETED"] ?? 0) + (statusMap["CANCELLED"] ?? 0)

  return (
    <div className="max-w-5xl mx-auto px-8 pt-8 pb-8 space-y-8 font-sans text-black">
      <div className="space-y-1">
        <h1 className="text-3xl font-serif font-black tracking-tight">Reportes y Estadísticas</h1>
        <p className="text-sm font-medium text-black/60">
          Resumen general del rendimiento y actividad de la plataforma.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-white border border-gray-100 p-6 rounded-2xl shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-[#F4C443]/20 flex items-center justify-center">
              <Stethoscope className="h-5 w-5 text-black" />
            </div>
            <p className="text-[10px] uppercase font-bold tracking-widest text-black/50">Especialistas</p>
          </div>
          <h3 className="text-3xl font-serif font-black">{doctorCount}</h3>
          <p className="text-xs text-black/40 mt-1">Doctores registrados</p>
        </div>

        <div className="bg-white border border-gray-100 p-6 rounded-2xl shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-black/5 flex items-center justify-center">
              <Users className="h-5 w-5 text-black/60" />
            </div>
            <p className="text-[10px] uppercase font-bold tracking-widest text-black/50">Pacientes</p>
          </div>
          <h3 className="text-3xl font-serif font-black">{patientCount}</h3>
          <p className="text-xs text-black/40 mt-1">Pacientes registrados</p>
        </div>

        <div className="bg-white border border-gray-100 p-6 rounded-2xl shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-black/5 flex items-center justify-center">
              <Calendar className="h-5 w-5 text-black/60" />
            </div>
            <p className="text-[10px] uppercase font-bold tracking-widest text-black/50">Turnos</p>
          </div>
          <h3 className="text-3xl font-serif font-black">{appointmentCount}</h3>
          <p className="text-xs text-black/40 mt-1">Turnos totales</p>
        </div>

        <div className="bg-white border border-gray-100 p-6 rounded-2xl shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-[#F4C443]/20 flex items-center justify-center">
              <DollarSign className="h-5 w-5 text-black" />
            </div>
            <p className="text-[10px] uppercase font-bold tracking-widest text-black/50">Ingresos</p>
          </div>
          <h3 className="text-3xl font-serif font-black">${doctorCount * 49}</h3>
          <p className="text-xs text-black/40 mt-1">Estimado mensual</p>
        </div>

        <div className="bg-white border border-gray-100 p-6 rounded-2xl shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-black/5 flex items-center justify-center">
              <TrendingUp className="h-5 w-5 text-black/60" />
            </div>
            <p className="text-[10px] uppercase font-bold tracking-widest text-black/50">Actividad</p>
          </div>
          <h3 className="text-3xl font-serif font-black">{totalStatusCount}</h3>
          <p className="text-xs text-black/40 mt-1">Turnos clasificados</p>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Appointments by Status */}
        <div className="bg-white border border-gray-100 p-6 rounded-2xl shadow-sm">
          <div className="flex items-center gap-2 mb-6">
            <BarChart3 className="h-4 w-4 text-[#F4C443]" />
            <h2 className="text-sm font-serif font-black tracking-tight">Turnos por Estado</h2>
          </div>
          <div className="space-y-4">
            {[
              { label: "Reservados", key: "RESERVED", color: "bg-[#F4C443]" },
              { label: "Completados", key: "COMPLETED", color: "bg-green-500" },
              { label: "Cancelados", key: "CANCELLED", color: "bg-red-400" },
            ].map((status) => {
              const count = statusMap[status.key] ?? 0
              const pct = totalStatusCount > 0 ? (count / totalStatusCount) * 100 : 0
              return (
                <div key={status.key}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-bold text-black/60">{status.label}</span>
                    <span className="text-xs font-black text-black">{count}</span>
                  </div>
                  <div className="w-full h-3 bg-black/5 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${status.color}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Monthly Appointments */}
        <div className="bg-white border border-gray-100 p-6 rounded-2xl shadow-sm">
          <div className="flex items-center gap-2 mb-6">
            <Calendar className="h-4 w-4 text-[#F4C443]" />
            <h2 className="text-sm font-serif font-black tracking-tight">Turnos por Mes</h2>
          </div>
          <div className="space-y-3">
            {monthlyData.map((month) => {
              const pct = (month.count / maxMonthlyCount) * 100
              return (
                <div key={month.label}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-black/60 capitalize">{month.label}</span>
                    <span className="text-xs font-black text-black">{month.count}</span>
                  </div>
                  <div className="w-full h-3 bg-black/5 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-black/20 rounded-full"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Top Doctors */}
      <div className="bg-white border border-gray-100 p-6 rounded-2xl shadow-sm">
        <div className="flex items-center gap-2 mb-6">
          <Stethoscope className="h-4 w-4 text-[#F4C443]" />
          <h2 className="text-sm font-serif font-black tracking-tight">Top 5 Especialistas por Turnos</h2>
        </div>
        {topDoctorsWithNames.length === 0 ? (
          <p className="text-xs text-black/40 text-center py-4">No hay datos disponibles</p>
        ) : (
          <div className="space-y-4">
            {topDoctorsWithNames.map((doc) => {
              const pct = (doc.count / maxDoctorCount) * 100
              return (
                <div key={doc.name}>
                  <div className="flex items-center justify-between mb-1.5">
                    <div>
                      <span className="text-xs font-bold text-black">{doc.name}</span>
                      {doc.specialty && (
                        <span className="text-[10px] text-black/40 ml-2">· {doc.specialty}</span>
                      )}
                    </div>
                    <span className="text-xs font-black text-black">{doc.count} turnos</span>
                  </div>
                  <div className="w-full h-3 bg-black/5 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#F4C443] rounded-full"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}