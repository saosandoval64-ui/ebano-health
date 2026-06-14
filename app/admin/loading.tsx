export default function AdminLoading() {
  return (
    <div className="min-h-screen font-sans flex flex-col md:flex-row">
      <div className="hidden md:flex w-[260px] h-screen bg-black/5 border-r border-black/10 flex-col justify-between py-6 px-4 shrink-0 animate-pulse">
        <div className="space-y-8">
          <div className="pl-3 pt-2 space-y-2">
            <div className="h-7 w-24 bg-black/10 rounded-full" />
            <div className="h-3 w-16 bg-[#A2B676]/30 rounded-full" />
          </div>
          <div className="space-y-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-11 w-full bg-black/5 rounded-2xl" />
            ))}
          </div>
        </div>
        <div className="space-y-3 border-t border-black/10 pt-4">
          <div className="h-11 w-full bg-red-100/60 rounded-2xl" />
        </div>
      </div>

      <main className="flex-1 p-6 sm:p-8 md:p-12 space-y-8 animate-pulse">
        <div className="space-y-1">
          <div className="h-8 w-64 bg-black/10 rounded-2xl" />
          <div className="h-4 w-80 bg-black/8 rounded-full" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-[#A2B676]/10 border border-[#A2B676]/20 h-[180px] rounded-[32px]" />
          <div className="bg-black/5 border border-black/10 h-[180px] rounded-[32px]" />
          <div className="bg-black/5 border border-black/10 h-[180px] rounded-[32px]" />
        </div>
        <div className="space-y-3">
          <div className="h-7 w-48 bg-black/10 rounded-xl" />
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-20 w-full bg-white/40 border border-white/50 rounded-[24px]" />
          ))}
        </div>
      </main>
    </div>
  )
}
