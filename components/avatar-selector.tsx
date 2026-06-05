"use client"

import { useState } from "react"
import { User, Users, Users2, Globe, Heart, Smile, Eye, Sun } from "lucide-react"

interface AvatarSelectorProps {
  onSelect: (avatar: string) => void
  currentAvatar?: string
}

export function AvatarSelector({ onSelect, currentAvatar }: AvatarSelectorProps) {
  const [isOpen, setIsOpen] = useState(false)

  const avatars = [
    { id: 1, icon: User, label: "Usuario", color: "bg-blue-500" },
    { id: 2, icon: Users, label: "Grupo", color: "bg-purple-500" },
    { id: 3, icon: Users2, label: "Equipo", color: "bg-pink-500" },
    { id: 4, icon: Globe, label: "Global", color: "bg-green-500" },
    { id: 5, icon: Heart, label: "Corazón", color: "bg-red-500" },
    { id: 6, icon: Smile, label: "Sonrisa", color: "bg-yellow-500" },
    { id: 7, icon: Eye, label: "Ojo", color: "bg-indigo-500" },
    { id: 8, icon: Sun, label: "Sol", color: "bg-orange-500" },
  ]

  const selectedAvatar = avatars.find(a => a.id.toString() === currentAvatar) || avatars[0]
  const SelectedIcon = selectedAvatar.icon

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`h-12 w-12 rounded-full flex items-center justify-center text-white font-bold text-lg hover:scale-110 transition-transform ${selectedAvatar.color} border-2 border-white/20`}
      >
        <SelectedIcon className="h-6 w-6" />
      </button>

      {isOpen && (
        <div className="absolute top-full mt-2 right-0 bg-white rounded-lg shadow-lg p-4 z-50">
          <div className="grid grid-cols-4 gap-3">
            {avatars.map(avatar => {
              const Icon = avatar.icon
              return (
                <button
                  key={avatar.id}
                  onClick={() => {
                    onSelect(avatar.id.toString())
                    setIsOpen(false)
                  }}
                  className={`h-10 w-10 rounded-full flex items-center justify-center text-white font-bold hover:scale-110 transition-transform border-2 ${
                    avatar.id.toString() === currentAvatar
                      ? "border-black"
                      : "border-transparent"
                  } ${avatar.color}`}
                  title={avatar.label}
                >
                  <Icon className="h-5 w-5" />
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
