"use client"

export default function RootError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="min-h-screen bg-[#FDF6CD] flex items-center justify-center p-8 font-sans">
      <div className="max-w-md text-center space-y-6">
        <h1 className="text-6xl font-serif font-black text-black">Oops</h1>
        <p className="text-black/60 text-sm">
          Algo salió mal. No te preocupes, puedes intentar de nuevo.
        </p>
        <div className="flex justify-center gap-4">
          <button
            onClick={reset}
            className="px-6 py-3 bg-black text-white text-sm font-bold uppercase tracking-widest rounded-full hover:bg-black/80 transition-all"
          >
            Reintentar
          </button>
          <a
            href="/"
            className="px-6 py-3 border border-black/20 text-black text-sm font-bold uppercase tracking-widest rounded-full hover:bg-black/5 transition-all"
          >
            Volver al inicio
          </a>
        </div>
      </div>
    </div>
  )
}
