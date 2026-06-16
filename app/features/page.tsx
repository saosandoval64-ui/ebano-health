"use client"

import { 
  Calendar, Clock, CheckCircle, Bell, MessageSquare, 
  UserPlus, FileText, Search, FolderOpen, ClipboardList, Activity,
  Heart, RefreshCw, Pill, Phone,
  Video, Monitor, Wifi,
  BarChart3, DollarSign, PieChart, TrendingUp, Zap,
  MessageCircle, Mail, Send, Headphones,
  Bot, Sparkles, Brain,
  Users, Shield, Lock, Layout, FileBarChart, Database, Building2, Globe,
  ArrowRight, Stethoscope, Star
} from "lucide-react"
import Link from "next/link"
import Logo from "@/components/Logo"

const features = [
  {
    category: "Gestión de Citas",
    icon: Calendar,
    color: "#F4C443",
    bgColor: "#F4C443",
    description: "Agenda médica digital completa para optimizar el tiempo de profesionales y pacientes.",
    items: [
      { icon: Calendar, title: "Agenda médica digital", desc: "Calendario interactivo con disponibilidad en tiempo real." },
      { icon: Clock, title: "Reserva en línea", desc: "Pacientes reservan citas 24/7 desde cualquier dispositivo." },
      { icon: RefreshCw, title: "Reprogramación rápida", desc: "Cambiar fechas y horarios con un solo clic." },
      { icon: CheckCircle, title: "Confirmación automática", desc: "Confirmación instantánea de asistencia al reservar." },
      { icon: Bell, title: "Recordatorios WhatsApp", desc: "Notificaciones automáticas vía WhatsApp antes de la cita." },
      { icon: Activity, title: "Reducción de ausencias", desc: "Sistema inteligente que minimiza pacientes que no asisten." },
    ]
  },
  {
    category: "Gestión de Pacientes",
    icon: UserPlus,
    color: "#8B5A2B",
    bgColor: "#8B5A2B",
    description: "Registro completo y organización eficiente de toda la información del paciente.",
    items: [
      { icon: UserPlus, title: "Registro de pacientes", desc: "Alta rápida con datos personales, DNI y obra social." },
      { icon: ClipboardList, title: "Historial de consultas", desc: "Registro detallado de cada visita médica." },
      { icon: FileText, title: "Historia clínica digital", desc: "Expediente completo y accesible en cualquier momento." },
      { icon: Search, title: "Búsqueda rápida", desc: "Encontrar pacientes por nombre, DNI o expediente." },
      { icon: FolderOpen, title: "Gestión de documentos", desc: "Almacenamiento de exámenes, estudios y resultados." },
      { icon: Pill, title: "Tratamientos y evolución", desc: "Seguimiento del progreso y evolución del paciente." },
    ]
  },
  {
    category: "Seguimiento de Pacientes",
    icon: Heart,
    color: "#E57373",
    bgColor: "#E57373",
    description: "Mantén el contacto continuo con tus pacientes para mejores resultados.",
    items: [
      { icon: Bell, title: "Recordatorios de controles", desc: "Alertas automáticas para próximos controles médicos." },
      { icon: RefreshCw, title: "Seguimiento post-consulta", desc: "Mensajes automáticos después de cada visita." },
      { icon: Pill, title: "Recordatorios de medicamentos", desc: "Alertas para que los pacientes no olviden su tratamiento." },
      { icon: Phone, title: "Comunicación automatizada", desc: "Mensajes programados según el plan de tratamiento." },
    ]
  },
  {
    category: "Telemedicina",
    icon: Video,
    color: "#4FC3F7",
    bgColor: "#4FC3F7",
    description: "Atención médica remota de calidad desde cualquier lugar.",
    items: [
      { icon: Video, title: "Videoconsultas integradas", desc: "Consultas por video directamente desde la plataforma." },
      { icon: Monitor, title: "Acceso al expediente", desc: "Historia clínica disponible durante la consulta." },
      { icon: Wifi, title: "Desde cualquier dispositivo", desc: "PC, tablet o celular — sin instalar aplicaciones." },
    ]
  },
  {
    category: "Administración y Finanzas",
    icon: BarChart3,
    color: "#81C784",
    bgColor: "#81C784",
    description: "Control total sobre los aspectos financieros y operativos de tu consultorio.",
    items: [
      { icon: DollarSign, title: "Control de ingresos", desc: "Registro y seguimiento de todos los pagos recibidos." },
      { icon: FileBarChart, title: "Reportes de consultas", desc: "Informes detallados de actividad médica." },
      { icon: PieChart, title: "Estadísticas de pacientes", desc: "Métricas de pacientes atendidos y tendencias." },
      { icon: Layout, title: "Panel administrativo", desc: "Dashboard con métricas clave en tiempo real." },
      { icon: Zap, title: "Automatización", desc: "Tareas administrativas automáticas y sin errores." },
    ]
  },
  {
    category: "Comunicación",
    icon: MessageSquare,
    color: "#BA68C8",
    bgColor: "#BA68C8",
    description: "Mantén una comunicación fluida con tus pacientes en todos los canales.",
    items: [
      { icon: MessageCircle, title: "Integración WhatsApp", desc: "Mensajes directos por WhatsApp desde la plataforma." },
      { icon: Bell, title: "Notificaciones automáticas", desc: "Alertas de citas, resultados y recordatorios." },
      { icon: Mail, title: "Correos electrónicos", desc: "Emails automatizados de confirmación y seguimiento." },
      { icon: Send, title: "Mensajería directa", desc: "Chat en tiempo real con pacientes." },
    ]
  },
  {
    category: "Inteligencia Artificial",
    icon: Bot,
    color: "#FFB74D",
    bgColor: "#FFB74D",
    description: "Asistentes inteligentes que optimizan la experiencia del paciente.",
    items: [
      { icon: Bot, title: "Asistente virtual", desc: "Agendamiento automático mediante chatbot inteligente." },
      { icon: Sparkles, title: "Preguntas frecuentes", desc: "Respuestas automáticas a las consultas más comunes." },
      { icon: Brain, title: "Atención inicial", desc: "Triaje automatizado antes de la consulta médica." },
    ]
  },
  {
    category: "Funciones para Clínicas",
    icon: Building2,
    color: "#90A4AE",
    bgColor: "#90A4AE",
    description: "Herramientas diseñadas para clínicas con múltiples profesionales.",
    items: [
      { icon: Users, title: "Múltiples médicos", desc: "Varios profesionales en una misma cuenta de clínica." },
      { icon: Calendar, title: "Múltiples agendas", desc: "Cada médico con su propia agenda independiente." },
      { icon: Shield, title: "Roles y permisos", desc: "Administrador, Médico, Secretaria — control de acceso." },
      { icon: Lock, title: "Acceso por usuario", desc: "Cada rol ve solo la información que le corresponde." },
      { icon: Layout, title: "Panel de clínica", desc: "Vista centralizada de toda la operación." },
      { icon: Database, title: "Base compartida", desc: "Pacientes y datos accesibles para todo el equipo." },
      { icon: FileBarChart, title: "Reportes por médico", desc: "Estadísticas individuales y comparativas." },
      { icon: Globe, title: "Múltiples sucursales", desc: "Gestión de distintas ubicaciones (próximamente)." },
    ]
  },
]

export default function FeaturesPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <div className="bg-[#F4C443] pt-8 pb-20 px-6 rounded-b-[40px]">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-12">
            <Link href="/" className="flex items-center gap-3">
              <Logo size="sm" />
            </Link>
            <Link href="/register" className="text-xs font-bold uppercase tracking-wider text-black/70 hover:text-black transition-colors">
              Empezar
            </Link>
          </div>

          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-black/10 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest text-black/60 mb-6">
              <Star className="w-3.5 h-3.5" />
              Plataforma todo-en-uno
            </div>
            <h1 className="text-4xl md:text-5xl font-serif font-black text-black tracking-tight mb-4">
              Todo lo que necesitás para<br />
              <span className="text-white">tu consultorio médico</span>
            </h1>
            <p className="text-sm md:text-base text-black/60 font-medium max-w-xl mx-auto">
              Gestión de citas, historia clínica, telemedicina, comunicación y más — todo en una sola plataforma.
            </p>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <main className="max-w-6xl mx-auto px-6 -mt-10 relative z-10 pb-20">
        <div className="space-y-12">
          {features.map((section, idx) => (
            <div key={idx} className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
              {/* Section Header */}
              <div className="p-6 md:p-8 border-b border-gray-50">
                <div className="flex items-center gap-4">
                  <div 
                    className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0"
                    style={{ backgroundColor: `${section.bgColor}15` }}
                  >
                    <section.icon className="w-6 h-6" style={{ color: section.color }} />
                  </div>
                  <div>
                    <h2 className="text-xl font-serif font-black text-black">{section.category}</h2>
                    <p className="text-xs text-black/50 font-medium mt-0.5">{section.description}</p>
                  </div>
                </div>
              </div>

              {/* Items Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0">
                {section.items.map((item, itemIdx) => (
                  <div 
                    key={itemIdx}
                    className="p-5 md:p-6 border-b border-r border-gray-50 last:border-r-0 hover:bg-gray-50/50 transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      <div 
                        className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5"
                        style={{ backgroundColor: `${section.bgColor}10` }}
                      >
                        <item.icon className="w-4 h-4" style={{ color: section.color }} />
                      </div>
                      <div>
                        <h3 className="font-bold text-sm text-black">{item.title}</h3>
                        <p className="text-[11px] text-black/50 font-medium mt-0.5 leading-relaxed">{item.desc}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Problems Section */}
        <div className="mt-16">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-serif font-black text-black tracking-tight mb-3">
              ¿Qué problemas resolvemos?
            </h2>
            <p className="text-sm text-black/50 font-medium max-w-lg mx-auto">
              Todo lo que antes te complicaba, ahora se resuelve automáticamente.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              "Pacientes que olvidan sus citas",
              "Exceso de llamadas telefónicas",
              "Historias clínicas desorganizadas",
              "Falta de seguimiento a pacientes",
              "Pérdida de tiempo administrativo",
              "Falta de control financiero",
              "Uso de múltiples plataformas",
              "Dificultad para coordinar varios médicos",
              "Falta de control sobre recepción",
              "Información dispersa entre sistemas",
            ].map((problem, idx) => (
              <div key={idx} className="flex items-center gap-3 bg-white border border-gray-100 p-4 rounded-2xl shadow-sm">
                <div className="w-8 h-8 rounded-xl bg-red-50 flex items-center justify-center shrink-0">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                </div>
                <p className="text-sm font-bold text-black">{problem}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="mt-16 text-center">
          <div className="bg-gradient-to-br from-[#F4C443] to-[#E5B534] p-8 md:p-12 rounded-3xl">
            <h2 className="text-2xl md:text-3xl font-serif font-black text-black tracking-tight mb-3">
              ¿Listo para transformar tu consultorio?
            </h2>
            <p className="text-sm text-black/60 font-medium mb-6 max-w-md mx-auto">
              Unite a los profesionales médicos que ya usan Ébano Health para optimizar su práctica.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/register"
                className="inline-flex items-center gap-2 px-8 py-3.5 bg-black text-[#FDF6CD] rounded-2xl font-bold text-sm hover:bg-black/80 transition-all shadow-lg"
              >
                Empezar gratis <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/especialistas"
                className="inline-flex items-center gap-2 px-8 py-3.5 bg-white/30 text-black rounded-2xl font-bold text-sm hover:bg-white/50 transition-all border border-black/10"
              >
                <Stethoscope className="w-4 h-4" /> Ver especialistas
              </Link>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-black text-white py-12 px-6">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <Logo size="sm" />
          <div className="flex items-center gap-6 text-xs text-white/40 font-medium">
            <Link href="/contact" className="hover:text-white transition-colors">Contacto</Link>
            <Link href="/especialistas" className="hover:text-white transition-colors">Especialistas</Link>
            <Link href="/features" className="hover:text-white transition-colors">Funciones</Link>
          </div>
          <p className="text-xs text-white/30 font-medium">© 2026 Ébano Health</p>
        </div>
      </footer>
    </div>
  )
}
