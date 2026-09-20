import { Suspense } from "react"
import { db } from "../../lib/db"
import NavbarClient from "./NavbarClient"
import DoctorSearchClient from "./DoctorSearchClient"

export const dynamic = "force-dynamic"

export default async function EspecialistasPage() {
  const [doctors, clinics] = await Promise.all([
    db.user.findMany({
      where: { role: "DOCTOR" },
      select: {
        id: true,
        name: true,
        lastName: true,
        avatar: true,
        doctorProfile: {
          select: {
            specialty: true,
            bio: true,
            clinicId: true,
            _count: { select: { followedBy: true } },
            availability: { where: { isActive: true }, orderBy: { dayOfWeek: "asc" } },
            clinic: { select: { id: true, name: true, logo: true, address: true, phone: true } },
          },
        },
      },
      orderBy: { name: "asc" },
    }),
    db.clinic.findMany({
      select: {
        id: true,
        name: true,
        logo: true,
        address: true,
        phone: true,
        email: true,
        website: true,
        description: true,
        doctors: {
          select: {
            user: {
              select: {
                id: true,
                name: true,
                lastName: true,
                avatar: true,
                doctorProfile: {
                  select: {
                    specialty: true,
                    bio: true,
                    clinicId: true,
                    _count: { select: { followedBy: true } },
                    availability: { where: { isActive: true }, orderBy: { dayOfWeek: "asc" } },
                  },
                },
              },
            },
          },
        },
      },
      orderBy: { name: "asc" },
    }),
  ])

  return (
    <div className="min-h-screen text-black font-sans antialiased selection:bg-[#E2CE7D] pb-20 md:pb-0">
      <NavbarClient />

      <main className="mx-auto max-w-7xl w-full px-4 sm:px-8 py-16 space-y-10 relative z-10">
        <Suspense>
          <DoctorSearchClient doctors={doctors} clinics={clinics} />
        </Suspense>
      </main>

      <footer className="w-full border-t border-black/5 py-6 mt-16 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold tracking-wider text-black font-serif">ÉBANO</span>
            <p className="text-[10px] text-black/40">© {new Date().getFullYear()} Ébano Health.</p>
          </div>
          <a href="/login" className="text-xs font-bold uppercase tracking-widest text-black/50 hover:text-black transition-colors">
            Iniciar Sesión →
          </a>
        </div>
      </footer>
    </div>
  )
}
