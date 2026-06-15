"use client"

interface Tab {
  id: string
  label: string
}

interface DashboardTabsProps {
  tabs: Tab[]
  activeTab: string
  onTabChange: (id: string) => void
}

export default function DashboardTabs({ tabs, activeTab, onTabChange }: DashboardTabsProps) {
  return (
    <div className="flex items-center gap-1 overflow-x-auto scrollbar-none py-1">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`
            px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider whitespace-nowrap
            transition-all duration-300
            ${activeTab === tab.id
              ? "bg-black text-[#FDF6CD] shadow-sm"
              : "text-black/40 hover:text-black/60 hover:bg-black/5"
            }
          `}
        >
          {tab.label}
        </button>
      ))}
    </div>
  )
}
