import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import AuthProvider from "@/components/AuthProvider";
import PageTransition from "@/components/PageTransition";
import GlobalBottomBar from "@/components/layouts/GlobalBottomBar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Ébano Health",
  description: "Sistema de gestión de turnos",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased scroll-smooth`}>
      <head>
        <link rel="icon" href="/avatars/avatar-4.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/avatars/avatar-4.svg" />
      </head>
      <body className="min-h-full text-foreground bg-white">
        <AuthProvider>
          <PageTransition>{children}</PageTransition>
          <GlobalBottomBar />
        </AuthProvider>
      </body>
    </html>
  );
}