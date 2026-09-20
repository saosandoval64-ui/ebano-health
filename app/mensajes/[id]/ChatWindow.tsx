"use client"

import { useState, useRef, useEffect, useTransition } from "react"
import Link from "next/link"
import AvatarDisplay from "@/components/AvatarDisplay"
import { sendMessage, getMessages } from "@/app/actions/messages"
import { ArrowLeft, Send, Loader2 } from "lucide-react"

type Sender = { id: string; name: string; lastName: string | null; avatar: string }
type Message = { id: string; body: string; createdAt: Date; senderId: string; sender: Sender }
type OtherUser = { id: string; name: string; lastName: string | null; avatar: string; role: string } | null

export default function ChatWindow({
  conversationId,
  currentUserId,
  initialMessages,
  otherUser,
}: {
  conversationId: string
  currentUserId: string
  initialMessages: Message[]
  otherUser: OtherUser
}) {
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [body, setBody] = useState("")
  const [isPending, startTransition] = useTransition()
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  // Auto-scroll al fondo
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Polling liviano cada 5 segundos para simular tiempo real sin WebSocket
  useEffect(() => {
    const interval = setInterval(async () => {
      const fresh = await getMessages(conversationId)
      setMessages(fresh as Message[])
    }, 5000)
    return () => clearInterval(interval)
  }, [conversationId])

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  function handleSend() {
    if (!body.trim() || isPending) return
    const text = body.trim()
    setBody("")

    // Optimistic update
    const optimistic: Message = {
      id: `opt-${Date.now()}`,
      body: text,
      createdAt: new Date(),
      senderId: currentUserId,
      sender: { id: currentUserId, name: "Vos", lastName: null, avatar: "1" },
    }
    setMessages((prev) => [...prev, optimistic])

    startTransition(async () => {
      const result = await sendMessage(conversationId, text)
      if (result.success && result.message) {
        setMessages((prev) =>
          prev.map((m) => (m.id === optimistic.id ? (result.message as Message) : m))
        )
      } else {
        // Revertir optimistic si falla
        setMessages((prev) => prev.filter((m) => m.id !== optimistic.id))
        setBody(text)
      }
    })
  }

  function formatTime(date: Date) {
    return new Date(date).toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" })
  }

  function formatDate(date: Date) {
    const d = new Date(date)
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)
    if (d.toDateString() === today.toDateString()) return "Hoy"
    if (d.toDateString() === yesterday.toDateString()) return "Ayer"
    return d.toLocaleDateString("es-ES", { weekday: "long", day: "numeric", month: "long" })
  }

  // Agrupar mensajes por día
  const grouped: { date: string; messages: Message[] }[] = []
  messages.forEach((msg) => {
    const dateStr = new Date(msg.createdAt).toDateString()
    const last = grouped[grouped.length - 1]
    if (!last || last.date !== dateStr) {
      grouped.push({ date: dateStr, messages: [msg] })
    } else {
      last.messages.push(msg)
    }
  })

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] max-w-3xl mx-auto font-sans">
      {/* Header */}
      <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-100 bg-white shrink-0">
        <Link href="/mensajes" className="p-2 rounded-xl hover:bg-black/5 transition-colors">
          <ArrowLeft className="w-4 h-4 text-black/50" />
        </Link>
        {otherUser && (
          <>
            <AvatarDisplay avatar={otherUser.avatar} name={otherUser.name} size="sm" />
            <div>
              <p className="font-black text-sm text-black">
                {otherUser.role === "DOCTOR" ? "Dr. " : ""}{otherUser.name} {otherUser.lastName ?? ""}
              </p>
              <p className="text-[10px] text-black/40 font-bold uppercase tracking-wider">
                {otherUser.role === "DOCTOR" ? "Médico" : "Paciente"}
              </p>
            </div>
          </>
        )}
      </div>

      {/* Mensajes */}
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-1 bg-gray-50">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-sm text-black/30 font-medium">
              Aún no hay mensajes. ¡Escribí el primero!
            </p>
          </div>
        ) : (
          grouped.map((group) => (
            <div key={group.date}>
              {/* Separador de fecha */}
              <div className="flex items-center gap-3 my-4">
                <div className="flex-1 h-px bg-black/5" />
                <span className="text-[10px] font-bold text-black/30 uppercase tracking-wider">
                  {formatDate(group.messages[0].createdAt)}
                </span>
                <div className="flex-1 h-px bg-black/5" />
              </div>

              <div className="space-y-1.5">
                {group.messages.map((msg) => {
                  const isOwn = msg.senderId === currentUserId
                  return (
                    <div key={msg.id} className={`flex ${isOwn ? "justify-end" : "justify-start"}`}>
                      <div className={`max-w-[75%] ${isOwn ? "items-end" : "items-start"} flex flex-col gap-0.5`}>
                        <div
                          className={`px-4 py-2.5 rounded-2xl text-sm font-medium leading-relaxed ${
                            isOwn
                              ? "bg-black text-white rounded-br-sm"
                              : "bg-white text-black border border-gray-100 rounded-bl-sm"
                          }`}
                        >
                          {msg.body}
                        </div>
                        <span className="text-[10px] text-black/30 font-bold px-1">
                          {formatTime(msg.createdAt)}
                        </span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          ))
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="shrink-0 px-6 py-4 border-t border-gray-100 bg-white">
        <div className="flex items-end gap-3">
          <textarea
            ref={inputRef}
            value={body}
            onChange={(e) => setBody(e.target.value)}
            onKeyDown={handleKeyDown}
            rows={1}
            placeholder="Escribí un mensaje... (Enter para enviar, Shift+Enter para nueva línea)"
            className="flex-1 border border-gray-200 rounded-2xl px-4 py-3 text-sm font-medium placeholder:text-black/25 resize-none focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-black/30 transition max-h-32 overflow-y-auto"
            style={{ height: "auto" }}
            onInput={(e) => {
              const el = e.currentTarget
              el.style.height = "auto"
              el.style.height = `${Math.min(el.scrollHeight, 128)}px`
            }}
          />
          <button
            onClick={handleSend}
            disabled={!body.trim() || isPending}
            className="w-11 h-11 rounded-2xl bg-black flex items-center justify-center hover:bg-black/85 transition-all active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed shrink-0"
          >
            {isPending ? (
              <Loader2 className="w-4 h-4 text-white animate-spin" />
            ) : (
              <Send className="w-4 h-4 text-white" />
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
