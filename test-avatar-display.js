// Test para verificar la visualización de avatares
const testAvatars = [
  '1',  // Dr. Sofía Rodríguez
  '/avatars/avatar-4.svg',  // Dr. Mirian Gonzales
  null,
  '',
  'avatar-2.svg',
  'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Y2lyY2xlIGN4PSIxMiIgY3k9IjEyIiByPSIxMCIgZmlsbD0iIzAwMCIvPjwvc3ZnPg=='
];

// Función normalizeAvatar actual
function normalizeAvatar(avatar) {
  console.log("[NORMALIZE_AVATAR] Avatar recibido:", avatar)
  
  if (!avatar || avatar.trim() === "") {
    console.log("[NORMALIZE_AVATAR] Avatar vacío, usando default")
    return "/avatars/avatar-1.svg"
  }
  
  if (avatar.startsWith("data:")) {
    console.log("[NORMALIZE_AVATAR] Es data URL")
    return avatar
  }
  
  if (avatar.startsWith("/avatars/")) {
    console.log("[NORMALIZE_AVATAR] Ya es ruta completa")
    return avatar
  }
  
  if (avatar.includes(".svg")) {
    console.log("[NORMALIZE_AVATAR] Tiene extensión .svg")
    return `/avatars/${avatar}`
  }
  
  // Manejar números como strings (ej: "1", "2", etc.)
  if (/^\d+$/.test(avatar)) {
    console.log("[NORMALIZE_AVATAR] Es número, usando avatar-", avatar)
    return `/avatars/avatar-${avatar}.svg`
  }
  
  console.log("[NORMALIZE_AVATAR] Caso no manejado, usando default")
  return "/avatars/avatar-1.svg"
}

console.log("=== Test de normalización de avatares ===\n");
testAvatars.forEach((avatar, index) => {
  console.log(`Test ${index + 1}: '${avatar}'`);
  const result = normalizeAvatar(avatar);
  console.log(`Resultado: ${result}\n`);
});

// Verificar si los archivos existen
console.log("=== Verificación de archivos de avatar ===");
const fs = require('fs');
const path = require('path');

const avatarFiles = [
  '/avatars/avatar-1.svg',
  '/avatars/avatar-2.svg',
  '/avatars/avatar-3.svg',
  '/avatars/avatar-4.svg'
];

avatarFiles.forEach(file => {
  const publicPath = path.join(__dirname, 'public', file);
  const exists = fs.existsSync(publicPath);
  console.log(`${file}: ${exists ? '✅ Existe' : '❌ No existe'}`);
});