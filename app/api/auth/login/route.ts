// DEPRECATED: este endpoint validaba credenciales y emitía una cookie de
// sesión propia sin firmar, verificable/forjable por cualquiera (permitía
// escalar privilegios a ADMIN). El flujo real de login usa exclusivamente
// signIn() de NextAuth (ver components/auth/LoginFormClient.tsx), cuya
// sesión JWT sí está firmada con NEXTAUTH_SECRET. Se mantiene la ruta solo
// para no romper compatibilidad de clientes antiguos, pero ya no crea sesión.
import { NextResponse } from "next/server"

export async function POST() {
  return NextResponse.json(
    {
      success: false,
      message: "Endpoint obsoleto. Usa signIn() de NextAuth para iniciar sesión.",
    },
    { status: 410 }
  )
}
