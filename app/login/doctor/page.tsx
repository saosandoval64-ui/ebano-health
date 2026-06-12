import { X, ShieldCheck, Stethoscope } from "lucide-react"
import Link from "next/link"
import LoginFormClient from "../../../components/auth/LoginFormClient"

export default function DoctorLoginPage() {
  return (
    <div className="min-h-screen bg-[#FDF6CD] text-black font-sans antialiased flex flex-col justify-between selection:bg-[#E2CE7D]">
      <div className="w-full max-w-7xl mx-auto px-6 pt-6 flex items-center justify-end z-10">
        <Link
          href="/"
          className="h-9 w-9 rounded-full bg-black/5 hover:bg-black/10 flex items-center justify-center text-black/70 hover:text-black border border-black/5 link-transition button-click"
          aria-label="Volver"
        >
          <X className="h-4 w-4" />
        </Link>
      </div>

      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-[440px] bg-black/5 p-8 sm:p-10 rounded-[32px] border border-black/10 shadow-sm flex flex-col justify-between">
          <div className="text-center mb-8">
            <span className="text-2xl font-serif font-black tracking-tight block mb-2">
              Ébano<span className="text-[#A2B676]">.</span>
            </span>
            <div className="inline-flex items-center gap-1.5 bg-black/5 rounded-full px-3 py-1 text-[10px] uppercase font-bold tracking-wider text-black/60 mb-4">
              <Stethoscope className="h-3 w-3 text-[#A2B676]" />
              Portal Médico
            </div>
            <h1 className="text-2xl font-serif font-black tracking-tight text-black">
              ¡Hola, Doctor!
            </h1>
          </div>

          <LoginFormClient
            role="doctor"
            placeholders={{ email: "medico@ebano.com" }}
          />

          <div className="mt-8 pt-6 border-t border-black/5 text-center">
            <p className="text-xs font-medium text-black/50">
              ¿No tienes cuenta?{" "}
              <Link href="/register/doctor" className="font-bold underline decoration-[#A2B676] link-transition hover:text-black">
                Regístrate
              </Link>
            </p>
          </div>
        </div>
      </main>

      <footer className="w-full py-4 shrink-0 flex flex-col items-center justify-center gap-1 text-[11px] text-black/30 font-medium">
        <div className="flex items-center justify-center gap-1.5">
          <ShieldCheck className="h-3.5 w-3.5" /> Encriptación de datos de salud
        </div>
      </footer>
    </div>
  )
}