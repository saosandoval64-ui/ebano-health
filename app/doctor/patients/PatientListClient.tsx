"use client"

import { useState } from "react"
import { Calendar, Users, Award, ShieldCheck, Mail, Phone, Heart, Search } from "lucide-react"

type PatientInfo = {
  id: string
  name: string
  lastName: string | null
  email: string
  dni: string | null
  phone: string | null
  birthDate: Date | null
  insurance: string | null
  lastAppointment: Date
}

interface PatientListClientProps {
  patients: PatientInfo[]
}

export default function PatientListClient({ patients }: PatientListClientProps) {
  const [search, setSearch] = useState("")

  const filtered = patients.filter((patient) => {
    const term = search.toLowerCase().trim()
    if (!term) return true
    const nameMatch = patient.name.toLowerCase().includes(term)
    const lastNameMatch = patient.lastName?.toLowerCase().includes(term) ?? false
    const emailMatch = patient.email.toLowerCase().includes(term)
    const dniMatch = patient.dni?.toLowerCase().includes(term) ?? false
    return nameMatch || lastNameMatch || emailMatch || dniMatch
  })

  return (
    <div className="max-w-5xl mx-auto px-8 pt-8 pb-8 space-y-8 font-sans text-black">
      {/* Encabezado */}
      <div className="space-y-1">
        <h1 className="text-3xl font-serif font-black tracking-tight">Registro de Pacientes</h1>
        <p className="text-sm font-medium text-black/60">
          Listado de pacientes que han reservado consultas contigo.
        </p>
      </div>

      {/* Buscador */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-black/40" />
        <input
          type="text"
          placeholder="Buscar por nombre, apellido, email o DNI..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-xl border border-gray-200 bg-gray-50 focus:bg-white text-black h-11 pl-11 pr-4 text-sm outline-none focus:ring-2 focus:ring-[#F4C443] transition-all"
        />
      </div>

      {patients.length === 0 ? (
        <div className="p-12 border border-dashed border-gray-200 rounded-2xl text-center bg-gray-50">
          <Users className="h-10 w-10 text-black/30 mx-auto mb-4" />
          <p className="text-sm font-medium text-black/40">Aún no tienes pacientes registrados en tu agenda.</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="p-12 border border-dashed border-gray-200 rounded-2xl text-center bg-gray-50">
          <Search className="h-10 w-10 text-black/30 mx-auto mb-4" />
          <p className="text-sm font-medium text-black/40">No se encontraron pacientes para &ldquo;{search}&rdquo;.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((patient) => (
            <div
              key={patient.id}
              className="bg-white border border-gray-100 p-6 rounded-2xl shadow-sm flex flex-col justify-between hover:shadow-md transition-all"
            >
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-2xl bg-black text-[#FDF6CD] flex items-center justify-center font-bold text-sm shrink-0">
                    {patient.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-black leading-tight">
                      {patient.name} {patient.lastName}
                    </h3>
                    <span className="text-[9px] uppercase font-bold tracking-widest text-[#E5B534]">
                      Paciente Activo
                    </span>
                  </div>
                </div>

                <div className="space-y-2 border-t border-black/5 pt-4 text-xs font-semibold text-black/75">
                  <div className="flex items-center gap-2">
                    <Award className="h-3.5 w-3.5 opacity-60 text-black" />
                    <span>DNI: {patient.dni || "No registrado"}</span>
                  </div>
                  {patient.birthDate && (
                    <div className="flex items-center gap-2">
                      <Calendar className="h-3.5 w-3.5 opacity-60 text-black" />
                      <span>
                        Nacimiento: {new Date(patient.birthDate).toLocaleDateString("es-ES", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <Heart className="h-3.5 w-3.5 opacity-60 text-[#E5B534]" />
                    <span>Prepaga: {patient.insurance || "Ninguna"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="h-3.5 w-3.5 opacity-60 text-black" />
                    <span className="truncate">{patient.email}</span>
                  </div>
                  {patient.phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="h-3.5 w-3.5 opacity-60 text-black" />
                      <span>Tel: {patient.phone}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-6 border-t border-black/5 mt-6 flex items-center justify-between text-[9px] font-bold text-black/40 uppercase tracking-widest">
                <span>Última visita</span>
                <span>
                  {new Date(patient.lastAppointment).toLocaleDateString("es-ES", {
                    day: "numeric",
                    month: "short",
                  })}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
