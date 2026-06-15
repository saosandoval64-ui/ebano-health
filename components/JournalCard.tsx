"use client"

interface JournalCardProps {
  title: string
  subtitle: string
  variant?: "morning" | "evening"
}

export default function JournalCard({ title, subtitle, variant = "morning" }: JournalCardProps) {
  return (
    <div
      className={`
        min-w-[260px] h-[180px] rounded-3xl p-5 flex flex-col justify-between
        relative overflow-hidden shrink-0
        ${variant === "morning"
          ? "bg-gradient-to-br from-[#F4C443] to-[#F9A825] text-black"
          : "bg-gradient-to-br from-[#D7CCC8] to-[#BCAAA4] text-black"
        }
      `}
    >
      {variant === "morning" && (
        <div className="absolute -bottom-6 -right-6 w-28 h-28 opacity-30">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <circle cx="50" cy="50" r="30" fill="currentColor" />
            <circle cx="50" cy="20" r="4" fill="currentColor" />
            <circle cx="50" cy="80" r="4" fill="currentColor" />
            <circle cx="20" cy="50" r="4" fill="currentColor" />
            <circle cx="80" cy="50" r="4" fill="currentColor" />
          </svg>
        </div>
      )}
      <div>
        <h3 className="font-serif font-black text-lg leading-tight">{title}</h3>
        <p className="text-sm opacity-70 mt-1">{subtitle}</p>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-black/20" />
        <div className="w-2 h-2 rounded-full bg-black/10" />
        <div className="w-2 h-2 rounded-full bg-black/10" />
      </div>
    </div>
  )
}
