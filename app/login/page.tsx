"use client"

import { useSearchParams, useRouter } from "next/navigation"
import { useState, Suspense, useTransition, memo } from "react"
import { X, ShieldCheck, Stethoscope, User, Loader2 } from "lucide-react"
import Link from "next/link"
import { loginUser } from "../actions/login"

// Skeleton de carga
const LoginSkeleton = memo(function LoginSkeleton() {
  return (
    <div className="min-h-screen bg-[#FDF6CD] text-black font-sans antialiased flex flex-col justify-between selection:bg-[#E2CE7D]">
      <div className="w-full max-w-7xl mx-auto px-6 pt-6 flex items-center justify-between">
        <div className="flex items-center gap-2 text-[10px] uppercase font-bold tracking-widest text-black/40">
          <span>Home</span>
          <span>/</span>
          <span className="text-black/70">Login</span>
        </div>
        <div className="h-9 w-9 rounded-full bg-black/5 border border-black/5" />
      </div>

      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-[440px] bg-black/5 p-8 sm:p-10 rounded-[32px] border border-black/10 shadow-sm flex flex-col gap-6 backdrop-blur-sm animate-pulse">
          <div className="text-center space-y-3">
            <div className="h-7 w-24 bg-black/10 rounded-full mx-auto" />
            <div className="h-4 w-32 bg-black/10 rounded-full mx-auto" />
            <div className="h-7 w-48 bg-black/10 rounded-full mx-auto" />
          </div>
          <div className="space-y-4">
            <div className="h-11 w-full bg-black/8 rounded-xl" />
            <div className="h-11 w-full bg-black/8 rounded-xl" />
            <div className="h-11 w-full bg-black/10 rounded-full" />
          </div>
        </div>
      </main>

      <footer className="w-full py-4 text-center text-[11px] text-black/30">
        <ShieldCheck className="inline h-3.5 w-3.5 mr-1" /> Encriptación de datos de salud
      </footer>
    </div>
  )
})

// Contenido real del Login
const LoginContent = memo(function LoginContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [message, setMessage] = useState("")

  const role = searchParams.get("role") === "doctor" ? "doctor" : "patient"
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget as HTMLFormElement)

    setMessage("")
    startTransition(async () => {
      const result = await loginUser(formData)
      if (result.success) {
        if (result.role === "ADMIN") {
          router.push("/admin/dashboard")
        } else if (result.role === "DOCTOR") {
          router.push("/doctor/dashboard")
        } else {
          router.push("/patient/dashboard")
        }
        router.refresh()
      } else {
        setMessage(result.message)
      }
    })
  }

  return (
    <div className="min-h-screen bg-[#FDF6CD] text-black font-sans antialiased flex flex-col justify-between selection:bg-[#E2CE7D] animate-fadeInScale">
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
        <div className="w-full max-w-[440px] bg-black/5 p-8 sm:p-10 rounded-[32px] border border-black/10 shadow-sm flex flex-col justify-between backdrop-blur-sm animate-slideInUp">
          {/* Header */}
          <div className="text-center mb-8">
            <span className="text-2xl font-serif font-black tracking-tight block mb-2">
              Ébano<span className="text-[#A2B676]">.</span>
            </span>

            <div className="inline-flex items-center gap-1.5 bg-black/5 rounded-full px-3 py-1 text-[10px] uppercase font-bold tracking-wider text-black/60 mb-4">
              {role === "doctor" ? (
                <>
                  <Stethoscope className="h-3 w-3 text-[#A2B676]" /> Portal Médico
                </>
              ) : (
                <>
                  <User className="h-3 w-3 text-[#A2B676]" /> Portal del Paciente
                </>
              )}
            </div>

            <h1 className="text-2xl font-serif font-black tracking-tight text-black">
              {role === "doctor" ? "¡Hola, Doctor!" : "Bienvenido de vuelta"}
            </h1>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <label htmlFor="email" className="text-xs font-bold uppercase tracking-wider text-black/70 pl-1 block">
                Correo Electrónico
              </label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="ejemplo@ebano.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-black/10 bg-white/50 focus:bg-white text-black h-11 px-4 text-sm outline-none focus:ring-2 focus:ring-[#A2B676] tab-transition"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="password" className="text-xs font-bold uppercase tracking-wider text-black/70 pl-1 block">
                Contraseña
              </label>
              <input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl border border-black/10 bg-white/50 focus:bg-white text-black h-11 px-4 text-sm outline-none focus:ring-2 focus:ring-[#A2B676] tab-transition"
              />
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="w-full rounded-full bg-black hover:bg-black/80 text-[#FDF6CD] font-bold text-xs tracking-wider uppercase h-11 shadow-sm link-transition active:scale-[0.98] mt-2 disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Ingresando...
                </>
              ) : (
                "Iniciar Sesión"
              )}
            </button>

            {message && (
              <p className="text-red-500 text-xs font-bold text-center bg-red-50 border border-red-100 p-3 rounded-xl animate-slideInDown">
                {message}
              </p>
            )}
          </form>

          {/* Footer interno */}
          <div className="mt-8 pt-6 border-t border-black/5 text-center">
            <p className="text-xs font-medium text-black/50">
              ¿No tienes cuenta?{" "}
              <Link href="/register" className="font-bold underline decoration-[#A2B676] link-transition hover:text-black">
                Regístrate
              </Link>
            </p>
          </div>
        </div>
      </main>

      <footer className="w-full py-4 text-center shrink-0 flex items-center justify-center gap-1.5 text-[11px] text-black/30 font-medium">
        <ShieldCheck className="h-3.5 w-3.5" /> Encriptación de datos de salud
      </footer>
    </div>
  )
})

export default function LoginPage() {
  return (
    <Suspense fallback={<LoginSkeleton />}>
      <LoginContent />
    </Suspense>
  )
}