import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { Bell, Calendar, Heart, FileText, CheckCheck } from "lucide-react"
import { markAllAsRead } from "@/app/actions/notifications"

const TYPE_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  APPOINTMENT_REMINDER: Calendar,
  APPOINTMENT_CONFIRMED: Calendar,
  APPOINTMENT_RESCHEDULED: Calendar,
  FOLLOW_UP: Heart,
  MEDICATION: FileText,
  GENERAL: Bell,
}

const TYPE_COLORS: Record<string, string> = {
  APPOINTMENT_REMINDER: "bg-[#F4C443]/15 text-[#F4C443]",
  APPOINTMENT_CONFIRMED: "bg-emerald-50 text-emerald-500",
  APPOINTMENT_RESCHEDULED: "bg-amber-50 text-amber-500",
  FOLLOW_UP: "bg-rose-50 text-rose-400",
  MEDICATION: "bg-[#8B5A2B]/10 text-[#8B5A2B]",
  GENERAL: "bg-black/5 text-black/50",
}

function getRelativeTime(date: Date): string {
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffSec = Math.floor(diffMs / 1000)
  const diffMin = Math.floor(diffSec / 60)
  const diffHr = Math.floor(diffMin / 60)
  const diffDay = Math.floor(diffHr / 24)

  if (diffMin < 1) return "Ahora mismo"
  if (diffMin < 60) return `Hace ${diffMin} min`
  if (diffHr < 24) return `Hace ${diffHr} hora${diffHr > 1 ? "s" : ""}`
  if (diffDay < 7) return `Hace ${diffDay} día${diffDay > 1 ? "s" : ""}`
  return date.toLocaleDateString("es-ES", { day: "numeric", month: "short" })
}

export default async function PatientNotificationsPage() {
  const session = await auth()
  if (!session?.user) return null

  const notifications = await db.notification.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
  })

  const hasUnread = notifications.some((n) => !n.read)

  return (
    <div className="max-w-5xl mx-auto px-8 pt-8 pb-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="text-xs font-bold text-black/40 uppercase tracking-widest mb-1">Mantenerte informado</p>
          <h1 className="text-3xl font-serif font-black text-black tracking-tight">
            Notificaciones
          </h1>
        </div>
        {hasUnread && (
          <form action={markAllAsRead}>
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-black/5 text-black rounded-xl font-bold text-xs hover:bg-black/10 transition-all active:scale-[0.98]"
            >
              <CheckCheck className="w-4 h-4" />
              Marcar todo como leído
            </button>
          </form>
        )}
      </div>

      {notifications.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24">
          <div className="w-20 h-20 rounded-2xl bg-black/5 flex items-center justify-center mb-6">
            <Bell className="w-10 h-10 text-black/20" />
          </div>
          <h2 className="text-lg font-black text-black mb-2">Sin notificaciones</h2>
          <p className="text-sm text-black/40 font-medium">Cuando tengas novedades, aparecerán aquí.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map((notification) => {
            const Icon = TYPE_ICONS[notification.type] || Bell
            const colorClass = TYPE_COLORS[notification.type] || TYPE_COLORS.GENERAL

            return (
              <div
                key={notification.id}
                className={`bg-white p-5 rounded-2xl border shadow-sm flex items-start gap-4 transition-all ${
                  notification.read ? "border-gray-100" : "border-[#F4C443]/30"
                }`}
              >
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${colorClass}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-black text-sm text-black truncate">{notification.title}</h3>
                    {!notification.read && (
                      <span className="w-2 h-2 rounded-full bg-[#F4C443] shrink-0" />
                    )}
                  </div>
                  <p className="text-xs text-black/50 font-medium leading-relaxed">{notification.message}</p>
                </div>
                <span className="text-[10px] text-black/30 font-bold shrink-0 pt-0.5">
                  {getRelativeTime(notification.createdAt)}
                </span>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
