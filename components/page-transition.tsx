"use client"

import { useEffect } from "react"
import { usePathname } from "next/navigation"

export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  useEffect(() => {
    // Agregar clase de animación cuando cambia la ruta
    const html = document.documentElement
    html.style.opacity = "1"
  }, [pathname])

  return <div className="page-enter">{children}</div>
}
