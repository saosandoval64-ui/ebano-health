interface QuickActionCardProps {
  title: string
  subtitle: string
  color: "pink" | "blue" | "green" | "yellow"
  tags?: string[]
}

const colorMap = {
  pink: "bg-pink-100 border-pink-200",
  blue: "bg-blue-100 border-blue-200",
  green: "bg-green-100 border-green-200",
  yellow: "bg-[#F4C443]/15 border-[#F4C443]/30",
}

const tagColorMap = {
  pink: "bg-white/80 text-pink-700",
  blue: "bg-white/80 text-blue-700",
  green: "bg-white/80 text-green-700",
  yellow: "bg-white/80 text-black/70",
}

export default function QuickActionCard({ title, subtitle, color, tags = [] }: QuickActionCardProps) {
  return (
    <div className={`min-w-[160px] p-4 rounded-2xl border ${colorMap[color]} flex flex-col gap-2 shrink-0`}>
      <h4 className="font-bold text-sm text-black leading-tight">{title}</h4>
      <p className="text-xs text-black/50 leading-relaxed">{subtitle}</p>
      {tags.length > 0 && (
        <div className="flex gap-1.5 mt-auto pt-1">
          {tags.map((tag) => (
            <span key={tag} className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${tagColorMap[color]}`}>
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}
