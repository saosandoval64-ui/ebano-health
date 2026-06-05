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

  // Optimización de fonts
  experimental: {
    optimizePackageImports: ["@radix-ui/react-icons", "lucide-react"],
  },

  // Compresión
  compress: true,

  // Turbopack configuration (Next.js 16 default)
  turbopack: {},
};

export default nextConfig;
