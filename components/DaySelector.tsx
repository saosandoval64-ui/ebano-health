"use client"

import { useState } from "react"

const DAYS = [
  { short: "Mon", num: 7 },
  { short: "Tue", num: 8 },
  { short: "Wed", num: 9 },
  { short: "Thu", num: 10 },
  { short: "Fri", num: 11 },
  { short: "Sat", num: 12 },
  { short: "Sun", num: 13 },
]

export default function DaySelector() {
  const [selected, setSelected] = useState(3)

  return (
    <div className="flex items-center justify-center gap-2 py-4 overflow-x-auto scrollbar-none">
      {DAYS.map((day, i) => (
        <button
          key={day.short}
          onClick={() => setSelected(i)}
          className={`
            flex flex-col items-center gap-1.5 min-w-[44px] py-2 rounded-2xl transition-all duration-300
            ${selected === i
              ? "bg-[#F4C443] text-black shadow-md shadow-[#F4C443]/20 scale-105"
              : "text-black/50 hover:text-black/70 hover:bg-black/5"
            }
          `}
        >
          <span className="text-[10px] font-bold uppercase tracking-wider">
            {day.short}
          </span>
          <span className={`text-lg font-black ${selected === i ? "text-black" : "text-black/70"}`}>
            {day.num}
          </span>
        </button>
      ))}
    </div>
  )
}
