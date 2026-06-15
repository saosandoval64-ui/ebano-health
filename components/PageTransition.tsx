"use client"

import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"

export default function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [displayChildren, setDisplayChildren] = useState(children)
  const [fadeKey, setFadeKey] = useState(0)

  useEffect(() => {
    setDisplayChildren(children)
    setFadeKey((k) => k + 1)
  }, [pathname])

  useEffect(() => {
    setDisplayChildren(children)
  }, [children])

  return (
    <div key={fadeKey} className="animate-pageFadeIn">
      {displayChildren}
    </div>
  )
}
