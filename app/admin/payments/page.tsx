import { getCurrentUser } from "../../../lib/auth"
import { redirect } from "next/navigation"
import { CreditCard, ShieldCheck, Settings2 } from "lucide-react"

export default async function AdminPaymentsPage() {
  const user = await getCurrentUser()
  if (!user || user.role !== "ADMIN") return redirect("/login")

  const mockPayments = [
    { id: "TX-9021", patient: "Juan Pérez", doctor: "Dra. Sofía Rodríguez", amount: 45.0, status: "Aprobado", date: "Hace 2 horas", gateway: "Stripe" },
    { id: "TX-9020", patient: "Carlos Gómez", doctor: "Dr. Mateo González", amount: 60.0, status: "Aprobado", date: "Hace 1 día", gateway: "PayPhone" },
    { id: "TX-9019", patient: "María López", doctor: "Dra. Sofía Rodríguez", amount: 45.0, status: "Aprobado", date: "Hace 2 días", gateway: "Stripe" },
    { id: "TX-9018", patient: "Ana Benítez", doctor: "Dr. Mateo González", amount: 60.0, status: "Fallido", date: "Hace 3 días", gateway: "Kushki" },
  ]

  return (
    <div className="space-y-8 font-sans text-black">
      {/* Encabezado */}
      <div className="space-y-1">
        <h1 className="text-3xl font-serif font-black tracking-tight">Pagos & Facturación</h1>
        <p className="text-sm font-medium text-black/60">
          Configuración de pasarelas de pago e historial de transacciones SaaS.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Columna Izquierda: Configuración de Pasarelas (2/3 de pantalla) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white/40 border border-white/50 p-6 sm:p-8 rounded-[32px] shadow-sm space-y-6">
            <h3 className="text-lg font-serif font-black text-black flex items-center gap-2">
              <Settings2 className="h-5 w-5 text-[#F4C443]" /> Integración de Pasarelas
            </h3>
            
            <div className="space-y-4">
              
              {/* Stripe */}
              <div className="border border-black/5 bg-white/60 p-5 rounded-2xl space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-[#635BFF]/10 flex items-center justify-center font-black text-[#635BFF]">S</div>
                    <div>
                      <h4 className="font-bold text-sm text-black">Stripe Integration</h4>
                      <p className="text-[10px] text-black/40 font-bold uppercase tracking-wider">Habilitar pagos globales con tarjetas</p>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-[9px] font-extrabold uppercase tracking-widest bg-green-100 text-green-700">Activo</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-semibold text-black/60">
                  <div>
                    <label className="text-[9px] uppercase font-bold tracking-wider text-black/50 block mb-1">Clave Publicable (Publishable Key)</label>
                    <input type="text" readOnly value="pk_test_51Nx...oP9" className="w-full rounded-xl border border-black/5 bg-black/5 h-10 px-3 outline-none cursor-not-allowed text-[11px]" />
                  </div>
                  <div>
                    <label className="text-[9px] uppercase font-bold tracking-wider text-black/50 block mb-1">Clave Secreta (Secret Key)</label>
                    <input type="password" readOnly value="sk_test_••••••••••••••" className="w-full rounded-xl border border-black/5 bg-black/5 h-10 px-3 outline-none cursor-not-allowed" />
                  </div>
                </div>
              </div>

              {/* PayPhone */}
              <div className="border border-black/5 bg-white/60 p-5 rounded-2xl space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-[#FA8B0C]/10 flex items-center justify-center font-black text-[#FA8B0C]">P</div>
                    <div>
                      <h4 className="font-bold text-sm text-black">PayPhone Latam</h4>
                      <p className="text-[10px] text-black/40 font-bold uppercase tracking-wider">Habilitar pagos móviles locales</p>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-[9px] font-extrabold uppercase tracking-widest bg-[#F4C443] text-black font-bold">Configuración</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-semibold text-black/60">
                  <div>
                    <label className="text-[9px] uppercase font-bold tracking-wider text-black/50 block mb-1">Client ID</label>
                    <input type="text" readOnly value="payphone_test_client_id_992" className="w-full rounded-xl border border-black/5 bg-black/5 h-10 px-3 outline-none cursor-not-allowed text-[11px]" />
                  </div>
                  <div>
                    <label className="text-[9px] uppercase font-bold tracking-wider text-black/50 block mb-1">Token de Autenticación</label>
                    <input type="password" readOnly value="token_••••••••••••••" className="w-full rounded-xl border border-black/5 bg-black/5 h-10 px-3 outline-none cursor-not-allowed" />
                  </div>
                </div>
              </div>

              {/* Kushki */}
              <div className="border border-black/5 bg-white/60 p-5 rounded-2xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-black/10 flex items-center justify-center font-black text-black">K</div>
                  <div>
                    <h4 className="font-bold text-sm text-black">Kushki Pagos</h4>
                    <p className="text-[10px] text-black/40 font-bold uppercase tracking-wider">Pasarela alternativa para Sudamérica</p>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-full text-[9px] font-extrabold uppercase tracking-widest bg-black/5 text-black/50">Desactivado</span>
              </div>

            </div>
          </div>
        </div>

        {/* Columna Derecha: Resumen de Ventas / Logs (1/3 de pantalla) */}
        <div className="space-y-6">
          <div className="bg-black text-[#FDF6CD] p-6 rounded-[32px] shadow-2xl space-y-6">
            <h3 className="text-lg font-serif font-black text-[#FDF6CD] flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-[#F4C443]" /> Transacciones
            </h3>

            <div className="space-y-4">
              {mockPayments.map((pay) => (
                <div key={pay.id} className="border-b border-white/10 pb-3 flex items-center justify-between last:border-0 last:pb-0">
                  <div>
                    <h5 className="font-bold text-xs text-[#FDF6CD]">{pay.patient}</h5>
                    <p className="text-[9px] text-[#FDF6CD]/40 font-bold uppercase tracking-wider">{pay.doctor}</p>
                    <span className="text-[8px] uppercase tracking-wider px-1.5 py-0.5 rounded bg-white/5 text-[#FDF6CD]/60 font-semibold">{pay.gateway}</span>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-black text-[#FDF6CD]">$ {pay.amount.toFixed(2)}</p>
                    <p className="text-[9px] text-[#FDF6CD]/40">{pay.date}</p>
                    <span className={`text-[8px] font-extrabold uppercase tracking-widest ${pay.status === "Aprobado" ? "text-[#F4C443]" : "text-red-400"}`}>
                      {pay.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-6 border-t border-white/10 flex items-center gap-1.5 text-[9px] text-[#FDF6CD]/30 font-semibold uppercase tracking-wider">
              <ShieldCheck className="h-4 w-4 text-[#F4C443]" /> Cumple con PCI-DSS y GDPR
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
