"use client"

import { usePathname } from "next/navigation"
import { useState, useEffect, useRef } from "react"

export default function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const prevPathname = useRef(pathname)
  const [displayChildren, setDisplayChildren] = useState(children)
  const [phase, setPhase] = useState<"enter" | "exit">("enter")
  const [animKey, setAnimKey] = useState(0)

  useEffect(() => {
    if (pathname === prevPathname.current) return
    prevPathname.current = pathname

    setPhase("exit")

    const timer = setTimeout(() => {
      setDisplayChildren(children)
      setPhase("enter")
      setAnimKey((k) => k + 1)
    }, 250)

    return () => clearTimeout(timer)
  }, [pathname])

  useEffect(() => {
    if (phase === "enter") {
      setDisplayChildren(children)
    }
  }, [children, phase])

  return (
    <div key={animKey} className={phase === "enter" ? "animate-slideInUp" : "animate-fadeOutScale"}>
      {displayChildren}
    </div>
  )
}
