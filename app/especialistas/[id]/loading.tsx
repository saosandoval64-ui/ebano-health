export default function DoctorProfileLoading() {
  return (
    <div className="min-h-screen text-black font-sans p-6 sm:p-8 md:p-16">
      <div className="max-w-5xl mx-auto space-y-8 animate-pulse">
        {/* Back link */}
        <div className="h-3 w-40 bg-black/10 rounded-full" />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left: Doctor profile card */}
          <div className="md:col-span-2 space-y-6">
            <div className="bg-white/40 border border-white/50 p-10 rounded-[40px] space-y-6">
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                <div className="w-24 h-24 rounded-[32px] bg-black/10 shrink-0" />
                <div className="space-y-3 flex-1">
                  <div className="h-3 w-32 bg-black/8 rounded-full" />
                  <div className="h-8 w-64 bg-black/10 rounded-2xl" />
                  <div className="h-3 w-40 bg-[#A2B676]/30 rounded-full" />
                </div>
              </div>
              <div className="bg-white/30 p-6 rounded-[28px] space-y-2">
                <div className="h-3 w-32 bg-black/10 rounded-full" />
                <div className="h-3 w-full bg-black/8 rounded-full" />
                <div className="h-3 w-5/6 bg-black/8 rounded-full" />
                <div className="h-3 w-4/6 bg-black/8 rounded-full" />
              </div>
              <div className="flex items-center gap-3">
                <div className="h-4 w-4 bg-[#A2B676]/40 rounded-full" />
                <div className="h-3 w-48 bg-black/10 rounded-full" />
              </div>
            </div>
          </div>

          {/* Right: Booking section */}
          <div className="bg-black/10 p-8 rounded-[40px] space-y-4">
            <div className="h-6 w-48 bg-black/15 rounded-2xl" />
            <div className="space-y-2">
              <div className="h-3 w-28 bg-black/10 rounded-full" />
              <div className="grid grid-cols-4 gap-2">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="h-14 bg-black/10 rounded-2xl" />
                ))}
              </div>
            </div>
            <div className="h-14 w-full bg-[#A2B676]/30 rounded-[20px] mt-4" />
          </div>
        </div>
      </div>
    </div>
  )
}
