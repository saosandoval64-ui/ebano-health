import { ShieldCheck, Stethoscope, ArrowLeft } from "lucide-react"
import Link from "next/link"
import LoginFormClient from "../../../components/auth/LoginFormClient"

export default function DoctorLoginPage() {
  return (
    <div className="min-h-screen text-black font-sans antialiased flex flex-col bg-[#FDF6CD]">
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
            href="/register/doctor"
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
            ¡Hola, Doctor!
          </h1>
          <p className="text-sm text-black/60 font-medium">
            Portal de médicos Ébano Health
          </p>
        </div>
      </div>

      {/* Login Form Card */}
      <main className="flex-1 -mt-10 px-4 pb-8 relative z-10">
        <div className="w-full max-w-md mx-auto">
          <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-xl">
            {/* Role Badge */}
            <div className="inline-flex items-center gap-2 bg-[#8B5A2B]/10 px-4 py-2 rounded-2xl mb-6">
              <Stethoscope className="w-4 h-4 text-[#8B5A2B]" />
              <span className="text-xs font-bold uppercase tracking-wider text-black/70">
                Portal Médico
              </span>
            </div>

            <LoginFormClient
              role="doctor"
              placeholders={{ email: "medico@ebano.com" }}
            />

            {/* Forgot Password */}
            <div className="mt-4 text-right">
              <Link href="#" className="text-xs font-medium text-black/50 hover:text-black transition-colors">
                ¿Olvidaste tu contraseña?
              </Link>
            </div>

            {/* Divider */}
            <div className="flex items-center gap-4 my-6">
              <div className="flex-1 h-px bg-gray-100" />
              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">o</span>
              <div className="flex-1 h-px bg-gray-100" />
            </div>

            {/* Social Login Buttons */}
            <div className="space-y-3">
              <button className="w-full flex items-center justify-center gap-3 h-11 rounded-2xl border border-gray-200 bg-white hover:bg-gray-50 text-sm font-medium text-black/70 transition-all">
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                Continuar con Google
              </button>
              <button className="w-full flex items-center justify-center gap-3 h-11 rounded-2xl border border-gray-200 bg-white hover:bg-gray-50 text-sm font-medium text-black/70 transition-all">
                <svg className="w-5 h-5" fill="#1877F2" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                Continuar con Facebook
              </button>
            </div>
          </div>

          {/* Links */}
          <div className="mt-6 space-y-3 text-center">
            <p className="text-sm text-black/60">
              ¿No tienes cuenta?{" "}
              <Link
                href="/register/doctor"
                className="font-bold text-black hover:text-[#F4C443] transition-colors"
              >
                Regístrate aquí
              </Link>
            </p>
            <p className="text-sm text-black/60">
              ¿Eres paciente?{" "}
              <Link
                href="/login/patient"
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
