import { ShieldCheck, ClipboardList, ArrowLeft } from "lucide-react"
import Link from "next/link"
import LoginFormClient from "../../../components/auth/LoginFormClient"

export default function SecretaryLoginPage() {
  return (
    <div className="min-h-screen text-black font-sans antialiased flex flex-col bg-white">
      <div className="relative bg-[#F4C443] pt-8 pb-20 px-6 rounded-b-[40px]">
        <div className="flex items-center justify-between mb-8">
          <Link
            href="/"
            className="h-10 w-10 rounded-full bg-black/10 flex items-center justify-center text-black hover:bg-black/20 transition-all"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <span className="text-xs font-bold uppercase tracking-wider text-black/40">
            Secretaria
          </span>
        </div>

        <div className="flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-3xl overflow-hidden shadow-lg mb-4">
            <img src="/avatars/avatar-4.svg" alt="Ébano" className="w-full h-full object-cover" />
          </div>
          <h1 className="text-3xl font-serif font-black text-black tracking-tight mb-1">
            Panel Secretaria
          </h1>
          <p className="text-sm text-black/60 font-medium">
            Portal de Secretaria Ébano Health
          </p>
        </div>
      </div>

      <main className="flex-1 -mt-10 px-4 pb-8 relative z-10">
        <div className="w-full max-w-md mx-auto">
          <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-xl">
            <div className="inline-flex items-center gap-2 bg-black/5 px-4 py-2 rounded-2xl mb-6">
              <ClipboardList className="w-4 h-4 text-black" />
              <span className="text-xs font-bold uppercase tracking-wider text-black/70">
                Panel de Secretaria
              </span>
            </div>

            <LoginFormClient
              role="secretary"
              placeholders={{ email: "secretaria@ebano.com" }}
            />
          </div>

          <div className="mt-6 text-center">
            <p className="text-xs text-black/40 font-medium">
              Acceso para personal administrativo y secretarias.
            </p>
          </div>
        </div>
      </main>

      <footer className="w-full py-4 text-center">
        <div className="flex items-center justify-center gap-2 text-xs text-black/30 font-medium">
          <ShieldCheck className="w-4 h-4" />
          Encriptación de datos de salud
        </div>
      </footer>
    </div>
  )
}
