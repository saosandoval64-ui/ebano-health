"use client"

import Link from "next/link"
import AvatarDisplay from "@/components/AvatarDisplay"
import { MessageSquare } from "lucide-react"

type Participant = {
  id: string
  name: string
  lastName: string | null
  avatar: string
  role: string
}

type Conversation = {
  id: string
  updatedAt: Date
  participants: Participant[]
  lastMessage: { body: string; createdAt: Date } | null
  unreadCount: number
}

function timeAgo(date: Date) {
  const now = new Date()
  const diff = Math.floor((now.getTime() - new Date(date).getTime()) / 1000)
  if (diff < 60) return "Ahora"
  if (diff < 3600) return `${Math.floor(diff / 60)}m`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h`
  return new Date(date).toLocaleDateString("es-ES", { day: "numeric", month: "short" })
}

export default function ConversationList({
  conversations,
}: {
  conversations: Conversation[]
  currentUserId: string
}) {
  if (conversations.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 border-2 border-dashed border-gray-100 rounded-3xl">
        <MessageSquare className="w-10 h-10 text-black/10 mb-3" />
        <p className="text-sm font-bold text-black/30">No tenés conversaciones aún</p>
        <p className="text-xs text-black/20 mt-1">
          Podés iniciar una desde el perfil de un médico o paciente.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {conversations.map((conv) => {
        const other = conv.participants[0]
        if (!other) return null

        return (
          <Link
            key={conv.id}
            href={`/mensajes/${conv.id}`}
            className="flex items-center gap-4 p-4 bg-white border border-gray-100 rounded-2xl hover:border-gray-200 hover:shadow-sm transition-all"
          >
            <AvatarDisplay avatar={other.avatar} name={other.name} size="md" />
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <p className="font-bold text-sm text-black truncate">
                  {other.name} {other.lastName ?? ""}
                  <span className="ml-2 text-[10px] font-bold text-black/30 uppercase tracking-wider">
                    {other.role === "DOCTOR" ? "Médico" : "Paciente"}
                  </span>
                </p>
                {conv.lastMessage && (
                  <span className="text-[10px] text-black/30 font-bold shrink-0">
                    {timeAgo(conv.lastMessage.createdAt)}
                  </span>
                )}
              </div>
              {conv.lastMessage && (
                <p className="text-xs text-black/40 font-medium truncate mt-0.5">
                  {conv.lastMessage.body}
                </p>
              )}
            </div>
          </Link>
        )
      })}
    </div>
  )
}
