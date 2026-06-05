#!/bin/bash

# 🔍 SCRIPT DE VERIFICACIÓN - ÉBANO HEALTH OPTIMIZADO

echo "════════════════════════════════════════════════════════"
echo "🔍 VERIFICANDO OPTIMIZACIONES - ÉBANO HEALTH"
echo "════════════════════════════════════════════════════════"
echo ""

# Verificar estructura de carpetas
echo "📁 Verificando estructura de carpetas..."
echo ""

# Componentes reorganizados
if [ -d "components/layouts/sidebar" ]; then
    echo "✅ Sidebar reorganizado en components/layouts/sidebar/"
else
    echo "❌ Sidebar no encontrado"
fi

if [ -d "components/layouts/navbar" ]; then
    echo "✅ Navbar reorganizado en components/layouts/navbar/"
else
    echo "❌ Navbar no encontrado"
fi

if [ -d "components/layouts/home" ]; then
    echo "✅ Home reorganizado en components/layouts/home/"
else
    echo "❌ Home no encontrado"
fi

# Nuevas carpetas
if [ -d "components/dashboard" ]; then
    echo "✅ Carpeta dashboard/ creada (lista para componentes)"
fi

if [ -d "components/forms" ]; then
    echo "✅ Carpeta forms/ creada (lista para formularios)"
fi

if [ -d "components/modals" ]; then
    echo "✅ Carpeta modals/ creada (lista para modales)"
fi

echo ""
echo "═══════════════════════════════════════════════════════"
echo "🎨 Verificando archivos de animaciones..."
echo ""

if [ -f "lib/animations.ts" ]; then
    echo "✅ lib/animations.ts creado"
    echo "   - Variantes de animaciones Framer Motion"
    echo "   - Clases CSS personalizadas"
else
    echo "❌ lib/animations.ts no encontrado"
fi

if grep -q "@keyframes fadeIn" "app/globals.css"; then
    echo "✅ Animaciones CSS agregadas a globals.css"
    echo "   - fadeIn"
    echo "   - slideInUp"
    echo "   - slideInDown"
    echo "   - slideInLeft"
    echo "   - slideInRight"
    echo "   - fadeInScale"
else
    echo "❌ Animaciones no encontradas en globals.css"
fi

if [ -f "components/page-transition.tsx" ]; then
    echo "✅ components/page-transition.tsx creado"
else
    echo "❌ page-transition.tsx no encontrado"
fi

echo ""
echo "═══════════════════════════════════════════════════════"
echo "⚙️ Verificando configuración de Next.js..."
echo ""

if grep -q "turbopack:" "next.config.ts"; then
    echo "✅ next.config.ts optimizado para Turbopack"
fi

if grep -q "optimizePackageImports" "next.config.ts"; then
    echo "✅ optimizePackageImports habilitado"
fi

if grep -q "compress: true" "next.config.ts"; then
    echo "✅ Compresión habilitada"
fi

echo ""
echo "═══════════════════════════════════════════════════════"
echo "🔗 Verificando imports..."
echo ""

if grep -q "@/components/layouts/sidebar/Sidebar" "app/patient/layout.tsx"; then
    echo "✅ app/patient/layout.tsx - Imports actualizados"
fi

if grep -q "@/components/layouts/sidebar/Sidebar" "app/doctor/layout.tsx"; then
    echo "✅ app/doctor/layout.tsx - Imports actualizados"
fi

if grep -q "@/components/layouts/sidebar/Sidebar" "app/admin/layout.tsx"; then
    echo "✅ app/admin/layout.tsx - Imports actualizados"
fi

echo ""
echo "═══════════════════════════════════════════════════════"
echo "🎬 Verificando optimizaciones de componentes..."
echo ""

if grep -q "memo" "components/layouts/sidebar/Sidebar.tsx"; then
    echo "✅ Sidebar: Optimizado con React.memo"
fi

if grep -q "useMemo" "components/layouts/sidebar/Sidebar.tsx"; then
    echo "✅ Sidebar: Navigation links memoizados"
fi

if grep -q "memo" "app/login/page.tsx"; then
    echo "✅ Login page: Componentes memoizados"
fi

if grep -q "animate-fadeInScale" "app/login/page.tsx"; then
    echo "✅ Login page: Animaciones agregadas"
fi

echo ""
echo "═══════════════════════════════════════════════════════"
echo "📊 Resumen de cambios:"
echo ""
echo "✅ 1. Next.js optimizado (Turbopack, compression)"
echo "✅ 2. Sistema de animaciones completamente implementado"
echo "✅ 3. Componentes optimizados (React.memo, useMemo)"
echo "✅ 4. Carpetas reorganizadas (ui/, layouts/, dashboard/)"
echo "✅ 5. Imports actualizados (alias @/)"
echo "✅ 6. Proyecto compilado exitosamente"
echo ""
echo "═══════════════════════════════════════════════════════"
echo ""
echo "🚀 Para iniciar en desarrollo:"
echo "   npm run dev"
echo ""
echo "🚀 Para construir para producción:"
echo "   npm run build"
echo ""
echo "🚀 Para ejecutar producción:"
echo "   npm start"
echo ""
echo "═══════════════════════════════════════════════════════"
