"use client"

import { normalizeAvatar } from "@/app/especialistas/utils"

export default function TestAvatarsPage() {
  const testCases = [
    { name: "Dr. Sofía Rodríguez", avatar: "1" },
    { name: "Dr. Mirian Gonzales", avatar: "/avatars/avatar-4.svg" },
    { name: "Sin avatar", avatar: null },
    { name: "Avatar vacío", avatar: "" },
    { name: "Avatar con extensión", avatar: "avatar-2.svg" },
  ]

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold mb-8">Test de Avatares</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {testCases.map((testCase, index) => {
          const normalized = normalizeAvatar(testCase.avatar)
          
          return (
            <div key={index} className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-4">{testCase.name}</h2>
              
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600">Avatar original:</p>
                  <p className="font-mono bg-gray-50 p-2 rounded">
                    {testCase.avatar || "(null/empty)"}
                  </p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-600">Normalizado:</p>
                  <p className="font-mono bg-gray-50 p-2 rounded">{normalized}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-600">Visualización:</p>
                  <div className="w-32 h-32 mx-auto border border-gray-300 rounded-lg overflow-hidden flex items-center justify-center bg-gray-50">
                    {testCase.avatar ? (
                      <img
                        src={normalized}
                        alt={testCase.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement
                          target.style.display = 'none'
                          const parent = target.parentElement
                          if (parent) {
                            parent.innerHTML = `
                              <div class="w-full h-full flex flex-col items-center justify-center text-gray-400">
                                <div class="text-4xl">❌</div>
                                <div class="text-xs mt-2">Error cargando</div>
                              </div>
                            `
                          }
                        }}
                        onLoad={() => console.log(`✅ Avatar cargado: ${testCase.name}`)}
                      />
                    ) : (
                      <div className="text-gray-400 text-4xl">👤</div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}