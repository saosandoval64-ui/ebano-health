import Logo from "@/components/Logo"

export default function EspecialistasLoading() {
  return (
    <div className="min-h-screen text-black font-sans antialiased">
      {/* Navbar */}
      <header className="w-full max-w-7xl mx-auto px-4 sm:px-8 py-4 sm:py-6 flex items-center justify-between gap-4">
        <Logo size="sm" />
        <div className="hidden md:flex items-center gap-10">
          <div className="h-3 w-16 bg-black/10 rounded-full animate-pulse" />
          <div className="h-3 w-20 bg-black/10 rounded-full animate-pulse" />
        </div>
        <div className="flex items-center gap-3">
          <div className="h-3 w-14 bg-black/10 rounded-full animate-pulse" />
          <div className="h-9 w-20 bg-black/10 rounded-full animate-pulse" />
        </div>
      </header>

      <main className="mx-auto max-w-7xl w-full px-4 sm:px-8 py-8 space-y-8">
        {/* Título */}
        <div className="space-y-2">
          <div className="h-9 w-64 bg-black/10 rounded-2xl animate-pulse" />
          <div className="h-4 w-96 bg-black/8 rounded-full animate-pulse" />
        </div>

        {/* Grid de Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="bg-white/40 border border-white/50 p-6 rounded-[30px] animate-pulse space-y-4"
            >
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-black/10 shrink-0" />
                <div className="space-y-2 flex-1">
                  <div className="h-5 w-3/4 bg-black/10 rounded-full" />
                  <div className="h-3 w-1/2 bg-[#A2B676]/30 rounded-full" />
                </div>
              </div>
              <div className="h-10 w-full bg-black/10 rounded-[18px]" />
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}
