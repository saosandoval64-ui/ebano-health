"use client"

import Link from "next/link"
import { User, Stethoscope, Briefcase, Building2 } from "lucide-react"

const roles = [
  { label: "Paciente", href: "/login/patient", icon: User, color: "#F4C443" },
  { label: "Médico", href: "/login/doctor", icon: Stethoscope, color: "#8B5A2B" },
  { label: "Clínica", href: "/login/clinic-admin", icon: Building2, color: "#6366f1" },
  { label: "Admin", href: "/login/admin", icon: Briefcase, color: "#374151" },
]

export default function RoleChooser({ current }: { current: string }) {
  return (
    <div className="mt-6 pt-4 border-t border-gray-100">
      <p className="text-[10px] font-bold uppercase tracking-wider text-black/40 text-center mb-3">
        Entrar como
      </p>
      <div className="grid grid-cols-4 gap-2">
        {roles.map((r) => {
          const Icon = r.icon
          const isActive = current === r.href
          return (
            <Link
              key={r.href}
              href={r.href}
              className={`flex flex-col items-center gap-1.5 p-2 rounded-xl transition-all ${
                isActive
                  ? "bg-black/5 ring-1 ring-black/10"
                  : "hover:bg-black/5"
              }`}
            >
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: `${r.color}15` }}
              >
                <Icon className="w-4 h-4" style={{ color: r.color }} />
              </div>
              <span className={`text-[10px] font-bold ${isActive ? "text-black" : "text-black/50"}`}>
                {r.label}
              </span>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
