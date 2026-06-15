"use client"

import { useState, useRef, useEffect } from "react"
import { Camera, Upload, X, Check } from "lucide-react"

interface AvatarSelectorModalProps {
  isOpen: boolean
  onClose: () => void
  onSelect: (avatar: string) => Promise<void>
  currentAvatar?: string
}

/**
 * AvatarSelectorModal - Modal limpio y centrado para selección de avatar
 * - Grid responsivo (3 columnas desktop, 2 móvil)
 * - Tamaño fijo 80x80px con object-cover
 * - Scroll interno si hay muchas opciones
 * - Soporte para avatares SVG predeterminados y upload de imagen
 */
export function AvatarSelectorModal({ 
  isOpen, 
  onClose, 
  onSelect, 
  currentAvatar 
}: AvatarSelectorModalProps) {
  const [localAvatar, setLocalAvatar] = useState(currentAvatar || "avatar-1.svg")
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Los mismos avatares que aparecen en la landing page
  const avatarSvgs = [
    "/avatars/avatar-1.svg",
    "/avatars/avatar-2.svg",
    "/avatars/avatar-3.svg",
    "/avatars/avatar-4.svg",
  ]

  const isCustomUpload = localAvatar && !avatarSvgs.includes(localAvatar) && localAvatar.startsWith("data:")

  // Sincronizar localAvatar cuando cambia currentAvatar
  useEffect(() => {
    if (currentAvatar) {
      setLocalAvatar(currentAvatar)
    }
  }, [currentAvatar])

  const handleSelectSvg = async (src: string) => {
    setLocalAvatar(src)
    await onSelect(src)
    onClose()
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
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

    setIsUploading(true)

    const reader = new FileReader()
    reader.onload = async (event) => {
      const dataUrl = event.target?.result as string
      setLocalAvatar(dataUrl)
      await onSelect(dataUrl)
      onClose()
      setIsUploading(false)
    }
    reader.readAsDataURL(file)
  }

  // Cerrar con Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown)
      document.body.style.overflow = "hidden"
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown)
      document.body.style.overflow = "unset"
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <>
      {/* Overlay con animación */}
      <div
        className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm animate-fadeIn"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal centrado */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-slideUp">
        <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-black/10 overflow-hidden max-h-[90vh] flex flex-col">
          
          {/* Header del modal */}
          <div className="flex items-center justify-between p-6 border-b border-black/5">
            <h2 className="text-xl font-serif font-black text-black">Elegir Avatar</h2>
            <button
              onClick={onClose}
              className="h-10 w-10 rounded-full bg-black/5 hover:bg-black/10 flex items-center justify-center transition-colors text-black/60 hover:text-black"
              aria-label="Cerrar selector de avatar"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Contenido con scroll */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            
            {/* Grid de avatares SVG predeterminados */}
            <div>
              <p className="text-xs uppercase font-bold tracking-widest text-black/40 mb-4 text-center">
                Avatares Disponibles
              </p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {avatarSvgs.map((src) => {
                  const isSelected = localAvatar === src
                  return (
                    <button
                      key={src}
                      onClick={() => handleSelectSvg(src)}
                      disabled={isSelected}
                      className={`relative group h-20 w-20 md:h-24 md:w-24 rounded-2xl overflow-hidden mx-auto transition-all duration-200 border-4 ${
                        isSelected
                          ? "border-[#F4C443] ring-2 ring-[#F4C443] ring-offset-2 scale-105"
                          : "border-transparent hover:border-[#F4C443]/50"
                      }`}
                      aria-label={`Seleccionar avatar ${src}`}
                      aria-pressed={isSelected}
                    >
                      <img
                        src={src}
                        alt={`Avatar ${src}`}
                        className="h-full w-full object-cover"
                      />
                      {isSelected && (
                        <div className="absolute inset-0 bg-black/20 flex items-center justify-center animate-fadeIn">
                          <Check className="h-8 w-8 text-white drop-shadow-lg" />
                        </div>
                      )}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Separador */}
            <div className="relative">
              <div className="border-t border-black/10" />
              <span className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 bg-white px-3 text-[10px] uppercase font-bold tracking-wider text-black/40">
                O
              </span>
            </div>

            {/* Subir foto personalizada */}
            <div className="text-center">
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="w-full h-14 rounded-2xl border-2 border-dashed border-black/20 hover:border-[#F4C443] hover:bg-[#F4C443]/5 flex items-center justify-center gap-3 text-sm font-bold uppercase tracking-wider text-black/60 hover:text-[#F4C443] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Camera className="h-5 w-5" />
                {isUploading ? (
                  <>
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Subiendo...
                  </>
                ) : (
                  "Subir Foto Personalizada"
                )}
              </button>
              <p className="mt-2 text-xs text-black/40">Máx. 2MB • JPG, PNG, WebP</p>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileUpload}
            />
          </div>
        </div>
      </div>
    </>
  )
}

export default AvatarSelectorModal