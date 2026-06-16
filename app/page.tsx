"use client"

import { Button } from "@/components/ui/button"
import { 
  UserPlus, 
  ArrowDown,
  User,
  Stethoscope,
} from "lucide-react"
import Link from "next/link"
import Logo from "@/components/Logo"

export default function LandingPage() {
  const pasosRegistro = [
    {
      num: "01",
      title: "Ir al registro de pacientes",
      desc: "Desde la página de inicio, hacer clic en “Sign Up” (en el navbar) o en el botón “Empezar” (en la sección principal)."
    },
    {
      num: "02",
      title: "Completar el formulario de registro",
      desc: "Ingresar nombre, apellido, correo electrónico, DNI, teléfono, fecha de nacimiento y obra social (opcional). Elegir una contraseña segura y confirmarla."
    },
    {
      num: "03",
      title: "Confirmar cuenta y acceder",
      desc: "Después de enviar el formulario, aparecerá un mensaje de éxito. Hacer clic en “Iniciar sesión” y autenticarse con el correo y la contraseña recién creados."
    },
    {
      num: "04",
      title: "Explorar especialistas médicos",
      desc: "Una vez dentro del sistema, desde el menú principal (o desde el panel del paciente) ir a “ESPECIALISTAS”. Se mostrará una lista completa de médicos con su especialidad, matrícula y teléfono."
    },
    {
      num: "05",
      title: "Seleccionar un médico",
      desc: "Hacer clic en “Ver agenda” en la tarjeta del médico deseado. Se abrirá un calendario interactivo con los días disponibles (en verde) y los horarios libres."
    },
    {
      num: "06",
      title: "Elegir fecha y hora",
      desc: "En el calendario, seleccionar una fecha con disponibilidad. Luego elegir una hora de entre las opciones mostradas (intervalos de 30 minutos). Hacer clic en “Solicitar” al lado del horario elegido."
    },
    {
      num: "07",
      title: "Confirmar la cita",
      desc: "Revisar los datos en el formulario de confirmación (nombre, fecha, hora y médico). Presionar “Confirmar cita”. La cita quedará registrada con estado “reservado” y se podrá ver en el dashboard en “Mis citas”."
    }
  ];

  const listaAvatares = [
    "/avatars/avatar-1.svg",
    "/avatars/avatar-2.svg",
    "/avatars/avatar-3.svg",
    "/avatars/avatar-4.svg",
  ];

  return (
    <div className="min-h-screen text-black font-sans antialiased flex flex-col justify-between selection:bg-[#E2CE7D] pb-20 md:pb-0">
      
      {/* ================= NAVBAR RESPONSIVO ================= */}
      <header className="w-full max-w-7xl mx-auto px-4 sm:px-8 py-4 sm:py-6 flex items-center justify-between gap-4 relative z-10">
        <Link href="/">
          <Logo size="sm" />
        </Link>

        <nav className="hidden md:flex items-center gap-10 text-xs font-bold uppercase tracking-widest text-black/80">
          <Link href="/" className="pb-1 border-b-2 border-black transition-all">Home</Link>
          <Link href="/especialistas" className="hover:text-black transition-colors">Especialistas</Link>
          <Link href="/contact" className="hover:text-black transition-colors">Contacto</Link>
        </nav>

        <div className="flex items-center gap-2 sm:gap-6">
          <Link href="/login" className="text-xs font-bold uppercase tracking-widest text-black/80 hover:text-black transition-colors">
            Sign In
          </Link>
          <Link href="/register">
            <Button asChild className="rounded-full bg-[#F4C443] hover:bg-[#E5B534] text-black border border-black/10 px-4 sm:px-6 py-2 text-xs font-bold uppercase tracking-wider shadow-sm transition-transform active:scale-95">
              <span className="flex items-center gap-1.5">
                <UserPlus className="h-3.5 w-3.5" /> Sign Up
              </span>
            </Button>
          </Link>
        </div>
      </header>

      {/* ================= HERO SECTION ORIGINAL ================= */}
      <main className="mx-auto max-w-7xl w-full px-4 sm:px-8 pt-16 pb-12 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center flex-1 relative z-10">
        
        <div className="lg:col-span-6 flex flex-col justify-center items-center text-center lg:items-start lg:text-left space-y-6 sm:space-y-8 py-2">
          
          <h1 className="text-4xl sm:text-5xl md:text-6xl xl:text-7xl font-serif font-black tracking-tight text-black leading-[1.1] lg:leading-[1.05]">
            Tu salud,<br className="hidden sm:inline" />
            crece desde aquí<span className="text-[#F4C443]">.</span>
          </h1>
          
          <p className="text-sm sm:text-base md:text-lg text-black/70 leading-relaxed max-w-md font-medium">
            Gestiona tus consultas médicas, administra historiales clínicos de forma segura y agenda turnos con profesionales de manera simple y directa.
          </p>
          
          <div className="w-full flex flex-col items-center lg:items-start gap-6 pt-2">
            
            <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
              
              <Button asChild size="lg" className="rounded-full bg-[#F4C443] hover:bg-[#E5B534] text-black font-bold text-xs tracking-wider uppercase px-7 py-6 shadow-sm border border-black/5 transition-transform hover:-translate-y-0.5 w-full sm:w-auto flex items-center justify-center gap-2">
                <Link href="/login/patient">
                  <User className="h-4 w-4 shrink-0" /> Acceso Pacientes
                </Link>
              </Button>

              <Button asChild size="lg" variant="outline" className="rounded-full bg-transparent border-2 border-black/20 hover:border-black text-black hover:bg-black/5 font-bold text-xs tracking-wider uppercase px-7 py-6 transition-all hover:-translate-y-0.5 w-full sm:w-auto flex items-center justify-center gap-2">
                <Link href="/login/doctor">
                  <Stethoscope className="h-4 w-4 shrink-0" /> Acceso Médicos
                </Link>
              </Button>

            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 pt-1 text-center sm:text-left">
              <div className="flex -space-x-3.5 overflow-hidden">
                {listaAvatares.map((src, index) => (
                  <div key={index} className="inline-block h-11 w-11 sm:h-12 sm:w-12 rounded-full ring-2 ring-[#FDF6CD] overflow-hidden relative bg-black shrink-0">
                    <img
                      src={src}
                      alt={`Paciente Ébano ${index + 1}`}
                      className="h-full w-full object-cover"
                    />
                  </div>
                ))}
              </div>
              <p className="text-xs sm:text-sm font-bold text-black/70 tracking-wide max-w-[240px] sm:max-w-none leading-tight">
                Únete a más de <span className="text-black font-black font-serif text-sm sm:text-base text-[#F4C443]">+500 pacientes</span> que ya confían en Ébano
              </p>
            </div>
          </div>

        </div>

        <div className="lg:col-span-6 flex w-full justify-center lg:justify-end py-2">
          <div className="w-full max-w-[500px] bg-black/5 p-6 sm:p-8 rounded-[28px] sm:rounded-[32px] border border-black/10 flex flex-col justify-between h-[440px] sm:h-[480px]">
            
            <div className="mb-3 sm:mb-4 shrink-0">
              <span className="text-[9px] sm:text-[10px] uppercase font-bold tracking-[0.25em] text-black/50 block mb-1">
                Portal del Paciente
              </span>
              <h2 className="text-2xl sm:text-3xl font-serif font-black text-black tracking-tight">
                Guía de Acceso y Citas
              </h2>
            </div>

            <div className="space-y-5 sm:space-y-6 flex-1 overflow-y-auto pr-1 my-2 scrollbar-none">
              {pasosRegistro.map((paso, idx) => (
                <div key={idx} className="flex items-start gap-4 sm:gap-5 group">
                  
                  <div className="flex flex-col items-center justify-start min-w-[32px] sm:min-w-[36px] pt-0.5">
                    <span className="text-xl sm:text-2xl font-serif font-black text-[#F4C443]">
                      {paso.num}
                    </span>
                  </div>

                  <div className="space-y-1 flex-1">
                    <h3 className="font-bold text-black text-sm sm:text-base tracking-tight">
                      {paso.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-black/60 font-medium leading-relaxed">
                      {paso.desc}
                    </p>
                  </div>

                </div>
              ))}
            </div>

            <div className="pt-3 sm:pt-4 border-t border-black/10 flex items-center justify-between text-[10px] sm:text-xs font-bold text-black/40 uppercase tracking-widest shrink-0">
              <span>Ébano Health SaaS</span>
              <span className="text-[#F4C443]">● Activo</span>
            </div>

          </div>
        </div>

      </main>

      <div className="w-full flex flex-col items-center justify-center gap-1 pb-4 text-center shrink-0 relative z-10">
        <span className="text-[9px] sm:text-[10px] uppercase font-bold tracking-[0.2em] text-black/40">
          Scroll down to see more
        </span>
        <ArrowDown className="h-3.5 w-3.5 text-black/40 animate-bounce" />
      </div>

      <footer className="w-full bg-black text-white py-12 sm:py-16 mt-16 sm:mt-20 relative z-10" id="contact">
        <div className="mx-auto max-w-7xl w-full px-4 sm:px-8">
          
          {/* Main Footer Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12 mb-8">
            {/* Branding Column */}
            <div className="flex flex-col items-center md:items-start gap-4">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-2xl flex items-center justify-center overflow-hidden">
                  <img src="/avatars/avatar-4.svg" alt="Ébano" className="w-9 h-9 object-cover" />
                </div>
                <div>
                  <span className="text-2xl font-serif font-black tracking-tight text-white">Ébano</span>
                  <span className="text-xs text-white/60 font-semibold tracking-wider uppercase block leading-tight">Health</span>
                </div>
              </div>
              <p className="text-sm text-white/70 max-w-xs text-center md:text-left">
                Conectando pacientes con médicos de confianza en una plataforma moderna y segura.
              </p>
            </div>

            {/* Links Column 1 */}
            <div className="flex flex-col items-center md:items-start gap-4">
              <h4 className="font-bold text-sm uppercase tracking-wider">Plataforma</h4>
              <ul className="space-y-2 text-sm text-white/60 text-center md:text-left">
                <li>
                  <Link href="/" className="hover:text-[#F4C443] transition-colors">
                    Inicio
                  </Link>
                </li>
                <li>
                  <Link href="/especialistas" className="hover:text-[#F4C443] transition-colors">
                    Especialistas
                  </Link>
                </li>
                <li>
                  <Link href="/register" className="hover:text-[#F4C443] transition-colors">
                    Registrarse
                  </Link>
                </li>
                <li>
                  <Link href="/login/patient" className="hover:text-[#F4C443] transition-colors">
                    Iniciar Sesión
                  </Link>
                </li>
              </ul>
            </div>

            {/* Links Column 2 */}
            <div className="flex flex-col items-center md:items-start gap-4">
              <h4 className="font-bold text-sm uppercase tracking-wider">Información</h4>
              <ul className="space-y-2 text-sm text-white/60 text-center md:text-left">
                <li>
                  <Link href="/contact" className="hover:text-[#F4C443] transition-colors">
                    Contacto
                  </Link>
                </li>
                <li>
                  <a href="mailto:contacto@ebano.com" className="hover:text-[#F4C443] transition-colors">
                    Email: contacto@ebano.com
                  </a>
                </li>
                <li>
                  <a href="tel:+541100000000" className="hover:text-[#F4C443] transition-colors">
                    Teléfono: +54 11 0000-0000
                  </a>
                </li>
                <li>
                  <p>Buenos Aires, Argentina</p>
                </li>
              </ul>
            </div>

            {/* Social & Newsletter */}
            <div className="flex flex-col items-center md:items-start gap-4">
              <h4 className="font-bold text-sm uppercase tracking-wider">Síguenos</h4>
              <div className="flex items-center gap-4">
                <a 
                  href="https://instagram.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="h-10 w-10 rounded-full bg-white/10 hover:bg-[#F4C443] flex items-center justify-center text-white transition-colors"
                  aria-label="Instagram"
                >
                  <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.645-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                  </svg>
                </a>
                <a 
                  href="https://facebook.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="h-10 w-10 rounded-full bg-white/10 hover:bg-[#F4C443] flex items-center justify-center text-white transition-colors"
                  aria-label="Facebook"
                >
                  <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
                    <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/>
                  </svg>
                </a>
                <a 
                  href="https://linkedin.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="h-10 w-10 rounded-full bg-white/10 hover:bg-[#F4C443] flex items-center justify-center text-white transition-colors"
                  aria-label="LinkedIn"
                >
                  <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-white/10 my-8" />

          {/* Bottom Footer */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
            <div className="text-sm text-white/60">
              <p>© {new Date().getFullYear()} Ébano Health. Todos los derechos reservados.</p>
            </div>
            <div className="flex items-center gap-6 text-sm text-white/60">
              <Link href="#" className="hover:text-[#F4C443] transition-colors">
                Política de Privacidad
              </Link>
              <Link href="#" className="hover:text-[#F4C443] transition-colors">
                Términos de Servicio
              </Link>
              <Link href="/contact" className="hover:text-[#F4C443] transition-colors">
                Contacto
              </Link>
              <Link href="/login/admin" className="hover:text-[#F4C443] transition-colors">
                Admin
              </Link>
            </div>
          </div>

        </div>
      </footer>

    </div>
  )
}
