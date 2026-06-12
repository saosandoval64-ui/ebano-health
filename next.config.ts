import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Optimizaciones de compilación
  reactStrictMode: true,

  // Optimización de imágenes
  images: {
    formats: ["image/avif", "image/webp"],
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },

  // Optimización de fonts y paquetes
  experimental: {
    optimizePackageImports: ["lucide-react"],
    // Configuración de Server Actions para permitir el túnel en desarrollo
    serverActions: {
      allowedOrigins: (() => {
        if (process.env.NODE_ENV === 'production') {
          // En producción permite solo tu dominio real (cámbialo)
          return ['tudominio.com', 'www.tudominio.com'];
        } else {
          // En desarrollo permite localhost, IP local y el túnel de devtunnels
          return [
            'localhost:3000',
            '192.168.1.3:3000',          // tu IP local actual
            '*.use.devtunnels.ms',       // cualquier túnel de VS Code
            '*.ngrok.io',                // si usas ngrok
          ];
        }
      })(),
    },
  },

  // Compresión
  compress: true,
};

export default nextConfig;
