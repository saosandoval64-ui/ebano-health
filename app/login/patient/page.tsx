import { X, ShieldCheck, User, ArrowLeft } from "lucide-react"
import Link from "next/link"
import LoginFormClient from "../../../components/auth/LoginFormClient"

export default function PatientLoginPage() {
  return (
    <div className="min-h-screen text-black font-sans antialiased flex flex-col bg-white">
      {/* Yellow Hero Section */}
      <div className="relative bg-[#F4C443] pt-8 pb-20 px-6 rounded-b-[40px]">
        <div className="flex items-center justify-between mb-8">
          <Link
            href="/"
            className="h-10 w-10 rounded-full bg-black/10 flex items-center justify-center text-black hover:bg-black/20 transition-all"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <Link
            href="/register/patient"
            className="text-xs font-bold uppercase tracking-wider text-black/70 hover:text-black transition-colors"
          >
            Register
          </Link>
        </div>

        <div className="flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-3xl overflow-hidden shadow-lg mb-4">
            <img src="/avatars/avatar-4.svg" alt="Ébano" className="w-full h-full object-cover" />
          </div>
          <h1 className="text-3xl font-serif font-black text-black tracking-tight mb-1">
            Bienvenido
          </h1>
          <p className="text-sm text-black/60 font-medium">
            Portal de pacientes Ébano Health
          </p>
        </div>
      </div>

      {/* Login Form Card */}
      <main className="flex-1 -mt-10 px-4 pb-8 relative z-10">
        <div className="w-full max-w-md mx-auto">
          <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-xl">
            {/* Role Badge */}
            <div className="inline-flex items-center gap-2 bg-[#F4C443]/10 px-4 py-2 rounded-2xl mb-6">
              <User className="w-4 h-4 text-[#F4C443]" />
              <span className="text-xs font-bold uppercase tracking-wider text-black/70">
                Portal Paciente
              </span>
            </div>

            <LoginFormClient
              role="patient"
              placeholders={{ email: "paciente@ebano.com" }}
            />


          </div>

          {/* Links */}
          <div className="mt-6 space-y-3 text-center">
            <p className="text-sm text-black/60">
              ¿No tienes cuenta?{" "}
              <Link
                href="/register/patient"
                className="font-bold text-black hover:text-[#F4C443] transition-colors"
              >
                Regístrate aquí
              </Link>
            </p>
            <p className="text-sm text-black/60">
              ¿Eres médico?{" "}
              <Link
                href="/login/doctor"
                className="font-semibold text-black hover:text-[#F4C443] transition-colors"
              >
                Inicia sesión aquí
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
