import { db } from "../../lib/db"
import Link from "next/link"
import { User, UserPlus, ArrowLeftIcon } from "lucide-react"
import { Button } from "@/components/ui/button"

export default async function EspecialistasPage() {
  const doctors = await db.user.findMany({
    where: { role: "DOCTOR" },
    include: { doctorProfile: true },
    orderBy: { name: "asc" },
  })

  return (
    <div className="min-h-screen bg-[#FDF6CD] text-black font-sans antialiased selection:bg-[#E2CE7D]">
      {/* Navbar */}
      <header className="w-full max-w-7xl mx-auto px-4 sm:px-8 py-4 sm:py-6 flex items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-1 cursor-pointer shrink-0">
          <span className="text-xl sm:text-2xl font-serif font-black tracking-tight text-black">
            Ébano<span className="text-[#A2B676]">.</span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-10 text-xs font-bold uppercase tracking-widest text-black/80">
          <Link href="/" className="hover:text-black transition-colors">Home</Link>
          <Link href="/especialistas" className="pb-1 border-b-2 border-black transition-all">Especialistas</Link>
          <Link href="#contact" className="hover:text-black transition-colors">Contacto</Link>
        </nav>

        <div className="flex items-center gap-4 sm:gap-6">
          <Link href="/login" className="text-xs font-bold uppercase tracking-widest text-black/80 hover:text-black transition-colors">
            Sign In
          </Link>
          <Button asChild className="rounded-full bg-[#F4C443] hover:bg-[#E5B534] text-black border border-black/10 px-4 sm:px-6 py-2 text-xs font-bold uppercase tracking-wider shadow-sm transition-transform active:scale-95">
            <Link href="/register" className="flex items-center gap-1.5">
              <UserPlus className="h-3.5 w-3.5" /> Sign Up
            </Link>
          </Button>
        </div>
      </header>

      <main className="mx-auto max-w-7xl w-full px-4 sm:px-8 py-8 space-y-10">
        {/* Encabezado de la sección */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div className="space-y-2">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-[10px] uppercase font-bold tracking-widest text-black/40 hover:text-black transition-colors"
            >
              <ArrowLeftIcon className="h-3 w-3" /> Volver al inicio
            </Link>
            <h1 className="text-3xl sm:text-4xl font-serif font-black tracking-tight text-black">
              Nuestros Especialistas<span className="text-[#A2B676]">.</span>
            </h1>
            <p className="text-sm font-medium text-black/60 max-w-md">
              Encontrá al profesional ideal y reservá tu turno en minutos.
            </p>
          </div>
          <span className="text-[10px] uppercase font-bold tracking-widest text-black/40 shrink-0">
            {doctors.length} {doctors.length === 1 ? "especialista" : "especialistas"} disponibles
          </span>
        </div>

        {doctors.length === 0 ? (
          <div className="p-14 border-2 border-dashed border-black/10 rounded-[36px] text-center bg-white/20 space-y-3">
            <User className="h-12 w-12 text-black/20 mx-auto" />
            <p className="text-sm font-bold text-black/40">Aún no hay especialistas registrados.</p>
            <p className="text-xs text-black/30">Volvé más tarde o contactá al equipo de Ébano Health.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {doctors.map((doctor) => (
              <div
                key={doctor.id}
                className="group bg-white/40 backdrop-blur-md border border-white/50 p-6 sm:p-8 rounded-[32px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-xl hover:bg-white/60 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  {/* Avatar y nombre */}
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-16 h-16 rounded-[20px] bg-white/70 border border-white flex items-center justify-center overflow-hidden shadow-inner shrink-0">
                      {doctor.doctorProfile?.imageUrl ? (
                        <img
                          src={doctor.doctorProfile.imageUrl}
                          alt={doctor.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <User className="text-black/20 w-8 h-8" />
                      )}
                    </div>
                    <div className="space-y-1">
                      <h2 className="font-bold text-lg text-black leading-tight">
                        Dr. {doctor.name} {doctor.lastName}
                      </h2>
                      <p className="text-[10px] uppercase tracking-widest text-[#A2B676] font-extrabold">
                        {doctor.doctorProfile?.specialty || "Médico"}
                      </p>
                    </div>
                  </div>

                  {/* Bio corta */}
                  {doctor.doctorProfile?.bio && (
                    <p className="text-xs font-medium text-black/55 leading-relaxed mb-6 line-clamp-2">
                      {doctor.doctorProfile.bio}
                    </p>
                  )}
                </div>

                {/* Matrícula + Link */}
                <div className="space-y-3 border-t border-black/5 pt-5">
                  <p className="text-[10px] uppercase font-bold tracking-widest text-black/30">
                    Mat. {doctor.doctorProfile?.license || "N/A"}
                  </p>
                  <Link
                    href={`/especialistas/${doctor.id}`}
                    className="block w-full py-3 bg-black text-[#FDF6CD] text-center rounded-[18px] text-[11px] font-bold uppercase tracking-wider hover:bg-black/80 transition-colors group-hover:bg-[#A2B676] group-hover:text-black"
                  >
                    Ver agenda y reservar
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <footer className="w-full border-t border-black/5 py-6 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold tracking-wider text-black font-serif">ÉBANO</span>
            <p className="text-[10px] text-black/40">© {new Date().getFullYear()} Ébano Health. Todos los derechos reservados.</p>
          </div>
          <Link href="/login" className="text-xs font-bold uppercase tracking-widest text-black/50 hover:text-black transition-colors">
            Iniciar Sesión →
          </Link>
        </div>
      </footer>
    </div>
  )
}
