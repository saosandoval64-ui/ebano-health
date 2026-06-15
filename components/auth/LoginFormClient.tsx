"use client"

import { useState, useCallback } from "react"
import { Loader2, AlertCircle } from "lucide-react"
import { signIn } from "next-auth/react"

type LoginRole = "patient" | "doctor" | "admin"

type LoginFormClientProps = {
  role: LoginRole
  placeholders: {
    email: string
    password?: string
  }
}

const DASHBOARD_BY_ROLE: Record<LoginRole, string> = {
  patient: "/patient/dashboard",
  doctor: "/doctor/dashboard",
  admin: "/admin/dashboard",
}

export default function LoginFormClient({ role, placeholders }: LoginFormClientProps) {
  const [isPending, setIsPending] = useState(false)
  const [message, setMessage] = useState("")
  const [loginError, setLoginError] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    setIsPending(true)
    setMessage("")
    setLoginError(false)

    try {
      const result = await signIn("credentials", {
        email,
        password,
        expectedRole: role.toUpperCase(),
        redirect: false,
      })

      if (result?.error) {
        setMessage("Credenciales incorrectas. Verifica tu email y contraseña.")
        setLoginError(true)
        setIsPending(false)
        return
      }

      // Login exitoso - redirigir al dashboard del rol
      window.location.href = DASHBOARD_BY_ROLE[role]
    } catch {
      setMessage("Error de conexión. Intenta de nuevo.")
      setLoginError(true)
      setIsPending(false)
    }
  }, [email, password, role])

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-5" noValidate>
        <div className="space-y-1.5">
          <label htmlFor="email" className="text-xs font-bold uppercase tracking-wider text-black/70 pl-1 block">
            Correo Electrónico
          </label>
          <input
            id="email"
            name="email"
            type="email"
            placeholder={placeholders.email}
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-xl border border-black/10 bg-white/50 focus:bg-white text-black h-11 px-4 text-sm outline-none focus:ring-2 focus:ring-[#F4C443]"
            autoComplete="email"
            inputMode="email"
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
            placeholder={placeholders.password || "••••••••"}
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-xl border border-black/10 bg-white/50 focus:bg-white text-black h-11 px-4 text-sm outline-none focus:ring-2 focus:ring-[#F4C443]"
            autoComplete="current-password"
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
          <p className={`text-xs font-bold text-center p-3 rounded-xl flex items-center justify-center gap-2 ${
            loginError
              ? "text-red-600 bg-red-50 border border-red-100"
              : "text-green-600 bg-green-50 border border-green-100"
          }`}>
            {loginError && <AlertCircle className="h-3.5 w-3.5 shrink-0" />}
            {message}
          </p>
        )}
      </form>

      {isPending && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-[2px]">
          <div className="bg-white p-6 rounded-3xl shadow-2xl flex flex-col items-center gap-3">
            <Loader2 className="h-8 w-8 animate-spin text-black" />
            <p className="text-xs font-bold uppercase tracking-wider text-black/70">Iniciando sesión...</p>
          </div>
        </div>
      )}
    </>
  )
}
