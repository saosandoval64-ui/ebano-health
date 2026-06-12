// Normalizar avatar para mostrar en especialistas
export function normalizeAvatar(avatar?: string | null): string {
  if (!avatar) return "/avatars/avatar-1.svg"
  if (avatar.startsWith("data:")) return avatar
  if (avatar.startsWith("/avatars/")) return avatar
  if (avatar.includes(".svg")) return `/avatars/${avatar}`
  if (/^\d+$/.test(avatar)) return `/avatars/avatar-${avatar}.svg`
  return "/avatars/avatar-1.svg"
}