"use client"

import { useState } from "react"

function getWeekDays() {
  const now = new Date()
  const dayOfWeek = now.getDay()
  const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek

  const days = []
  const shortNames = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"]

  for (let i = 0; i < 7; i++) {
    const date = new Date(now)
    date.setDate(now.getDate() + mondayOffset + i)
    days.push({
      short: shortNames[i],
      num: date.getDate(),
      isToday:
        date.getDate() === now.getDate() &&
        date.getMonth() === now.getMonth() &&
        date.getFullYear() === now.getFullYear(),
    })
  }
  return days
}

export default function DaySelector() {
  const days = getWeekDays()
  const todayIndex = days.findIndex((d) => d.isToday)
  const [selected, setSelected] = useState(todayIndex >= 0 ? todayIndex : 0)

  return (
    <div className="flex items-center justify-center gap-2 py-4 overflow-x-auto scrollbar-none">
      {days.map((day, i) => (
        <button
          key={`${day.short}-${day.num}`}
          onClick={() => setSelected(i)}
          className={`
            flex flex-col items-center gap-1.5 min-w-[44px] py-2 rounded-2xl transition-all duration-300
            ${selected === i
              ? "bg-[#F4C443] text-black shadow-md shadow-[#F4C443]/20 scale-105"
              : day.isToday
                ? "bg-[#F4C443]/20 text-black font-bold"
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
