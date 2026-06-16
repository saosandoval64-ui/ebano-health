"use client"

import { useState } from "react"
import { Bot, Send, Sparkles, Calendar, Clock, ClipboardList } from "lucide-react"
import Link from "next/link"
import Logo from "@/components/Logo"

const messages = [
  {
    id: 1,
    sender: "ai",
    text: "¡Hola! Soy el asistente virtual de Ébano Health. ¿En qué puedo ayudarte hoy?",
  },
  {
    id: 2,
    sender: "user",
    text: "Quiero agendar una cita con un cardiólogo.",
  },
  {
    id: 3,
    sender: "ai",
    text: "¡Por supuesto! Puedo ayudarte a encontrar un cardiólogo disponible. ¿Tienes una preferencia de fecha u horario?",
  },
]

const quickActions = [
  { icon: Calendar, label: "Agendar cita" },
  { icon: Clock, label: "Ver disponibilidad" },
  { icon: ClipboardList, label: "Consultar turnos" },
]

export default function ChatPage() {
  const [inputValue, setInputValue] = useState("")

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans antialiased">
      {/* Header */}
      <div className="border-b border-black/5 bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-8 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <Logo size="sm" />
          </Link>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-[#F4C443]/10 px-3 py-1.5 rounded-full">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse-glow" />
              <span className="text-[11px] font-bold uppercase tracking-wider text-black/60">En línea</span>
            </div>
            <Link
              href="/"
              className="text-xs font-bold uppercase tracking-wider text-black/50 hover:text-black transition-colors link-transition"
            >
              Cerrar
            </Link>
          </div>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-5xl mx-auto px-8 pt-8 pb-8">
          {/* AI Avatar & Title */}
          <div className="text-center mb-10 animate-slideInDown">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#F4C443]/15 mb-4">
              <Bot className="w-8 h-8 text-[#F4C443]" />
            </div>
            <h1 className="text-2xl font-serif font-black text-black tracking-tight mb-1">
              Asistente Virtual Ébano
            </h1>
            <p className="text-xs text-black/50 font-medium">
              Respuestas instantáneas · Disponible 24/7
            </p>
          </div>

          {/* Messages */}
          <div className="space-y-4 max-w-2xl mx-auto">
            {messages.map((msg, idx) => (
              <div
                key={msg.id}
                className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"} animate-slideInUp`}
                style={{ animationDelay: `${idx * 0.15}s`, animationFillMode: "both" }}
              >
                {msg.sender === "ai" && (
                  <div className="w-8 h-8 rounded-full bg-[#F4C443]/15 flex items-center justify-center shrink-0 mr-3 mt-1">
                    <Bot className="w-4 h-4 text-[#F4C443]" />
                  </div>
                )}
                <div
                  className={`max-w-[80%] px-5 py-3.5 text-sm leading-relaxed font-medium ${
                    msg.sender === "ai"
                      ? "bg-[#F4C443]/10 text-black rounded-2xl rounded-tl-md border border-[#F4C443]/20"
                      : "bg-black text-white rounded-2xl rounded-tr-md"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}

            {/* Typing Indicator */}
            <div className="flex justify-start animate-fadeIn" style={{ animationDelay: "0.5s", animationFillMode: "both" }}>
              <div className="w-8 h-8 rounded-full bg-[#F4C443]/15 flex items-center justify-center shrink-0 mr-3 mt-1">
                <Bot className="w-4 h-4 text-[#F4C443]" />
              </div>
              <div className="bg-[#F4C443]/10 border border-[#F4C443]/20 rounded-2xl rounded-tl-md px-5 py-4 flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-[#F4C443]/60 animate-bounce-soft" style={{ animationDelay: "0s" }} />
                <div className="w-2 h-2 rounded-full bg-[#F4C443]/60 animate-bounce-soft" style={{ animationDelay: "0.15s" }} />
                <div className="w-2 h-2 rounded-full bg-[#F4C443]/60 animate-bounce-soft" style={{ animationDelay: "0.3s" }} />
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="max-w-2xl mx-auto mt-8 animate-slideInUp" style={{ animationDelay: "0.6s", animationFillMode: "both" }}>
            <p className="text-[11px] font-bold uppercase tracking-widest text-black/30 mb-3 text-center">
              Acciones rápidas
            </p>
            <div className="flex flex-wrap items-center justify-center gap-2">
              {quickActions.map((action) => (
                <button
                  key={action.label}
                  disabled
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full border border-black/10 bg-white text-black/60 text-xs font-bold cursor-not-allowed opacity-60"
                >
                  <action.icon className="w-3.5 h-3.5" />
                  {action.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Input Area */}
      <div className="border-t border-black/5 bg-white/80 backdrop-blur-sm">
        <div className="max-w-5xl mx-auto px-8 py-4">
          {/* Sparkles Banner */}
          <div className="flex items-center justify-center gap-2 mb-3">
            <Sparkles className="w-3.5 h-3.5 text-[#F4C443]" />
            <span className="text-[11px] font-bold text-black/40">Próximamente disponible</span>
          </div>

          {/* Input Field */}
          <div className="flex items-center gap-3">
            <div className="flex-1 relative">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                disabled
                placeholder="Escribe un mensaje..."
                className="w-full rounded-2xl border border-black/10 bg-black/5 h-12 px-5 pr-12 text-sm outline-none cursor-not-allowed text-black/40 placeholder:text-black/30"
              />
              <button
                disabled
                className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-xl bg-black/5 flex items-center justify-center cursor-not-allowed text-black/20"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>

          <p className="text-center text-[10px] text-black/25 mt-3 font-medium">
            Powered by Ébano Health Intelligence
          </p>
        </div>
      </div>
    </div>
  )
}
