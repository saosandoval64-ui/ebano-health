import { ShieldCheck, User, Stethoscope, Building2 } from "lucide-react"
import Link from "next/link"

export default function LoginPage() {
  return (
    <div className="min-h-screen text-black font-sans antialiased flex flex-col bg-white">
      <div className="relative bg-[#F4C443] pt-8 pb-20 px-6 rounded-b-[40px]">
        <div className="flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-3xl overflow-hidden shadow-lg mb-4">
            <img src="/avatars/avatar-4.svg" alt="Ébano" className="w-full h-full object-cover" />
          </div>
          <h1 className="text-3xl font-serif font-black text-black tracking-tight mb-1">
            Iniciar Sesión
          </h1>
          <p className="text-sm text-black/60 font-medium">
            Selecciona tu tipo de cuenta
          </p>
        </div>
      </div>

      <main className="flex-1 -mt-10 px-4 pb-8 relative z-10">
        <div className="w-full max-w-md mx-auto space-y-4">
          <Link
            href="/login/patient"
            className="block bg-white p-6 rounded-3xl shadow-xl hover:shadow-2xl transition-all active:scale-[0.98] border border-gray-100"
          >
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-[#F4C443]/15 flex items-center justify-center shrink-0">
                <User className="w-7 h-7 text-[#F4C443]" />
              </div>
              <div className="flex-1">
                <h2 className="font-bold text-lg text-black">Soy Paciente</h2>
                <p className="text-xs text-black/50 mt-0.5">
                  Busca especialistas y agenda citas.
                </p>
              </div>
            </div>
          </Link>

          <Link
            href="/login/doctor"
            className="block bg-white p-6 rounded-3xl shadow-xl hover:shadow-2xl transition-all active:scale-[0.98] border border-gray-100"
          >
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-[#8B5A2B]/10 flex items-center justify-center shrink-0">
                <Stethoscope className="w-7 h-7 text-[#8B5A2B]" />
              </div>
              <div className="flex-1">
                <h2 className="font-bold text-lg text-black">Soy Médico</h2>
                <p className="text-xs text-black/50 mt-0.5">
                  Administra tu agenda y pacientes.
                </p>
              </div>
            </div>
          </Link>

          <Link
            href="/login/clinic-admin"
            className="block bg-white p-6 rounded-3xl shadow-xl hover:shadow-2xl transition-all active:scale-[0.98] border border-gray-100"
          >
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-[#6366f1]/10 flex items-center justify-center shrink-0">
                <Building2 className="w-7 h-7 text-[#6366f1]" />
              </div>
              <div className="flex-1">
                <h2 className="font-bold text-lg text-black">Soy Clínica / Hospital</h2>
                <p className="text-xs text-black/50 mt-0.5">
                  Gestiona tu clínica y médicos.
                </p>
              </div>
            </div>
          </Link>

          <div className="text-center pt-2">
            <p className="text-xs text-black/40">
              ¿No tienes cuenta?{" "}
              <Link href="/register" className="font-bold text-black hover:text-[#F4C443]">
                Regístrate
              </Link>
            </p>
          </div>
        </div>
      </main>

      <footer className="w-full py-4 text-center">
        <div className="flex items-center justify-center gap-2 text-xs text-black/30 font-medium">
          <ShieldCheck className="w-4 h-4" />
          Datos seguros y encriptados
        </div>
      </footer>
    </div>
  )
}
