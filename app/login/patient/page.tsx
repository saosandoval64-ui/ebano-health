import { X, ShieldCheck, User } from "lucide-react"
import Link from "next/link"
import LoginFormClient from "../../../components/auth/LoginFormClient"

export default function PatientLoginPage() {
  return (
    <div className="min-h-screen text-black font-sans antialiased flex flex-col justify-between">
      {/* Back Button */}
      <div className="w-full max-w-7xl mx-auto px-6 pt-6 flex items-center justify-end z-10">
        <Link
          href="/"
          className="h-10 w-10 rounded-2xl bg-white hover:bg-gray-50 flex items-center justify-center text-black shadow-sm border border-gray-100 hover:shadow-md transition-all button-click"
          aria-label="Volver"
        >
          <X className="w-5 h-5" />
        </Link>
      </div>

      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md animate-slideInUp">
          {/* Header */}
          <div className="text-center mb-8">
            <Link href="/" className="inline-flex items-center gap-2 mb-6">
              <div className="w-14 h-14 rounded-3xl overflow-hidden shadow-lg shadow-[#A2B676]/20">
                <img src="/avatars/avatar-4.svg" alt="Ébano" className="w-full h-full object-cover" />
              </div>
            </Link>
            <div className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-2xl shadow-sm border border-gray-100 mb-4">
              <User className="w-4 h-4 text-[#A2B676]" />
              <span className="text-xs font-bold uppercase tracking-wider text-gray-600">
                Portal Paciente
              </span>
            </div>
            <h1 className="text-3xl font-serif font-black text-black tracking-tight mb-2">
              Bienvenido de vuelta
            </h1>
            <p className="text-gray-600">
              Ingresa tus credenciales para continuar
            </p>
          </div>

          {/* Login Form Card */}
          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-xl">
            <LoginFormClient
              role="patient"
              placeholders={{ email: "paciente@ebano.com" }}
            />

            <div className="mt-8 pt-6 border-t border-gray-100 text-center">
              <p className="text-sm text-gray-500">
                ¿No tienes cuenta?{" "}
                <Link
                  href="/register/patient"
                  className="font-bold text-[#A2B676] hover:text-[#8B5A2B] transition-colors"
                >
                  Regístrate aquí
                </Link>
              </p>
            </div>
          </div>

          {/* Doctor Login Link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              ¿Eres médico?{" "}
              <Link
                href="/login/doctor"
                className="font-semibold text-black hover:text-gray-700 transition-colors"
              >
                Inicia sesión aquí
              </Link>
            </p>
          </div>
        </div>
      </main>

      <footer className="w-full py-6 text-center">
        <div className="flex items-center justify-center gap-2 text-xs text-gray-400 font-medium">
          <ShieldCheck className="w-4 h-4" />
          Datos seguros y encriptados
        </div>
      </footer>
    </div>
  )
}
