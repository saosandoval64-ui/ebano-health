export default function Hero() {
  return (
    <section className="mt-16 grid items-center gap-10 lg:grid-cols-2">
      
      {/* LEFT SIDE */}
      <div className="max-w-xl">
        
        <h1 className="text-[4.5rem] font-black leading-[0.95] tracking-[-4px] text-[#111111] lg:text-[6rem]">
          Impulsa
          <br />
          tu clínica
          <br />
          hacia el
          <br />
          futuro
        </h1>

        <p className="mt-8 max-w-md text-lg leading-8 text-[#555555]">
          Gestiona citas médicas, pacientes,
          consultas virtuales y pagos desde
          una sola plataforma moderna.
        </p>

        {/* CTA BOX */}
        <div className="mt-10 w-full max-w-md rounded-[35px] bg-[#111111] p-4">
          
          {/* CTA 1 */}
          <div className="flex items-center justify-between rounded-[25px] p-4 transition hover:bg-white/5">
            
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#f5f5f5] text-2xl">
                📅
              </div>

              <div>
                <h3 className="text-lg font-semibold text-white">
                  Prueba Ébano gratis
                </h3>

                <p className="text-sm text-gray-400">
                  14 días sin compromiso.
                </p>
              </div>
            </div>
          </div>

          <div className="my-2 h-px bg-white/10" />

          {/* CTA 2 */}
          <div className="flex items-center justify-between rounded-[25px] p-4 transition hover:bg-white/5">
            
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#f5f5f5] text-2xl">
                🎧
              </div>

              <div>
                <h3 className="text-lg font-semibold text-white">
                  Habla con un experto
                </h3>

                <p className="text-sm text-gray-400">
                  Agenda una demostración.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="relative flex items-center justify-center">
        
        {/* BACKGROUND SHAPE */}
        <div className="absolute bottom-10 right-10 h-[500px] w-[500px] rounded-full bg-[#7be4d8]" />

        {/* MAIN ILLUSTRATION */}
        <div className="relative z-10">
          
          <div className="relative">
            
            {/* HEAD */}
            <div className="absolute left-[180px] top-[40px] z-20 h-24 w-24 rounded-full border-[3px] border-black bg-[#f8f6f1]" />

            {/* BODY */}
            <div className="relative h-[420px] w-[260px] rounded-[140px] border-[3px] border-black bg-[#7be4d8]" />

            {/* ARM */}
            <div className="absolute left-[-30px] top-[150px] h-[70px] w-[220px] rotate-[-20deg] rounded-full border-[3px] border-black bg-[#7be4d8]" />

            {/* LEG 1 */}
            <div className="absolute bottom-[-20px] left-[20px] h-[200px] w-[90px] rotate-[8deg] rounded-full border-[3px] border-black bg-[#f8f6f1]" />

            {/* LEG 2 */}
            <div className="absolute bottom-[-20px] right-[20px] h-[200px] w-[90px] rotate-[-8deg] rounded-full border-[3px] border-black bg-[#f8f6f1]" />

            {/* FLOATING CARDS */}
            <div className="absolute left-[-140px] top-[40px] rounded-[25px] border-[3px] border-black bg-white p-5 shadow-xl">
              <div className="mb-3 h-3 w-24 rounded-full bg-[#7be4d8]" />

              <div className="space-y-2">
                <div className="h-2 w-28 rounded-full bg-gray-200" />
                <div className="h-2 w-20 rounded-full bg-gray-200" />
                <div className="h-2 w-24 rounded-full bg-gray-200" />
              </div>
            </div>

            <div className="absolute right-[-120px] top-[90px] rounded-[25px] border-[3px] border-black bg-white p-5 shadow-xl">
              <div className="mb-3 flex items-center gap-2">
                <div className="h-4 w-4 rounded-full bg-[#7be4d8]" />
                <div className="h-2 w-20 rounded-full bg-gray-200" />
              </div>

              <div className="h-20 w-20 rounded-full border-[3px] border-black bg-[#f8f6f1]" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}