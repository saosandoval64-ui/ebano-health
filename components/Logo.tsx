interface LogoProps {
  size?: "sm" | "md" | "lg"
  subtext?: string
  className?: string
}

const sizes = {
  sm: { text: "text-xl", sub: "text-[9px]" },
  md: { text: "text-2xl", sub: "text-[10px]" },
  lg: { text: "text-3xl", sub: "text-xs" },
}

export default function Logo({ size = "md", subtext, className = "" }: LogoProps) {
  const s = sizes[size]

  return (
    <div className={`flex items-center gap-1 cursor-pointer shrink-0 ${className}`}>
      <span className={`font-serif font-black ${s.text} tracking-tight text-black`}>
        Ébano<span className="text-[#A2B676]">.</span>
      </span>
      {subtext && (
        <span className={`${s.sub} text-gray-400 font-semibold tracking-wider uppercase ml-1.5`}>
          {subtext}
        </span>
      )}
    </div>
  )
}
