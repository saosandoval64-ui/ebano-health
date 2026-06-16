import { auth } from "../../../lib/auth"
import { redirect } from "next/navigation"
import { Video, Shield, MonitorPlay, MessageSquare, FileText } from "lucide-react"

export default async function DoctorTelemedicine() {
  const session = await auth()
  if (!session?.user || session.user.role !== "DOCTOR") {
    return redirect("/login?role=doctor")
  }

  return (
    <div className="max-w-5xl mx-auto px-8 pt-8 pb-8">
      {/* Header */}
      <div className="mb-10">
        <p className="text-xs font-bold text-black/40 uppercase tracking-widest mb-1">Consultas remotas</p>
        <h1 className="text-3xl font-serif font-black text-black tracking-tight">Telemedicina</h1>
      </div>

      {/* Coming Soon Card */}
      <div className="bg-gradient-to-br from-[#F4C443] to-[#F9A825] rounded-3xl p-10 mb-10 text-center shadow-lg">
        <div className="w-20 h-20 rounded-2xl bg-white/30 backdrop-blur-sm flex items-center justify-center mx-auto mb-6 shadow-md">
          <Video className="w-10 h-10 text-black" />
        </div>
        <h2 className="text-2xl font-serif font-black text-black mb-2">Próximamente</h2>
        <p className="text-sm text-black/70 max-w-md mx-auto leading-relaxed">
          Estamos trabajando para ofrecerte la mejor experiencia en consultas por video.
          Esta funcionalidad estará disponible muy pronto.
        </p>
      </div>

      {/* Features Grid */}
      <h3 className="text-lg font-serif font-black tracking-tight mb-5">Lo que podrás hacer</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
        <FeatureCard
          icon={<MonitorPlay className="w-5 h-5 text-[#F4C443]" />}
          title="Videoconsultas integradas"
          description="Atendé a tus pacientes en videollamadas HD directamente desde la plataforma, sin necesidad de aplicaciones externas."
        />
        <FeatureCard
          icon={<FileText className="w-5 h-5 text-[#F4C443]" />}
          title="Acceso al expediente"
          description="Consultá el historial clínico del paciente en tiempo real durante la videollamada para una atención más precisa."
        />
        <FeatureCard
          icon={<Shield className="w-5 h-5 text-[#F4C443]" />}
          title="Grabación de sesiones"
          description="Almacená de forma segura cada consulta para consultas futuras, con el consentimiento del paciente."
        />
        <FeatureCard
          icon={<MessageSquare className="w-5 h-5 text-[#F4C443]" />}
          title="Chat en tiempo real"
          description="Comunicate con tu paciente por chat durante o después de la consulta para seguimiento y indicaciones."
        />
      </div>

      {/* Notice */}
      <div className="bg-white border border-gray-100 rounded-2xl p-6 text-center shadow-sm">
        <p className="text-xs text-black/50 leading-relaxed">
          Si tenés preguntas sobre esta funcionalidad, comunicate con{" "}
          <span className="font-bold text-black/70">soporte@ebano.health</span>
        </p>
      </div>
    </div>
  )
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode
  title: string
  description: string
}) {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className="w-10 h-10 rounded-xl bg-[#F4C443]/15 flex items-center justify-center mb-4">
        {icon}
      </div>
      <h4 className="text-sm font-bold text-black mb-1">{title}</h4>
      <p className="text-xs text-black/50 leading-relaxed">{description}</p>
    </div>
  )
}
