import { X, Stethoscope, User } from "lucide-react"
import Link from "next/link"

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-[#FDF6CD] text-black font-sans antialiased flex flex-col justify-between selection:bg-[#E2CE7D]">
      {/* Close Button */}
      <div className="w-full max-w-7xl mx-auto px-6 pt-6 flex items-center justify-end z-10 animate-slideInDown">
        <Link
          href="/"
          className="h-9 w-9 rounded-full bg-black/5 hover:bg-black/10 flex items-center justify-center text-black/70 hover:text-black border border-black/5 link-transition button-click"
        >
          <X className="h-4 w-4" />
        </Link>
      </div>

      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-[600px] animate-fadeInScale">
          <div className="text-center mb-12">
            <span className="text-2xl font-serif font-black tracking-tight block mb-2">
              Ébano<span className="text-[#A2B676]">.</span>
            </span>
            <h1 className="text-3xl font-serif font-black tracking-tight text-black mb-2">
              Crear Cuenta
            </h1>
            <p className="text-sm text-black/60">
              Selecciona tu tipo de cuenta para guardar tus datos en el portal correcto.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Link
              href="/register/patient"
              className="group p-8 rounded-2xl border-2 border-black/10 bg-white/50 hover:bg-white hover:border-[#A2B676] transition-all duration-300 flex flex-col items-center justify-center gap-4 animate-slideInLeft button-click"
            >
              <div className="w-16 h-16 rounded-full bg-black/5 group-hover:bg-[#A2B676]/10 flex items-center justify-center transition-colors">
                <User className="w-8 h-8 text-black group-hover:text-[#A2B676]" />
              </div>
              <div>
                <h2 className="font-bold text-lg text-black">Soy Paciente</h2>
                <p className="text-xs text-black/50 mt-1">
                  Busca especialistas y agenda citas.
                </p>
              </div>
            </Link>

            <Link
              href="/register/doctor"
              className="group p-8 rounded-2xl border-2 border-black/10 bg-white/50 hover:bg-white hover:border-[#A2B676] transition-all duration-300 flex flex-col items-center justify-center gap-4 animate-slideInRight button-click"
            >
              <div className="w-16 h-16 rounded-full bg-black/5 group-hover:bg-[#A2B676]/10 flex items-center justify-center transition-colors">
                <Stethoscope className="w-8 h-8 text-black group-hover:text-[#A2B676]" />
              </div>
              <div>
                <h2 className="font-bold text-lg text-black">Soy Médico</h2>
                <p className="text-xs text-black/50 mt-1">
                  Crea tu perfil profesional y administra tu agenda.
                </p>
              </div>
            </Link>
          </div>
        </div>
      </main>

      <footer className="w-full py-4 text-center text-[11px] text-black/30 font-medium flex items-center justify-center gap-1.5">
        <span>🔒</span> Encriptación de datos de salud
      </footer>
    </div>
  )
}
