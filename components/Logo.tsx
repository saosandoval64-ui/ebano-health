interface LogoProps {
  size?: "sm" | "md" | "lg"
  subtext?: string
  className?: string
}

const sizes = {
  sm: { img: "w-8 h-8", text: "text-xl", sub: "text-[9px]" },
  md: { img: "w-10 h-10", text: "text-2xl", sub: "text-[10px]" },
  lg: { img: "w-12 h-12", text: "text-3xl", sub: "text-xs" },
}

export default function Logo({ size = "md", subtext, className = "" }: LogoProps) {
  const s = sizes[size]

  return (
    <div className={`flex items-center gap-2 cursor-pointer shrink-0 ${className}`}>
      <div className={`${s.img} rounded-xl overflow-hidden shadow-sm`}>
        <img src="/avatars/avatar-4.svg" alt="Ébano Health" className="w-full h-full object-cover" />
      </div>
      <div className="flex flex-col">
        <span className={`font-serif font-black ${s.text} tracking-tight text-black leading-none`}>
          Ébano
        </span>
        <span className="text-[8px] font-bold uppercase tracking-[0.2em] text-black/40 leading-none mt-0.5">
          Health
        </span>
      </div>
      {subtext && (
        <span className={`${s.sub} text-gray-400 font-semibold tracking-wider uppercase ml-1`}>
          {subtext}
        </span>
      )}
    </div>
  )
}
