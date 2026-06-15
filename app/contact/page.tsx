"use client"

import { useState, useTransition } from "react"
import { X, Mail, Phone, MapPin, Send, Loader2 } from "lucide-react"
import Link from "next/link"
import Logo from "@/components/Logo"

export default function ContactPage() {
  const [isPending, startTransition] = useTransition()
  const [message, setMessage] = useState("")
  const [successMessage, setSuccessMessage] = useState("")
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    asunto: "",
    mensaje: ""
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setMessage("")
    setSuccessMessage("")

    startTransition(async () => {
      try {
        const response = await fetch("/api/contact", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData)
        })
        const result = await response.json()
        if (result.success) {
          setSuccessMessage("¡Mensaje enviado! Nos pondremos en contacto pronto.")
          setFormData({ nombre: "", email: "", asunto: "", mensaje: "" })
        } else {
          setMessage(result.message || "Error al enviar el mensaje")
        }
      } catch {
        setMessage("Error al enviar el mensaje. Intenta de nuevo.")
      }
    })
  }

  return (
    <div className="min-h-screen text-black font-sans antialiased flex flex-col justify-between selection:bg-[#E2CE7D]">
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
        <div className="w-full max-w-6xl">
          {/* Header */}
          <div className="text-center mb-12 animate-slideInDown">
            <div className="flex justify-center mb-2">
              <Logo size="md" />
            </div>
            <h1 className="text-4xl font-serif font-black tracking-tight text-black mb-2">
              Contáctanos
            </h1>
            <p className="text-black/60 max-w-xl mx-auto">
              Estamos aquí para ayudarte. Envíanos un mensaje y nos comunicaremos contigo lo antes posible.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
            {/* Contact Info Cards */}
            <div className="bg-black/5 rounded-2xl border border-black/10 p-8 animate-slideInLeft">
              <div className="w-12 h-12 rounded-full bg-[#F4C443]/20 flex items-center justify-center mb-4">
                <Mail className="w-6 h-6 text-[#F4C443]" />
              </div>
              <h3 className="font-bold text-lg mb-2">Email</h3>
              <p className="text-black/60 text-sm">
                contacto@ebano.com
              </p>
            </div>

            <div className="bg-black/5 rounded-2xl border border-black/10 p-8 animate-slideInUp">
              <div className="w-12 h-12 rounded-full bg-[#F4C443]/20 flex items-center justify-center mb-4">
                <Phone className="w-6 h-6 text-[#F4C443]" />
              </div>
              <h3 className="font-bold text-lg mb-2">Teléfono</h3>
              <p className="text-black/60 text-sm">
                +54 11 0000-0000
              </p>
            </div>

            <div className="bg-black/5 rounded-2xl border border-black/10 p-8 animate-slideInRight">
              <div className="w-12 h-12 rounded-full bg-[#F4C443]/20 flex items-center justify-center mb-4">
                <MapPin className="w-6 h-6 text-[#F4C443]" />
              </div>
              <h3 className="font-bold text-lg mb-2">Ubicación</h3>
              <p className="text-black/60 text-sm">
                Buenos Aires, Argentina
              </p>
            </div>
          </div>

          {/* Form */}
          <div className="bg-black/5 rounded-2xl border border-black/10 p-8 sm:p-12 backdrop-blur-sm animate-slideInUp">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-black/70 pl-1 block">
                    Nombre Completo
                  </label>
                  <input
                    type="text"
                    name="nombre"
                    required
                    placeholder="Tu nombre"
                    value={formData.nombre}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-black/10 bg-white/50 focus:bg-white h-11 px-4 text-sm outline-none focus:ring-2 focus:ring-[#F4C443] tab-transition"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-black/70 pl-1 block">
                    Correo Electrónico
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    placeholder="tu@email.com"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-black/10 bg-white/50 focus:bg-white h-11 px-4 text-sm outline-none focus:ring-2 focus:ring-[#F4C443] tab-transition"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-black/70 pl-1 block">
                  Asunto
                </label>
                <input
                  type="text"
                  name="asunto"
                  required
                  placeholder="¿En qué podemos ayudarte?"
                  value={formData.asunto}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-black/10 bg-white/50 focus:bg-white h-11 px-4 text-sm outline-none focus:ring-2 focus:ring-[#F4C443] tab-transition"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-black/70 pl-1 block">
                  Mensaje
                </label>
                <textarea
                  name="mensaje"
                  required
                  placeholder="Cuéntanos más..."
                  rows={6}
                  value={formData.mensaje}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-black/10 bg-white/50 focus:bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#F4C443] tab-transition resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={isPending}
                className="w-full rounded-full bg-black hover:bg-black/80 text-[#FDF6CD] font-bold text-xs tracking-wider uppercase h-11 disabled:opacity-60 flex items-center justify-center gap-2 link-transition button-click"
              >
                {isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Enviando...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    Enviar Mensaje
                  </>
                )}
              </button>

              {message && (
                <p className="text-red-500 text-xs font-bold text-center bg-red-50 border border-red-100 p-3 rounded-xl animate-slideInDown">
                  {message}
                </p>
              )}

              {successMessage && (
                <p className="text-green-600 text-xs font-bold text-center bg-green-50 border border-green-100 p-3 rounded-xl animate-slideInDown">
                  ✓ {successMessage}
                </p>
              )}
            </form>
          </div>
        </div>
      </main>

      <footer className="w-full py-4 text-center text-[11px] text-black/30 font-medium flex items-center justify-center gap-1.5">
        <span>🔒</span> Encriptación de datos de salud
      </footer>
    </div>
  )
}
