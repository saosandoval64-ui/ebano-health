// Función normalizeAvatar desde utils.ts
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

// Test con los valores de la base de datos
console.log("=== Test 1: Dr. Sofía Rodríguez (avatar='1') ===");
const result1 = normalizeAvatar('1');
console.log("Resultado:", result1);

console.log("\n=== Test 2: Dr. Mirian Gonzales (avatar='/avatars/avatar-4.svg') ===");
const result2 = normalizeAvatar('/avatars/avatar-4.svg');
console.log("Resultado:", result2);

console.log("\n=== Test 3: Avatar vacío ===");
const result3 = normalizeAvatar('');
console.log("Resultado:", result3);

console.log("\n=== Test 4: Avatar null ===");
const result4 = normalizeAvatar(null);
console.log("Resultado:", result4);