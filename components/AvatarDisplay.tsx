"use client"

import { useState, useEffect } from 'react'
import { User } from 'lucide-react'
import { normalizeAvatar } from '@/lib/avatar'

interface AvatarDisplayProps {
  avatar?: string | null
  name: string
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

export default function AvatarDisplay({ 
  avatar, 
  name, 
  className = '',
  size = 'md'
}: AvatarDisplayProps) {
  const [imgError, setImgError] = useState(false)
  const [imgLoaded, setImgLoaded] = useState(false)
  const [normalizedAvatar, setNormalizedAvatar] = useState<string>('')

  useEffect(() => {
    if (avatar) {
      const normalized = normalizeAvatar(avatar)
      setNormalizedAvatar(normalized)
      setImgError(false)
      setImgLoaded(false)
    }
  }, [avatar, name])

  const sizeClasses = {
    sm: 'w-12 h-12 rounded-2xl',
    md: 'w-16 h-16 rounded-2xl',
    lg: 'w-24 h-24 rounded-3xl'
  }

  const iconSizes = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  }

  const handleError = () => {
    setImgError(true)
  }

  const handleLoad = () => {
    setImgLoaded(true)
  }

  return (
    <div className={`${sizeClasses[size]} bg-white/70 border border-white flex items-center justify-center overflow-hidden shadow-inner shrink-0 relative ${className}`}>
      {avatar && !imgError ? (
        <>
          <img
            src={normalizedAvatar}
            alt={name}
            className={`w-full h-full object-cover ${!imgLoaded ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
            onError={handleError}
            onLoad={handleLoad}
          />
          {!imgLoaded && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-8 h-8 border-2 border-[#A2B676] border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}
        </>
      ) : (
        <User className={`text-black/20 ${iconSizes[size]}`} />
      )}
    </div>
  )
}