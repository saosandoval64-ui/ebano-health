export default function LoginLoading() {
  return (
    <div className="min-h-screen bg-[#FDF6CD] text-black font-sans antialiased flex flex-col justify-between selection:bg-[#E2CE7D]">
      <div className="w-full max-w-7xl mx-auto px-6 pt-6 flex items-center justify-between">
        <div className="flex items-center gap-2 text-[10px] uppercase font-bold tracking-widest text-black/40">
          <span>Home</span>
          <span>/</span>
          <span className="text-black/70">Login</span>
        </div>
        <div className="h-9 w-9 rounded-full bg-black/5 border border-black/5" />
      </div>

      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-[440px] bg-black/5 p-8 sm:p-10 rounded-[32px] border border-black/10 shadow-sm flex flex-col gap-6 backdrop-blur-sm">
          <div className="text-center space-y-3 animate-pulse">
            <div className="h-7 w-24 bg-black/10 rounded-full mx-auto" />
            <div className="h-5 w-36 bg-black/8 rounded-full mx-auto" />
            <div className="h-8 w-52 bg-black/10 rounded-full mx-auto" />
          </div>
          <div className="space-y-4 animate-pulse">
            <div className="space-y-1.5">
              <div className="h-3 w-32 bg-black/10 rounded-full" />
              <div className="h-11 w-full bg-black/8 rounded-xl" />
            </div>
            <div className="space-y-1.5">
              <div className="h-3 w-24 bg-black/10 rounded-full" />
              <div className="h-11 w-full bg-black/8 rounded-xl" />
            </div>
            <div className="h-11 w-full bg-black/10 rounded-full" />
          </div>
        </div>
      </main>

      <footer className="w-full py-4 text-center text-[11px] text-black/30 font-medium">
        Encriptación de datos de salud
      </footer>
    </div>
  )
}
