export function normalizeAvatar(avatar?: string | null): string {
  if (!avatar || avatar.trim() === "") {
    return "/avatars/avatar-1.svg"
  }
  if (avatar.startsWith("data:")) {
    return avatar
  }
  if (avatar.startsWith("/avatars/")) {
    return avatar
  }
  if (avatar.startsWith("avatars/")) {
    return `/${avatar}`
  }
  if (avatar.includes(".svg")) {
    return `/avatars/${avatar}`
  }
  if (/^\d+$/.test(avatar)) {
    return `/avatars/avatar-${avatar}.svg`
  }
  if (avatar.includes("/")) {
    return `/${avatar}`
  }
  return "/avatars/avatar-1.svg"
}
