"use client"

import { useState, useRef } from "react"
import { Camera, Upload } from "lucide-react"

interface AvatarSelectorProps {
  onSelect: (avatar: string) => void
  currentAvatar?: string
}

/**
 * AvatarSelector - Muestra los 4 avatares SVG de la página principal
 * más la opción de subir una foto desde la galería.
 * Compacto, sin iconos amontonados.
 */
export function AvatarSelector({ onSelect, currentAvatar }: AvatarSelectorProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [localAvatar, setLocalAvatar] = useState(currentAvatar || "avatar-1.svg")
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Los mismos avatares que aparecen en la landing page
  const avatarSvgs = [
    "/avatars/avatar-1.svg",
    "/avatars/avatar-2.svg",
    "/avatars/avatar-3.svg",
    "/avatars/avatar-4.svg",
  ]

  const isCustomUpload = localAvatar && !avatarSvgs.includes(localAvatar) && localAvatar.startsWith("data:")

  const handleSelectSvg = (src: string) => {
    setLocalAvatar(src)
    onSelect(src)
    setIsOpen(false)
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validar tamaño (max 2MB) y tipo
    if (file.size > 2 * 1024 * 1024) {
      alert("La imagen no debe superar los 2MB")
      return
    }
    if (!file.type.startsWith("image/")) {
      alert("Solo se permiten imágenes")
      return
    }

    const reader = new FileReader()
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string
      setLocalAvatar(dataUrl)
      onSelect(dataUrl)
      setIsOpen(false)
    }
    reader.readAsDataURL(file)
  }

  return (
    <div className="relative shrink-0">
      {/* Avatar actual - muestra el SVG o la foto subida */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="h-10 w-10 sm:h-12 sm:w-12 rounded-full overflow-hidden border-2 border-white/20 hover:scale-110 transition-transform bg-[#F4C443] flex items-center justify-center"
        aria-label="Cambiar avatar"
      >
        {isCustomUpload ? (
          <img
            src={localAvatar}
            alt="Tu foto"
            className="h-full w-full object-cover"
          />
        ) : (
          <img
            src={localAvatar || "/avatars/avatar-1.svg"}
            alt="Avatar"
            className="h-full w-full object-cover"
          />
        )}
      </button>

      {isOpen && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          {/* Popup selector - FIXED: now uses fixed positioning to prevent overflow */}
          <div className="fixed z-50 bottom-4 left-1/2 -translate-x-1/2 md:absolute md:bottom-auto md:mt-2 md:left-1/2 md:-translate-x-1/2 md:top-full bg-white rounded-2xl shadow-xl border border-black/10 p-4 w-[260px] max-w-[90vw]">
            <p className="text-[10px] uppercase font-bold tracking-widest text-black/40 text-center mb-3">
              Elegir Avatar
            </p>
            
            {/* Grid de avatares SVG - FIXED: prevent overflow */}
            <div className="grid grid-cols-4 gap-2 mb-3">
              {avatarSvgs.map((src) => {
                const isSelected = localAvatar === src
                return (
                  <button
                    key={src}
                    onClick={() => handleSelectSvg(src)}
                    className={`h-12 w-12 rounded-full overflow-hidden mx-auto transition-all shrink-0 ${
                      isSelected
                        ? "ring-2 ring-offset-2 ring-black scale-110"
                        : "hover:scale-110"
                    }`}
                    aria-label={`Seleccionar avatar ${src}`}
                  >
                    <img
                      src={src}
                      alt="Avatar SVG"
                      className="h-full w-full object-cover"
                    />
                  </button>
                )
              })}
            </div>

            {/* Separador */}
            <div className="border-t border-black/5 my-2" />

            {/* Subir foto desde galería */}
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full h-9 rounded-xl flex items-center justify-center gap-2 text-[10px] uppercase font-bold tracking-wider text-black/70 hover:bg-black/5 hover:text-black transition-all"
            >
              <Camera className="h-3.5 w-3.5" />
              Subir Foto
            </button>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileUpload}
            />
          </div>
        </>
      )}
    </div>
  )
}

export default AvatarSelector