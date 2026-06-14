"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { Heart, Loader2 } from "lucide-react"
import { toggleFollowDoctor } from "../../actions/appointments"

interface FollowButtonProps {
  doctorProfileId: string
  initialFollowing: boolean
  isLoggedIn: boolean
}

export default function FollowButton({ doctorProfileId, initialFollowing, isLoggedIn }: FollowButtonProps) {
  const [following, setFollowing] = useState(initialFollowing)
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  const handleClick = () => {
    if (!isLoggedIn) {
      router.push("/login?role=patient")
      return
    }

    startTransition(async () => {
      const result = await toggleFollowDoctor(doctorProfileId)
      if (result.success && result.following !== undefined) {
        setFollowing(result.following)
      }
    })
  }

  return (
    <button
      onClick={handleClick}
      disabled={isPending}
      className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest transition-all active:scale-95 ${
        following
          ? "bg-red-50 border-2 border-red-200 text-red-500 hover:bg-red-100"
          : "bg-black/5 border-2 border-black/10 text-black/60 hover:bg-black/10 hover:text-black"
      }`}
    >
      {isPending ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Heart className={`h-4 w-4 ${following ? "fill-red-500 text-red-500" : ""}`} />
      )}
      {following ? "Siguiendo" : "Seguir Médico"}
    </button>
  )
}
