import { getCurrentUser } from "../../../lib/auth"
import { redirect } from "next/navigation"
import { ShieldCheck, Database, Calendar, Server } from "lucide-react"

export default async function AdminSettingsPage() {
  const user = await getCurrentUser()
  if (!user || user.role !== "ADMIN") return redirect("/login")

  return (
    <div className="max-w-5xl mx-auto px-8 pt-8 pb-8 space-y-8 font-sans text-black">
      {/* Encabezado */}
      <div className="space-y-1">
        <h1 className="text-3xl font-serif font-black tracking-tight">Configuración Global</h1>
        <p className="text-sm font-medium text-black/60">
          Gestiona integraciones del sistema, credenciales de sincronización y estado del servidor.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Columna Izquierda: Google Calendar & Servidor (2/3 de pantalla) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Google Calendar Sync */}
          <div className="bg-white border border-gray-100 p-6 sm:p-8 rounded-2xl shadow-sm space-y-6">
            <h3 className="text-lg font-serif font-black text-black flex items-center gap-2">
              <Calendar className="h-5 w-5 text-[#F4C443]" /> Integración con Google Calendar
            </h3>
            <p className="text-xs text-black/50 font-medium leading-relaxed">
              Sincroniza automáticamente los turnos de Ébano Health con los calendarios de los médicos. Cada vez que un paciente reserva o cancela, se actualizará el calendario del doctor en tiempo real.
            </p>
            
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-semibold text-black/60">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-black/50 pl-1 block">Google OAuth Client ID</label>
                  <input type="text" readOnly value="68392019-ebano-health.apps.googleusercontent.com" className="w-full rounded-xl border border-black/5 bg-black/5 h-10 px-3 outline-none cursor-not-allowed text-[11px]" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-black/50 pl-1 block">Google OAuth Client Secret</label>
                  <input type="password" readOnly value="GOCSPX-••••••••••••••" className="w-full rounded-xl border border-black/5 bg-black/5 h-10 px-3 outline-none cursor-not-allowed" />
                </div>
              </div>
              <div className="flex items-center justify-between pt-2">
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#E5B534] bg-[#F4C443]/10 border border-[#F4C443]/20 px-3 py-1 rounded-full">Sincronización Activa</span>
              </div>
            </div>
          </div>

          {/* Configuración del Sistema */}
          <div className="bg-white border border-gray-100 p-6 sm:p-8 rounded-2xl shadow-sm space-y-6">
            <h3 className="text-lg font-serif font-black text-black flex items-center gap-2">
              <Server className="h-5 w-5 text-[#F4C443]" /> Configuración del Servidor
            </h3>
            <div className="grid grid-cols-2 gap-4 text-xs font-semibold text-black/60">
              <div className="border border-black/5 bg-white/30 p-4 rounded-2xl">
                <span className="text-[9px] uppercase font-bold tracking-widest text-black/40 block mb-1">Node Engine</span>
                <span className="text-black font-bold">NodeJS v22.22</span>
              </div>
              <div className="border border-black/5 bg-white/30 p-4 rounded-2xl">
                <span className="text-[9px] uppercase font-bold tracking-widest text-black/40 block mb-1">Entorno (Environment)</span>
                <span className="text-black font-bold">development</span>
              </div>
            </div>
          </div>

        </div>

        {/* Columna Derecha: Base de datos y Mantenimiento (1/3 de pantalla) */}
        <div className="space-y-6">
          <div className="bg-black text-[#FDF6CD] p-6 rounded-[32px] shadow-2xl space-y-6">
            <h3 className="text-lg font-serif font-black text-[#FDF6CD] flex items-center gap-2">
              <Database className="h-5 w-5 text-[#F4C443]" /> Base de Datos & Backups
            </h3>
            
            <div className="space-y-4">
              <div>
                <p className="text-[10px] uppercase font-bold tracking-widest text-[#FDF6CD]/60 mb-2">Salud de la DB</p>
                <div className="bg-white/5 border border-white/10 p-4 rounded-2xl flex items-center justify-between text-xs font-bold uppercase tracking-wider">
                  <span>Conexiones Activas</span>
                  <span className="text-[#F4C443]">Saludable (4)</span>
                </div>
              </div>

              <div>
                <p className="text-[10px] uppercase font-bold tracking-widest text-[#FDF6CD]/60 mb-2">Última Copia de Seguridad</p>
                <div className="bg-white/5 border border-white/10 p-4 rounded-2xl text-xs font-bold uppercase tracking-wider space-y-1">
                  <div className="flex items-center justify-between">
                    <span>Automático</span>
                    <span className="text-[#F4C443]">Completado</span>
                  </div>
                  <p className="text-[9px] text-[#FDF6CD]/40 normal-case">Hace 6 horas (Backup_Ebano_2026-06-03.sql)</p>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-white/10 flex items-center gap-1.5 text-[9px] text-[#FDF6CD]/30 font-semibold uppercase tracking-wider">
              <ShieldCheck className="h-4 w-4 text-[#F4C443]" /> Encriptación AES-256 en reposo
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
