"use client"

import { useState, useMemo, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Search, User, Clock, Heart, Calendar, MapPin, Phone, Building2 } from "lucide-react"
import AvatarDisplay from "@/components/AvatarDisplay"

const DAY_LABELS = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"]

type DoctorWithProfile = {
  id: string
  name: string
  lastName: string | null
  avatar: string
  doctorProfile?: {
    specialty: string
    bio: string | null
    clinicId: string | null
    _count: { followedBy: number }
    availability: { dayOfWeek: number; startTime: string; endTime: string; isActive: boolean }[]
    clinic?: { id: string; name: string; logo: string | null; address: string | null; phone: string | null } | null
  } | null
}

type ClinicWithDoctors = {
  id: string
  name: string
  logo: string | null
  address: string | null
  phone: string | null
  email: string | null
  website: string | null
  description: string | null
  doctors: { user: DoctorWithProfile }[]
}

interface DoctorSearchClientProps {
  doctors: DoctorWithProfile[]
  clinics: ClinicWithDoctors[]
}

type FilterTab = "all" | "clinics" | "individuals"

function DoctorCard({ doctor }: { doctor: DoctorWithProfile }) {
  const profile = doctor.doctorProfile
  const avail = profile?.availability || []
  const activeDays = avail.filter((a) => a.isActive)
  const hasAvailability = activeDays.length > 0
  const followersCount = profile?._count?.followedBy || 0
  const clinicName = profile?.clinic?.name

  return (
    <div className="group bg-white/40 backdrop-blur-md border border-white/50 p-6 sm:p-8 rounded-[32px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-xl hover:bg-white/60 transition-all duration-300 flex flex-col">
      <div className="flex items-start gap-4 mb-4">
        <div className="w-16 h-16 rounded-2xl bg-white/70 border border-white flex items-center justify-center overflow-hidden shadow-inner shrink-0">
          <AvatarDisplay avatar={doctor.avatar} name={doctor.name} size="md" />
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="font-bold text-lg text-black leading-tight truncate">
            Dr. {doctor.name} {doctor.lastName}
          </h2>
          <p className="text-[10px] uppercase tracking-widest text-[#F4C443] font-extrabold mt-0.5">
            {profile?.specialty || "Médico"}
          </p>
          {clinicName && (
            <p className="flex items-center gap-1 mt-1 text-[10px] text-black/50 font-medium">
              <Building2 className="h-3 w-3" /> {clinicName}
            </p>
          )}
          <div className="flex items-center gap-3 mt-2 text-[10px] text-black/40">
            <span className="flex items-center gap-1">
              <Heart className="h-3 w-3 text-red-300" /> {followersCount}
            </span>
            {hasAvailability && (
              <span className="flex items-center gap-1 text-[#F4C443]">
                <Calendar className="h-3 w-3" /> {activeDays.length} días
              </span>
            )}
          </div>
        </div>
      </div>

      {profile?.bio && (
        <p className="text-xs font-medium text-black/55 leading-relaxed mb-4 line-clamp-2">
          {profile.bio}
        </p>
      )}

      {hasAvailability ? (
        <div className="flex flex-wrap gap-1.5 mb-5">
          {activeDays.slice(0, 5).map((a, i) => (
            <span key={i} className="text-[9px] bg-[#F4C443]/10 text-[#E5B534] font-bold px-2 py-1 rounded-full uppercase tracking-wider">
              {DAY_LABELS[a.dayOfWeek]} {a.startTime}-{a.endTime}
            </span>
          ))}
          {activeDays.length > 5 && (
            <span className="text-[9px] text-black/30 font-bold px-2 py-1">+{activeDays.length - 5} más</span>
          )}
        </div>
      ) : (
        <div className="flex items-center gap-1.5 mb-5 text-[10px] text-black/30 italic">
          <Clock className="h-3 w-3" /> Sin horarios disponibles aún
        </div>
      )}

      <div className="mt-auto pt-4 border-t border-black/5">
        <Link
          href={`/especialistas/${doctor.id}`}
          className="block w-full py-3 bg-black text-[#FDF6CD] text-center rounded-[18px] text-[11px] font-bold uppercase tracking-wider hover:bg-[#F4C443] hover:text-black transition-all"
        >
          Ver perfil y reservar
        </Link>
      </div>
    </div>
  )
}

function ClinicCard({ clinic }: { clinic: ClinicWithDoctors }) {
  const doctorsWithProfile = clinic.doctors
    .map((d) => d.user)
    .filter((d) => d.doctorProfile)

  return (
    <div className="bg-white/50 backdrop-blur-md border border-white/60 rounded-[36px] shadow-[0_8px_30px_rgb(0,0,0,0.06)] overflow-hidden">
      <div className="p-8 sm:p-10 border-b border-black/5">
        <div className="flex items-start gap-5">
          {clinic.logo ? (
            <div className="w-20 h-20 rounded-2xl bg-white border border-black/10 flex items-center justify-center overflow-hidden shrink-0 shadow-sm">
              <img src={clinic.logo} alt={clinic.name} className="w-full h-full object-cover" />
            </div>
          ) : (
            <div className="w-20 h-20 rounded-2xl bg-[#F4C443]/10 border border-[#F4C443]/20 flex items-center justify-center shrink-0">
              <Building2 className="h-8 w-8 text-[#F4C443]" />
            </div>
          )}
          <div className="flex-1 min-w-0 space-y-2">
            <h2 className="font-serif font-black text-xl sm:text-2xl text-black leading-tight">
              {clinic.name}
            </h2>
            {clinic.address && (
              <p className="flex items-center gap-1.5 text-xs text-black/50 font-medium">
                <MapPin className="h-3.5 w-3.5 shrink-0" /> {clinic.address}
              </p>
            )}
            <div className="flex flex-wrap items-center gap-4 text-[10px] text-black/40 font-bold uppercase tracking-wider">
              {clinic.phone && (
                <span className="flex items-center gap-1">
                  <Phone className="h-3 w-3" /> {clinic.phone}
                </span>
              )}
              <span className="flex items-center gap-1">
                <User className="h-3 w-3" /> {doctorsWithProfile.length} {doctorsWithProfile.length === 1 ? "especialista" : "especialistas"}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 sm:p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {doctorsWithProfile.map((doctor) => (
            <DoctorCard key={doctor.id} doctor={doctor} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default function DoctorSearchClient({ doctors, clinics }: DoctorSearchClientProps) {
  const searchParams = useSearchParams()
  const router = useRouter()

  const initialQuery = searchParams.get("q") || ""
  const initialFilter = (searchParams.get("filter") as FilterTab) || "all"

  const [search, setSearch] = useState(initialQuery)
  const [activeFilter, setActiveFilter] = useState<FilterTab>(initialFilter)

  useEffect(() => {
    const params = new URLSearchParams()
    if (search) params.set("q", search)
    if (activeFilter !== "all") params.set("filter", activeFilter)
    const qs = params.toString()
    router.replace(`/especialistas${qs ? `?${qs}` : ""}`, { scroll: false })
  }, [search, activeFilter, router])

  const filteredDoctors = useMemo(() => {
    if (!search.trim()) return doctors
    const q = search.toLowerCase()
    return doctors.filter((d) => {
      const name = `${d.name} ${d.lastName || ""}`.toLowerCase()
      const specialty = d.doctorProfile?.specialty?.toLowerCase() || ""
      const clinicName = d.doctorProfile?.clinic?.name?.toLowerCase() || ""
      return name.includes(q) || specialty.includes(q) || clinicName.includes(q)
    })
  }, [doctors, search])

  const filteredClinics = useMemo(() => {
    if (!search.trim()) return clinics
    const q = search.toLowerCase()
    return clinics.filter((c) => {
      const clinicMatch =
        c.name.toLowerCase().includes(q) ||
        c.address?.toLowerCase().includes(q) ||
        c.description?.toLowerCase().includes(q)
      const hasMatchingDoctor = c.doctors.some((d) => {
        const doc = d.user
        const name = `${doc.name} ${doc.lastName || ""}`.toLowerCase()
        const specialty = doc.doctorProfile?.specialty?.toLowerCase() || ""
        return name.includes(q) || specialty.includes(q)
      })
      return clinicMatch || hasMatchingDoctor
    })
  }, [clinics, search])

  const individualDoctors = useMemo(
    () => filteredDoctors.filter((d) => !d.doctorProfile?.clinicId),
    [filteredDoctors]
  )

  const clinicDoctors = useMemo(
    () => filteredDoctors.filter((d) => !!d.doctorProfile?.clinicId),
    [filteredDoctors]
  )

  const activeClinicIds = useMemo(
    () => new Set(clinicDoctors.map((d) => d.doctorProfile?.clinicId).filter(Boolean)),
    [clinicDoctors]
  )

  const visibleClinics = useMemo(
    () => filteredClinics.filter((c) => activeClinicIds.has(c.id)),
    [filteredClinics, activeClinicIds]
  )

  const totalCount = filteredDoctors.length

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div className="space-y-2">
          <h1 className="text-3xl sm:text-4xl font-serif font-black tracking-tight text-black">
            Nuestros Especialistas<span className="text-[#F4C443]">.</span>
          </h1>
          <p className="text-sm font-medium text-black/60 max-w-md">
            Encontrá al profesional ideal y reservá tu turno en minutos.
          </p>
        </div>
        <span className="text-[10px] uppercase font-bold tracking-widest text-black/40 shrink-0">
          {totalCount} {totalCount === 1 ? "especialista" : "especialistas"} disponibles
        </span>
      </div>

      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-black/30" />
          <input
            type="text"
            placeholder="Buscar por nombre, especialidad o clínica..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-3.5 bg-white/60 backdrop-blur-md border border-white/60 rounded-2xl text-sm font-medium text-black placeholder:text-black/30 focus:outline-none focus:ring-2 focus:ring-[#F4C443]/50 focus:border-[#F4C443]/50 transition-all shadow-sm"
          />
        </div>

        <div className="flex items-center gap-2">
          {([
            { key: "all", label: "Todos" },
            { key: "clinics", label: "Clínicas" },
            { key: "individuals", label: "Consultorios Individuales" },
          ] as const).map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveFilter(tab.key)}
              className={`px-4 py-2 rounded-full text-[11px] font-bold uppercase tracking-wider transition-all ${
                activeFilter === tab.key
                  ? "bg-black text-[#FDF6CD] shadow-sm"
                  : "bg-white/50 text-black/50 hover:bg-white/80 hover:text-black border border-black/5"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {totalCount === 0 ? (
        <div className="p-14 border-2 border-dashed border-black/10 rounded-[36px] text-center bg-white/20 space-y-3">
          <User className="h-12 w-12 text-black/20 mx-auto" />
          <p className="text-sm font-bold text-black/40">No se encontraron resultados.</p>
          <p className="text-xs text-black/30">Intentá con otros términos de búsqueda.</p>
        </div>
      ) : (
        <div className="space-y-10">
          {(activeFilter === "all" || activeFilter === "clinics") && visibleClinics.length > 0 && (
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-[#F4C443]/10 flex items-center justify-center">
                  <Building2 className="h-4 w-4 text-[#F4C443]" />
                </div>
                <h2 className="font-serif font-black text-lg text-black">Clínicas</h2>
                <span className="text-[10px] uppercase font-bold tracking-widest text-black/30">
                  {visibleClinics.length}
                </span>
              </div>
              {visibleClinics.map((clinic) => (
                <ClinicCard key={clinic.id} clinic={clinic} />
              ))}
            </div>
          )}

          {(activeFilter === "all" || activeFilter === "individuals") && individualDoctors.length > 0 && (
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-black/5 flex items-center justify-center">
                  <User className="h-4 w-4 text-black/50" />
                </div>
                <h2 className="font-serif font-black text-lg text-black">Consultorios Individuales</h2>
                <span className="text-[10px] uppercase font-bold tracking-widest text-black/30">
                  {individualDoctors.length}
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {individualDoctors.map((doctor) => (
                  <DoctorCard key={doctor.id} doctor={doctor} />
                ))}
              </div>
            </div>
          )}

          {activeFilter === "clinics" && individualDoctors.length > 0 && visibleClinics.length === 0 && (
            <div className="p-14 border-2 border-dashed border-black/10 rounded-[36px] text-center bg-white/20 space-y-3">
              <User className="h-12 w-12 text-black/20 mx-auto" />
              <p className="text-sm font-bold text-black/40">No hay clínicas con esos resultados.</p>
            </div>
          )}
        </div>
      )}
    </>
  )
}
