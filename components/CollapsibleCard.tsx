"use client"

import { useState } from "react"
import { X, Plus } from "lucide-react"

interface CollapsibleCardProps {
  id: string
  children: React.ReactNode
  className?: string
  defaultVisible?: boolean
}

export default function CollapsibleCard({ id, children, className = "", defaultVisible = true }: CollapsibleCardProps) {
  const [visible, setVisible] = useState(defaultVisible)

  if (!visible) {
    return (
      <button
        onClick={() => setVisible(true)}
        className="w-full h-full min-h-[80px] flex flex-col items-center justify-center gap-1.5 rounded-3xl border-2 border-dashed border-gray-200 bg-white/30 text-gray-400 hover:bg-white/50 hover:border-gray-300 transition-all cursor-pointer"
      >
        <Plus className="w-5 h-5" />
        <span className="text-[10px] font-bold uppercase tracking-wider">Mostrar</span>
      </button>
    )
  }

  return (
    <div className={`relative group ${className}`}>
      <button
        onClick={() => setVisible(false)}
        className="absolute -top-2 -right-2 z-10 w-7 h-7 rounded-full bg-white border border-gray-200 shadow-sm flex items-center justify-center text-gray-400 hover:text-red-500 hover:border-red-200 hover:bg-red-50 transition-all opacity-0 group-hover:opacity-100"
        aria-label="Ocultar"
      >
        <X className="w-3.5 h-3.5" />
      </button>
      {children}
    </div>
  )
}
