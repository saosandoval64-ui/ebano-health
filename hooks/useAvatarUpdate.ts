import { useState, useCallback } from "react"

export function useAvatarUpdate() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const updateAvatar = useCallback(async (avatar: string) => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/avatar", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ avatar }),
      })

      const result = await response.json()

      if (!result.success) {
        setError(result.message || "Error al actualizar avatar")
        return false
      }

      return true
    } catch (err) {
      setError("Error de conexión al actualizar avatar")
      return false
    } finally {
      setIsLoading(false)
    }
  }, [])

  return { updateAvatar, isLoading, error }
}
